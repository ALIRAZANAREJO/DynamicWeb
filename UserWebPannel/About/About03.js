const input = document.getElementById("Qual");
const wrapper = document.getElementById("multiLangWrapper");
const dropdown = document.getElementById("dropdown");

let selectedHobbies = [];
const hobbies = [
  "Reading", "Writing", "Painting", "Sketching", "Photography", "Traveling", 
  "Hiking", "Cycling", "Swimming", "Running", "Yoga", "Meditation", "Gardening", 
  "Cooking", "Baking", "Music Listening", "Singing", "Dancing", "Playing Guitar", 
  "Playing Piano", "Playing Violin", "Learning Languages", "Calligraphy", "Origami", 
  "Knitting", "Crocheting", "Fishing", "Bird Watching", "Camping", "Rock Climbing", 
  "Surfing", "Skiing", "Snowboarding", "Martial Arts", "Chess", "Board Games", 
  "Video Gaming", "Writing Poetry", "Blogging", "Vlogging", "Podcasting", 
  "Volunteering", "DIY Crafts", "Jewelry Making", "Pottery", "Woodworking", 
  "Graphic Design", "Animation", "Digital Art", "Astronomy", "Star Gazing", 
  "Magic Tricks", "Learning Programming", "Robotics", "Electronics", "Puzzle Solving", 
  "Card Games", "Collecting Coins", "Collecting Stamps", "Antique Collection", 
  "Model Building", "Travel Blogging", "Fashion Designing", "Interior Designing", 
  "Sculpting", "Filmmaking", "Acting", "Improv Comedy", "Stand-Up Comedy", 
  "Creative Writing", "Storytelling", "Public Speaking", "Debating", 
  "Bird Photography", "Wildlife Photography", "Carpentry", "Home Brewing", 
  "Mixology", "Fitness Training", "Weightlifting", "Pilates", "Parkour", 
  "Motorcycling", "Driving", "Kayaking", "Canoeing", "Sailing", "Skateboarding", 
  "Surfboard Riding", "Learning History", "Learning Culture", "Meditation Retreats", 
  "Environmental Activism", "Sustainability Projects", "Beach Cleanup", 
  "Animal Care", "Pet Training", "Aquarium Keeping", "Chess Strategy", "Puzzle Games", 
  "Escape Rooms", "Board Game Design", "Learning AI & ML", "Stock Market Investing", 
  "Cryptocurrency Trading", "Podcast Hosting", "Music Production", "DJing"
];

// Update hidden input value
function updateInputValue() {
  input.value = selectedHobbies.join(", ");
}

// Render tags inside wrapper before input
function renderTags() {
  wrapper.querySelectorAll('.tag').forEach(t => t.remove());

  selectedHobbies.forEach(hobby => {
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.textContent = hobby;

    const removeBtn = document.createElement("span");
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", () => removeHobby(hobby));
    tag.appendChild(removeBtn);

    wrapper.insertBefore(tag, input);
  });

  updateInputValue();
}

// Add hobby
function addHobby(hobby) {
  if (!selectedHobbies.includes(hobby)) {
    selectedHobbies.push(hobby);
    renderTags();
  }
  input.value = "";
  dropdown.style.display = "none";
}

// Remove hobby
function removeHobby(hobby) {
  selectedHobbies = selectedHobbies.filter(h => h !== hobby);
  renderTags();
}

// Handle search input
input.addEventListener("input", () => {
  const value = input.value.toLowerCase();
  dropdown.innerHTML = "";

  if (!value) {
    dropdown.style.display = "none";
    return;
  }

  const filtered = hobbies.filter(h => h.toLowerCase().includes(value));
  filtered.forEach(h => {
    const option = document.createElement("div");
    option.textContent = h;
    option.addEventListener("click", () => addHobby(h));
    dropdown.appendChild(option);
  });

  dropdown.style.display = filtered.length ? "block" : "none";
});

// Handle Enter key
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && dropdown.firstChild) {
    e.preventDefault();
    addHobby(dropdown.firstChild.textContent);
  }
});
