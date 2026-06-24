from database import db


class Artisan(db.Model):
    __tablename__ = "artisans"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    trade = db.Column(db.String(100), nullable=False)
    experience = db.Column(db.Integer, nullable=False, default=0)
    qualification = db.Column(db.String(200), nullable=True)
    rating = db.Column(db.Float, nullable=False, default=0)
    location = db.Column(db.String(200), nullable=True)
    verified = db.Column(db.Boolean, nullable=False, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "trade": self.trade,
            "experience": self.experience,
            "qualification": self.qualification,
            "rating": self.rating,
            "location": self.location,
            "verified": self.verified,
        }
