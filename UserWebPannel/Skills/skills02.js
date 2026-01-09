/* ----- data & existing save logic (unchanged) ----- */
let selectedSkills = JSON.parse(localStorage.getItem("selectedSkills")) || [];

/* ====== Global Skill Tree ====== */
const SKILL_TREE = {
  "Computer Science": {
    "Programming": ["HTML","CSS","JavaScript","Python","C++","Java","SQL","Node.js","React","MongoDB"],
    "Graphic Designing": ["Photoshop","Illustrator","CorelDRAW"],
    "Video Editing": ["Adobe Premiere","Final Cut Pro","After Effects"],
    "MS Office": ["Word","Excel","PowerPoint"],
    "3D Animation": ["Blender","Maya","Cinema 4D"],
    "Hacking": ["Ethical Hacking","Penetration Testing","Reverse Engineering"]
  },
  "Engineering": {
    "Mechanical": ["AutoCAD","SolidWorks","MATLAB"],
    "Civil": ["STAAD Pro","ETABS","Revit"],
    "Electrical": ["Proteus","PSpice","Simulink"]
  },
  "Medical": {
    "General": ["Surgery","Nursing","Pharmacy"],
    "Specializations": ["Cardiology","Neurology","Radiology"]
  },
  "Arts": {
    "Painting": ["Oil Painting","Watercolor"],
    "Music": ["Guitar","Piano","Singing"]
  },
  "Commerce": {
    "Finance": ["Accounting","Taxation","Auditing"],
    "Management": ["Business Strategy","Project Management"]
  },
  "Social Media": {
    "Platforms": ["Facebook Ads","Instagram Marketing","YouTube SEO"]
  },
  "Law": {
    "Fields": ["Criminal Law","Corporate Law","International Law"]
  }
};

/* Flatten tree for global list */
function getAllSkills(){
  const all = [];
  for (let field in SKILL_TREE){
    for (let sub in SKILL_TREE[field]){
      SKILL_TREE[field][sub].forEach(skill=>{
        all.push(skill);
      });
    }
  }
  return all;
}
const skillsList = getAllSkills();

/* existing DOM refs */
const input = document.getElementById("searchInput");
const panel = document.getElementById("panel");
const cardsWrap = document.getElementById("cards");
const selectedContainer = document.getElementById("selectedContainer");

/* render selected skills (kept same behavior) */
function renderSkills() {
  selectedContainer.innerHTML = "";
  selectedSkills.forEach(skillObj => {
    const skill = skillObj.name;
    const percent = skillObj.percent || "100%";
    const tag = document.createElement("div");
    tag.className = "skill-tag";
    tag.innerHTML = `
      <span>${skill}</span>
      <input type="text" value="${percent}" maxlength="4" />
      <span class="remove-btn">×</span>
    `;
    // update percent
    tag.querySelector("input").addEventListener("input", e => {
      skillObj.percent = e.target.value;
    });
    // remove
    tag.querySelector(".remove-btn").addEventListener("click", () => {
      selectedSkills = selectedSkills.filter(s => s.name !== skill);
      renderSkills();
    });
    selectedContainer.appendChild(tag);
  });
}
renderSkills();

/* Save to storage + redirect (unchanged) */
function saveSkills() {
  localStorage.setItem("selectedSkills", JSON.stringify(selectedSkills));
  alert("Skills saved! You can now submit personal data.");
}
document.getElementById("submitBtn").addEventListener("click", saveSkills);


/* ----- UI enhancements (new) ----- */

/* mapping for icon text + color class */
const ICON_MAP = {
  "HTML": { txt:"<>", cls:"ic-html" },
  "CSS": { txt:"#", cls:"ic-css" },
  "JavaScript": { txt:"JS", cls:"ic-js" },
  "Python": { txt:"Py", cls:"ic-py" },
  "Node.js": { txt:"N", cls:"ic-node" },
  "React": { txt:"⚛", cls:"ic-react" },
  "SQL": { txt:"DB", cls:"ic-sql" },
  "Java": { txt:"☕", cls:"ic-java" },
  "C++": { txt:"C++", cls:"ic-cpp" }
};

/* state for keyboard nav */
let visibleCards = []; // elements currently visible
let highlightIndex = -1;

/* build full cards once (keeps DOM nodes ready) */
const cardNodes = {};
skillsList.forEach(name => {
  const div = document.createElement("div");
  div.className = "card";
  div.dataset.skill = name;
  div.innerHTML = `
    <div class="icon ${ICON_MAP[name]?.cls || ''}">${ICON_MAP[name]?.txt || name[0]}</div>
    <div class="meta">
      <div class="skill-name">${name}</div>
      <div class="small">Click to select</div>
    </div>
    <div class="percent-badge"><span class="pct-text">100%</span> <span class="pencil" title="Edit percent">✎</span></div>
  `;
  // click to select
  div.addEventListener("click", e => {
    if (e.target.classList.contains('pencil')) return;
    const skill = div.dataset.skill;
    const pctText = div.querySelector('.pct-text').textContent || "100%";
    if (!selectedSkills.find(s => s.name === skill)) {
      selectedSkills.push({ name: skill, percent: pctText });
      renderSkills();
    }
    input.value = "";
    input.focus();
    populateCards("");
  });
  // pencil edit
  const pencil = div.querySelector('.pencil');
  pencil.addEventListener('click', (ev) => {
    ev.stopPropagation();
    openPercentEditor(div);
  });
  cardNodes[name] = div;
});

/* percent editor */
function openPercentEditor(card){
  const badge = card.querySelector('.percent-badge');
  const current = (badge.querySelector('.pct-text') ? badge.querySelector('.pct-text').textContent.replace('%','') : '100') || '100';
  badge.innerHTML = `<input class="percent-edit" type="number" min="0" max="100" value="${parseInt(current,10)||100}">`;
  const inputNum = badge.querySelector('.percent-edit');
  inputNum.focus();
  inputNum.select();
  function commit(){
    let v = parseInt(inputNum.value,10);
    if(isNaN(v) || v < 0) v = 0;
    if(v > 100) v = 100;
    badge.innerHTML = `<span class="pct-text">${v}%</span> <span class="pencil" title="Edit percent">✎</span>`;
    badge.querySelector('.pencil').addEventListener('click', e=>{
      e.stopPropagation();
      openPercentEditor(card);
    });
    const skillName = card.dataset.skill;
    const obj = selectedSkills.find(s=>s.name===skillName);
    if(obj) { obj.percent = v + "%"; renderSkills(); }
    populateCards(input.value || "");
  }
  inputNum.addEventListener('blur', commit);
  inputNum.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){ inputNum.blur(); e.preventDefault(); }
    if(e.key === 'Escape'){
      badge.innerHTML = `<span class="pct-text">${current}%</span> <span class="pencil" title="Edit percent">✎</span>`;
      badge.querySelector('.pencil').addEventListener('click', ev=>{ ev.stopPropagation(); openPercentEditor(card); });
    }
  });
}

/* open / close panel helpers */
function openPanel(){
  panel.style.display = "block";
  panel.setAttribute('aria-hidden','false');
  populateCards(input.value || "");
  highlightIndex = -1;
}
function closePanel(){
  panel.style.display = "none";
  panel.setAttribute('aria-hidden','true');
  visibleCards = []; highlightIndex = -1;
}

/* populate cards based on filter */
function populateCards(filter){
  cardsWrap.innerHTML = "";
  const q = (filter || "").trim().toLowerCase();
  visibleCards = [];
  skillsList.forEach(name => {
    if(!q || name.toLowerCase().includes(q)){
      const node = cardNodes[name].cloneNode(true);
      const sel = selectedSkills.find(s=>s.name===name);
      const pct = sel ? (sel.percent || "100%") : "100%";
      const badge = node.querySelector('.percent-badge');
      badge.innerHTML = `<span class="pct-text">${pct}</span> <span class="pencil" title="Edit percent">✎</span>`;
      node.addEventListener("click", e=>{
        if(e.target.classList.contains('pencil')) return;
        const skill = node.dataset.skill;
        const pctText = node.querySelector('.pct-text').textContent || "100%";
        if(!selectedSkills.find(s=>s.name===skill)){
          selectedSkills.push({ name: skill, percent: pctText });
          renderSkills();
        }
        input.value = "";
        input.focus();
        populateCards("");
      });
      const pencil = node.querySelector('.pencil');
      pencil.addEventListener('click', ev=>{
        ev.stopPropagation();
        openPercentEditor(node);
      });
      cardsWrap.appendChild(node);
      visibleCards.push(node);
    }
  });
  if(visibleCards.length === 0) highlightIndex = -1;
  updateHighlight();
}

/* highlight helpers */
function updateHighlight(){
  visibleCards.forEach((n,i)=>{
    n.classList.toggle('highlight', i === highlightIndex);
    if(i === highlightIndex) n.scrollIntoView({block:'nearest',behavior:'smooth'});
  });
}

/* keyboard nav */
input.addEventListener('keydown', (e)=>{
  if(panel.style.display !== 'block') return;
  const active = document.activeElement;
  if(active && active.classList && active.classList.contains('percent-edit')) return;

  if(e.key === 'ArrowDown'){
    e.preventDefault();
    if(visibleCards.length === 0) return;
    highlightIndex = (highlightIndex + 1) % visibleCards.length;
    updateHighlight();
  } else if(e.key === 'ArrowUp'){
    e.preventDefault();
    if(visibleCards.length === 0) return;
    highlightIndex = (highlightIndex - 1 + visibleCards.length) % visibleCards.length;
    updateHighlight();
  } else if(e.key === 'Enter'){
    e.preventDefault();
    if(highlightIndex >= 0 && visibleCards[highlightIndex]){
      visibleCards[highlightIndex].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      highlightIndex = -1;
      updateHighlight();
    } else if(visibleCards.length === 1){
      visibleCards[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
    }
  } else if(e.key === 'Escape'){
    e.preventDefault();
    closePanel();
    input.blur();
  }
});

/* auto-typing */
let autoTyping = true;
let autoTimer = null;
let typeIndex = 0;
let charIndex = 0;
let forward = true;
function startAutoType(){
  if(autoTimer) clearInterval(autoTimer);
  autoTyping = true;
  input.placeholder = '';
  charIndex = 0; forward = true;
  autoTimer = setInterval(()=>{
    const word = skillsList[typeIndex % skillsList.length];
    if(forward){
      charIndex++;
      input.value = word.slice(0, charIndex);
      if(charIndex >= word.length){ forward = false; }
    } else {
      charIndex--;
      input.value = word.slice(0, charIndex);
      if(charIndex <= 0){ forward = true; typeIndex++; }
    }
  }, 120);
}
function stopAutoTypeInstant(){
  if(autoTimer) clearInterval(autoTimer);
  autoTyping = false;
  setTimeout(()=>{ input.value = ""; input.placeholder = "Search any skill"; }, 100);
}

/* input focus */
input.addEventListener('focus', ()=>{
  stopAutoTypeInstant();
  openPanel();
});
input.addEventListener('click', ()=>{
  if(autoTyping) stopAutoTypeInstant();
  openPanel();
});
input.addEventListener('input', (e)=>{
  const q = e.target.value;
  populateCards(q);
});

/* outside click */
document.addEventListener('click', (e)=>{
  if(!document.querySelector('.search-wrap').contains(e.target)) closePanel();
});

/* start auto-typing */
startAutoType();

/* reset highlight on mouse move */
cardsWrap.addEventListener('mousemove', ()=>{
  highlightIndex = -1;
  updateHighlight();
});
