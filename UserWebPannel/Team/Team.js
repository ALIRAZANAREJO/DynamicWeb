// ------------------- Full Fixed Team JS -------------------
document.addEventListener("DOMContentLoaded", () => {
  const addTeamBtn = document.getElementById("organizationteamed");
  const teamDocsContainer = document.querySelector(".temd-docs");
  let nextTeamIndex = 1;
  const MAX_TEAMS = 15;
  const MAX_DOCS_PER_TEAM = 2;

  if (!teamDocsContainer) {
    console.warn(".temd-docs container not found — dynamic Team rows may not render.");
  }

  // ---------- Add Dynamic Team Row ----------
  if (addTeamBtn) {
    addTeamBtn.addEventListener("click", () => {
      const existing = document.querySelectorAll('.tem-row-wrapper[data-tem-index]');
      if (existing.length >= MAX_TEAMS) {
        alert("You can only add up to 15 team members.");
        return;
      }

      let candidate = nextTeamIndex;
      while (document.querySelector(`.tem-row-wrapper[data-tem-index="${candidate}"]`)) {
        candidate++;
      }
      nextTeamIndex = candidate + 1;

      if (existing.length + 1 === 5) {
        alert(
          "You have added 5 team members. These will show first on your CV.\n" +
          "You can still add up to 15 total."
        );
      }

      const html = createTeamHTML(candidate);
      if (teamDocsContainer) teamDocsContainer.insertAdjacentHTML("beforeend", html);
      else document.body.insertAdjacentHTML("beforeend", html);
    });
  }

  // ---------- Team HTML Template ----------
  function createTeamHTML(teamIndex) {
    return `
      <div class="tem-row-wrapper" data-tem-index="${teamIndex}">
        <div class="tem-row">
          <div class="tem-group">
            <input type="text" id="Organizationtemname_${teamIndex}" class="tem-input" placeholder=" " required />
            <label class="tem-label" for="Organizationtemname_${teamIndex}">Teamate Name</label>
          </div>

          <div class="tem-group">
            <input type="text" id="Organizationtemproff_${teamIndex}" class="tem-input" placeholder=" " required />
            <label class="tem-label" for="Organizationtemproff_${teamIndex}">Profession</label>
          </div>

          <div class="tem-group">
            <input type="text" id="Organizationtemperagraph02_${teamIndex}" class="tem-input" placeholder=" " required />
            <label class="tem-label" for="Organizationtemperagraph02_${teamIndex}">About Peragraph</label>
          </div>

          <div class="tem-group">
            <input type="url" id="Organizationfacebookurl_${teamIndex}" class="tem-input" placeholder=" " required />
            <label class="tem-label" for="Organizationfacebookurl_${teamIndex}">Facebook</label>
          </div>

          <div class="tem-group">
            <input type="url" id="Organizationlinkedurl_${teamIndex}" class="tem-input" placeholder=" " required />
            <label class="tem-label" for="Organizationlinkedurl_${teamIndex}">LinkedIn</label>
          </div>

          <div class="tem-group">
            <input type="url" id="Organizationtwitterurl_${teamIndex}" class="tem-input" placeholder=" " required />
            <label class="tem-label" for="Organizationtwitterurl_${teamIndex}">Twitter</label>
          </div>

          <div class="tem-group file-group">
            <input type="file" id="Organizationtemimg_${teamIndex}" class="tem-input" required />
            <label class="tem-label" for="Organizationtemimg_${teamIndex}">Profile Image</label>
          </div>

          <div class="tammed-docs"></div>
          <button type="button" class="temmes-doc" data-tem="${teamIndex}">+ Add New Documents</button>
          <button type="button" class="remove-team">🗑️ Remove Teamate</button>
        </div>
      </div>
    `;
  }

  // ---------- Extra Document Template ----------
  function createTeamDocHTML(teamIndex, docIndex) {
    return `
      <div class="tem-row">
        <div class="tem-group">
          <input type="text" id="teamdocname_${teamIndex}_${docIndex}" class="tem-input" placeholder=" " required>
          <label class="tem-label" for="teamdocname_${teamIndex}_${docIndex}">Document Name</label>
        </div>
        <div class="tem-group file-group">
          <input type="file" id="teamdocpdf_${teamIndex}_${docIndex}" class="tem-input" required>
          <label class="tem-label" for="teamdocpdf_${teamIndex}_${docIndex}">Choose Img Or PDF</label>
        </div>
        <button type="button" class="remove-doc">🗑️ Remove</button>
      </div>
    `;
  }

  // ---------- Event Delegation ----------
  document.addEventListener("click", (e) => {
    // Add Extra Documents
    if (e.target.classList.contains("temmes-doc")) {
      const wrapper = e.target.closest(".tem-row-wrapper");
      if (!wrapper) return;

      const teamIndex = wrapper.dataset.temIndex;
      const docsContainer = wrapper.querySelector(".tammed-docs");
      if (!docsContainer) return;

      const docCount = docsContainer.querySelectorAll(".tem-row").length;
      if (docCount >= MAX_DOCS_PER_TEAM) {
        alert("You can only add up to 2 documents per team member.");
        return;
      }

      const docIndex = docCount + 1;
      docsContainer.insertAdjacentHTML("beforeend", createTeamDocHTML(teamIndex, docIndex));
      return;
    }

    // Remove Team
    if (e.target.classList.contains("remove-team")) {
      const wrapper = e.target.closest(".tem-row-wrapper");
      if (wrapper) wrapper.remove();
      return;
    }

    // Remove Document
    if (e.target.classList.contains("remove-doc")) {
      const docRow = e.target.closest(".tem-row");
      if (docRow) docRow.remove();
      return;
    }
  });
});

// ---------- collectTeams Function ----------
async function collectTeams(cnicValue) {
  const wrappers = document.querySelectorAll(".tem-row-wrapper");
  const results = [];

  for (const wrapper of wrappers) {
    const teamIndex = wrapper.dataset.temIndex || "0";
    const get = (id) => wrapper.querySelector(`#${id}`)?.value || "";

    const teamateName = get(`Organizationtemname_${teamIndex}`);
    const teamateProfession = get(`Organizationtemproff_${teamIndex}`);
    const teamateAbout = get(`Organizationtemperagraph02_${teamIndex}`);
    const facebook = get(`Organizationfacebookurl_${teamIndex}`);
    const linkedin = get(`Organizationlinkedurl_${teamIndex}`);
    const twitter = get(`Organizationtwitterurl_${teamIndex}`);

    // Upload Profile Image
    let profileImgUrl = "";
    const imgEl = wrapper.querySelector(`#Organizationtemimg_${teamIndex}`);
    if (imgEl && imgEl.files[0]) {
      try {
        const file = imgEl.files[0];
        const path = `teamed/${cnicValue}/${teamIndex}/profile/${Date.now()}_${file.name}`;
        const refFile = storageRef(storage, path);
        const snap = await uploadBytes(refFile, file);
        profileImgUrl = await getDownloadURL(snap.ref);
      } catch (err) {
        console.warn("Profile upload failed for", teamIndex, err);
      }
    }

    // Collect Extra Docs
    const documents = [];
    const docNameInputs = wrapper.querySelectorAll(`[id^="teamdocname_${teamIndex}_"]`);
    for (const nameInput of docNameInputs) {
      const suffix = nameInput.id.split("_").pop();
      const fileInput = wrapper.querySelector(`#teamdocpdf_${teamIndex}_${suffix}`);
      let docUrl = "";
      if (fileInput && fileInput.files[0]) {
        try {
          const file = fileInput.files[0];
          const path = `teamed/${cnicValue}/${teamIndex}/docs/${Date.now()}_${file.name}`;
          const refFile = storageRef(storage, path);
          const snap = await uploadBytes(refFile, file);
          docUrl = await getDownloadURL(snap.ref);
        } catch (err) {
          console.warn("Doc upload failed for", teamIndex, err);
        }
      }
      documents.push({ name: nameInput.value || "", url: docUrl });
    }

    results.push({
      teamIndex,
      teamateName,
      teamateProfession,
      teamateAbout,
      facebook,
      linkedin,
      twitter,
      profileImgUrl,
      documents
    });
  }

  results.sort((a, b) => parseInt(a.teamIndex) - parseInt(b.teamIndex));
  return results;
}
