import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { ForwardOutlined, CheckCircleOutlined } from "@ant-design/icons";

interface DoctorBriefcaseIntroProps {
  onComplete: () => void;
}

export const DoctorBriefcaseIntro: React.FC<DoctorBriefcaseIntroProps> = ({ onComplete }) => {
  // Step:
  // 0: Initial ready (Dokter memegang koper)
  // 1: Unlocking (Kunci koper terbuka & memancarkan kilau halus)
  // 2: Lid opening (Tutup koper terangkat anggun & sinar cahaya memancar)
  // 3: Items pop out (Peralatan K3 dan medis melayang anggun cascade)
  // 4: Completed (Ready to cross-dissolve to login)
  const [step, setStep] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [progressStarted, setProgressStarted] = useState<boolean>(false);

  useEffect(() => {
    // Trigger smooth GPU-accelerated progress transition
    const progressTimer = setTimeout(() => {
      setProgressStarted(true);
    }, 40);

    // Sequence timer: The Golden Timing (~2.4s) dengan fluid transitions
    const t1 = setTimeout(() => setStep(1), 380);   // 0.38s: Unlock latches
    const t2 = setTimeout(() => setStep(2), 750);   // 0.75s: Lid opens fluidly
    const t3 = setTimeout(() => setStep(3), 1150);  // 1.15s: Items glide out gracefully
    const t4 = setTimeout(() => setStep(4), 1750);  // 1.75s: Ready message
    const t5 = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onComplete, 380);
    }, 2250); // 2.25s: Cross-dissolve fade-out (total selesai di 2.45s)

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 220);
  };

  return (
    <div className={`doctor-intro-overlay ${isFadingOut ? "fade-out" : ""}`}>
      {/* Skip Button */}
      <Button
        className="intro-skip-btn"
        onClick={handleSkip}
        icon={<ForwardOutlined />}
      >
        Lewati Animasi
      </Button>

      {/* Decorative background stars / medical crosses */}
      <div className="floating-sparkle" style={{ top: "12%", left: "15%", opacity: 0.3 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#34d399">
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
        </svg>
      </div>
      <div className="floating-sparkle" style={{ top: "18%", right: "18%", opacity: 0.35, animationDelay: "-1.5s" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#38bdf8">
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
        </svg>
      </div>
      <div className="floating-sparkle" style={{ bottom: "20%", left: "12%", opacity: 0.25, animationDelay: "-2.5s" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#facc15">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>

      <div className="doctor-stage">
        {/* Glow Aura */}
        <div className={`case-glow-aura ${step >= 2 ? "opened" : ""}`} />

        {/* Doctor & Briefcase Animated SVG Scene */}
        <div style={{ position: "relative", width: 440, height: 380, maxWidth: "90vw" }}>
          <svg
            viewBox="0 0 500 440"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            <defs>
              <linearGradient id="doctorCoat" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              <linearGradient id="doctorSkin" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffd8b8" />
                <stop offset="100%" stopColor="#f5ba8a" />
              </linearGradient>
              <linearGradient id="briefcaseBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f766e" />
                <stop offset="50%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#042f2e" />
              </linearGradient>
              <linearGradient id="briefcaseLidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#0f766e" />
              </linearGradient>
              <linearGradient id="goldLatch" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="beamGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Stage Ground / Desk Shadow */}
            <ellipse cx="250" cy="405" rx="190" ry="24" fill="#021f1b" opacity="0.6" />
            <ellipse cx="250" cy="400" rx="170" ry="16" fill="#042f2c" opacity="0.8" />

            {/* === DOCTOR CHARACTER === */}
            <g id="doctor" style={{ transition: "all 0.5s ease" }}>
              {/* Doctor Body / Torso */}
              <path
                d="M170 210 Q250 185 330 210 L345 340 L155 340 Z"
                fill="url(#doctorCoat)"
                stroke="#cbd5e1"
                strokeWidth="2"
              />

              {/* Doctor Inner Shirt & Tie */}
              <polygon points="230,195 270,195 260,250 240,250" fill="#0284c7" />
              <polygon points="245,205 255,205 253,275 247,275" fill="#e11d48" />

              {/* Lab Coat Collars */}
              <polygon points="205,195 235,270 215,275 185,210" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <polygon points="295,195 265,270 285,275 315,210" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* ID Badge on Coat Pocket */}
              <rect x="180" y="240" width="34" height="42" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="185" y="245" width="24" height="6" rx="2" fill="#0d9488" />
              <circle cx="197" cy="260" r="5" fill="#0284c7" />
              <rect x="186" y="270" width="22" height="3" rx="1" fill="#cbd5e1" />

              {/* Stethoscope around neck */}
              <path
                d="M210 195 C200 245 220 285 240 295 C255 300 270 285 285 265 C295 250 300 220 290 195"
                fill="none"
                stroke="#0f172a"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="240" cy="298" r="8" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="240" cy="298" r="4" fill="#0d9488" />

              {/* Doctor Head & Neck */}
              <rect x="233" y="170" width="34" height="30" rx="6" fill="url(#doctorSkin)" />
              
              {/* Head / Face */}
              <ellipse cx="250" cy="140" rx="42" ry="48" fill="url(#doctorSkin)" />

              {/* Hair */}
              <path
                d="M208 140 C206 100 230 85 250 85 C275 85 294 100 292 140 C285 110 270 100 250 100 C230 100 215 112 208 140 Z"
                fill="#1e293b"
              />

              {/* Doctor Glasses */}
              <circle cx="236" cy="138" r="13" fill="rgba(255,255,255,0.3)" stroke="#0f766e" strokeWidth="2.5" />
              <circle cx="264" cy="138" r="13" fill="rgba(255,255,255,0.3)" stroke="#0f766e" strokeWidth="2.5" />
              <line x1="249" y1="138" x2="251" y2="138" stroke="#0f766e" strokeWidth="2.5" />

              {/* Eyes with friendly sparkle */}
              <circle cx="236" cy="138" r="3.5" fill="#0f172a" />
              <circle cx="264" cy="138" r="3.5" fill="#0f172a" />
              <circle cx="237.5" cy="136.5" r="1.5" fill="#ffffff" />
              <circle cx="265.5" cy="136.5" r="1.5" fill="#ffffff" />

              {/* Friendly Smile */}
              <path
                d="M241 160 Q250 167 259 160"
                fill="none"
                stroke="#c2410c"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Head Mirror / Medical Headband */}
              <path d="M210 115 Q250 110 290 115" stroke="#0d9488" strokeWidth="5" fill="none" />
              <circle cx="250" cy="112" r="10" fill="#e2e8f0" stroke="#047857" strokeWidth="2" />
              <circle cx="250" cy="112" r="4" fill="#10b981" />

              {/* Doctor Arms reaching to briefcase */}
              {/* Left Arm */}
              <path
                d="M165 240 Q150 310 195 335"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="24"
                strokeLinecap="round"
              />
              {/* Right Arm */}
              <path
                d="M335 240 Q350 310 305 335"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="24"
                strokeLinecap="round"
              />

              {/* Hands on Briefcase Handles/Latches */}
              <ellipse
                cx={step >= 1 ? "190" : "195"}
                cy={step >= 2 ? "325" : "335"}
                rx="14"
                ry="11"
                fill="url(#doctorSkin)"
                style={{ transition: "all 0.4s ease" }}
              />
              <ellipse
                cx={step >= 1 ? "310" : "305"}
                cy={step >= 2 ? "325" : "335"}
                rx="14"
                ry="11"
                fill="url(#doctorSkin)"
                style={{ transition: "all 0.4s ease" }}
              />
            </g>

            {/* === RADIANT BEAM WHEN CASE OPENS === */}
            {step >= 2 && (
              <g style={{ transition: "opacity 0.6s ease" }}>
                <polygon
                  points="210,345 290,345 360,120 140,120"
                  fill="url(#beamGrad)"
                  filter="url(#softGlow)"
                />
              </g>
            )}

            {/* === THE K3 MEDICAL BRIEFCASE === */}
            <g id="briefcase-assembly">
              {/* Briefcase Base Container (Bottom half) */}
              <rect
                x="145"
                y="330"
                width="210"
                height="65"
                rx="14"
                fill="url(#briefcaseBody)"
                stroke="#334155"
                strokeWidth="3"
              />

              {/* Chrome Corner Protectors */}
              <path d="M145 344 L145 334 A4 4 0 0 1 155 330 L165 330 Z" fill="#94a3b8" />
              <path d="M355 344 L355 334 A4 4 0 0 0 345 330 L335 330 Z" fill="#94a3b8" />
              <path d="M145 381 L145 391 A4 4 0 0 0 155 395 L165 395 Z" fill="#64748b" />
              <path d="M355 381 L355 391 A4 4 0 0 1 345 395 L335 395 Z" fill="#64748b" />

              {/* K3 Emblem on Lower Base */}
              <g transform="translate(250, 362) scale(0.9)">
                {/* K3 Gear Circle in Green */}
                <circle cx="0" cy="0" r="16" fill="#10b981" />
                {/* Gear teeth */}
                <circle cx="0" cy="0" r="13" fill="#ffffff" />
                {/* Green Cross */}
                <rect x="-4" y="-9" width="8" height="18" rx="2" fill="#047857" />
                <rect x="-9" y="-4" width="18" height="8" rx="2" fill="#047857" />
              </g>

              {/* Gold / Chrome Latches */}
              {/* Left Latch */}
              <g
                transform={`translate(185, 332) scale(${step >= 1 ? "1.15" : "1"})`}
                style={{ transition: "transform 0.25s ease", transformOrigin: "185px 332px" }}
              >
                <rect x="-8" y="-6" width="16" height="14" rx="3" fill="url(#goldLatch)" stroke="#78350f" strokeWidth="1" />
                {step >= 1 && (
                  <circle cx="0" cy="1" r="3" fill="#ffffff" filter="url(#softGlow)" />
                )}
              </g>

              {/* Right Latch */}
              <g
                transform={`translate(315, 332) scale(${step >= 1 ? "1.15" : "1"})`}
                style={{ transition: "transform 0.25s ease", transformOrigin: "315px 332px" }}
              >
                <rect x="-8" y="-6" width="16" height="14" rx="3" fill="url(#goldLatch)" stroke="#78350f" strokeWidth="1" />
                {step >= 1 && (
                  <circle cx="0" cy="1" r="3" fill="#ffffff" filter="url(#softGlow)" />
                )}
              </g>

              {/* Briefcase Handle */}
              <path
                d="M225 328 C225 312 275 312 275 328"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Briefcase Lid (Animated Open) */}
              <g
                id="case-lid"
                style={{
                  transformOrigin: "250px 330px",
                  transform: step >= 2 ? "rotateX(-105deg) translateY(-24px) scaleY(0.65)" : "rotateX(0deg)",
                  transition: "transform 0.52s cubic-bezier(0.25, 1, 0.5, 1)",
                  transformStyle: "preserve-3d",
                }}
              >
                <rect
                  x="145"
                  y="295"
                  width="210"
                  height="36"
                  rx="10"
                  fill="url(#briefcaseLidGrad)"
                  stroke="#334155"
                  strokeWidth="3"
                />
                <line x1="145" y1="315" x2="355" y2="315" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                
                {/* Text on Lid: PRIMA K3 */}
                <text
                  x="250"
                  y="312"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  letterSpacing="2"
                  opacity="0.9"
                >
                  PRIMA K3 MEDIKA
                </text>
              </g>

              {/* Inside Compartment Glow (Visible when open) */}
              {step >= 2 && (
                <rect
                  x="152"
                  y="330"
                  width="196"
                  height="12"
                  rx="4"
                  fill="#34d399"
                  opacity="0.9"
                  filter="url(#softGlow)"
                />
              )}
            </g>

            {/* === POPPING ITEMS FROM BRIEFCASE === */}
            {step >= 3 && (
              <g id="popping-medical-items">
                {/* 1. Stethoscope Floating Left */}
                <g
                  className="float-elem-1"
                  style={{
                    animation: "itemPopOut 0.48s cubic-bezier(0.25, 1, 0.5, 1) forwards",
                    transformOrigin: "150px 220px",
                  }}
                >
                  <circle cx="150" cy="220" r="26" fill="#0f766e" stroke="#34d399" strokeWidth="2" filter="url(#softGlow)" />
                  <path
                    d="M142 210 C138 225 146 232 154 230 C159 228 162 222 160 214"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="158" cy="228" r="4.5" fill="#facc15" />
                  <text x="150" y="258" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="600">
                    Stetoskop
                  </text>
                </g>

                {/* 2. Safety Helmet (Helm K3) Floating Right */}
                <g
                  className="float-elem-2"
                  style={{
                    animation: "itemPopOut 0.48s cubic-bezier(0.25, 1, 0.5, 1) 0.08s forwards",
                    transformOrigin: "350px 210px",
                  }}
                >
                  <circle cx="350" cy="210" r="28" fill="#d97706" stroke="#fef08a" strokeWidth="2" filter="url(#softGlow)" />
                  {/* Yellow Hardhat */}
                  <path
                    d="M334 214 C334 198 366 198 366 214 Z"
                    fill="#fef08a"
                  />
                  <rect x="330" y="214" width="40" height="4" rx="2" fill="#ca8a04" />
                  {/* Small Green K3 cross on helmet */}
                  <circle cx="350" cy="207" r="4" fill="#10b981" />
                  <rect x="349" y="205" width="2" height="4" fill="#ffffff" />
                  <rect x="348" y="206" width="4" height="2" fill="#ffffff" />
                  <text x="350" y="252" textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="600">
                    Safety K3
                  </text>
                </g>

                {/* 3. Heartbeat ECG Pulse Monitor (Center-Top) */}
                <g
                  style={{
                    animation: "itemPopOut 0.48s cubic-bezier(0.25, 1, 0.5, 1) 0.16s forwards",
                    transformOrigin: "250px 180px",
                  }}
                >
                  <rect x="205" y="160" width="90" height="34" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" filter="url(#softGlow)" />
                  {/* ECG line */}
                  <path
                    d="M212 177 L225 177 L230 168 L236 186 L242 171 L246 179 L255 177 L288 177"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="282" cy="177" r="2.5" fill="#ef4444" />
                </g>

                {/* 4. First Aid Kit Box Floating Lower Left */}
                <g
                  className="float-elem-2"
                  style={{
                    animation: "itemPopOut 0.48s cubic-bezier(0.25, 1, 0.5, 1) 0.24s forwards",
                    transformOrigin: "110px 290px",
                  }}
                >
                  <circle cx="110" cy="290" r="22" fill="#dc2626" stroke="#fca5a5" strokeWidth="2" filter="url(#softGlow)" />
                  {/* White cross */}
                  <rect x="107" y="279" width="6" height="22" rx="1.5" fill="#ffffff" />
                  <rect x="99" y="287" width="22" height="6" rx="1.5" fill="#ffffff" />
                  <text x="110" y="324" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="600">
                    P3K Siaga
                  </text>
                </g>

                {/* 5. Health & Shield Badge Floating Lower Right */}
                <g
                  className="float-elem-1"
                  style={{
                    animation: "itemPopOut 0.48s cubic-bezier(0.25, 1, 0.5, 1) 0.30s forwards",
                    transformOrigin: "390px 290px",
                  }}
                >
                  <circle cx="390" cy="290" r="22" fill="#2563eb" stroke="#93c5fd" strokeWidth="2" filter="url(#softGlow)" />
                  {/* Shield shape */}
                  <path
                    d="M390 278 L399 283 V293 C399 299 390 304 390 304 C390 304 381 299 381 293 V283 Z"
                    fill="#ffffff"
                  />
                  <text x="390" y="324" textAnchor="middle" fill="#bfdbfe" fontSize="8" fontWeight="600">
                    Proteksi ANRI
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* Dynamic Status Text */}
        <div style={{ textAlign: "center", marginTop: 12, minHeight: 64, color: "#ffffff" }}>
          <h2
            style={{
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 700,
              margin: "0 0 6px 0",
              textShadow: "0 2px 10px rgba(0,0,0,0.4)",
              letterSpacing: "0.5px",
            }}
          >
            {step === 0 && "Dokter K3 Mempersiapkan Instrumen..."}
            {step === 1 && "Membuka Kunci Koper Medis & Keselamatan..."}
            {step === 2 && "Koper Terbuka! Menyiapkan Peralatan PRIMA K3..."}
            {step >= 3 && "Layanan PRIMA K3 ANRI Siap Digunakan!"}
          </h2>

          <p
            style={{
              color: "#a7f3d0",
              fontSize: 14,
              margin: 0,
              opacity: 0.9,
              fontWeight: 400,
            }}
          >
            {step < 3
              ? "Klinik Pratama & Unit Keselamatan Kesehatan Kerja ANRI"
              : "Menghubungkan ke Portal Keselamatan & Kesehatan Kerja..."}
          </p>
        </div>

        {/* Hardware-accelerated Fluid Progress Bar */}
        <div
          style={{
            width: "100%",
            maxWidth: 320,
            height: 6,
            background: "rgba(255, 255, 255, 0.15)",
            borderRadius: 9999,
            marginTop: 20,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: progressStarted ? "100%" : "0%",
              height: "100%",
              background: "linear-gradient(90deg, #10b981 0%, #38bdf8 100%)",
              borderRadius: 9999,
              transition: "width 2.2s cubic-bezier(0.25, 1, 0.5, 1)",
              boxShadow: "0 0 10px rgba(56, 189, 248, 0.6)",
              willChange: "width",
            }}
          />
        </div>

        {/* Step indicator badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 16,
            fontSize: 12,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <span style={{ color: step >= 0 ? "#34d399" : "inherit" }}>
            <CheckCircleOutlined /> Siaga
          </span>
          <span>•</span>
          <span style={{ color: step >= 1 ? "#34d399" : "inherit" }}>
            <CheckCircleOutlined /> Buka Koper
          </span>
          <span>•</span>
          <span style={{ color: step >= 3 ? "#34d399" : "inherit" }}>
            <CheckCircleOutlined /> Siap Masuk
          </span>
        </div>
      </div>
    </div>
  );
};
