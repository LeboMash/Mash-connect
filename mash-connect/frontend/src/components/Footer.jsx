import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>Mash Connect</strong>
        <span>A platform developed and owned by Thy Mash Projects Pty Ltd.</span>
      </div>
      <nav>
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/intellectual-property">IP Notice</Link>
      </nav>
      <small>
        © 2026 Mash Connect. A platform developed and owned by Thy Mash Projects
        Pty Ltd. All rights reserved.
      </small>
    </footer>
  );
}

export default Footer;
