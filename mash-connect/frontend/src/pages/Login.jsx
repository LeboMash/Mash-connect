import { useState } from "react";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";
import api from "../api/client.js";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/auth/login", form);
      localStorage.setItem("mash_token", response.data.token);
      localStorage.setItem("mash_user", JSON.stringify(response.data.user));
      toast.success("Login successful");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="auth-page">
      <form className="form-panel auth-panel" onSubmit={submit}>
        <span className="eyebrow">Secure access</span>
        <h1>Login</h1>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </label>
        <button className="primary-button submit-button">
          <LogIn size={18} />
          Login
        </button>
      </form>
    </section>
  );
}

export default Login;
