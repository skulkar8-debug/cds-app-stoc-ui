import { useState } from "react";

/* ═══════════════════════════════════════════
   DESIGN TOKENS — Large readable text
   ═══════════════════════════════════════════ */
const T = {
  bg: "#0B0D11",
  bgCard: "#12151C",
  bgElevated: "#1A1E28",
  bgHover: "#1F2430",
  border: "#232836",
  borderSubtle: "#1A1E28",
  text: "#EDF0F5",
  textSecondary: "#B8BEC9",
  textMuted: "#7B8292",
  textDim: "#505868",
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
  radius: "8px",
  font: "'JetBrains Mono', 'Fira Code', monospace",
  fontSans: "'DM Sans', -apple-system, sans-serif",
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
  { id: 8, rank: 6.8, name: "LA Metro Animal Hospital", city: "Los Angeles", state: "CA", website: "lametroah.com", doctors: 9, emergency: true, services: "Emergency, ICU, Surgery", revenue: "$7.2M", status: "Processing", signals: 13 },
];

const ACTIVITIES = [
  { time: "2m ago", text: "AI Agent found 'Managed Services' for Orange Grove Animal Hospital", type: "signal" },
  { time: "5m ago", text: "Website change detected: Pacific Coast AH updated services page", type: "watcher" },
  { time: "12m ago", text: "Enrichment complete: Bay Area Veterinary Specialists — 15 signals", type: "enrichment" },
  { time: "18m ago", text: "New doctor listing found for Silicon Valley Vet Partners", type: "signal" },
  { time: "25m ago", text: "Thesis scoring updated: 3 targets moved to Review queue", type: "scoring" },
  { time: "1h ago", text: "Watcher scan completed for Sacramento CBSA — 45 refreshed", type: "watcher" },
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
   REUSABLE COMPONENTS — All sizes bumped up
   ═══════════════════════════════════════════ */
function Badge({ children, color = T.accent, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "4px 11px",
      borderRadius: "5px", fontSize: "13px", fontWeight: 600,
      fontFamily: T.font, letterSpacing: "0.02em",
      color, background: bg || (color === T.green ? T.greenDim : color === T.red ? T.redDim : color === T.amber ? T.amberDim : color === T.purple ? T.purpleDim : T.accentGlow),
    }}>{children}</span>
  );
}

function StatCard({ label, value, sub, accent = T.accent }) {
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "24px", flex: 1, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: accent }} />
      <div style={{ fontSize: "13px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: T.font, marginBottom: "12px" }}>{label}</div>
      <div style={{ fontSize: "32px", fontWeight: 700, fontFamily: T.font, color: T.text, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "14px", color: T.textSecondary, marginTop: "10px" }}>{sub}</div>}
    </div>
  );
}

function Input({ placeholder, value, onChange, type = "text", style: s }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{
      width: "100%", padding: "12px 16px", background: T.bgElevated,
      border: `1px solid ${T.border}`, borderRadius: T.radius,
      color: T.text, fontSize: "15px", fontFamily: T.fontSans,
      outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", ...s,
    }}
    onFocus={e => e.target.style.borderColor = T.accent}
    onBlur={e => e.target.style.borderColor = T.border} />
  );
}

function Btn({ children, primary, danger, onClick, style: s, disabled }) {
  return (
    <button disabled={disabled} onClick={onClick} style={{
      padding: "11px 22px",
      background: primary ? T.accent : danger ? T.red : "transparent",
      color: primary || danger ? "#fff" : T.textSecondary,
      border: primary || danger ? "none" : `1px solid ${T.border}`,
      borderRadius: T.radius, fontSize: "14px", fontWeight: 600,
      fontFamily: T.fontSans, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1, transition: "all 0.15s",
      display: "inline-flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", ...s,
    }}>{children}</button>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: "12px", color: T.textDim, textTransform: "uppercase", letterSpacing: "0.14em", fontFamily: T.font, fontWeight: 700, marginBottom: "10px" }}>{children}</div>;
}

/* ═══════════════════════════════════════════
   STOC LOGO
   ═══════════════════════════════════════════ */
function StocLogo({ size = "md" }) {
  const s = size === "lg" ? 48 : size === "md" ? 36 : 30;
  const fs = size === "lg" ? 18 : size === "md" ? 14 : 12;
  return (
    <div style={{
      width: s, height: s, borderRadius: s * 0.22, flexShrink: 0,
      background: `linear-gradient(135deg, ${T.accent}, ${T.cyan})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: fs, fontWeight: 800, color: "#fff", fontFamily: T.font,
      letterSpacing: "-0.03em",
    }}>SA</div>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════ */
function Sidebar({ screen, setScreen }) {
  const items = [
    { key: "dashboard", label: "Dashboard",  icon: "⊞" },
    { key: "project",   label: "Projects",   icon: "◧" },
    { key: "thesis",    label: "Thesis",      icon: "◈" },
    { key: "watcher",   label: "Watcher",     icon: "◉" },
  ];

  return (
    <div style={{ width: "250px", background: T.bgCard, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "22px 20px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <StocLogo />
          <div>
            <div style={{ fontSize: "17px", fontWeight: 700, color: T.text, letterSpacing: "-0.01em" }}>STOC</div>
            <div style={{ fontSize: "12px", color: T.textMuted }}>Target Intelligence</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px 8px" }}>
        <SectionLabel>Navigation</SectionLabel>
      </div>

      <div style={{ padding: "0 12px", flex: 1 }}>
        {items.map(item => {
          const active = screen === item.key;
          return (
            <div key={item.key} onClick={() => setScreen(item.key)}
              style={{
                padding: "13px 16px", borderRadius: T.radius, cursor: "pointer",
                display: "flex", alignItems: "center", gap: "12px",
                background: active ? T.accentGlow : "transparent",
                border: active ? `1px solid ${T.accentBorder}` : "1px solid transparent",
                color: active ? T.accent : T.textSecondary,
                fontSize: "15px", fontWeight: active ? 600 : 400,
                marginBottom: "4px", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = T.bgHover; e.currentTarget.style.color = T.text; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = active ? T.accentGlow : "transparent"; e.currentTarget.style.color = active ? T.accent : T.textSecondary; }}}
            >
              <span style={{ fontSize: "18px", width: "22px", textAlign: "center", opacity: active ? 1 : 0.5 }}>{item.icon}</span>
              {item.label}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "18px 20px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#fff" }}>JD</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: T.text }}>Srushti</div>
            <div style={{ fontSize: "13px", color: T.textMuted }}>Manager</div>
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
    <div style={{ height: "56px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 30px", flexShrink: 0, background: T.bgCard }}>
      <div style={{ fontSize: "14px", fontFamily: T.font }}>
        <span style={{ color: T.textMuted }}>Home</span>
        <span style={{ color: T.textDim, margin: "0 10px" }}>›</span>
        <span style={{ color: T.text, fontWeight: 600 }}>{breadcrumb}</span>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
        <span style={{ fontSize: "13px", color: T.textSecondary }}>Connected</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   1. LOGIN
   ═══════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.fontSans, color: T.text }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px", background: `radial-gradient(ellipse at 30% 50%, rgba(75,142,245,0.06) 0%, transparent 70%)`, borderRight: `1px solid ${T.border}` }}>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "48px", justifyContent: "center" }}>
            <StocLogo size="lg" />
            <span style={{ fontSize: "26px", fontWeight: 700, color: T.text }}>STOC Target Intelligence</span>
          </div>
          <h1 style={{ fontSize: "42px", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: "20px", color: T.text }}>
            Compounding Intelligence<br/>for Private Equity
          </h1>
          <p style={{ fontSize: "18px", color: T.textSecondary, lineHeight: 1.7, marginBottom: "48px" }}>
            Automated target discovery, enrichment, and monitoring — so your team compounds knowledge while you sleep.
          </p>
          <div style={{ display: "flex", gap: "40px", justifyContent: "center" }}>
            {[["1,240", "Targets Tracked"], ["850", "AI Enriched"], ["12", "Watcher Alerts"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", fontWeight: 700, fontFamily: T.font, color: T.accent }}>{v}</div>
                <div style={{ fontSize: "12px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: T.font, marginTop: "8px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px", color: T.text }}>Welcome back</h2>
          <p style={{ fontSize: "16px", color: T.textSecondary, marginBottom: "40px" }}>Sign in to access your STOC intelligence workspace.</p>

          <button onClick={onLogin} style={{
            width: "100%", padding: "16px", marginBottom: "32px", cursor: "pointer",
            background: `linear-gradient(135deg, ${T.accent}, #3575E2)`,
            border: "none", borderRadius: T.radius, fontSize: "16px", fontWeight: 600,
            color: "#fff", fontFamily: T.fontSans, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          }}>
            Sign in with SSO
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
            <div style={{ flex: 1, height: "1px", background: T.border }} />
            <span style={{ fontSize: "13px", color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: T.font }}>or email</span>
            <div style={{ flex: 1, height: "1px", background: T.border }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "24px" }}>
            <div>
              <label style={{ fontSize: "14px", color: T.textSecondary, fontWeight: 600, display: "block", marginBottom: "8px" }}>Email</label>
              <Input placeholder="analyst@firm.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: "14px", color: T.textSecondary, fontWeight: 600, display: "block", marginBottom: "8px" }}>Password</label>
              <Input placeholder="••••••••" type="password" value={pass} onChange={e => setPass(e.target.value)} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: T.textSecondary, cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: T.accent, width: "16px", height: "16px" }} /> Remember me
            </label>
            <span style={{ fontSize: "14px", color: T.accent, cursor: "pointer" }}>Forgot password?</span>
          </div>

          <button onClick={onLogin} style={{
            width: "100%", padding: "14px", cursor: "pointer",
            background: "transparent", border: `1px solid ${T.border}`,
            borderRadius: T.radius, fontSize: "15px", fontWeight: 600,
            color: T.textSecondary, fontFamily: T.fontSans,
          }}>Sign in with Email</button>

          <p style={{ fontSize: "14px", color: T.textMuted, textAlign: "center", marginTop: "36px" }}>
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
      <div style={{ display: "flex", gap: "18px", marginBottom: "28px" }}>
        <StatCard label="Total Targets" value="4,790" sub="+120 this week" accent={T.accent} />
        <StatCard label="Enriched" value="3,252" sub="67.9% complete" accent={T.green} />
        <StatCard label="Watcher Alerts" value="12 New" sub="Last 24 hours" accent={T.amber} />
        <StatCard label="Avg Rank" value="7.2" sub="↑ 0.4 vs last week" accent={T.purple} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius }}>
          <div style={{ padding: "18px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "16px", fontWeight: 600, color: T.text }}>Active Searches</span>
            <Btn primary style={{ fontSize: "13px", padding: "8px 16px" }} onClick={() => setScreen("thesis")}>+ New Thesis</Btn>
          </div>
          <div style={{ padding: "14px" }}>
            {PROJECTS.slice(0, 3).map(p => (
              <div key={p.id} onClick={() => setScreen("project")}
                style={{ padding: "16px", background: T.bgElevated, borderRadius: T.radius, marginBottom: "10px", cursor: "pointer", border: `1px solid ${T.borderSubtle}`, transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.border}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.borderSubtle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: T.text }}>{p.name}</span>
                  <Badge color={T.green}>{Math.round(p.enriched / p.count * 100)}%</Badge>
                </div>
                <div style={{ height: "6px", background: T.bg, borderRadius: "3px", overflow: "hidden", marginBottom: "10px" }}>
                  <div style={{ height: "100%", width: `${p.enriched / p.count * 100}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.green})`, borderRadius: "3px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: T.textMuted, fontFamily: T.font }}>{p.enriched.toLocaleString()}/{p.count.toLocaleString()}</span>
                  <span style={{ fontSize: "14px", color: T.accent, fontWeight: 500 }}>Open →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius }}>
          <div style={{ padding: "18px 22px", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: "16px", fontWeight: 600, color: T.text }}>Recent Activity</span>
          </div>
          <div style={{ padding: "10px 16px", maxHeight: "420px", overflow: "auto" }}>
            {ACTIVITIES.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", padding: "14px 6px", borderBottom: i < ACTIVITIES.length - 1 ? `1px solid ${T.borderSubtle}` : "none" }}>
                <div style={{ width: "9px", height: "9px", borderRadius: "50%", marginTop: "6px", flexShrink: 0, background: a.type === "signal" ? T.green : a.type === "watcher" ? T.amber : a.type === "enrichment" ? T.accent : T.purple }} />
                <div>
                  <div style={{ fontSize: "14px", color: T.textSecondary, lineHeight: 1.5 }}>{a.text}</div>
                  <div style={{ fontSize: "13px", color: T.textMuted, fontFamily: T.font, marginTop: "4px" }}>{a.time}</div>
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
      {/* Project list */}
      <div style={{ width: "240px", borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", background: T.bg, flexShrink: 0 }}>
        <div style={{ padding: "16px" }}>
          <Btn primary style={{ width: "100%", justifyContent: "center", fontSize: "14px", padding: "11px" }} onClick={() => setShowNewProject(true)}>+ New Project</Btn>
        </div>
        <div style={{ padding: "4px 20px 10px" }}><SectionLabel>All Projects</SectionLabel></div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 10px" }}>
          {PROJECTS.map(p => {
            const active = activeProject?.id === p.id;
            return (
              <div key={p.id} onClick={() => setActiveProject(p)}
                style={{
                  padding: "14px", borderRadius: T.radius, cursor: "pointer", marginBottom: "4px",
                  background: active ? T.accentGlow : "transparent",
                  border: active ? `1px solid ${T.accentBorder}` : "1px solid transparent",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.bgHover }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? T.accentGlow : "transparent" }}>
                <div style={{ fontSize: "14px", fontWeight: active ? 600 : 400, color: active ? T.text : T.textSecondary }}>{p.name}</div>
                <div style={{ fontSize: "13px", color: T.textMuted, marginTop: "4px" }}>{p.count.toLocaleString()} targets</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", padding: "22px 26px" }}>
        {showBanner && (
          <div style={{ background: T.amberDim, border: `1px solid rgba(251,191,36,0.25)`, borderRadius: T.radius, padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "18px" }}>⚡</span>
            <span style={{ fontSize: "14px", color: T.amber, flex: 1, fontWeight: 500 }}>Updates detected from another analyst. Refresh to see the latest data.</span>
            <Btn style={{ fontSize: "13px", padding: "8px 16px", borderColor: "rgba(251,191,36,0.3)", color: T.amber }} onClick={() => setShowBanner(false)}>Refresh</Btn>
            <span style={{ cursor: "pointer", color: T.textMuted, fontSize: "20px", lineHeight: 1 }} onClick={() => setShowBanner(false)}>×</span>
          </div>
        )}

        <div onClick={() => { setShowUpload(true); setTimeout(() => setShowUpload(false), 3000); }}
          style={{
            border: `2px dashed ${showUpload ? T.green : T.border}`, borderRadius: T.radius,
            padding: "28px", textAlign: "center", cursor: "pointer", marginBottom: "22px",
            background: showUpload ? T.greenDim : "transparent", transition: "all 0.2s",
          }}>
          {showUpload ? (
            <>
              <div style={{ fontSize: "16px", color: T.green, fontWeight: 600 }}>✓ 2 files uploaded successfully</div>
              <div style={{ fontSize: "14px", color: T.green, marginTop: "6px", opacity: 0.8 }}>1,240 rows added to {activeProject?.name}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "26px", marginBottom: "6px", color: T.textMuted }}>↑</div>
              <div style={{ fontSize: "15px", color: T.textSecondary }}>Drop CSV or Excel files here, or <span style={{ color: T.accent, fontWeight: 500 }}>browse</span></div>
              <div style={{ fontSize: "13px", color: T.textMuted, marginTop: "6px" }}>Supports .csv, .xlsx</div>
            </>
          )}
        </div>

        {/* Grid */}
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${T.border}`, gap: "12px" }}>
            <span style={{ fontSize: "16px", fontWeight: 600, color: T.text }}>Intelligence Grid</span>
            <Badge color={T.textSecondary}>{sorted.length} targets</Badge>
            <div style={{ flex: 1 }} />
            <Input placeholder="Search…" style={{ width: "200px", padding: "8px 14px", fontSize: "14px" }} />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    { key: "rank", label: "Rank", w: "70px" },
                    { key: "name", label: "Business" },
                    { key: "city", label: "Location", w: "140px" },
                    { key: "doctors", label: "Docs", w: "70px" },
                    { key: "emergency", label: "24/7", w: "65px" },
                    { key: "services", label: "Services", w: "200px" },
                    { key: "revenue", label: "Rev", w: "80px" },
                    { key: "status", label: "Status", w: "100px" },
                  ].map(c => (
                    <th key={c.key} onClick={() => handleSort(c.key)}
                      style={{
                        padding: "13px 16px", textAlign: "left", fontSize: "12px", width: c.w || "auto",
                        color: sortCol === c.key ? T.textSecondary : T.textMuted,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        fontFamily: T.font, fontWeight: 700, cursor: "pointer",
                        background: T.bgElevated, borderBottom: `1px solid ${T.border}`,
                        whiteSpace: "nowrap", userSelect: "none", position: "sticky", top: 0,
                      }}>
                      {c.label}
                      <span style={{ marginLeft: "4px", fontSize: "10px", opacity: sortCol === c.key ? 1 : 0.3 }}>
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
                      style={{ cursor: "pointer", borderBottom: `1px solid ${T.borderSubtle}`, background: sel ? T.accentGlow : "transparent", transition: "background 0.1s" }}
                      onMouseEnter={e => { if (!sel) e.currentTarget.style.background = T.bgHover }}
                      onMouseLeave={e => { if (!sel) e.currentTarget.style.background = sel ? T.accentGlow : "transparent" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: "18px", fontWeight: 700, fontFamily: T.font, color: rankColor(row.rank) }}>{row.rank}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: "15px", fontWeight: 500, color: T.text }}>{row.name}</div>
                        <div style={{ fontSize: "13px", color: T.textMuted, marginTop: "2px" }}>{row.website}</div>
                      </td>
                      <td style={{ padding: "14px 16px", color: T.textSecondary, fontSize: "14px" }}>{row.city}, {row.state}</td>
                      <td style={{ padding: "14px 16px", fontFamily: T.font, color: T.text, fontSize: "15px" }}>{row.doctors}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {row.emergency ? <Badge color={T.green}>YES</Badge> : <span style={{ color: T.textMuted, fontSize: "14px" }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: T.textSecondary, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.services}</td>
                      <td style={{ padding: "14px 16px", fontFamily: T.font, fontSize: "14px", color: T.text }}>{row.revenue}</td>
                      <td style={{ padding: "14px 16px" }}><Badge color={statusColor(row.status)}>{row.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: `1px solid ${T.border}` }}>
            <span style={{ fontSize: "13px", color: T.textMuted, fontFamily: T.font }}>Page 1 of 25 · {activeProject?.count?.toLocaleString()} total</span>
            <div style={{ display: "flex", gap: "5px" }}>
              {[1, 2, 3, "…", 25].map((p, i) => (
                <button key={i} style={{
                  width: "32px", height: "32px", borderRadius: "6px",
                  border: p === 1 ? `1px solid ${T.accentBorder}` : `1px solid ${T.border}`,
                  background: p === 1 ? T.accentGlow : "transparent",
                  color: p === 1 ? T.accent : T.textMuted,
                  fontSize: "13px", fontFamily: T.font, cursor: "pointer",
                }}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {drawerOpen && selectedRow && (
        <>
          <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 99 }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "480px", background: T.bgCard, borderLeft: `1px solid ${T.border}`, zIndex: 100, display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${T.border}`, gap: "14px" }}>
              <span style={{ fontSize: "30px", fontWeight: 700, fontFamily: T.font, color: rankColor(selectedRow.rank) }}>{selectedRow.rank}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "17px", fontWeight: 600, color: T.text }}>{selectedRow.name}</div>
                <div style={{ fontSize: "14px", color: T.textSecondary }}>{selectedRow.city}, {selectedRow.state}</div>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", color: T.textMuted, fontSize: "24px", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ flex: 1, overflow: "auto", padding: "22px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                {[["Doctors", selectedRow.doctors], ["Revenue", selectedRow.revenue], ["Emergency", selectedRow.emergency ? "Yes" : "No"], ["Signals", selectedRow.signals]].map(([l, v]) => (
                  <div key={l} style={{ background: T.bgElevated, borderRadius: T.radius, padding: "14px 16px" }}>
                    <div style={{ fontSize: "12px", color: T.textMuted, fontFamily: T.font, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{l}</div>
                    <div style={{ fontSize: "20px", fontWeight: 600, fontFamily: T.font, color: T.text }}>{v}</div>
                  </div>
                ))}
              </div>

              <SectionLabel>AI Evidence</SectionLabel>

              {[
                { claim: "Offers Emergency Care", proof: "We are open 24/7 for all pet emergencies. Our team of board-certified specialists is available around the clock.", confidence: 95 },
                { claim: "Oncology Department", proof: "Our state-of-the-art oncology center provides chemotherapy, radiation therapy, and surgical oncology services.", confidence: 92 },
                { claim: "Multi-Doctor Practice", proof: `Our team includes ${selectedRow.doctors} licensed veterinarians specializing in surgery, internal medicine, and emergency care.`, confidence: 88 },
              ].map((ev, i) => (
                <div key={i} style={{ background: T.bgElevated, borderRadius: T.radius, padding: "16px", marginBottom: "10px", borderLeft: `3px solid ${T.accent}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: T.text }}>{ev.claim}</span>
                    <Badge color={T.green}>{ev.confidence}%</Badge>
                  </div>
                  <div style={{ fontSize: "14px", color: T.textSecondary, lineHeight: 1.6, background: "rgba(75,142,245,0.05)", padding: "12px 14px", borderRadius: "6px", fontStyle: "italic" }}>
                    "{ev.proof}"
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", padding: "18px 24px", borderTop: `1px solid ${T.border}` }}>
              <Btn primary style={{ flex: 1, justifyContent: "center", background: T.green, fontSize: "15px", padding: "13px" }}>✓ Approve</Btn>
              <Btn danger style={{ flex: 1, justifyContent: "center", fontSize: "15px", padding: "13px" }}>✗ Reject</Btn>
            </div>
          </div>
        </>
      )}

      {showNewProject && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowNewProject(false)}>
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "32px", width: "440px" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "24px", color: T.text }}>Create New Project</h3>
            <div style={{ marginBottom: "18px" }}>
              <label style={{ fontSize: "14px", color: T.textSecondary, fontWeight: 600, display: "block", marginBottom: "8px" }}>Project Name *</label>
              <Input placeholder="e.g., Vet Clinics – CA" />
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label style={{ fontSize: "14px", color: T.textSecondary, fontWeight: 600, display: "block", marginBottom: "8px" }}>Description</label>
              <textarea placeholder="Optional description..." style={{ width: "100%", padding: "12px 16px", background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: T.radius, color: T.text, fontSize: "15px", fontFamily: T.fontSans, outline: "none", resize: "vertical", minHeight: "80px", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
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
  const posKw = ["Veterinarian", "Animal Hospital", "Vet Clinic", "Emergency Vet"];
  const negKw = ["Pet Store", "Grooming", "Non-profit", "Shelter"];

  const runTest = () => {
    let score = 0, matched = [];
    rules.forEach(r => { if (testText.toLowerCase().includes(r.value.toLowerCase())) { score += r.points; matched.push(r); } });
    setTestResult({ score, matched, excluded: negKw.some(k => testText.toLowerCase().includes(k.toLowerCase())) });
  };

  const json = { thesis_name: "Vet Clinics – CA", sector: "Veterinary Services", positive_keywords: posKw, negative_keywords: negKw, scoring_rules: rules, active: true };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "22px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "22px" }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: T.text, marginBottom: "18px" }}>Thesis Metadata</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div><label style={{ fontSize: "13px", color: T.textMuted, display: "block", marginBottom: "6px" }}>Thesis Name</label><Input value="Vet Clinics – CA" onChange={() => {}} /></div>
            <div><label style={{ fontSize: "13px", color: T.textMuted, display: "block", marginBottom: "6px" }}>Sector</label><Input value="Veterinary Services" onChange={() => {}} /></div>
          </div>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "22px" }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: T.text, marginBottom: "16px" }}>Keywords</div>
          <div style={{ marginBottom: "18px" }}>
            <div style={{ fontSize: "13px", color: T.green, fontWeight: 700, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>✓ Must Include</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {posKw.map(k => <span key={k} style={{ fontSize: "14px", padding: "6px 14px", borderRadius: "6px", background: T.greenDim, color: T.green, fontWeight: 500, border: `1px solid rgba(52,211,153,0.2)` }}>{k} ×</span>)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "13px", color: T.red, fontWeight: 700, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>✗ Must Exclude</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {negKw.map(k => <span key={k} style={{ fontSize: "14px", padding: "6px 14px", borderRadius: "6px", background: T.redDim, color: T.red, fontWeight: 500, border: `1px solid rgba(248,113,113,0.2)` }}>{k} ×</span>)}
            </div>
          </div>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "16px", fontWeight: 600, color: T.text }}>Scoring Rules</span>
            <Btn style={{ fontSize: "13px", padding: "7px 14px" }} onClick={() => setRules([...rules, { field: "", operator: "contains", value: "", points: 1 }])}>+ Add</Btn>
          </div>
          {rules.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "13px", color: T.textMuted, fontFamily: T.font }}>If</span>
              <Input value={r.field} onChange={e => { const n = [...rules]; n[i].field = e.target.value; setRules(n); }} style={{ flex: 1, padding: "9px 12px", fontSize: "14px" }} />
              <select value={r.operator} onChange={e => { const n = [...rules]; n[i].operator = e.target.value; setRules(n); }}
                style={{ padding: "9px 10px", background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: T.radius, color: T.text, fontSize: "14px", outline: "none" }}>
                <option value="contains">contains</option><option value="equals">equals</option><option value="greater_than">&gt;</option>
              </select>
              <Input value={r.value} onChange={e => { const n = [...rules]; n[i].value = e.target.value; setRules(n); }} style={{ width: "120px", padding: "9px 12px", fontSize: "14px" }} />
              <span style={{ fontSize: "14px", color: T.textMuted }}>→</span>
              <Input value={String(r.points)} onChange={e => { const n = [...rules]; n[i].points = parseFloat(e.target.value) || 0; setRules(n); }} style={{ width: "60px", padding: "9px 10px", fontSize: "14px", fontFamily: T.font, textAlign: "center" }} />
              <span style={{ fontSize: "14px", color: T.textMuted }}>pts</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "22px", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "16px", fontWeight: 600, color: T.text }}>JSON Preview</span>
            <Badge color={T.green}>Live</Badge>
          </div>
          <pre style={{ background: T.bg, borderRadius: T.radius, padding: "20px", fontSize: "13px", fontFamily: T.font, color: T.cyan, overflow: "auto", maxHeight: "340px", lineHeight: 1.6, border: `1px solid ${T.border}`, margin: 0 }}>{JSON.stringify(json, null, 2)}</pre>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "22px" }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: T.text, marginBottom: "14px" }}>Test Drive</div>
          <textarea placeholder='Paste text… e.g. "We offer Emergency care and Oncology services"'
            value={testText} onChange={e => setTestText(e.target.value)}
            style={{ width: "100%", padding: "14px 16px", background: T.bgElevated, border: `1px solid ${T.border}`, borderRadius: T.radius, color: T.text, fontSize: "15px", fontFamily: T.fontSans, outline: "none", resize: "vertical", minHeight: "90px", boxSizing: "border-box", marginBottom: "14px", lineHeight: 1.5 }} />
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Btn primary onClick={runTest}>Test Score</Btn>
            {testResult && (
              testResult.excluded ? <Badge color={T.red}>REJECTED</Badge> : (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "26px", fontWeight: 700, fontFamily: T.font, color: testResult.score >= 5 ? T.green : testResult.score >= 2 ? T.amber : T.textMuted }}>{testResult.score.toFixed(1)}</span>
                  <span style={{ fontSize: "14px", color: T.textSecondary }}>{testResult.matched.length} matched</span>
                </div>
              )
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
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
  const tc = { 1: T.green, 2: T.amber, 3: T.textMuted };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "22px" }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: T.text, marginBottom: "18px" }}>Geographic Command</div>
          <div style={{ height: "260px", background: T.bg, borderRadius: T.radius, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            <svg viewBox="0 0 400 260" style={{ width: "100%", height: "100%" }}>
              <path d="M80,40 L120,30 L150,35 L180,50 L200,80 L220,120 L210,160 L190,200 L160,220 L120,210 L100,180 L90,140 L70,100 Z" fill="rgba(75,142,245,0.06)" stroke={T.accent} strokeWidth="1.5" opacity="0.5" />
              {[{x:130,y:80,l:"SF",t:1},{x:190,y:160,l:"LA",t:1},{x:210,y:130,l:"SD",t:1},{x:120,y:110,l:"SAC",t:2},{x:150,y:90,l:"SJ",t:2},{x:110,y:130,l:"FRE",t:3}].map((m,i) => (
                <g key={i}><circle cx={m.x} cy={m.y} r="18" fill={tc[m.t]} opacity="0.1" /><circle cx={m.x} cy={m.y} r="7" fill={tc[m.t]} opacity="0.9" /><text x={m.x+16} y={m.y+5} fill={T.textSecondary} fontSize="11" fontFamily={T.font} fontWeight="600">{m.l}</text></g>
              ))}
            </svg>
          </div>
        </div>

        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius }}>
          <div style={{ padding: "18px 22px", borderBottom: `1px solid ${T.border}`, fontSize: "16px", fontWeight: 600, color: T.text }}>CBSA Markets</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              {["Market", "Targets", "Rank", "Scanned", "Tier"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: T.textMuted, textTransform: "uppercase", fontFamily: T.font, fontWeight: 700, background: T.bgElevated, borderBottom: `1px solid ${T.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {CBSA_DATA.map((c, i) => {
                const sel = selectedCBSA?.name === c.name;
                return (
                  <tr key={i} onClick={() => setSelectedCBSA(c)}
                    style={{ cursor: "pointer", background: sel ? T.accentGlow : "transparent", borderBottom: `1px solid ${T.borderSubtle}` }}
                    onMouseEnter={e => { if (!sel) e.currentTarget.style.background = T.bgHover }}
                    onMouseLeave={e => { if (!sel) e.currentTarget.style.background = sel ? T.accentGlow : "transparent" }}>
                    <td style={{ padding: "13px 16px", fontWeight: 500, color: T.text, fontSize: "14px" }}>{c.name}</td>
                    <td style={{ padding: "13px 16px", fontFamily: T.font, color: T.text, fontSize: "14px" }}>{c.targets}</td>
                    <td style={{ padding: "13px 16px", fontFamily: T.font, color: c.avgRank >= 7 ? T.green : T.amber, fontSize: "14px" }}>{c.avgRank}</td>
                    <td style={{ padding: "13px 16px", color: T.textSecondary, fontSize: "14px" }}>{c.lastScan}</td>
                    <td style={{ padding: "13px 16px" }}><Badge color={tc[c.tier]}>Tier {c.tier}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "22px" }}>
        <div style={{ fontSize: "16px", fontWeight: 600, color: T.text, marginBottom: "22px" }}>Strategy Tiers</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "18px" }}>
          {[
            { tier: 1, label: "Tier 1 — High", freq: 15, mkts: 3, tgts: 1010, c: T.green },
            { tier: 2, label: "Tier 2 — Medium", freq: 30, mkts: 2, tgts: 335, c: T.amber },
            { tier: 3, label: "Tier 3 — Low", freq: 60, mkts: 1, tgts: 85, c: T.textMuted },
          ].map(t => (
            <div key={t.tier} style={{ background: T.bgElevated, borderRadius: T.radius, padding: "20px", borderTop: `3px solid ${t.c}` }}>
              <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px", color: t.c }}>{t.label}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: T.textMuted, textTransform: "uppercase" }}>Frequency</span>
                <span style={{ fontSize: "15px", fontFamily: T.font, fontWeight: 600, color: T.text }}>Every {t.freq}d</span>
              </div>
              <div style={{ height: "6px", background: T.bg, borderRadius: "3px", marginBottom: "14px" }}>
                <div style={{ height: "100%", width: `${((90 - t.freq) / 90) * 100}%`, background: t.c, borderRadius: "3px", opacity: 0.8 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: T.textSecondary }}>
                <span>{t.mkts} markets</span><span>{t.tgts} targets</span>
              </div>
              <div style={{ marginTop: "12px", fontSize: "13px", color: T.textMuted }}>
                Next scan: <span style={{ color: t.c, fontWeight: 600 }}>{t.freq <= 15 ? "3 days" : t.freq <= 30 ? "12 days" : "28 days"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("login");
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: ${T.bg}; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
    select option { background: ${T.bgElevated}; color: ${T.text}; }
    ::placeholder { color: ${T.textDim} !important; opacity: 1 !important; }
  `;

  if (screen === "login") return <><style>{css}</style><LoginScreen onLogin={() => setScreen("dashboard")} /></>;

  const titles = { dashboard: "Command Dashboard", project: `Projects › ${activeProject?.name}`, thesis: "Thesis Architect", watcher: "Watcher Strategy Hub" };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: T.fontSans, color: T.text, fontSize: "15px" }}>
      <style>{css}</style>
      <Sidebar screen={screen} setScreen={setScreen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar breadcrumb={titles[screen]} />
        <div style={{ flex: 1, overflow: "auto", padding: screen === "project" ? 0 : "26px" }}>
          {screen === "dashboard" && <CommandDashboard setScreen={setScreen} />}
          {screen === "project" && <ProjectWorkspace activeProject={activeProject} setActiveProject={setActiveProject} />}
          {screen === "thesis" && <ThesisArchitect />}
          {screen === "watcher" && <WatcherHub />}
        </div>
      </div>
    </div>
  );
}
