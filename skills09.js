/* =======================
   CSV → STEP2_DATA Loader
   Format:
   Category,Subcategory,Skill,Icon
   ======================= */

let STEP2_DATA = {};
const autoColors = {}; // assign stable colors per main category

function getColorFor(category){
  if(autoColors[category]) return autoColors[category];
  const colors = ["#2d6cdf","#9b59b6","#e67e22","#16a085","#c0392b","#27ae60","#34495e","#8e44ad"];
  autoColors[category] = colors[Math.floor(Math.random()*colors.length)];
  return autoColors[category];
}

async function loadStep2CSV(url) {
  try {
    const r = await fetch(url, {cache: "no-cache"});
    const text = await r.text();
    if(!text) return;
    const rows = text.trim().split(/\r?\n/).map(r => r.split(",").map(s => s.trim()));
    if(rows.length <= 1) return;
    rows.shift(); // remove header

    STEP2_DATA = {};

    for (const row of rows) {
      // tolerant parsing if row length differs
      const [category = "Misc", sub = "General", skill = "", icon = "📌"] = row;
      if (!STEP2_DATA[category]) {
        STEP2_DATA[category] = {
          icon: "📁",
          color: getColorFor(category),
          subs: {}
        };
      }

      if (!STEP2_DATA[category].subs[sub]) {
        STEP2_DATA[category].subs[sub] = {
          icon: icon || "📌",
          skills: []
        };
      }

      if (skill && !STEP2_DATA[category].subs[sub].skills.includes(skill)) {
        STEP2_DATA[category].subs[sub].skills.push(skill);
      }
    }

    // minimal debug only
    // console.info("STEP2_DATA loaded");

    // Extract global skill list
    const all = [];
    for (const c in STEP2_DATA) {
      for (const s in STEP2_DATA[c].subs) {
        all.push(...(STEP2_DATA[c].subs[s].skills || []));
      }
    }

    // create global skillsList variable (will be merged with baseSkills later via rebuild)
    window._csvSkills = [...new Set(all)];

    // Refresh UI if your functions exist
    if (typeof rebuildSkillsListAndTemplates === "function") rebuildSkillsListAndTemplates();
    if (typeof renderFieldsRow === "function") renderFieldsRow();

  } catch (err) {
    console.error("CSV Load Failed:", err && err.message ? err.message : err);
  }
}

// Start loading (non-blocking)
loadStep2CSV("skills.csv");

/* ===========================
   FULL JS (PERFORMANCE-IMPROVED)
   =========================== */

/* ===========================
   SKILL ICONS (fallback text/emoji)
=========================== */
const SKILL_ICONS = {
  "node.js":"N","react":"","photoshop":"Ps","illustrator":"Ai","figma":"F","premiere pro":"Pr",
  "excel":"XL","word":"Wd","powerpoint":"Pp","autocad":"AC","solidworks":"Sw","matlab":"M",
  "anatomy":"An","guitar":"🎸","investment":"💹","content creation":"✍️","ethical hacking":"🛡️",
  "pentesting":"🧪"
};

/* ===========================
   Devicon mapping helpers
=========================== */
function deviconNameFor(skillName){ 
  const map = {
    "c": "c",
    "c++": "cplusplus",
    "java": "java",
    "python": "python",
    "javascript": "javascript",
    "typescript": "typescript",
    "php": "php",
    "ruby": "ruby",
    "go (golang)": "go",
    "rust": "rust",
    "swift": "swift",
    "kotlin": "kotlin",
    "dart": "dart",
    "r": "r",
    "matlab": "matlab",
    "prosthetics & orthotics": "default",
    "rehabilitation sciences": "default"
  };

  let key = String(skillName || "").trim().toLowerCase();
  key = key.replace(/\s*\(.*\)/g,"");
  key = key.replace(/\s*\/\s*/g," / ");
  key = key.replace(/\s+/g," ").trim();

  if(map[key]) return map[key];

  let n = key
    .replace(/\./g,"")
    .replace(/\s+/g,"-")
    .replace(/[^a-z0-9\-]/g,"");
  n = n.replace(/\+\+/g,"plusplus")
       .replace(/\+/g,"plus")
       .replace(/#/g,"sharp");
  return n || key;
}

function deviconURL(skillName){
  const name = deviconNameFor(skillName);
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;
}

/* ===========================
   Flatten helper (reads STEP2_DATA safely)
=========================== */
function flattenSkillsFromStep2(){
  const all = [];
  for(const f in STEP2_DATA){
    const subs = STEP2_DATA[f] && STEP2_DATA[f].subs;
    if(!subs) continue;
    for(const s in subs){
      const arr = subs[s].skills || [];
      arr.forEach(k => all.push(k));
    }
  }
  return [...new Set(all)];
}

/* ===========================
   Base skills + dynamic merge
=========================== */
const baseSkills = ["HTML","CSS","JavaScript","Python","Node.js","React","SQL","Java","C++"];

/* ===========================
   selectedSkills -> CLEAR on load (per request)
   - DO NOT auto-restore selected on refresh
   - Keep saveSkills() behavior intact allowing explicit save
=========================== */
let selectedSkills = []; // intentionally NOT reading from localStorage to clear on refresh

/* ===========================
   DOM refs (guarded)
=========================== */
const input = document.getElementById("searchInput");
const panel = document.getElementById("panel");
const cardsWrap = document.getElementById("cards");
const selectedContainer = document.getElementById("selectedContainer");

const fieldsContainer = document.getElementById('fieldsContainer');
const subcatContainer = document.getElementById('subcatContainer');
const subcatGrid = document.getElementById('subcatGrid');
const skillsContainer = document.getElementById('skillsContainer');
const skillsGrid = document.getElementById('skillsGrid');
const skillsTitle = document.getElementById('skillsTitle');
const step2Back = document.getElementById('step2Back');
const submitBtn = document.getElementById("submitBtn");

/* If critical elements missing, avoid throwing errors and exit functions early */
function domOk(...els){
  for(const e of els) if(!e) return false;
  return true;
}

/* ===========================
   Card cache (create lazily)
   - DON'T create nodes for all skills at startup
   - Create only when needed (populateCards)
=========================== */
const cardNodes = {}; // stores template nodes for skills created on-demand
let visibleCards = [];
let highlightIndex = -1;

/* ===========================
   Icon element generator (lazy, minimal requests)
   - Use loading="lazy"
   - Only create img element when actually appended
   - No console logs on error; fallback quietly
=========================== */
function renderIconElement(skillName, size = 20) {
  const keyLower = (skillName || "").toLowerCase();

  // 1) explicit fallback map (case-insensitive)
  if (SKILL_ICONS[keyLower]) {
    const span = document.createElement('span');
    span.className = 'icon-fallback-text';
    span.textContent = SKILL_ICONS[keyLower];
    span.setAttribute('aria-hidden','true');
    return span;
  }

  // 2) create image with lazy loading — if it 404s browser will show broken request but no JS error
  const img = document.createElement('img');
  img.width = size;
  img.height = size;
  img.style.objectFit = 'contain';
  img.alt = skillName || '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.src = deviconURL(skillName);

  // fallback replacement on error (replace node quietly)
  img.addEventListener('error', () => {
    // create simple fallback
    const fallback = document.createElement('span');
    fallback.className = 'icon-fallback-text';
    const words = (skillName || "").trim().split(/\s+/);
    if (words.length >= 2) fallback.textContent = (words[0][0] + words[1][0]).toUpperCase();
    else fallback.textContent = (skillName || "").slice(0,2).toUpperCase();
    if(img.parentNode) img.parentNode.replaceChild(fallback, img);
  }, { once: true });

  return img;
}

/* ===========================
   Render Selected Skills panel
=========================== */
function renderSelected(){
  if(!domOk(selectedContainer)) return;
  selectedContainer.innerHTML = "";
  selectedSkills.forEach((s, idx) => {
    const skill = s.name;
    const percent = s.percent || "100%";

    const tag = document.createElement('div');
    tag.className = 'skill-tag';

    // icon
    const iconWrap = document.createElement('div');
    iconWrap.className = 'icon';
    // append icon lazily: create element now (loading=lazy) so browser defers network
    iconWrap.appendChild(renderIconElement(skill, 20));

    // name
    const nameWrap = document.createElement('div');
    nameWrap.style.flex = '1';
    nameWrap.innerHTML = `<div style="font-weight:700">${skill}</div>`;

    // percent input
    const percentInput = document.createElement('input');
    percentInput.type = 'text';
    percentInput.value = percent;
    percentInput.maxLength = 4;
    percentInput.addEventListener('input', (e)=> {
      s.percent = e.target.value;
    });

    // remove button
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-btn';
    removeBtn.title = 'Remove';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', ()=> {
      selectedSkills = selectedSkills.filter(x => x.name !== skill);
      renderSelected();
      // refresh dropdown badges if visible
      populateCards(input ? input.value || "" : "");
    });

    tag.appendChild(iconWrap);
    tag.appendChild(nameWrap);
    tag.appendChild(percentInput);
    tag.appendChild(removeBtn);

    selectedContainer.appendChild(tag);
  });
}
renderSelected();

/* Save button handler (keeps previous behaviour) */
function saveSkills(){
  try {
    localStorage.setItem("selectedSkills", JSON.stringify(selectedSkills));
    // optional: give UI feedback elsewhere
  } catch(e){}
}
if(submitBtn) submitBtn.addEventListener("click", saveSkills);

/* ===========================
   Core select helper (used by search & fields explorer)
=========================== */
function selectSkillByName(name, pctText = "100%"){
  if(!selectedSkills.find(s => s.name === name)){
    selectedSkills.push({ name, percent: pctText });
    renderSelected();
  } else {
    // update percent if provided & changed
    const obj = selectedSkills.find(s => s.name === name);
    if(obj && pctText && pctText !== (obj.percent || '100%')){
      obj.percent = pctText;
      renderSelected();
    }
  }
  // keep search ready
  if(!input) return;
  input.value = "";
  setTimeout(()=>{ input.focus(); populateCards(""); }, 0);
}

/* ===========================
   Lazy template creation helper
   - create a card node only when needed
=========================== */
function createCardNode(name){
  const div = document.createElement('div');
  div.className = 'card';
  div.dataset.skill = name;

  const iconWrap = document.createElement('div');
  iconWrap.className = 'icon';
  // icon element deferred but created now (loading=lazy)
  iconWrap.appendChild(renderIconElement(name, 20));

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `<div class="skill-name">${name}</div><div class="small">Click to select</div>`;

  const badge = document.createElement('div');
  badge.className = 'percent-badge';
  badge.innerHTML = `<span class="pct-text">100%</span> <span class="pencil" title="Edit percent">✎</span>`;

  div.appendChild(iconWrap);
  div.appendChild(meta);
  div.appendChild(badge);

  cardNodes[name] = div;
  return div;
}

/* ===========================
   populateCards(filter)
   - builds dropdown items based on filter
   - optimized: only create nodes for visible subset
=========================== */
function populateCards(filter){
  if(!domOk(cardsWrap)) return;
  cardsWrap.innerHTML = "";
  const q = (filter || "").trim().toLowerCase();
  visibleCards = [];

  // Choose iteration set: if query small, filter across skillsList; otherwise limit
  // Determine skillsList by merging base + CSV (if available)
  const extras = Array.isArray(window._csvSkills) ? window._csvSkills : [];
  const mergedSet = Array.from(new Set([...baseSkills, ...extras]));
  // small optimization: if mergedSet huge, limit search to prefix matches first then full
  const MAX_SHOW = 250; // safety cap to avoid huge DOM
  let matches = [];

  if(!q){
    // if empty query, show most popular/short list: baseSkills + first 50 extras (keeps DOM low)
    matches = [...baseSkills, ...extras.slice(0, Math.min(50, extras.length))];
  } else {
    for(const name of mergedSet){
      if(name.toLowerCase().includes(q)) matches.push(name);
      if(matches.length >= MAX_SHOW) break;
    }
  }

  // Create nodes only for matches
  for(const name of matches){
    const template = cardNodes[name] || createCardNode(name);
    const node = template.cloneNode(true);

    // ensure percent shows current selection percent if exists
    const sel = selectedSkills.find(s => s.name === name);
    const pct = sel ? (sel.percent || "100%") : "100%";
    const badge = node.querySelector('.percent-badge');
    if(badge) badge.innerHTML = `<span class="pct-text">${pct}</span> <span class="pencil" title="Edit percent">✎</span>`;

    // click to select (skip pencil)
    node.addEventListener('click', (e) => {
      if(e.target && e.target.classList && e.target.classList.contains('pencil')) return;
      const skill = node.dataset.skill;
      const pctText = node.querySelector('.pct-text') ? node.querySelector('.pct-text').textContent : "100%";
      selectSkillByName(skill, pctText);
    });

    // pencil handler (delegated per node)
    const pencil = node.querySelector('.pencil');
    if(pencil){
      pencil.addEventListener('click', ev=> {
        ev.stopPropagation();
        openPercentEditor(node);
      });
    }

    // hover sets highlight index (sync with keyboard)
    node.addEventListener('mouseenter', ()=> {
      highlightIndex = visibleCards.indexOf(node);
      updateHighlight();
    });

    cardsWrap.appendChild(node);
    visibleCards.push(node);
  }

  highlightIndex = visibleCards.length > 0 ? 0 : -1;
  updateHighlight();
}

/* ===========================
   Inline percent editor for dropdown nodes
=========================== */
function openPercentEditor(card){
  if(!card) return;
  const badge = card.querySelector('.percent-badge');
  if(!badge) return;
  const currentNode = badge.querySelector('.pct-text');
  const current = currentNode ? currentNode.textContent.replace('%','') : '100';
  badge.innerHTML = `<input class="percent-edit" type="number" min="0" max="100" value="${parseInt(current,10)||100}" style="width:56px;padding:4px;border-radius:6px">`;

  const inputNum = badge.querySelector('.percent-edit');
  if(!inputNum) return;
  inputNum.focus(); inputNum.select();

  function commit(){
    let v = parseInt(inputNum.value,10);
    if(isNaN(v) || v < 0) v = 0;
    if(v > 100) v = 100;
    badge.innerHTML = `<span class="pct-text">${v}%</span> <span class="pencil" title="Edit percent">✎</span>`;
    // rebind pencil
    const newP = badge.querySelector('.pencil');
    if(newP) newP.addEventListener('click', e=>{
      e.stopPropagation();
      openPercentEditor(card);
    });
    // update selectedSkills if exists
    const skillName = card.dataset.skill;
    const obj = selectedSkills.find(s => s.name === skillName);
    if(obj){ obj.percent = v + "%"; renderSelected(); }
    populateCards(input ? input.value || "" : "");
  }

  inputNum.addEventListener('blur', commit);
  inputNum.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){ inputNum.blur(); e.preventDefault(); }
    if(e.key === 'Escape'){
      badge.innerHTML = `<span class="pct-text">${current}%</span> <span class="pencil" title="Edit percent">✎</span>`;
      const newP = badge.querySelector('.pencil');
      if(newP) newP.addEventListener('click', ev=>{
        ev.stopPropagation();
        openPercentEditor(card);
      });
    }
  });
}

/* ===========================
   Highlight helpers
=========================== */
function updateHighlight(){
  visibleCards.forEach((n,i) => n.classList.toggle('highlight', i === highlightIndex));
  if(highlightIndex >= 0 && visibleCards[highlightIndex]){
    // smooth can be heavy; use 'auto' when lots of items to minimize layout thrash
    try {
      visibleCards[highlightIndex].scrollIntoView({ block: 'nearest', behavior: 'auto' });
    } catch(e){}
  }
}

/* ===========================
   Keyboard nav for search input
=========================== */
if(input){
  input.addEventListener('keydown', (e) => {
    // If an inline editor is focused, ignore
    const active = document.activeElement;
    if(active && active.classList && (active.classList.contains('percent-edit') || active.classList.contains('pct-input'))) return;

    if(panel && panel.style && panel.style.display === 'block'){
      if(e.key === 'ArrowDown' || e.key === 'ArrowRight'){
        e.preventDefault();
        if(visibleCards.length === 0) return;
        highlightIndex = (highlightIndex + 1) % visibleCards.length;
        updateHighlight();
      } else if(e.key === 'ArrowUp' || e.key === 'ArrowLeft'){
        e.preventDefault();
        if(visibleCards.length === 0) return;
        highlightIndex = (highlightIndex - 1 + visibleCards.length) % visibleCards.length;
        updateHighlight();
      } else if(e.key === 'Enter'){
        e.preventDefault();
        if(highlightIndex >= 0 && visibleCards[highlightIndex]){
          const node = visibleCards[highlightIndex];
          // trigger click on highlighted node (select)
          node.dispatchEvent(new MouseEvent('click', { bubbles:true }));
          highlightIndex = 0;
          updateHighlight();
        } else if(visibleCards.length === 1){
          visibleCards[0].dispatchEvent(new MouseEvent('click', { bubbles:true }));
        }
      } else if(e.key === 'Escape'){
        e.preventDefault();
        closePanel();
        input.blur();
      }
    }
  });
}

/* ===========================
   Auto-typing placeholder effect (optional)
   - disabled if huge list (avoid heavy loops)
=========================== */
let autoTyping = true, autoTimer = null, typeIndex = 0, charIndex = 0, forward = true;
function startAutoType(){
  if(!input) return;
  // if there are too many skills (from csv) don't run auto-typing to save CPU/DOM thrash
  const extras = Array.isArray(window._csvSkills) ? window._csvSkills.length : 0;
  if(extras > 300) return; // skip auto-typing for large datasets

  if(autoTimer) clearInterval(autoTimer);
  autoTyping = true; input.placeholder=''; charIndex = 0; forward = true;
  // sample set: base + first small extras
  const extrasArr = Array.isArray(window._csvSkills) ? window._csvSkills.slice(0,100) : [];
  const sample = Array.from(new Set([...baseSkills, ...extrasArr]));
  autoTimer = setInterval(()=>{
    const word = sample[typeIndex % sample.length] || "skills";
    if(forward){
      charIndex++;
      input.value = word.slice(0,charIndex);
      if(charIndex >= word.length){ forward = false; }
    } else {
      charIndex--;
      input.value = word.slice(0,charIndex);
      if(charIndex <= 0){ forward = true; typeIndex++; }
    }
  }, 100);
}
function stopAutoTypeInstant(){ if(autoTimer) clearInterval(autoTimer); autoTyping=false; setTimeout(()=>{ if(input){ input.value=''; input.placeholder='Search any skill'; } }, 100); }

/* ===========================
   Input focus / click / open/close panel
=========================== */
if(input){
  input.addEventListener('focus', ()=>{ stopAutoTypeInstant(); openPanel(); });
  input.addEventListener('click', ()=>{ if(autoTyping) stopAutoTypeInstant(); openPanel(); });
  input.addEventListener('input', (e)=> populateCards(e.target.value) );
}

/* open / close panel */
function openPanel(){
  if(!panel) return;
  panel.style.display = 'block';
  panel.setAttribute('aria-hidden','false');
  populateCards(input ? input.value || "" : "");
  highlightIndex = -1;
}
function closePanel(){
  if(!panel) return;
  panel.style.display = 'none';
  panel.setAttribute('aria-hidden','true');
  visibleCards = []; highlightIndex = -1;
}

/* click outside closes dropdown (guarded) */
document.addEventListener('click', (e)=>{
  const wrap = document.querySelector('.search-wrap');
  if(!wrap || !wrap.contains(e.target)) closePanel();
});

/* start auto typing (if allowed) */
startAutoType();

/* ===========================
   FIELDS EXPLORER (step-2)
=========================== */
let step2State = { openField: null, openSubcat: null };

function renderFieldsRow(){
  if(!domOk(fieldsContainer)) return;
  fieldsContainer.innerHTML = "";
  for(const fieldName in STEP2_DATA){
    const fd = STEP2_DATA[fieldName];
    const card = document.createElement('div');
    card.className = 'field-card';
    card.innerHTML = `<div class="icon" style="background:${fd.color || '#333'}">${fd.icon}</div>
                      <div><div class="field-title">${fieldName}</div><div style="font-size:12px;color:#6b7a90">${Object.keys(fd.subs || {}).length} categories</div></div>`;
    card.addEventListener('click', ()=> toggleField(fieldName, card));
    fieldsContainer.appendChild(card);
  }
}
renderFieldsRow();

function toggleField(fieldName, cardElement){
  if(!domOk(subcatContainer, skillsContainer, step2Back)) return;
  if(step2State.openField && step2State.openField !== fieldName){
    step2State.openField = null; step2State.openSubcat = null;
    subcatContainer.style.display = 'none'; skillsContainer.style.display = 'none'; step2Back.style.display = 'none';
    document.querySelectorAll('.field-card').forEach(c=>c.classList.remove('active'));
  }
  const isOpening = step2State.openField !== fieldName;
  if(!isOpening){
    step2State.openField = null; subcatContainer.style.display = 'none'; skillsContainer.style.display = 'none'; step2Back.style.display = 'none'; cardElement.classList.remove('active');
    return;
  }
  step2State.openField = fieldName; step2State.openSubcat = null;
  document.querySelectorAll('.field-card').forEach(c=>c.classList.remove('active')); cardElement.classList.add('active');
  renderSubcats(fieldName);
}

function renderSubcats(fieldName){
  if(!domOk(subcatGrid, subcatContainer, skillsContainer, step2Back)) return;
  subcatGrid.innerHTML = "";
  const subs = (STEP2_DATA[fieldName] && STEP2_DATA[fieldName].subs) || {};
  for(const subName in subs){
    const info = subs[subName];
    const sc = document.createElement('div');
    sc.className = 'subcat-card';
    sc.innerHTML = `<div style="font-weight:100;margin-bottom:6px">${info.icon} ${subName}</div><div style="font-size:12px;color:#6b7a90">${(info.skills||[]).length} skills</div>`;
    sc.addEventListener('click', ()=> openSubcat(fieldName, subName));
    subcatGrid.appendChild(sc);
  }
  subcatContainer.style.display = 'block'; skillsContainer.style.display = 'none'; step2Back.style.display = 'inline-block';
}

function openSubcat(fieldName, subName){
  if(!domOk(skillsTitle, skillsGrid, subcatContainer, skillsContainer, step2Back)) return;
  step2State.openSubcat = subName;
  const info = (STEP2_DATA[fieldName] && STEP2_DATA[fieldName].subs && STEP2_DATA[fieldName].subs[subName]) || { skills: [] };
  skillsTitle.textContent = `${subName} — ${fieldName}`;
  skillsGrid.innerHTML = "";

  (info.skills || []).forEach(skill=>{
    const card = document.createElement('div');
    card.className = 'skill-card';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'icon';
    iconWrap.appendChild(renderIconElement(skill, 26));
    card.appendChild(iconWrap);

    const nm = document.createElement('div');
    nm.className = 'skill-name';
    nm.textContent = skill;
    card.appendChild(nm);

    const badge = document.createElement('div');
    badge.className = 'pct-badge';
    badge.innerHTML = `<span class="pct-text">100%</span><span class="pencil" title="Edit">✎</span>`;
    card.appendChild(badge);

    // select
    card.addEventListener('click', (e)=>{ if(e.target && e.target.classList && e.target.classList.contains('pencil')) return; const p = card.querySelector('.pct-text') ? card.querySelector('.pct-text').textContent : "100%"; selectSkillByName(skill, p); });

    // pencil -> edit percent
    const pencil = badge.querySelector('.pencil');
    if(pencil) pencil.addEventListener('click', (ev)=>{ ev.stopPropagation(); openPercentEditorInCard(card); });

    skillsGrid.appendChild(card);
  });

  subcatContainer.style.display = 'none'; skillsContainer.style.display = 'block'; step2Back.style.display = 'inline-block';
}

if(step2Back){
  step2Back.addEventListener('click', ()=>{
    if(step2State.openSubcat){ renderSubcats(step2State.openField); step2State.openSubcat = null; }
    else if(step2State.openField){ step2State.openField = null; step2State.openSubcat = null; subcatContainer.style.display = 'none'; skillsContainer.style.display = 'none'; step2Back.style.display = 'none'; document.querySelectorAll('.field-card').forEach(c=>c.classList.remove('active')); }
  });
}

/* percent editor in step2 skill cards (fixed selectors) */
function openPercentEditorInCard(card){
  if(!card) return;
  const badge = card.querySelector('.pct-badge');
  if(!badge) return;
  const currentNode = badge.querySelector('.pct-text');
  const current = currentNode ? currentNode.textContent.replace('%','') : '100';
  badge.innerHTML = `<input class="pct-input" type="number" min="0" max="100" value="${parseInt(current,10)||100}" style="width:64px;padding:4px;border-radius:6px">`;
  const inp = badge.querySelector('.pct-input');
  if(!inp) return;
  inp.focus(); inp.select();

  function commit(){
    let v = parseInt(inp.value,10); if(isNaN(v)||v<0) v=0; if(v>100) v=100;
    badge.innerHTML = `<span class="pct-text">${v}%</span><span class="pencil" title="Edit">✎</span>`;
    const p = badge.querySelector('.pencil');
    if(p) p.addEventListener('click', (e)=>{ e.stopPropagation(); openPercentEditorInCard(card); });
    const name = card.querySelector('.skill-name').textContent;
    const obj = selectedSkills.find(x=>x.name === name);
    if(obj){ obj.percent = v + '%'; renderSelected(); }
    populateCards(input ? input.value || "" : "");
  }

  inp.addEventListener('blur', commit);
  inp.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ commit(); } if(e.key === 'Escape'){ badge.innerHTML = `<span class="pct-text">${current}%</span><span class="pencil" title="Edit">✎</span>`; const p = badge.querySelector('.pencil'); if(p) p.addEventListener('click', ev=>{ ev.stopPropagation(); openPercentEditorInCard(card); }); } });
}

/* ===========================
   Initial population & render
   - populateCards("") intentionally lightweight (shows base + small extras)
   - renderFieldsRow called after CSV loads
=========================== */
populateCards("");
renderFieldsRow();

/* ===========================
   Utility: Rebuild skills list and templates when STEP2_DATA changes
   - keeps behavior but performs lazily
=========================== */
function rebuildSkillsListAndTemplates(){
  // rebuild flat list
  const extras = flattenSkillsFromStep2();
  const merged = Array.from(new Set([...baseSkills, ...extras]));
  // clear cardNodes (we keep them lazy)
  for(const k in cardNodes) delete cardNodes[k];
  // Pre-create nothing — creation happens on-demand within populateCards
  // If dropdown open, refresh visible items
  populateCards(input ? input.value || "" : "");
}

/* End of improved JS file */
