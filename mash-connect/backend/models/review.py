from datetime import datetime

from database import db


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    rfq_id = db.Column(db.Integer, nullable=True)
    quote_id = db.Column(db.Integer, nullable=True)
    reviewer_name = db.Column(db.String(120), nullable=False)
    artisan_name = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "rfq_id": self.rfq_id,
            "quote_id": self.quote_id,
            "reviewer_name": self.reviewer_name,
            "artisan_name": self.artisan_name,
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat(),
        }
