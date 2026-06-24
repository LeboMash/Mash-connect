import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BadgeDollarSign, CheckCircle2, Send, Star, XCircle } from "lucide-react";
import api from "../api/client.js";

const initialQuote = {
  rfq_id: "",
  artisan_name: "",
  amount: "",
  message: "",
};

const initialReview = {
  quote_id: "",
  reviewer_name: "",
  rating: "5",
  comment: "",
};

function Quotes() {
  const [rfqs, setRfqs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(initialQuote);
  const [reviewForm, setReviewForm] = useState(initialReview);

  const loadData = async () => {
    const [rfqResponse, quoteResponse, reviewResponse] = await Promise.all([
      api.get("/rfqs"),
      api.get("/quotes"),
      api.get("/reviews"),
    ]);
    setRfqs(rfqResponse.data);
    setQuotes(quoteResponse.data);
    setReviews(reviewResponse.data);
  };

  useEffect(() => {
    loadData().catch(() => {
      setRfqs([]);
      setQuotes([]);
      setReviews([]);
    });
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitQuote = async (event) => {
    event.preventDefault();
    try {
      await api.post("/submit-quote", {
        ...form,
        rfq_id: Number(form.rfq_id),
        amount: Number(form.amount),
      });
      toast.success("Quote received successfully");
      setForm(initialQuote);
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Quote submission failed");
    }
  };

  const updateQuoteStatus = async (quoteId, action) => {
    try {
      const response = await api.patch(`/quotes/${quoteId}/${action}`);
      toast.success(response.data.message);
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update quote");
    }
  };

  const updateReviewField = (field, value) => {
    setReviewForm((current) => ({ ...current, [field]: value }));
  };

  const submitReview = async (event) => {
    event.preventDefault();
    const quote = quotes.find((item) => item.id === Number(reviewForm.quote_id));

    if (!quote) {
      toast.error("Select an accepted quote to review");
      return;
    }

    try {
      await api.post("/reviews", {
        quote_id: quote.id,
        rfq_id: quote.rfq_id,
        reviewer_name: reviewForm.reviewer_name,
        artisan_name: quote.artisan_name,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      toast.success("Review submitted");
      setReviewForm(initialReview);
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Review submission failed");
    }
  };

  const acceptedQuotes = quotes.filter((quote) => quote.status === "Accepted");

  return (
    <section className="page-wrap">
      <div className="section-heading">
        <span className="eyebrow">Quote & bidding system</span>
        <h1>Submit and compare artisan quotes</h1>
      </div>

      <div className="two-column">
        <div className="stacked-panels">
          <form className="form-panel" onSubmit={submitQuote}>
            <label>
              RFQ
              <select
                value={form.rfq_id}
                onChange={(event) => updateField("rfq_id", event.target.value)}
              >
                <option value="">Select RFQ</option>
                {rfqs.map((rfq) => (
                  <option key={rfq.id} value={rfq.id}>
                    #{rfq.id} - {rfq.trade} for {rfq.client_name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Artisan name
              <input
                value={form.artisan_name}
                onChange={(event) => updateField("artisan_name", event.target.value)}
                placeholder="Technician or company"
              />
            </label>

            <label>
              Estimated price
              <input
                type="number"
                min="0"
                value={form.amount}
                onChange={(event) => updateField("amount", event.target.value)}
                placeholder="0.00"
              />
            </label>

            <label>
              Message to client
              <textarea
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Scope, availability, parts, and assumptions"
              />
            </label>

            <button className="primary-button submit-button">
              <Send size={18} />
              Submit Quote
            </button>
          </form>

          <form className="form-panel" onSubmit={submitReview}>
            <div>
              <span className="eyebrow">Completion review</span>
              <h2>Rate accepted work</h2>
            </div>
            <label>
              Accepted quote
              <select
                value={reviewForm.quote_id}
                onChange={(event) => updateReviewField("quote_id", event.target.value)}
              >
                <option value="">Select accepted quote</option>
                {acceptedQuotes.map((quote) => (
                  <option key={quote.id} value={quote.id}>
                    #{quote.id} - {quote.artisan_name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Reviewer name
              <input
                value={reviewForm.reviewer_name}
                onChange={(event) => updateReviewField("reviewer_name", event.target.value)}
              />
            </label>
            <label>
              Rating
              <select
                value={reviewForm.rating}
                onChange={(event) => updateReviewField("rating", event.target.value)}
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} stars
                  </option>
                ))}
              </select>
            </label>
            <label>
              Review
              <textarea
                value={reviewForm.comment}
                onChange={(event) => updateReviewField("comment", event.target.value)}
                placeholder="Quality, timing, communication, and final result"
              />
            </label>
            <button className="secondary-button submit-button">
              <Star size={18} />
              Submit Review
            </button>
          </form>
        </div>

        <div className="quote-list">
          {quotes.map((quote) => (
            <article key={quote.id} className="quote-card">
              <span className="stat-icon">
                <BadgeDollarSign size={20} />
              </span>
              <div>
                <div className="quote-heading">
                  <strong>{quote.artisan_name}</strong>
                  <span className={`quote-status ${quote.status.toLowerCase()}`}>
                    {quote.status}
                  </span>
                </div>
                <p>{quote.message}</p>
                <span>
                  RFQ #{quote.rfq_id}
                  {quote.rfq?.trade ? ` - ${quote.rfq.trade}` : ""}
                </span>
              </div>
              <div className="quote-actions">
                <strong className="quote-amount">
                  R {Number(quote.amount).toLocaleString()}
                </strong>
                <div>
                  <button
                    type="button"
                    className="icon-action accept"
                    onClick={() => updateQuoteStatus(quote.id, "accept")}
                    disabled={quote.status === "Accepted"}
                    aria-label="Accept quote"
                    title="Accept quote"
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <button
                    type="button"
                    className="icon-action decline"
                    onClick={() => updateQuoteStatus(quote.id, "decline")}
                    disabled={quote.status !== "Submitted"}
                    aria-label="Decline quote"
                    title="Decline quote"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
          {!quotes.length ? <div className="empty-state">No quotes submitted yet.</div> : null}
          {reviews.length ? (
            <div className="review-list">
              <div className="split-heading">
                <h2>Recent reviews</h2>
                <span>{reviews.length} reviews</span>
              </div>
              {reviews.slice(0, 4).map((review) => (
                <article key={review.id} className="review-card">
                  <span className="stat-icon">
                    <Star size={18} />
                  </span>
                  <div>
                    <strong>{review.artisan_name}</strong>
                    <p>{review.comment}</p>
                    <span>
                      {review.rating}/5 by {review.reviewer_name}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default Quotes;
