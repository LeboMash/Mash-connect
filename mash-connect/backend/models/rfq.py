from datetime import datetime

from database import db


class RFQ(db.Model):
    __tablename__ = "rfqs"

    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(120), nullable=False)
    trade = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(50), nullable=False, default="Low")
    status = db.Column(db.String(50), nullable=False, default="Submitted")
    image = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    client_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    client = db.relationship("User", back_populates="rfqs")
    quotes = db.relationship(
        "Quote",
        back_populates="rfq",
        cascade="all, delete-orphan",
        lazy=True,
    )

    def to_dict(self, include_quotes=False):
        accepted_quote = next(
            (quote for quote in self.quotes if quote.status == "Accepted"),
            None,
        )
        payload = {
            "id": self.id,
            "client_name": self.client_name,
            "trade": self.trade,
            "description": self.description,
            "priority": self.priority,
            "status": self.status,
            "image": self.image,
            "location": self.location,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "quote_count": len(self.quotes),
            "accepted_quote": accepted_quote.to_dict() if accepted_quote else None,
        }

        if include_quotes:
            payload["quotes"] = [quote.to_dict() for quote in self.quotes]

        return payload
