from datetime import datetime

from database import db


class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    audience = db.Column(db.String(40), nullable=False, default="all")
    title = db.Column(db.String(140), nullable=False)
    message = db.Column(db.Text, nullable=False)
    rfq_id = db.Column(db.Integer, nullable=True)
    quote_id = db.Column(db.Integer, nullable=True)
    read = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "audience": self.audience,
            "title": self.title,
            "message": self.message,
            "rfq_id": self.rfq_id,
            "quote_id": self.quote_id,
            "read": self.read,
            "created_at": self.created_at.isoformat(),
        }
