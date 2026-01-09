/* ===== STEP 2 JS ===== */
const fieldsData = {
  "Computer Science": {
    "Programming": ["HTML","CSS","JavaScript","C++","Java","Python","SQL","MongoDB"],
    "Graphic Designing": ["Photoshop","Illustrator","Figma","CorelDraw"],
    "Hacking": ["Ethical Hacking","PenTesting","Malware Analysis"],
    "Video Editing": ["Premiere Pro","After Effects","Final Cut"],
    "MS Office": ["Word","Excel","PowerPoint"]
  },
  "Engineering": {
    "Mechanical": ["AutoCAD","SolidWorks","Thermodynamics"],
    "Civil": ["Surveying","Revit","Concrete Tech"],
    "Electrical": ["Circuit Design","MATLAB","Power Systems"]
  },
  "Medical": {
    "General": ["Anatomy","Surgery Basics","Pharmacology"],
    "Nursing": ["Patient Care","ICU Skills","Pathology"]
  },
  "Arts": {
    "Painting": ["Oil Painting","Watercolors","Sketching"],
    "Music": ["Guitar","Piano","Singing"],
    "Writing": ["Poetry","Storytelling","Screenwriting"]
  },
  "Commerce": {
    "Accounting": ["Bookkeeping","Auditing","Taxation"],
    "Finance": ["Investment","Banking","Stock Market"]
  },
  "Social Media": {
    "Marketing": ["Content Creation","SEO","Facebook Ads","TikTok Growth"],
    "Management": ["Community Management","Analytics","Branding"]
  },
  "Law": {
    "Criminal Law": ["Case Analysis","Forensics","Advocacy"],
    "Corporate Law": ["Contracts","Mergers","Compliance"]
  }
};

let step2State = { level:"fields", field:null, subcat:null };
let selectedStep2 = [];

const fieldsView = document.getElementById("fieldsView");
const subcatView = document.getElementById("subcatView");
const skillsView = document.getElementById("skillsView");
const backBtn = document.getElementById("backBtn");
const selectedStep2Div = document.getElementById("selectedStep2");

/* render helpers */
function renderFields(){
  fieldsView.innerHTML = "";
  for(const field in fieldsData){
    const div = document.createElement("div");
    div.className = "card-step2";
    div.textContent = field;
    div.onclick = ()=>{ step2State={level:"subcat",field}; renderSubcats(); };
    fieldsView.appendChild(div);
  }
  fieldsView.style.display="flex";
  subcatView.style.display="none";
  skillsView.style.display="none";
  backBtn.style.display="none";
}

function renderSubcats(){
  subcatView.innerHTML="";
  const subcats = fieldsData[step2State.field];
  for(const sub in subcats){
    const div=document.createElement("div");
    div.className="card-step2";
    div.textContent=sub;
    div.onclick=()=>{ step2State={...step2State,level:"skills",subcat:sub}; renderSkills(); };
    subcatView.appendChild(div);
  }
  fieldsView.style.display="none";
  subcatView.style.display="flex";
  skillsView.style.display="none";
  backBtn.style.display="inline-block";
}

function renderSkills(){
  skillsView.innerHTML="";
  const skills = fieldsData[step2State.field][step2State.subcat];
  skills.forEach(skill=>{
    const div=document.createElement("div");
    div.className="card-step2";
    div.textContent=skill;
    div.onclick=()=>{
      if(!selectedStep2.includes(skill)){
        selectedStep2.push(skill);
        renderSelectedStep2();
      }
    };
    skillsView.appendChild(div);
  });
  subcatView.style.display="none";
  skillsView.style.display="flex";
  backBtn.style.display="inline-block";
}

function renderSelectedStep2(){
  selectedStep2Div.innerHTML="";
  selectedStep2.forEach(skill=>{
    const tag=document.createElement("div");
    tag.className="skill-tag";
    tag.innerHTML=`<span>${skill}</span> <span class="remove-btn">×</span>`;
    tag.querySelector(".remove-btn").onclick=()=>{
      selectedStep2=selectedStep2.filter(s=>s!==skill);
      renderSelectedStep2();
    };
    selectedStep2Div.appendChild(tag);
  });
}

/* back button logic */
backBtn.onclick=()=>{
  if(step2State.level==="skills"){ renderSubcats(); step2State.level="subcat"; }
  else if(step2State.level==="subcat"){ renderFields(); step2State.level="fields"; }
};

/* init */
renderFields();
