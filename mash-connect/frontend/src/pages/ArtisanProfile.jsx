import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BadgeCheck, Star, UserRoundCheck } from "lucide-react";
import api from "../api/client.js";

const initialArtisan = {
  full_name: "",
  trade: "",
  experience: "",
  qualification: "",
  rating: "",
  location: "",
  verified: true,
};

function ArtisanProfile() {
  const [artisans, setArtisans] = useState([]);
  const [form, setForm] = useState(initialArtisan);

  const loadArtisans = async () => {
    const response = await api.get("/artisans");
    setArtisans(response.data);
  };

  useEffect(() => {
    loadArtisans().catch(() => setArtisans([]));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/artisans", {
        ...form,
        experience: Number(form.experience || 0),
        rating: Number(form.rating || 0),
      });
      toast.success("Artisan profile created");
      setForm(initialArtisan);
      await loadArtisans();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save artisan");
    }
  };

  return (
    <section className="page-wrap">
      <div className="section-heading">
        <span className="eyebrow">Digital trade passport</span>
        <h1>Verified artisan profiles</h1>
      </div>

      <div className="two-column">
        <form className="form-panel" onSubmit={submit}>
          {["full_name", "trade", "experience", "qualification", "rating", "location"].map(
            (field) => (
              <label key={field}>
                {field.replace("_", " ")}
                <input
                  value={form[field]}
                  onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                />
              </label>
            )
          )}
          <label className="check-row">
            <input
              type="checkbox"
              checked={form.verified}
              onChange={(event) => setForm({ ...form, verified: event.target.checked })}
            />
            Verified credentials
          </label>
          <button className="primary-button submit-button">
            <UserRoundCheck size={18} />
            Save Artisan
          </button>
        </form>

        <div className="artisan-grid">
          {artisans.map((artisan) => (
            <article className="artisan-card" key={artisan.id}>
              <span className="avatar">{artisan.full_name.slice(0, 1)}</span>
              <strong>{artisan.full_name}</strong>
              <span>{artisan.trade}</span>
              <p>{artisan.qualification || "Qualification pending"}</p>
              <div className="meta-row">
                <span>
                  <Star size={15} />
                  {artisan.rating}
                </span>
                <span>
                  <BadgeCheck size={15} />
                  {artisan.verified ? "Verified" : "Pending"}
                </span>
              </div>
            </article>
          ))}
          {!artisans.length ? <div className="empty-state">No artisan profiles yet.</div> : null}
        </div>
      </div>
    </section>
  );
}

export default ArtisanProfile;
