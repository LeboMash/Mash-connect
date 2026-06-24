from flask import Blueprint, jsonify, request

from database import db
from models import Notification, Quote, RFQ

quotes_bp = Blueprint("quotes", __name__)


@quotes_bp.post("/submit-quote")
def submit_quote():
    data = request.get_json(silent=True) or {}
    required_fields = ["rfq_id", "artisan_name", "amount", "message"]
    missing = [field for field in required_fields if data.get(field) in (None, "")]

    if missing:
        return jsonify({"message": "Missing required fields", "fields": missing}), 400

    rfq = RFQ.query.get(data["rfq_id"])
    if not rfq:
        return jsonify({"message": "RFQ not found"}), 404

    if rfq.status in {"Accepted", "Artisan Assigned", "In Progress", "Completed", "Cancelled"}:
        return jsonify({"message": "This RFQ is no longer open for quotes"}), 409

    try:
        amount = float(data["amount"])
    except (TypeError, ValueError):
        return jsonify({"message": "Quote amount must be a number"}), 400

    quote = Quote(
        rfq_id=rfq.id,
        artisan_name=data["artisan_name"].strip(),
        amount=amount,
        message=data["message"].strip(),
    )
    rfq.status = "Quotes Received"

    db.session.add(quote)
    db.session.flush()
    db.session.add(
        Notification(
            audience="client",
            title="New quote received",
            message=f"{quote.artisan_name} quoted R {quote.amount:,.2f} for RFQ #{rfq.id}.",
            rfq_id=rfq.id,
            quote_id=quote.id,
        )
    )
    db.session.commit()

    return jsonify({"message": "Quote submitted successfully", "quote": quote.to_dict()}), 201


@quotes_bp.get("/quotes")
def get_quotes():
    quotes = Quote.query.order_by(Quote.created_at.desc()).all()
    return jsonify([quote.to_dict() for quote in quotes])


@quotes_bp.get("/rfqs/<int:rfq_id>/quotes")
def get_quotes_for_rfq(rfq_id):
    RFQ.query.get_or_404(rfq_id)
    quotes = Quote.query.filter_by(rfq_id=rfq_id).order_by(Quote.created_at.desc()).all()
    return jsonify([quote.to_dict() for quote in quotes])


@quotes_bp.patch("/quotes/<int:quote_id>/accept")
def accept_quote(quote_id):
    quote = Quote.query.get_or_404(quote_id)
    rfq = quote.rfq

    if rfq.status in {"Accepted", "Artisan Assigned", "In Progress", "Completed", "Cancelled"}:
        return jsonify({"message": f"Cannot accept a quote for a {rfq.status.lower()} RFQ"}), 409

    for sibling_quote in rfq.quotes:
        sibling_quote.status = "Declined"

    quote.status = "Accepted"
    rfq.status = "Artisan Assigned"
    db.session.add(
        Notification(
            audience="artisan",
            title="Quote accepted",
            message=f"{quote.artisan_name}'s quote for RFQ #{rfq.id} was accepted.",
            rfq_id=rfq.id,
            quote_id=quote.id,
        )
    )
    db.session.add(
        Notification(
            audience="client",
            title="Artisan assigned",
            message=f"{quote.artisan_name} has been assigned to your {rfq.trade} RFQ.",
            rfq_id=rfq.id,
            quote_id=quote.id,
        )
    )
    db.session.commit()

    return jsonify(
        {
            "message": "Quote accepted",
            "quote": quote.to_dict(),
            "rfq": rfq.to_dict(include_quotes=True),
        }
    )


@quotes_bp.patch("/quotes/<int:quote_id>/decline")
def decline_quote(quote_id):
    quote = Quote.query.get_or_404(quote_id)

    if quote.status == "Accepted":
        return jsonify({"message": "Accepted quotes cannot be declined"}), 409

    quote.status = "Declined"
    db.session.commit()

    return jsonify({"message": "Quote declined", "quote": quote.to_dict()})
