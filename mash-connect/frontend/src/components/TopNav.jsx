import { NavLink } from "react-router-dom";
import { Bolt, BriefcaseBusiness, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/snap-fix", label: "Snap & Fix" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/rfqs", label: "RFQs" },
  { to: "/quotes", label: "Quotes" },
  { to: "/artisan-profile", label: "Artisans" },
];

function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="top-nav">
      <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-mark">
          <Bolt size={20} />
        </span>
        <span>Mash Connect</span>
      </NavLink>

      <button
        type="button"
        className="icon-button menu-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-label="Toggle navigation"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <nav className={open ? "nav-links is-open" : "nav-links"}>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-actions">
        <NavLink to="/employer-dashboard" className="quiet-button">
          <BriefcaseBusiness size={16} />
          Employer
        </NavLink>
        <NavLink to="/login" className="primary-button compact">
          <LayoutDashboard size={16} />
          Login
        </NavLink>
      </div>
    </header>
  );
}

export default TopNav;
