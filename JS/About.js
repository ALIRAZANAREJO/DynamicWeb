const countrySelect = document.getElementById("Countrybox");
const citySelect = document.getElementById("Citybox");

let citiesData = [];

Papa.parse("/data/world-cities.csv", {
  download: true,
  header: true,
  complete: function(results) {
    citiesData = results.data;

    // Populate countries
    const countries = [...new Set(citiesData.map(c => c.country))].sort();
    countrySelect.innerHTML = `<option value=""></option>`;
    countries.forEach(country => {
      const opt = document.createElement("option");
      opt.value = country;
      opt.textContent = country;
      countrySelect.appendChild(opt);
    });
  }
});

countrySelect.addEventListener("change", function() {
  const selectedCountry = this.value;
  citySelect.innerHTML = `<option value=""></option>`;

  const cities = citiesData
    .filter(c => c.country === selectedCountry)
    .map(c => c.name)
    .sort();

  cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });
});











// const languageSelect = document.getElementById("Paddres");

// languageSelect.addEventListener("change", () => {
//   const selected = Array.from(languageSelect.selectedOptions).map(opt => opt.value);
//   console.log("Selected languages:", selected);
// });

// const languagehobbies = document.getElementById("Qual");

// languageSelect.addEventListener("change", () => {
//   const selected = Array.from(languageSelect.selectedOptions).map(opt => opt.value);
//   console.log("Selected languages:", selected);
// });







