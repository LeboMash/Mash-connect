from flask import Blueprint, jsonify, request

from database import db
from models import Artisan, User, UserProfile

users_bp = Blueprint("users", __name__)


@users_bp.get("/users")
def get_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([user.to_dict() for user in users])


@users_bp.get("/profiles")
def get_profiles():
    role = request.args.get("role")
    query = UserProfile.query

    if role:
        query = query.filter_by(role=role.strip().lower())

    profiles = query.order_by(UserProfile.created_at.desc()).all()
    return jsonify(
        [
            {
                **profile.to_dict(),
                "user": profile.user.to_dict() if profile.user else None,
            }
            for profile in profiles
        ]
    )


@users_bp.post("/artisans")
def create_artisan():
    data = request.get_json(silent=True) or {}
    required_fields = ["full_name", "trade"]
    missing = [field for field in required_fields if not data.get(field)]

    if missing:
        return jsonify({"message": "Missing required fields", "fields": missing}), 400

    artisan = Artisan(
        full_name=data["full_name"].strip(),
        trade=data["trade"].strip(),
        experience=int(data.get("experience") or 0),
        qualification=(data.get("qualification") or "").strip() or None,
        rating=float(data.get("rating") or 0),
        location=(data.get("location") or "").strip() or None,
        verified=bool(data.get("verified", False)),
    )

    db.session.add(artisan)
    db.session.commit()

    return jsonify({"message": "Artisan profile created", "artisan": artisan.to_dict()}), 201


@users_bp.get("/artisans")
def get_artisans():
    artisans = Artisan.query.order_by(Artisan.rating.desc()).all()
    return jsonify([artisan.to_dict() for artisan in artisans])
