/* ---------------------------
  MERGED script.js
  - unified selected panel
  - search (original behavior) kept
  - fields explorer separate but feeds same selected panel
----------------------------*/

/* ====== STEP-2 DATA (fields -> subs -> skills) ====== */
const STEP2_DATA = {
  "Computer Science": {
    icon: "💻", color:"#2d6cdf",
    subs: {
      "Programming": { icon: "🧑‍💻", skills: ["HTML","CSS","JavaScript","Python","C++","Java","SQL","MongoDB","Node.js","React"] },
      "Graphic Designing": { icon: "🎨", skills: ["Photoshop","Illustrator","Figma","CorelDRAW"] },
      "Hacking": { icon: "🛡️", skills: ["Ethical Hacking","PenTesting","Reverse Engineering"] }
    }
  },
  "Engineering": {
    icon: "🛠️", color:"#b06b2d",
    subs: {
      "Mechanical": { icon:"⚙️", skills:["AutoCAD","SolidWorks","Thermodynamics"] },
      "Civil": { icon:"🏗️", skills:["Surveying","Revit","Concrete Tech"] }
    }
  },
  "Medical": {
    icon:"🏥", color:"#c62828",
    subs: { "General": { icon:"🩺", skills:["Anatomy","Surgery Basics","Pharmacology"] }, "Nursing": { icon:"👩‍⚕️", skills:["Patient Care","ICU Skills","Pathology"] } }
  },
  "Arts": {
    icon:"🎨", color:"#8e44ad",
    subs: { "Painting": { icon:"🖌️", skills:["Oil Painting","Watercolors","Sketching"] }, "Music": { icon:"🎵", skills:["Guitar","Piano","Singing"] } }
  },
  "Commerce": {
    icon:"💼", color:"#0b6b4f",
    subs: { "Accounting": { icon:"🧾", skills:["Bookkeeping","Auditing","Taxation"] }, "Finance": { icon:"📈", skills:["Investment","Banking","Stock Market"] } }
  },
  "Social Media": {
    icon:"📱", color:"#ff6b00",
    subs: { "Marketing": { icon:"📣", skills:["Content Creation","SEO","Facebook Ads","TikTok Growth"] }, "Management": { icon:"🧭", skills:["Community Management","Analytics","Branding"] } }
  },
  "Law": {
    icon:"⚖️", color:"#555555",
    subs: { "Criminal Law": { icon:"🕵️", skills:["Case Analysis","Forensics","Advocacy"] }, "Corporate Law": { icon:"📜", skills:["Contracts","Mergers","Compliance"] } }
  }
};

/* small icons for some skills */
const SKILL_ICONS = {
  "HTML":"<>","CSS":"#", "JavaScript":"JS", "Python":"Py","C++":"C++","Java":"☕","SQL":"DB","MongoDB":"MDB",
  "Node.js":"N","React":"⚛","Photoshop":"Ps","Illustrator":"Ai","Figma":"F","Premiere Pro":"Pr", "Excel":"XL",
  "Word":"Wd","PowerPoint":"Pp","AutoCAD":"AC","SolidWorks":"Sw","MATLAB":"M", "Anatomy":"An","Guitar":"🎸",
  "Investment":"💹","Content Creation":"✍️", "Ethical Hacking":"🛡️","PenTesting":"🧪"
};

/* ----- Build global skillsList by flattening STEP2_DATA ----- */
function flattenSkillsFromStep2(){
  const all = [];
  for(const f in STEP2_DATA){
    const subs = STEP2_DATA[f].subs;
    for(const s in subs){
      subs[s].skills.forEach(k=> all.push(k));
    }
  }
  return [...new Set(all)]; // unique
}
const extraFromFields = flattenSkillsFromStep2();

/* ----- Existing search skills (original small list) ----- */
const baseSkills = ["HTML","CSS","JavaScript","Python","Node.js","React","SQL","Java","C++"];

/* Unified skillsList for search = baseSkills + extraFromFields (unique) */
const skillsList = Array.from(new Set([...baseSkills, ...extraFromFields]));

/* -----------------------
   Selected skills (unified)
   stored in localStorage as selectedSkills
------------------------*/
let selectedSkills = JSON.parse(localStorage.getItem("selectedSkills")) || [];

/* DOM refs (search) */
const input = document.getElementById("searchInput");
const panel = document.getElementById("panel");
const cardsWrap = document.getElementById("cards");

/* DOM refs (fields explorer) */
const fieldsContainer = document.getElementById('fieldsContainer');
const subcatContainer = document.getElementById('subcatContainer');
const subcatGrid = document.getElementById('subcatGrid');
const skillsContainer = document.getElementById('skillsContainer');
const skillsGrid = document.getElementById('skillsGrid');
const skillsTitle = document.getElementById('skillsTitle');
const step2Back = document.getElementById('step2Back');

/* Selected container (unified UI) */
const selectedContainer = document.getElementById("selectedContainer");

/* ICON_MAP for search + selected UI (extendable) */
const ICON_MAP = {
  "HTML": { txt:"<>", cls:"ic-html" },
  "CSS": { txt:"#", cls:"ic-css" },
  "JavaScript": { txt:"JS", cls:"ic-js" },
  "Python": { txt:"Py", cls:"ic-py" },
  "Node.js": { txt:"N", cls:"ic-node" },
  "React": { txt:"⚛", cls:"ic-react" },
  "SQL": { txt:"DB", cls:"ic-sql" },
  "Java": { txt:"☕", cls:"ic-java" },
  "C++": { txt:"C++", cls:"ic-cpp" },
  "Ethical Hacking": { txt:"🛡", cls:"ic-hack" },
  "MS Office": { txt:"📊", cls:"ic-office" }
};

/* -----------------------
   RENDER Selected Skills (unified)
   Each selected item looks like a skill-card: icon, name, percent, pencil, remove
------------------------*/
function renderSelected(){
  selectedContainer.innerHTML = "";
  selectedSkills.forEach((s, idx)=>{
    const div = document.createElement("div");
    div.className = "skill-tag";
    const iconTxt = ICON_MAP[s.name]?.txt || SKILL_ICONS[s.name] || s.name.slice(0,2).toUpperCase();
    const iconCls = ICON_MAP[s.name]?.cls || "";
    div.innerHTML = `
      <div class="icon ${iconCls}" style="background:#00337f">${iconTxt}</div>
      <div style="flex:1"><div style="font-weight:700">${s.name}</div></div>
      <input type="text" value="${s.percent || '100%'}" maxlength="4" />
      <span class="remove-btn" title="Remove">×</span>
    `;
    // percent input change
    div.querySelector("input").addEventListener("input", e=>{
      s.percent = e.target.value;
    });
    // remove
    div.querySelector(".remove-btn").addEventListener("click", ()=>{
      selectedSkills = selectedSkills.filter(x=> x.name !== s.name);
      renderSelected();
    });
    selectedContainer.appendChild(div);
  });
}
renderSelected();

/* Save button behavior (same as before) */
function saveSkills(){
  localStorage.setItem("selectedSkills", JSON.stringify(selectedSkills));
  alert("Skills saved! You can now submit personal data.");
  window.location.href = "personal.html";
}
document.getElementById("submitBtn").addEventListener("click", saveSkills);

/* -----------------------
   CORE select function (used by both systems)
   - avoids duplicates
   - focuses search input after selection
------------------------*/
function selectSkillByName(name, pctText = "100%"){
  if(!selectedSkills.find(s => s.name === name)){
    selectedSkills.push({ name, percent: pctText });
    renderSelected();
  } else {
    // update percent if supplied and different
    const obj = selectedSkills.find(s=>s.name===name);
    if(obj && pctText && pctText !== (obj.percent || '100%')){ obj.percent = pctText; renderSelected(); }
  }
  // keep search ready
  input.value = "";
  setTimeout(()=>{ input.focus(); populateCards(""); }, 0);
}

/* -----------------------
   SEARCH: build cardNodes (templates)
------------------------*/
const cardNodes = {};
skillsList.forEach(name=>{
  const div = document.createElement("div");
  div.className = "card";
  div.dataset.skill = name;
  div.innerHTML = `
    <div class="icon ${ICON_MAP[name]?.cls || ''}">${ICON_MAP[name]?.txt || SKILL_ICONS[name] || name.slice(0,2).toUpperCase()}</div>
    <div class="meta"><div class="skill-name">${name}</div><div class="small">Click to select</div></div>
    <div class="percent-badge"><span class="pct-text">100%</span> <span class="pencil" title="Edit percent">✎</span></div>
  `;
  // attach pencil handler on template (when cloned we rebind)
  cardNodes[name] = div;
});

/* state for search keyboard nav */
let visibleCards = [];
let highlightIndex = -1;

/* populate dropdown cards (search) */
function populateCards(filter){
  cardsWrap.innerHTML = "";
  const q = (filter || "").trim().toLowerCase();
  visibleCards = [];
  // Use matches in order, then append. Keep dropdown height controlled by CSS.
  skillsList.forEach(name=>{
    if(!q || name.toLowerCase().includes(q)){
      const node = cardNodes[name].cloneNode(true);
      // update percent if selected
      const sel = selectedSkills.find(s=>s.name===name);
      const pct = sel ? (sel.percent || "100%") : "100%";
      const badge = node.querySelector('.percent-badge');
      badge.innerHTML = `<span class="pct-text">${pct}</span> <span class="pencil" title="Edit percent">✎</span>`;

      // click to select
      node.addEventListener("click", e=>{
        if(e.target.classList.contains('pencil')) return;
        const skill = node.dataset.skill;
        const pctText = node.querySelector('.pct-text').textContent || "100%";
        selectSkillByName(skill, pctText);
      });

      // pencil editor for this cloned node
      const pencil = node.querySelector('.pencil');
      pencil.addEventListener('click', ev=>{
        ev.stopPropagation();
        openPercentEditor(node);
      });

      // hover sets highlight index
      node.addEventListener('mouseenter', ()=> {
        highlightIndex = visibleCards.indexOf(node);
        updateHighlight();
      });

      cardsWrap.appendChild(node);
      visibleCards.push(node);
    }
  });

  // default highlight first visible
  if(visibleCards.length > 0) highlightIndex = 0;
  else highlightIndex = -1;
  updateHighlight();
}

/* percent inline editor used in search dropdown */
function openPercentEditor(card){
  const badge = card.querySelector('.percent-badge');
  const current = badge.querySelector('.pct-text') ? badge.querySelector('.pct-text').textContent.replace('%','') : '100';
  badge.innerHTML = `<input class="percent-edit" type="number" min="0" max="100" value="${parseInt(current,10)||100}">`;
  const inputNum = badge.querySelector('.percent-edit');
  inputNum.focus(); inputNum.select();
  function commit(){
    let v = parseInt(inputNum.value,10);
    if(isNaN(v) || v < 0) v = 0;
    if(v > 100) v = 100;
    badge.innerHTML = `<span class="pct-text">${v}%</span> <span class="pencil" title="Edit percent">✎</span>`;
    badge.querySelector('.pencil').addEventListener('click', e=>{ e.stopPropagation(); openPercentEditor(card); });
    // update selectedSkills if exists
    const skillName = card.dataset.skill;
    const obj = selectedSkills.find(s=>s.name===skillName);
    if(obj){ obj.percent = v + "%"; renderSelected(); }
    populateCards(input.value || "");
  }
  inputNum.addEventListener('blur', commit);
  inputNum.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ inputNum.blur(); e.preventDefault(); } if(e.key==='Escape'){ badge.innerHTML = `<span class="pct-text">${current}%</span> <span class="pencil" title="Edit percent">✎</span>`; badge.querySelector('.pencil').addEventListener('click', ev=>{ ev.stopPropagation(); openPercentEditor(card); }); } });
}

/* highlight helpers */
function updateHighlight(){
  visibleCards.forEach((n,i)=> n.classList.toggle('highlight', i === highlightIndex));
  if(highlightIndex >= 0 && visibleCards[highlightIndex]) visibleCards[highlightIndex].scrollIntoView({block:'nearest',behavior:'smooth'});
}

/* keyboard nav for search (preserve original behavior) */
input.addEventListener('keydown', (e)=>{
  const active = document.activeElement;
  if(active && active.classList && active.classList.contains('percent-edit')) return;

  if(panel.style.display === 'block'){
    if(e.key === 'ArrowDown' || e.key === 'ArrowRight'){ e.preventDefault(); if(visibleCards.length===0) return; highlightIndex = (highlightIndex + 1) % visibleCards.length; updateHighlight(); }
    else if(e.key === 'ArrowUp' || e.key === 'ArrowLeft'){ e.preventDefault(); if(visibleCards.length===0) return; highlightIndex = (highlightIndex - 1 + visibleCards.length) % visibleCards.length; updateHighlight(); }
    else if(e.key === 'Enter'){ e.preventDefault(); if(highlightIndex >=0 && visibleCards[highlightIndex]){ const node = visibleCards[highlightIndex]; const skill = node.dataset.skill; const pctText = node.querySelector('.pct-text').textContent || "100%"; selectSkillByName(skill, pctText); highlightIndex = 0; updateHighlight(); } else if(visibleCards.length === 1){ const node = visibleCards[0]; const skill = node.dataset.skill; const pctText = node.querySelector('.pct-text').textContent || "100%"; selectSkillByName(skill, pctText); } }
    else if(e.key === 'Escape'){ e.preventDefault(); closePanel(); input.blur(); }
  }
});

/* auto typing (unchanged) */
let autoTyping = true, autoTimer = null, typeIndex = 0, charIndex = 0, forward = true;
function startAutoType(){
  if(autoTimer) clearInterval(autoTimer);
  autoTyping = true; input.placeholder=''; charIndex = 0; forward = true;
  autoTimer = setInterval(()=>{
    const word = skillsList[typeIndex % skillsList.length];
    if(forward){ charIndex++; input.value = word.slice(0,charIndex); if(charIndex >= word.length) { forward = false; } }
    else { charIndex--; input.value = word.slice(0,charIndex); if(charIndex <=0){ forward = true; typeIndex++; } }
  }, 120);
}
function stopAutoTypeInstant(){ if(autoTimer) clearInterval(autoTimer); autoTyping=false; setTimeout(()=>{ input.value=''; input.placeholder='Search any skill'; }, 100); }

/* input focus behavior (open dropdown on click) */
input.addEventListener('focus', ()=>{ stopAutoTypeInstant(); openPanel(); });
input.addEventListener('click', ()=>{ if(autoTyping) stopAutoTypeInstant(); openPanel(); });
input.addEventListener('input', (e)=> populateCards(e.target.value) );

/* open/close panel */
function openPanel(){ panel.style.display='block'; panel.setAttribute('aria-hidden','false'); populateCards(input.value || ""); highlightIndex = -1; }
function closePanel(){ panel.style.display='none'; panel.setAttribute('aria-hidden','true'); visibleCards=[]; highlightIndex=-1; }

/* click outside closes dropdown (search) */
document.addEventListener('click', (e)=>{ if(!document.querySelector('.search-wrap').contains(e.target)) closePanel(); });

/* start auto type */
startAutoType();

/* ------------------------
   FIELDS EXPLORER (separate UI)
   - renders fields row
   - open field -> shows subcats
   - open subcat -> shows skills
   - selecting skill uses selectSkillByName
-------------------------*/
let step2State = { openField: null, openSubcat: null };
function renderFieldsRow(){
  fieldsContainer.innerHTML = "";
  for(const fieldName in STEP2_DATA){
    const fd = STEP2_DATA[fieldName];
    const card = document.createElement('div');
    card.className = 'field-card';
    card.innerHTML = `<div class="icon" style="background:${fd.color || '#333'}">${fd.icon}</div>
                      <div><div class="field-title">${fieldName}</div><div style="font-size:12px;color:#6b7a90">${Object.keys(fd.subs).length} categories</div></div>`;
    card.addEventListener('click', ()=> toggleField(fieldName, card));
    fieldsContainer.appendChild(card);
  }
}
function toggleField(fieldName, cardElement){
  if(step2State.openField && step2State.openField !== fieldName){
    step2State.openField = null; step2State.openSubcat = null;
    subcatContainer.style.display='none'; skillsContainer.style.display='none'; step2Back.style.display='none';
    document.querySelectorAll('.field-card').forEach(c=>c.classList.remove('active'));
  }
  const isOpening = step2State.openField !== fieldName;
  if(!isOpening){
    step2State.openField = null; subcatContainer.style.display='none'; skillsContainer.style.display='none'; step2Back.style.display='none'; cardElement.classList.remove('active'); return;
  }
  step2State.openField = fieldName; step2State.openSubcat = null;
  document.querySelectorAll('.field-card').forEach(c=>c.classList.remove('active')); cardElement.classList.add('active');
  renderSubcats(fieldName);
}
function renderSubcats(fieldName){
  subcatGrid.innerHTML = "";
  const subs = STEP2_DATA[fieldName].subs;
  for(const subName in subs){
    const info = subs[subName];
    const sc = document.createElement('div');
    sc.className = 'subcat-card';
    sc.innerHTML = `<div style="font-weight:700;margin-bottom:6px">${info.icon} ${subName}</div><div style="font-size:12px;color:#6b7a90">${info.skills.length} skills</div>`;
    sc.addEventListener('click', ()=> openSubcat(fieldName, subName));
    subcatGrid.appendChild(sc);
  }
  subcatContainer.style.display='block'; skillsContainer.style.display='none'; step2Back.style.display='inline-block';
}
function openSubcat(fieldName, subName){
  step2State.openSubcat = subName;
  const info = STEP2_DATA[fieldName].subs[subName];
  skillsTitle.textContent = `${subName} — ${fieldName}`;
  skillsGrid.innerHTML = "";
  info.skills.forEach(skill=>{
    const card = document.createElement('div');
    card.className = 'skill-card';
    const icon = SKILL_ICONS[skill] || SKILL_ICONS[skill] || skill.slice(0,2).toUpperCase();
    card.innerHTML = `<div class="icon" style="background:#2b6cff">${icon}</div>
                      <div class="skill-name">${skill}</div>
                      <div class="pct-badge"><span class="pct-text">100%</span><span class="pencil" title="Edit">✎</span></div>`;
    card.addEventListener('click', (e)=>{ if(e.target.classList.contains('pencil')) return; const p = card.querySelector('.pct-text').textContent || "100%"; selectSkillByName(skill, p); });
    const pencil = card.querySelector('.pencil');
    pencil.addEventListener('click', (ev)=>{ ev.stopPropagation(); openPercentEditorInCard(card); });
    skillsGrid.appendChild(card);
  });
  subcatContainer.style.display='none'; skillsContainer.style.display='block'; step2Back.style.display='inline-block';
}
step2Back.addEventListener('click', ()=>{
  if(step2State.openSubcat){ renderSubcats(step2State.openField); step2State.openSubcat = null; }
  else if(step2State.openField){ step2State.openField = null; step2State.openSubcat = null; subcatContainer.style.display='none'; skillsContainer.style.display='none'; step2Back.style.display='none'; document.querySelectorAll('.field-card').forEach(c=>c.classList.remove('active')); }
});

/* percent editor for skill cards (STEP-2) */
function openPercentEditorInCard(card){
  const badge = card.querySelector('.pct-badge');
  const current = badge.querySelector('.pct-text').textContent.replace('%','') || '100';
  badge.innerHTML = `<input class="pct-input" type="number" min="0" max="100" value="${parseInt(current,10)||100}" style="width:64px;padding:4px;border-radius:6px">`;
  const inp = badge.querySelector('.pct-input');
  inp.focus(); inp.select();
  function commit(){
    let v = parseInt(inp.value,10); if(isNaN(v)||v<0) v=0; if(v>100) v=100;
    badge.innerHTML = `<span class="pct-text">${v}%</span><span class="pencil" title="Edit">✎</span>`;
    badge.querySelector('.pencil').addEventListener('click', (e)=>{ e.stopPropagation(); openPercentEditorInCard(card); });
    const name = card.querySelector('.skill-name').textContent;
    const obj = selectedSkills.find(x=>x.name===name);
    if(obj){ obj.percent = v + '%'; renderSelected(); }
  }
  inp.addEventListener('blur', commit);
  inp.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ commit(); } if(e.key==='Escape'){ badge.innerHTML=`<span class="pct-text">${current}%</span><span class="pencil" title="Edit">✎</span>`; badge.querySelector('.pencil').addEventListener('click', ev=>{ ev.stopPropagation(); openPercentEditorInCard(card); }); } });
}

/* percent editor for search dropdown (already implemented earlier) */
function openPercentEditor(card){
  const badge = card.querySelector('.percent-badge');
  const current = badge.querySelector('.pct-text') ? badge.querySelector('.pct-text').textContent.replace('%','') : '100';
  badge.innerHTML = `<input class="percent-edit" type="number" min="0" max="100" value="${parseInt(current,10)||100}">`;
  const inputNum = badge.querySelector('.percent-edit');
  inputNum.focus(); inputNum.select();
  function commit(){
    let v = parseInt(inputNum.value,10);
    if(isNaN(v) || v < 0) v = 0;
    if(v > 100) v = 100;
    badge.innerHTML = `<span class="pct-text">${v}%</span> <span class="pencil" title="Edit percent">✎</span>`;
    badge.querySelector('.pencil').addEventListener('click', e=>{ e.stopPropagation(); openPercentEditor(card); });
    const skillName = card.dataset.skill;
    const obj = selectedSkills.find(s=>s.name===skillName);
    if(obj){ obj.percent = v + "%"; renderSelected(); }
    populateCards(input.value || "");
  }
  inputNum.addEventListener('blur', commit);
  inputNum.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ inputNum.blur(); e.preventDefault(); } if(e.key === 'Escape'){ badge.innerHTML = `<span class="pct-text">${current}%</span> <span class="pencil" title="Edit percent">✎</span>`; badge.querySelector('.pencil').addEventListener('click', ev=>{ ev.stopPropagation(); openPercentEditor(card); }); } });
}

/* initial render for fields */
renderFieldsRow();