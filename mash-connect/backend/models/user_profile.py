from datetime import datetime

from database import db


class UserProfile(db.Model):
    __tablename__ = "user_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    role = db.Column(db.String(40), nullable=False)
    profile_data = db.Column(db.JSON, nullable=False, default=dict)
    google_verified = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    user = db.relationship("User", back_populates="profile")

    def verification_badges(self):
        badges = []
        data = self.profile_data or {}

        if self.google_verified:
            badges.append("Google Verified")
        if data.get("profile_picture") or data.get("google_picture"):
            badges.append("Photo Added")
        if data.get("qualification") or data.get("qualification_level"):
            badges.append("Qualification Added")
        if data.get("institution"):
            badges.append("Institution Linked")
        if self.role in {"artisan", "apprentice"} and (
            data.get("trade") or data.get("trade_interest")
        ):
            badges.append("Trade Profile")
        if self.role == "employer" and data.get("company"):
            badges.append("Company Profile")

        return badges

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "role": self.role,
            "profile_data": self.profile_data,
            "google_verified": self.google_verified,
            "verification_badges": self.verification_badges(),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
