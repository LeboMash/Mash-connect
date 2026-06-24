from datetime import datetime

from database import db


class Quote(db.Model):
    __tablename__ = "quotes"

    id = db.Column(db.Integer, primary_key=True)
    rfq_id = db.Column(db.Integer, db.ForeignKey("rfqs.id"), nullable=False)
    artisan_name = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(40), nullable=False, default="Submitted")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    rfq = db.relationship("RFQ", back_populates="quotes")

    def to_dict(self):
        payload = {
            "id": self.id,
            "rfq_id": self.rfq_id,
            "artisan_name": self.artisan_name,
            "amount": self.amount,
            "message": self.message,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }

        if self.rfq:
            payload["rfq"] = {
                "id": self.rfq.id,
                "client_name": self.rfq.client_name,
                "trade": self.rfq.trade,
                "priority": self.rfq.priority,
                "status": self.rfq.status,
                "location": self.rfq.location,
            }

        return payload
