// (original script content preserved — unchanged)
document.addEventListener('DOMContentLoaded', () => {

  // ---------- Utilities ----------
  const q = s => document.querySelector(s);
  const qa = s => Array.from(document.querySelectorAll(s));
  const debounce = (fn, t = 120) => { let id; return (...a) => { clearTimeout(id); id = setTimeout(() => fn(...a), t); }; };

  // ---------- Limits ----------
  const MAX_ITEMS = 10;
  const MAX_SUMMARY_CHARS = 800;
  const MAX_DESC_CHARS = 800;

  // ---------- Small helpers ----------
  function clampInput(el, maxChars){
    if(!el) return;
    el.addEventListener('input', () => { if (el.value.length > maxChars) el.value = el.value.slice(0, maxChars); });
  }

  // ---------- Modal (safe guards if missing) ----------
  const modal = q('#modal');
  const modalClose = q('#modalClose');
  function showModal(title, text){
    if(!modal) { alert(title + '\n\n' + text); return; }
    const t = q('#modalTitle'), b = q('#modalText');
    if(t) t.textContent = title;
    if(b) b.textContent = text;
    modal.style.display = 'flex';
  }
  if(modalClose) modalClose.addEventListener('click', ()=> modal.style.display = 'none');

  // ---------- Escape helpers ----------
  function escapeHtml(s=''){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }
  function escapeSafe(s=''){ return String(s).replaceAll('<','').replaceAll('>',''); }

  // ---------- Preview overflow check ----------
  function previewWouldOverflow(){
    const resume = q('#preview-resume');
    if(!resume) return false;
    const clone = resume.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    clone.style.width = resume.offsetWidth + 'px';
    clone.style.maxHeight = 'none';
    clone.style.overflow = 'visible';
    document.body.appendChild(clone);
    // We measure scrollHeight vs clientHeight (clientHeight of visible area we want to keep)
    const overflow = clone.scrollHeight > resume.clientHeight;
    document.body.removeChild(clone);
    return overflow;
  }

  // ---------- Debounced preview placeholder (defined early so other functions can reference it) ----------
  let debouncedPreview = (...a) => {}; // will be assigned after triggerPreview is declared

  // ---------- Attach helpers ----------
  function attachInputChange(node){
    if(!node) return;
    node.querySelectorAll('input,textarea,select').forEach(el => el.addEventListener('input', (...args) => debouncedPreview(...args)));
  }
  function attachRemove(node, selector){
    const btn = node.querySelector(selector);
    if(!btn) return;
    btn.addEventListener('click', () => {
      node.remove();
      updateAddButtons();
      triggerPreview(); // immediate update
    });
  }

  // ---------- Item factories (with clamp where required) ----------
  function makeEducationItem(data = {}){
    const w = document.createElement('div'); w.className = 'item education-item';
    w.innerHTML = `
      <div class="form-row"><label>Institution</label><input class="input inst" placeholder="University" value="${escapeHtml(data.institution||'')}"></div>
      <div class="form-row"><label>Degree / Field</label><input class="input degree" placeholder="BS Computer Science" value="${escapeHtml(data.degree||'')}"></div>
      <div class="form-row"><label>Start</label><input class="input small start-year" placeholder="2018" value="${escapeHtml(data.start||'')}"><label>Graduation</label><input class="input small grad-year" placeholder="2022" value="${escapeHtml(data.grad||'')}"></div>
      <div style="display:flex;justify-content:flex-end"><button class="btn danger remove-education">Remove</button></div>
    `;
    attachRemove(w, '.remove-education');
    attachInputChange(w);
    return w;
  }

  function makeExperienceItem(data = {}){
    const w = document.createElement('div'); w.className = 'item experience-item';
    w.innerHTML = `
      <div class="form-row"><label>Job Title</label><input class="input job-title" placeholder="Frontend Developer" value="${escapeHtml(data.jobTitle||'')}"></div>
      <div class="form-row"><label>Company</label><input class="input company" placeholder="Company name" value="${escapeHtml(data.company||'')}"></div>
      <div class="form-row"><label>Start</label><input class="input small start" placeholder="2019" value="${escapeHtml(data.start||'')}"><label>End</label><input class="input small end" placeholder="2021 or Present" value="${escapeHtml(data.end||'')}"></div>
      <div class="form-row"><label>Description</label><textarea class="input resp" placeholder="Responsibilities or achievements">${escapeHtml(data.resp||'')}</textarea></div>
      <div style="display:flex;justify-content:flex-end"><button class="btn danger remove-experience">Remove</button></div>
    `;
    attachRemove(w, '.remove-experience');
    attachInputChange(w);
    clampInput(w.querySelector('.resp'), MAX_DESC_CHARS);
    return w;
  }

  function makeSkillItem(data = {}){
    const w = document.createElement('div'); w.className = 'item skill-item';
    w.innerHTML = `
      <div class="form-row">
        <label>Skill</label><input class="input skill-name" placeholder="JavaScript" value="${escapeHtml(data.name||'')}">
        <label style="min-width:110px">Level</label>
        <select class="input small skill-level">
          <option value="">Select level</option>
          <option ${data.level==='Beginner'?'selected':''}>Beginner</option>
          <option ${data.level==='Intermediate'?'selected':''}>Intermediate</option>
          <option ${data.level==='Advanced'?'selected':''}>Advanced</option>
          <option ${data.level==='Expert'?'selected':''}>Expert</option>
        </select>
      </div>
      <div style="display:flex;justify-content:flex-end"><button class="btn danger remove-skill">Remove</button></div>
    `;
    attachRemove(w, '.remove-skill');
    attachInputChange(w);
    return w;
  }

  function makeCustomItem(data = {}){
    const w = document.createElement('div'); w.className = 'item custom-item';
    w.innerHTML = `
      <div class="form-row"><label>Title</label><input class="input custom-title" placeholder="Project Title" value="${escapeHtml(data.title||'')}"></div>
      <div class="form-row"><label>Content</label><textarea class="input custom-content" placeholder="Description...">${escapeHtml(data.content||'')}</textarea></div>
      <div style="display:flex;justify-content:flex-end"><button class="btn danger remove-custom">Remove</button></div>
    `;
    attachRemove(w, '.remove-custom');
    attachInputChange(w);
    clampInput(w.querySelector('.custom-content'), MAX_DESC_CHARS);
    return w;
  }

  function makeCertificateItem(data = {}){
    const w = document.createElement('div'); w.className = 'item certificate-item';
    w.innerHTML = `
      <div class="form-row"><label>Certificate</label><input class="input cert-name" placeholder="Certificate Title" value="${escapeHtml(data.name||'')}"></div>
      <div class="form-row"><label>Issuer</label><input class="input cert-by" placeholder="Issuer" value="${escapeHtml(data.by||'')}"><label>Year</label><input class="input small cert-year" placeholder="2024" value="${escapeHtml(data.year||'')}"></div>
      <div style="display:flex;justify-content:flex-end"><button class="btn danger remove-certificate">Remove</button></div>
    `;
    attachRemove(w, '.remove-certificate');
    attachInputChange(w);
    return w;
  }

  function makeLanguageItem(data = {}){
    const w = document.createElement('div'); w.className = 'item language-item';
    w.innerHTML = `
      <div class="form-row">
        <label>Language</label><input class="input lang-name" placeholder="Urdu" value="${escapeHtml(data.lang||'')}">
        <label style="min-width:110px">Fluency</label>
        <select class="input small lang-level">
          <option value="">Select level</option>
          <option ${data.level==='Beginner'?'selected':''}>Beginner</option>
          <option ${data.level==='Intermediate'?'selected':''}>Intermediate</option>
          <option ${data.level==='Fluent'?'selected':''}>Fluent</option>
          <option ${data.level==='Native'?'selected':''}>Native</option>
        </select>
      </div>
      <div style="display:flex;justify-content:flex-end"><button class="btn danger remove-language">Remove</button></div>
    `;
    attachRemove(w, '.remove-language');
    attachInputChange(w);
    return w;
  }

  function makeHobbyItem(data = {}){
    const w = document.createElement('div'); w.className = 'item hobby-item';
    w.innerHTML = `
      <div class="form-row"><label>Hobby</label><input class="input hobby-name" placeholder="Photography" value="${escapeHtml(data.hobby||'')}"></div>
      <div style="display:flex;justify-content:flex-end"><button class="btn danger remove-hobby">Remove</button></div>
    `;
    attachRemove(w, '.remove-hobby');
    attachInputChange(w);
    return w;
  }

  // ---------- Containers & buttons ----------
  const educationList = q('#education-list'), experienceList = q('#experience-list'),
        skillsList = q('#skills-list'), customList = q('#custom-list'),
        certificatesList = q('#certificates-list'), languagesList = q('#languages-list'),
        hobbiesList = q('#hobbies-list');

  const addButtons = {
    education: q('#add-education'),
    experience: q('#add-experience'),
    skill: q('#add-skill'),
    custom: q('#add-custom'),
    cert: q('#add-certificate'),
    language: q('#add-language'),
    hobby: q('#add-hobby')
  };

  // ---------- Safe append with overflow + limit checks ----------
  function safeAppend(listEl, nodeFactory, addBtnKey){
    const btn = addButtons[addBtnKey];
    if(!btn || !listEl) return;
    btn.addEventListener('click', () => {
      if (listEl.querySelectorAll('.item').length >= MAX_ITEMS){
        showModal('Limit reached', 'You have reached the maximum items for this section.');
        updateAddButtons();
        return;
      }
      const newNode = nodeFactory();
      listEl.appendChild(newNode);
      // immediate attach done inside factory
      triggerPreview(); // update preview content
      if (previewWouldOverflow()){
        newNode.remove();
        triggerPreview();
        showModal('Page area is full', 'Your resume page area is full. Remove some content to add more.');
        return;
      }
      updateAddButtons();
      triggerPreview();
    });
  }

  safeAppend(educationList, makeEducationItem, 'education');
  safeAppend(experienceList, makeExperienceItem, 'experience');
  safeAppend(skillsList, makeSkillItem, 'skill');
  safeAppend(customList, makeCustomItem, 'custom');
  safeAppend(certificatesList, makeCertificateItem, 'cert');
  safeAppend(languagesList, makeLanguageItem, 'language');
  safeAppend(hobbiesList, makeHobbyItem, 'hobby');

  // ---------- Initial population ----------
  function initialPopulate(){
    if(educationList && educationList.children.length === 0) educationList.appendChild(makeEducationItem());
    if(experienceList && experienceList.children.length === 0) experienceList.appendChild(makeExperienceItem());
    if(skillsList && skillsList.children.length === 0) skillsList.appendChild(makeSkillItem());
    if(customList && customList.children.length === 0) customList.appendChild(makeCustomItem());
    if(certificatesList && certificatesList.children.length === 0) certificatesList.appendChild(makeCertificateItem());
    if(languagesList && languagesList.children.length === 0) languagesList.appendChild(makeLanguageItem());
    if(hobbiesList && hobbiesList.children.length === 0) hobbiesList.appendChild(makeHobbyItem());
    updateAddButtons();
  }
  initialPopulate();

  // ---------- Update add-buttons state ----------
  function updateAddButtons(){
    Object.entries(addButtons).forEach(([key, btn]) => {
      if(!btn) return;
      let list;
      switch(key){
        case 'education': list = educationList; break;
        case 'experience': list = experienceList; break;
        case 'skill': list = skillsList; break;
        case 'custom': list = customList; break;
        case 'cert': list = certificatesList; break;
        case 'language': list = languagesList; break;
        case 'hobby': list = hobbiesList; break;
      }
      btn.disabled = !list || list.querySelectorAll('.item').length >= MAX_ITEMS;
    });
  }

  // ---------- Wire top-level inputs ----------
  ['#fullName','#fatherName','#title','#email','#phone','#location','#dob','#summaryText','#cnic','#saveCnic'].forEach(sel => {
    const el = q(sel);
    if(el) el.addEventListener('input', () => debouncedPreview());
  });
  clampInput(q('#summaryText'), MAX_SUMMARY_CHARS);

  // ---------- Profile photo handling ----------
  const profilePhotoEl = q('#profilePhoto');
  if(profilePhotoEl) profilePhotoEl.addEventListener('change', (e) => {
    const f = e.target.files?.[0]; if(!f) return;
    const url = URL.createObjectURL(f);
    const img = q('#pv-avatar img');
    if(img){ img.src = url; } else { q('#pv-avatar').innerHTML = `<img src="${url}" alt="avatar">`; }
  });

  // ---------- Collect data ----------
  function collectData(){
    const personal = {
      name: q('#fullName')?.value.trim() || '',
      father: q('#fatherName')?.value.trim() || '',
      cnic: q('#cnic')?.value.trim() || '',
      title: q('#title')?.value.trim() || '',
      email: q('#email')?.value.trim() || '',
      phone: q('#phone')?.value.trim() || '',
      location: q('#location')?.value.trim() || '',
      dob: q('#dob')?.value.trim() || '',
      summary: q('#summaryText')?.value.trim() || ''
    };

    const education = (educationList ? Array.from(educationList.querySelectorAll('.education-item')) : []).map(item => ({
      institution: item.querySelector('.inst')?.value.trim() || '',
      degree: item.querySelector('.degree')?.value.trim() || '',
      start: item.querySelector('.start-year')?.value.trim() || '',
      grad: item.querySelector('.grad-year')?.value.trim() || ''
    })).filter(x => x.institution || x.degree);

    const experience = (experienceList ? Array.from(experienceList.querySelectorAll('.experience-item')) : []).map(item => ({
      jobTitle: item.querySelector('.job-title')?.value.trim() || '',
      company: item.querySelector('.company')?.value.trim() || '',
      start: item.querySelector('.start')?.value.trim() || '',
      end: item.querySelector('.end')?.value.trim() || '',
      resp: item.querySelector('.resp')?.value.trim() || ''
    })).filter(x => x.jobTitle || x.company);

    const skills = (skillsList ? Array.from(skillsList.querySelectorAll('.skill-item')) : []).map(item => ({
      name: item.querySelector('.skill-name')?.value.trim() || '',
      level: item.querySelector('.skill-level')?.value.trim() || ''
    })).filter(x => x.name);

    const custom = (customList ? Array.from(customList.querySelectorAll('.custom-item')) : []).map(item => ({
      title: item.querySelector('.custom-title')?.value.trim() || '',
      content: item.querySelector('.custom-content')?.value.trim() || ''
    })).filter(x => x.title || x.content);

    const certificates = (certificatesList ? Array.from(certificatesList.querySelectorAll('.certificate-item')) : []).map(item => ({
      name: item.querySelector('.cert-name')?.value.trim() || '',
      by: item.querySelector('.cert-by')?.value.trim() || '',
      year: item.querySelector('.cert-year')?.value.trim() || ''
    })).filter(x => x.name);

    const languages = (languagesList ? Array.from(languagesList.querySelectorAll('.language-item')) : []).map(item => ({
      lang: item.querySelector('.lang-name')?.value.trim() || '',
      level: item.querySelector('.lang-level')?.value.trim() || ''
    })).filter(x => x.lang);

    const hobbies = (hobbiesList ? Array.from(hobbiesList.querySelectorAll('.hobby-item')) : []).map(item => ({
      hobby: item.querySelector('.hobby-name')?.value.trim() || ''
    })).filter(x => x.hobby);

    return { personal, education, experience, skills, custom, certificates, languages, hobbies };
  }
// ---------- Render preview ----------
function renderPreview(data) {
  if (!data) return;
  const setText = (sel, v) => { const el = q(sel); if (el) el.textContent = v || ''; };

  setText('#pv-name', data.personal.name || 'Your Name');
  setText('#pv-title', data.personal.title || 'Professional Title');
  setText('#pv-email', data.personal.email || '');
  setText('#pv-phone', data.personal.phone || '');
  setText('#pv-location', data.personal.location || '');
  setText('#pv-cnic', data.personal.cnic || '');

  // left lists
  const leftSkills = q('#pv-left-skills-list'); 
  if (leftSkills) { 
    leftSkills.innerHTML = ''; 
    if (data.skills.length) {
      data.skills.forEach(s => { 
        const c = document.createElement('div'); 
        c.className = 'chip'; 
        c.textContent = s.name + (s.level ? ' — ' + s.level : ''); 
        leftSkills.appendChild(c); 
      }); 
    } else {
      leftSkills.innerHTML = '<div class="muted">No skills</div>'; 
    } 
  }

  const leftLangs = q('#pv-left-langs-list'); 
  if (leftLangs) { 
    leftLangs.innerHTML = ''; 
    if (data.languages.length) {
      data.languages.forEach(l => { 
        const c = document.createElement('div'); 
        c.className = 'chip'; 
        c.textContent = l.lang + (l.level ? ' — ' + l.level : ''); 
        leftLangs.appendChild(c); 
      }); 
    } else {
      leftLangs.innerHTML = '<div class="muted">No languages</div>'; 
    } 
  }

  const leftCerts = q('#pv-left-certs-list'); 
  if (leftCerts) { 
    leftCerts.innerHTML = ''; 
    if (data.certificates.length) {
      data.certificates.forEach(c => { 
        const d = document.createElement('div'); 
        d.className = 'chip'; 
        d.textContent = c.name; 
        leftCerts.appendChild(d); 
      }); 
    } else {
      leftCerts.innerHTML = '<div class="muted">No certificates</div>'; 
    } 
  }

  const leftHobbies = q('#pv-left-hobbies-list'); 
  if (leftHobbies) { 
    leftHobbies.innerHTML = ''; 
    if (data.hobbies.length) {
      data.hobbies.forEach(h => { 
        const d = document.createElement('div'); 
        d.className = 'chip'; 
        d.textContent = h.hobby; 
        leftHobbies.appendChild(d); 
      }); 
    } else {
      leftHobbies.innerHTML = '<div class="muted">No hobbies</div>'; 
    } 
  }

  setText('#pv-summary', data.personal.summary || 'A concise career summary will appear here as you type.');

  // Experience
  const expContainer = q('#pv-experience'); 
  if (expContainer) { 
    expContainer.innerHTML = '<h2 class="section-title"><i class="fa-solid fa-briefcase"></i> Experience</h2>'; // Added icon
    if (data.experience.length) { 
      data.experience.forEach(exp => { 
        const d = document.createElement('div'); 
        d.className = 'exp-item'; 
        const h = document.createElement('h3'); 
        h.textContent = exp.jobTitle || ''; 
        const meta = document.createElement('div'); 
        meta.className = 'meta'; 
        meta.textContent = `${exp.start || ''} — ${exp.end || ''} • ${exp.company || ''}`; 
        const desc = document.createElement('div'); 
        desc.className = 'desc'; 
        if (exp.resp && exp.resp.includes('\n')) { 
          const ul = document.createElement('ul'); 
          exp.resp.split('\n').filter(Boolean).forEach(line => { 
            const li = document.createElement('li'); 
            li.textContent = line; 
            ul.appendChild(li); 
          }); 
          desc.appendChild(ul); 
        } else { 
          desc.textContent = exp.resp || ''; 
        } 
        d.appendChild(h); 
        d.appendChild(meta); 
        d.appendChild(desc); 
        expContainer.appendChild(d); 
      }); 
    } else { 
      expContainer.innerHTML += '<div class="muted">No experience added</div>'; 
    } 
  }

  // Education
  const eduContainer = q('#pv-education'); 
  if (eduContainer) { 
    eduContainer.innerHTML = '<h2 class="section-title"><i class="fa-solid fa-graduation-cap"></i> Education</h2>'; // Added icon
    if (data.education.length) { 
      data.education.forEach(e => { 
        const d = document.createElement('div'); 
        d.className = 'edu-item'; 
        const h = document.createElement('h3'); 
        h.textContent = e.degree || e.institution; 
        const meta = document.createElement('div'); 
        meta.className = 'meta'; 
        meta.textContent = `${e.start || ''} — ${e.grad || ''} • ${e.institution || ''}`; 
        d.appendChild(h); 
        d.appendChild(meta); 
        eduContainer.appendChild(d); 
      }); 
    } else { 
      eduContainer.innerHTML += '<div class="muted">No education added</div>'; 
    } 
  }

  // Projects / Custom
  const prContainer = q('#pv-projects'); 
  if (prContainer) { 
    prContainer.innerHTML = '<h2 class="section-title"><i class="fa-solid fa-layer-group"></i> Projects</h2>'; // Added icon
    if (data.custom.length) { 
      data.custom.forEach(p => { 
        const d = document.createElement('div'); 
        d.className = 'proj-item'; 
        const h = document.createElement('h3'); 
        h.textContent = p.title || ''; 
        const desc = document.createElement('div'); 
        desc.className = 'desc'; 
        if (p.content && p.content.includes('\n')) { 
          const ul = document.createElement('ul'); 
          p.content.split('\n').filter(Boolean).forEach(line => { 
            const li = document.createElement('li'); 
            li.textContent = line; 
            ul.appendChild(li); 
          }); 
          desc.appendChild(ul); 
        } else { 
          desc.textContent = p.content || ''; 
        } 
        d.appendChild(h); 
        d.appendChild(desc); 
        prContainer.appendChild(d); 
      }); 
    } else {
      prContainer.innerHTML += '<div class="muted">No projects added</div>'; 
    } 
  }

  // Certificates, Languages, Hobbies (right)
  const certR = q('#pv-certificates-right'); 
  if (certR) { 
    certR.innerHTML = '<h2 class="section-title"><i class="fa-solid fa-certificate"></i> Certificates</h2>'; // Added icon
    if (data.certificates.length) { 
      data.certificates.forEach(c => { 
        const d = document.createElement('div'); 
        d.className = 'cert-item'; 
        const h = document.createElement('h3'); 
        h.textContent = c.name + (c.by ? ' — ' + c.by : ''); 
        const meta = document.createElement('div'); 
        meta.className = 'meta'; 
        meta.textContent = c.year || ''; 
        d.appendChild(h); 
        d.appendChild(meta); 
        certR.appendChild(d); 
      }); 
    } else {
      certR.innerHTML += '<div class="muted">No certificates added</div>'; 
    } 
  }

  const langR = q('#pv-languages-right'); 
  if (langR) { 
    langR.innerHTML = '<h2 class="section-title"><i class="fa-solid fa-language"></i> Languages</h2>'; // Added icon
    if (data.languages.length) { 
      const ul = document.createElement('ul'); 
      ul.className = 'clean'; 
      data.languages.forEach(l => { 
        const li = document.createElement('li'); 
        li.textContent = `${l.lang}${l.level ? ' — ' + l.level : ''}`; 
        ul.appendChild(li); 
      }); 
      langR.appendChild(ul); 
    } else {
      langR.innerHTML += '<div class="muted">No languages added</div>'; 
    } 
  }

  const hbR = q('#pv-hobbies-right'); 
  if (hbR) { 
    hbR.innerHTML = '<h2 class="section-title"><i class="fa-solid fa-heart"></i> Hobbies & Interests</h2>'; // Added icon
    if (data.hobbies.length) { 
      const div = document.createElement('div'); 
      div.className = 'skill-grid'; 
      data.hobbies.forEach(h => { 
        const chip = document.createElement('div'); 
        chip.className = 'chip'; 
        chip.textContent = h.hobby; 
        div.appendChild(chip); 
      }); 
      hbR.appendChild(div); 
    } else {
      hbR.innerHTML += '<div class="muted">No hobbies added</div>'; 
    } 
  }
}

  // ---------- Trigger preview (and persist) ----------
  function triggerPreview(){
    const d = collectData();
    renderPreview(d);
    try { localStorage.setItem('resumeDraft', JSON.stringify(d)); } catch(e) {}
    updateAddButtons();
  }

  // now safe assign debouncedPreview
  debouncedPreview = debounce(triggerPreview, 90);

  // ---------- Load draft ----------
  (function loadDraft(){
    try {
      const raw = localStorage.getItem('resumeDraft'); if(!raw) return;
      const d = JSON.parse(raw);
      if(d.personal){
        if(q('#fullName')) q('#fullName').value = d.personal.name || '';
        if(q('#fatherName')) q('#fatherName').value = d.personal.father || '';
        if(q('#cnic')) q('#cnic').value = d.personal.cnic || '';
        if(q('#title')) q('#title').value = d.personal.title || '';
        if(q('#email')) q('#email').value = d.personal.email || '';
        if(q('#phone')) q('#phone').value = d.personal.phone || '';
        if(q('#location')) q('#location').value = d.personal.location || '';
        if(q('#dob')) q('#dob').value = d.personal.dob || '';
        if(q('#summaryText')) q('#summaryText').value = d.personal.summary || '';
      }
      // clear lists then populate
      if(educationList) educationList.innerHTML = '';
      if(experienceList) experienceList.innerHTML = '';
      if(skillsList) skillsList.innerHTML = '';
      if(customList) customList.innerHTML = '';
      if(certificatesList) certificatesList.innerHTML = '';
      if(languagesList) languagesList.innerHTML = '';
      if(hobbiesList) hobbiesList.innerHTML = '';

      (d.education||[]).forEach(e => educationList && educationList.appendChild(makeEducationItem(e)));
      (d.experience||[]).forEach(e => experienceList && experienceList.appendChild(makeExperienceItem(e)));
      (d.skills||[]).forEach(s => skillsList && skillsList.appendChild(makeSkillItem(s)));
      (d.custom||[]).forEach(c => customList && customList.appendChild(makeCustomItem(c)));
      (d.certificates||[]).forEach(c => certificatesList && certificatesList.appendChild(makeCertificateItem(c)));
      (d.languages||[]).forEach(l => languagesList && languagesList.appendChild(makeLanguageItem(l)));
      (d.hobbies||[]).forEach(h => hobbiesList && hobbiesList.appendChild(makeHobbyItem(h)));
    } catch(e) {}
    triggerPreview();
  })();

  // ---------- Accordion single-open behaviour ----------
  (function initAccordion(){
    qa('.section').forEach(section => {
      const head = section.querySelector('.head');
      if(!head) return;
      head.addEventListener('click', () => toggle(section));
      head.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(section); }});
    });
    function toggle(section){
      qa('.section').forEach(s => { if(s !== section) s.setAttribute('aria-expanded', 'false'); });
      const expanded = section.getAttribute('aria-expanded') === 'true';
      section.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    }
  })();

  // ---------- Initial render ----------
  triggerPreview();

  // ---------- Expose helpers for pdf.js ----------
  window._resume_getPreviewElement = () => document.getElementById('preview-resume');
  window._resume_collectData = collectData;
  window._resume_triggerPreview = triggerPreview;
  window._resume_previewWouldOverflow = previewWouldOverflow;
  window._resume_getSaveCnic = () => q('#saveCnic')?.value?.trim() || '';
  window._resume_setSaveStatus = (text) => { const el = q('#saveStatus'); if(el) el.textContent = text; };

});

(function(){
  // show/hide mobile preview button based on width
  const mobilePreviewBtn = document.getElementById('mobilePreviewBtn');
  const previewModal = document.getElementById('previewModal');
  const previewModalBox = document.getElementById('previewModalBox');
  const previewPanel = document.querySelector('.preview-panel');
  function updateMobileUI(){
    if(window.innerWidth <= 767){
      if(mobilePreviewBtn) mobilePreviewBtn.style.display = 'inline-block';
    } else {
      if(mobilePreviewBtn) mobilePreviewBtn.style.display = 'none';
    }
  }
  window.addEventListener('resize', updateMobileUI);
  document.addEventListener('DOMContentLoaded', updateMobileUI);

  // open preview modal on mobile: clone resume for safe display
  if(mobilePreviewBtn){
    mobilePreviewBtn.addEventListener('click', () => {
      if(!previewModal || !previewModalBox) return;
      const resume = document.getElementById('preview-resume');
      if(!resume) return;
      // clone & make scrollable inside modal
      const clone = resume.cloneNode(true);
      clone.style.transform = 'scale(0.9)';
      clone.style.transformOrigin = 'top center';
      clone.style.width = 'calc(var(--resume-width) * 0.9)';
      clone.style.height = 'calc(var(--resume-height) * 0.9)';
      clone.style.margin = '0 auto';
      clone.style.boxShadow = '0 12px 40px rgba(2,6,23,0.3)';
      previewModalBox.innerHTML = '';
      previewModalBox.appendChild(clone);
      previewModal.style.display = 'flex';
    });
  }
  // close modal when clicking outside box or pressing Esc
  document.addEventListener('click', (e) => {
    if(!previewModal) return;
    if(e.target === previewModal) previewModal.style.display = 'none';
  });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape'){ if(previewModal) previewModal.style.display = 'none'; } });


  // Function to generate PDF
async function generatePDF() {
    const resumeElement = document.getElementById('preview-resume');
    
    // Wait for all images to load before generating PDF
    const images = resumeElement.getElementsByTagName('img');
    const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = () => resolve();
                img.onerror = () => resolve(); // Handle loading errors gracefully
            }
        });
    });

    await Promise.all(imagePromises); // Wait for all images to load

    // Now generate the PDF using html2canvas and jsPDF
    html2canvas(resumeElement).then(canvas => {
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('resume.pdf');
    }).catch(err => {
        console.error('PDF generation failed:', err);
    });
}

  // hook download button in preview toolbar to trigger existing download action if present
  const downloadPreviewPdf = document.getElementById('downloadPreviewPdf');
  if(downloadPreviewPdf){
    downloadPreviewPdf.addEventListener('click', () => {
      const dlBtn = document.getElementById('downloadPdfBtn');
      if(dlBtn) dlBtn.click();
    });
  }
})();


