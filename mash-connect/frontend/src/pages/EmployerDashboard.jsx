import { BriefcaseBusiness, MapPinned, ShieldCheck, UsersRound } from "lucide-react";
import StatCard from "../components/StatCard.jsx";

function EmployerDashboard() {
  return (
    <section className="page-wrap">
      <div className="section-heading">
        <span className="eyebrow">Recruitment platform</span>
        <h1>Employer dashboard</h1>
        <p>
          Discover verified artisans by trade, experience, location, and rating.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard icon={BriefcaseBusiness} label="Open Vacancies" value="18" tone="blue" />
        <StatCard icon={UsersRound} label="Matched Artisans" value="132" tone="green" />
        <StatCard icon={MapPinned} label="Nearby Trades" value="41" />
        <StatCard icon={ShieldCheck} label="Verified Profiles" value="89%" tone="red" />
      </div>
    </section>
  );
}

export default EmployerDashboard;
