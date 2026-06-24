import { Clock3, Image, MapPin, MessageSquareQuote } from "lucide-react";
import { API_BASE_URL } from "../api/client.js";

function RequestCard({ rfq }) {
  const imageUrl = rfq.image
    ? `${API_BASE_URL}/uploads/${rfq.image}`
    : "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80";

  return (
    <article className="request-card">
      <img src={imageUrl} alt={`${rfq.trade} service request`} />
      <div className="request-body">
        <div className="request-heading">
          <div>
            <span className="eyebrow">{rfq.trade}</span>
            <h3>{rfq.client_name}</h3>
          </div>
          <div className="request-status-stack">
            <span className={`status-pill ${rfq.priority?.toLowerCase()}`}>
              {rfq.priority}
            </span>
            <span className="quote-status">{rfq.status}</span>
          </div>
        </div>
        <p>{rfq.description}</p>
        {rfq.accepted_quote ? (
          <div className="accepted-quote-banner">
            Accepted: {rfq.accepted_quote.artisan_name} - R{" "}
            {Number(rfq.accepted_quote.amount).toLocaleString()}
          </div>
        ) : null}
        <div className="meta-row">
          <span>
            <Clock3 size={15} />
            {new Date(rfq.created_at).toLocaleDateString()}
          </span>
          <span>
            <MapPin size={15} />
            {rfq.location || "Location pending"}
          </span>
          <span>
            <MessageSquareQuote size={15} />
            {rfq.quote_count || 0} quotes
          </span>
          {rfq.image ? (
            <span>
              <Image size={15} />
              Photo attached
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default RequestCard;
