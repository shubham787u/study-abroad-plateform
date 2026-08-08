import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Compass, GraduationCap } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "65vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        gap: "1.5rem",
      }}
    >
      {/* Animated 404 number */}
      <div
        style={{
          fontSize: "5rem",
          fontWeight: 500,
          fontFamily: "var(--font-heading)",
          lineHeight: 1,
          background:
            "linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #a855f7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.05em",
        }}
      >
        404
      </div>

      {/* Icon */}
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.1)",
          border: "2px solid rgba(99, 102, 241, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--primary)",
        }}
      >
        <Compass size={36} />
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "0.5rem",
        }}
      >
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(-1)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <ArrowLeft size={15} />
          Go Back
        </button>
        <Link to="/" className="btn btn-primary">
          <Home size={16} />
          Return to Home
        </Link>
        <Link to="/programs" className="btn btn-accent btn-sm">
          <GraduationCap size={15} />
          Explore Programs
        </Link>
      </div>

      {/* Quick links */}
      <div
        className="glass-card"
        style={{
          padding: "1.5rem 2rem",
          marginTop: "1rem",
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { label: "Home", to: "/" },
          { label: "Programs", to: "/programs" },
          { label: "Universities", to: "/universities" },
          { label: "AI Matcher", to: "/recommendations" },
          { label: "Dashboard", to: "/dashboard" },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              color: "var(--primary)",
              fontWeight: 600,
              fontSize: "0.9rem",
              transition: "color 0.2s",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NotFound;
