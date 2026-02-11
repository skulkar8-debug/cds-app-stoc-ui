import { useState, useEffect, useRef } from "react";

// ─── SHARED DESIGN TOKENS ───
const T = {
  bg: "#0B0E14",
  surface: "#111520",
  surfaceAlt: "#161B28",
  border: "#1E2536",
  borderHover: "#2A3450",
  text: "#E2E8F0",
  textMuted: "#64748B",
  textDim: "#475569",
  accent: "#3B82F6",
  accentGlow: "rgba(59,130,246,0.15)",
  green: "#10B981",
  greenDim: "rgba(16,185,129,0.12)",
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.12)",
  amber: "#F59E0B",
  amberDim: "rgba(245,158,11,0.12)",
  purple: "#8B5CF6",
  font: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  display: "'Outfit', sans-serif",
  radius: "8px",
  radiusLg: "12px",
};

const fadeIn = `
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideRight { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
@keyframes glow { 0%,100% { box-shadow: 0 0 8px rgba(59,130,246,0.3); } 50% { box-shadow: 0 0 20px rgba(59,130,246,0.5); } }
`;

const Badge = ({ children, color = T.accent, bg }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", padding: "2px 10px",
    borderRadius: "20px", fontSize: "11px", fontWeight: 600,
    color, background: bg || `${color}18`, letterSpacing: "0.02em",
  }}>{children}</span>
);

const Icon = ({ type, size = 16 }) => {
  const s = { width: size, height: size, display: "inline-block" };
  const icons = {
    folder: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.8"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>,
    plus: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    upload: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
    grid: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    search: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    target: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    brain: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a5 5 0 015 5c0 1.5-.5 2.5-1.5 3.5L12 14l-3.5-3.5C7.5 9.5 7 8.5 7 7a5 5 0 015-5z"/><path d="M12 14v8"/><path d="M8 18h8"/></svg>,
    eye: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    check: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    chevron: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
    lock: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    users: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    bell: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={T.amber} strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
    map: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
    settings: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    refresh: <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  };
  return icons[type] || null;
};

// ─── SCREEN 1: AUTH GATEWAY ───
const AuthScreen = () => (
  <div style={{ display: "flex", height: "100%", background: T.bg }}>
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", background: `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px, #3B82F6 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", animation: "fadeIn 0.8s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon type="target" size={24} />
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, fontFamily: T.display, color: T.text, letterSpacing: "-0.02em" }}>
            Target Intelligence
          </span>
        </div>
        <p style={{ color: T.textMuted, fontSize: 16, maxWidth: 320, lineHeight: 1.6, fontFamily: T.font }}>
          Compounding Intelligence<br />for Private Equity
        </p>
        <div style={{ marginTop: 48, display: "flex", gap: 16, justifyContent: "center" }}>
          {["1,240", "850", "12"].map((n, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`,
              borderRadius: T.radius, padding: "16px 24px", textAlign: "center",
              animation: `fadeIn 0.6s ease ${0.3 + i * 0.15}s both`,
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: T.text, fontFamily: T.mono }}>{n}</div>
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {["Targets", "Enriched", "Alerts"][i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{ width: 480, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 60px", background: T.surface, borderLeft: `1px solid ${T.border}` }}>
      <div style={{ animation: "slideRight 0.6s ease" }}>
        <div style={{ marginBottom: 8 }}><Icon type="lock" size={20} /></div>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: T.text, fontFamily: T.display, margin: "12px 0 6px" }}>Welcome back</h2>
        <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 32, fontFamily: T.font }}>Sign in to access your intelligence workspace.</p>
        <button style={{
          width: "100%", padding: "14px", borderRadius: T.radius, border: `1px solid ${T.border}`,
          background: T.surfaceAlt, color: T.text, fontSize: 14, fontWeight: 500, cursor: "pointer",
          fontFamily: T.font, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Sign in with SSO
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0", color: T.textDim, fontSize: 12 }}>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span>or continue with email</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>
        {["Email address", "Password"].map((label, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, color: T.textMuted, marginBottom: 6, fontWeight: 500, fontFamily: T.font }}>{label}</label>
            <input
              type={i === 1 ? "password" : "email"}
              placeholder={i === 0 ? "analyst@firm.com" : "••••••••"}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: T.radius, border: `1px solid ${T.border}`,
                background: T.bg, color: T.text, fontSize: 14, fontFamily: T.font, outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textMuted, cursor: "pointer" }}>
            <input type="checkbox" style={{ accentColor: T.accent }} /> Remember me
          </label>
          <a style={{ fontSize: 12, color: T.accent, textDecoration: "none", cursor: "pointer" }}>Forgot password?</a>
        </div>
        <button style={{
          width: "100%", padding: "14px", borderRadius: T.radius, border: "none",
          background: `linear-gradient(135deg, ${T.accent}, #2563EB)`, color: "#fff",
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: T.font,
        }}>Sign In</button>
        <p style={{ textAlign: "center", fontSize: 12, color: T.textDim, marginTop: 24 }}>
          Don't have an account? <span style={{ color: T.accent, cursor: "pointer" }}>Contact Admin</span>
        </p>
      </div>
    </div>
  </div>
);

// ─── SCREEN 2: PROJECT DASHBOARD (Phase 1) ───
const ProjectDashboard = () => {
  const [activeProject, setActiveProject] = useState(0);
  const projects = [
    { name: "Vet Clinics – CA", files: 3, rows: 1240 },
    { name: "Dental Clinics – TX", files: 1, rows: 580 },
    { name: "Pharma Distributors – US", files: 0, rows: 0 },
  ];
  const columns = ["Business Name", "Address", "Phone", "Website", "Services", "Doctors", "Rating"];
  const mockData = [
    ["Orange Grove Animal Hospital", "1234 Main St, Orange CA", "(714) 555-0123", "orangegrovevet.com", "Emergency, Oncology, Surgery", "4", "4.8"],
    ["Pacific Coast Veterinary", "5678 Pacific Hwy, San Diego CA", "(619) 555-0456", "pacificcoastvet.com", "General, Dental, Dermatology", "3", "4.5"],
    ["Bay Area Animal Care", "910 Bay Blvd, San Francisco CA", "(415) 555-0789", "bayareaanimal.com", "Emergency, Cardiology", "6", "4.9"],
    ["SoCal Pet Wellness", "2345 Sunset Dr, Los Angeles CA", "(323) 555-0234", "socalpet.com", "Wellness, Vaccination, Surgery", "2", "4.2"],
    ["Valley Vet Specialists", "6789 Valley Rd, Fresno CA", "(559) 555-0567", "valleyvet.com", "Orthopedics, Rehab, General", "5", "4.7"],
    ["Golden State Animal Hospital", "1357 Gold Ave, Sacramento CA", "(916) 555-0890", "goldenstateah.com", "Emergency, Internal Med", "3", "4.6"],
    ["Redwood Veterinary Clinic", "2468 Redwood St, Santa Rosa CA", "(707) 555-0135", "redwoodvet.com", "Exotic, Avian, General", "2", "4.3"],
    ["Coastal Paws Veterinary", "3579 Coast Rd, Monterey CA", "(831) 555-0246", "coastalpaws.com", "Surgery, Dental, Emergency", "4", "4.8"],
  ];
  return (
    <div style={{ display: "flex", height: "100%", background: T.bg }}>
      {/* Left Panel */}
      <div style={{ width: 260, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "20px 0" }}>
        <div style={{ padding: "0 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon type="target" size={14} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.display }}>Target Intel</span>
          </div>
          <button style={{
            width: "100%", padding: "10px 12px", borderRadius: T.radius, border: `1px dashed ${T.borderHover}`,
            background: "transparent", color: T.accent, fontSize: 13, fontWeight: 500, cursor: "pointer",
            fontFamily: T.font, display: "flex", alignItems: "center", gap: 8,
          }}>
            <Icon type="plus" size={14} /> New Project
          </button>
        </div>
        <div style={{ padding: "0 8px", flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 8px", marginBottom: 8 }}>Projects</div>
          {projects.map((p, i) => (
            <div key={i} onClick={() => setActiveProject(i)} style={{
              padding: "10px 12px", borderRadius: T.radius, cursor: "pointer", marginBottom: 2,
              background: activeProject === i ? T.accentGlow : "transparent",
              border: `1px solid ${activeProject === i ? T.accent + "40" : "transparent"}`,
              transition: "all 0.15s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon type="folder" size={14} />
                <span style={{ fontSize: 13, color: activeProject === i ? T.text : T.textMuted, fontWeight: activeProject === i ? 500 : 400 }}>{p.name}</span>
              </div>
              {activeProject === i && (
                <div style={{ marginTop: 6, marginLeft: 22, display: "flex", gap: 10, fontSize: 11, color: T.textDim }}>
                  <span>{p.files} files</span>
                  <span>•</span>
                  <span>{p.rows.toLocaleString()} rows</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon type="users" size={13} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>Sarah Chen</div>
              <div style={{ fontSize: 10, color: T.textDim }}>Analyst</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Collab Banner */}
        <div style={{
          padding: "10px 24px", background: T.amberDim, borderBottom: `1px solid ${T.amber}30`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          animation: "fadeIn 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.amber }}>
            <Icon type="bell" size={14} />
            <span>Updates detected from another analyst. Refresh to see the latest data.</span>
          </div>
          <button style={{
            padding: "5px 14px", borderRadius: T.radius, border: `1px solid ${T.amber}40`,
            background: "transparent", color: T.amber, fontSize: 12, fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Icon type="refresh" size={12} /> Refresh Data
          </button>
        </div>

        {/* Breadcrumbs */}
        <div style={{ padding: "16px 28px 0", display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: T.textDim }}>
          <span>Home</span><Icon type="chevron" size={10} /><span>Projects</span><Icon type="chevron" size={10} />
          <span style={{ color: T.text, fontWeight: 500 }}>{projects[activeProject].name}</span>
        </div>

        {/* Upload Area */}
        <div style={{ padding: "16px 28px" }}>
          <div style={{
            border: `2px dashed ${T.borderHover}`, borderRadius: T.radiusLg, padding: "28px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
            background: `${T.surfaceAlt}60`, transition: "all 0.2s ease",
          }}>
            <Icon type="upload" size={24} />
            <div>
              <div style={{ fontSize: 14, color: T.text, fontWeight: 500 }}>Drop CSV or Excel files here</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>or <span style={{ color: T.accent, cursor: "pointer" }}>browse files</span> • .csv, .xlsx supported</div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 12, fontSize: 12 }}>
            <span style={{ color: T.green, display: "flex", alignItems: "center", gap: 4 }}><Icon type="check" size={12} /> 2 files uploaded successfully</span>
            <span style={{ color: T.textDim }}>•</span>
            <span style={{ color: T.textMuted }}>1,240 rows added to {projects[activeProject].name}</span>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div style={{ flex: 1, padding: "0 28px 20px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text, fontFamily: T.display, margin: 0 }}>Intelligence Grid</h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: T.radius,
                background: T.surfaceAlt, border: `1px solid ${T.border}`, fontSize: 12,
              }}>
                <Icon type="search" size={13} />
                <span style={{ color: T.textDim }}>Search records...</span>
              </div>
              <Badge color={T.textMuted} bg={T.surfaceAlt}>Page 1 of 25</Badge>
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", borderRadius: T.radiusLg, border: `1px solid ${T.border}`, background: T.surface }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: T.font }}>
              <thead>
                <tr>
                  {columns.map((col, i) => (
                    <th key={i} style={{
                      position: "sticky", top: 0, zIndex: 2, padding: "10px 14px", textAlign: "left",
                      background: T.surfaceAlt, borderBottom: `1px solid ${T.border}`,
                      fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: "uppercase",
                      letterSpacing: "0.06em", whiteSpace: "nowrap", cursor: "pointer",
                    }}>{col} ↕</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockData.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: `1px solid ${T.border}08` }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{
                        padding: "10px 14px", color: ci === 0 ? T.text : T.textMuted,
                        fontWeight: ci === 0 ? 500 : 400, whiteSpace: "nowrap",
                        ...(ci === 3 ? { color: T.accent, cursor: "pointer" } : {}),
                        ...(ci === 6 ? { color: parseFloat(cell) >= 4.7 ? T.green : T.textMuted, fontFamily: T.mono, fontWeight: 600 } : {}),
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN 3: COMMAND DASHBOARD ───
const CommandDashboard = () => {
  const stats = [
    { label: "Total Targets", value: "1,240", icon: "target", color: T.accent },
    { label: "Enriched Candidates", value: "850", icon: "brain", color: T.green },
    { label: "Watcher Alerts", value: "12 New", icon: "bell", color: T.amber },
  ];
  const projects = [
    { name: "Veterinary Clinics - CA", progress: 450, total: 1000, status: "Active" },
    { name: "Dental Spas - TX", progress: 280, total: 600, status: "Active" },
    { name: "Pharma Distributors - US", progress: 50, total: 800, status: "Queued" },
    { name: "Med Devices - Northeast", progress: 120, total: 400, status: "Active" },
  ];
  const activities = [
    { msg: "AI Agent found 'Managed Services' for Orange Grove Animal Hospital", time: "2m ago" },
    { msg: "450 new targets ingested for Veterinary Clinics - CA", time: "15m ago" },
    { msg: "Watcher detected website change: Pacific Coast Vet", time: "1h ago" },
    { msg: "Scoring complete: Dental Spas - TX (280 processed)", time: "2h ago" },
    { msg: "New analyst 'J.Park' joined Pharma Distributors workspace", time: "3h ago" },
  ];
  const sideItems = [
    { icon: "grid", label: "Dashboard", active: true },
    { icon: "search", label: "Scrape" },
    { icon: "target", label: "Targets" },
    { icon: "map", label: "Strategies" },
    { icon: "settings", label: "Settings" },
  ];

  return (
    <div style={{ display: "flex", height: "100%", background: T.bg }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "20px 0" }}>
        <div style={{ padding: "0 16px", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon type="target" size={14} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: T.display }}>Target Intel</span>
          </div>
        </div>
        <div style={{ padding: "0 8px", flex: 1 }}>
          {sideItems.map((item, i) => (
            <div key={i} style={{
              padding: "9px 12px", borderRadius: T.radius, cursor: "pointer", marginBottom: 2,
              background: item.active ? T.accentGlow : "transparent",
              border: `1px solid ${item.active ? T.accent + "30" : "transparent"}`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Icon type={item.icon} size={15} />
              <span style={{ fontSize: 13, color: item.active ? T.text : T.textMuted, fontWeight: item.active ? 500 : 400 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: T.textDim, marginBottom: 4 }}>Home › Dashboard</div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: T.text, fontFamily: T.display, margin: 0 }}>Command Dashboard</h1>
          </div>
          <button style={{
            padding: "10px 18px", borderRadius: T.radius, border: "none",
            background: `linear-gradient(135deg, ${T.accent}, #2563EB)`, color: "#fff",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: T.font,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Icon type="plus" size={14} /> New Thesis
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg,
              padding: "22px 24px", animation: `fadeIn 0.5s ease ${i * 0.1}s both`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Icon type={s.icon} size={16} />
                <span style={{ fontSize: 12, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: s.color, fontFamily: T.mono }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Active Searches */}
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 14, fontFamily: T.display }}>Active Searches</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {projects.map((p, i) => (
                <div key={i} style={{
                  background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg,
                  padding: "18px", animation: `slideUp 0.5s ease ${0.2 + i * 0.08}s both`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{p.name}</span>
                    <Badge color={p.status === "Active" ? T.green : T.textDim}>{p.status}</Badge>
                  </div>
                  <div style={{ background: T.bg, borderRadius: 6, height: 6, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ height: "100%", width: `${(p.progress / p.total) * 100}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.green})`, borderRadius: 6, transition: "width 0.6s ease" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: T.textDim, fontFamily: T.mono }}>{p.progress}/{p.total} Processed</span>
                    <span style={{ fontSize: 11, color: T.accent, cursor: "pointer", fontWeight: 500 }}>Resume →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 14, fontFamily: T.display }}>Recent Activity</h3>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, overflow: "hidden" }}>
              {activities.map((a, i) => (
                <div key={i} style={{
                  padding: "14px 18px", borderBottom: i < activities.length - 1 ? `1px solid ${T.border}` : "none",
                  animation: `slideRight 0.4s ease ${0.3 + i * 0.06}s both`,
                }}>
                  <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.4 }}>{a.msg}</div>
                  <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN 4: THESIS ARCHITECT ───
const ThesisArchitect = () => {
  const rules = [
    { field: "Services", operator: "contains", value: "Oncology", points: "+2.5" },
    { field: "Services", operator: "contains", value: "Emergency", points: "+3.0" },
    { field: "Doctors", operator: ">=", value: "3", points: "+1.5" },
    { field: "Rating", operator: ">=", value: "4.5", points: "+1.0" },
  ];
  const jsonPreview = JSON.stringify({
    name: "Vet Clinics - CA",
    sector: "Veterinary",
    positive_keywords: ["Veterinarian", "Animal Hospital"],
    negative_keywords: ["Pet Store", "Grooming", "Non-profit"],
    scoring: rules.map(r => ({
      if: { field: r.field, [r.operator]: r.value },
      then: { add_points: parseFloat(r.points) }
    }))
  }, null, 2);

  return (
    <div style={{ display: "flex", height: "100%", background: T.bg }}>
      {/* Left - Inputs */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 32px", borderRight: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 12, color: T.textDim, marginBottom: 4 }}>Home › Thesis Architect</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: T.text, fontFamily: T.display, margin: "0 0 24px" }}>Configure AI Thesis</h1>

        {/* Metadata */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Thesis Metadata</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["Thesis Name", "Vet Clinics - CA"], ["Target Sector", "Veterinary"]].map(([label, val], i) => (
              <div key={i}>
                <label style={{ fontSize: 12, color: T.textMuted, marginBottom: 6, display: "block" }}>{label}</label>
                <input readOnly value={val} style={{
                  width: "100%", padding: "10px 12px", borderRadius: T.radius, border: `1px solid ${T.border}`,
                  background: T.surface, color: T.text, fontSize: 13, fontFamily: T.font, boxSizing: "border-box",
                }} />
              </div>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Keywords</div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: T.green, marginBottom: 6, display: "block", fontWeight: 500 }}>✓ Must Include</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Veterinarian", "Animal Hospital"].map((kw, i) => (
                <span key={i} style={{ padding: "5px 12px", borderRadius: 20, background: T.greenDim, color: T.green, fontSize: 12, fontWeight: 500, border: `1px solid ${T.green}30` }}>{kw} ×</span>
              ))}
              <span style={{ padding: "5px 12px", borderRadius: 20, border: `1px dashed ${T.borderHover}`, color: T.textDim, fontSize: 12, cursor: "pointer" }}>+ Add</span>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: T.red, marginBottom: 6, display: "block", fontWeight: 500 }}>✕ Must Exclude</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Pet Store", "Grooming", "Non-profit"].map((kw, i) => (
                <span key={i} style={{ padding: "5px 12px", borderRadius: 20, background: T.redDim, color: T.red, fontSize: 12, fontWeight: 500, border: `1px solid ${T.red}30` }}>{kw} ×</span>
              ))}
              <span style={{ padding: "5px 12px", borderRadius: 20, border: `1px dashed ${T.borderHover}`, color: T.textDim, fontSize: 12, cursor: "pointer" }}>+ Add</span>
            </div>
          </div>
        </div>

        {/* Scoring Rules */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Scoring Logic</div>
          <div style={{ background: T.surface, borderRadius: T.radiusLg, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px 40px", gap: 0, padding: "10px 14px", borderBottom: `1px solid ${T.border}`, fontSize: 11, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
              <span>If Field</span><span>Operator</span><span>Value</span><span>Points</span><span></span>
            </div>
            {rules.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 80px 40px", gap: 0, padding: "10px 14px", borderBottom: i < rules.length - 1 ? `1px solid ${T.border}08` : "none", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: T.text }}>{r.field}</span>
                <span style={{ fontSize: 13, color: T.textMuted }}>{r.operator}</span>
                <span style={{ fontSize: 13, color: T.text, fontFamily: T.mono }}>{r.value}</span>
                <Badge color={T.green}>{r.points}</Badge>
                <span style={{ color: T.textDim, cursor: "pointer", fontSize: 16 }}>×</span>
              </div>
            ))}
            <div style={{ padding: "10px 14px" }}>
              <span style={{ fontSize: 12, color: T.accent, cursor: "pointer", fontWeight: 500 }}>+ Add Rule</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.text, cursor: "pointer" }}>
            <div style={{ width: 36, height: 20, borderRadius: 10, background: T.green, position: "relative" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, right: 2 }} />
            </div>
            Set Active
          </label>
          <button style={{ padding: "10px 24px", borderRadius: T.radius, border: "none", background: `linear-gradient(135deg, ${T.accent}, #2563EB)`, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Save Thesis
          </button>
        </div>
      </div>

      {/* Right - Preview */}
      <div style={{ width: 420, overflow: "auto", padding: "28px 24px", background: T.surface }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Live JSON Preview</div>
        <pre style={{
          background: T.bg, borderRadius: T.radiusLg, border: `1px solid ${T.border}`,
          padding: 18, fontSize: 11.5, color: T.textMuted, fontFamily: T.mono,
          lineHeight: 1.6, overflow: "auto", whiteSpace: "pre-wrap",
        }}>{jsonPreview}</pre>

        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Test Drive</div>
          <textarea placeholder="Paste a website snippet here to test your scoring rules..." style={{
            width: "100%", height: 100, padding: 14, borderRadius: T.radius, border: `1px solid ${T.border}`,
            background: T.bg, color: T.text, fontSize: 13, fontFamily: T.font, resize: "none", boxSizing: "border-box",
          }} defaultValue="We are a full-service animal hospital offering emergency care, oncology, and orthopedic surgery with 5 board-certified veterinarians." />
          <button style={{
            marginTop: 10, padding: "9px 18px", borderRadius: T.radius, border: `1px solid ${T.accent}40`,
            background: T.accentGlow, color: T.accent, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Test Score</button>
          <div style={{
            marginTop: 14, padding: 16, borderRadius: T.radius, background: T.greenDim,
            border: `1px solid ${T.green}30`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.green, marginBottom: 6 }}>✓ MATCH — Score: 8.0</div>
            <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.5 }}>
              +3.0 Emergency care detected<br/>
              +2.5 Oncology detected<br/>
              +1.5 Doctor count ≥ 3<br/>
              +1.0 Rating threshold met
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN 5: INTELLIGENCE GRID ───
const IntelligenceGrid = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const data = [
    { rank: 9.5, name: "Orange Grove Animal Hospital", site: "orangegrovevet.com", doctors: 6, emergency: true, services: "Oncology, Surgery, Emergency", status: "Review" },
    { rank: 8.2, name: "Bay Area Animal Care", site: "bayareaanimal.com", doctors: 4, emergency: true, services: "Cardiology, Emergency", status: "Approved" },
    { rank: 7.8, name: "Pacific Coast Veterinary", site: "pacificcoastvet.com", doctors: 3, emergency: false, services: "Dental, Dermatology", status: "Review" },
    { rank: 6.5, name: "Valley Vet Specialists", site: "valleyvet.com", doctors: 5, emergency: false, services: "Ortho, Rehab, General", status: "Processing" },
    { rank: 5.1, name: "SoCal Pet Wellness", site: "socalpet.com", doctors: 2, emergency: false, services: "Wellness, Vaccination", status: "Review" },
    { rank: 4.3, name: "Coastal Paws Veterinary", site: "coastalpaws.com", doctors: 2, emergency: false, services: "Dental, General", status: "Review" },
    { rank: 3.0, name: "Redwood Veterinary Clinic", site: "redwoodvet.com", doctors: 1, emergency: false, services: "Exotic, Avian", status: "Rejected" },
  ];
  const rankColor = r => r >= 8 ? T.green : r >= 5 ? T.amber : T.textDim;

  return (
    <div style={{ display: "flex", height: "100%", background: T.bg }}>
      {/* Main Grid */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "20px 28px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: T.textDim, marginBottom: 4 }}>Home › Targets</div>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: T.text, fontFamily: T.display, margin: 0 }}>Intelligence Grid</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: T.radius,
              background: T.surface, border: `1px solid ${T.border}`, fontSize: 12, color: T.textMuted,
            }}>
              <Icon type="search" size={13} /> Filter: Review Required ▾
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: T.radius,
              background: T.surface, border: `1px solid ${T.border}`, fontSize: 12, color: T.textMuted,
            }}>
              Sort: Rank ↓
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: "0 28px 20px", overflow: "auto" }}>
          <div style={{ borderRadius: T.radiusLg, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: T.font }}>
              <thead>
                <tr>
                  {["Rank", "Business", "Website", "Doctors", "Emergency", "AI Signals", "Status"].map((h, i) => (
                    <th key={i} style={{
                      position: "sticky", top: 0, padding: "11px 14px", textAlign: "left", background: T.surface,
                      borderBottom: `1px solid ${T.border}`, fontSize: 11, fontWeight: 600, color: T.textDim,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, ri) => (
                  <tr key={ri} onClick={() => setSelectedRow(ri)} style={{
                    cursor: "pointer", borderBottom: `1px solid ${T.border}08`,
                    background: selectedRow === ri ? T.accentGlow : "transparent",
                    transition: "background 0.15s ease",
                  }}>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: rankColor(row.rank), fontFamily: T.mono }}>{row.rank}</span>
                    </td>
                    <td style={{ padding: "12px 14px", color: T.text, fontWeight: 500 }}>{row.name}</td>
                    <td style={{ padding: "12px 14px", color: T.accent, fontSize: 12 }}>{row.site}</td>
                    <td style={{ padding: "12px 14px", fontFamily: T.mono, color: T.text, textAlign: "center" }}>{row.doctors}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <Badge color={row.emergency ? T.green : T.textDim} bg={row.emergency ? T.greenDim : T.surfaceAlt}>
                        {row.emergency ? "Yes" : "No"}
                      </Badge>
                    </td>
                    <td style={{ padding: "12px 14px", color: T.textMuted, fontSize: 12 }}>{row.services}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <Badge color={
                        row.status === "Approved" ? T.green : row.status === "Rejected" ? T.red :
                        row.status === "Processing" ? T.amber : T.accent
                      }>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Evidence Drawer */}
      {selectedRow !== null && (
        <div style={{
          width: 380, background: T.surface, borderLeft: `1px solid ${T.border}`,
          display: "flex", flexDirection: "column", animation: "slideRight 0.25s ease",
          overflow: "auto",
        }}>
          <div style={{ padding: "20px 22px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: "0 0 4px", fontFamily: T.display }}>{data[selectedRow].name}</h3>
                <span style={{ fontSize: 12, color: T.accent }}>{data[selectedRow].site}</span>
              </div>
              <span onClick={() => setSelectedRow(null)} style={{ cursor: "pointer", color: T.textDim, fontSize: 20 }}>×</span>
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 11, color: T.textDim, marginBottom: 4, display: "block", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Override Rank</label>
              <input readOnly value={data[selectedRow].rank} style={{
                width: 80, padding: "8px 10px", borderRadius: T.radius, border: `1px solid ${T.border}`,
                background: T.bg, color: T.text, fontSize: 18, fontWeight: 700, fontFamily: T.mono, textAlign: "center",
              }} />
            </div>
          </div>
          <div style={{ padding: "18px 22px", flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>AI Evidence</div>
            {[
              { claim: "Offers Emergency Care", proof: "We are open 24/7 for all pet emergencies..." },
              { claim: "Oncology Department", proof: "Our board-certified oncologist Dr. Rivera specializes in..." },
              { claim: "6 Licensed Veterinarians", proof: "Meet our team of 6 experienced veterinarians..." },
            ].map((e, i) => (
              <div key={i} style={{
                marginBottom: 14, padding: 14, borderRadius: T.radius,
                background: T.bg, border: `1px solid ${T.border}`,
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 6 }}>{e.claim}</div>
                <div style={{
                  fontSize: 12, color: T.textMuted, lineHeight: 1.5, padding: "6px 10px",
                  borderLeft: `3px solid ${T.amber}`, background: T.amberDim, borderRadius: "0 4px 4px 0",
                }}>"{e.proof}"</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "16px 22px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 10 }}>
            <button style={{
              flex: 1, padding: "12px", borderRadius: T.radius, border: "none",
              background: T.green, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>✓ Approve Target</button>
            <button style={{
              flex: 1, padding: "12px", borderRadius: T.radius, border: "none",
              background: T.red, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>✕ Reject</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SCREEN 6: WATCHER STRATEGY HUB ───
const WatcherHub = () => {
  const markets = [
    { name: "Dallas-Fort Worth", targets: 520, avgRank: 6.8, lastScan: "2 days ago", tier: 1 },
    { name: "Los Angeles Metro", targets: 890, avgRank: 5.9, lastScan: "5 days ago", tier: 1 },
    { name: "San Francisco Bay", targets: 340, avgRank: 7.2, lastScan: "1 day ago", tier: 1 },
    { name: "Austin-Round Rock", targets: 210, avgRank: 5.4, lastScan: "12 days ago", tier: 2 },
    { name: "San Diego", targets: 180, avgRank: 6.1, lastScan: "8 days ago", tier: 2 },
    { name: "Sacramento", targets: 120, avgRank: 4.8, lastScan: "20 days ago", tier: 3 },
  ];
  const tiers = [
    { level: 1, label: "High Priority", freq: "Every 15 Days", color: T.green, count: 3 },
    { level: 2, label: "Medium Priority", freq: "Every 30 Days", color: T.amber, count: 2 },
    { level: 3, label: "Low Priority", freq: "Every 60 Days", color: T.textDim, count: 1 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg, overflow: "auto" }}>
      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 12, color: T.textDim, marginBottom: 4 }}>Home › Strategies</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: T.text, fontFamily: T.display, margin: 0 }}>Watcher Strategy Hub</h1>
          <div style={{ fontSize: 12, color: T.textMuted }}>Next scheduled scan: <span style={{ color: T.green, fontWeight: 600, fontFamily: T.mono }}>4h 23m</span></div>
        </div>
      </div>

      {/* Map Placeholder + Markets Table */}
      <div style={{ padding: "0 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Map */}
        <div style={{
          background: T.surface, borderRadius: T.radiusLg, border: `1px solid ${T.border}`,
          padding: 20, minHeight: 240, position: "relative", overflow: "hidden",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Geographic Command Center</div>
          <svg viewBox="0 0 960 600" style={{ width: "100%", height: "auto", opacity: 0.15 }}>
            <path d="M233 453l3-17 9-8 16 2 18-13 4-16 15-8 12-18 20-2 13-12 28-4 18-10 8-15 22-6 15 7 24-4 18-12 12-20 26-8 10-14 20 2 16-8 22-14 14-4 12 6 18-6 24-2 20-10 16 4 8 12 14 6 22-2 18-8 14 4 10 14 6 18-2 16-8 12-16 8-10 14 2 20 12 16 4 22-6 14-14 8-12-2-18-10-14-6-10 8-6 16 4 18-8 14-18 6-24-2-16-10-12 6-8 16-18 10-22-4-14-12-10 8-20 2-16-14-26 6-18-8-12 4-14 14-20 8-22-2-16-12-8 6-10 16-14 4-18-8z" fill={T.accent}/>
          </svg>
          {/* Market dots */}
          {[
            { x: "72%", y: "62%", label: "DFW", active: true },
            { x: "18%", y: "55%", label: "LA", active: true },
            { x: "12%", y: "38%", label: "SF", active: true },
            { x: "60%", y: "68%", label: "ATX", active: false },
            { x: "16%", y: "58%", label: "SD", active: false },
          ].map((dot, i) => (
            <div key={i} style={{
              position: "absolute", left: dot.x, top: dot.y, transform: "translate(-50%,-50%)",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <div style={{
                width: dot.active ? 10 : 7, height: dot.active ? 10 : 7, borderRadius: "50%",
                background: dot.active ? T.green : T.textDim,
                boxShadow: dot.active ? `0 0 12px ${T.green}80` : "none",
                animation: dot.active ? "pulse 2s infinite" : "none",
              }} />
              <span style={{ fontSize: 9, color: T.textMuted, fontWeight: 600, fontFamily: T.mono }}>{dot.label}</span>
            </div>
          ))}
        </div>

        {/* Markets Table */}
        <div style={{ background: T.surface, borderRadius: T.radiusLg, border: `1px solid ${T.border}`, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em" }}>CBSA Markets</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr>
                {["Market", "Targets", "Avg Rank", "Last Scan", "Tier"].map((h, i) => (
                  <th key={i} style={{ padding: "8px 14px", textAlign: "left", borderBottom: `1px solid ${T.border}`, fontSize: 10, color: T.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {markets.map((m, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.border}08` }}>
                  <td style={{ padding: "10px 14px", color: T.text, fontWeight: 500, fontSize: 13 }}>{m.name}</td>
                  <td style={{ padding: "10px 14px", color: T.textMuted, fontFamily: T.mono }}>{m.targets}</td>
                  <td style={{ padding: "10px 14px", color: rankC(m.avgRank), fontFamily: T.mono, fontWeight: 600 }}>{m.avgRank}</td>
                  <td style={{ padding: "10px 14px", color: T.textDim }}>{m.lastScan}</td>
                  <td style={{ padding: "10px 14px" }}><Badge color={tiers[m.tier - 1].color}>Tier {m.tier}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategy Tiers */}
      <div style={{ padding: "0 28px 28px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Strategy Configuration</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {tiers.map((t, i) => (
            <div key={i} style={{
              background: T.surface, borderRadius: T.radiusLg, border: `1px solid ${T.border}`,
              padding: 22, animation: `slideUp 0.5s ease ${i * 0.1}s both`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <Badge color={t.color}>Tier {t.level} — {t.label}</Badge>
                <span style={{ fontSize: 11, color: T.textDim }}>{t.count} markets</span>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>Re-scan Frequency</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 6, background: T.bg, borderRadius: 3, position: "relative" }}>
                    <div style={{ width: `${(60 - parseInt(t.freq)) / 60 * 100}%`, height: "100%", background: t.color, borderRadius: 3 }} />
                    <div style={{
                      position: "absolute", top: -5, left: `${(60 - parseInt(t.freq)) / 60 * 100}%`, transform: "translateX(-50%)",
                      width: 16, height: 16, borderRadius: "50%", background: t.color, border: `3px solid ${T.surface}`,
                    }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: T.mono, minWidth: 80, textAlign: "right" }}>{t.freq}</span>
                </div>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.textMuted, cursor: "pointer" }}>
                <div style={{ width: 32, height: 18, borderRadius: 9, background: i < 2 ? T.green : T.surfaceAlt, position: "relative" }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, ...(i < 2 ? { right: 2 } : { left: 2 }) }} />
                </div>
                Resurrect Archived
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const rankC = r => r >= 7 ? T.green : r >= 5 ? T.amber : T.textDim;

// ─── MAIN APP ───
const screens = [
  { key: "auth", label: "Auth Gateway", icon: "lock" },
  { key: "project", label: "Project Dashboard", icon: "folder" },
  { key: "command", label: "Command Dashboard", icon: "grid" },
  { key: "thesis", label: "Thesis Architect", icon: "brain" },
  { key: "intel", label: "Intelligence Grid", icon: "target" },
  { key: "watcher", label: "Watcher Hub", icon: "eye" },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState("project");

  return (
    <div style={{ fontFamily: T.font, height: "100vh", display: "flex", flexDirection: "column", background: T.bg, color: T.text }}>
      <style>{fadeIn}{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        input:focus { border-color: ${T.accent} !important; outline: none; }
        button:hover { opacity: 0.9; }
        tr:hover { background: ${T.accentGlow} !important; }
      `}</style>

      {/* Screen Selector Nav */}
      <div style={{
        display: "flex", alignItems: "center", gap: 2, padding: "8px 12px",
        background: T.surface, borderBottom: `1px solid ${T.border}`, overflowX: "auto",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginRight: 12, whiteSpace: "nowrap" }}>Screens</span>
        {screens.map((s) => (
          <button key={s.key} onClick={() => setActiveScreen(s.key)} style={{
            padding: "6px 14px", borderRadius: T.radius, border: `1px solid ${activeScreen === s.key ? T.accent + "50" : "transparent"}`,
            background: activeScreen === s.key ? T.accentGlow : "transparent",
            color: activeScreen === s.key ? T.text : T.textMuted,
            fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: T.font, whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Icon type={s.icon} size={12} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Screen Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activeScreen === "auth" && <AuthScreen />}
        {activeScreen === "project" && <ProjectDashboard />}
        {activeScreen === "command" && <CommandDashboard />}
        {activeScreen === "thesis" && <ThesisArchitect />}
        {activeScreen === "intel" && <IntelligenceGrid />}
        {activeScreen === "watcher" && <WatcherHub />}
      </div>
    </div>
  );
}
