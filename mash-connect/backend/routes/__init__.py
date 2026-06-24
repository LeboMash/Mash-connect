from .auth import auth_bp
from .engagement import engagement_bp
from .quotes import quotes_bp
from .rfq import rfq_bp
from .users import users_bp


def register_routes(app):
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(rfq_bp, url_prefix="/api")
    app.register_blueprint(quotes_bp, url_prefix="/api")
    app.register_blueprint(users_bp, url_prefix="/api")
    app.register_blueprint(engagement_bp, url_prefix="/api")
