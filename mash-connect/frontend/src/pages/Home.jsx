import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  ClipboardCheck,
  CreditCard,
  Droplets,
  Gauge,
  GraduationCap,
  Hammer,
  MapPin,
  PlugZap,
  Ruler,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  SunMedium,
  UserPlus,
  UsersRound,
  Wind,
  Wrench,
} from "lucide-react";

const tradeCategories = [
  { name: "Electrical", icon: PlugZap },
  { name: "Plumbing", icon: Droplets },
  { name: "CCTV", icon: Camera },
  { name: "Solar", icon: SunMedium },
  { name: "Air Conditioning", icon: Snowflake },
  { name: "Welding", icon: Hammer },
  { name: "Carpentry", icon: Ruler },
  { name: "Instrumentation", icon: Gauge },
];

const socialProof = [
  { value: "2,500+", label: "Artisans" },
  { value: "10,000+", label: "Completed Jobs" },
  { value: "700+", label: "Apprentices" },
  { value: "4", label: "Major Cities" },
];

const registrationCards = [
  {
    title: "Clients",
    description: "Create RFQs, upload fault photos, and compare artisan quotes.",
    to: "/register/client",
    icon: UsersRound,
  },
  {
    title: "Artisans",
    description: "Build a verified trade profile and respond to paid requests.",
    to: "/register/artisan",
    icon: Hammer,
  },
  {
    title: "Apprentices",
    description: "Create a learner profile and connect with mentors or placements.",
    to: "/register/apprentice",
    icon: GraduationCap,
  },
  {
    title: "Employers",
    description: "Find verified talent and track skilled workforce demand.",
    to: "/register/employer",
    icon: BriefcaseBusiness,
  },
];

const clientSteps = [
  { title: "Upload problem", icon: Camera },
  { title: "Receive quotes", icon: ClipboardCheck },
  { title: "Hire artisan", icon: Star },
];

const artisanSteps = [
  { title: "Create profile", icon: UserPlus },
  { title: "Receive RFQs", icon: Wrench },
  { title: "Get paid", icon: CreditCard },
];

function Home() {
  return (
    <section className="home-page">
      <div className="hero-band">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="eyebrow">Trusted trades. Verified skills. Faster service.</span>
          <h1>Find trusted artisans, apprentices, and technical services in minutes.</h1>
          <p>
            Mash Connect connects clients, artisans, apprentices, and employers
            through RFQs, verified profiles, quotes, and workforce visibility.
          </p>
          <div className="button-row">
            <Link to="/snap-fix" className="primary-button">
              <Camera size={18} />
              Request a Service
            </Link>
            <Link to="/register/artisan" className="secondary-button">
              <Hammer size={18} />
              Join as an Artisan
            </Link>
            <Link to="/dashboard" className="secondary-button">
              View Dashboard
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-panel"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <img
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80"
            alt="Industrial artisan inspecting equipment"
          />
          <div className="hero-overlay">
            <span>Johannesburg • Pretoria • Durban • Cape Town</span>
            <strong>Emergency RFQ matched</strong>
            <small>Verified artisans available nearby</small>
          </div>
        </motion.div>
      </div>

      <div className="social-proof-strip">
        {socialProof.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
        <article className="cities-covered">
          <MapPin size={18} />
          <span>Johannesburg • Pretoria • Durban • Cape Town</span>
        </article>
      </div>

      <section className="section-block registration-home">
        <div className="section-heading">
          <span className="eyebrow">Registration</span>
          <h2>Join Mash Connect with the right profile</h2>
          <p>
            Register as a client, artisan, apprentice, or employer and use
            Google ID verification during signup.
          </p>
        </div>

        <div className="registration-card-grid">
          {registrationCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                whileHover={{ y: -5 }}
                className="registration-card"
              >
                <Icon size={26} />
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <Link to={card.to} className="primary-button compact">
                  Register
                  <ArrowRight size={16} />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">Trade categories</span>
          <h2>Request skilled help by trade</h2>
          <p>
            Start an RFQ from the trade you need and let the marketplace route
            the request to relevant artisans.
          </p>
        </div>
        <div className="trade-category-grid">
          {tradeCategories.map((trade) => {
            const Icon = trade.icon;
            return (
              <motion.article
                key={trade.name}
                whileHover={{ y: -5 }}
                className="trade-category-card"
              >
                <Icon size={24} />
                <strong>{trade.name}</strong>
                <Link to="/snap-fix" className="quiet-button compact">
                  Quick RFQ
                  <ArrowRight size={15} />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </section>

      <div className="feature-strip">
        <article>
          <ShieldCheck size={24} />
          <strong>Protected workflows</strong>
          <span>JWT-ready accounts, roles, and file validation.</span>
        </article>
        <article>
          <BadgeCheck size={24} />
          <strong>Digital trade passport</strong>
          <span>Verified qualifications, ratings, and work history.</span>
        </article>
        <article>
          <Sparkles size={24} />
          <strong>AI-ready diagnostics</strong>
          <span>Uploaded images are structured for future fault detection.</span>
        </article>
        <article>
          <GraduationCap size={24} />
          <strong>Institution analytics</strong>
          <span>Connect learner output to employer demand.</span>
        </article>
      </div>

      <section className="section-block how-it-works">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>Simple workflows for clients and artisans</h2>
        </div>
        <div className="workflow-grid">
          <WorkflowSteps title="Clients" steps={clientSteps} />
          <WorkflowSteps title="Artisans" steps={artisanSteps} />
        </div>
      </section>
    </section>
  );
}

function WorkflowSteps({ title, steps }) {
  return (
    <article className="workflow-card">
      <h3>{title}</h3>
      <div>
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <span key={step.title}>
              <Icon size={20} />
              <strong>{index + 1}. {step.title}</strong>
            </span>
          );
        })}
      </div>
    </article>
  );
}

export default Home;
