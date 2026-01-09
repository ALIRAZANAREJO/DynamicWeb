
const countries = [
  {name:"Afghanistan",code:"+93",flag:"https://flagcdn.com/24x18/af.png"},
  {name:"Albania",code:"+355",flag:"https://flagcdn.com/24x18/al.png"},
  {name:"Algeria",code:"+213",flag:"https://flagcdn.com/24x18/dz.png"},
  {name:"Andorra",code:"+376",flag:"https://flagcdn.com/24x18/ad.png"},
  {name:"Angola",code:"+244",flag:"https://flagcdn.com/24x18/ao.png"},
  {name:"Antigua and Barbuda",code:"+1-268",flag:"https://flagcdn.com/24x18/ag.png"},
  {name:"Argentina",code:"+54",flag:"https://flagcdn.com/24x18/ar.png"},
  {name:"Armenia",code:"+374",flag:"https://flagcdn.com/24x18/am.png"},
  {name:"Australia",code:"+61",flag:"https://flagcdn.com/24x18/au.png"},
  {name:"Austria",code:"+43",flag:"https://flagcdn.com/24x18/at.png"},
  {name:"Azerbaijan",code:"+994",flag:"https://flagcdn.com/24x18/az.png"},
  {name:"Bahamas",code:"+1-242",flag:"https://flagcdn.com/24x18/bs.png"},
  {name:"Bahrain",code:"+973",flag:"https://flagcdn.com/24x18/bh.png"},
  {name:"Bangladesh",code:"+880",flag:"https://flagcdn.com/24x18/bd.png"},
  {name:"Barbados",code:"+1-246",flag:"https://flagcdn.com/24x18/bb.png"},
  {name:"Belarus",code:"+375",flag:"https://flagcdn.com/24x18/by.png"},
  {name:"Belgium",code:"+32",flag:"https://flagcdn.com/24x18/be.png"},
  {name:"Belize",code:"+501",flag:"https://flagcdn.com/24x18/bz.png"},
  {name:"Benin",code:"+229",flag:"https://flagcdn.com/24x18/bj.png"},
  {name:"Bhutan",code:"+975",flag:"https://flagcdn.com/24x18/bt.png"},
  {name:"Bolivia",code:"+591",flag:"https://flagcdn.com/24x18/bo.png"},
  {name:"Bosnia and Herzegovina",code:"+387",flag:"https://flagcdn.com/24x18/ba.png"},
  {name:"Botswana",code:"+267",flag:"https://flagcdn.com/24x18/bw.png"},
  {name:"Brazil",code:"+55",flag:"https://flagcdn.com/24x18/br.png"},
  {name:"Brunei",code:"+673",flag:"https://flagcdn.com/24x18/bn.png"},
  {name:"Bulgaria",code:"+359",flag:"https://flagcdn.com/24x18/bg.png"},
  {name:"Burkina Faso",code:"+226",flag:"https://flagcdn.com/24x18/bf.png"},
  {name:"Burundi",code:"+257",flag:"https://flagcdn.com/24x18/bi.png"},
  {name:"Cambodia",code:"+855",flag:"https://flagcdn.com/24x18/kh.png"},
  {name:"Cameroon",code:"+237",flag:"https://flagcdn.com/24x18/cm.png"},
  {name:"Canada",code:"+1",flag:"https://flagcdn.com/24x18/ca.png"},
  {name:"Cape Verde",code:"+238",flag:"https://flagcdn.com/24x18/cv.png"},
  {name:"Central African Republic",code:"+236",flag:"https://flagcdn.com/24x18/cf.png"},
  {name:"Chad",code:"+235",flag:"https://flagcdn.com/24x18/td.png"},
  {name:"Chile",code:"+56",flag:"https://flagcdn.com/24x18/cl.png"},
  {name:"China",code:"+86",flag:"https://flagcdn.com/24x18/cn.png"},
  {name:"Colombia",code:"+57",flag:"https://flagcdn.com/24x18/co.png"},
  {name:"Comoros",code:"+269",flag:"https://flagcdn.com/24x18/km.png"},
  {name:"Congo (Congo-Brazzaville)",code:"+242",flag:"https://flagcdn.com/24x18/cg.png"},
  {name:"Costa Rica",code:"+506",flag:"https://flagcdn.com/24x18/cr.png"},
  {name:"Croatia",code:"+385",flag:"https://flagcdn.com/24x18/hr.png"},
  {name:"Cuba",code:"+53",flag:"https://flagcdn.com/24x18/cu.png"},
  {name:"Cyprus",code:"+357",flag:"https://flagcdn.com/24x18/cy.png"},
  {name:"Czech Republic",code:"+420",flag:"https://flagcdn.com/24x18/cz.png"},
  {name:"Denmark",code:"+45",flag:"https://flagcdn.com/24x18/dk.png"},
  {name:"Djibouti",code:"+253",flag:"https://flagcdn.com/24x18/dj.png"},
  {name:"Dominica",code:"+1-767",flag:"https://flagcdn.com/24x18/dm.png"},
  {name:"Dominican Republic",code:"+1-809",flag:"https://flagcdn.com/24x18/do.png"},
  {name:"Ecuador",code:"+593",flag:"https://flagcdn.com/24x18/ec.png"},
  {name:"Egypt",code:"+20",flag:"https://flagcdn.com/24x18/eg.png"},
  {name:"El Salvador",code:"+503",flag:"https://flagcdn.com/24/ sv.png"},
  {name:"Equatorial Guinea",code:"+240",flag:"https://flagcdn.com/24x18/gq.png"},
  {name:"Eritrea",code:"+291",flag:"https://flagcdn.com/24x18/er.png"},
  {name:"Estonia",code:"+372",flag:"https://flagcdn.com/24x18/ee.png"},
  {name:"Eswatini",code:"+268",flag:"https://flagcdn.com/24x18/sz.png"},
  {name:"Ethiopia",code:"+251",flag:"https://flagcdn.com/24x18/et.png"},
  {name:"Fiji",code:"+679",flag:"https://flagcdn.com/24x18/fj.png"},
  {name:"Finland",code:"+358",flag:"https://flagcdn.com/24x18/fi.png"},
  {name:"France",code:"+33",flag:"https://flagcdn.com/24x18/fr.png"},
  {name:"Gabon",code:"+241",flag:"https://flagcdn.com/24x18/ga.png"},
  {name:"Gambia",code:"+220",flag:"https://flagcdn.com/24x18/gm.png"},
  {name:"Georgia",code:"+995",flag:"https://flagcdn.com/24x18/ge.png"},
  {name:"Germany",code:"+49",flag:"https://flagcdn.com/24x18/de.png"},
  {name:"Ghana",code:"+233",flag:"https://flagcdn.com/24x18/gh.png"},
  {name:"Greece",code:"+30",flag:"https://flagcdn.com/24x18/gr.png"},
  {name:"Grenada",code:"+1-473",flag:"https://flagcdn.com/24x18/gd.png"},
  {name:"Guatemala",code:"+502",flag:"https://flagcdn.com/24x18/gt.png"},
  {name:"Guinea",code:"+224",flag:"https://flagcdn.com/24x18/gn.png"},
  {name:"Guinea-Bissau",code:"+245",flag:"https://flagcdn.com/24x18/gw.png"},
  {name:"Guyana",code:"+592",flag:"https://flagcdn.com/24x18/gy.png"},
  {name:"Haiti",code:"+509",flag:"https://flagcdn.com/24x18/ht.png"},
  {name:"Honduras",code:"+504",flag:"https://flagcdn.com/24x18/hn.png"},
  {name:"Hungary",code:"+36",flag:"https://flagcdn.com/24x18/hu.png"},
  {name:"Iceland",code:"+354",flag:"https://flagcdn.com/24x18/is.png"},
  {name:"India",code:"+91",flag:"https://flagcdn.com/24x18/in.png"},
  {name:"Indonesia",code:"+62",flag:"https://flagcdn.com/24x18/id.png"},
  {name:"Iran",code:"+98",flag:"https://flagcdn.com/24x18/ir.png"},
  {name:"Iraq",code:"+964",flag:"https://flagcdn.com/24x18/iq.png"},
  {name:"Ireland",code:"+353",flag:"https://flagcdn.com/24x18/ie.png"},
  {name:"Italy",code:"+39",flag:"https://flagcdn.com/24x18/it.png"},
  {name:"Jamaica",code:"+1-876",flag:"https://flagcdn.com/24x18/jm.png"},
  {name:"Japan",code:"+81",flag:"https://flagcdn.com/24x18/jp.png"},
  {name:"Jordan",code:"+962",flag:"https://flagcdn.com/24x18/jo.png"},
  {name:"Kazakhstan",code:"+7",flag:"https://flagcdn.com/24x18/kz.png"},
  {name:"Kenya",code:"+254",flag:"https://flagcdn.com/24x18/ke.png"},
  {name:"Kiribati",code:"+686",flag:"https://flagcdn.com/24x18/ki.png"},
  {name:"Kuwait",code:"+965",flag:"https://flagcdn.com/24x18/kw.png"},
  {name:"Kyrgyzstan",code:"+996",flag:"https://flagcdn.com/24x18/kg.png"},
  {name:"Laos",code:"+856",flag:"https://flagcdn.com/24x18/la.png"},
  {name:"Latvia",code:"+371",flag:"https://flagcdn.com/24x18/lv.png"},
  {name:"Lebanon",code:"+961",flag:"https://flagcdn.com/24x18/lb.png"},
  {name:"Lesotho",code:"+266",flag:"https://flagcdn.com/24x18/ls.png"},
  {name:"Liberia",code:"+231",flag:"https://flagcdn.com/24x18/lr.png"},
  {name:"Libya",code:"+218",flag:"https://flagcdn.com/24x18/ly.png"},
  {name:"Liechtenstein",code:"+423",flag:"https://flagcdn.com/24x18/li.png"},
  {name:"Lithuania",code:"+370",flag:"https://flagcdn.com/24x18/lt.png"},
  {name:"Luxembourg",code:"+352",flag:"https://flagcdn.com/24x18/lu.png"},
  {name:"Madagascar",code:"+261",flag:"https://flagcdn.com/24x18/mg.png"},
  {name:"Malawi",code:"+265",flag:"https://flagcdn.com/24x18/mw.png"},
  {name:"Malaysia",code:"+60",flag:"https://flagcdn.com/24x18/my.png"},
  {name:"Maldives",code:"+960",flag:"https://flagcdn.com/24x18/mv.png"},
  {name:"Mali",code:"+223",flag:"https://flagcdn.com/24x18/ml.png"},
  {name:"Malta",code:"+356",flag:"https://flagcdn.com/24x18/mt.png"},
  {name:"Marshall Islands",code:"+692",flag:"https://flagcdn.com/24x18/mh.png"},
  {name:"Mauritania",code:"+222",flag:"https://flagcdn.com/24x18/mr.png"},
  {name:"Mauritius",code:"+230",flag:"https://flagcdn.com/24x18/mu.png"},
  {name:"Mexico",code:"+52",flag:"https://flagcdn.com/24x18/mx.png"},
  {name:"Micronesia",code:"+691",flag:"https://flagcdn.com/24x18/fm.png"},
  {name:"Moldova",code:"+373",flag:"https://flagcdn.com/24x18/md.png"},
  {name:"Monaco",code:"+377",flag:"https://flagcdn.com/24x18/mc.png"},
  {name:"Mongolia",code:"+976",flag:"https://flagcdn.com/24x18/mn.png"},
  {name:"Montenegro",code:"+382",flag:"https://flagcdn.com/24x18/me.png"},
  {name:"Morocco",code:"+212",flag:"https://flagcdn.com/24x18/ma.png"},
  {name:"Mozambique",code:"+258",flag:"https://flagcdn.com/24x18/mz.png"},
  {name:"Myanmar",code:"+95",flag:"https://flagcdn.com/24x18/mm.png"},
  {name:"Namibia",code:"+264",flag:"https://flagcdn.com/24x18/na.png"},
  {name:"Nauru",code:"+674",flag:"https://flagcdn.com/24x18/nr.png"},
  {name:"Nepal",code:"+977",flag:"https://flagcdn.com/24x18/np.png"},
  {name:"Netherlands",code:"+31",flag:"https://flagcdn.com/24x18/nl.png"},
  {name:"New Zealand",code:"+64",flag:"https://flagcdn.com/24x18/nz.png"},
  {name:"Nicaragua",code:"+505",flag:"https://flagcdn.com/24x18/ni.png"},
  {name:"Niger",code:"+227",flag:"https://flagcdn.com/24x18/ne.png"},
  {name:"Nigeria",code:"+234",flag:"https://flagcdn.com/24x18/ng.png"},
  {name:"North Korea",code:"+850",flag:"https://flagcdn.com/24x18/kp.png"},
  {name:"North Macedonia",code:"+389",flag:"https://flagcdn.com/24x18/mk.png"},
  {name:"Norway",code:"+47",flag:"https://flagcdn.com/24x18/no.png"},
  {name:"Oman",code:"+968",flag:"https://flagcdn.com/24x18/om.png"},
  {name:"Pakistan",code:"+92",flag:"https://flagcdn.com/24x18/pk.png"},
  {name:"Palestine",code:"+970",flag:"https://flagcdn.com/24x18/ps.png"},
  {name:"Palau",code:"+680",flag:"https://flagcdn.com/24x18/pw.png"},
  {name:"Panama",code:"+507",flag:"https://flagcdn.com/24x18/pa.png"},
  {name:"Papua New Guinea",code:"+675",flag:"https://flagcdn.com/24x18/pg.png"},
  {name:"Paraguay",code:"+595",flag:"https://flagcdn.com/24x18/py.png"},
  {name:"Peru",code:"+51",flag:"https://flagcdn.com/24x18/pe.png"},
  {name:"Philippines",code:"+63",flag:"https://flagcdn.com/24x18/ph.png"},
  {name:"Poland",code:"+48",flag:"https://flagcdn.com/24x18/pl.png"},
  {name:"Portugal",code:"+351",flag:"https://flagcdn.com/24x18/pt.png"},
  {name:"Qatar",code:"+974",flag:"https://flagcdn.com/24x18/qa.png"},
  {name:"Romania",code:"+40",flag:"https://flagcdn.com/24x18/ro.png"},
  {name:"Russia",code:"+7",flag:"https://flagcdn.com/24x18/ru.png"},
  {name:"Rwanda",code:"+250",flag:"https://flagcdn.com/24x18/rw.png"},
  {name:"Saint Kitts and Nevis",code:"+1-869",flag:"https://flagcdn.com/24x18/kn.png"},
  {name:"Saint Lucia",code:"+1-758",flag:"https://flagcdn.com/24x18/lc.png"},
  {name:"Saint Vincent and the Grenadines",code:"+1-784",flag:"https://flagcdn.com/24x18/vc.png"},
  {name:"Samoa",code:"+685",flag:"https://flagcdn.com/24x18/ws.png"},
  {name:"San Marino",code:"+378",flag:"https://flagcdn.com/24x18/sm.png"},
  {name:"Sao Tome and Principe",code:"+239",flag:"https://flagcdn.com/24x18/st.png"},
  {name:"Saudi Arabia",code:"+966",flag:"https://flagcdn.com/24x18/sa.png"},
  {name:"Senegal",code:"+221",flag:"https://flagcdn.com/24x18/sn.png"},
  {name:"Serbia",code:"+381",flag:"https://flagcdn.com/24x18/rs.png"},
  {name:"Seychelles",code:"+248",flag:"https://flagcdn.com/24x18/sc.png"},
  {name:"Sierra Leone",code:"+232",flag:"https://flagcdn.com/24x18/sl.png"},
  {name:"Singapore",code:"+65",flag:"https://flagcdn.com/24x18/sg.png"},
  {name:"Slovakia",code:"+421",flag:"https://flagcdn.com/24x18/sk.png"},
  {name:"Slovenia",code:"+386",flag:"https://flagcdn.com/24x18/si.png"},
  {name:"Solomon Islands",code:"+677",flag:"https://flagcdn.com/24x18/sb.png"},
  {name:"Somalia",code:"+252",flag:"https://flagcdn.com/24x18/so.png"},
  {name:"South Africa",code:"+27",flag:"https://flagcdn.com/24x18/za.png"},
  {name:"South Korea",code:"+82",flag:"https://flagcdn.com/24x18/kr.png"},
  {name:"South Sudan",code:"+211",flag:"https://flagcdn.com/24x18/ss.png"},
  {name:"Spain",code:"+34",flag:"https://flagcdn.com/24x18/es.png"},
  {name:"Sri Lanka",code:"+94",flag:"https://flagcdn.com/24x18/lk.png"},
  {name:"Sudan",code:"+249",flag:"https://flagcdn.com/24x18/sd.png"},
  {name:"Suriname",code:"+597",flag:"https://flagcdn.com/24x18/sr.png"},
  {name:"Sweden",code:"+46",flag:"https://flagcdn.com/24x18/se.png"},
  {name:"Switzerland",code:"+41",flag:"https://flagcdn.com/24x18/ch.png"},
  {name:"Syria",code:"+963",flag:"https://flagcdn.com/24x18/sy.png"},
  {name:"Taiwan",code:"+886",flag:"https://flagcdn.com/24x18/tw.png"},
  {name:"Tajikistan",code:"+992",flag:"https://flagcdn.com/24x18/tj.png"},
  {name:"Tanzania",code:"+255",flag:"https://flagcdn.com/24x18/tz.png"},
  {name:"Thailand",code:"+66",flag:"https://flagcdn.com/24x18/th.png"},
  {name:"Timor-Leste",code:"+670",flag:"https://flagcdn.com/24x18/tl.png"},
  {name:"Togo",code:"+228",flag:"https://flagcdn.com/24x18/tg.png"},
  {name:"Tonga",code:"+676",flag:"https://flagcdn.com/24x18/to.png"},
  {name:"Trinidad and Tobago",code:"+1-868",flag:"https://flagcdn.com/24x18/tt.png"},
  {name:"Tunisia",code:"+216",flag:"https://flagcdn.com/24x18/tn.png"},
  {name:"Turkey",code:"+90",flag:"https://flagcdn.com/24x18/tr.png"},
  {name:"Turkmenistan",code:"+993",flag:"https://flagcdn.com/24x18/tm.png"},
  {name:"Tuvalu",code:"+688",flag:"https://flagcdn.com/24x18/tv.png"},
  {name:"Uganda",code:"+256",flag:"https://flagcdn.com/24x18/ug.png"},
  {name:"Ukraine",code:"+380",flag:"https://flagcdn.com/24x18/ua.png"},
  {name:"United Arab Emirates",code:"+971",flag:"https://flagcdn.com/24x18/ae.png"},
  {name:"United Kingdom",code:"+44",flag:"https://flagcdn.com/24x18/gb.png"},
  {name:"United States",code:"+1",flag:"https://flagcdn.com/24x18/us.png"},
  {name:"Uruguay",code:"+598",flag:"https://flagcdn.com/24x18/uy.png"},
  {name:"Uzbekistan",code:"+998",flag:"https://flagcdn.com/24x18/uz.png"},
  {name:"Vanuatu",code:"+678",flag:"https://flagcdn.com/24x18/vu.png"},
  {name:"Vatican City",code:"+379",flag:"https://flagcdn.com/24x18/va.png"},
  {name:"Venezuela",code:"+58",flag:"https://flagcdn.com/24x18/ve.png"},
  {name:"Vietnam",code:"+84",flag:"https://flagcdn.com/24x18/vn.png"},
  {name:"Yemen",code:"+967",flag:"https://flagcdn.com/24x18/ye.png"},
  {name:"Zambia",code:"+260",flag:"https://flagcdn.com/24x18/zm.png"},
  {name:"Zimbabwe",code:"+263",flag:"https://flagcdn.com/24x18/zw.png"}
];


document.querySelectorAll(".country-input-wrapper").forEach(wrapper => {
  const input = wrapper.querySelector("input");
  const selectedCountry = wrapper.querySelector(".selected-country");
  const selectedFlag = wrapper.querySelector("img");
  const selectedCode = wrapper.querySelector("span:first-of-type");
  const dropdown = wrapper.querySelector(".country-dropdown");

  let currentCode = "";
  let dropdownOpen = false;

  // Populate dropdown
  countries.forEach(c => {
    const div = document.createElement("div");
    div.innerHTML = `<img src="${c.flag}" alt="${c.name}" /> ${c.name} (${c.code})`;
    div.addEventListener("click", () => {
      currentCode = c.code;                 // "+92"
      const codeDigits = c.code.replace(/\D/g, ''); // "92"

      selectedFlag.src = c.flag;
      selectedCode.textContent = c.code;

      // show 92- in input
      input.value = codeDigits + "-";

      dropdown.style.display = "none";
      dropdownOpen = false;
      input.focus();
    });
    dropdown.appendChild(div);
  });

  // Toggle dropdown
  selectedCountry.addEventListener("click", () => {
    dropdownOpen = !dropdownOpen;
    dropdown.style.display = dropdownOpen ? "block" : "none";
  });

  // Show dropdown on focus if empty
  input.addEventListener("focus", () => {
    if (!currentCode) {
      dropdown.style.display = "block";
      dropdownOpen = true;
    }
  });

  // Hide dropdown outside
  document.addEventListener("click", e => {
    if (!wrapper.contains(e.target)) {
      dropdown.style.display = "none";
      dropdownOpen = false;
    }
  });

  // keep "92-" fixed and allow only numbers after dash
  input.addEventListener("input", () => {
    if (!currentCode) return;

    const codeDigits = currentCode.replace(/\D/g, ""); // "92"

    // enforce prefix "92-"
    if (!input.value.startsWith(codeDigits + "-")) {
      input.value = codeDigits + "-";
    }

    // allow only numbers after dash
    input.value = input.value.replace(new RegExp(`^${codeDigits}-\\D+`, "g"), "");
    input.value = input.value.replace(/[^0-9-]/g, "");
  });
});
