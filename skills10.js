/* =======================
   CSV → STEP2_DATA Loader
   Format: Category,Subcategory,Skill,Icon
======================= */


// Lazy init flag (prevents heavy render on page load)
let skillsInitialized = false;

let STEP2_DATA = {}; 
const autoColors = {}; // assign stable colors per main category

// Predefined icons for categories (same order as CSV categories)
const CATEGORY_ICONS_ONLY = [
  "💻", "🏗️", "🩺", "💼", "⚖️", "🎨", "📚", "🔬", "📐", "🌐",
  "💰", "🧠", "🏛️", "🌱", "🌾", "💊", "🩹", "🎥", "🏨", "🌍"
];

function getColorFor(category){
  if(autoColors[category]) return autoColors[category];
  const colors = ["#2d6cdf","#9b59b6","#e67e22","#16a085","#c0392b","#27ae60","#34495e","#8e44ad"];
  autoColors[category] = colors[Math.floor(Math.random()*colors.length)];
  return autoColors[category];
}

async function loadStep2CSV(url) {
  try {
    const text = await (await fetch(url)).text();
    const rows = text.trim().split(/\r?\n/).map(r => r.split(",").map(s => s.trim()));
    rows.shift(); // remove header

    STEP2_DATA = {};
    const categoryList = [...new Set(rows.map(r => r[0]))]; // unique categories

    for (const [category, sub, skill, icon] of rows) {
      if (!STEP2_DATA[category]) {
        // Assign icon from predefined list based on category index
        const idx = categoryList.indexOf(category);
        const catIcon = CATEGORY_ICONS_ONLY[idx] || "📁";

        STEP2_DATA[category] = {
          icon: catIcon,
          color: getColorFor(category),
          subs: {}
        };
      }

      if (!STEP2_DATA[category].subs[sub]) {
        STEP2_DATA[category].subs[sub] = { icon: icon || "📌", skills: [] };
      }

      if (skill && !STEP2_DATA[category].subs[sub].skills.includes(skill)) {
        STEP2_DATA[category].subs[sub].skills.push(skill);
      }
    }

    // Extract global skill list
    const all = [];
    for (const c in STEP2_DATA) {
      for (const s in STEP2_DATA[c].subs) all.push(...STEP2_DATA[c].subs[s].skills);
    }

    window.skillsList = [...new Set(all)];
    localStorage.setItem("skillsList", JSON.stringify(skillsList));

    if (typeof rebuildSkillsListAndTemplates === "function") rebuildSkillsListAndTemplates();
    if (typeof renderFieldsRow === "function") renderFieldsRow();
  } catch (err) { console.error("❌ CSV Load Failed:", err); }
}

// Load CSV
loadStep2CSV("skills.csv");



function initSkillsOnce() {
  if (skillsInitialized) return; // already loaded → skip

  skillsInitialized = true;

  // Build skill cards only once
  rebuildSkillsListAndTemplates();

  // Build category cards
  renderFieldsRow();
}


/* =========================
   Skill icons & fallback
   (Lazy Loading Enabled)
========================= */

// Optional custom text fallback override
const SKILL_ICONS = {
  "Node.js":"N","React":"","Photoshop":"Ps","Illustrator":"Ai","Figma":"F",
  "Premiere Pro":"Pr","Excel":"XL","Word":"Wd","PowerPoint":"Pp","AutoCAD":"AC",
  "SolidWorks":"Sw","MATLAB":"M","Anatomy":"An","Guitar":"🎸","Investment":"💹",
  "Content Creation":"✍️","Ethical Hacking":"🛡️","PenTesting":"🧪"
};

function deviconNameFor(skillName){
  const map = {
    "c": "c","c++": "cplusplus","java": "java","python": "python","javascript": "javascript",
    "typescript": "typescript","php": "php","ruby": "ruby","go (golang)": "go",
    "rust": "rust","swift": "swift","kotlin": "kotlin","dart": "dart","r": "r","matlab": "matlab"
  };
  let key = String(skillName).trim().toLowerCase().replace(/\s*\(.*\)/g,"").trim();
  if(map[key]) return map[key];
  let n = key.replace(/\./g,"").replace(/\s+/g,"-").replace(/[^a-z0-9\-]/g,"")
             .replace(/\+\+/g,"plusplus").replace(/\+/g,"plus").replace(/#/g,"sharp");
  return n || key;
}

function deviconURL(skillName){
  const name = deviconNameFor(skillName);
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;
}

/* ✅ MAIN ICON FUNCTION (LAZY + FALLBACK) */
function renderIconElement(skillName, size = 22){
  // If manually mapped fallback symbol exists
  if(SKILL_ICONS[skillName]){
    const span = document.createElement('span');
    span.className='icon-fallback-text';
    span.textContent=SKILL_ICONS[skillName];
    return span;
  }

  // Try loading official icon
  const img = document.createElement('img');
  img.loading = "lazy"; // ✅ Lazy load icons
  img.width = img.height = size;
  img.style.objectFit = 'contain';
  img.alt = skillName;
  img.src = deviconURL(skillName);

  // If official icon not found → build fallback 2-letter
  img.onerror = () => {
    const fallback = document.createElement('span');
    fallback.className='icon-fallback-text';
    const words = skillName.trim().split(/\s+/);
    fallback.textContent = words.length>=2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : skillName.slice(0,2).toUpperCase();
    if(img.parentNode) img.parentNode.replaceChild(fallback,img);
  };

  return img;
}

/* =========================
   Skills panel & selection
========================= */
// Reset selected skills on page refresh
let selectedSkills = [];
localStorage.removeItem("selectedSkills");

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

const cardNodes = {};
let visibleCards = [];
let highlightIndex = -1;

function renderSelected(){
  selectedContainer.innerHTML = "";
  selectedSkills.forEach(s=>{
    const tag = document.createElement('div'); tag.className='skill-tag';
    const iconWrap = document.createElement('div'); iconWrap.className='icon'; iconWrap.appendChild(renderIconElement(s.name,20));
    const nameWrap = document.createElement('div'); nameWrap.style.flex='1'; nameWrap.innerHTML=`<div style="font-weight:700">${s.name}</div>`;
    const percentInput=document.createElement('input'); percentInput.type='text'; percentInput.value=s.percent||"100%"; percentInput.maxLength=4; percentInput.addEventListener('input',e=>{s.percent=e.target.value;});
    const removeBtn=document.createElement('span'); removeBtn.className='remove-btn'; removeBtn.title='Remove'; removeBtn.textContent='×';
    removeBtn.addEventListener('click',()=>{selectedSkills=selectedSkills.filter(x=>x.name!==s.name); renderSelected(); populateCards(input.value||"");});
    tag.appendChild(iconWrap); tag.appendChild(nameWrap); tag.appendChild(percentInput); tag.appendChild(removeBtn);
    selectedContainer.appendChild(tag);
  });
}
renderSelected();

function selectSkillByName(name,pctText="100%"){
  const existing=selectedSkills.find(s=>s.name===name);
  if(!existing) selectedSkills.push({name,percent:pctText});
  else existing.percent=pctText;
  renderSelected();
  input.value=""; setTimeout(()=>{ input.focus(); populateCards(""); },0);
}

/* =========================
   Card nodes & populateCards
========================= */
function flattenSkillsFromStep2(){
  const all = [];
  for(const f in STEP2_DATA){
    for(const s in STEP2_DATA[f].subs){
      const skills = STEP2_DATA[f].subs[s].skills;
      if(Array.isArray(skills)) all.push(...skills);
    }
  }
  return [...new Set(all)];
}

const baseSkills=["HTML","CSS","JavaScript","Python","Node.js","React","SQL","Java","C++"];
const skillsList=Array.from(new Set([...baseSkills,...flattenSkillsFromStep2()]));

skillsList.forEach(name=>{
  const div=document.createElement('div'); div.className='card'; div.dataset.skill=name;
  const iconWrap=document.createElement('div'); iconWrap.className='icon'; iconWrap.appendChild(renderIconElement(name,20));
  const meta=document.createElement('div'); meta.className='meta'; meta.innerHTML=`<div class="skill-name">${name}</div><div class="small">Click to select</div>`;
  const badge=document.createElement('div'); badge.className='percent-badge'; badge.innerHTML=`<span class="pct-text">100%</span> <span class="pencil" title="Edit percent">✎</span>`;
  div.appendChild(iconWrap); div.appendChild(meta); div.appendChild(badge);
  cardNodes[name]=div;
});

function updateHighlight(){
  visibleCards.forEach((n,i)=>n.classList.toggle('highlight',i===highlightIndex));
  if(highlightIndex>=0 && visibleCards[highlightIndex]) visibleCards[highlightIndex].scrollIntoView({block:'nearest',behavior:'smooth'});
}

function populateCards(filter){
  cardsWrap.innerHTML=""; visibleCards=[];
  const q=(filter||"").trim().toLowerCase();
  skillsList.forEach(name=>{
    if(!q || name.toLowerCase().includes(q)){
      const node=cardNodes[name].cloneNode(true);
      const sel=selectedSkills.find(s=>s.name===name); const pct=sel?(sel.percent||"100%"):"100%";
      node.querySelector('.percent-badge').innerHTML=`<span class="pct-text">${pct}</span> <span class="pencil" title="Edit percent">✎</span>`;
      node.addEventListener('click',e=>{if(!e.target.classList.contains('pencil')) selectSkillByName(name,pct);});
      node.querySelector('.pencil').addEventListener('click',ev=>{ev.stopPropagation(); openPercentEditorInCard(node);});
      node.addEventListener('mouseenter',()=>{highlightIndex=visibleCards.indexOf(node); updateHighlight();});
      cardsWrap.appendChild(node); visibleCards.push(node);
    }
  });
  highlightIndex=visibleCards.length>0?0:-1; updateHighlight();
}

/* =========================
   Percent editor in dropdown
========================= */
function openPercentEditorInCard(card){
  const badge=card.querySelector('.percent-badge'); const current=badge.querySelector('.pct-text').textContent.replace('%','')||'100';
  badge.innerHTML=`<input class="pct-input" type="number" min="0" max="100" value="${parseInt(current,10)||100}" style="width:64px;padding:4px;border-radius:6px">`;
  const inp=badge.querySelector('.pct-input'); inp.focus(); inp.select();
  function commit(){
    let v=parseInt(inp.value,10); if(isNaN(v)||v<0)v=0;if(v>100)v=100;
    badge.innerHTML=`<span class="pct-text">${v}%</span><span class="pencil" title="Edit">✎</span>`;
    badge.querySelector('.pencil').addEventListener('click',e=>{e.stopPropagation();openPercentEditorInCard(card);});
    const obj=selectedSkills.find(x=>x.name===card.querySelector('.skill-name').textContent); if(obj){obj.percent=v+'%'; renderSelected();}
    populateCards(input.value||"");
  }
  inp.addEventListener('blur',commit);
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'){commit();} if(e.key==='Escape'){badge.innerHTML=`<span class="pct-text">${current}%</span><span class="pencil" title="Edit">✎</span>`;badge.querySelector('.pencil').addEventListener('click',ev=>{ev.stopPropagation();openPercentEditorInCard(card);});}});
}

/* =========================
   Search input keyboard nav
========================= */
input.addEventListener('keydown',e=>{
  const active=document.activeElement;
  if(active&&active.classList&&(active.classList.contains('percent-edit')||active.classList.contains('pct-input'))) return;
  if(panel.style.display==='block'){
    if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault(); if(visibleCards.length===0) return; highlightIndex=(highlightIndex+1)%visibleCards.length; updateHighlight();}
    else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault(); if(visibleCards.length===0) return; highlightIndex=(highlightIndex-1+visibleCards.length)%visibleCards.length; updateHighlight();}
    else if(e.key==='Enter'){e.preventDefault(); if(highlightIndex>=0&&visibleCards[highlightIndex]) visibleCards[highlightIndex].dispatchEvent(new MouseEvent('click',{bubbles:true})); highlightIndex=0; updateHighlight();}
    else if(e.key==='Escape'){e.preventDefault(); closePanel(); input.blur();}
  }
});

input.addEventListener('focus',()=>{openPanel();});
input.addEventListener('click',()=>{openPanel();});
input.addEventListener('input',e=>populateCards(e.target.value));

function openPanel(){
  panel.style.display = 'block';
  panel.setAttribute('aria-hidden','false');

  // 🔥 Lazy-load everything only on first open
  initSkillsOnce();

  populateCards(input.value || "");
  highlightIndex = -1;
}

function closePanel(){panel.style.display='none';panel.setAttribute('aria-hidden','true');visibleCards=[];highlightIndex=-1;}
document.addEventListener('click',e=>{if(!document.querySelector('.search-wrap').contains(e.target)) closePanel();});

/* =========================
   Fields Explorer (Step2)
========================= */
let step2State={openField:null,openSubcat:null};
function renderFieldsRow(){
  fieldsContainer.innerHTML="";
  for(const fieldName in STEP2_DATA){
    const fd=STEP2_DATA[fieldName];
    const card=document.createElement('div'); card.className='field-card';
    card.innerHTML=`<div class="icon" style="background:${fd.color||'#333'}">${fd.icon}</div>
                    <div><div class="field-title">${fieldName}</div><div style="font-size:12px;color:#6b7a90">${Object.keys(fd.subs).length} categories</div></div>`;
    card.addEventListener('click',()=>toggleField(fieldName,card));
    fieldsContainer.appendChild(card);
  }
}
function toggleField(fieldName,cardElement){
  if(step2State.openField && step2State.openField!==fieldName){
    step2State.openField=null; step2State.openSubcat=null;
    subcatContainer.style.display='none'; skillsContainer.style.display='none'; step2Back.style.display='none';
    document.querySelectorAll('.field-card').forEach(c=>c.classList.remove('active'));
  }
  const isOpening = step2State.openField!==fieldName;
  if(!isOpening){step2State.openField=null; subcatContainer.style.display='none'; skillsContainer.style.display='none'; step2Back.style.display='none'; cardElement.classList.remove('active'); return;}
  step2State.openField=fieldName; step2State.openSubcat=null;
  document.querySelectorAll('.field-card').forEach(c=>c.classList.remove('active')); cardElement.classList.add('active');
  renderSubcats(fieldName);
}
function renderSubcats(fieldName){
  subcatGrid.innerHTML="";
  const subs=STEP2_DATA[fieldName].subs;
  for(const subName in subs){
    const info=subs[subName];
    const sc=document.createElement('div'); sc.className='subcat-card';
    sc.innerHTML=`<div style="font-weight:100;margin-bottom:6px">${info.icon} ${subName}</div><div style="font-size:12px;color:#6b7a90">${(info.skills||[]).length} skills</div>`;
    sc.addEventListener('click',()=>openSubcat(fieldName,subName));
    subcatGrid.appendChild(sc);
  }
  subcatContainer.style.display='block'; skillsContainer.style.display='none'; step2Back.style.display='inline-block';
}
function openSubcat(fieldName,subName){
  step2State.openSubcat=subName;
  const info=STEP2_DATA[fieldName].subs[subName];
  skillsTitle.textContent=`${subName} — ${fieldName}`;
  skillsGrid.innerHTML="";
  (info.skills||[]).forEach(skill=>{
    const card=document.createElement('div'); card.className='skill-card';
    const iconWrap=document.createElement('div'); iconWrap.className='icon'; iconWrap.appendChild(renderIconElement(skill,26)); card.appendChild(iconWrap);
    const nm=document.createElement('div'); nm.className='skill-name'; nm.textContent=skill; card.appendChild(nm);
    const badge=document.createElement('div'); badge.className='pct-badge'; badge.innerHTML=`<span class="pct-text"></span><span class="pencil" title="Edit"></span>`; card.appendChild(badge);
    card.addEventListener('click',e=>{if(!e.target.classList.contains('pencil')) selectSkillByName(skill,card.querySelector('.pct-text').textContent||"100%");});
    badge.querySelector('.pencil').addEventListener('click',ev=>{ev.stopPropagation(); openPercentEditorInCard(card);});
    skillsGrid.appendChild(card);
  });
  subcatContainer.style.display='none'; skillsContainer.style.display='block'; step2Back.style.display='inline-block';
}
function bindStep2BackSafe() {
  const btn = document.getElementById('step2Back');
  if (!btn) return; // ❗ prevents crash

  btn.addEventListener('click', () => {
    if (step2State.openSubcat) {
      renderSubcats(step2State.openField);
      step2State.openSubcat = null;
    } else if (step2State.openField) {
      step2State.openField = null;
      step2State.openSubcat = null;
      subcatContainer.style.display = 'none';
      skillsContainer.style.display = 'none';
      btn.style.display = 'none';
      document.querySelectorAll('.field-card').forEach(c => c.classList.remove('active'));
    }
  });
}

/* =========================
   Initial population
========================= */
// populateCards("");
// renderFieldsRow();

/* ===========================
   Utility: If you later dynamically modify STEP2_DATA,
   call rebuildSkillsList() to refresh skillsList and templates.
=========================== */
function rebuildSkillsListAndTemplates(){
  // rebuild flat list
  const extras = flattenSkillsFromStep2();
  const merged = Array.from(new Set([...baseSkills, ...extras]));
  // clear globals
  skillsList.length = 0;
  merged.forEach(s=> skillsList.push(s));

  // rebuild cardNodes (clear & recreate)
  for(const k in cardNodes) delete cardNodes[k];
  skillsList.forEach(name=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.dataset.skill = name;
    const iconWrap = document.createElement('div'); iconWrap.className='icon'; iconWrap.appendChild(renderIconElement(name,20));
    const meta = document.createElement('div'); meta.className='meta'; meta.innerHTML = `<div class="skill-name">${name}</div><div class="small">Click to select</div>`;
    const badge = document.createElement('div'); badge.className='percent-badge'; badge.innerHTML = `<span class="pct-text">100%</span> <span class="pencil" title="Edit percent"></span>`;
    div.appendChild(iconWrap); div.appendChild(meta); div.appendChild(badge);
    cardNodes[name] = div;
  });
  // refresh dropdown if open
  populateCards(input.value || "");
}

/* End of compact JS file */
/* =========================
   Auto-typing placeholder (non-destructive)
   - Place this block AFTER your DOM refs (input, panel, ...),
     and BEFORE your initial populateCards("") / renderFieldsRow()
========================= */
