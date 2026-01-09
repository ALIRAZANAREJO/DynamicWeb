// ===== Global Education Data =====
const EDUCATION_FIELDS = [
{
   name: "Computer Science",
      "subfields": [
        "Artificial Intelligence",
        "Machine Learning",
        "Data Science",
        "Cybersecurity",
        "Software Engineering",
        "Web Development",
        "Mobile App Development",
        "Networking",
        "Cloud Computing",
        "Databases",
        "Human-Computer Interaction",
        "Computer Graphics",
        "Programming Languages"
      ]
    },
    {
      "name": "Engineering",
      "subfields": [
        "Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Electronics Engineering",
        "Aerospace Engineering",
        "Chemical Engineering",
        "Biomedical Engineering",
        "Industrial Engineering",
        "Robotics",
        "Environmental Engineering",
        "Materials Engineering",
        "Nuclear Engineering"
      ]
    },
    {
      "name": "Medicine",
      "subfields": [
        "General Medicine (MBBS)",
        "Dentistry",
        "Pharmacy",
        "Nursing",
        "Physiotherapy",
        "Surgery",
        "Pediatrics",
        "Cardiology",
        "Neurology",
        "Oncology",
        "Radiology",
        "Dermatology",
        "Psychiatry",
        "Anesthesiology",
        "Orthopedics",
        "Public Health"
      ]
    },
    {
      "name": "Business & Management",
      "subfields": [
        "Accounting",
        "Finance",
        "Marketing",
        "Human Resource Management",
        "International Business",
        "Entrepreneurship",
        "Supply Chain Management",
        "Operations Management",
        "Business Analytics"
      ]
    },
    {
      "name": "Law",
      "subfields": [
        "Civil Law",
        "Criminal Law",
        "International Law",
        "Corporate Law",
        "Constitutional Law",
        "Human Rights Law",
        "Intellectual Property Law",
        "Environmental Law"
      ]
    },
    {
      "name": "Education",
      "subfields": [
        "Early Childhood Education",
        "Primary Education",
        "Secondary Education",
        "Higher Education",
        "Special Education",
        "Educational Technology",
        "Curriculum Development",
        "Educational Leadership"
      ]
    },
    {
      "name": "Arts & Humanities",
      "subfields": [
        "History",
        "Philosophy",
        "Literature",
        "Linguistics",
        "Fine Arts",
        "Music",
        "Performing Arts",
        "Religious Studies",
        "Cultural Studies"
      ]
    },
    {
      "name": "Social Sciences",
      "subfields": [
        "Sociology",
        "Anthropology",
        "Political Science",
        "International Relations",
        "Psychology",
        "Economics",
        "Geography",
        "Archaeology"
      ]
    },
    {
      "name": "Natural Sciences",
      "subfields": [
        "Physics",
        "Chemistry",
        "Biology",
        "Earth Science",
        "Astronomy",
        "Environmental Science",
        "Mathematics",
        "Statistics"
      ]
    },
    {
      "name": "Agriculture & Forestry",
      "subfields": [
        "Agronomy",
        "Horticulture",
        "Animal Science",
        "Soil Science",
        "Agricultural Engineering",
        "Forestry",
        "Fisheries",
        "Food Science"
      ]
    },
    {
      "name": "Architecture & Design",
      "subfields": [
        "Architecture",
        "Interior Design",
        "Urban Planning",
        "Landscape Architecture",
        "Industrial Design",
        "Graphic Design",
        "Fashion Design"
      ]
    },
    {
      "name": "Economics",
      "subfields": [
        "Microeconomics",
        "Macroeconomics",
        "Development Economics",
        "International Economics",
        "Public Economics",
        "Behavioral Economics",
        "Econometrics"
      ]
    },
    {
      "name": "Psychology",
      "subfields": [
        "Clinical Psychology",
        "Counseling Psychology",
        "Educational Psychology",
        "Forensic Psychology",
        "Industrial-Organizational Psychology",
        "Neuropsychology",
        "Developmental Psychology",
        "Social Psychology"
      ]
    },
    {
      "name": "Media & Communication",
      "subfields": [
        "Journalism",
        "Mass Communication",
        "Public Relations",
        "Advertising",
        "Digital Media",
        "Film Studies",
        "Broadcasting"
      ]
    },
    {
      "name": "Hospitality & Tourism",
      "subfields": [
        "Hotel Management",
        "Tourism Management",
        "Event Management",
        "Travel Operations",
        "Food & Beverage Management",
        "Leisure Studies"
      ]
    },
    {
      "name": "Environmental Studies",
      "subfields": [
        "Environmental Management",
        "Sustainable Development",
        "Climate Change Studies",
        "Ecology",
        "Natural Resource Management",
        "Renewable Energy"
      ]
    },
    {
      "name": "Philosophy & Ethics",
      "subfields": [
        "Ethics",
        "Logic",
        "Metaphysics",
        "Epistemology",
        "Philosophy of Science",
        "Political Philosophy",
        "Philosophy of Mind"
      ]
    },
    {
      "name": "Mathematics & Statistics",
      "subfields": [
        "Pure Mathematics",
        "Applied Mathematics",
        "Statistics",
        "Computational Mathematics",
        "Actuarial Science"
      ]
    },
    {
      "name": "Veterinary Science",
      "subfields": [
        "Veterinary Medicine",
        "Animal Surgery",
        "Veterinary Pathology",
        "Animal Nutrition",
        "Wildlife Health"
      ]
    },
    {
      "name": "Pharmacy",
      "subfields": [
        "Pharmacology",
        "Pharmaceutics",
        "Clinical Pharmacy",
        "Pharmaceutical Chemistry",
        "Pharmacognosy"
      ]
    },
    {
      "name": "Dentistry",
      "subfields": [
        "Oral Surgery",
        "Orthodontics",
        "Periodontics",
        "Prosthodontics",
        "Pediatric Dentistry"
      ]
    },
    {
      "name": "Nursing",
      "subfields": [
        "General Nursing",
        "Pediatric Nursing",
        "Psychiatric Nursing",
        "Critical Care Nursing",
        "Community Health Nursing",
        "Midwifery"
      ]
    },
    {
      "name": "Public Administration",
      "subfields": [
        "Public Policy",
        "Governance",
        "Public Finance",
        "International Development",
        "Nonprofit Management"
      ]
    },
    {
      "name": "Sports & Physical Education",
      "subfields": [
        "Sports Science",
        "Coaching",
        "Physical Education",
        "Exercise Physiology",
        "Rehabilitation",
        "Kinesiology"
      ]
    },
    {
      "name": "Military & Defense Studies",
      "subfields": [
        "Defense Strategy",
        "Military History",
        "International Security",
        "Peace Studies",
        "War Studies"
      ]
    }
  ]
;
// ===== Degree Options (Global) =====
const DEGREE_OPTIONS = {
  school: [
    "Matriculation / O-Levels",
    "High School"
  ],
  college: [
    "Intermediate / A-Levels",
    "Diploma"
  ],
  university: [
    "Bachelor of Science (BSc)",
    "Bachelor of Arts (BA)",
    "Bachelor of Engineering (BEng)",
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Medicine (MBBS)",
    "Bachelor of Laws (LLB)"
  ],
  master: [
    "Master of Science (MSc)",
    "Master of Arts (MA)",
    "MBA",
    "Master of Engineering (MEng)",
    "MPhil"
  ],
  phd: [
    "PhD in Science",
    "PhD in Engineering",
    "PhD in Humanities",
    "PhD in Business"
  ]
};

// ===== Degree → Allowed Fields Mapping =====
const DEGREE_FIELD_MAP = {
  // ===== School Level =====
  "Matriculation / O-Levels": ["General Sciences", "Medical", "Commerce"],
  "High School": ["General Sciences", "Medical", "Commerce"],

  // ===== College Level =====
  "Intermediate / A-Levels": [ "Computer Sciences","Pre-Engineering", "Pre-Medical", "Commerce", "Arts / Humanities"],
  "Diploma": ["Technical", "Vocational", "Commerce"],

  // ===== Bachelor Level =====
  "Bachelor of Science (BSc)": [
    "Computer Science",
    "Natural Sciences",
    "Mathematics",
    "Environmental Science",
    "Agriculture",
    "Psychology",
    "Architecture & Design"
  ],
  "Bachelor of Arts (BA)": [
    "Humanities",
    "Languages & Literature",
    "History",
    "Philosophy",
    "Sociology",
    "Political Science",
    "Anthropology",
    "Fine Arts & Design"
  ],
  "Bachelor of Engineering (BEng)": [
    "Engineering",
    "Architecture & Design"
  ],
  "Bachelor of Business Administration (BBA)": [
    "Business & Management",
    "Economics & Finance",
    "Accounting"
  ],
  "Bachelor of Medicine (MBBS)": [
    "Medicine",
    "Nursing",
    "Pharmacy",
    "Public Health"
  ],
  "Bachelor of Laws (LLB)": ["Law"],

  // ===== Master Level =====
  "Master of Science (MSc)": [
    "Computer Science",
    "Natural Sciences",
    "Mathematics",
    "Environmental Science",
    "Agriculture",
    "Psychology"
  ],
  "Master of Arts (MA)": [
    "Humanities",
    "Languages & Literature",
    "History",
    "Philosophy",
    "Sociology",
    "Political Science",
    "Anthropology",
    "Fine Arts & Design"
  ],
  "MBA": [
    "Business & Management",
    "Economics & Finance",
    "Accounting"
  ],
  "Master of Engineering (MEng)": [
    "Engineering",
    "Architecture & Design"
  ],
  "MPhil": [
    "Computer Science",
    "Natural Sciences",
    "Humanities",
    "Engineering",
    "Medicine",
    "Business & Management",
    "Social Sciences"
  ],

  // ===== PhD Level =====
  "PhD in Science": [
    "Computer Science",
    "Natural Sciences",
    "Mathematics",
    "Environmental Science",
    "Agriculture"
  ],
  "PhD in Engineering": ["Engineering", "Architecture & Design"],
  "PhD in Humanities": [
    "Humanities",
    "Languages & Literature",
    "History",
    "Philosophy",
    "Sociology",
    "Anthropology",
    "Political Science",
    "Fine Arts & Design"
  ],
  "PhD in Business": [
    "Business & Management",
    "Economics & Finance",
    "Accounting"
  ]
};

// ===== Init Form Dropdowns =====
function initEducationForm() {
  document.querySelectorAll(".edu-card").forEach(card => {
    const formType = card.dataset.form; // school, college, university, master, phd

    // Degree select
    const degreeSelect = card.querySelector("select.float-input");
    if (degreeSelect && DEGREE_OPTIONS[formType]) {
      degreeSelect.innerHTML = `<option value="" disabled selected></option>`;
      DEGREE_OPTIONS[formType].forEach(deg => {
        const opt = document.createElement("option");
        opt.value = deg;
        opt.textContent = deg;
        degreeSelect.appendChild(opt);
      });

      // Watch degree change
      degreeSelect.addEventListener("change", () => {
        const selectedDegree = degreeSelect.value;
        const allowedFields = DEGREE_FIELD_MAP[selectedDegree] || [];

        // Create or find field select
        let fieldSelect = card.querySelector(".field-select");
        if (!fieldSelect) {
          fieldSelect = document.createElement("select");
          fieldSelect.className = "float-input field-select";
          fieldSelect.required = true;
          degreeSelect.parentNode.appendChild(fieldSelect);

          const label = document.createElement("label");
          label.className = "float-label";
          label.textContent = "Degree / Specialization";
          fieldSelect.insertAdjacentElement("afterend", label);
        }

        // Populate field dropdown
        fieldSelect.innerHTML = `<option value="" disabled selected></option>`;
        allowedFields.forEach(f => {
          const opt = document.createElement("option");
          opt.value = f;
          opt.textContent = f;
          fieldSelect.appendChild(opt);
        });

        // Watch field change
        fieldSelect.addEventListener("change", () => {
          const subfields = EDUCATION_FIELDS.find(f => f.name === fieldSelect.value)?.subfields || [];

          // Handle subfield dropdown
          let subSelect = card.querySelector(".subfield-select");
          let subLabel = card.querySelector(".subfield-select + label");

          if (subfields.length > 1) {
            // Multiple subfields → show dropdown
            if (!subSelect) {
              subSelect = document.createElement("select");
              subSelect.className = "float-input subfield-select";
              subSelect.required = true;
              fieldSelect.parentNode.appendChild(subSelect);

              subLabel = document.createElement("label");
              subLabel.className = "float-label";
              subLabel.textContent = "Degree / Specialization / Subfield";
              subSelect.insertAdjacentElement("afterend", subLabel);
            }

            subSelect.innerHTML = `<option value="" disabled selected></option>`;
            subfields.forEach(sf => {
              const opt = document.createElement("option");
              opt.value = sf;
              opt.textContent = sf;
              subSelect.appendChild(opt);
            });
          } else {
            // Only one or none → remove dropdown, auto-select if one exists
            if (subSelect) subSelect.remove();
            if (subLabel) subLabel.remove();

            if (subfields.length === 1) {
              // Save auto-selected subfield (could be stored in hidden input if needed)
              console.log("Auto-selected subfield:", subfields[0]);
              card.dataset.autoSubfield = subfields[0];
            } else {
              card.dataset.autoSubfield = "";
            }
          }
        });
      });
    }
  });
}

// ===== Init on page load =====
window.addEventListener("DOMContentLoaded", initEducationForm);
