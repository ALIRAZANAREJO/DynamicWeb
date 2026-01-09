// -------------------- EDUCATION RECALL --------------------
const education = data.Education || {};
const eduCards = document.querySelectorAll(".edu-card");

eduCards.forEach(card => {
  const type = card.dataset.form; // school, college, university...
  const edu = education[type] || {};

  const P = type.charAt(0).toUpperCase() + type.slice(1); // school -> School

  // Fill text fields
  const map = {
    name: "Name",
    rollno: "Rollno",
    degree: "Degree",
    gpa: "Gpa",
    startyear: "Startyear",
    endyear: "Endyear"
  };

  for (const field in map) {
    const el = document.getElementById(P + field);
    if (el) el.value = edu[map[field]] || "";
  }

  // ---------- MARKSHEET ----------
  const marksheetInput = document.getElementById(P + "marksheet");
  if (marksheetInput && edu.Marksheet) {
    let marksArr = Array.isArray(edu.Marksheet)
      ? edu.Marksheet
      : Object.values(edu.Marksheet);

    if (marksArr.length > 0) {
      marksheetInput.setAttribute("data-url", marksArr[0]);

      // Remove old preview
      let old = marksheetInput.parentElement.querySelector(".recalled-preview, .recalled-file-link");
      if (old) old.remove();

      // Image or file?
      if (/\.(png|jpe?g|gif|webp)$/i.test(marksArr[0])) {
        const img = document.createElement("img");
        img.src = marksArr[0];
        img.className = "recalled-preview";
        marksheetInput.parentElement.appendChild(img);
      } else {
        const a = document.createElement("a");
        a.href = marksArr[0];
        a.target = "_blank";
        a.textContent = "View Marksheet File";
        a.className = "recalled-file-link";
        marksheetInput.parentElement.appendChild(a);
      }
    }
  }

  // ---------- CERTIFICATE ----------
  const certificateInput = document.getElementById(P + "certificate");
  if (certificateInput && edu.Certificate) {
    let certArr = Array.isArray(edu.Certificate)
      ? edu.Certificate
      : Object.values(edu.Certificate);

    if (certArr.length > 0) {
      certificateInput.setAttribute("data-url", certArr[0]);

      // Remove old preview if exists
      let old = certificateInput.parentElement.querySelector(".recalled-preview, .recalled-file-link");
      if (old) old.remove();

      if (/\.(png|jpe?g|gif|webp)$/i.test(certArr[0])) {
        const img = document.createElement("img");
        img.src = certArr[0];
        img.className = "recalled-preview";
        certificateInput.parentElement.appendChild(img);
      } else {
        const a = document.createElement("a");
        a.href = certArr[0];
        a.target = "_blank";
        a.textContent = "View Certificate File";
        a.className = "recalled-file-link";
        certificateInput.parentElement.appendChild(a);
      }
    }
  }

  // ---------- EXTRA DOCUMENTS ----------
  const extraContainer = card.querySelector(".extra-docs");
  if (extraContainer && Array.isArray(edu.ExtraDocuments)) {
    extraContainer.innerHTML = edu.ExtraDocuments
      .map((doc, i) => `<a href="${doc.url}" target="_blank">Document ${i + 1}</a>`)
      .join("<br>");
  }
});

// ✅ Attach live preview back for new uploads
attachFileChange();
