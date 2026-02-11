import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════
   DESIGN TOKENS — High contrast light text
   ═══════════════════════════════════════════ */
const T = {
  bg: "#0B0D11",
  bgCard: "#12151C",
  bgElevated: "#1A1E28",
  bgHover: "#1F2430",
  border: "#232836",
  borderSubtle: "#1A1E28",
  text: "#E9ECF2",
  textSecondary: "#B0B6C3",
  textMuted: "#6E7589",
  textDim: "#454C5E",
  accent: "#4B8EF5",
  accentGlow: "rgba(75,142,245,0.12)",
  accentBorder: "rgba(75,142,245,0.25)",
  green: "#34D399",
  greenDim: "rgba(52,211,153,0.10)",
  red: "#F87171",
  redDim: "rgba(248,113,113,0.10)",
  amber: "#FBBF24",
  amberDim: "rgba(251,191,36,0.10)",
  purple: "#A78BFA",
  purpleDim: "rgba(167,139,250,0.10)",
  cyan: "#22D3EE",
  radius: "6px",
  font: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
  fontSans: "'DM Sans', -apple-system, 'Segoe UI', sans-serif",
};

/* ═══════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════ */
const PROJECTS = [
  { id: 1, name: "Vet Clinics – CA", desc: "California veterinary acquisition targets", count: 1240, enriched: 850 },
  { id: 2, name: "Dental Clinics – TX", desc: "Texas dental practice roll-up", count: 890, enriched: 612 },
  { id: 3, name: "Pharma Distributors – US", desc: "National pharma distribution", count: 2100, enriched: 1450 },
  { id: 4, name: "Med Spas – FL", desc: "Florida medical spa consolidation", count: 560, enriched: 340 },
];

const GRID_DATA = [
  { id: 1, rank: 9.5, name: "Pacific Coast Animal Hospital", city: "San Diego", state: "CA", website: "pacificcoastah.com", doctors: 8, emergency: true, services: "Oncology, Ortho, Dental, Emergency", revenue: "$4.2M", status: "Review", signals: 12 },
  { id: 2, rank: 9.2, name: "Bay Area Veterinary Specialists", city: "San Francisco", state: "CA", website: "bavs.com", doctors: 12, emergency: true, services: "Surgery, Cardiology, Neuro", revenue: "$6.8M", status: "Approved", signals: 15 },
  { id: 3, rank: 8.8, name: "Orange Grove Animal Hospital", city: "Orange", state: "CA", website: "ogah.com", doctors: 5, emergency: true, services: "Emergency, Dental, Wellness", revenue: "$2.9M", status: "Review", signals: 9 },
  { id: 4, rank: 8.3, name: "Sacramento Valley Vet Center", city: "Sacramento", state: "CA", website: "sacvalleyvet.com", doctors: 6, emergency: false, services: "General, Dental, Surgery", revenue: "$3.1M", status: "Processing", signals: 7 },
  { id: 5, rank: 7.9, name: "Marin County Pet Care", city: "Novato", state: "CA", website: "marinpetcare.com", doctors: 4, emergency: false, services: "Wellness, Dental, Boarding", revenue: "$1.8M", status: "Review", signals: 6 },
  { id: 6, rank: 7.5, name: "Central Valley Animal Clinic", city: "Fresno", state: "CA", website: "cvac.com", doctors: 3, emergency: false, services: "General, Vaccines, Surgery", revenue: "$1.4M", status: "Review", signals: 5 },
  { id: 7, rank: 7.1, name: "Silicon Valley Vet Partners", city: "San Jose", state: "CA", website: "svvp.com", doctors: 7, emergency: true, services: "Emergency, Oncology, Rehab", revenue: "$5.1M", status: "Approved", signals: 11 },
  { id: 8, rank: 6.8, name: "LA Metro Animal Hospital", city: "Los Angeles", state: "CA", website: "lametroah.com", doctors: 9, emergency: true, services: "Emergency, ICU, Surgery, Dental", revenue: "$7.2M", status: "Processing", signals: 13 },
  { id: 9, rank: 6.2, name: "Napa Valley Pet Hospital", city: "Napa", state: "CA", website: "napapet.com", doctors: 2, emergency: false, services: "General, Wellness", revenue: "$0.9M", status: "Review", signals: 3 },
  { id: 10, rank: 5.5, name: "Inland Empire Vet Group", city: "Riverside", state: "CA", website: "ievg.com", doctors: 4, emergency: false, services: "General, Dental, Exotic", revenue: "$2.0M", status: "Archived", signals: 4 },
];

const ACTIVITIES = [
  { time: "2m ago", text: "AI Agent found 'Managed Services' keyword for Orange Grove Animal Hospital", type: "signal" },
  { time: "5m ago", text: "Website change detected: Pacific Coast AH updated services page", type: "watcher" },
  { time: "12m ago", text: "Enrichment complete: Bay Area Veterinary Specialists — 15 signals extracted", type: "enrichment" },
  { time: "18m ago", text: "New doctor listing found for Silicon Valley Vet Partners (+1 Doctor)", type: "signal" },
  { time: "25m ago", text: "Thesis scoring updated: 3 targets moved to Review queue", type: "scoring" },
  { time: "1h ago", text: "Watcher scan completed for Sacramento CBSA — 45 targets refreshed", type: "watcher" },
  { time: "2h ago", text: "Analyst Mark approved 8 targets in Vet Clinics – CA", type: "action" },
];

const THESIS_RULES = [
  { field: "Services", operator: "contains", value: "Oncology", points: 2.5 },
  { field: "Services", operator: "contains", value: "Emergency", points: 2.0 },
  { field: "Doctors", operator: "greater_than", value: "5", points: 1.5 },
  { field: "Revenue", operator: "greater_than", value: "$2M", points: 1.0 },
  { field: "Services", operator: "contains", value: "Surgery", points: 1.0 },
];

const CBSA_DATA = [
  { name: "San Francisco-Oakland", targets: 320, avgRank: 7.8, lastScan: "2 days ago", tier: 1 },
  { name: "Los Angeles-Long Beach", targets: 480, avgRank: 6.9, lastScan: "3 days ago", tier: 1 },
  { name: "San Diego-Carlsbad", targets: 210, avgRank: 8.1, lastScan: "1 day ago", tier: 1 },
  { name: "Sacramento-Roseville", targets: 145, avgRank: 6.2, lastScan: "5 days ago", tier: 2 },
  { name: "San Jose-Sunnyvale", targets: 190, avgRank: 7.4, lastScan: "4 days ago", tier: 2 },
  { name: "Fresno-Madera", targets: 85, avgRank: 5.1, lastScan: "12 days ago", tier: 3 },
];

/* ═══════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════ */
function Badge({ children, color = T.accent, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "3px 9px",
      borderRadius: "4px", fontSize: "10.5px", fontWeight: 600,
      fontFamily: T.font, letterSpacing: "0.03em",
      color: color,
      background: bg || (color === T.green ? T.greenDim : color === T.red ? T.redDim : color === T.amber ? T.amberDim : color === T.purple ? T.purpleDim : T.accentGlow),
    }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, accent = T.accent }) {
  return (
    <div style={{
      background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius,
      padding: "20px 22px", flex: 1, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: accent }} />
      <div style={{ fontSize: "10.5px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: T.font, marginBottom: "10px" }}>{label}</div>
      <div style={{ fontSize: "26px", fontWeight: 700, fontFamily: T.font, color: T.text, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "11px", color: T.textSecondary, marginTop: "8px" }}>{sub}</div>}
    </div>
  );
}

function Input({ placeholder, value, onChange, type = "text", style: s }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{
      width: "100%", padding: "10px 14px", background: T.bgElevated,
      border: `1px solid ${T.border}`, borderRadius: T.radius,
      color: T.text, fontSize: "13px", fontFamily: T.fontSans,
      outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", ...s,
    }}
    onFocus={e => e.target.style.borderColor = T.accent}
    onBlur={e => e.target.style.borderColor = T.border} />
  );
}

function Btn({ children, primary, danger, onClick, style: s, disabled }) {
  const bg = primary ? T.accent : danger ? T.red : "transparent";
  const clr = primary ? "#fff" : danger ? "#fff" : T.textSecondary;
  return (
    <button disabled={disabled} onClick={onClick} style={{
      padding: "9px 18px", background: bg, color: clr,
      border: primary || danger ? "none" : `1px solid ${T.border}`,
      borderRadius: T.radius, fontSize: "12.5px", fontWeight: 600,
      fontFamily: T.fontSans, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1, transition: "all 0.15s",
      display: "inline-flex", alignItems: "center", gap: "6px",
      whiteSpace: "nowrap", ...s,
    }}>{children}</button>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR NAVIGATION — Clear, readable
   ═══════════════════════════════════════════ */
function Sidebar({ screen, setScreen }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: "⊞", badge: null },
    { key: "project",   label: "Projects",  icon: "◧", badge: "4" },
    { key: "thesis",    label: "Thesis",     icon: "◈", badge: null },
    { key: "watcher",   label: "Watcher",    icon: "◉", badge: "12" },
  ];

  return (
    <div style={{
      width: "230px", background: T.bgCard, borderRight: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column", flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: `linear-gradient(135deg, ${T.accent}, ${T.cyan})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 800, color: "#fff", fontFamily: T.font,
          }}>TI</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: T.text, letterSpacing: "-0.01em" }}>Target Intel</div>
            <div style={{ fontSize: "10px", color: T.textMuted, fontFamily: T.font }}>Intelligence Platform</div>
          </div>
        </div>
      </div>

      {/* Section Label */}
      <div style={{ padding: "16px 18px 6px" }}>
        <div style={{ fontSize: "9.5px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: T.font, fontWeight: 700 }}>Navigation</div>
      </div>

      {/* Nav Items */}
      <div style={{ padding: "0 10px", flex: 1 }}>
        {items.map(item => {
          const active = screen === item.key;
          return (
            <div key={item.key} onClick={() => setScreen(item.key)}
              style={{
                padding: "10px 12px", borderRadius: T.radius, cursor: "pointer",
                display: "flex", alignItems: "center", gap: "10px",
                background: active ? T.accentGlow : "transparent",
                border: active ? `1px solid ${T.accentBorder}` : "1px solid transparent",
                color: active ? T.accent : T.textSecondary,
                fontSize: "13px", fontWeight: active ? 600 : 400,
                marginBottom: "4px", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = T.bgHover; e.currentTarget.style.color = T.text; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = active ? T.accentGlow : "transparent"; e.currentTarget.style.color = active ? T.accent : T.textSecondary; }}}
            >
              <span style={{ fontFamily: T.font, fontSize: "15px", width: "20px", textAlign: "center", opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ fontSize: "10px", fontFamily: T.font, color: active ? T.accent : T.textMuted, background: active ? "rgba(75,142,245,0.2)" : T.bgElevated, padding: "2px 7px", borderRadius: "4px", fontWeight: 600 }}>{item.badge}</span>}
            </div>
          );
        })}
      </div>

      {/* User card */}
      <div style={{ padding: "14px 18px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 700, color: "#fff",
          }}>JD</div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: T.text }}>John Doe</div>
            <div style={{ fontSize: "10px", color: T.textMuted }}>Analyst</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TOP BAR
   ═══════════════════════════════════════════ */
function TopBar({ breadcrumb }) {
  return (
    <div style={{
      height: "52px", borderBottom: `1px solid ${T.border}`, display: "flex",
      alignItems: "center", padding: "0 28px", gap: "16px", flexShrink: 0,
      background: T.bgCard,
    }}>
      <div style={{ fontSize: "11px", fontFamily: T.font }}>
        <span style={{ color: T.textMuted }}>Home</span>
        <span style={{ color: T.textDim, margin: "0 8px" }}>›</span>
        <span style={{ color: T.text, fontWeight: 600 }}>{breadcrumb}</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: T.green, boxShadow: `0 0 6px ${T.green}` }} />
        <span style={{ fontSize: "11px", color: T.textSecondary, fontFamily: T.font }}>Connected</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   1. LOGIN SCREEN
   ═══════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.fontSans, color: T.text }}>
      {/* Left branding */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", padding: "60px",
        background: `radial-gradient(ellipse at 30% 50%, rgba(75,142,245,0.06) 0%, transparent 70%)`,
        borderRight: `1px solid ${T.border}`,
      }}>
        <div style={{ textAlign: "center", maxWidth: "440px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px", justifyContent: "center" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "10px",
              background: `linear-gradient(135deg, ${T.accent}, ${T.cyan})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", fontWeight: 800, color: "#fff", fontFamily: T.font,
            }}>TI</div>
            <span style={{ fontSize: "22px", fontWeight: 700, color: T.text }}>Target Intelligence</span>
          </div>

          <h1 style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: "16px", color: T.text }}>
            Compounding Intelligence<br/>for Private Equity
          </h1>
          <p style={{ fontSize: "15px", color: T.textSecondary, lineHeight: 1.7, marginBottom: "44px" }}>
            Automated target discovery, enrichment, and monitoring — so your team compounds knowledge while you sleep.
          </p>

          <div style={{ display: "flex", gap: "32px", justifyContent: "center" }}>
            {[["1,240", "Targets Tracked"], ["850", "AI Enriched"], ["12", "Watcher Alerts"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 700, fontFamily: T.font, color: T.accent }}>{v}</div>
                <div style={{ fontSize: "10px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: T.font, marginTop: "6px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px" }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "6px", color: T.text }}>Welcome back</h2>
          <p style={{ fontSize: "14px", color: T.textSecondary, marginBottom: "36px" }}>Sign in to access your intelligence workspace.</p>

          <button onClick={onLogin} style={{
            width: "100%", padding: "13px", marginBottom: "28px", cursor: "pointer",
            background: `linear-gradient(135deg, ${T.accent}, #3575E2)`,
            border: "none", borderRadius: T.radius, fontSize: "14px", fontWeight: 600,
            color: "#fff", fontFamily: T.fontSans,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.5"/><path d="M5.5 8h5M8 5.5l2.5 2.5-2.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Sign in with SSO
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
            <div style={{ flex: 1, height: "1px", background: T.border }} />
            <span style={{ fontSize: "10.5px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: T.font }}>or email</span>
            <div style={{ flex: 1, height: "1px", background: T.border }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
            <div>
              <label style={{ fontSize: "11px", color: T.textSecondary, fontWeight: 600, display: "block", marginBottom: "6px" }}>Email</label>
              <Input placeholder="analyst@firm.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: T.textSecondary, fontWeight: 600, display: "block", marginBottom: "6px" }}>Password</label>
              <Input placeholder="••••••••" type="password" value={pass} onChange={e => setPass(e.target.value)} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: T.textSecondary, cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: T.accent }} /> Remember me
            </label>
            <span style={{ fontSize: "12px", color: T.accent, cursor: "pointer" }}>Forgot password?</span>
          </div>

          <button onClick={onLogin} style={{
            width: "100%", padding: "12px", cursor: "pointer",
            background: "transparent", border: `1px solid ${T.border}`,
            borderRadius: T.radius, fontSize: "13px", fontWeight: 600,
            color: T.textSecondary, fontFamily: T.fontSans,
          }}>Sign in with Email</button>

          <p style={{ fontSize: "12px", color: T.textMuted, textAlign: "center", marginTop: "32px" }}>
            Don't have an account? <span style={{ color: T.textSecondary, fontWeight: 500 }}>Contact Admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   2. COMMAND DASHBOARD
   ═══════════════════════════════════════════ */
function CommandDashboard({ setScreen }) {
  return (
    <div>
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <StatCard label="Total Targets" value="4,790" sub="+120 this week" accent={T.accent} />
        <StatCard label="Enriched" value="3,252" sub="67.9% complete" accent={T.green} />
        <StatCard label="Watcher Alerts" value="12 New" sub="Last 24 hours" accent={T.amber} />
        <StatCard label="Avg Rank" value="7.2" sub="↑ 0.4 vs last week" accent={T.purple} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Active Searches */}
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: T.text }}>Active Searches</span>
            <Btn primary style={{ fontSize: "11px", padding: "5px 12px" }} onClick={() => setScreen("thesis")}>+ New Thesis</Btn>
          </div>
          <div style={{ padding: "12px" }}>
            {PROJECTS.slice(0, 3).map(p => (
              <div key={p.id} onClick={() => setScreen("project")}
                style={{ padding: "14px", background: T.bgElevated, borderRadius: T.radius, marginBottom: "8px", cursor: "pointer", border: `1px solid ${T.borderSubtle}`, transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.border}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.borderSubtle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: T.text }}>{p.name}</span>
                  <Badge color={T.green}>{Math.round(p.enriched / p.count * 100)}%</Badge>
                </div>
                <div style={{ height: "4px", background: T.bg, borderRadius: "2px", overflow: "hidden", marginBottom: "8px" }}>
                  <div style={{ height: "100%", width: `${p.enriched / p.count * 100}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.green})`, borderRadius: "2px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: T.textMuted, fontFamily: T.font }}>{p.enriched.toLocaleString()}/{p.count.toLocaleString()}</span>
                  <span style={{ fontSize: "11px", color: T.accent, fontWeight: 500 }}>Open →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: T.text }}>Recent Activity</span>
          </div>
          <div style={{ padding: "8px 14px", maxHeight: "380px", overflow: "auto" }}>
            {ACTIVITIES.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", padding: "11px 4px", borderBottom: i < ACTIVITIES.length - 1 ? `1px solid ${T.borderSubtle}` : "none" }}>
                <div style={{
                  width: "7px", height: "7px", borderRadius: "50%", marginTop: "5px", flexShrink: 0,
                  background: a.type === "signal" ? T.green : a.type === "watcher" ? T.amber : a.type === "enrichment" ? T.accent : a.type === "scoring" ? T.purple : T.textMuted,
                }} />
                <div>
                  <div style={{ fontSize: "12px", color: T.textSecondary, lineHeight: 1.5 }}>{a.text}</div>
                  <div style={{ fontSize: "10px", color: T.textMuted, fontFamily: T.font, marginTop: "3px" }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. PROJECT WORKSPACE + GRID
   ═══════════════════════════════════════════ */
function ProjectWorkspace({ activeProject, setActiveProject }) {
  const [showUpload, setShowUpload] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [sortCol, setSortCol] = useState("rank");
  const [sortDir, setSortDir] = useState("desc");
  const [showNewProject, setShowNewProject] = useState(false);

  const sorted = [...GRID_DATA].sort((a, b) => {
    const m = sortDir === "desc" ? -1 : 1;
    if (sortCol === "rank") return m * (a.rank - b.rank);
    if (sortCol === "name") return m * a.name.localeCompare(b.name);
    if (sortCol === "doctors") return m * (a.doctors - b.doctors);
    return 0;
  });

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const rankColor = (r) => r >= 8.5 ? T.green : r >= 7 ? T.accent : r >= 5.5 ? T.amber : T.textMuted;
  const statusColor = (s) => s === "Approved" ? T.green : s === "Processing" ? T.amber : s === "Archived" ? T.textMuted : T.accent;

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      {/* Project sub-panel */}
      <div style={{ width: "220px", borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", background: T.bg, flexShrink: 0 }}>
        <div style={{ padding: "14px" }}>
          <Btn primary style={{ width: "100%", justifyContent: "center", fontSize: "12px", padding: "9px" }} onClick={() => setShowNewProject(true)}>+ New Project</Btn>
        </div>
        <div style={{ fontSize: "9.5px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: T.font, fontWeight: 700, padding: "4px 18px 8px" }}>All Projects</div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 8px" }}>
          {PROJECTS.map(p => {
            const active = activeProject?.id === p.id;
            return (
              <div key={p.id} onClick={() => setActiveProject(p)}
                style={{
                  padding: "11px 12px", borderRadius: T.radius, cursor: "pointer", marginBottom: "3px",
                  background: active ? T.accentGlow : "transparent",
                  border: active ? `1px solid ${T.accentBorder}` : "1px solid transparent",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.bgHover }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? T.accentGlow : "transparent" }}>
                <div style={{ fontSize: "12.5px", fontWeight: active ? 600 : 400, color: active ? T.text : T.textSecondary }}>{p.name}</div>
                <div style={{ fontSize: "10px", color: T.textMuted, fontFamily: T.font, marginTop: "3px" }}>{p.count.toLocaleString()} targets</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
        {/* Banner */}
        {showBanner && (
          <div style={{
            background: T.amberDim, border: `1px solid rgba(251,191,36,0.25)`, borderRadius: T.radius,
            padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px",
          }}>
            <span style={{ fontSize: "15px" }}>⚡</span>
            <span style={{ fontSize: "12px", color: T.amber, flex: 1, fontWeight: 500 }}>Updates detected from another analyst. Refresh to see the latest data.</span>
            <Btn style={{ fontSize: "11px", padding: "5px 12px", borderColor: "rgba(251,191,36,0.3)", color: T.amber }} onClick={() => setShowBanner(false)}>Refresh</Btn>
            <span style={{ cursor: "pointer", color: T.textMuted, fontSize: "18px", lineHeight: 1 }} onClick={() => setShowBanner(false)}>×</span>
          </div>
        )}

        {/* Upload */}
        <div onClick={() => { setShowUpload(true); setTimeout(() => setShowUpload(false), 3000); }}
          style={{
            border: `1.5px dashed ${showUpload ? T.green : T.border}`, borderRadius: T.radius,
            padding: "22px", textAlign: "center", cursor: "pointer", marginBottom: "20px",
            background: showUpload ? T.greenDim : "transparent", transition: "all 0.2s",
          }}>
          {showUpload ? (
            <>
              <div style={{ fontSize: "13px", color: T.green, fontWeight: 600 }}>✓ 2 files uploaded successfully</div>
              <div style={{ fontSize: "11px", color: T.green, fontFamily: T.font, marginTop: "4px", opacity: 0.8 }}>1,240 rows added to {activeProject?.name}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "22px", marginBottom: "4px", color: T.textMuted }}>↑</div>
              <div style={{ fontSize: "12.5px", color: T.textSecondary }}>Drop CSV or Excel files here, or <span style={{ color: T.accent, fontWeight: 500 }}>browse</span></div>
              <div style={{ fontSize: "10.5px", color: T.textMuted, fontFamily: T.font, marginTop: "4px" }}>Supports .csv, .xlsx</div>
            </>
          )}
        </div>

        {/* Grid */}
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${T.border}`, gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: T.text }}>Intelligence Grid</span>
            <Badge color={T.textSecondary}>{sorted.length} targets</Badge>
            <div style={{ flex: 1 }} />
            <Input placeholder="Search…" style={{ width: "180px", padding: "6px 12px", fontSize: "11px" }} />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    { key: "rank", label: "Rank", w: "65px" },
                    { key: "name", label: "Business" },
                    { key: "city", label: "Location", w: "130px" },
                    { key: "doctors", label: "Docs", w: "60px" },
                    { key: "emergency", label: "24/7", w: "55px" },
                    { key: "services", label: "Services", w: "190px" },
                    { key: "revenue", label: "Rev", w: "70px" },
                    { key: "signals", label: "Sig", w: "50px" },
                    { key: "status", label: "Status", w: "90px" },
                  ].map(c => (
                    <th key={c.key} onClick={() => handleSort(c.key)}
                      style={{
                        padding: "10px 14px", textAlign: "left", fontSize: "10px", width: c.w || "auto",
                        color: sortCol === c.key ? T.textSecondary : T.textMuted,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        fontFamily: T.font, fontWeight: 600, cursor: "pointer",
                        background: T.bgElevated, borderBottom: `1px solid ${T.border}`,
                        whiteSpace: "nowrap", userSelect: "none", position: "sticky", top: 0,
                      }}>
                      {c.label}
                      <span style={{ marginLeft: "3px", fontSize: "9px", opacity: sortCol === c.key ? 1 : 0.3 }}>
                        {sortCol === c.key ? (sortDir === "desc" ? "▼" : "▲") : "▼"}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(row => {
                  const sel = selectedRow?.id === row.id;
                  return (
                    <tr key={row.id}
                      onClick={() => { setSelectedRow(row); setDrawerOpen(true); }}
                      style={{
                        cursor: "pointer", borderBottom: `1px solid ${T.borderSubtle}`,
                        background: sel ? T.accentGlow : "transparent", transition: "background 0.1s",
                      }}
                      onMouseEnter={e => { if (!sel) e.currentTarget.style.background = T.bgHover }}
                      onMouseLeave={e => { if (!sel) e.currentTarget.style.background = sel ? T.accentGlow : "transparent" }}>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontSize: "15px", fontWeight: 700, fontFamily: T.font, color: rankColor(row.rank) }}>{row.rank}</span>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ fontSize: "12.5px", fontWeight: 500, color: T.text }}>{row.name}</div>
                        <div style={{ fontSize: "10px", color: T.textMuted, fontFamily: T.font, marginTop: "1px" }}>{row.website}</div>
                      </td>
                      <td style={{ padding: "10px 14px", color: T.textSecondary, fontSize: "11.5px" }}>{row.city}, {row.state}</td>
                      <td style={{ padding: "10px 14px", fontFamily: T.font, color: T.text, fontSize: "12px" }}>{row.doctors}</td>
                      <td style={{ padding: "10px 14px" }}>
                        {row.emergency ? <Badge color={T.green}>YES</Badge> : <span style={{ color: T.textMuted, fontSize: "11px" }}>—</span>}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: "11px", color: T.textSecondary, maxWidth: "190px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.services}</td>
                      <td style={{ padding: "10px 14px", fontFamily: T.font, fontSize: "11.5px", color: T.text }}>{row.revenue}</td>
                      <td style={{ padding: "10px 14px" }}><span style={{ fontFamily: T.font, fontSize: "11px", color: T.purple, fontWeight: 600 }}>{row.signals}</span></td>
                      <td style={{ padding: "10px 14px" }}><Badge color={statusColor(row.status)}>{row.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderTop: `1px solid ${T.border}` }}>
            <span style={{ fontSize: "11px", color: T.textMuted, fontFamily: T.font }}>Page 1 of 25 · {activeProject?.count?.toLocaleString()} total</span>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1, 2, 3, "…", 25].map((p, i) => (
                <button key={i} style={{
                  width: "28px", height: "28px", borderRadius: "4px",
                  border: p === 1 ? `1px solid ${T.accentBorder}` : `1px solid ${T.border}`,
                  background: p === 1 ? T.accentGlow : "transparent",
                  color: p === 1 ? T.accent : T.textMuted,
                  fontSize: "11px", fontFamily: T.font, cursor: "pointer",
                }}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Drawer */}
      {drawerOpen && selectedRow && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 99 }} />
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, width: "440px",
            background: T.bgCard, borderLeft: `1px solid ${T.border}`, zIndex: 100,
            display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
          }}>
            <div style={{ display: "flex", alignItems: "center", padding: "18px 22px", borderBottom: `1px solid ${T.border}`, gap: "12px" }}>
              <span style={{ fontSize: "26px", fontWeight: 700, fontFamily: T.font, color: rankColor(selectedRow.rank) }}>{selectedRow.rank}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: T.text }}>{selectedRow.name}</div>
                <div style={{ fontSize: "11px", color: T.textSecondary }}>{selectedRow.city}, {selectedRow.state}</div>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", color: T.textMuted, fontSize: "22px", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ flex: 1, overflow: "auto", padding: "20px 22px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
                {[["Doctors", selectedRow.doctors], ["Revenue", selectedRow.revenue], ["Emergency", selectedRow.emergency ? "Yes" : "No"], ["Signals", selectedRow.signals]].map(([l, v]) => (
                  <div key={l} style={{ background: T.bgElevated, borderRadius: T.radius, padding: "12px 14px", border: `1px solid ${T.borderSubtle}` }}>
                    <div style={{ fontSize: "10px", color: T.textMuted, fontFamily: T.font, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>{l}</div>
                    <div style={{ fontSize: "16px", fontWeight: 600, fontFamily: T.font, color: T.text }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: T.font, color: T.textMuted, marginBottom: "12px" }}>AI Evidence</div>

              {[
                { claim: "Offers Emergency Care", proof: "We are open 24/7 for all pet emergencies. Our team of board-certified specialists is available around the clock.", confidence: 95 },
                { claim: "Oncology Department", proof: "Our state-of-the-art oncology center provides chemotherapy, radiation therapy, and surgical oncology services.", confidence: 92 },
                { claim: "Multi-Doctor Practice", proof: `Our team includes ${selectedRow.doctors} licensed veterinarians specializing in surgery, internal medicine, and emergency care.`, confidence: 88 },
                { claim: "Surgical Capabilities", proof: "We perform both soft tissue and orthopedic surgeries in our fully equipped surgical suites.", confidence: 85 },
              ].map((ev, i) => (
                <div key={i} style={{ background: T.bgElevated, borderRadius: T.radius, padding: "14px", marginBottom: "8px", borderLeft: `3px solid ${T.accent}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: T.text }}>{ev.claim}</span>
                    <Badge color={T.green}>{ev.confidence}%</Badge>
                  </div>
                  <div style={{ fontSize: "11.5px", color: T.textSecondary, lineHeight: 1.6, background: "rgba(75,142,245,0.05)", padding: "10px 12px", borderRadius: "4px", fontStyle: "italic" }}>
                    "{ev.proof}"
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px", padding: "16px 22px", borderTop: `1px solid ${T.border}` }}>
              <Btn primary style={{ flex: 1, justifyContent: "center", background: T.green, fontSize: "13px", padding: "11px" }}>✓ Approve</Btn>
              <Btn danger style={{ flex: 1, justifyContent: "center", fontSize: "13px", padding: "11px" }}>✗ Reject</Btn>
            </div>
          </div>
        </>
      )}

      {/* New Project Modal */}
      {showNewProject && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setShowNewProject(false)}>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "10px", padding: "28px", width: "420px" }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: "17px", fontWeight: 600, marginBottom: "20px", color: T.text }}>Create New Project</h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "11px", color: T.textSecondary, fontWeight: 600, display: "block", marginBottom: "6px" }}>Project Name *</label>
              <Input placeholder="e.g., Vet Clinics – CA" />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "11px", color: T.textSecondary, fontWeight: 600, display: "block", marginBottom: "6px" }}>Description</label>
              <textarea placeholder="Optional description..." style={{
                width: "100%", padding: "10px 14px", background: T.bgElevated,
                border: `1px solid ${T.border}`, borderRadius: T.radius,
                color: T.text, fontSize: "13px", fontFamily: T.fontSans,
                outline: "none", resize: "vertical", minHeight: "70px", boxSizing: "border-box",
              }} />
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <Btn onClick={() => setShowNewProject(false)}>Cancel</Btn>
              <Btn primary onClick={() => setShowNewProject(false)}>Create Project</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   4. THESIS ARCHITECT
   ═══════════════════════════════════════════ */
function ThesisArchitect() {
  const [rules, setRules] = useState(THESIS_RULES);
  const [testText, setTestText] = useState("");
  const [testResult, setTestResult] = useState(null);
  const positiveKw = ["Veterinarian", "Animal Hospital", "Vet Clinic", "Emergency Vet"];
  const negativeKw = ["Pet Store", "Grooming", "Non-profit", "Shelter"];

  const runTest = () => {
    let score = 0, matched = [];
    rules.forEach(r => {
      if (testText.toLowerCase().includes(r.value.toLowerCase())) { score += r.points; matched.push(r); }
    });
    const excluded = negativeKw.some(k => testText.toLowerCase().includes(k.toLowerCase()));
    setTestResult({ score, matched, excluded });
  };

  const jsonPreview = { thesis_name: "Vet Clinics – CA", sector: "Veterinary Services", positive_keywords: positiveKw, negative_keywords: negativeKw, scoring_rules: rules, active: true };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      {/* Left */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: T.text, marginBottom: "16px" }}>Thesis Metadata</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "10px", color: T.textMuted, fontFamily: T.font, textTransform: "uppercase", display: "block", marginBottom: "5px" }}>Name</label>
              <Input value="Vet Clinics – CA" onChange={() => {}} />
            </div>
            <div>
              <label style={{ fontSize: "10px", color: T.textMuted, fontFamily: T.font, textTransform: "uppercase", display: "block", marginBottom: "5px" }}>Sector</label>
              <Input value="Veterinary Services" onChange={() => {}} />
            </div>
          </div>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: T.text, marginBottom: "14px" }}>Keywords</div>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "10px", color: T.green, fontFamily: T.font, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", fontWeight: 600 }}>✓ Must Include</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {positiveKw.map(k => <span key={k} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "4px", background: T.greenDim, color: T.green, fontWeight: 500, border: `1px solid rgba(52,211,153,0.2)` }}>{k} ×</span>)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "10px", color: T.red, fontFamily: T.font, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px", fontWeight: 600 }}>✗ Must Exclude</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {negativeKw.map(k => <span key={k} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "4px", background: T.redDim, color: T.red, fontWeight: 500, border: `1px solid rgba(248,113,113,0.2)` }}>{k} ×</span>)}
            </div>
          </div>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: T.text }}>Scoring Rules</span>
            <Btn style={{ fontSize: "11px", padding: "5px 10px", color: T.textSecondary }} onClick={() => setRules([...rules, { field: "", operator: "contains", value: "", points: 1 }])}>+ Add</Btn>
          </div>
          {rules.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "10px", color: T.textMuted, fontFamily: T.font }}>If</span>
              <Input value={r.field} onChange={e => { const n = [...rules]; n[i].field = e.target.value; setRules(n); }} style={{ flex: 1, padding: "7px 8px", fontSize: "11px" }} />
              <select value={r.operator} onChange={e => { const n = [...rules]; n[i].operator = e.target.value; setRules(n); }}
                style={{ padding: "7px 8px", background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: T.radius, color: T.text, fontSize: "11px", outline: "none" }}>
                <option value="contains">contains</option><option value="equals">equals</option><option value="greater_than">&gt;</option>
              </select>
              <Input value={r.value} onChange={e => { const n = [...rules]; n[i].value = e.target.value; setRules(n); }} style={{ width: "100px", padding: "7px 8px", fontSize: "11px" }} />
              <span style={{ fontSize: "10px", color: T.textMuted }}>→</span>
              <Input value={String(r.points)} onChange={e => { const n = [...rules]; n[i].points = parseFloat(e.target.value) || 0; setRules(n); }} style={{ width: "50px", padding: "7px 8px", fontSize: "11px", fontFamily: T.font, textAlign: "center" }} />
              <span style={{ fontSize: "10px", color: T.textMuted, fontFamily: T.font }}>pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "20px", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: T.text }}>JSON Preview</span>
            <Badge color={T.green}>Live</Badge>
          </div>
          <pre style={{
            background: T.bg, borderRadius: T.radius, padding: "18px", fontSize: "11px",
            fontFamily: T.font, color: T.cyan, overflow: "auto", maxHeight: "320px",
            lineHeight: 1.6, border: `1px solid ${T.border}`, margin: 0,
          }}>{JSON.stringify(jsonPreview, null, 2)}</pre>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: T.text, marginBottom: "12px" }}>Test Drive</div>
          <textarea placeholder='Paste text to test… e.g. "We offer Emergency care and Oncology services with 8 doctors"'
            value={testText} onChange={e => setTestText(e.target.value)}
            style={{
              width: "100%", padding: "12px 14px", background: T.bgElevated,
              border: `1px solid ${T.border}`, borderRadius: T.radius,
              color: T.text, fontSize: "12px", fontFamily: T.fontSans,
              outline: "none", resize: "vertical", minHeight: "80px", boxSizing: "border-box", marginBottom: "12px", lineHeight: 1.5,
            }} />
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Btn primary onClick={runTest}>Test Score</Btn>
            {testResult && (
              testResult.excluded ? <Badge color={T.red}>REJECTED</Badge> : (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "22px", fontWeight: 700, fontFamily: T.font, color: testResult.score >= 5 ? T.green : testResult.score >= 2 ? T.amber : T.textMuted }}>{testResult.score.toFixed(1)}</span>
                  <span style={{ fontSize: "11px", color: T.textSecondary }}>{testResult.matched.length} matched</span>
                </div>
              )
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Btn>Discard</Btn>
          <Btn primary>Save Thesis</Btn>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   5. WATCHER HUB
   ═══════════════════════════════════════════ */
function WatcherHub() {
  const [selectedCBSA, setSelectedCBSA] = useState(null);
  const tierColors = { 1: T.green, 2: T.amber, 3: T.textMuted };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: T.text, marginBottom: "16px" }}>Geographic Command</div>
          <div style={{ height: "240px", background: T.bg, borderRadius: T.radius, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            <svg viewBox="0 0 400 240" style={{ width: "100%", height: "100%" }}>
              <path d="M80,40 L120,30 L150,35 L180,50 L200,80 L220,120 L210,160 L190,200 L160,220 L120,210 L100,180 L90,140 L70,100 Z"
                fill="rgba(75,142,245,0.06)" stroke={T.accent} strokeWidth="1.5" opacity="0.5" />
              {[
                { x: 130, y: 80, l: "SF", t: 1 }, { x: 190, y: 160, l: "LA", t: 1 },
                { x: 210, y: 130, l: "SD", t: 1 }, { x: 120, y: 110, l: "SAC", t: 2 },
                { x: 150, y: 90, l: "SJ", t: 2 }, { x: 110, y: 130, l: "FRE", t: 3 },
              ].map((m, i) => (
                <g key={i}>
                  <circle cx={m.x} cy={m.y} r="16" fill={tierColors[m.t]} opacity="0.1" />
                  <circle cx={m.x} cy={m.y} r="6" fill={tierColors[m.t]} opacity="0.9" />
                  <text x={m.x + 14} y={m.y + 4} fill={T.textSecondary} fontSize="9" fontFamily={T.font} fontWeight="600">{m.l}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, fontSize: "13px", fontWeight: 600, color: T.text }}>CBSA Markets</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Market", "Targets", "Rank", "Scanned", "Tier"].map(h => (
                  <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: "10px", color: T.textMuted, textTransform: "uppercase", fontFamily: T.font, fontWeight: 600, background: T.bgElevated, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CBSA_DATA.map((c, i) => {
                const sel = selectedCBSA?.name === c.name;
                return (
                  <tr key={i} onClick={() => setSelectedCBSA(c)}
                    style={{ cursor: "pointer", background: sel ? T.accentGlow : "transparent", borderBottom: `1px solid ${T.borderSubtle}` }}
                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = T.bgHover }}
                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = sel ? T.accentGlow : "transparent" }}>
                    <td style={{ padding: "10px 14px", fontWeight: 500, color: T.text, fontSize: "12px" }}>{c.name}</td>
                    <td style={{ padding: "10px 14px", fontFamily: T.font, color: T.text, fontSize: "12px" }}>{c.targets}</td>
                    <td style={{ padding: "10px 14px", fontFamily: T.font, color: c.avgRank >= 7 ? T.green : T.amber, fontSize: "12px" }}>{c.avgRank}</td>
                    <td style={{ padding: "10px 14px", color: T.textSecondary, fontSize: "11px" }}>{c.lastScan}</td>
                    <td style={{ padding: "10px 14px" }}><Badge color={tierColors[c.tier]}>T{c.tier}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "20px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: T.text, marginBottom: "20px" }}>Strategy Tiers</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[
            { tier: 1, label: "Tier 1 — High", freq: 15, markets: 3, targets: 1010, color: T.green },
            { tier: 2, label: "Tier 2 — Medium", freq: 30, markets: 2, targets: 335, color: T.amber },
            { tier: 3, label: "Tier 3 — Low", freq: 60, markets: 1, targets: 85, color: T.textMuted },
          ].map(t => (
            <div key={t.tier} style={{ background: T.bgElevated, borderRadius: T.radius, padding: "18px", borderTop: `3px solid ${t.color}` }}>
              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px", color: t.color }}>{t.label}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "10px", color: T.textMuted, fontFamily: T.font, textTransform: "uppercase" }}>Frequency</span>
                <span style={{ fontSize: "12px", fontFamily: T.font, fontWeight: 600, color: T.text }}>Every {t.freq}d</span>
              </div>
              <div style={{ height: "5px", background: T.bg, borderRadius: "3px", marginBottom: "12px" }}>
                <div style={{ height: "100%", width: `${((90 - t.freq) / 90) * 100}%`, background: t.color, borderRadius: "3px", opacity: 0.8 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: T.textSecondary }}>
                <span>{t.markets} markets</span><span>{t.targets} targets</span>
              </div>
              <div style={{ marginTop: "10px", fontSize: "10px", color: T.textMuted, fontFamily: T.font }}>
                Next: <span style={{ color: t.color, fontWeight: 600 }}>{t.freq <= 15 ? "3 days" : t.freq <= 30 ? "12 days" : "28 days"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP — Login routes to Dashboard
   ═══════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("login");
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: ${T.bg}; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
    select option { background: ${T.bgElevated}; color: ${T.text}; }
    ::placeholder { color: ${T.textDim} !important; }
  `;

  if (screen === "login") {
    return <>
      <style>{globalStyles}</style>
      <LoginScreen onLogin={() => setScreen("dashboard")} />
    </>;
  }

  const titles = { dashboard: "Command Dashboard", project: `Projects › ${activeProject?.name}`, thesis: "Thesis Architect", watcher: "Watcher Strategy Hub" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.fontSans, color: T.text, fontSize: "13px" }}>
      <style>{globalStyles}</style>
      <Sidebar screen={screen} setScreen={setScreen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar breadcrumb={titles[screen]} />
        <div style={{ flex: 1, overflow: "auto", padding: screen === "project" ? 0 : "24px" }}>
          {screen === "dashboard" && <CommandDashboard setScreen={setScreen} />}
          {screen === "project" && <ProjectWorkspace activeProject={activeProject} setActiveProject={setActiveProject} />}
          {screen === "thesis" && <ThesisArchitect />}
          {screen === "watcher" && <WatcherHub />}
        </div>
      </div>
    </div>
  );
}
