import os
from uuid import uuid4

from flask import Blueprint, current_app, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename

from database import db
from models import Notification, RFQ

rfq_bp = Blueprint("rfq", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
RFQ_STATUSES = {
    "Submitted",
    "Reviewing",
    "Quotes Received",
    "Artisan Assigned",
    "In Progress",
    "Completed",
    "Cancelled",
}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_uploaded_image(image_file):
    if not image_file or not image_file.filename:
        return None

    if not allowed_file(image_file.filename):
        raise ValueError("Only PNG, JPG, JPEG, and WEBP images are allowed")

    filename = secure_filename(image_file.filename)
    extension = filename.rsplit(".", 1)[1].lower()
    unique_name = f"{uuid4().hex}.{extension}"
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)
    image_file.save(os.path.join(upload_folder, unique_name))
    return unique_name


@rfq_bp.get("/health")
def health():
    return jsonify({"message": "Mash Connect Backend Running Successfully"})


@rfq_bp.post("/create-rfq")
def create_rfq():
    try:
        image_name = save_uploaded_image(request.files.get("image"))
    except ValueError as error:
        return jsonify({"message": str(error)}), 400

    payload = request.form
    required_fields = ["client_name", "trade", "description", "priority"]
    missing = [field for field in required_fields if not payload.get(field)]

    if missing:
        return jsonify({"message": "Missing required fields", "fields": missing}), 400

    new_rfq = RFQ(
        client_name=payload["client_name"].strip(),
        trade=payload["trade"].strip(),
        description=payload["description"].strip(),
        priority=payload["priority"].strip(),
        status="Submitted",
        location=(payload.get("location") or "").strip() or None,
        image=image_name,
    )

    db.session.add(new_rfq)
    db.session.flush()
    db.session.add(
        Notification(
            audience="artisan",
            title="New RFQ submitted",
            message=f"{new_rfq.trade} request from {new_rfq.client_name} is ready for review.",
            rfq_id=new_rfq.id,
        )
    )
    db.session.commit()

    return jsonify({"message": "RFQ submitted successfully", "rfq": new_rfq.to_dict()}), 201


@rfq_bp.get("/rfqs")
def get_rfqs():
    rfqs = RFQ.query.order_by(RFQ.created_at.desc()).all()
    return jsonify([rfq.to_dict(include_quotes=True) for rfq in rfqs])


@rfq_bp.get("/rfqs/<int:rfq_id>")
def get_rfq(rfq_id):
    rfq = RFQ.query.get_or_404(rfq_id)
    return jsonify(rfq.to_dict(include_quotes=True))


@rfq_bp.patch("/rfqs/<int:rfq_id>/status")
def update_rfq_status(rfq_id):
    rfq = RFQ.query.get_or_404(rfq_id)
    data = request.get_json(silent=True) or {}
    status = data.get("status")

    if status not in RFQ_STATUSES:
        return jsonify({"message": "Invalid status"}), 400

    rfq.status = status
    db.session.add(
        Notification(
            audience="client",
            title="RFQ status updated",
            message=f"Your {rfq.trade} RFQ is now {status}.",
            rfq_id=rfq.id,
        )
    )
    db.session.commit()
    return jsonify({"message": "RFQ status updated", "rfq": rfq.to_dict(include_quotes=True)})


@rfq_bp.get("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(current_app.config["UPLOAD_FOLDER"], filename)
