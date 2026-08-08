import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Globe,
  DollarSign,
  Award,
  Calendar,
  BookOpen,
  AlertCircle,
} from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    preferredCountry: "USA",
    preferredField: "Computer Science",
    budget: "30000",
    ieltsScore: "7.0",
    preferredIntake: "Fall 2026",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please provide name, email, and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await register({
        ...formData,
        budget: Number(formData.budget) || 0,
        ieltsScore: Number(formData.ieltsScore) || 0,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "2rem auto 0 auto" }}>
      <div className="glass-card" style={{ padding: "2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem auto",
              color: "white",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <UserPlus size={28} />
          </div>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.35rem" }}>
            Create Student Profile
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Set up your account and study abroad preferences for instant AI
            program recommendations
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h3
            style={{
              fontSize: "1rem",
              color: "var(--primary)",
              marginBottom: "1rem",
              borderBottom: "1px solid var(--border-light)",
              paddingBottom: "0.5rem",
            }}
          >
            Account Credentials
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">
                <User size={15} /> Full Name *
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your fullname"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={15} /> Email Address *
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={15} /> Password *
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter a strong password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <h3
            style={{
              fontSize: "1rem",
              color: "var(--secondary)",
              margin: "1.5rem 0 1rem 0",
              borderBottom: "1px solid var(--border-light)",
              paddingBottom: "0.5rem",
            }}
          >
            Study Preferences (For AI Matcher)
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">
                <Globe size={15} /> Preferred Country
              </label>
              <select
                name="preferredCountry"
                className="form-control"
                value={formData.preferredCountry}
                onChange={handleChange}
              >
                <option value="USA">United States (USA)</option>
                <option value="UK">United Kingdom (UK)</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <BookOpen size={15} /> Preferred Field of Study
              </label>
              <select
                name="preferredField"
                className="form-control"
                value={formData.preferredField}
                onChange={handleChange}
              >
                <option value="Computer Science">Computer Science & IT</option>
                <option value="Business Analytics">
                  Business & Management
                </option>
                <option value="Data Science">Data Science & AI</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance & Economics</option>
              </select>
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">
                <DollarSign size={15} /> Annual Budget (USD)
              </label>
              <input
                type="number"
                name="budget"
                className="form-control"
                placeholder="30000"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Award size={15} /> IELTS Score
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                name="ieltsScore"
                className="form-control"
                placeholder="7.0"
                value={formData.ieltsScore}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={15} /> Target Intake
              </label>
              <select
                name="preferredIntake"
                className="form-control"
                value={formData.preferredIntake}
                onChange={handleChange}
              >
                <option value="Fall 2026">Winter 2026</option>
                <option value="Spring 2027">Spring 2027</option>
                <option value="Summer 2026">Summer 2026</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: "1.5rem" }}
            disabled={loading}
          >
            {loading ? "Creating Profile..." : "Complete Registration"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-light)",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Already registered?{" "}
            <Link
              to="/login"
              style={{ color: "var(--primary)", fontWeight: 600 }}
            >
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
