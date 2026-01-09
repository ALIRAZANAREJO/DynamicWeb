// ===== static lists =====
const profession = [
  "Web Developer","Software Engineer","Frontend Developer","Backend Developer","Full Stack Developer",
  "Mobile App Developer","Game Developer","Data Scientist","Machine Learning Engineer","AI Specialist",
  "UI/UX Designer","Graphic Designer","Product Designer","Teacher","Doctor","Lawyer","Engineer"
];

const languagesList = [
  "Ghotuo","Alumu-Tesu","Ari","Amal","Arbëreshë Albanian","Aranadan","Zay",
  "No linguistic content","Yongbei Zhuang","Yang Zhuang","Youjiang Zhuang","Yongnan Zhuang",
  "Zyphe Chin","Zaza","Zuojiang Zhuang"
];

const hobbiesList = [
  "Reading","Writing","Painting","Sketching","Photography","Traveling","Hiking","Cycling","Swimming","Running","Yoga",
  "Meditation","Gardening","Cooking","Baking","Music Listening","Singing","Dancing","Playing Guitar","Playing Piano",
  "Playing Violin","Learning Languages","Calligraphy","Origami","Knitting","Crocheting","Fishing","Bird Watching",
  "Camping","Rock Climbing","Surfing","Skiing","Snowboarding","Martial Arts","Chess","Board Games","Video Gaming",
  "Writing Poetry","Blogging","Vlogging","Podcasting","Volunteering","DIY Crafts","Jewelry Making","Pottery","Woodworking",
  "Graphic Design","Animation","Digital Art","Astronomy","Star Gazing","Magic Tricks","Learning Programming","Robotics",
  "Electronics","Puzzle Solving","Card Games","Collecting Coins","Collecting Stamps","Antique Collection","Model Building",
  "Travel Blogging","Fashion Designing","Interior Designing","Sculpting","Filmmaking","Acting","Improv Comedy","Stand-Up Comedy",
  "Creative Writing","Storytelling","Public Speaking","Debating","Bird Photography","Wildlife Photography","Carpentry",
  "Home Brewing","Mixology","Fitness Training","Weightlifting","Pilates","Parkour","Motorcycling","Driving","Kayaking",
  "Canoeing","Sailing","Skateboarding","Surfboard Riding","Learning History","Learning Culture","Meditation Retreats",
  "Environmental Activism","Sustainability Projects","Beach Cleanup","Animal Care","Pet Training","Aquarium Keeping",
  "Chess Strategy","Puzzle Games","Escape Rooms","Board Game Design","Learning AI & ML","Stock Market Investing",
  "Cryptocurrency Trading","Podcast Hosting","Music Production","DJing"
];

// ---------- utility multi-select factory ----------
const instances = {}; // keyed by inputId
function setupMultiSelect({ inputId, dropdownId, choices, selectedContainerId, allowFreeText = false }) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  const selectedContainer = document.getElementById(selectedContainerId);
  let allItems = choices.slice();
  let filtered = [];
  let highlighted = -1;
  let selected = [];

  function renderTags(){
    selectedContainer.innerHTML = "";
    selected.forEach(item=>{
      const t = document.createElement("div");
      t.className = "tagd";
      t.innerHTML = `<span class="text">${escapeHtml(item)}</span><span class="remove">×</span>`;
      t.querySelector(".remove").onclick = ()=>{ removeItem(item); };
      selectedContainer.appendChild(t);
    });
  }

  function removeItem(item){
    selected = selected.filter(i=>i!==item);
    renderTags();
  }

  function renderDropdown(){
    dropdown.innerHTML = "";
    filtered.forEach((item, idx)=>{
      const el = document.createElement("div");
      el.tabIndex = 0;
      el.innerHTML = `<span class="arrow">→</span><span style="margin-left:20px">${escapeHtml(item)}</span>`;
      if(idx===highlighted) el.classList.add("highlighted");
      el.addEventListener("mouseenter", ()=> { highlighted = idx; renderDropdown(); });
      el.addEventListener("mousedown", (e)=>{ e.preventDefault(); selectItem(item); });
      dropdown.appendChild(el);
    });
    dropdown.style.display = filtered.length ? "block" : "none";
    dropdown.setAttribute('aria-hidden', filtered.length? 'false':'true');
  }

  function selectItem(item){
    if(!selected.includes(item)) selected.push(item);
    input.value = "";
    filtered = allItems.filter(i=>!selected.includes(i));
    highlighted = -1;
    renderTags();
    renderDropdown();
  }

  input.addEventListener("input", ()=> {
    const v = input.value.trim().toLowerCase();
    filtered = v===""? allItems.filter(i=>!selected.includes(i)) : allItems.filter(i=>i.toLowerCase().includes(v) && !selected.includes(i));
    highlighted = filtered.length? 0:-1;
    renderDropdown();
  });

  input.addEventListener("keydown", (e)=>{
    if(e.key==="ArrowDown"){ e.preventDefault(); if(filtered.length){highlighted=(highlighted+1)%filtered.length; renderDropdown(); scrollHighlightedIntoView();} }
    else if(e.key==="ArrowUp"){ e.preventDefault(); if(filtered.length){highlighted=(highlighted-1+filtered.length)%filtered.length; renderDropdown(); scrollHighlightedIntoView();} }
    else if(e.key==="Enter"){ e.preventDefault(); if(highlighted>=0&&filtered[highlighted]) selectItem(filtered[highlighted]); else if(allowFreeText&&input.value.trim()) selectItem(input.value.trim()); }
    else if(e.key==="Escape"){ dropdown.style.display = "none"; }
    else if(e.key==="Backspace" && input.value===""){ if(selected.length){selected.pop(); renderTags();} }
  });

  function scrollHighlightedIntoView(){
    const el = dropdown.children[highlighted];
    if(el) el.scrollIntoView({block:"nearest",behavior:"auto"});
  }

  document.addEventListener("click", (ev)=>{
    if(!dropdown.contains(ev.target) && !input.contains(ev.target)) { dropdown.style.display="none"; highlighted=-1; }
  });

  const inst = {
    getSelected: ()=>selected.slice(),
    setSelectedFromString(str){
      selected=[]; if(!str){renderTags(); return;}
      if(Array.isArray(str)) selected=str.slice();
      else if(typeof str==="string"){ const cleaned=str.replace(/(^\s*"+|\s*"+$)/g,""); selected=cleaned.split(",").map(s=>s.trim()).filter(s=>s); }
      else selected=[String(str)];
      renderTags();
      filtered = allItems.filter(i=>!selected.includes(i));
      renderDropdown();
    },
    setSelectedFromArray(arr){ if(!Array.isArray(arr)) return; selected=arr.slice(); renderTags(); filtered=allItems.filter(i=>!selected.includes(i)); renderDropdown(); },
    clear(){ selected=[]; renderTags(); filtered=allItems.slice(); renderDropdown(); },
    addItem(item){ selectItem(item); },
    getSelectedAsString(){ return selected.join(","); }
  };

  allItems=choices.slice(); filtered=allItems.slice(); renderDropdown(); renderTags();
  instances[inputId]=inst;
  return inst;
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// ---------- initialize three multi-selects ----------
const profInst = setupMultiSelect({ inputId:"professionInput", dropdownId:"dropdown002", choices:profession, selectedContainerId:"profession-selected", allowFreeText:false });
const qualInst = setupMultiSelect({ inputId:"Qual", dropdownId:"hobbydropdown01", choices:hobbiesList, selectedContainerId:"qual-selected", allowFreeText:true });
const paddresInst = setupMultiSelect({ inputId:"Paddres", dropdownId:"dropdown01", choices:languagesList, selectedContainerId:"paddres-selected", allowFreeText:true });

// ---------- file preview helper ----------
function handleFilePreview(input, fileUrl = "") {
  const wrapper = input.closest(".file-group, .ser-group, .pro-group, .tem-group, .input-wrapper, .exp-group");
  if (!wrapper) return;
  let preview = wrapper.querySelector(".file-preview");
  if(!preview){
    preview = document.createElement("div");
    preview.className = "file-preview";
    preview.style.marginTop="6px";
    wrapper.appendChild(preview);
  }
  preview.innerHTML = fileUrl ? `<a href="${fileUrl}" target="_blank">View File</a>` : "";
}

console.log("✅ Multi-select inputs initialized. Ready for manual interaction.");