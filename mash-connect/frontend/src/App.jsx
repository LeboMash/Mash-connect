import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer.jsx";
import TopNav from "./components/TopNav.jsx";
import ArtisanProfile from "./pages/ArtisanProfile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EmployerDashboard from "./pages/EmployerDashboard.jsx";
import Home from "./pages/Home.jsx";
import IntellectualProperty from "./pages/IntellectualProperty.jsx";
import Institutions from "./pages/Institutions.jsx";
import Login from "./pages/Login.jsx";
import Privacy from "./pages/Privacy.jsx";
import Quotes from "./pages/Quotes.jsx";
import Register from "./pages/Register.jsx";
import RFQs from "./pages/RFQs.jsx";
import SnapFix from "./pages/SnapFix.jsx";
import Terms from "./pages/Terms.jsx";

function App({ googleClientId }) {
  return (
    <>
      <TopNav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/snap-fix" element={<SnapFix />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rfqs" element={<RFQs />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/artisan-profile" element={<ArtisanProfile />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/intellectual-property" element={<IntellectualProperty />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/register"
            element={<Register googleClientId={googleClientId} />}
          />
          <Route
            path="/register/client"
            element={<Register defaultRole="client" googleClientId={googleClientId} />}
          />
          <Route
            path="/register/artisan"
            element={<Register defaultRole="artisan" googleClientId={googleClientId} />}
          />
          <Route
            path="/register/apprentice"
            element={<Register defaultRole="apprentice" googleClientId={googleClientId} />}
          />
          <Route
            path="/register/employer"
            element={<Register defaultRole="employer" googleClientId={googleClientId} />}
          />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
