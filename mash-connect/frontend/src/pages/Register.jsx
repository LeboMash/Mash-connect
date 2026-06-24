import { useMemo, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import {
  BriefcaseBusiness,
  Camera,
  GraduationCap,
  Hammer,
  ShieldCheck,
  UploadCloud,
  UserPlus,
  UsersRound,
} from "lucide-react";
import api from "../api/client.js";

const roles = [
  {
    id: "client",
    label: "Client",
    icon: UsersRound,
    summary: "Request services, compare quotes, and manage RFQs.",
  },
  {
    id: "artisan",
    label: "Artisan",
    icon: Hammer,
    summary: "Receive RFQs, submit quotes, and build a trade passport.",
  },
  {
    id: "apprentice",
    label: "Apprentice",
    icon: GraduationCap,
    summary: "Create a learner profile, log training, and connect with mentors.",
  },
  {
    id: "employer",
    label: "Employer",
    icon: BriefcaseBusiness,
    summary: "Find verified artisans and track recruitment demand.",
  },
];

const profileDefaults = {
  client: {
    phone: "",
    company: "",
    location: "",
  },
  artisan: {
    phone: "",
    trade: "",
    experience: "",
    qualification: "",
    location: "",
  },
  apprentice: {
    phone: "",
    trade_interest: "",
    institution: "",
    qualification_level: "",
    mentor_needed: "",
    location: "",
  },
  employer: {
    phone: "",
    company: "",
    industry: "",
    hiring_needs: "",
    location: "",
  },
};

const roleFields = {
  client: [
    ["phone", "Phone number"],
    ["company", "Company or household"],
    ["location", "Service location"],
  ],
  artisan: [
    ["phone", "Phone number"],
    ["trade", "Primary trade"],
    ["experience", "Years of experience"],
    ["qualification", "Qualification or certificate"],
    ["location", "Work location"],
  ],
  apprentice: [
    ["phone", "Phone number"],
    ["trade_interest", "Trade interest"],
    ["institution", "Training institution"],
    ["qualification_level", "Qualification level"],
    ["mentor_needed", "Mentor or placement needs"],
    ["location", "Learning location"],
  ],
  employer: [
    ["phone", "Phone number"],
    ["company", "Company name"],
    ["industry", "Industry"],
    ["hiring_needs", "Hiring needs"],
    ["location", "Business location"],
  ],
};

function Register({ defaultRole = "client", googleClientId }) {
  const [role, setRole] = useState(defaultRole);
  const [account, setAccount] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [profiles, setProfiles] = useState(profileDefaults);
  const [profilePicture, setProfilePicture] = useState(null);
  const [showGoogleVerify, setShowGoogleVerify] = useState(false);

  const selectedRole = useMemo(
    () => roles.find((item) => item.id === role) || roles[0],
    [role]
  );
  const SelectedRoleIcon = selectedRole.icon;
  const profilePicturePreview = useMemo(() => {
    if (!profilePicture) return null;
    return URL.createObjectURL(profilePicture);
  }, [profilePicture]);

  const updateAccount = (field, value) => {
    setAccount((current) => ({ ...current, [field]: value }));
  };

  const updateProfile = (field, value) => {
    setProfiles((current) => ({
      ...current,
      [role]: {
        ...current[role],
        [field]: value,
      },
    }));
  };

  const registerWithEmail = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("full_name", account.full_name);
      formData.append("email", account.email);
      formData.append("password", account.password);
      formData.append("role", role);
      formData.append("profile", JSON.stringify(profiles[role]));
      if (profilePicture) {
        formData.append("profile_picture", profilePicture);
      }

      const response = await api.post("/auth/register", formData);
      localStorage.setItem("mash_token", response.data.token);
      localStorage.setItem("mash_user", JSON.stringify(response.data.user));
      toast.success(`${selectedRole.label} account created`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const registerWithGoogle = async (credentialResponse) => {
    try {
      const response = await api.post("/auth/google", {
        credential: credentialResponse.credential,
        role,
        profile: profiles[role],
      });
      localStorage.setItem("mash_token", response.data.token);
      localStorage.setItem("mash_user", JSON.stringify(response.data.user));
      toast.success(response.data.message || "Google verification successful");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google verification failed");
    }
  };

  const googleConfigured = googleClientId && googleClientId !== "not-configured";

  const openGoogleVerification = () => {
    if (!googleConfigured) {
      toast.error("Google verification is not configured yet");
      return;
    }

    setShowGoogleVerify(true);
  };

  return (
    <section className="register-page page-wrap">
      <div className="section-heading">
        <span className="eyebrow">Create verified profile</span>
        <h1>Register for Mash Connect</h1>
        <p>
          Choose the profile type that matches how you will use the platform,
          then verify with email or Google.
        </p>
      </div>

      <div className="role-tabs">
        {roles.map((item) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.id}
              className={role === item.id ? "active" : ""}
              onClick={() => setRole(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="register-layout">
        <form className="form-panel register-panel" onSubmit={registerWithEmail}>
          <div>
            <span className="eyebrow">{selectedRole.label} registration</span>
            <h2>{selectedRole.summary}</h2>
          </div>

          <label className="profile-picture-upload">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => setProfilePicture(event.target.files?.[0] || null)}
            />
            <span className="profile-picture-preview">
              {profilePicturePreview ? (
                <img src={profilePicturePreview} alt="Profile preview" />
              ) : (
                <Camera size={26} />
              )}
            </span>
            <span>
              <strong>{profilePicture ? profilePicture.name : "Upload profile picture"}</strong>
              <small>PNG, JPG, JPEG, or WEBP</small>
            </span>
            <UploadCloud size={20} />
          </label>

          <div className="form-grid">
            <label>
              Full name
              <input
                value={account.full_name}
                onChange={(event) => updateAccount("full_name", event.target.value)}
                autoComplete="name"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={account.email}
                onChange={(event) => updateAccount("email", event.target.value)}
                autoComplete="email"
              />
            </label>
          </div>

          <label>
            Password
            <input
              type="password"
              value={account.password}
              onChange={(event) => updateAccount("password", event.target.value)}
              autoComplete="new-password"
            />
          </label>

          <div className="form-grid">
            {roleFields[role].map(([field, label]) => (
              <label key={field}>
                {label}
                {field === "hiring_needs" || field === "mentor_needed" ? (
                  <textarea
                    value={profiles[role][field]}
                    onChange={(event) => updateProfile(field, event.target.value)}
                  />
                ) : (
                  <input
                    value={profiles[role][field]}
                    onChange={(event) => updateProfile(field, event.target.value)}
                  />
                )}
              </label>
            ))}
          </div>

          <button className="primary-button submit-button">
            <UserPlus size={18} />
            Create {selectedRole.label} Account
          </button>

          <div className="divider">
            <span>or verify with Google</span>
          </div>

          <div className="google-register">
            <button
              type="button"
              className="secondary-button google-verify-button"
              onClick={openGoogleVerification}
            >
              <ShieldCheck size={18} />
              Verify Google ID
            </button>

            {googleConfigured && showGoogleVerify ? (
              <GoogleLogin
                onSuccess={registerWithGoogle}
                onError={() => toast.error("Google verification failed")}
                text="signup_with"
                shape="rectangular"
                width="100%"
              />
            ) : null}

            {!googleConfigured ? (
              <div className="empty-state">
                Add `VITE_GOOGLE_CLIENT_ID` in the frontend and `GOOGLE_CLIENT_ID`
                in the backend to enable Google verification.
              </div>
            ) : null}
          </div>
        </form>

        <aside className="registration-summary">
          <SelectedRoleIcon size={34} />
          <span className="eyebrow">Selected profile</span>
          <h2>{selectedRole.label}</h2>
          <p>{selectedRole.summary}</p>
          <div className="summary-list">
            {Object.entries(profiles[role])
              .filter(([, value]) => value)
              .map(([field, value]) => (
                <div key={field}>
                  <span>{field.replace("_", " ")}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            {profilePicture ? (
              <div>
                <span>Profile picture</span>
                <strong>{profilePicture.name}</strong>
              </div>
            ) : null}
            {!Object.values(profiles[role]).some(Boolean) && !profilePicture ? (
              <div>
                <span>Profile details</span>
                <strong>Waiting for input</strong>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Register;
