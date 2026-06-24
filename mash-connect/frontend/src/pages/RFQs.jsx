import { useEffect, useState } from "react";
import api from "../api/client.js";
import RequestCard from "../components/RequestCard.jsx";

function RFQs() {
  const [rfqs, setRfqs] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.get("/rfqs").then((response) => setRfqs(response.data)).catch(() => setRfqs([]));
  }, []);

  const visibleRfqs =
    filter === "All" ? rfqs : rfqs.filter((rfq) => rfq.priority === filter);

  return (
    <section className="page-wrap">
      <div className="section-heading">
        <span className="eyebrow">RFQ operations</span>
        <h1>All service requests</h1>
      </div>

      <div className="segmented-control">
        {["All", "Low", "Medium", "Emergency"].map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="request-list">
        {visibleRfqs.map((rfq) => (
          <RequestCard key={rfq.id} rfq={rfq} />
        ))}
        {!visibleRfqs.length ? <div className="empty-state">No matching RFQs yet.</div> : null}
      </div>
    </section>
  );
}

export default RFQs;
