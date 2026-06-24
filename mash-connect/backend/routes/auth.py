import json
import os
import secrets
from uuid import uuid4

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import create_access_token
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from werkzeug.utils import secure_filename

from database import db
from models import User, UserProfile

auth_bp = Blueprint("auth", __name__)

VALID_ROLES = {"client", "artisan", "apprentice", "employer"}
ALLOWED_PROFILE_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}


def normalize_role(role):
    normalized = (role or "client").strip().lower()
    return normalized if normalized in VALID_ROLES else "client"


def create_profile(user, profile_data=None, google_verified=False):
    profile = UserProfile(
        user=user,
        role=user.role,
        profile_data=profile_data or {},
        google_verified=google_verified,
    )
    db.session.add(profile)
    return profile


def issue_token(user):
    return create_access_token(identity=str(user.id), additional_claims={"role": user.role})


def parse_registration_payload():
    if request.content_type and request.content_type.startswith("multipart/form-data"):
        profile = request.form.get("profile") or "{}"
        try:
            profile_data = json.loads(profile)
        except json.JSONDecodeError:
            profile_data = {}

        return {
            "full_name": request.form.get("full_name"),
            "email": request.form.get("email"),
            "password": request.form.get("password"),
            "role": request.form.get("role"),
            "profile": profile_data,
        }

    return request.get_json(silent=True) or {}


def save_profile_picture(image_file):
    if not image_file or not image_file.filename:
        return None

    filename = secure_filename(image_file.filename)
    if "." not in filename:
        raise ValueError("Profile picture must be a PNG, JPG, JPEG, or WEBP image")

    extension = filename.rsplit(".", 1)[1].lower()
    if extension not in ALLOWED_PROFILE_IMAGE_EXTENSIONS:
        raise ValueError("Profile picture must be a PNG, JPG, JPEG, or WEBP image")

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)
    unique_name = f"profile-{uuid4().hex}.{extension}"
    image_file.save(os.path.join(upload_folder, unique_name))
    return unique_name


@auth_bp.post("/register")
def register():
    data = parse_registration_payload()
    required_fields = ["full_name", "email", "password"]
    missing = [field for field in required_fields if not data.get(field)]

    if missing:
        return jsonify({"message": "Missing required fields", "fields": missing}), 400

    email = data["email"].strip().lower()
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 409

    profile_data = data.get("profile") or {}
    try:
        profile_picture = save_profile_picture(request.files.get("profile_picture"))
    except ValueError as error:
        return jsonify({"message": str(error)}), 400

    if profile_picture:
        profile_data["profile_picture"] = profile_picture

    user = User(
        full_name=data["full_name"].strip(),
        email=email,
        role=normalize_role(data.get("role")),
    )
    user.set_password(data["password"])

    db.session.add(user)
    create_profile(user, profile_data, google_verified=False)
    db.session.commit()

    token = issue_token(user)
    return jsonify({"message": "Account created", "token": token, "user": user.to_dict()}), 201


@auth_bp.post("/google")
def google_register_or_login():
    data = request.get_json(silent=True) or {}
    credential = data.get("credential")
    client_id = os.getenv("GOOGLE_CLIENT_ID")

    if not client_id:
        return jsonify({"message": "Google verification is not configured on the server"}), 503

    if not credential:
        return jsonify({"message": "Missing Google credential"}), 400

    try:
        google_user = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            client_id,
        )
    except ValueError:
        return jsonify({"message": "Google verification failed"}), 401

    email = (google_user.get("email") or "").strip().lower()
    if not email or not google_user.get("email_verified"):
        return jsonify({"message": "Google account email is not verified"}), 401

    role = normalize_role(data.get("role"))
    profile_data = data.get("profile") or {}
    if google_user.get("picture"):
        profile_data["google_picture"] = google_user["picture"]
    user = User.query.filter_by(email=email).first()

    if user:
        user.full_name = user.full_name or google_user.get("name") or email
        user.role = role
        if user.profile:
            user.profile.role = role
            user.profile.profile_data = profile_data
            user.profile.google_verified = True
        else:
            create_profile(user, profile_data, google_verified=True)
        message = "Google login successful"
    else:
        user = User(
            full_name=google_user.get("name") or email,
            email=email,
            role=role,
        )
        user.set_password(secrets.token_urlsafe(32))
        db.session.add(user)
        create_profile(user, profile_data, google_verified=True)
        message = "Google verified account created"

    db.session.commit()
    token = issue_token(user)
    return jsonify({"message": message, "token": token, "user": user.to_dict()})


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401

    token = issue_token(user)
    return jsonify({"message": "Login successful", "token": token, "user": user.to_dict()})
