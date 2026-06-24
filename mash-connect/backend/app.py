import os
from datetime import timedelta

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from database import db
from routes import register_routes


def create_app():
    app = Flask(__name__)

    base_dir = os.path.abspath(os.path.dirname(__file__))
    upload_folder = os.path.join(base_dir, "uploads")

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(base_dir, 'mashconnect.db')}",
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["UPLOAD_FOLDER"] = upload_folder
    app.config["MAX_CONTENT_LENGTH"] = 8 * 1024 * 1024
    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY",
        "dev-change-this-secret-before-production-32-bytes",
    )
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)

    CORS(app, resources={r"/api/*": {"origins": os.getenv("FRONTEND_URL", "*")}})
    db.init_app(app)
    JWTManager(app)
    register_routes(app)

    @app.route("/")
    def home():
        return {"message": "Mash Connect Backend Running Successfully"}

    with app.app_context():
        os.makedirs(upload_folder, exist_ok=True)
        db.create_all()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host=os.getenv("FLASK_RUN_HOST", "0.0.0.0"), port=5000, debug=True)
