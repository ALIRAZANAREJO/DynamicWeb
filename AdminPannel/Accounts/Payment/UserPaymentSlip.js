import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, get, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/* ================= Firebase ================= */
const firebaseConfig = {
  apiKey: "AIzaSyCmL8qcjg4S6NeY3erraq_XhlDJ7Ek2s_E",
  authDomain: "palestine-web.firebaseapp.com",
  databaseURL: "https://palestine-web-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "palestine-web",
  storageBucket: "palestine-web.appspot.com",
  messagingSenderId: "35190212487",
  appId: "1:35190212487:web:0a699bb1fa7b1a49113522"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ================= Helpers ================= */
function formatRemaining(ms) {
  if (!ms || ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function calcExpiry(pkgExpiry = "") {
  const map = {
    "3Months": 1000 * 60 * 60 * 24 * 90,
    "6Months": 1000 * 60 * 60 * 24 * 180,
    "12Months": 1000 * 60 * 60 * 24 * 365
  };
  return Date.now() + (map[pkgExpiry] || 0);
}

/* ================= DOM ================= */
const grid = document.getElementById("cardsGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const refreshBtn = document.getElementById("refreshBtn");
const slipModal = document.getElementById("slipModal");
const modalImg = document.getElementById("modalImg");
const modalMeta = document.getElementById("modalMeta");
const closeModal = document.getElementById("closeModal");

/* ================= Filters ================= */
function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const f = filterStatus.value;
  let visible = 0;

  document.querySelectorAll(".card").forEach(card => {
    const email = card.dataset.email || "";
    const method = card.dataset.method || "";
    const status = card.dataset.status || "Pending";

    const matchSearch = !q || email.includes(q) || method.includes(q);
    const matchStatus = (f === "all" || f === status);

    card.style.display = (matchSearch && matchStatus) ? "" : "none";
    if (matchSearch && matchStatus) visible++;
  });

  emptyState.style.display = visible ? "none" : "block";
}

/* ================= Card Builder ================= */
let timers = [];

function createCard(safeEmail, methodKey, account, access) {
  const status = access?.paymentStatus || "Pending";

  const card = document.createElement("article");
  card.className = "card";
  card.dataset.email = safeEmail;
  card.dataset.method = methodKey.toLowerCase();
  card.dataset.status = status;

  card.innerHTML = `
    <div class="left">
      <div class="avatar">${safeEmail.slice(0,2).toUpperCase()}</div>
    </div>
    <div class="body">
      <h4>${safeEmail}</h4>
      <div class="meta-row">
        <span class="badge ${status.toLowerCase()}">${status}</span>
        <span class="timer">No timer</span>
      </div>
      <div class="meta-row">
        <div>Package: ${account.pkgName || "-"}</div>
        <div>Expiry: ${account.pkgExpiry || "-"}</div>
      </div>
      ${account.paymentSlipURL ? `<img class="slip-thumb" src="${account.paymentSlipURL}" />` : ""}
      <div class="actions">
        <button class="btn view">View Slip</button>
        <button class="btn verify">Verify</button>
        <button class="btn reject">Reject</button>
      </div>
    </div>
  `;

  /* Timer */
  if (access?.expiresAt) {
    const timer = card.querySelector(".timer");
    timer.textContent = `Time left: ${formatRemaining(access.expiresAt - Date.now())}`;
    timers.push({ timer, access });
  }

  /* Actions */
  card.querySelector(".view").onclick = () => {
    if (!account.paymentSlipURL) return alert("No slip");
    modalImg.src = account.paymentSlipURL;
    modalMeta.textContent = safeEmail;
    slipModal.setAttribute("aria-hidden", "false");
  };

  card.querySelector(".verify").onclick = () =>
    onVerify(safeEmail, methodKey, account.pkgExpiry, card);

  card.querySelector(".reject").onclick = () =>
    onReject(safeEmail, methodKey, card);

  return card;
}

/* ================= Verify / Reject ================= */
async function onVerify(safeEmail, methodKey, pkgExpiry, card) {
  if (!confirm(`Verify payment for ${safeEmail}?`)) return;

  const expiresAt = calcExpiry(pkgExpiry);

  await update(
    ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Access`),
    {
      paymentStatus: "Verified",
      pkgExpiry,
      verifiedAt: Date.now(),
      expiresAt
    }
  );

  await update(
    ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Accounts/${methodKey}`),
    { status: "Verified" }
  );

  card.dataset.status = "Verified";
  card.querySelector(".badge").textContent = "Verified";
  card.querySelector(".badge").className = "badge verified";
  applyFilters();
}

async function onReject(safeEmail, methodKey, card) {
  if (!confirm(`Reject payment for ${safeEmail}?`)) return;

  await update(
    ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Access`),
    { paymentStatus: "Rejected" }
  );

  await update(
    ref(db, `AR_Technologies/Ai/Dynamic_Web/${safeEmail}/Portfolio/Accounts/${methodKey}`),
    { status: "Rejected" }
  );

  card.dataset.status = "Rejected";
  card.querySelector(".badge").textContent = "Rejected";
  card.querySelector(".badge").className = "badge rejected";
  applyFilters();
}

/* ================= Timer Loop ================= */
setInterval(() => {
  const now = Date.now();
  timers.forEach(t => {
    if (t.access?.expiresAt) {
      t.timer.textContent = `Time left: ${formatRemaining(t.access.expiresAt - now)}`;
    }
  });
}, 1000);

/* ================= Load Data ================= */
const rootRef = ref(db, "AR_Technologies/Ai/Dynamic_Web");

function render(data) {
  grid.innerHTML = "";
  timers = [];

  Object.keys(data || {}).forEach(safeEmail => {
    const node = data[safeEmail];
    const access = node?.Portfolio?.Access || {};
    const accounts = node?.Portfolio?.Accounts || {};

    Object.keys(accounts).forEach(methodKey => {
      grid.appendChild(
        createCard(safeEmail, methodKey, accounts[methodKey], access)
      );
    });
  });

  applyFilters();
}

onValue(rootRef, snap => {
  if (!snap.exists()) {
    grid.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }
  render(snap.val());
});

/* ================= Controls ================= */
refreshBtn.onclick = async () => {
  const snap = await get(rootRef);
  render(snap.exists() ? snap.val() : {});
};

searchInput.oninput = applyFilters;
filterStatus.onchange = applyFilters;
closeModal.onclick = () => slipModal.setAttribute("aria-hidden", "true");
