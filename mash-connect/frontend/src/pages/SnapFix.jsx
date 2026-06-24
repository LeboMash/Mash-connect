import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Camera, Loader2, MapPin, Send, UploadCloud } from "lucide-react";
import api from "../api/client.js";

const trades = ["Electrical", "Plumbing", "Welding", "HVAC", "Instrumentation"];
const priorities = ["Low", "Medium", "Emergency"];

const initialForm = {
  client_name: "",
  trade: "",
  description: "",
  priority: "Low",
  location: "",
};

function SnapFix() {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const imagePreview = useMemo(() => {
    if (!image) return null;
    return URL.createObjectURL(image);
  }, [image]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location is not available in this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateField("location", `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        toast.success("Location added to RFQ");
      },
      () => toast.error("Location permission was not granted")
    );
  };

  const submitRFQ = async (event) => {
    event.preventDefault();

    if (!form.client_name || !form.trade || !form.description) {
      toast.error("Add your name, trade, and issue description");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);

    try {
      setSubmitting(true);
      await api.post("/create-rfq", formData);
      toast.success("RFQ submitted successfully");
      setForm(initialForm);
      setImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="snap-page page-wrap">
      <div className="section-heading">
        <span className="eyebrow">Snap & Fix RFQ</span>
        <h1>Submit a service request with evidence</h1>
        <p>
          Capture the issue, attach a photo, set priority, and send it into the
          artisan quote workflow.
        </p>
      </div>

      <div className="snap-layout">
        <motion.form
          onSubmit={submitRFQ}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="form-panel"
        >
          <label>
            Client name
            <input
              type="text"
              value={form.client_name}
              placeholder="Your name"
              onChange={(event) => updateField("client_name", event.target.value)}
            />
          </label>

          <label>
            Trade category
            <select
              value={form.trade}
              onChange={(event) => updateField("trade", event.target.value)}
            >
              <option value="">Select trade</option>
              {trades.map((trade) => (
                <option key={trade}>{trade}</option>
              ))}
            </select>
          </label>

          <label>
            Problem description
            <textarea
              value={form.description}
              placeholder="Describe the fault, symptoms, access limits, and urgency"
              onChange={(event) => updateField("description", event.target.value)}
            />
          </label>

          <div className="form-grid">
            <label>
              Priority
              <select
                value={form.priority}
                onChange={(event) => updateField("priority", event.target.value)}
              >
                {priorities.map((priority) => (
                  <option key={priority}>{priority}</option>
                ))}
              </select>
            </label>

            <label>
              Location
              <div className="input-action">
                <input
                  type="text"
                  value={form.location}
                  placeholder="Area or GPS"
                  onChange={(event) => updateField("location", event.target.value)}
                />
                <button type="button" onClick={captureLocation} aria-label="Use GPS">
                  <MapPin size={18} />
                </button>
              </div>
            </label>
          </div>

          <label className="upload-box">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => setImage(event.target.files?.[0] || null)}
            />
            <UploadCloud size={24} />
            <span>{image ? image.name : "Upload fault photo"}</span>
          </label>

          <button className="primary-button submit-button" disabled={submitting}>
            {submitting ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
            Submit RFQ
          </button>
        </motion.form>

        <aside className="preview-panel">
          {imagePreview ? (
            <img src={imagePreview} alt="RFQ preview" />
          ) : (
            <div className="empty-preview">
              <Camera size={42} />
              <strong>Photo evidence preview</strong>
              <span>Upload a clear image of the fault for better quotes.</span>
            </div>
          )}
          <div className="preview-summary">
            <span className={`status-pill ${form.priority.toLowerCase()}`}>
              {form.priority}
            </span>
            <strong>{form.trade || "Trade not selected"}</strong>
            <p>{form.description || "Issue summary will appear here."}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default SnapFix;
