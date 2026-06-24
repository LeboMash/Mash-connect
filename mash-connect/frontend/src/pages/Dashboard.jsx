import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  BriefcaseBusiness,
  GraduationCap,
  MessageSquareQuote,
  ShieldCheck,
  UsersRound,
  Wrench,
} from "lucide-react";
import api from "../api/client.js";
import RequestCard from "../components/RequestCard.jsx";
import StatCard from "../components/StatCard.jsx";
import VerificationBadges from "../components/VerificationBadges.jsx";

const dashboardRoles = [
  { id: "client", label: "Client", icon: UsersRound },
  { id: "artisan", label: "Artisan", icon: Wrench },
  { id: "apprentice", label: "Apprentice", icon: GraduationCap },
  { id: "employer", label: "Employer", icon: BriefcaseBusiness },
];

function getStoredRole() {
  try {
    const user = JSON.parse(localStorage.getItem("mash_user") || "{}");
    return user.role || "client";
  } catch {
    return "client";
  }
}

function Dashboard() {
  const [rfqs, setRfqs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [role, setRole] = useState(getStoredRole);

  const loadData = async () => {
    const [rfqResponse, quoteResponse, profileResponse, notificationResponse] = await Promise.all([
      api.get("/rfqs"),
      api.get("/quotes"),
      api.get("/profiles"),
      api.get("/notifications"),
    ]);
    setRfqs(rfqResponse.data);
    setQuotes(quoteResponse.data);
    setProfiles(profileResponse.data);
    setNotifications(notificationResponse.data);
  };

  useEffect(() => {
    loadData().catch(() => {
      setRfqs([]);
      setQuotes([]);
      setProfiles([]);
      setNotifications([]);
    });
  }, []);

  const stats = useMemo(() => {
    const emergency = rfqs.filter((rfq) => rfq.priority === "Emergency").length;
    const acceptedQuotes = quotes.filter((quote) => quote.status === "Accepted").length;
    const activeRfqs = rfqs.filter((rfq) =>
      ["Submitted", "Reviewing", "Quotes Received", "Open", "Quoted"].includes(rfq.status)
    );
    const verifiedProfiles = profiles.filter(
      (profile) => profile.verification_badges?.length >= 3
    ).length;

    return { emergency, acceptedQuotes, openRfqs: activeRfqs, verifiedProfiles };
  }, [profiles, quotes, rfqs]);

  const artisanProfiles = profiles.filter((profile) => profile.role === "artisan");
  const apprenticeProfiles = profiles.filter((profile) => profile.role === "apprentice");
  const acceptedRfqs = rfqs.filter((rfq) =>
    ["Accepted", "Artisan Assigned", "In Progress", "Completed"].includes(rfq.status)
  );

  return (
    <section className="page-wrap">
      <div className="section-heading">
        <span className="eyebrow">Role command center</span>
        <h1>Dashboards for the whole marketplace</h1>
        <p>
          Switch between client, artisan, apprentice, and employer views to see
          the workflows that matter for each user type.
        </p>
      </div>

      <div className="role-tabs dashboard-tabs">
        {dashboardRoles.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={role === item.id ? "active" : ""}
              onClick={() => setRole(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {role === "client" ? (
        <>
          <div className="stats-grid">
            <StatCard icon={Activity} label="Active RFQs" value={rfqs.length} tone="green" />
            <StatCard icon={AlertTriangle} label="Emergency" value={stats.emergency} tone="red" />
            <StatCard
              icon={MessageSquareQuote}
              label="Accepted Quotes"
              value={stats.acceptedQuotes}
            />
            <StatCard icon={Wrench} label="Open Jobs" value={stats.openRfqs.length} tone="blue" />
          </div>
          <NotificationPanel notifications={notifications} />
          <DashboardSection title="Recent requests" empty="Submit your first RFQ from Snap & Fix.">
            {rfqs.slice(0, 5).map((rfq) => (
              <RequestCard key={rfq.id} rfq={rfq} />
            ))}
          </DashboardSection>
        </>
      ) : null}

      {role === "artisan" ? (
        <>
          <div className="stats-grid">
            <StatCard icon={Wrench} label="Open RFQs" value={stats.openRfqs.length} tone="green" />
            <StatCard icon={MessageSquareQuote} label="Submitted Quotes" value={quotes.length} />
            <StatCard
              icon={ShieldCheck}
              label="Accepted Work"
              value={stats.acceptedQuotes}
              tone="blue"
            />
            <StatCard icon={AlertTriangle} label="Emergency Jobs" value={stats.emergency} tone="red" />
          </div>
          <NotificationPanel notifications={notifications} />
          <DashboardSection title="Jobs ready for bidding" empty="No open RFQs right now.">
            {stats.openRfqs.slice(0, 5).map((rfq) => (
              <RequestCard key={rfq.id} rfq={rfq} />
            ))}
          </DashboardSection>
        </>
      ) : null}

      {role === "apprentice" ? (
        <>
          <div className="stats-grid">
            <StatCard
              icon={GraduationCap}
              label="Apprentice Profiles"
              value={apprenticeProfiles.length}
              tone="blue"
            />
            <StatCard icon={Wrench} label="Trade Exposure" value={stats.openRfqs.length} />
            <StatCard icon={ShieldCheck} label="Verified Profiles" value={stats.verifiedProfiles} tone="green" />
          </div>
          <NotificationPanel notifications={notifications} />
          <DashboardSection title="Apprentice profiles" empty="No apprentices registered yet.">
            {apprenticeProfiles.map((profile) => (
              <ProfileRow key={profile.id} profile={profile} />
            ))}
          </DashboardSection>
        </>
      ) : null}

      {role === "employer" ? (
        <>
          <div className="stats-grid">
            <StatCard icon={UsersRound} label="Artisans" value={artisanProfiles.length} tone="green" />
            <StatCard
              icon={GraduationCap}
              label="Apprentices"
              value={apprenticeProfiles.length}
              tone="blue"
            />
            <StatCard icon={ShieldCheck} label="Verified Profiles" value={stats.verifiedProfiles} />
            <StatCard icon={BriefcaseBusiness} label="Accepted Jobs" value={acceptedRfqs.length} tone="red" />
          </div>
          <NotificationPanel notifications={notifications} />
          <DashboardSection title="Talent pipeline" empty="No registered talent profiles yet.">
            {[...artisanProfiles, ...apprenticeProfiles].map((profile) => (
              <ProfileRow key={profile.id} profile={profile} />
            ))}
          </DashboardSection>
        </>
      ) : null}
    </section>
  );
}

function NotificationPanel({ notifications }) {
  return (
    <section className="notification-panel">
      <div className="split-heading">
        <h2>Recent notifications</h2>
        <span>{notifications.length} events</span>
      </div>
      <div className="notification-list">
        {notifications.slice(0, 4).map((notification) => (
          <article key={notification.id} className={notification.read ? "notification-card read" : "notification-card"}>
            <Bell size={18} />
            <div>
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
              <span>{new Date(notification.created_at).toLocaleString()}</span>
            </div>
          </article>
        ))}
        {!notifications.length ? (
          <div className="empty-state">Marketplace events will appear here.</div>
        ) : null}
      </div>
    </section>
  );
}

function DashboardSection({ title, empty, children }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  const isEmpty = Array.isArray(items) ? items.length === 0 : !items;

  return (
    <>
      <div className="split-heading">
        <h2>{title}</h2>
        <span>Synced with backend</span>
      </div>
      <div className="request-list">
        {items}
        {isEmpty ? <div className="empty-state">{empty}</div> : null}
      </div>
    </>
  );
}

function ProfileRow({ profile }) {
  const data = profile.profile_data || {};
  const user = profile.user || {};
  const title = user.full_name || data.company || "Unnamed profile";
  const subtitle =
    data.trade ||
    data.trade_interest ||
    data.company ||
    data.institution ||
    data.industry ||
    "Profile details pending";

  return (
    <article className="profile-row">
      <span className="avatar">{title.slice(0, 1)}</span>
      <div>
        <span className="eyebrow">{profile.role}</span>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <VerificationBadges badges={profile.verification_badges || []} compact />
      </div>
    </article>
  );
}

export default Dashboard;
