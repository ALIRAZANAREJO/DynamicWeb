const input = document.getElementById("Qual");
const wrapper = document.getElementById("hobbyWrapper");
const dropdown = document.getElementById("hobbyDropdown");

let selectedHobbies = [];
let filteredHobbies = [];
let highlightedIndex = -1;

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

// Update input with selected hobbies
function updateInputValue() {
  input.value = selectedHobbies.join(", ");
}

// Render tags
function renderTags() {
  wrapper.querySelectorAll('.hobby-tag').forEach(t => t.remove());

  selectedHobbies.forEach(hobby => {
    const tag = document.createElement("div");
    tag.className = "hobby-tag";
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
  highlightedIndex = -1;
}

// Remove hobby
function removeHobby(hobby) {
  selectedHobbies = selectedHobbies.filter(h => h !== hobby);
  renderTags();
}

// Render dropdown with highlight
function renderDropdown() {
  dropdown.innerHTML = "";
  filteredHobbies.forEach((hobby, index) => {
    const option = document.createElement("div");
    option.textContent = hobby;
    if (index === highlightedIndex) {
      option.classList.add("highlighted");
    }
    option.addEventListener("click", () => addHobby(hobby));
    dropdown.appendChild(option);
  });
  dropdown.style.display = filteredHobbies.length ? "block" : "none";
}

// Handle input typing
input.addEventListener("input", () => {
  const value = input.value.toLowerCase();
  highlightedIndex = -1;

  if (!value) {
    dropdown.style.display = "none";
    filteredHobbies = [];
    return;
  }

  filteredHobbies = hobbies.filter(h => h.toLowerCase().includes(value));
  renderDropdown();
});

// Keyboard navigation
input.addEventListener("keydown", (e) => {
  if (!filteredHobbies.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    highlightedIndex = (highlightedIndex + 1) % filteredHobbies.length;
    renderDropdown();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    highlightedIndex = (highlightedIndex - 1 + filteredHobbies.length) % filteredHobbies.length;
    renderDropdown();
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (highlightedIndex >= 0) {
      addHobby(filteredHobbies[highlightedIndex]);
    } else {
      addHobby(filteredHobbies[0]);
    }
  }
});

// Close dropdown when clicking outside
document.addEventListener("click", function(e) {
  if (!wrapper.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
    highlightedIndex = -1;
  }
});
