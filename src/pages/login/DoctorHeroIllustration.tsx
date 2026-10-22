import React, { useState } from "react";

export const DoctorHeroIllustration: React.FC = () => {
  const [isCaseHovered, setIsCaseHovered] = useState<boolean>(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 360,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Interactive Medical Doctor & Briefcase SVG */}
      <svg
        viewBox="0 0 360 270"
        style={{
          width: "100%",
          height: "auto",
          filter: "drop-shadow(0 14px 28px rgba(0, 0, 0, 0.25))",
          cursor: "pointer",
        }}
        onMouseEnter={() => setIsCaseHovered(true)}
        onMouseLeave={() => setIsCaseHovered(false)}
      >
        <defs>
          <linearGradient id="heroCoatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="heroCaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f766e" />
            <stop offset="50%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#042f2e" />
          </linearGradient>
          <linearGradient id="goldHeroLatch" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <radialGradient id="auraGlowHero" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Glow */}
        <circle cx="180" cy="150" r="110" fill="url(#auraGlowHero)" />

        {/* Shadow base */}
        <ellipse cx="180" cy="245" rx="140" ry="14" fill="#022c22" opacity="0.4" />

        {/* Doctor Character */}
        <g id="hero-doctor">
          {/* Torso */}
          <path
            d="M130 110 Q180 95 230 110 L242 195 L118 195 Z"
            fill="url(#heroCoatGrad)"
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />

          {/* Tie & Collar */}
          <polygon points="172,102 188,102 182,140 178,140" fill="#0284c7" />
          <polygon points="178,108 182,108 181,152 179,152" fill="#ef4444" />
          <polygon points="156,102 176,145 165,148 142,110" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <polygon points="204,102 184,145 195,148 218,110" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

          {/* Stethoscope */}
          <path
            d="M158 102 C150 135 165 158 180 165 C190 168 202 158 212 142 C218 132 222 112 216 102"
            fill="none"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="180" cy="168" r="6" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="180" cy="168" r="3" fill="#10b981" />

          {/* Head & Neck */}
          <rect x="169" y="86" width="22" height="18" rx="4" fill="#ffd8b8" />
          <ellipse cx="180" cy="65" rx="28" ry="32" fill="#ffd8b8" />

          {/* Hair */}
          <path
            d="M152 65 C150 40 166 30 180 30 C198 30 210 40 208 65 C202 48 194 40 180 40 C166 40 156 48 152 65 Z"
            fill="#1e293b"
          />

          {/* Glasses */}
          <circle cx="170" cy="64" r="8" fill="rgba(255,255,255,0.3)" stroke="#0d9488" strokeWidth="1.5" />
          <circle cx="190" cy="64" r="8" fill="rgba(255,255,255,0.3)" stroke="#0d9488" strokeWidth="1.5" />
          <line x1="178" y1="64" x2="182" y2="64" stroke="#0d9488" strokeWidth="1.5" />

          {/* Smile */}
          <path d="M174 79 Q180 84 186 79" fill="none" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" />

          {/* Medical Headband */}
          <path d="M154 48 Q180 44 206 48" stroke="#0d9488" strokeWidth="3" fill="none" />
          <circle cx="180" cy="46" r="6" fill="#f1f5f9" stroke="#047857" strokeWidth="1.5" />
          <circle cx="180" cy="46" r="2.5" fill="#10b981" />

          {/* Arms holding the briefcase */}
          <path d="M125 130 Q110 180 145 200" fill="none" stroke="#f8fafc" strokeWidth="16" strokeLinecap="round" />
          <path d="M235 130 Q250 180 215 200" fill="none" stroke="#f8fafc" strokeWidth="16" strokeLinecap="round" />
          <circle cx="145" cy="200" r="8" fill="#ffd8b8" />
          <circle cx="215" cy="200" r="8" fill="#ffd8b8" />
        </g>

        {/* Medical Briefcase with Interactive Bounce/Hover Effect */}
        <g
          id="hero-briefcase"
          style={{
            transform: isCaseHovered ? "translateY(-6px)" : "translateY(0)",
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Briefcase Bottom Box */}
          <rect
            x="110"
            y="190"
            width="140"
            height="48"
            rx="10"
            fill="url(#heroCaseGrad)"
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Chrome Trim */}
          <rect x="110" y="210" width="140" height="2" fill="rgba(255,255,255,0.2)" />

          {/* Briefcase Handle */}
          <path
            d="M165 190 C165 178 195 178 195 190"
            fill="none"
            stroke="#0f172a"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Gold Latches */}
          <rect x="135" y="191" width="10" height="9" rx="2" fill="url(#goldHeroLatch)" />
          <rect x="215" y="191" width="10" height="9" rx="2" fill="url(#goldHeroLatch)" />

          {/* K3 Green Emblem */}
          <circle cx="180" cy="214" r="13" fill="#10b981" />
          <circle cx="180" cy="214" r="10.5" fill="#ffffff" />
          <rect x="177" y="207" width="6" height="14" rx="1.5" fill="#047857" />
          <rect x="173" y="211" width="14" height="6" rx="1.5" fill="#047857" />

          {/* Floating Safety Helmets & First-Aid Mini badges */}
          <g
            className="float-elem-1"
            style={{
              transformOrigin: "85px 145px",
            }}
          >
            <circle cx="85" cy="145" r="17" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />
            <path d="M75 147 C75 137 95 137 95 147 Z" fill="#ffffff" />
            <rect x="73" y="147" width="24" height="2.5" rx="1" fill="#ca8a04" />
          </g>

          <g
            className="float-elem-2"
            style={{
              transformOrigin: "275px 145px",
            }}
          >
            <circle cx="275" cy="145" r="17" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
            <rect x="272" y="137" width="6" height="16" rx="1" fill="#ffffff" />
            <rect x="267" y="142" width="16" height="6" rx="1" fill="#ffffff" />
          </g>
        </g>
      </svg>

      <div
        style={{
          marginTop: -6,
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(8px)",
          padding: "4px 14px",
          borderRadius: 20,
          border: "1px solid rgba(255, 255, 255, 0.25)",
          color: "#ecfdf5",
          fontSize: 12,
          fontWeight: 500,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 8px #34d399" }} />
        Dokter K3 & Emergency Kit Siaga
      </div>
    </div>
  );
};
