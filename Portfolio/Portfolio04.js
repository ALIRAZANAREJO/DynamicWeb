// portfolio.js
// =================== Firebase Setup ===================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// ----------------- Firebase configuration -----------------
const firebaseConfig = {
  apiKey: "AIzaSyCmL8qcjg4S6NeY3erraq_XhlDJ7Ek2s_E",
  authDomain: "palestine-web.firebaseapp.com",
  databaseURL: "https://palestine-web-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "palestine-web",
  storageBucket: "palestine-web.appspot.com",
  messagingSenderId: "35190212487",
  appId: "1:35190212487:web:0a699bb1fa7b1a49113522",
  measurementId: "G-8TE04Z9ZFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =================== Helpers ===================
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const k in attrs) {
    if (k === "class") node.className = attrs[k];
    else if (k === "html") node.innerHTML = attrs[k];
    else node.setAttribute(k, attrs[k]);
  }
  children.forEach(c => node.append(typeof c === "string" ? document.createTextNode(c) : c));
  return node;
}

function safeText(v, fallback = "-") {
  return (v === undefined || v === null || String(v).trim() === "") ? fallback : v;
}

// =================== UI CSS (injected) ===================
const PORTFOLIO_CSS = `
:root{
  --bg:#0b0d10;
  --card:#0f1720;
  --muted:#9aa6b2;
  --accent:#2b87ff;
  --glass: rgba(255,255,255,0.03);
  --radius:12px;
  --gap:18px;
  --max-width:1100px;
  color-scheme: dark;
}
*{box-sizing:border-box}
body { background: linear-gradient(180deg,#061018 0%, #07121a 100%); font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; margin:0; color:#e6eef6; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }
#portfolioRoot{ max-width:var(--max-width); margin:40px auto; padding:24px; border-radius:16px; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); box-shadow: 0 6px 30px rgba(2,6,23,0.7); }
/* Header / hero */
.portfolio-hero{ display:flex; gap:20px; align-items:center; margin-bottom:20px; flex-wrap:wrap; }
.hero-left{ width:140px; min-width:120px; height:140px; border-radius:14px; overflow:hidden; background:var(--glass); display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.03); }
.hero-left img{ width:100%; height:100%; object-fit:cover; display:block; }
.hero-body{ flex:1; min-width:220px; }
.hero-name{ font-size:22px; font-weight:700; letter-spacing:0.2px; display:flex; gap:10px; align-items:baseline; }
.hero-name .fname{ font-size:14px; color:var(--muted); font-weight:600; }
.hero-prof{ color:var(--accent); margin-top:6px; font-weight:600; }
.hero-about{ margin-top:12px; color:var(--muted); line-height:1.5; max-width:820px; }

/* contact & badges */
.contact-row{ display:flex; gap:12px; margin-top:12px; flex-wrap:wrap; }
.contact-pill{ background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:999px; color:var(--muted); font-size:13px; border:1px solid rgba(255,255,255,0.02); }

/* layout */
.sections-grid{ display:grid; grid-template-columns: 1fr 360px; gap:var(--gap); margin-top:20px; }
@media (max-width:980px){ .sections-grid{ grid-template-columns: 1fr; } }

/* left main column */
.main-col{ display:flex; flex-direction:column; gap:var(--gap); }

/* Skills */
.skills-grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(140px,1fr)); gap:12px; }
.skill-card{ padding:14px; background:linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.01)); border-radius:12px; border:1px solid rgba(255,255,255,0.03); box-shadow: 0 4px 18px rgba(2,6,23,0.5); display:flex; align-items:center; justify-content:center; font-weight:600; }
.skill-card small{ display:block; color:var(--muted); font-weight:500; }

/* education & experience */
.timeline{ display:flex; flex-direction:column; gap:12px; }
.edu-card, .exp-card{ padding:14px; background:linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02)); border-radius:12px; border:1px solid rgba(255,255,255,0.03); }
.edu-card h4, .exp-card h4{ margin:0; font-size:15px; }
.edu-card .meta, .exp-card .meta{ color:var(--muted); font-size:13px; margin-top:6px; }
.edu-card p, .exp-card p{ margin:8px 0 0 0; color:var(--muted); font-size:13px; line-height:1.45; }
.exp-card ul{ margin:8px 0 0 16px; padding-left:18px; color:var(--muted); }

/* right sidebar */
.side-card{ padding:14px; background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:12px; border:1px solid rgba(255,255,255,0.03); position:sticky; top:24px; }
.languages { display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; }
.lang-badge{ padding:8px 10px; background:rgba(255,255,255,0.02); border-radius:999px; color:var(--muted); font-size:13px; }

/* subtle animations */
.fade-in { animation: fadeInUp .45s ease both; }
@keyframes fadeInUp { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform: translateY(0);} }

/* small screens */
@media (max-width:520px){
  .hero-left{ width:100px; height:100px; }
  .hero-name{ font-size:18px; }
  #portfolioRoot{ margin:18px; padding:18px; }
}
`;

// =================== Main Logic ===================
document.addEventListener("DOMContentLoaded", async () => {
  // container
  let root = document.getElementById("portfolioRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "portfolioRoot";
    document.body.prepend(root);
  }

  // inject styles
  if (!document.getElementById("portfolio-styles")) {
    const s = document.createElement("style");
    s.id = "portfolio-styles";
    s.innerHTML = PORTFOLIO_CSS;
    document.head.appendChild(s);
  }

  // show temporary loader
  root.innerHTML = `<div style="padding:28px;text-align:center;color:var(--muted)">Loading portfolio…</div>`;

  // CNIC handling (reuse your logic)
  const cnicInputEL = document.getElementById("Cnic");
  if (cnicInputEL) {
    cnicInputEL.addEventListener("input", () => {
      const val = cnicInputEL.value.trim();
      if (val) localStorage.setItem("Cnic", val);
    });
  }

  let Cnic = localStorage.getItem("Cnic");
  if (!Cnic) {
    Cnic = prompt("Enter your CNIC to load portfolio:");
    if (!Cnic) {
      root.innerHTML = `<div style="padding:28px;text-align:center;color:var(--muted)">No CNIC provided — cannot load data.</div>`;
      return;
    }
    localStorage.setItem("Cnic", Cnic);
  }

  // fetch data
  try {
    const dbRef = ref(db);
    const snap = await get(child(dbRef, `resContainer9/${Cnic}`));
    if (!snap.exists()) {
      root.innerHTML = `<div style="padding:28px;text-align:center;color:var(--muted)">No data found for CNIC: ${Cnic}</div>`;
      localStorage.removeItem("Cnic");
      return;
    }
    const data = snap.val();
    renderPortfolio(data, root);
  } catch (err) {
    console.error("Error loading data:", err);
    root.innerHTML = `<div style="padding:28px;text-align:center;color:#ff6b6b">Error loading portfolio. Check console.</div>`;
  }
});

// =================== Renderer ===================
function renderPortfolio(data, root) {
  const personal = data.Personal || {};
  const skillsObj = data.Skills || {};
  const education = data.Education || {};
  const experience = Array.isArray(data.Experience) ? data.Experience : (data.Experience ? Object.values(data.Experience) : []);
  // languages stored in personal.Paddres per your earlier code
  const languagesRaw = personal.Paddres || "";
  const languages = languagesRaw ? languagesRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

  // derive arrays
  // Skills: handle both object-of-skill-objects or array
  let skillsArr = [];
  if (Array.isArray(skillsObj)) skillsArr = skillsObj;
  else if (typeof skillsObj === "object") {
    skillsArr = Object.values(skillsObj).map(it => (typeof it === "string" ? it : (it?.name || it)));
  }

  // Education items: gather known keys preserving typical order
  const eduKeys = ["school", "college", "university", "master", "phd"];
  const eduList = [];
  for (const k of eduKeys) {
    if (education[k]) {
      eduList.push({ key: k, ...education[k] });
    }
  }
  // Also include any extra education keys
  for (const k of Object.keys(education)) {
    if (!eduKeys.includes(k) && education[k]) eduList.push({ key: k, ...education[k] });
  }

  // Build DOM
  root.innerHTML = ""; // clear
  const hero = el("div", { class: "portfolio-hero fade-in" }, [
    // left image
    el("div", { class: "hero-left" }, [
      el("img", { src: safeText(personal.ImageUrl, "/assets/default-profile.png"), alt: "Profile" })
    ]),
    // body
    el("div", { class: "hero-body" }, [
      el("div", { class: "hero-name" }, [
        el("div", { html: safeText(personal.Name, "Full Name") }),
        el("div", { class: "fname", html: safeText(personal.Fname, "") })
      ]),
      el("div", { class: "hero-prof", html: safeText(personal.profession, "Profession") }),
      el("div", { class: "hero-about", html: safeText(personal.about, "About info not provided.") }),
      el("div", { class: "contact-row" }, [
        el("div", { class: "contact-pill", html: `📞 ${safeText(personal.Phone, "-")}` }),
        el("div", { class: "contact-pill", html: `✉️ ${safeText(personal.Lisnt, "-")}` }),
        el("div", { class: "contact-pill", html: `📍 ${safeText(personal.Caddres, "-")}` })
      ])
    ])
  ]);

  // Main + sidebar layout
  const grid = el("div", { class: "sections-grid" }, [
    // left main column
    el("div", { class: "main-col" }, [
      // Skills section
      el("section", { class: "fade-in" }, [
        el("h3", { html: "Professional Skills" }),
        el("div", { class: "skills-grid", id: "skillsGrid" }, skillsArr.length ? skillsArr.map(s =>
          el("div", { class: "skill-card" }, [ el("div", { html: safeText((typeof s === "string" ? s : s.name), "-" ) }) ])
        ) : [ el("div", { html: "<small style='color:var(--muted)'>No skills listed</small>" }) ])
      ]),

      // Education section
      el("section", { class: "fade-in" }, [
        el("h3", { html: "Education Journey" }),
        el("div", { class: "timeline" }, eduList.length ? eduList.map(ed => {
          const start = safeText(ed.Startyear, "");
          const end = safeText(ed.Endyear, "");
          const degreeLabel = safeText(ed.Degree || ed.Title || ed.Name || "", "");
          return el("div", { class: "edu-card" }, [
            el("h4", { html: `${degreeLabel} ${start || end ? `(${start} - ${end})` : ""}` }),
            el("div", { class: "meta", html: safeText(ed.Name || ed.Institute || ed.Place || ed.title, "") }),
            el("p", { html: `${safeText(ed.Field || ed.field || "", "")}${ed.Subfield ? " / " + safeText(ed.Subfield, "") : ""}` }),
            el("p", { html: `${ed.Gpa ? "GPA: "+safeText(ed.Gpa) : (ed.Percentage ? "Percentage: "+safeText(ed.Percentage) : "")}` })
          ]);
        }) : [ el("div", { html: "<small style='color:var(--muted)'>No education data available</small>" }) ])
      ]),

      // Experience section
      el("section", { class: "fade-in" }, [
        el("h3", { html: "Professional Experience" }),
        el("div", { class: "timeline" }, experience.length ? experience.map(exp => {
          const dur = `${safeText(exp.durationNumber, "")} ${safeText(exp.durationUnit, "")}`.trim();
          return el("div", { class: "exp-card" }, [
            el("h4", { html: safeText(exp.organizationName || exp.company || exp.place || "Organization") }),
            el("div", { class: "meta", html: `${safeText(exp.organizationPosition || exp.position || exp.role, "Position")} ${dur ? "— " + dur : ""}` }),
            exp.details ? el("ul", {}, exp.details.map(d => el("li", { html: d }))) : el("p", { html: safeText(exp.summary || exp.description || "", "") })
          ]);
        }) : [ el("div", { html: "<small style='color:var(--muted)'>No experience listed</small>" }) ])
      ])
    ]),

    // Right sidebar
    el("aside", { class: "side-card fade-in" }, [
      el("h4", { html: "Contact & Quick Info" }),
      el("div", { style: "margin-top:10px; color:var(--muted); font-size:13px;" }, [
        el("div", { html: `<strong>Phone:</strong> ${safeText(personal.Phone, "-")}` }),
        el("div", { html: `<strong>Email:</strong> ${safeText(personal.Lisnt, "-")}` }),
        el("div", { html: `<strong>Location:</strong> ${safeText(personal.Caddres, "-")}` })
      ]),
      el("hr", { style: "margin:12px 0; border:none; border-top:1px solid rgba(255,255,255,0.03);" }),
      el("h4", { html: "Languages" }),
      el("div", { class: "languages" }, languages.length ? languages.map(l => el("div", { class: "lang-badge", html: l })) : el("div", { style: "color:var(--muted); font-size:13px" , html: "No languages listed" })),
      el("hr", { style: "margin:12px 0; border:none; border-top:1px solid rgba(255,255,255,0.03);" }),
      el("h4", { html: "Profile Links" }),
      el("div", { style: "margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;" }, [
        personal.Website ? el("a", { href: personal.Website, target: "_blank", class: "contact-pill", html: "Website" }) : null,
        personal.LinkedIn ? el("a", { href: personal.LinkedIn, target: "_blank", class: "contact-pill", html: "LinkedIn" }) : null,
        personal.GitHub ? el("a", { href: personal.GitHub, target: "_blank", class: "contact-pill", html: "GitHub" }) : null
      ].filter(Boolean))
    ])
  ]);

  root.append(hero, grid);
}

// end of file
