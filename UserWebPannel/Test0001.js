

// ----- Self Video Update inside updateData() -----
async function updateData() {
  const cnicValue = cnic.value?.trim();
  if (!cnicValue) return alert("Please enter CNIC before updating.");

  try {
    // 1) Personal
    const personalData = {
      Name: nameInput.value?.trim() || "",
      Fname: fname.value?.trim() || "",
      Dob: dob.value?.trim() || "",
      Phone: phone.value?.trim() || "",
      Caddres: caddres.value?.trim() || "",
      Paddres: paddres.value?.trim() || "",
      Qual: qual.value?.trim() || "",
      Lisnt: lisnt.value?.trim() || "",
      Rarmy: rarmy.value?.trim() || "",
      Citybox: citybox.value?.trim() || "",
      Countrybox: countrybox.value?.trim() || "",
      Resumeprofession: resumeprofession.value?.trim() || "",
      Aboutpera: aboutpera.value?.trim() || "",
      Busname: busName.value?.trim() || "",
      BusNumber: busNumber.value?.trim() || "",
      Busemail: busEmail.value?.trim() || "",
      Busaddress: busAddress.value?.trim() || "",
      Busfacebooks: busFacebook.value?.trim() || "",
      Instagram: busInstagram.value?.trim() || "",
      Buslinkedin: busLinkedIn.value?.trim() || "",
      Twitter: busTwitter.value?.trim() || "",
      Github: busGithub.value?.trim() || "",
      Youtube: busYoutube.value?.trim() || "",    
      updatedAt: new Date().toISOString(),
    };

    // --- Handle Self Video Upload ---
    const selfVideoInput = document.getElementById("selfVideoUrl");
    if (selfVideoInput?.files?.[0]) {
      const file = selfVideoInput.files[0];
      const maxSize = 200 * 1024 * 1024; // 200MB limit
      if (file.size > maxSize) {
        alert("Video must be under 200MB!");
      } else {
        const videoStorageRef = storageRef(
          storage,
          `resContainer9/${cnicValue}/Personal/selfVideo_${Date.now()}_${file.name}`
        );
        const snapshot = await uploadBytes(videoStorageRef, file);
        const videoUrl = await getDownloadURL(snapshot.ref);

        personalData.selfVideoUrl = videoUrl;

        // Update preview immediately
        const videoPreviewContainer = document.querySelector("#selfVideoPreview");
        if (videoPreviewContainer) {
          videoPreviewContainer.innerHTML = "";
          const vid = document.createElement("video");
          vid.src = videoUrl;
          vid.className = "video-preview-box";
          vid.controls = true;
          videoPreviewContainer.appendChild(vid);
        }

        console.log("🎥 Self Video updated and preview refreshed:", videoUrl);
      }
    } else if (personalData.selfVideoUrl) {
      console.log("⚠ No new video selected, keeping existing:", personalData.selfVideoUrl);
    }

    // --- Handle Profile Image ---
    if (imageUpload?.files?.[0]) {
      personalData.ImageUrl = await uploadFile(
        imageUpload.files[0],
        `resContainer9/${cnicValue}/Personal/profile_${Date.now()}_${imageUpload.files[0].name}`
      );
    }

    await updateSectionData(cnicValue, "Personal", personalData);

    // 2) Other sections remain untouched
    const educationData = await collectEducationData(cnicValue);
    await updateSectionData(cnicValue, "Education", educationData);

    const experienceArr = await collectExperienceData(cnicValue);
    await updateSectionData(cnicValue, "Experience", experienceArr);

    const serviceArr = await collectServiceData(cnicValue);
    await updateSectionData(cnicValue, "Service", serviceArr);

    const projectArr = await collectProjectData(cnicValue);
    await updateSectionData(cnicValue, "Project", projectArr);

    const teamArr = await collectTeamData(cnicValue);
    await updateSectionData(cnicValue, "Team", teamArr);

    await updateJobReferenceData(cnicValue);

    // --- Skills update ---
    const skillsRef = ref(db, `resContainer9/${cnicValue}/Skills`);
    const existingSnap = await get(skillsRef);
    const existingSkills = existingSnap.exists() ? existingSnap.val() : {};

    const newSkills = {};
    selectedSkills.forEach(s => {
      if (s.name) newSkills[s.name] = { name: s.name, percent: s.percent || "100%" };
    });

    for (let key in existingSkills) {
      if (!newSkills[key]) {
        await remove(ref(db, `resContainer9/${cnicValue}/Skills/${key}`));
      }
    }

    for (let key in newSkills) {
      await update(ref(db, `resContainer9/${cnicValue}/Skills/${key}`), newSkills[key]);
    }

    console.log("✅ Updated skills:", newSkills);

    // --- Professionality update remains untouched ---
    const professionEl = document.getElementById("professionInput");
    const currentTags = professionEl.value
      .split(",")
      .map(p => p.trim())
      .filter(Boolean);

    const existingProfSnap = await get(ref(db, `resContainer9/${cnicValue}/Professionality`));
    const existingData = existingProfSnap.exists() ? existingProfSnap.val() : {};

    let existingProfArr = [];
    if (existingData.profession) {
      existingProfArr = existingData.profession.split(",").map(p => p.trim());
    }

    const mergedProfArr = Array.from(new Set([...existingProfArr, ...currentTags]));

    const profData = {
      ...existingData,
      profession: mergedProfArr.join(", "),
      Years: maybeGetById("Years")?.value || existingData.Years || "",
      aboutHeadline: maybeGetById("aboutHeadline")?.value || existingData.aboutHeadline || "",
      aboutParagraph: maybeGetById("aboutParagraph")?.value || existingData.aboutParagraph || "",
      aboutPara2: maybeGetById("aboutPara2")?.value || existingData.aboutPara2 || "",
      aboutPara3: maybeGetById("aboutPara3")?.value || existingData.aboutPara3 || "",
      happyClients: maybeGetById("happyClients")?.value || existingData.happyClients || "",
      projectsCompleted: maybeGetById("projectsCompleted")?.value || existingData.projectsCompleted || "",
      updatedAt: new Date().toISOString()
    };

    const frontFile = document.getElementById("CnicFrontUpload")?.files?.[0];
    const backFile = document.getElementById("CnicBackUpload")?.files?.[0];
    const profileFile = document.getElementById("ProfilePhotoUpload")?.files?.[0];

    profData.CnicFront = frontFile
      ? await uploadFile(frontFile, `resContainer9/${cnicValue}/Professionality/CnicFront_${Date.now()}_${frontFile.name}`)
      : (existingData.CnicFront || "");

    profData.CnicBack = backFile
      ? await uploadFile(backFile, `resContainer9/${cnicValue}/Professionality/CnicBack_${Date.now()}_${backFile.name}`)
      : (existingData.CnicBack || "");

    profData.ProfilePhoto = profileFile
      ? await uploadFile(profileFile, `resContainer9/${cnicValue}/Professionality/ProfilePhoto_${Date.now()}_${profileFile.name}`)
      : (existingData.ProfilePhoto || "");

    await updateSectionData(cnicValue, "Professionality", profData);

    console.log("✅ Updated profession:", mergedProfArr.join(", "));
    alert("✅ All sections updated successfully.");
    try { fetchAndDisplayCards(); } catch (e) { /* optional UI refresh */ }

  } catch (err) {
    console.error("❌ Update failed:", err);
    alert("Update failed: " + (err.message || err));
  }
}

document.getElementById("updateBtn")?.addEventListener("click", updateData);