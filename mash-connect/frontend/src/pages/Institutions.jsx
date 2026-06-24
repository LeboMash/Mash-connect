import { BarChart3, GraduationCap, UsersRound } from "lucide-react";
import StatCard from "../components/StatCard.jsx";

function Institutions() {
  return (
    <section className="page-wrap">
      <div className="section-heading">
        <span className="eyebrow">Education analytics</span>
        <h1>Institution workforce intelligence</h1>
        <p>
          Track skills pipelines, verified learners, placement readiness, and
          employer demand signals.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard icon={GraduationCap} label="Learners Tracked" value="1,240" tone="blue" />
        <StatCard icon={UsersRound} label="Employer Leads" value="86" tone="green" />
        <StatCard icon={BarChart3} label="Placement Readiness" value="74%" />
      </div>
    </section>
  );
}

export default Institutions;
