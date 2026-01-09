/* ===========================
   FULL JS (COMPACT VERSION)
   STEP2_DATA + Search + Fields Explorer + Icons + Keyboard + Percent Editor
   Drop this file into your project or place in a <script> at the end of <body>
   This is the compact version (smaller lists, full functionality preserved).
=========================== */

/* ===========================
   STEP2_DATA (compact / updated)
   - Keep expanding this object as you like later
=========================== */
/* ====== STEP-2 DATA (fields -> subs -> skills) ====== */
const STEP2_DATA = {
  "Computer Science": {
    icon: "💻", color:"#2d6cdf",
    subs: {
      "Programming": { icon: "🧑‍💻", skills: [
        "C","C++","Java","Python","JavaScript","TypeScript","PHP","Ruby","Go (Golang)","Rust","Swift","Kotlin","Dart",
        "R","MATLAB","Scala","Haskell","Objective-C","Perl","Lua","F#","C#","Julia","Bash","PowerShell","Fortran",
        "COBOL","Lisp","Prolog","Erlang","Elixir","Ada","Groovy","Crystal","Nim","Assembly","Solidity","VHDL",
        "Verilog","Scheme"
      ]},

      "Web Development - Frontend": { icon: "🎨", skills: [
        "HTML","CSS","Sass / SCSS","React.js","Angular","Vue.js","Svelte","Next.js","Nuxt.js","Remix","SolidJS",
        "Alpine.js","jQuery","Bootstrap","Tailwind CSS","Bulma","Foundation CSS","Material UI","Ant Design",
        "Chakra UI","PrimeFaces","Semantic UI","Web Components","LitElement","Stencil.js","Ember.js","Backbone.js",
        "D3.js","Chart.js","Highcharts","ApexCharts","Three.js","WebGL","Babylon.js","Anime.js","GSAP","Velocity.js",
        "Framer Motion","ScrollMagic","FullPage.js","AOS","Swiper.js","Slick Carousel","Lodash","Underscore.js",
        "Day.js","Moment.js","Handlebars.js","Mustache.js","Pug"
      ]},

      "Web Development - Backend": { icon: "⚙️", skills: [
        "Node.js","Express.js","NestJS","Koa.js","Fastify","Hapi.js","Meteor.js","Django","Flask","FastAPI","Tornado",
        "Bottle","CherryPy","Ruby on Rails","Sinatra","Laravel","Symfony","CodeIgniter","CakePHP","Yii Framework",
        "Spring Boot","Grails","Micronaut","Quarkus","ASP.NET Core","Blazor","Phoenix","Play Framework","Vapor",
        "Mojolicious","ColdFusion","JHipster","LoopBack","AdonisJS","FeathersJS","RedwoodJS","Hasura","Strapi",
        "KeystoneJS","Directus"
      ]},

      "Databases": { icon: "🗄️", skills: [
        "MySQL","PostgreSQL","SQLite","MariaDB","MongoDB","Firestore","Firebase Realtime DB","CouchDB","Couchbase",
        "Cassandra","DynamoDB","Oracle Database","Microsoft SQL Server","Redis","Neo4j","ArangoDB","OrientDB","HBase",
        "RocksDB","InfluxDB","TimescaleDB","ClickHouse","VoltDB","TiDB","Amazon Aurora","Greenplum","Snowflake",
        "BigQuery","Redshift","Teradata","IBM Db2","SAP HANA","Pinecone","Weaviate","Milvus","SurrealDB","Realm"
      ]},

      "Mobile Development": { icon: "📱", skills: [
        "Swift","Objective-C","Kotlin","Java (Android)","Flutter","React Native","Ionic","Xamarin","NativeScript",
        "Cordova","PhoneGap","Onsen UI","Framework7","Jetpack Compose","SwiftUI","Unity (Mobile)","Unreal Engine (Mobile)",
        "Corona SDK","Sencha Touch","Tabris.js","Appcelerator Titanium","Monaca","Kivy","Apache Flex","Tauri"
      ]},

      "Cloud Computing": { icon: "☁️", skills: [
        "AWS","Microsoft Azure","Google Cloud Platform","Firebase Hosting","Firebase Functions","Firebase Storage",
        "Vercel","Netlify","DigitalOcean","Linode","Vultr","Heroku","Render","Fly.io","IBM Cloud","Oracle Cloud",
        "SAP Cloud","Cloudflare","OpenStack","Alibaba Cloud","Tencent Cloud","Huawei Cloud","OVH Cloud","Akamai",
        "Fastly","CDN77","Wasabi","Backblaze B2","MinIO","Ceph","Rancher","Eucalyptus","Scaleway","Kinsta",
        "SiteGround","cPanel Cloud","Plesk","Serverless Framework","Pulumi","Cloud Foundry"
      ]},

      "Cybersecurity": { icon: "🛡️", skills: [
        "Kali Linux","Parrot Security OS","Wireshark","Metasploit","Burp Suite","Nmap","Nessus","Snort","OWASP ZAP",
        "Aircrack-ng","Hydra","John the Ripper","Nikto","SQLMap","Maltego","Cuckoo Sandbox","Suricata","OSSEC",
        "Bro (Zeek)","Splunk","SIEM Tools","AlienVault","QRadar","ArcSight","Netcat","Hashcat","Ghidra","IDA Pro",
        "Radare2","Volatility"
      ]},

      "Operating Systems": { icon: "🖥️", skills: [
        "Windows","Linux (Ubuntu)","Linux (Fedora)","Linux (Arch)","Linux (Debian)","Linux (Red Hat)","Linux (CentOS)",
        "Linux (Kali)","macOS","Unix","Android OS","iOS","FreeBSD","OpenBSD","Haiku OS","QNX","VMware","VirtualBox",
        "Hyper-V","Proxmox"
      ]},

      "AI / ML / Data Science": { icon: "🤖", skills: [
        "TensorFlow","PyTorch","Keras","Scikit-learn","Pandas","NumPy","Matplotlib","Seaborn","Plotly","Bokeh","OpenCV",
        "NLTK","spaCy","Hugging Face Transformers","Gensim","TextBlob","FastText","XGBoost","LightGBM","CatBoost",
        "Jupyter Notebook","Google Colab","Kaggle Kernels","MLflow","DVC","Apache Hadoop","Apache Spark","Flink",
        "Mahout","Weka","RapidMiner","Orange","KNIME","Tableau","Power BI","Looker","Superset","QlikView","DataRobot",
        "AutoML","BigML","DeepMind Lab","Ray","Horovod","Hugging Face Spaces","Weights & Biases","Neptune.ai",
        "Comet ML","PyCaret","Prophet"
      ]},

      "DevOps & Tools": { icon: "⚡", skills: [
        "Git","GitHub","GitLab","Bitbucket","SourceForge","SVN","Mercurial","Docker","Kubernetes","Jenkins","Ansible",
        "Puppet","Chef","SaltStack","Travis CI","CircleCI","TeamCity","Bamboo","Drone CI","GitHub Actions","ArgoCD",
        "FluxCD","Helm","Istio","Linkerd","OpenShift","Rancher","Nomad","Terraform","Pulumi","Vagrant","Packer",
        "Consul","Vault","Prometheus","Grafana","ELK Stack","Graylog","Loki","Datadog","New Relic","Dynatrace",
        "AppDynamics","Sentry","Rollbar","Bugsnag","PagerDuty","OpsGenie","Nagios"
      ]},

      "Game Development & Graphics": { icon: "🎮", skills: [
        "Unity","Unreal Engine","Godot","CryEngine","Lumberyard","Construct","GameMaker Studio","RPG Maker","Cocos2d-x",
        "Phaser.js","Pygame","SDL","Blender","Maya","3ds Max","Houdini","Cinema4D","ZBrush","OpenGL","Vulkan","DirectX",
        "Metal","WebGPU","Processing","p5.js","ShaderLab","GLSL","HLSL"
      ]},

      "Testing & QA": { icon: "🧪", skills: [
        "Selenium","Cypress","Playwright","Puppeteer","Jest","Mocha","Chai","Jasmine","Karma","Enzyme","Testing Library",
        "PHPUnit","RSpec","JUnit","TestNG","PyTest","Robot Framework","Cucumber","Postman","Newman"
      ]},

      "Emerging Tech": { icon: "🚀", skills: [
        "Blockchain","Ethereum","Hyperledger","Solidity","Web3.js","Ethers.js","IPFS","Polkadot SDK","Cosmos SDK",
        "Chainlink","Arweave","Filecoin","Qiskit","Cirq","D-Wave SDK","OpenCL","CUDA","TensorRT","Greengrass","EdgeX",
        "Arduino","Raspberry Pi","MQTT"
      ]},

      "Collaboration & Project Management": { icon: "📂", skills: [
        "Jira","Confluence","Trello","Asana","Monday.com","ClickUp","Basecamp","Notion","Airtable","Slack","Teams",
        "Zoom","Google Meet","Miro","Figma","Adobe XD","Sketch","InVision","Lucidchart","Whimsical" ]}
    }
  },

  // "Engineering": {
  //   icon: "🛠️", color:"#b06b2d",
  //   subs: {
  //     "Mechanical": { icon:"⚙️", skills:["AutoCAD","SolidWorks","Thermodynamics"] },
  //     "Civil": { icon:"🏗️", skills:["Surveying","Revit","Concrete Tech"] }
  //   }
  // },

  "Engineering": {
    icon: "⚙️", color: "#0077b6",
    subs: {
      "Mechanical Engineering": { 
        icon: "🔩", 
        skills: [
          "Thermodynamics","Fluid Mechanics","Heat Transfer","Machine Design","Dynamics","Statics",
          "Strength of Materials","Vibrations","CAD (AutoCAD, SolidWorks)","Finite Element Analysis (FEA)",
          "Refrigeration & Air Conditioning","IC Engines","Manufacturing Processes","Hydraulic Machines",
          "Robotics in Mechanical Systems","CAM (Computer Aided Manufacturing)","HVAC Systems","CNC Machining",
          "Kinematics","Tribology","Energy Systems","Engineering Mechanics"
        ]
      },
      "Civil Engineering": { 
        icon: "🏗️", 
        skills: [
          "Structural Analysis","Reinforced Concrete","Steel Structures","Surveying","Construction Materials",
          "Geotechnical Engineering","Transportation Engineering","Environmental Engineering","Hydraulics",
          "Earthquake Engineering","Bridge Design","Foundation Engineering","Hydrology","Urban Planning",
          "Soil Mechanics","Building Information Modeling (BIM)","Water Resources","Highway Engineering",
          "Contracts & Costing","Sustainable Design","AutoCAD Civil 3D","Project Management"
        ]
      },
      "Electrical Engineering": { 
        icon: "🔌", 
        skills: [
          "Circuit Analysis","Power Systems","Control Systems","Signal Processing","Electromagnetics",
          "Electrical Machines","Power Electronics","Switchgear & Protection","High Voltage Engineering",
          "Smart Grids","Renewable Energy Systems","Instrumentation","PLC Programming","Embedded Systems",
          "Digital Electronics","Analog Electronics","Energy Storage","Electrical Design Codes","Load Flow Analysis",
          "SCADA Systems","Transformer Design","Electrical Safety Standards"
        ]
      },
      "Electronics & Communication": { 
        icon: "📡", 
        skills: [
          "Digital Signal Processing","VLSI Design","Analog Circuits","Digital Electronics","Microprocessors",
          "Microcontrollers","Embedded C","Wireless Communication","Optical Fiber Communication","Satellite Systems",
          "Antenna Design","IoT (Internet of Things)","Radar Engineering","RF & Microwave Engineering",
          "Control Theory","ASIC Design","FPGA Programming","Telecommunication Networks","Electronic Instrumentation",
          "Embedded Linux","Mobile Communication","PCB Design"
        ]
      },
      "Computer Engineering": { 
        icon: "💻", 
        skills: [
          "Computer Architecture","Operating Systems","Microarchitecture","Digital Logic","Embedded Systems",
          "Networking","Compiler Design","Data Structures","Algorithms","Distributed Systems","IoT Devices",
          "Parallel Computing","FPGA Design","Hardware Security","High-Performance Computing","Chip Design",
          "C Programming","Assembly Language","VHDL/Verilog","Cloud Infrastructure","GPU Computing"
        ]
      },
      "Software Engineering": { 
        icon: "🧑‍💻", 
        skills: [
          "Software Design Patterns","Agile Development","Scrum Framework","UML Modeling","Version Control (Git)",
          "Unit Testing","Integration Testing","Continuous Integration","Continuous Deployment","Requirement Analysis",
          "Object-Oriented Design","Functional Programming","DevOps Practices","Refactoring","Code Review",
          "Microservices Architecture","API Design","Cloud-Native Development","Test Automation","Secure Coding",
          "Documentation","System Analysis"
        ]
      },
      "Aerospace Engineering": { 
        icon: "✈️", 
        skills: [
          "Aerodynamics","Propulsion Systems","Avionics","Flight Mechanics","Aircraft Structures",
          "CFD (Computational Fluid Dynamics)","Aircraft Design","Orbital Mechanics","Spacecraft Engineering",
          "Control Systems","Composite Materials in Aerospace","Jet Engines","Rocket Propulsion","Aeroelasticity",
          "Aircraft Manufacturing","Unmanned Aerial Vehicles (Drones)","Navigation Systems","Aircraft Maintenance",
          "Wind Tunnel Testing","Gas Turbines","Supersonic Flow","Hypersonic Flow"
        ]
      },
      "Automotive Engineering": { 
        icon: "🚗", 
        skills: [
          "Vehicle Dynamics","Engine Design","Automotive Electronics","Fuel Systems","Hybrid Vehicles",
          "Electric Vehicles","Transmission Systems","Suspension Systems","Brake Systems","Vehicle Safety",
          "Emission Control","Chassis Design","Thermal Management","Crash Analysis","Automotive CAD",
          "Powertrain Engineering","Alternative Fuels","Autonomous Vehicles","Automotive Sensors",
          "NVH Engineering (Noise, Vibration, Harshness)","Automotive Manufacturing"
        ]
      },
      "Biomedical Engineering": { 
        icon: "🧬", 
        skills: [
          "Medical Imaging","MRI Technology","X-ray Imaging","CT Scan Technology","Ultrasound Engineering",
          "Biomechanics","Biomaterials","Prosthetics Design","Tissue Engineering","Biomedical Signal Processing",
          "Neuroengineering","Rehabilitation Engineering","Wearable Medical Devices","Artificial Organs",
          "Bioinstrumentation","Drug Delivery Systems","Cell & Tissue Mechanics","Clinical Engineering",
          "Nanomedicine","3D Bioprinting","Medical Robotics","Regenerative Medicine"
        ]
      },
      "Chemical Engineering": { 
        icon: "⚗️", 
        skills: [
          "Process Design","Chemical Kinetics","Thermodynamics","Heat Transfer","Mass Transfer","Fluid Dynamics",
          "Reaction Engineering","Plant Design","Separation Processes","Biochemical Engineering","Polymer Engineering",
          "Petrochemical Engineering","Process Control","Nanotechnology in Chemistry","Catalysis",
          "Electrochemical Engineering","Environmental Chemistry","Material Synthesis","Energy Engineering",
          "Food Processing","Industrial Chemistry","Green Chemistry"
        ]
      },
      "Petroleum Engineering": { 
        icon: "🛢️", 
        skills: [
          "Reservoir Engineering","Drilling Engineering","Petroleum Geology","Well Logging","Production Engineering",
          "Enhanced Oil Recovery","Petrophysics","Drilling Fluids","Directional Drilling","Offshore Engineering",
          "Pipeline Engineering","Safety Engineering","Refining Processes","Hydraulic Fracturing","Geomechanics",
          "Reservoir Simulation","Unconventional Resources","Petroleum Economics","Seismic Analysis","Mud Logging"
        ]
      },
      "Mining Engineering": { 
        icon: "⛏️", 
        skills: [
          "Mine Planning","Rock Mechanics","Mineral Processing","Drilling & Blasting","Safety Engineering",
          "Ventilation Systems","Surface Mining","Underground Mining","Exploration Geology","Mine Surveying",
          "Ore Dressing","Mining Equipment Design","Open Pit Design","Slope Stability","Mine Economics",
          "Environmental Impact","Mine Closure Planning","Explosives Engineering","Geostatistics","Automation in Mining"
        ]
      },
      "Metallurgical Engineering": { 
        icon: "🥇", 
        skills: [
          "Extractive Metallurgy","Physical Metallurgy","Mechanical Metallurgy","Heat Treatment","Material Testing",
          "Casting Processes","Welding Metallurgy","Powder Metallurgy","Alloy Design","Corrosion Engineering",
          "Fracture Mechanics","Phase Diagrams","Non-Destructive Testing","Iron & Steel Making","Aluminum Processing",
          "Advanced Alloys","Failure Analysis","Microstructure Analysis","Nano-Metallurgy","Surface Engineering"
        ]
      },
      "Materials Engineering": { 
        icon: "🔬", 
        skills: [
          "Nanomaterials","Ceramics","Polymers","Composite Materials","Biomaterials","Material Testing",
          "Failure Analysis","Mechanical Properties of Materials","Material Selection","Smart Materials",
          "Phase Transformation","Surface Engineering","Materials Characterization","Corrosion Protection",
          "Thin Films & Coatings","Crystal Growth","Materials for Energy","Magnetic Materials",
          "Electronic Materials","Additive Manufacturing Materials","Advanced Manufacturing"
        ]
      },
      "Industrial & Manufacturing": { 
        icon: "🏭", 
        skills: [
          "Lean Manufacturing","Six Sigma","Supply Chain Management","Quality Control","Operations Research",
          "Industrial Safety","Ergonomics","Production Planning","Plant Layout","Industrial Automation",
          "Inventory Management","Simulation Modeling","Process Optimization","Cost Engineering","Industrial Robotics",
          "Additive Manufacturing","CNC Programming","Work Study","Value Engineering","Kaizen","Total Quality Management"
        ]
      },
      "Systems Engineering": { 
        icon: "🛠️", 
        skills: [
          "System Modeling","Simulation","Risk Analysis","Requirements Engineering","Integration","Optimization",
          "System Dynamics","Control Systems","Decision Analysis","Reliability Engineering","Cyber-Physical Systems",
          "Process Control","Architecture Frameworks","Safety Engineering","Complex Systems","Verification & Validation",
          "Enterprise Systems","Model-Based Engineering","Human Factors","Lifecycle Management","System Testing"
        ]
      },
      "Robotics Engineering": { 
        icon: "🤖", 
        skills: [
          "Kinematics","Dynamics","Control Systems","Robot Operating System (ROS)","Machine Vision","Path Planning",
          "Mechatronics","Automation","Human-Robot Interaction","AI in Robotics","Robot Sensors","Robot Actuators",
          "Manipulator Design","Mobile Robots","Swarm Robotics","Soft Robotics","Industrial Robotics",
          "Robotics Programming (C++, Python)","Embedded Systems","Robotic Simulation","Autonomous Navigation"
        ]
      },
      "Nuclear Engineering": { 
        icon: "☢️", 
        skills: [
          "Nuclear Reactor Design","Radiation Protection","Thermal Hydraulics","Fuel Cycle Engineering",
          "Safety Systems","Radioactive Waste Management","Nuclear Materials","Neutron Physics","Plasma Physics",
          "Fusion Energy","Reactor Control","Dosimetry","Reactor Physics","Criticality Safety",
          "Radiological Engineering","Isotope Production","Power Plant Design","Decommissioning Engineering",
          "Probabilistic Risk Assessment","Shielding Design","Remote Handling"
        ]
      },
      "Marine / Ocean Engineering": { 
        icon: "⚓", 
        skills: [
          "Naval Architecture","Marine Propulsion","Hydrodynamics","Offshore Structures","Ship Design",
          "Marine Engines","Submarine Engineering","Coastal Engineering","Marine Safety","Wave Mechanics",
          "Port & Harbor Engineering","Ship Maintenance","Marine Materials","Offshore Renewable Energy",
          "Oceanographic Engineering","Ballast Systems","Ship Stability","Marine CAD","Hull Design","Maritime Automation"
        ]
      },
      "Environmental Engineering": { 
        icon: "🌱", 
        skills: [
          "Water Supply Engineering","Wastewater Treatment","Air Pollution Control","Solid Waste Management",
          "Environmental Impact Assessment","Renewable Energy","Climate Change Mitigation","GIS in Environment",
          "Sustainability","Green Building","Soil Remediation","Noise Pollution Control","Groundwater Engineering",
          "Hazardous Waste Management","Environmental Chemistry","Ecological Engineering","Energy Efficiency",
          "Carbon Capture","Waste-to-Energy Systems","Environmental Law","Hydrology & Hydraulics"
        ]
      },
      "Agricultural Engineering": { 
        icon: "🚜", 
        skills: [
          "Irrigation Systems","Farm Machinery Design","Soil Mechanics","Crop Processing","Post-Harvest Technology",
          "Hydrology","Food Storage Engineering","Bioprocessing","Greenhouse Technology","Precision Agriculture",
          "Renewable Energy in Agriculture","Agricultural Automation","Dairy Engineering","Bioenergy Systems",
          "Drainage Systems","Land Use Planning","Water Management","Aquaculture Engineering","Farm Structures",
          "Sustainable Farming"
        ]
      },
      "Food Engineering": { 
        icon: "🍎", 
        skills: [
          "Food Processing","Food Safety","Bioprocessing","Packaging Technology","Quality Assurance",
          "Food Chemistry","Food Microbiology","Dairy Processing","Meat Processing","Cereal Technology",
          "Fermentation Technology","Thermal Processing","Food Preservation","Food Plant Design","Sensory Evaluation",
          "Nutraceuticals","Enzyme Technology","Food Biotechnology","Food Rheology","Cold Chain Management",
          "Food Regulations & Standards"
        ]
      },
      "Textile Engineering": { 
        icon: "🧵", 
        skills: [
          "Fiber Science","Yarn Manufacturing","Fabric Manufacturing","Textile Design","Textile Chemistry",
          "Dyeing & Finishing","Polymer Chemistry","Nonwoven Fabrics","Knitting Technology","Weaving Technology",
          "Textile Testing","Apparel Design","Fashion Technology","Technical Textiles","Smart Textiles",
          "Nanotechnology in Textiles","Garment Manufacturing","Textile Machinery","Sustainable Textiles",
          "Textile CAD","Color Science"
        ]
      },
      "Structural Engineering": { 
        icon: "🏢", 
        skills: [
          "Structural Design","Steel Structures","Concrete Technology","Earthquake Engineering","Bridge Design",
          "Tall Buildings","Finite Element Analysis","Structural Dynamics","Prestressed Concrete","Timber Structures",
          "Masonry Structures","Foundation Design","Wind Engineering","Retrofitting","Rehabilitation of Structures",
          "Structural Safety","Building Codes","Seismic Analysis","Structural Optimization","Forensic Engineering",
          "Offshore Structures"
        ]
      },
      "Mechatronics Engineering": { 
        icon: "⚙️🤖", 
        skills: [
          "Automation","Embedded Systems","Sensors & Actuators","Control Systems","Robotics Integration",
          "Microcontrollers","PLC Programming","Signal Processing","Power Electronics","Artificial Intelligence in Mechatronics",
          "System Modeling","Industrial IoT","Electromechanical Design","Machine Vision","Data Acquisition Systems",
          "CNC Automation","Real-Time Systems","Wireless Communication","Human-Machine Interfaces","Servo Systems",
          "Embedded Linux"]}
    }
  },

  "Medical": {
    icon:"🏥", color:"#c62828",
    subs: { "General": { icon:"🩺", skills:["Anatomy","Surgery Basics","Pharmacology"] }, "Nursing": { icon:"👩‍⚕️", skills:["Patient Care","ICU Skills","Pathology"] } }
  },

  "Medical": {
    icon: "🩺", color: "#008080",
    subs: {
      "General Medicine": {
        icon: "👨‍⚕️",
        skills: [
          "Patient History Taking","Physical Examination","Clinical Reasoning","Diagnosis","Prescription Writing",
          "Chronic Disease Management","Preventive Care","Geriatric Care","Nutrition Counseling","Vital Signs Monitoring",
          "Blood Pressure Measurement","Diabetes Management","Hypertension Treatment","Vaccination","Medical Ethics",
          "Evidence-Based Medicine","Telemedicine Consultation","Medical Documentation","Patient Education","Health Screening"
        ]
      },
      "Surgery": {
        icon: "🔪",
        skills: [
          "Suturing","Appendectomy","Laparoscopy","Robotic Surgery","Cholecystectomy",
          "Hernia Repair","Splenectomy","Wound Management","Pre-Op Care","Post-Op Care",
          "Trauma Surgery","Amputation","Organ Transplant","Endoscopy","Colonoscopy",
          "Burn Treatment","Biopsy Procedures","Thoracic Surgery","Vascular Surgery","Plastic Surgery"
        ]
      },
      "Cardiology": {
        icon: "❤️",
        skills: [
          "ECG Reading","Echocardiography","Cardiac Catheterization","Stress Testing","Pacemaker Implantation",
          "Angioplasty","Heart Failure Management","Arrhythmia Treatment","Cardiac Rehab","Blood Pressure Control",
          "Thrombolysis","Valve Replacement","Cardiac Ultrasound","Holter Monitoring","Electrophysiology",
          "Heart Transplant Care","Lipid Management","Coronary Artery Bypass","Cardiac MRI","Heart Murmur Diagnosis"
        ]
      },
      "Neurology": {
        icon: "🧠",
        skills: [
          "Lumbar Puncture","EEG Reading","Stroke Management","Epilepsy Treatment","Neurological Exam",
          "Movement Disorder Care","Multiple Sclerosis Treatment","Neuropathy Diagnosis","Headache Management","Neuroimaging Interpretation",
          "Parkinson’s Care","Dementia Assessment","Brain Tumor Management","Spinal Cord Injury Care","Sleep Disorders Treatment",
          "Neuropharmacology","ALS Management","Neurorehabilitation","Cognitive Testing","Concussion Management"
        ]
      },
      "Radiology": {
        icon: "🩻",
        skills: [
          "MRI Interpretation","CT Scan Analysis","Ultrasound Imaging","X-ray Analysis","Interventional Radiology",
          "Mammography","PET Scan","Nuclear Medicine","Radiation Safety","Fluoroscopy",
          "Angiography","Bone Density Scan","Radiographic Positioning","Contrast Media Administration","Radiotherapy Planning",
          "Trauma Imaging","Chest Imaging","Neuroimaging","Abdominal Imaging","Cardiac Imaging"
        ]
      },
      "OB/GYN": {
        icon: "🤰",
        skills: [
          "Prenatal Care","Ultrasound","Cesarean Section","Normal Delivery","Gynecological Surgery",
          "Menopause Management","Infertility Treatment","Pap Smear","Contraceptive Counseling","Endometriosis Management",
          "Pelvic Exam","Labor Induction","High-Risk Pregnancy Care","Postnatal Care","Fetal Monitoring",
          "Breast Exam","Cervical Cancer Screening","Hysterectomy","Ovarian Cyst Removal","Family Planning"
        ]
      },
      "Psychiatry": {
        icon: "🧑‍⚕️",
        skills: [
          "Psychiatric Assessment","Cognitive Behavioral Therapy","Crisis Intervention","Medication Management","Addiction Treatment",
          "Group Therapy","Depression Management","Anxiety Disorders Treatment","Schizophrenia Care","Bipolar Disorder Management",
          "Suicide Risk Assessment","Sleep Disorders Treatment","Personality Disorder Therapy","Child Psychiatry","Geriatric Psychiatry",
          "Electroconvulsive Therapy","Trauma Counseling","PTSD Management","Stress Management","Mindfulness Therapy"
        ]
      },
      "Dermatology": {
        icon: "🌿",
        skills: [
          "Skin Biopsy","Cosmetic Procedures","Laser Treatment","Psoriasis Management","Allergy Testing",
          "Acne Treatment","Eczema Care","Cryotherapy","Mole Removal","Skin Cancer Diagnosis",
          "Hair Loss Treatment","Chemical Peels","Botox Injections","Dermal Fillers","Microdermabrasion",
          "Phototherapy","Scar Treatment","Wart Removal","Skin Infection Management","Pigmentation Treatment"
        ]
      },
      "Orthopedics": {
        icon: "🦴",
        skills: [
          "Fracture Fixation","Joint Replacement","Arthroscopy","Sports Injury Treatment","Bone Grafting",
          "Casting and Splinting","Spinal Surgery","Trauma Orthopedics","Osteoporosis Management","Clubfoot Correction",
          "Hand Surgery","Foot and Ankle Surgery","Knee Arthroplasty","Shoulder Repair","Ligament Reconstruction",
          "Hip Replacement","Bone Tumor Management","Orthopedic Rehab","Pediatric Orthopedics","Back Pain Management"
        ]
      },
      "Emergency Medicine": {
        icon: "🚑",
        skills: [
          "CPR","Airway Management","Trauma Resuscitation","First Aid","Emergency Surgery",
          "Defibrillation","Poisoning Management","Burn Emergency Care","Fracture Stabilization","Shock Management",
          "Sepsis Treatment","Triage","Disaster Medicine","Ventilator Management","Chest Tube Insertion",
          "Blood Transfusion","Stroke Emergency Care","Allergic Reaction Management","Snake Bite Treatment","Cardiac Arrest Management"
        ]
      },
      "Pediatrics": {
        icon: "🧒",
        skills: [
          "Newborn Care","Vaccination","Growth Monitoring","Child Nutrition","Pediatric Emergencies",
          "Neonatal Resuscitation","Asthma Management","Developmental Assessment","Infection Control","Pediatric Surgery",
          "Congenital Disorders Management","Child Psychology","Adolescent Health","School Health","Autism Spectrum Care",
          "Child Abuse Recognition","Pediatric Oncology","Pediatric Cardiology","Pediatric Neurology","Pediatric ICU"
        ]
      },
      "Dentistry": {
        icon: "🦷",
        skills: [
          "Tooth Extraction","Dental Cleaning","Root Canal Treatment","Braces and Orthodontics","Dental Implants",
          "Cavity Filling","Crown Placement","Gum Disease Treatment","Teeth Whitening","Oral Surgery",
          "Pediatric Dentistry","Prosthodontics","Periodontics","Endodontics","Maxillofacial Surgery",
          "Cosmetic Dentistry","Oral Cancer Screening","Denture Fitting","Digital X-Rays","Oral Hygiene Education"
        ]
      },
      "Pathology": {
        icon: "🧪",
        skills: [
          "Blood Tests","Biopsy Analysis","Urine Analysis","Cytology","Histopathology",
          "Molecular Pathology","Microbiology","Immunology Testing","Tumor Marker Testing","Genetic Testing",
          "Hematology","Bone Marrow Analysis","Virology","Parasitology","Bacteriology",
          "Clinical Chemistry","Tissue Culture","Forensic Pathology","Medical Lab Management","Autopsy Procedures"
        ]
      },
      "Anesthesiology": {
        icon: "💤",
        skills: [
          "General Anesthesia","Local Anesthesia","Epidural","Spinal Block","Pain Management",
          "Sedation","Airway Management","Anesthesia Monitoring","Pre-Anesthesia Assessment","Post-Anesthesia Care",
          "Emergency Anesthesia","ICU Sedation","Pediatric Anesthesia","Obstetric Anesthesia","Cardiac Anesthesia",
          "Neuroanesthesia","Regional Blocks","Ventilation Management","Anaphylaxis Management","Resuscitation Support"
        ]
      },
      "Oncology": {
        icon: "🎗️",
        skills: [
          "Cancer Diagnosis","Chemotherapy","Radiotherapy","Surgical Oncology","Palliative Care",
          "Immunotherapy","Targeted Therapy","Cancer Screening","Oncogenetics","Tumor Board Discussion",
          "Hematologic Malignancies","Breast Cancer Management","Lung Cancer Treatment","Colorectal Cancer Care","Leukemia Treatment",
          "Cancer Pain Management","Oncology Nursing","Survivorship Care","Bone Marrow Transplant","Clinical Trials in Oncology"]}
  }
},


  "Arts & Humanities": {
    icon: "🎨", color: "#a83279",
    subs: {
      "Literature & Languages": {
        icon: "🖌️",
        skills: [
          "Creative Writing","Textual Analysis","Comparative Literature","Poetry Writing","Novel Writing",
          "Short Story Writing","Literary Criticism","Translation","Editing","Proofreading",
          "Linguistic Analysis","Rhetoric","Philology","Narrative Studies","World Literature",
          "Academic Writing","Playwriting","Essay Writing","Speech Writing","Storytelling",
          "Copywriting","Book Reviewing","Publishing","Digital Literature","Critical Reading"
        ]
      },
      "Philosophy": {
        icon: "🤔",
        skills: [
          "Critical Thinking","Ethics","Logic","Metaphysics","Epistemology",
          "Aesthetics","Political Philosophy","Moral Reasoning","Argumentation","Philosophy of Mind",
          "Philosophy of Science","Philosophy of Religion","Philosophy of Language","Philosophy of Law","Ethical Decision-Making",
          "Phenomenology","Existentialism","Analytical Philosophy","Dialectics","Debate Skills",
          "Philosophical Writing","Conceptual Analysis","Virtue Ethics","Utilitarianism","Deontology"
        ]
      },
      "History": {
        icon: "🏛️",
        skills: [
          "Archival Research","Chronology Analysis","Oral History","Source Criticism","Historical Writing",
          "Cultural History","Political History","Economic History","Military History","Social History",
          "Historical Cartography","Genealogy Research","Ancient History","Modern History","Medieval Studies",
          "Historiography","Comparative History","Document Preservation","Digital History","Historical Interpretation",
          "Archaeohistory","Diplomatic History","World History","Regional History","Historical Narratives"
        ]
      },
      "Linguistics": {
        icon: "🗣️",
        skills: [
          "Phonetics","Phonology","Morphology","Syntax","Semantics",
          "Pragmatics","Sociolinguistics","Psycholinguistics","Computational Linguistics","Historical Linguistics",
          "Language Documentation","Translation Studies","Language Teaching","Applied Linguistics","Discourse Analysis",
          "Corpus Linguistics","Forensic Linguistics","Language Policy","Language Revitalization","Bilingualism",
          "Sign Language Studies","Lexicography","Second Language Acquisition","Stylistics","Dialectology"
        ]
      },
      "Visual Arts": {
        icon: "🎨",
        skills: [
          "Drawing","Painting","Sculpture","Printmaking","Digital Illustration",
          "Photography","Graphic Design","Collage","Mixed Media","Textile Art",
          "Ceramics","Glass Art","Wood Carving","Metalwork","Installation Art",
          "Concept Art","Animation","3D Modeling","Calligraphy","Art Curation",
          "Exhibition Design","Mural Painting","Street Art","Tattoo Art","Cartooning"
        ]
      },
      "Performing Arts": {
        icon: "🎭",
        skills: [
          "Acting","Directing","Stage Management","Improvisation","Choreography",
          "Playwriting","Dance Performance","Opera Singing","Theatre Production","Stage Design",
          "Voice Acting","Puppetry","Circus Arts","Mime","Drama Teaching",
          "Musical Theatre","Stage Makeup","Lighting Design","Sound Design","Stage Combat",
          "Performance Criticism","Character Development","Audition Skills","Storyboarding","Movement Training"
        ]
      },
      "Music": {
        icon: "🎵",
        skills: [
          "Singing","Music Composition","Music Theory","Instrument Playing","Conducting",
          "Orchestration","Arranging","Improvisation","Songwriting","Ear Training",
          "Harmony","Counterpoint","Rhythm Studies","Jazz Improvisation","Electronic Music Production",
          "DJing","Recording","Mixing","Mastering","Music Criticism",
          "Choral Singing","Band Management","Music Therapy","Live Performance","Stage Presence"
        ]
      },
      "Film & Cinema Studies": {
        icon: "🎬",
        skills: [
          "Screenwriting","Cinematography","Film Editing","Sound Design","Lighting for Film",
          "Directing","Film Criticism","Production Management","Acting for Camera","Set Design",
          "Costume Design","Makeup for Film","Visual Effects","Storyboarding","Film History",
          "Script Analysis","Film Distribution","Casting","Location Scouting","Documentary Production",
          "Animation for Film","Screen Acting","Film Festivals Management","Post-Production","Cultural Film Studies"
        ]
      },
      "Cultural Studies": {
        icon: "🌍",
        skills: [
          "Intercultural Communication","Ethnography","Globalization Studies","Identity Studies","Media Analysis",
          "Popular Culture Analysis","Subculture Studies","Race and Ethnicity Studies","Colonial Studies","Postcolonial Studies",
          "Gender Studies","Queer Studies","Cultural Policy","Visual Culture","Digital Culture",
          "Cultural Heritage","Community Studies","Consumer Culture Analysis","Critical Theory","Semiotics",
          "Global Media Studies","Narrative Identity","Representation Analysis","Cultural Criticism","World Cultures"
        ]
      },
      "Anthropology": {
        icon: "🧑‍🤝‍🧑",
        skills: [
          "Ethnographic Research","Fieldwork","Cultural Anthropology","Biological Anthropology","Archaeological Methods",
          "Linguistic Anthropology","Anthropological Theory","Kinship Studies","Human Evolution","Forensic Anthropology",
          "Participant Observation","Interview Techniques","Material Culture Studies","Symbolic Anthropology","Medical Anthropology",
          "Applied Anthropology","Urban Anthropolicalogy","Rural Studies","Migration Studies","Development Anthropology",
          "Anthropological Writing","Cross-Cultural Analysis","Cultural Relativism","Anthropology of Religion","Visual Anthropology"
        ]
      },
      "Archaeology": {
        icon: "⛏️",
        skills: [
          "Excavation","Stratigraphy","Dating Methods","Artifact Analysis","Surveying",
          "Conservation","Bioarchaeology","Zooarchaeology","Paleoethnobotany","Geoarchaeology",
          "Underwater Archaeology","Experimental Archaeology","Remote Sensing","Archaeological Mapping","Cultural Resource Management",
          "Museum Studies","Archaeometry","Public Archaeology","Heritage Preservation","Archaeological Drawing",
          "Historical Archaeology","Prehistoric Archaeology","Classical Archaeology","Medieval Archaeology","Field Report Writing"
        ]
      },
      "Religious Studies": {
        icon: "⛪",
        skills: [
          "Theology","Comparative Religion","Biblical Studies","Islamic Studies","Hindu Studies",
          "Buddhist Studies","Jewish Studies","Mythology","Ethics in Religion","Philosophy of Religion",
          "Sacred Text Analysis","Religious History","Interfaith Dialogue","Ritual Studies","Spiritual Counseling",
          "Religious Law","Anthropology of Religion","Sociology of Religion","Contemporary Religion","New Religious Movements",
          "Religion and Politics","Religion and Art","Pilgrimage Studies","Religion and Science","Mysticism"
        ]
      },
      "Education (Humanities Focus)": {
        icon: "🎓",
        skills: [
          "Curriculum Design","Educational Psychology","Pedagogy","Classroom Management","Assessment Methods",
          "Educational Technology","Adult Education","Special Education","Teacher Training","Critical Pedagogy",
          "Multicultural Education","Distance Learning","Philosophy of Education","Inclusive Education","Instructional Design",
          "Mentorship","Student Counseling","Learning Theories","Educational Policy","Bilingual Education",
          "Early Childhood Education","Literacy Development","Higher Education Studies","Educational Research","Collaborative Learning"
        ]
      },
      "Sociology (Humanities Side)": {
        icon: "👥",
        skills: [
          "Social Research","Survey Methods","Qualitative Analysis","Quantitative Analysis","Sociological Theory",
          "Urban Studies","Rural Sociology","Family Studies","Work and Industry","Education Studies",
          "Health Sociology","Crime and Deviance","Religion and Society","Social Stratification","Race Relations",
          "Gender and Society","Media Sociology","Political Sociology","Environmental Sociology","Community Studies",
          "Social Change","Globalization","Social Movements","Demography","Public Sociology"
        ]
      },
      "Architecture & Design (Humanities)": {
        icon: "🏗️",
        skills: [
          "Architectural Drawing","Architectural History","Interior Design","Landscape Design","Urban Planning",
          "Sustainable Design","Model Making","CAD for Humanities","Art Deco Studies","Postmodern Architecture",
          "Cultural Architecture","Heritage Architecture","Restoration","Design Theory","Furniture Design",
          "Lighting Design","Acoustic Design","Color Theory","Exhibition Design","Visual Storytelling",
          "Sketching","Building Criticism","Conceptual Design","Traditional Architecture","Contemporary Architecture"
        ]
      }
    }
  },


  "Business & Management": {
    icon: "📊", color: "#f39c12",
    subs: {
      "General Management": {
        icon: "🗂",
        skills: [
          "Leadership", "Strategic Planning", "Operational Management", "Change Management", "Business Process Improvement",
          "Agile Management", "Scrum Mastery", "Lean Six Sigma", "Decision Making", "Conflict Resolution",
          "Negotiation", "Risk Management", "Team Building", "Performance Evaluation", "Corporate Governance",
          "Supply Chain Management", "Logistics", "Quality Management", "Time Management", "Delegation",
          "Crisis Management", "Global Business Strategy", "Stakeholder Management", "Vision Setting", "Business Ethics",
          "Organizational Behavior", "Policy Development", "Cross-cultural Management", "Problem Solving",
          "Employee Engagement", "Innovation Management", "Product Lifecycle Management", "Operational Excellence",
          "OKRs", "KPIs", "Benchmarking", "Change Leadership", "Talent Management", "Succession Planning",
          // ... 500+ total
        ]
      },
      "Finance & Accounting": {
        icon: "💰",
        skills: [
          "Financial Analysis", "Budgeting", "Forecasting", "Cost Accounting", "Auditing",
          "Tax Planning", "Corporate Finance", "Mergers & Acquisitions", "Valuation", "Financial Modeling",
          "Equity Research", "Risk Assessment", "Capital Budgeting", "Investment Analysis", "Portfolio Management",
          "IFRS", "GAAP", "SAP Finance", "QuickBooks", "Payroll Management",
          "Financial Reporting", "Treasury Management", "Working Capital Management", "Hedging", "Derivatives",
          "Credit Analysis", "Debt Management", "Fundraising", "Asset Management", "Insurance Planning",
          // ... extend to 500+
        ]
      },
      "Marketing": {
        icon: "📣",
        skills: [
          "Digital Marketing", "SEO", "SEM", "Content Marketing", "Email Marketing",
          "Affiliate Marketing", "Influencer Marketing", "Social Media Strategy", "Market Research", "Consumer Behavior",
          "Brand Management", "Advertising", "Public Relations", "Product Marketing", "Pricing Strategy",
          "Customer Relationship Management", "Google Analytics", "Conversion Optimization", "UX Marketing", "A/B Testing",
          "Mobile Marketing", "Viral Marketing", "Storytelling", "Community Engagement", "Video Marketing",
          "Event Marketing", "Sponsorships", "Trade Shows", "Copywriting", "Growth Hacking",
          // ... 500+
        ]
      }
    }
  },

  "Law": {
    icon: "⚖️", color: "#34495e",
    subs: {
      "General Law": {
        icon: "📜",
        skills: [
          "Legal Research", "Contract Drafting", "Litigation", "Case Analysis", "Legal Writing",
          "Moot Court Skills", "Negotiation", "Mediation", "Arbitration", "Client Counseling",
          "Legal Documentation", "Corporate Law Basics", "Due Diligence", "Legal Compliance", "Court Procedures",
          "Statutory Interpretation", "Advocacy", "Legal Ethics", "Cross-Examination", "Evidence Analysis",
          // ... 500+
        ]
      },
      "Specialized Law": {
        icon: "📚",
        skills: [
          "Criminal Law", "Civil Law", "Corporate Law", "Constitutional Law", "Family Law",
          "International Law", "Environmental Law", "Human Rights Law", "Intellectual Property Law", "Labor Law",
          "Tax Law", "Cyber Law", "Space Law", "Health Law", "Immigration Law",
          "Banking Law", "Insurance Law", "Property Law", "Competition Law", "Energy Law",
          // ... extend to 500+
        ]
      }
    }
  },

  "Education & Teaching": {
    icon: "📘", color: "#2980b9",
    subs: {
      "Teaching Skills": {
        icon: "👩‍🏫",
        skills: [
          "Lesson Planning", "Curriculum Design", "Instructional Strategies", "Classroom Management", "Assessment Design",
          "Pedagogy", "Andragogy", "Child Psychology", "Special Education", "Educational Technology",
          "Inclusive Education", "Learning Styles Adaptation", "Student Engagement", "Feedback Delivery", "Mentoring",
          "Academic Counseling", "Exam Preparation", "Bloom’s Taxonomy Application", "Differentiated Instruction",
          "Project-Based Learning", "Gamification in Education", "Active Learning Techniques", "Peer Tutoring",
          "Flipped Classroom", "Experiential Learning", "Critical Thinking Development", "Debate Moderation",
          "Public Speaking Training", "Educational Psychology", "Educational Research",
          // ... 500+
        ]
      },
      "Education Administration": {
        icon: "🏫",
        skills: [
          "School Management", "Higher Education Policy", "Educational Leadership", "Budgeting in Education", "Faculty Development",
          "Accreditation Management", "Quality Assurance in Education", "Student Affairs Management", "Timetable Scheduling", "Discipline Management",
          "Admissions Management", "Education Law", "Grant Writing", "Fundraising for Education", "Parent Communication",
          // ... 500+
        ]
      }
    }
  },

  "Natural Sciences": {
    icon: "🔬", color: "#27ae60",
    subs: {
      "Physics": {
        icon: "⚛️",
        skills: [
          "Classical Mechanics", "Quantum Mechanics", "Thermodynamics", "Electromagnetism", "Optics",
          "Nuclear Physics", "Particle Physics", "Astrophysics", "Condensed Matter Physics", "Fluid Dynamics",
          "Chaos Theory", "Computational Physics", "Plasma Physics", "Acoustics", "Mathematical Physics",
          "Experimental Design", "Lab Equipment Handling", "Data Analysis", "Spectroscopy", "Simulation Modeling",
          // ... 500+
        ]
      },
      "Chemistry": {
        icon: "⚗️",
        skills: [
          "Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry", "Biochemistry",
          "Chromatography", "Spectrophotometry", "NMR", "Mass Spectrometry", "Electrochemistry",
          "Reaction Kinetics", "Thermochemistry", "Industrial Chemistry", "Pharmaceutical Chemistry", "Polymer Chemistry",
          "Environmental Chemistry", "Titration Techniques", "Lab Safety", "Green Chemistry", "Catalysis",
          // ... 500+
        ]
      },
      "Biology": {
        icon: "🧬",
        skills: [
          "Cell Biology", "Molecular Biology", "Genetics", "Microbiology", "Botany",
          "Zoology", "Ecology", "Evolutionary Biology", "Neuroscience", "Biostatistics",
          "Immunology", "Parasitology", "Bioinformatics", "Marine Biology", "Biotechnology",
          "DNA Sequencing", "CRISPR Techniques", "PCR", "Microscopy", "Field Research",
          // ... 500+
        ]
      },
      "Earth Science": {
        icon: "🌍",
        skills: [
          "Geology", "Mineralogy", "Petrology", "Paleontology", "Volcanology",
          "Seismology", "Climatology", "Meteorology", "Hydrology", "Oceanography",
          "Remote Sensing", "GIS", "Environmental Monitoring", "Soil Science", "Glaciology",
          "Geomorphology", "Cartography", "Natural Disaster Management", "Sustainable Resource Management", "Geophysics",
          // ... 500+
        ]}
    }
},
  "Mathematics & Statistics": {
    icon: "📐", color: "#8e44ad",
    subs: {
      "Pure Mathematics": {
        icon: "➗",
        skills: [
          "Algebra", "Linear Algebra", "Abstract Algebra", "Geometry", "Trigonometry",
          "Calculus", "Differential Equations", "Real Analysis", "Complex Analysis", "Topology",
          "Number Theory", "Set Theory", "Logic", "Mathematical Proofs", "Vector Spaces",
          "Group Theory", "Ring Theory", "Measure Theory", "Functional Analysis", "Dynamical Systems",
          // ... extend to 500+
        ]
      },
      "Applied Mathematics": {
        icon: "📊",
        skills: [
          "Numerical Analysis", "Optimization", "Mathematical Modeling", "Operations Research", "Game Theory",
          "Probability Theory", "Stochastic Processes", "Computational Mathematics", "Control Theory", "Simulation",
          "Chaos Theory", "Graph Theory", "Cryptography", "Fluid Dynamics Mathematics", "Mathematical Physics",
          "Engineering Mathematics", "Wave Equations", "Fourier Analysis", "Laplace Transforms", "Nonlinear Systems",
          // ... 500+
        ]
      },
      "Statistics": {
        icon: "📉",
        skills: [
          "Descriptive Statistics", "Inferential Statistics", "Regression Analysis", "ANOVA", "Hypothesis Testing",
          "Bayesian Statistics", "Multivariate Statistics", "Time Series Analysis", "Sampling Methods", "Experimental Design",
          "Survey Design", "Big Data Statistics", "Machine Learning Statistics", "SPSS", "R Programming",
          "Statistical Inference", "Monte Carlo Simulation", "Biostatistics", "Econometrics Statistics", "Data Visualization",
          // ... 500+
        ]
      }
    }
  },

  "Social Sciences": {
    icon: "🌐", color: "#16a085",
    subs: {
      "Sociology": {
        icon: "👥",
        skills: [
          "Social Research", "Survey Design", "Interviewing", "Ethnography", "Social Theory",
          "Qualitative Analysis", "Quantitative Analysis", "Demography", "Gender Studies", "Family Studies",
          "Urban Sociology", "Rural Sociology", "Criminology", "Social Stratification", "Cultural Sociology",
          "Community Development", "Social Policy Analysis", "Globalization Studies", "Inequality Studies", "Migration Studies",
          // ... 500+
        ]
      },
      "Political Science": {
        icon: "🏛️",
        skills: [
          "Comparative Politics", "Political Theory", "Public Policy Analysis", "International Relations", "Political Philosophy",
          "Constitutional Studies", "Diplomacy", "Security Studies", "Elections & Voting Behavior", "Public Administration",
          "Policy Evaluation", "Conflict Studies", "Governance", "Federalism", "Political Ideologies",
          "Geopolitics", "Legislative Studies", "Political Communication", "Human Rights Policy", "Civil Society Engagement",
          // ... 500+
        ]
      },
      "Anthropology": {
        icon: "🪶",
        skills: [
          "Cultural Anthropology", "Archaeology", "Physical Anthropology", "Linguistic Anthropology", "Ethnographic Fieldwork",
          "Human Evolution", "Primatology", "Mythology Studies", "Symbolism", "Ritual Studies",
          "Indigenous Studies", "Medical Anthropology", "Urban Anthropology", "Kinship Analysis", "Material Culture Studies",
          "Forensic Anthropology", "Environmental Anthropology", "Applied Anthropology", "Heritage Conservation", "Global Cultures",
          // ... 500+
        ]
      }
    }
  },

  "Economics & Finance": {
    icon: "💹", color: "#d35400",
    subs: {
      "Economics": {
        icon: "📈",
        skills: [
          "Microeconomics", "Macroeconomics", "Development Economics", "International Trade", "Game Theory Economics",
          "Public Economics", "Labor Economics", "Health Economics", "Environmental Economics", "Behavioral Economics",
          "Industrial Organization", "Welfare Economics", "Economic Modeling", "Econometrics", "Policy Analysis",
          "Monetary Economics", "Fiscal Policy Analysis", "Economic Forecasting", "Global Economics", "Comparative Economic Systems",
          // ... 500+
        ]
      },
      "Finance": {
        icon: "💵",
        skills: [
          "Corporate Finance", "Investment Banking", "Asset Management", "Private Equity", "Venture Capital",
          "Hedge Funds", "Portfolio Management", "Risk Management", "Derivatives Trading", "Fixed Income Analysis",
          "Equity Valuation", "Real Estate Finance", "Financial Regulation", "Wealth Management", "Treasury Operations",
          "Credit Risk", "Liquidity Management", "Capital Markets", "Financial Strategy", "M&A Advisory",
          // ... 500+
        ]
      }
    }
  },

  "Psychology": {
    icon: "🧠", color: "#e67e22",
    subs: {
      "General Psychology": {
        icon: "📘",
        skills: [
          "Cognitive Psychology", "Behavioral Psychology", "Developmental Psychology", "Social Psychology", "Personality Psychology",
          "Psychological Assessment", "Experimental Design in Psychology", "Research Methods in Psychology", "Psychometrics", "Perception Studies",
          "Memory Studies", "Learning Theories", "Motivation & Emotion", "Decision-Making Studies", "Attention Studies",
          "Biopsychology", "Neuropsychology", "Forensic Psychology", "Health Psychology", "Educational Psychology",
          // ... 500+
        ]
      },
      "Clinical Psychology": {
        icon: "🩺",
        skills: [
          "Psychotherapy", "Cognitive Behavioral Therapy", "Psychoanalysis", "Trauma Therapy", "Family Therapy",
          "Child Therapy", "Group Therapy", "Addiction Counseling", "Crisis Intervention", "Clinical Diagnosis",
          "Mental Health Assessment", "Counseling Skills", "Rehabilitation Therapy", "Behavior Modification", "Mindfulness Therapy",
          "Stress Management", "Suicidality Assessment", "Clinical Interviewing", "Treatment Planning", "Case Formulation",
          // ... 500+
        ]
      },
      "Specialized Psychology": {
        icon: "🔍",
        skills: [
          "Industrial-Organizational Psychology", "Sports Psychology", "Military Psychology", "Consumer Psychology", "Cross-Cultural Psychology",
          "Environmental Psychology", "Positive Psychology", "Evolutionary Psychology", "Community Psychology", "Political Psychology",
          // ... 500+
        ]
      }
    }
  },

  "Architecture & Design": {
    icon: "🏛️", color: "#9b59b6",
    subs: {
      "Architecture": {
        icon: "📐",
        skills: [
          "Architectural Design", "AutoCAD", "Revit", "3D Modeling", "Urban Planning",
          "Sustainable Architecture", "Landscape Architecture", "Interior Design", "Building Codes", "Construction Management",
          "Heritage Conservation", "Parametric Design", "Digital Fabrication", "Concept Development", "Model Making",
          "Site Planning", "Housing Design", "Commercial Architecture", "Cultural Architecture", "SketchUp",
          // ... 500+
        ]
      },
      "Design": {
        icon: "🎨",
        skills: [
          "Graphic Design", "Illustrator", "Photoshop", "Typography", "Branding",
          "UX Design", "UI Design", "Interaction Design", "Motion Graphics", "3D Animation",
          "Industrial Design", "Product Design", "Fashion Design", "Web Design", "Design Thinking",
          "Color Theory", "Layout Design", "Prototyping", "Wireframing", "Figma",
          // ... 500+
        ]
      }
    }
  },

  "Environmental Science": {
    icon: "🌱", color: "#27ae60",
    subs: {
      "Environmental Studies": {
        icon: "🌍",
        skills: [
          "Ecology", "Environmental Impact Assessment", "Climate Change Studies", "Biodiversity Conservation", "Water Resource Management",
          "Air Pollution Monitoring", "Soil Analysis", "Sustainable Development", "Waste Management", "Recycling Systems",
          "Environmental Policy", "GIS in Environment", "Renewable Energy Systems", "Carbon Footprint Analysis", "Ecosystem Restoration",
          "Wildlife Conservation", "Environmental Law", "Green Infrastructure", "Sustainability Reporting", "Life Cycle Assessment",
          // ... 500+
        ]
      }
    }
  },

  "Agriculture & Forestry": {
    icon: "🌾", color: "#f1c40f",
    subs: {
      "Agriculture": {
        icon: "🚜",
        skills: [
          "Crop Production", "Soil Fertility Management", "Irrigation Techniques", "Agroecology", "Organic Farming",
          "Precision Agriculture", "Pest Control", "Agribusiness", "Plant Breeding", "Seed Technology",
          "Fertilizer Application", "Agricultural Machinery", "Hydroponics", "Aquaponics", "Vertical Farming",
          "Post-Harvest Technology", "Agri Supply Chain", "Agricultural Economics", "Smart Farming Sensors", "Farm Data Analytics",
          // ... 500+
        ]
      },
      "Forestry": {
        icon: "🌲",
        skills: [
          "Forest Management", "Silviculture", "Agroforestry", "Wildlife Habitat Conservation", "Forest Ecology",
          "Forest Policy", "Timber Harvesting", "Fire Management", "Forest Inventory", "Carbon Sequestration",
          "Community Forestry", "Sustainable Forest Management", "Remote Sensing in Forestry", "Forest Economics", "Forest Pathology",
          "Tree Breeding", "Urban Forestry", "Forest Hydrology", "Biodiversity in Forests", "Non-Timber Forest Products",
          // ... 500+
        ]
      }
    }
  },

  "Pharmacy": {
    icon: "💊", color: "#e74c3c",
    subs: {
      "Pharmaceutical Sciences": {
        icon: "🧪",
        skills: [
          "Pharmacology", "Pharmaceutics", "Pharmaceutical Chemistry", "Pharmacognosy", "Clinical Pharmacy",
          "Drug Design", "Drug Development", "Pharmacokinetics", "Pharmacodynamics", "Toxicology",
          "Biopharmaceutics", "Biotechnology in Pharmacy", "Pharmaceutical Biotechnology", "Herbal Medicine", "Medicinal Chemistry",
          "Pharmacy Law", "Hospital Pharmacy", "Community Pharmacy", "Industrial Pharmacy", "Regulatory Affairs",
          // ... 500+
        ]
      }
    }
  },

  "Nursing & Allied Health": {
    icon: "🩺", color: "#c0392b",
    subs: {
      "Nursing": {
        icon: "👩‍⚕️",
        skills: [
          "Patient Care", "Critical Care Nursing", "Emergency Nursing", "Surgical Nursing", "Pediatric Nursing",
          "Geriatric Nursing", "Obstetric Nursing", "Mental Health Nursing", "Community Health Nursing", "Oncology Nursing",
          "Nursing Ethics", "Nursing Informatics", "Nursing Research", "Evidence-Based Nursing", "Clinical Skills",
          "Wound Care", "Medication Administration", "Health Assessment", "Nursing Documentation", "Infection Control",
          // ... 500+
        ]
      },
      "Allied Health": {
        icon: "🧑‍⚕️",
        skills: [
          "Physiotherapy", "Occupational Therapy", "Radiology Technology", "Medical Laboratory Science", "Nutrition & Dietetics",
          "Speech Therapy", "Audiology", "Respiratory Therapy", "Dental Hygiene", "Optometry",
          "Emergency Medical Technology", "Orthotics & Prosthetics", "Public Health Technology", "Clinical Laboratory Testing", "Diagnostic Imaging",
          // ... 500+
        ]
      }
    }
  },

  "Media, Communication & Journalism": {
    icon: "📰", color: "#2980b9",
    subs: {
      "Media & Communication": {
        icon: "📺",
        skills: [
          "Mass Communication", "Broadcast Journalism", "Public Relations", "Advertising", "Digital Media",
          "Media Production", "Film Studies", "Television Production", "Media Ethics", "Cultural Communication",
          "Social Media Strategy", "Digital Storytelling", "Podcasting", "Photojournalism", "Documentary Production",
          "Visual Communication", "Media Research", "Corporate Communication", "Interpersonal Communication", "Crisis Communication",
          // ... 500+
        ]
      },
      "Journalism": {
        icon: "🖋",
        skills: [
          "Investigative Reporting", "News Writing", "Feature Writing", "Editing", "Copywriting",
          "Data Journalism", "Political Reporting", "Sports Journalism", "Science Journalism", "Business Journalism",
          "Photo Editing", "Fact Checking", "Interview Techniques", "Ethics in Journalism", "Magazine Journalism",
          "Broadcast Reporting", "Foreign Correspondence", "Editorial Writing", "Opinion Writing", "Column Writing",
          // ... 500+
        ]
      }
    }
  },

  "Hospitality & Tourism Management": {
    icon: "🏨", color: "#f39c12",
    subs: {
      "Hospitality": {
        icon: "🍽️",
        skills: [
          "Hotel Management", "Front Office Operations", "Housekeeping Management", "Food & Beverage Service", "Event Management",
          "Guest Relations", "Hospitality Marketing", "Revenue Management", "Hospitality Accounting", "Hospitality Technology",
          "Catering Management", "Luxury Hospitality", "Hospitality Entrepreneurship", "Menu Design", "Hospitality Law",
          "Hospitality Training", "Resort Management", "Club Management", "Theme Park Management", "Wellness Hospitality",
          // ... 500+
        ]
      },
      "Tourism": {
        icon: "✈️",
        skills: [
          "Travel Planning", "Tour Operations", "Eco-Tourism", "Heritage Tourism", "Adventure Tourism",
          "Sustainable Tourism", "Destination Marketing", "Tour Guide Skills", "Travel Agency Operations", "Airline Management",
          "Cruise Tourism", "Event Tourism", "Tourism Economics", "Tourism Policy", "Community-Based Tourism",
          "Cultural Tourism", "Wildlife Tourism", "Medical Tourism", "Digital Tourism Platforms", "Hospitality Sales",
          // ... 500+
        ]
      }
    }
  },

  "Public Policy & International Relations": {
    icon: "🌐", color: "#34495e",
    subs: {
      "Public Policy": {
        icon: "📑",
        skills: [
          "Policy Analysis", "Policy Design", "Policy Evaluation", "Public Administration", "Governance",
          "Policy Research", "Legislative Drafting", "Social Policy", "Economic Policy", "Education Policy",
          "Health Policy", "Environmental Policy", "Security Policy", "Crisis Management Policy", "Policy Implementation",
          "Policy Advocacy", "Regulatory Policy", "Urban Policy", "Rural Policy", "Equity Policy",
          // ... 500+
        ]
      },
      "International Relations": {
        icon: "🌍",
        skills: [
          "Diplomacy", "Geopolitics", "International Law", "Conflict Resolution", "Peace Studies",
          "Foreign Policy Analysis", "Global Governance", "International Organizations", "Security Studies", "Human Rights Advocacy",
          "Migration Studies", "War Studies", "Trade Negotiations", "Development Studies", "Intelligence Analysis",
          "Cross-Cultural Negotiation", "Public Diplomacy", "Soft Power Strategies", "Global Security Policy", "International Treaties",
          // ... 500+
        ]
      }
    }
  },

};

/* ===========================
   SKILL ICONS (fallback text/emoji)
   - If devicon doesn't exist for a skill, we show fallback from here
   - Keep values short (emoji or 2-4 chars)
=========================== */
const SKILL_ICONS = {
  "Node.js":"N","React":"","Photoshop":"Ps","Illustrator":"Ai","Figma":"F","Premiere Pro":"Pr",
  "Excel":"XL","Word":"Wd","PowerPoint":"Pp","AutoCAD":"AC","SolidWorks":"Sw","MATLAB":"M",
  "Anatomy":"An","Guitar":"🎸","Investment":"💹","Content Creation":"✍️","Ethical Hacking":"🛡️",
  "PenTesting":"🧪"
};

/* ===========================
   Devicon mapping helpers
   - canonical map for known mismatches
   - devicon folder and file naming varies; mapping covers common cases
=========================== */
function deviconNameFor(skillName){
  // canonical mapping for certain names (lowercased keys)
 const map = {
  // Programming
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
  "scala": "scala",
  "haskell": "haskell",
  "objective-c": "default",
  "perl": "perl",
  "lua": "lua",
  "f#": "default",
  "c#": "csharp",
  "julia": "julia",
  "bash": "bash",
  "powershell": "default",
  "fortran": "default",
  "cobol": "default",
  "lisp": "default",
  "prolog": "default",
  "erlang": "erlang",
  "elixir": "elixir",
  "ada": "default",
  "groovy": "groovy",
  "crystal": "default",
  "nim": "default",
  "assembly": "default",
  "solidity": "solidity",
  "vhdl": "default",
  "verilog": "default",
  "scheme": "default",

  // Frontend
  "html": "html5",
  "css": "css3",
  "sass / scss": "sass",
  "react.js": "react",
  "angular": "angularjs",
  "vue.js": "vuejs",
  "svelte": "svelte",
  "next.js": "nextjs",
  "nuxt.js": "nuxtjs",
  "remix": "default",
  "solidjs": "default",
  "alpine.js": "default",
  "jquery": "jquery",
  "bootstrap": "bootstrap",
  "tailwind css": "tailwindcss",
  "bulma": "bulma",
  "foundation css": "default",
  "material ui": "default",
  "ant design": "default",
  "chakra ui": "default",
  "primefaces": "default",
  "semantic ui": "default",
  "web components": "default",
  "litelement": "default",
  "stencil.js": "default",
  "ember.js": "ember",
  "backbone.js": "backbonejs",
  "d3.js": "d3js",
  "chart.js": "default",
  "highcharts": "default",
  "apexcharts": "default",
  "three.js": "threejs",
  "webgl": "default",
  "babylon.js": "default",
  "anime.js": "default",
  "gsap": "default",
  "velocity.js": "default",
  "framer motion": "default",
  "scrollmagic": "default",
  "fullpage.js": "default",
  "aos": "default",
  "swiper.js": "default",
  "slick carousel": "default",
  "lodash": "default",
  "underscore.js": "default",
  "day.js": "default",
  "moment.js": "default",
  "handlebars.js": "default",
  "mustache.js": "default",
  "pug": "default",

  // Backend
  "node.js": "nodejs",
  "express.js": "express",
  "nestjs": "nestjs",
  "koa.js": "default",
  "fastify": "default",
  "hapi.js": "default",
  "meteor.js": "meteor",
  "django": "django",
  "flask": "flask",
  "fastapi": "default",
  "tornado": "default",
  "bottle": "default",
  "cherrypy": "default",
  "ruby on rails": "rails",
  "sinatra": "default",
  "laravel": "laravel",
  "symfony": "symfony",
  "codeigniter": "default",
  "cakephp": "cakephp",
  "yii framework": "default",
  "spring boot": "spring",
  "grails": "default",
  "micronaut": "default",
  "quarkus": "default",
  "asp.net core": "dotnet",
  "blazor": "default",
  "phoenix": "default",
  "play framework": "play",
  "vapor": "default",
  "mojolicious": "default",
  "coldfusion": "default",
  "jhipster": "default",
  "loopback": "default",
  "adonisjs": "adonisjs",
  "feathersjs": "default",
  "redwoodjs": "default",
  "hasura": "default",
  "strapi": "strapi",
  "keystonejs": "default",
  "directus": "default",

  // Databases
  "mysql": "mysql",
  "postgresql": "postgresql",
  "sqlite": "sqlite",
  "mariadb": "default",
  "mongodb": "mongodb",
  "firestore": "default",
  "firebase realtime db": "firebase",
  "couchdb": "couchdb",
  "couchbase": "default",
  "cassandra": "cassandra",
  "dynamodb": "default",
  "oracle database": "oracle",
  "microsoft sql server": "mssql",
  "redis": "redis",
  "neo4j": "neo4j",
  "arango db": "default",
  "orientdb": "default",
  "hbase": "default",
  "rocksdb": "default",
  "influxdb": "default",
  "timescaledb": "default",
  "clickhouse": "default",
  "voltdb": "default",
  "tidb": "default",
  "amazon aurora": "default",
  "greenplum": "default",
  "snowflake": "default",
  "bigquery": "default",
  "redshift": "default",
  "teradata": "default",
  "ibm db2": "default",
  "sap hana": "default",
  "pinecone": "default",
  "weaviate": "default",
  "milvus": "default",
  "surrealdb": "default",
  "realm": "default",

  // Agricultural Engineering
  "Irrigation Systems": "default",
  "Farm Machinery Design": "default",
  "Soil Mechanics": "default",
  "Crop Processing": "default",
  "Post-Harvest Technology": "default",
  "Hydrology": "default",
  "Food Storage Engineering": "default",
  "Bioprocessing": "default",
  "Greenhouse Technology": "default",
  "Precision Agriculture": "default",
  "Renewable Energy in Agriculture": "default",
  "Agricultural Automation": "default",
  "Dairy Engineering": "default",
  "Bioenergy Systems": "default",
  "Drainage Systems": "default",
  "Land Use Planning": "default",
  "Water Management": "default",
  "Aquaculture Engineering": "default",
  "Farm Structures": "default",
  "Sustainable Farming": "default",

  // Food Engineering
  "Food Processing": "default",
  "Food Safety": "default",
  "Bioprocessing": "default",
  "Packaging Technology": "default",
  "Quality Assurance": "default",
  "Food Chemistry": "default",
  "Food Microbiology": "default",
  "Dairy Processing": "default",
  "Meat Processing": "default",
  "Cereal Technology": "default",
  "Fermentation Technology": "default",
  "Thermal Processing": "default",
  "Food Preservation": "default",
  "Food Plant Design": "default",
  "Sensory Evaluation": "default",
  "Nutraceuticals": "default",
  "Enzyme Technology": "default",
  "Food Biotechnology": "default",
  "Food Rheology": "default",
  "Cold Chain Management": "default",
  "Food Regulations & Standards": "default",

  // Textile Engineering
  "Fiber Science": "default",
  "Yarn Manufacturing": "default",
  "Fabric Manufacturing": "default",
  "Textile Design": "default",
  "Textile Chemistry": "default",
  "Dyeing & Finishing": "default",
  "Polymer Chemistry": "default",
  "Nonwoven Fabrics": "default",
  "Knitting Technology": "default",
  "Weaving Technology": "default",
  "Textile Testing": "default",
  "Apparel Design": "default",
  "Fashion Technology": "default",
  "Technical Textiles": "default",
  "Smart Textiles": "default",
  "Nanotechnology in Textiles": "default",
  "Garment Manufacturing": "default",
  "Textile Machinery": "default",
  "Sustainable Textiles": "default",
  "Textile CAD": "default",
  "Color Science": "default",

  // Structural Engineering
  "Structural Design": "default",
  "Steel Structures": "default",
  "Concrete Technology": "default",
  "Earthquake Engineering": "default",
  "Bridge Design": "default",
  "Tall Buildings": "default",
  "Finite Element Analysis": "default",
  "Structural Dynamics": "default",
  "Prestressed Concrete": "default",
  "Timber Structures": "default",
  "Masonry Structures": "default",
  "Foundation Design": "default",
  "Wind Engineering": "default",
  "Retrofitting": "default",
  "Rehabilitation of Structures": "default",
  "Structural Safety": "default",
  "Building Codes": "default",
  "Seismic Analysis": "default",
  "Structural Optimization": "default",
  "Forensic Engineering": "default",
  "Offshore Structures": "default",

  // Mechatronics Engineering
  "Automation": "default",
  "Embedded Systems": "default",
  "Sensors & Actuators": "default",
  "Control Systems": "default",
  "Robotics Integration": "default",
  "Microcontrollers": "default",
  "PLC Programming": "default",
  "Signal Processing": "default",
  "Power Electronics": "default",
  "Artificial Intelligence in Mechatronics": "default",
  "System Modeling": "default",
  "Industrial IoT": "default",
  "Electromechanical Design": "default",
  "Machine Vision": "default",
  "Data Acquisition Systems": "default",
  "CNC Automation": "default",
  "Real-Time Systems": "default",
  "Wireless Communication": "default",
  "Human-Machine Interfaces": "default",
  "Servo Systems": "default",
  "Embedded Linux": "default",



  // --- General Medicine ---
  "Anatomy": "default",
  "Physiology": "default",
  "Pathology": "default",
  "Pharmacology": "default",
  "Microbiology": "default",
  "Biochemistry": "default",
  "Immunology": "default",
  "Genetics": "default",
  "Medical Ethics": "default",
  "Public Health": "default",
  "Family Medicine": "default",
  "Emergency Medicine": "default",
  "Internal Medicine": "default",
  "Preventive Medicine": "default",
  "Medical Research": "default",
  "Evidence-Based Medicine": "default",
  "Nutrition": "default",
  "Tropical Medicine": "default",
  "Clinical Skills": "default",
  "Medical Imaging": "default",
  "Radiology": "default",

  // --- Surgery ---
  "General Surgery": "default",
  "Cardiac Surgery": "default",
  "Neurosurgery": "default",
  "Orthopedic Surgery": "default",
  "Plastic Surgery": "default",
  "Pediatric Surgery": "default",
  "Vascular Surgery": "default",
  "Urology": "default",
  "Transplant Surgery": "default",
  "Minimally Invasive Surgery": "default",
  "Robotic Surgery": "default",
  "Trauma Surgery": "default",
  "Oncologic Surgery": "default",

  // --- Cardiology ---
  "Cardiac Physiology": "default",
  "Electrocardiography": "default",
  "Echocardiography": "default",
  "Interventional Cardiology": "default",
  "Cardiac Catheterization": "default",
  "Heart Failure Management": "default",
  "Cardiac Rehabilitation": "default",
  "Arrhythmia Management": "default",
  "Pediatric Cardiology": "default",
  "Preventive Cardiology": "default",
  "Cardiovascular Imaging": "default",

  // --- Neurology ---
  "Neuroanatomy": "default",
  "Neurophysiology": "default",
  "Clinical Neurology": "default",
  "Neuroimaging": "default",
  "Epileptology": "default",
  "Stroke Management": "default",
  "Neurodegenerative Disorders": "default",
  "Neuromuscular Disorders": "default",
  "Neurocritical Care": "default",
  "Movement Disorders": "default",
  "Neuropharmacology": "default",

  // --- Pediatrics ---
  "Child Development": "default",
  "Pediatric Nutrition": "default",
  "Neonatology": "default",
  "Pediatric Cardiology": "default",
  "Pediatric Oncology": "default",
  "Pediatric Neurology": "default",
  "Pediatric Endocrinology": "default",
  "Pediatric Pulmonology": "default",
  "Pediatric Nephrology": "default",
  "Pediatric Infectious Diseases": "default",
  "Pediatric Emergency Medicine": "default",

  // --- Psychiatry ---
  "Clinical Psychiatry": "default",
  "Child Psychiatry": "default",
  "Adolescent Psychiatry": "default",
  "Geriatric Psychiatry": "default",
  "Addiction Psychiatry": "default",
  "Forensic Psychiatry": "default",
  "Psychopharmacology": "default",
  "Cognitive Behavioral Therapy": "default",
  "Psychoanalysis": "default",
  "Psychosomatic Medicine": "default",
  "Community Psychiatry": "default",

  // --- Dentistry ---
  "Oral Anatomy": "default",
  "Oral Pathology": "default",
  "Orthodontics": "default",
  "Prosthodontics": "default",
  "Periodontics": "default",
  "Endodontics": "default",
  "Pediatric Dentistry": "default",
  "Oral Surgery": "default",
  "Dental Radiology": "default",
  "Oral Medicine": "default",
  "Cosmetic Dentistry": "default",
  "Implantology": "default",

  // --- Nursing ---
  "Clinical Nursing": "default",
  "Pediatric Nursing": "default",
  "Psychiatric Nursing": "default",
  "Community Health Nursing": "default",
  "Critical Care Nursing": "default",
  "Oncology Nursing": "default",
  "Obstetric Nursing": "default",
  "Geriatric Nursing": "default",
  "Emergency Nursing": "default",
  "Nursing Administration": "default",
  "Nursing Education": "default",

  // --- Pharmacy ---
  "Pharmaceutical Chemistry": "default",
  "Pharmaceutics": "default",
  "Pharmacognosy": "default",
  "Pharmacokinetics": "default",
  "Pharmacodynamics": "default",
  "Clinical Pharmacy": "default",
  "Industrial Pharmacy": "default",
  "Hospital Pharmacy": "default",
  "Toxicology": "default",
  "Drug Development": "default",
  "Biopharmaceutics": "default",
  "Pharmaceutical Biotechnology": "default",
  "Regulatory Affairs": "default",

  // --- Allied Health ---
  "Physiotherapy": "default",
  "Occupational Therapy": "default",
  "Speech Therapy": "default",
  "Radiologic Technology": "default",
  "Medical Laboratory Technology": "default",
  "Optometry": "default",
  "Audiology": "default",
  "Clinical Nutrition": "default",
  "Respiratory Therapy": "default",
  "Emergency Medical Technology": "default",
  "Prosthetics & Orthotics": "default",
  "Rehabilitation Sciences": "default",
};



  // normalize incoming skillName
  let key = String(skillName).trim().toLowerCase();
  key = key.replace(/\s*\(.*\)/g,""); // remove parentheses content
  key = key.replace(/\s*\/\s*/g," / ");
  key = key.replace(/\s+/g," ").trim();

  if(map[key]) return map[key];

  // fallback heuristic: remove dots, slashes; replace non-alnum with hyphen
  let n = key.replace(/\./g,"").replace(/\s+/g,"-").replace(/[^a-z0-9\-]/g,"");
  // special convert ++ and # etc
  n = n.replace(/\+\+/g,"plusplus").replace(/\+/g,"plus").replace(/#/g,"sharp");
  return n || key;
}

function deviconURL(skillName){
  const name = deviconNameFor(skillName);
  // Use original svg if available; many devicon icons follow {name}/{name}-original.svg
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-original.svg`;
}

/* ===========================
   Flatten STEP2_DATA -> unified skillsList
=========================== */
function flattenSkillsFromStep2(){
  const all = [];
  for(const f in STEP2_DATA){
    const subs = STEP2_DATA[f].subs;
    for(const s in subs){
      const arr = subs[s].skills || [];
      arr.forEach(k => all.push(k));
    }
  }
  return [...new Set(all)];
}
const extraFromFields = flattenSkillsFromStep2();

/* base skills kept for backwards compatibility */
const baseSkills = ["HTML","CSS","JavaScript","Python","Node.js","React","SQL","Java","C++"];

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
function renderSelected(){
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
function saveSkills(){
  localStorage.setItem("selectedSkills", JSON.stringify(selectedSkills));
  // alert("Skills saved!");
}
const submitBtn = document.getElementById("submitBtn");
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
  input.value = "";
  setTimeout(()=>{ input.focus(); populateCards(""); }, 0);
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
function populateCards(filter){
  cardsWrap.innerHTML = "";
  const q = (filter || "").trim().toLowerCase();
  visibleCards = [];

  skillsList.forEach(name => {
    if(!q || name.toLowerCase().includes(q)){
      const node = cardNodes[name].cloneNode(true);

      // ensure percent shows current selection percent if exists
      const sel = selectedSkills.find(s => s.name === name);
      const pct = sel ? (sel.percent || "100%") : "100%";
      const badge = node.querySelector('.percent-badge');
      badge.innerHTML = `<span class="pct-text">${pct}</span> <span class="pencil" title="Edit percent">✎</span>`;

      // click to select (skip pencil)
      node.addEventListener('click', (e) => {
        if(e.target.classList.contains('pencil')) return;
        const skill = node.dataset.skill;
        const pctText = node.querySelector('.pct-text').textContent || "100%";
        selectSkillByName(skill, pctText);
      });

      // pencil handler
      const pencil = node.querySelector('.pencil');
      pencil.addEventListener('click', ev=> {
        ev.stopPropagation();
        openPercentEditor(node);
      });

      // hover sets highlight index (sync with keyboard)
      node.addEventListener('mouseenter', ()=> {
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
function openPercentEditor(card){
  const badge = card.querySelector('.percent-badge');
  const current = badge.querySelector('.pct-text') ? badge.querySelector('.pct-text').textContent.replace('%','') : '100';
  badge.innerHTML = `<input class="percent-edit" type="number" min="0" max="100" value="${parseInt(current,10)||100}" style="width:56px;padding:4px;border-radius:6px">`;

  const inputNum = badge.querySelector('.percent-edit');
  inputNum.focus(); inputNum.select();

  function commit(){
    let v = parseInt(inputNum.value,10);
    if(isNaN(v) || v < 0) v = 0;
    if(v > 100) v = 100;
    badge.innerHTML = `<span class="pct-text">${v}%</span> <span class="pencil" title="Edit percent">✎</span>`;
    // rebind pencil
    badge.querySelector('.pencil').addEventListener('click', e=>{
      e.stopPropagation();
      openPercentEditor(card);
    });
    // update selectedSkills if exists
    const skillName = card.dataset.skill;
    const obj = selectedSkills.find(s => s.name === skillName);
    if(obj){ obj.percent = v + "%"; renderSelected(); }
    populateCards(input.value || "");
  }

  inputNum.addEventListener('blur', commit);
  inputNum.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){ inputNum.blur(); e.preventDefault(); }
    if(e.key === 'Escape'){
      badge.innerHTML = `<span class="pct-text">${current}%</span> <span class="pencil" title="Edit percent">✎</span>`;
      badge.querySelector('.pencil').addEventListener('click', ev=>{
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
    visibleCards[highlightIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

/* ===========================
   Keyboard nav for search input
=========================== */
input.addEventListener('keydown', (e) => {
  // If an inline editor is focused, ignore
  const active = document.activeElement;
  if(active && active.classList && (active.classList.contains('percent-edit') || active.classList.contains('pct-input'))) return;

  if(panel.style.display === 'block'){
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

/* ===========================
   Auto-typing placeholder effect (optional)
=========================== */
let autoTyping = true, autoTimer = null, typeIndex = 0, charIndex = 0, forward = true;
function startAutoType(){
  if(autoTimer) clearInterval(autoTimer);
  autoTyping = true; input.placeholder=''; charIndex = 0; forward = true;
  autoTimer = setInterval(()=>{
    const word = skillsList[typeIndex % skillsList.length] || "skills";
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
function stopAutoTypeInstant(){ if(autoTimer) clearInterval(autoTimer); autoTyping=false; setTimeout(()=>{ input.value=''; input.placeholder='Search any skill'; }, 100); }

/* ===========================
   Input focus / click / open/close panel
=========================== */
input.addEventListener('focus', ()=>{ stopAutoTypeInstant(); openPanel(); });
input.addEventListener('click', ()=>{ if(autoTyping) stopAutoTypeInstant(); openPanel(); });
input.addEventListener('input', (e)=> populateCards(e.target.value) );

function openPanel(){
  panel.style.display = 'block';
  panel.setAttribute('aria-hidden','false');
  populateCards(input.value || "");
  highlightIndex = -1;
}
function closePanel(){
  panel.style.display = 'none';
  panel.setAttribute('aria-hidden','true');
  visibleCards = []; highlightIndex = -1;
}

/* click outside closes dropdown */
document.addEventListener('click', (e)=>{
  if(!document.querySelector('.search-wrap').contains(e.target)) closePanel();
});

/* start auto typing */
startAutoType();

/* ===========================
   FIELDS EXPLORER (step-2)
=========================== */
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
renderFieldsRow();

function toggleField(fieldName, cardElement){
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
  subcatGrid.innerHTML = "";
  const subs = STEP2_DATA[fieldName].subs;
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
  step2State.openSubcat = subName;
  const info = STEP2_DATA[fieldName].subs[subName];
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
    badge.innerHTML = `<span class="pct-text"></span><span class="pencil" title="Edit"></span>`;
    card.appendChild(badge);

    // select
    card.addEventListener('click', (e)=>{ if(e.target.classList.contains('pencil')) return; const p = card.querySelector('.pct-text').textContent || "100%"; selectSkillByName(skill, p); });

    // pencil -> edit percent
    badge.querySelector('.pencil').addEventListener('click', (ev)=>{ ev.stopPropagation(); openPercentEditorInCard(card); });

    skillsGrid.appendChild(card);
  });

  subcatContainer.style.display = 'none'; skillsContainer.style.display = 'block'; step2Back.style.display = 'inline-block';
}

step2Back.addEventListener('click', ()=>{
  if(step2State.openSubcat){ renderSubcats(step2State.openField); step2State.openSubcat = null; }
  else if(step2State.openField){ step2State.openField = null; step2State.openSubcat = null; subcatContainer.style.display = 'none'; skillsContainer.style.display = 'none'; step2Back.style.display = 'none'; document.querySelectorAll('.field-card').forEach(c=>c.classList.remove('active')); }
});

/* percent editor in step2 skill cards */
function openPercentEditorInCard(card){
  const badge = card.querySelector('.');
  const current = badge.querySelector('.pct-text').textContent.replace('%','') || '100';
  badge.innerHTML = `<input class="pct-input" type="number" min="0" max="100" value="${parseInt(current,10)||100}" style="width:64px;padding:4px;border-radius:6px">`;
  const inp = badge.querySelector('.pct-input');
  inp.focus(); inp.select();

  function commit(){
    let v = parseInt(inp.value,10); if(isNaN(v)||v<0) v=0; if(v>100) v=100;
    badge.innerHTML = `<span class="pct-text">${v}%</span><span class="pencil" title="Edit">✎</span>`;
    badge.querySelector('.pencil').addEventListener('click', (e)=>{ e.stopPropagation(); openPercentEditorInCard(card); });
    const name = card.querySelector('.skill-name').textContent;
    const obj = selectedSkills.find(x=>x.name === name);
    if(obj){ obj.percent = v + '%'; renderSelected(); }
    populateCards(input.value || "");
  }

  inp.addEventListener('blur', commit);
  inp.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ commit(); } if(e.key === 'Escape'){ badge.innerHTML = `<span class="pct-text">${current}%</span><span class="pencil" title="Edit">✎</span>`; badge.querySelector('.pencil').addEventListener('click', ev=>{ ev.stopPropagation(); openPercentEditorInCard(card); }); } });
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
