from flask import Blueprint, jsonify, request

from database import db
from models import Notification, Review

engagement_bp = Blueprint("engagement", __name__)


@engagement_bp.get("/notifications")
def get_notifications():
    audience = request.args.get("audience")
    query = Notification.query

    if audience:
        query = query.filter(Notification.audience.in_([audience.strip().lower(), "all"]))

    notifications = query.order_by(Notification.created_at.desc()).limit(50).all()
    return jsonify([notification.to_dict() for notification in notifications])


@engagement_bp.patch("/notifications/<int:notification_id>/read")
def mark_notification_read(notification_id):
    notification = Notification.query.get_or_404(notification_id)
    notification.read = True
    db.session.commit()
    return jsonify({"message": "Notification marked as read", "notification": notification.to_dict()})


@engagement_bp.post("/reviews")
def create_review():
    data = request.get_json(silent=True) or {}
    required_fields = ["reviewer_name", "artisan_name", "rating", "comment"]
    missing = [field for field in required_fields if data.get(field) in (None, "")]

    if missing:
        return jsonify({"message": "Missing required fields", "fields": missing}), 400

    try:
        rating = int(data["rating"])
    except (TypeError, ValueError):
        return jsonify({"message": "Rating must be a number"}), 400

    if rating < 1 or rating > 5:
        return jsonify({"message": "Rating must be between 1 and 5"}), 400

    review = Review(
        rfq_id=data.get("rfq_id"),
        quote_id=data.get("quote_id"),
        reviewer_name=data["reviewer_name"].strip(),
        artisan_name=data["artisan_name"].strip(),
        rating=rating,
        comment=data["comment"].strip(),
    )

    db.session.add(review)
    db.session.add(
        Notification(
            audience="artisan",
            title="New review received",
            message=f"{review.reviewer_name} rated {review.artisan_name} {review.rating}/5.",
            rfq_id=review.rfq_id,
            quote_id=review.quote_id,
        )
    )
    db.session.commit()

    return jsonify({"message": "Review submitted", "review": review.to_dict()}), 201


@engagement_bp.get("/reviews")
def get_reviews():
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    return jsonify([review.to_dict() for review in reviews])
