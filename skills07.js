async function loadSkillsData(csvFilePath) {
  try {
    console.log(`Attempting to fetch CSV file from: ${csvFilePath}`);
    const response = await fetch(csvFilePath);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text();
    console.log('CSV file fetched successfully.');

    const rows = text.split('\n').map(row => row.split(','));

    // Clean up header
    const header = rows[0].map(h => h.trim());
    console.log('CSV Header:', header);

    rows.slice(1).forEach(row => {
      // Check if the row has enough columns
      if (row.length < 4) return; // Skip if the row is not valid

      const category = row[0]?.trim(); // Use optional chaining
      const subcategory = row[1]?.trim();
      const skill = row[2]?.trim();
      const icon = row[3]?.trim();

      if (category && subcategory && skill) { // Ensure these values are not empty
        console.log(`Loaded Skill: ${skill}, Category: ${category}, Subcategory: ${subcategory}, Icon: ${icon}`);
        // Populate STEP2_DATA as before...
      }
    });

    console.log('All skills loaded:', STEP2_DATA);
  } catch (error) {
    console.error('Error fetching CSV file:', error);
  }
}

// Example usage
loadSkillsData('/Step2_DATA_compact.csv');


/* ===========================
   SKILL ICONS (fallback text/emoji)
   - If devicon doesn't exist for a skill, we show fallback from here
   - Keep values short (emoji or 2-4 chars)
=========================== */
const SKILL_ICONS = {
  "Node.js": "N", "React": "", "Photoshop": "Ps", "Illustrator": "Ai", "Figma": "F", "Premiere Pro": "Pr",
  "Excel": "XL", "Word": "Wd", "PowerPoint": "Pp", "AutoCAD": "AC", "SolidWorks": "Sw", "MATLAB": "M",
  "Anatomy": "An", "Guitar": "🎸", "Investment": "💹", "Content Creation": "✍️", "Ethical Hacking": "🛡️",
  "PenTesting": "🧪"
};

/* ===========================
   Devicon mapping helpers
   - canonical map for known mismatches
   - devicon folder and file naming varies; mapping covers common cases
=========================== */
function deviconNameFor(skillName) {
  // canonical mapping for certain names (lowercased keys)
  const map = {
    // Programming
    "c": "c",
    "c++": "cplusplus",
    "java": "java",
    "python": "python",
    "javascript": "javascript",
    "typescript": "typescript",
    // Add more mappings as needed
  };

  // normalize incoming skillName
  let key = String(skillName).trim().toLowerCase();
  key = key.replace(/\s*\(.*\)/g, ""); // remove parentheses content
  key = key.replace(/\s*\/\s*/g, " / ");
  key = key.replace(/\s+/g, " ").trim();

  if (map[key]) return map[key];

  // fallback heuristic: remove dots, slashes; replace non-alnum with hyphen
  let n = key.replace(/\./g, "").replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
  // special convert ++ and # etc
  n = n.replace(/\+\+/g, "plusplus").replace(/\+/g, "plus").replace(/#/g, "sharp");
  return n || key;
}

function deviconURL(skillName) {
  const name = deviconNameFor(skillName);
  // Use original svg if available; many devicon icons follow {name}/{name}-original.svg
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;
}

/* ===========================
   Flatten STEP2_DATA -> unified skillsList
=========================== */
function flattenSkillsFromStep2() {
  const all = [];
  for (const f in STEP2_DATA) {
    const subs = STEP2_DATA[f].subs;
    for (const s in subs) {
      const arr = subs[s].skills || [];
      arr.forEach(k => all.push(k));
    }
  }
  return [...new Set(all)];
}
const extraFromFields = flattenSkillsFromStep2();

/* base skills kept for backwards compatibility */
const baseSkills = ["HTML", "CSS", "JavaScript", "Python", "Node.js", "React", "SQL", "Java", "C++"];

/* unified skills list for search (keeps order from base then extra) */
const skillsList = Array.from(new Set([...baseSkills, ...extraFromFields]));

/* ===========================
   State & DOM refs
=========================== */
let selectedSkills = JSON.parse(localStorage.getItem("selectedSkills")) || []; // [{name, percent}]
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

const cardNodes = {}; // template nodes for search dropdown

/* keyboard nav state */
let visibleCards = [];
let highlightIndex = -1;

/* ===========================
   Icon element generator
   - tries devicon (img) first
   - onerror falls back to SKILL_ICONS text or initials
=========================== */
function renderIconElement(skillName, size = 20) {
  // If explicit fallback provided in SKILL_ICONS
  if (SKILL_ICONS[skillName]) {
    const span = document.createElement('span');
    span.className = 'icon-fallback-text';
    span.textContent = SKILL_ICONS[skillName];
    return span;
  }

  // Create image element pointing to devicon CDN
  const img = document.createElement('img');
  img.width = size;
  img.height = size;
  img.style.objectFit = 'contain';
  img.alt = skillName;
  img.src = deviconURL(skillName);

  // On image load error, replace with fallback span
  img.onerror = function () {
    const fallback = document.createElement('span');
    fallback.className = 'icon-fallback-text';

    // Use SKILL_ICONS lowercase key if exists
    const keyLower = skillName.toLowerCase();
    if (SKILL_ICONS[keyLower]) {
      fallback.textContent = SKILL_ICONS[keyLower];
    } else {
      // Otherwise, use first letters of first two words
      const words = skillName.trim().split(/\s+/);
      if (words.length >= 2) {
        fallback.textContent = (words[0][0] + words[1][0]).toUpperCase();
      } else {
        fallback.textContent = skillName.slice(0, 2).toUpperCase();
      }
    }

    if (img.parentNode) {
      img.parentNode.replaceChild(fallback, img); // replace broken img with span
    }
  };

  return img;
}

/* ===========================
   Render Selected Skills panel
=========================== */
function renderSelected() {
  selectedContainer.innerHTML = "";
  selectedSkills.forEach((s, idx) => {
    const skill = s.name;
    const percent = s.percent || "100%";

    const tag = document.createElement('div');
    tag.className = 'skill-tag';

    // icon
    const iconWrap = document.createElement('div');
    iconWrap.className = 'icon';
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
    percentInput.addEventListener('input', (e) => {
      s.percent = e.target.value;
    });

    // remove button
    const removeBtn = document.createElement('span');
    removeBtn.className = 'remove-btn';
    removeBtn.title = 'Remove';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      selectedSkills = selectedSkills.filter(x => x.name !== skill);
      renderSelected();
      // refresh dropdown badges if visible
      populateCards(input.value || "");
    });

    tag.appendChild(iconWrap);
    tag.appendChild(nameWrap);
    tag.appendChild(percentInput);
    tag.appendChild(removeBtn);

    selectedContainer.appendChild(tag);
  });

  // persist small state (optional)
  // localStorage.setItem('selectedSkills', JSON.stringify(selectedSkills));
}
renderSelected();

/* Save button handler (keeps previous behaviour) */
function saveSkills() {
  localStorage.setItem("selectedSkills", JSON.stringify(selectedSkills));
  // alert("Skills saved!");
}
const submitBtn = document.getElementById("submitBtn");
if (submitBtn) submitBtn.addEventListener("click", saveSkills);

/* ===========================
   Core select helper (used by search & fields explorer)
=========================== */
function selectSkillByName(name, pctText = "100%") {
  if (!selectedSkills.find(s => s.name === name)) {
    selectedSkills.push({ name, percent: pctText });
    renderSelected();
  } else {
    // update percent if provided & changed
    const obj = selectedSkills.find(s => s.name === name);
    if (obj && pctText && pctText !== (obj.percent || '100%')) {
      obj.percent = pctText;
      renderSelected();
    }
  }
  // keep search ready
  input.value = "";
  setTimeout(() => { input.focus(); populateCards(""); }, 0);
}

/* ===========================
   Build template cardNodes for search (we clone these when populating)
=========================== */
skillsList.forEach(name => {
  const div = document.createElement('div');
  div.className = 'card';
  div.dataset.skill = name;

  const iconWrap = document.createElement('div');
  iconWrap.className = 'icon';
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
});

/* ===========================
   populateCards(filter)
   - builds dropdown items based on filter
=========================== */
function populateCards(filter) {
  cardsWrap.innerHTML = "";
  const q = (filter || "").trim().toLowerCase();
  visibleCards = [];

  skillsList.forEach(name => {
    if (!q || name.toLowerCase().includes(q)) {
      const node = cardNodes[name].cloneNode(true);

      // ensure percent shows current selection percent if exists
      const sel = selectedSkills.find(s => s.name === name);
      const pct = sel ? (sel.percent || "100%") : "100%";
      const badge = node.querySelector('.percent-badge');
      badge.innerHTML = `<span class="pct-text">${pct}</span> <span class="pencil" title="Edit percent">✎</span>`;

      // click to select (skip pencil)
      node.addEventListener('click', (e) => {
        if (e.target.classList.contains('pencil')) return;
        const skill = node.dataset.skill;
        const pctText = node.querySelector('.pct-text').textContent || "100%";
        selectSkillByName(skill, pctText);
      });

      // pencil handler
      const pencil = node.querySelector('.pencil');
      pencil.addEventListener('click', ev => {
        ev.stopPropagation();
        openPercentEditor(node);
      });

      // hover sets highlight index (sync with keyboard)
      node.addEventListener('mouseenter', () => {
        highlightIndex = visibleCards.indexOf(node);
        updateHighlight();
      });

      cardsWrap.appendChild(node);
      visibleCards.push(node);
    }
  });

  highlightIndex = visibleCards.length > 0 ? 0 : -1;
  updateHighlight();
}

/* ===========================
   Inline percent editor for dropdown nodes
=========================== */
function openPercentEditor(card) {
  const badge = card.querySelector('.percent-badge');
  const current = badge.querySelector('.pct-text') ? badge.querySelector('.pct-text').textContent.replace('%', '') : '100';
  badge.innerHTML = `<input class="percent-edit" type="number" min="0" max="100" value="${parseInt(current, 10) || 100}" style="width:56px;padding:4px;border-radius:6px">`;

  const inputNum = badge.querySelector('.percent-edit');
  inputNum.focus(); inputNum.select();

  function commit() {
    let v = parseInt(inputNum.value, 10);
    if (isNaN(v) || v < 0) v = 0;
    if (v > 100) v = 100;
    badge.innerHTML = `<span class="pct-text">${v}%</span> <span class="pencil" title="Edit percent">✎</span>`;
    // rebind pencil
    badge.querySelector('.pencil').addEventListener('click', e => {
      e.stopPropagation();
      openPercentEditor(card);
    });
    // update selectedSkills if exists
    const skillName = card.dataset.skill;
    const obj = selectedSkills.find(s => s.name === skillName);
    if (obj) { obj.percent = v + "%"; renderSelected(); }
    populateCards(input.value || "");
  }

  inputNum.addEventListener('blur', commit);
  inputNum.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { inputNum.blur(); e.preventDefault(); }
    if (e.key === 'Escape') {
      badge.innerHTML = `<span class="pct-text">${current}%</span> <span class="pencil" title="Edit percent">✎</span>`;
      badge.querySelector('.pencil').addEventListener('click', ev => {
        ev.stopPropagation();
        openPercentEditor(card);
      });
    }
  });
}

/* ===========================
   Highlight helpers
=========================== */
function updateHighlight() {
  visibleCards.forEach((n, i) => n.classList.toggle('highlight', i === highlightIndex));
  if (highlightIndex >= 0 && visibleCards[highlightIndex]) {
    visibleCards[highlightIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

/* ===========================
   Keyboard nav for search input
=========================== */
input.addEventListener('keydown', (e) => {
  // If an inline editor is focused, ignore
  const active = document.activeElement;
  if (active && active.classList && (active.classList.contains('percent-edit') || active.classList.contains('pct-input'))) return;

  if (panel.style.display === 'block') {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (visibleCards.length === 0) return;
      highlightIndex = (highlightIndex + 1) % visibleCards.length;
      updateHighlight();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (visibleCards.length === 0) return;
      highlightIndex = (highlightIndex - 1 + visibleCards.length) % visibleCards.length;
      updateHighlight();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && visibleCards[highlightIndex]) {
        const node = visibleCards[highlightIndex];
        // trigger click on highlighted node (select)
        node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        highlightIndex = 0;
        updateHighlight();
      } else if (visibleCards.length === 1) {
        visibleCards[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closePanel();
      input.blur();
    }
  }
});

/* ===========================
   Auto-typing placeholder effect (optional)
=========================== */
let autoTyping = true, autoTimer = null, typeIndex = 0, charIndex = 0, forward = true;
function startAutoType() {
  if (autoTimer) clearInterval(autoTimer);
  autoTyping = true; input.placeholder = ''; charIndex = 0; forward = true;
  autoTimer = setInterval(() => {
    const word = skillsList[typeIndex % skillsList.length] || "skills";
    if (forward) {
      charIndex++;
      input.value = word.slice(0, charIndex);
      if (charIndex >= word.length) { forward = false; }
    } else {
      charIndex--;
      input.value = word.slice(0, charIndex);
      if (charIndex <= 0) { forward = true; typeIndex++; }
    }
  }, 100);
}
function stopAutoTypeInstant() { if (autoTimer) clearInterval(autoTimer); autoTyping = false; setTimeout(() => { input.value = ''; input.placeholder = 'Search any skill'; }, 100); }

/* ===========================
   Input focus / click / open/close panel
=========================== */
input.addEventListener('focus', () => { stopAutoTypeInstant(); openPanel(); });
input.addEventListener('click', () => { if (autoTyping) stopAutoTypeInstant(); openPanel(); });
input.addEventListener('input', (e) => populateCards(e.target.value));

function openPanel() {
  panel.style.display = 'block';
  panel.setAttribute('aria-hidden', 'false');
  populateCards(input.value || "");
  highlightIndex = -1;
}
function closePanel() {
  panel.style.display = 'none';
  panel.setAttribute('aria-hidden', 'true');
  visibleCards = []; highlightIndex = -1;
}

/* click outside closes dropdown */
document.addEventListener('click', (e) => {
  if (!document.querySelector('.search-wrap').contains(e.target)) closePanel();
});

/* start auto typing */
startAutoType();

/* ===========================
   FIELDS EXPLORER (step-2)
=========================== */
let step2State = { openField: null, openSubcat: null };


/* ===========================
   Render Fields Row
=========================== */
function renderFieldsRow() {
  const fieldsContainer = document.getElementById('fieldsContainer');
  fieldsContainer.innerHTML = "";
  
  for (const fieldName in STEP2_DATA) {
    const fd = STEP2_DATA[fieldName];
    const card = document.createElement('div');
    card.className = 'field-card';
    card.innerHTML = `<div class="icon" style="background:${fd.color || '#333'}">${fd.icon}</div>
                      <div><div class="field-title">${fieldName}</div><div style="font-size:12px;color:#6b7a90">${Object.keys(fd.subs).length} categories</div></div>`;
    card.addEventListener('click', () => toggleField(fieldName, card));
    fieldsContainer.appendChild(card);
  }
}

renderFieldsRow();

function toggleField(fieldName, cardElement) {
  if (step2State.openField && step2State.openField !== fieldName) {
    step2State.openField = null; step2State.openSubcat = null;
    subcatContainer.style.display = 'none'; skillsContainer.style.display = 'none'; step2Back.style.display = 'none';
    document.querySelectorAll('.field-card').forEach(c => c.classList.remove('active'));
  }
  const isOpening = step2State.openField !== fieldName;
  if (!isOpening) {
    step2State.openField = null; subcatContainer.style.display = 'none'; skillsContainer.style.display = 'none'; step2Back.style.display = 'none'; cardElement.classList.remove('active');
    return;
  }
  step2State.openField = fieldName; step2State.openSubcat = null;
  document.querySelectorAll('.field-card').forEach(c => c.classList.remove('active')); cardElement.classList.add('active');
  renderSubcats(fieldName);
}

function renderSubcats(fieldName) {
  subcatGrid.innerHTML = "";
  const subs = STEP2_DATA[fieldName].subs;
  for (const subName in subs) {
    const info = subs[subName];
    const sc = document.createElement('div');
    sc.className = 'subcat-card';
    sc.innerHTML = `<div style="font-weight:100;margin-bottom:6px">${info.icon} ${subName}</div><div style="font-size:12px;color:#6b7a90">${(info.skills || []).length} skills</div>`;
    sc.addEventListener('click', () => openSubcat(fieldName, subName));
    subcatGrid.appendChild(sc);
  }
  subcatContainer.style.display = 'block'; skillsContainer.style.display = 'none'; step2Back.style.display = 'inline-block';
}

function openSubcat(fieldName, subName) {
  step2State.openSubcat = subName;
  const info = STEP2_DATA[fieldName].subs[subName];
  skillsTitle.textContent = `${subName} — ${fieldName}`;
  skillsGrid.innerHTML = "";

  (info.skills || []).forEach(skill => {
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
    badge.innerHTML = `<span class="pct-text"></span><span class="pencil" title="Edit"></span>`;
    card.appendChild(badge);

    // select
    card.addEventListener('click', (e) => { if (e.target.classList.contains('pencil')) return; const p = card.querySelector('.pct-text').textContent || "100%"; selectSkillByName(skill, p); });

    // pencil -> edit percent
    badge.querySelector('.pencil').addEventListener('click', (ev) => { ev.stopPropagation(); openPercentEditorInCard(card); });

    skillsGrid.appendChild(card);
  });

  subcatContainer.style.display = 'none'; skillsContainer.style.display = 'block'; step2Back.style.display = 'inline-block';
}

step2Back.addEventListener('click', () => {
  if (step2State.openSubcat) { renderSubcats(step2State.openField); step2State.openSubcat = null; }
  else if (step2State.openField) { step2State.openField = null; step2State.openSubcat = null; subcatContainer.style.display = 'none'; skillsContainer.style.display = 'none'; step2Back.style.display = 'none'; document.querySelectorAll('.field-card').forEach(c => c.classList.remove('active')); }
});

/* percent editor in step2 skill cards */
function openPercentEditorInCard(card) {
  const badge = card.querySelector('.pct-badge');
  const current = badge.querySelector('.pct-text').textContent.replace('%', '') || '100';
  badge.innerHTML = `<input class="pct-input" type="number" min="0" max="100" value="${parseInt(current, 10) || 100}" style="width:64px;padding:4px;border-radius:6px">`;
  const inp = badge.querySelector('.pct-input');
  inp.focus(); inp.select();

  function commit() {
    let v = parseInt(inp.value, 10); if (isNaN(v) || v < 0) v = 0; if (v > 100) v = 100;
    badge.innerHTML = `<span class="pct-text">${v}%</span><span class="pencil" title="Edit">✎</span>`;
    badge.querySelector('.pencil').addEventListener('click', (e) => { e.stopPropagation(); openPercentEditorInCard(card); });
    const name = card.querySelector('.skill-name').textContent;
    const obj = selectedSkills.find(x => x.name === name);
    if (obj) { obj.percent = v + '%'; renderSelected(); }
    populateCards(input.value || "");
  }

  inp.addEventListener('blur', commit);
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { commit(); } if (e.key === 'Escape') { badge.innerHTML = `<span class="pct-text">${current}%</span><span class="pencil" title="Edit">✎</span>`; badge.querySelector('.pencil').addEventListener('click', ev => { ev.stopPropagation(); openPercentEditorInCard(card); }); } });
}

/* ===========================
   Initial population & render
=========================== */
populateCards("");
renderFieldsRow();

/* ===========================
   Utility: If you later dynamically modify STEP2_DATA,
   call rebuildSkillsList() to refresh skillsList and templates.
=========================== */
function rebuildSkillsListAndTemplates() {
  // rebuild flat list
  const extras = flattenSkillsFromStep2();
  const merged = Array.from(new Set([...baseSkills, ...extras]));
  // clear globals
  skillsList.length = 0;
  merged.forEach(s => skillsList.push(s));

  // rebuild cardNodes (clear & recreate)
  for (const k in cardNodes) delete cardNodes[k];
  skillsList.forEach(name => {
    const div = document.createElement('div');
    div.className = 'card';
    div.dataset.skill = name;
    const iconWrap = document.createElement('div'); iconWrap.className = 'icon'; iconWrap.appendChild(renderIconElement(name, 20));
    const meta = document.createElement('div'); meta.className = 'meta'; meta.innerHTML = `<div class="skill-name">${name}</div><div class="small">Click to select</div>`;
    const badge = document.createElement('div'); badge.className = 'percent-badge'; badge.innerHTML = `<span class="pct-text">100%</span> <span class="pencil" title="Edit percent"></span>`;
    div.appendChild(iconWrap); div.appendChild(meta); div.appendChild(badge);
    cardNodes[name] = div;
  });
  // refresh dropdown if open
  populateCards(input.value || "");
}

// /* End of compact JS file */
// async function loadSkillsData(csvFilePath) {
//   try {
//     console.log(`Attempting to fetch CSV file from: ${csvFilePath}`);
//     const response = await fetch(csvFilePath);

//     // Check if the response is OK (status code 200-299)
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const text = await response.text();
//     console.log('CSV file fetched successfully.');

//     const rows = text.split('\n').map(row => row.split(','));

//     // Assuming the first row is the header
//     const header = rows[0];
//     const categoryIndex = header.indexOf('Category');
//     const subcategoryIndex = header.indexOf('Subcategory');
//     const skillIndex = header.indexOf('Skill');
//     const iconIndex = header.indexOf('Icon');

//     // Log the header for debugging
//     console.log('CSV Header:', header);

//     rows.slice(1).forEach(row => {
//       const category = row[categoryIndex].trim();
//       const subcategory = row[subcategoryIndex].trim();
//       const skill = row[skillIndex].trim();
//       const icon = row[iconIndex].trim();

//       console.log(`Loaded Skill: ${skill}, Category: ${category}, Subcategory: ${subcategory}, Icon: ${icon}`);
      
//       // Continue to populate STEP2_DATA as before...
//     });
    
//     console.log('All skills loaded:', STEP2_DATA);
//   } catch (error) {
//     console.error('Error fetching CSV file:', error);
//   }
// }

// // Example usage
// loadSkillsData('/Step2_DATA_compact.csv');
