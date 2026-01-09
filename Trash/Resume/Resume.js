document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('resume-form');
  const previewContent = document.querySelector('.preview-content');
  const downloadBtn = document.querySelector('.download-btn');

  // Load data from local storage

  // Education section
  const educationContainer = document.querySelector('.education-container');
  const addEducationBtn = document.querySelector('.add-education');

  addEducationBtn.addEventListener('click', () => {
    addEducationItem(educationContainer);
  });

  educationContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-education')) {
      removeEducationItem(event.target.closest('.education-item'));
    }
  });

  // Update preview
  updatePreview();

  // Add event listeners
  form.addEventListener('input', updatePreview);
  downloadBtn.addEventListener('click', downloadResume);

  // Employment section
  const employmentContainer = document.querySelector('.employment-container');
  const addEmploymentBtn = document.querySelector('.add-employment');

  addEmploymentBtn.addEventListener('click', () => {
    addEmploymentItem(employmentContainer);
  });

  employmentContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-employment')) {
      removeEmploymentItem(event.target.closest('.employment-item'));
    }
  });

  // Skills section
  const skillsContainer = document.querySelector('.skills-container');
  const addSkillBtn = document.querySelector('.add-skill');

  addSkillBtn.addEventListener('click', () => {
    addSkillItem(skillsContainer);
  });

  skillsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-skill')) {
      removeSkillItem(event.target.closest('.skills-item'));
    }
  });

  // Languages section
  const languagesContainer = document.querySelector('.languages-container');
  const addLanguageBtn = document.querySelector('.add-language');

  addLanguageBtn.addEventListener('click', () => {
    addLanguageItem(languagesContainer);
  });

  languagesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-language')) {
      removeLanguageItem(event.target.closest('.languages-item'));
    }
  });

  // Hobbies section
  const hobbiesContainer = document.querySelector('.hobbies-container');
  const addHobbyBtn = document.querySelector('.add-hobby');

  addHobbyBtn.addEventListener('click', () => {
    addHobbyItem(hobbiesContainer);
  });

  hobbiesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-hobby')) {
      removeHobbyItem(event.target.closest('.hobbies-item'));
    }
  });

  // Certificates section
  const certificatesContainer = document.querySelector('.certificates-container');
  const addCertificateBtn = document.querySelector('.add-certificate');

  addCertificateBtn.addEventListener('click', () => {
    addCertificateItem(certificatesContainer);
  });

  certificatesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-certificate')) {
      removeCertificateItem(event.target.closest('.certificates-item'));
    }
  });

  // Custom section
  const customSectionContainer = document.querySelector('.custom-section-container');
  const addCustomSectionBtn = document.querySelector('.add-custom-section');

  addCustomSectionBtn.addEventListener('click', () => {
    addCustomSectionItem(customSectionContainer);
  });

  customSectionContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-custom-section')) {
      removeCustomSectionItem(event.target.closest('.custom-section-item'));
    }
  });
  loadDataFromLocalStorage();

  // Helper functions
  function loadDataFromLocalStorage() {
    // Load data from local storage and populate the form
    const savedData = JSON.parse(localStorage.getItem('resumeData'));
    if (savedData) {
      // Populate the form fields with the saved data
      document.getElementById('name').value = savedData.name;
      document.getElementById('email').value = savedData.email;
      document.getElementById('phone').value = savedData.phone;

      // Populate the education section
      savedData.education.forEach((item, index) => {
        if (index > 0) {
          addEducationItem(educationContainer);
        }
        const educationItems = educationContainer.querySelectorAll('.education-item');
        educationItems[index].querySelector('#school').value = item.school;
        educationItems[index].querySelector('#degree').value = item.degree;
        educationItems[index].querySelector('#graduation-year').value = item.graduationYear;
      });

      // Populate the employment section
      savedData.employment.forEach((item, index) => {
        if (index > 0) {
          addEmploymentItem(employmentContainer);
        }
        const employmentItems = employmentContainer.querySelectorAll('.employment-item');
        employmentItems[index].querySelector('#job-title').value = item.jobTitle;
        employmentItems[index].querySelector('#employer').value = item.employer;
        employmentItems[index].querySelector('#start-date').value = item.startDate;
        employmentItems[index].querySelector('#end-date').value = item.endDate;
      });

      // Populate the skills section
      savedData.skills.forEach((item, index) => {
        if (index > 0) {
          addSkillItem(skillsContainer);
        }
        const skillItems = skillsContainer.querySelectorAll('.skills-item');
        skillItems[index].querySelector('#skill').value = item.skill;
        skillItems[index].querySelector('#skill-level').value = item.level;
      });

      // Populate the languages section
      savedData.languages.forEach((item, index) => {
        if (index > 0) {
          addLanguageItem(languagesContainer);
        }
        const languageItems = languagesContainer.querySelectorAll('.languages-item');
        languageItems[index].querySelector('#language').value = item.language;
        languageItems[index].querySelector('#language-level').value = item.level;
      });

      // Populate the hobbies section
      savedData.hobbies.forEach((item, index) => {
        if (index > 0) {
          addHobbyItem(hobbiesContainer);
        }
        const hobbyItems = hobbiesContainer.querySelectorAll('.hobbies-item');
        hobbyItems[index].querySelector('#hobby').value = item.hobby;
      });

      // Populate the certificates section
      savedData.certificates.forEach((item, index) => {
        if (index > 0) {
          addCertificateItem(certificatesContainer);
        }
        const certificateItems = certificatesContainer.querySelectorAll('.certificates-item');
        certificateItems[index].querySelector('#certificate').value = item.certificate;
        certificateItems[index].querySelector('#certificate-year').value = item.year;
      });

      // Populate the custom section
      savedData.customSections.forEach((item, index) => {
        if (index > 0) {
          addCustomSectionItem(customSectionContainer);
        }
        const customSectionItems = customSectionContainer.querySelectorAll('.custom-section-item');
        customSectionItems[index].querySelector('#custom-title').value = item.title;
        customSectionItems[index].querySelector('#custom-content').value = item.content;
      });
    }
  }

  function updatePreview() {
    // Update the preview content based on the form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    let previewHtml = `
      <h2>Personal Details</h2>
      <p>Name: ${name}</p>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
    `;

    // Add education section
    const educationItems = document.querySelectorAll('.education-item');
    if (educationItems.length > 0) {
      previewHtml += `
        <h2>Education</h2>
        <ul>
      `;
      educationItems.forEach((item) => {
        const school = item.querySelector('#school').value;
        const degree = item.querySelector('#degree').value;
        const graduationYear = item.querySelector('#graduation-year').value;
        previewHtml += `
          <li>
            <strong>${school}</strong> - ${degree}, ${graduationYear}
          </li>
        `;
      });
      previewHtml += `
        </ul>
      `;
    }

    // Add employment section
    const employmentItems = document.querySelectorAll('.employment-item');
    if (employmentItems.length > 0) {
      previewHtml += `
        <h2>Employment</h2>
        <ul>
      `;
      employmentItems.forEach((item) => {
        const jobTitle = item.querySelector('#job-title').value;
        const employer = item.querySelector('#employer').value;
        const startDate = item.querySelector('#start-date').value;
        const endDate = item.querySelector('#end-date').value;
        previewHtml += `
          <li>
            <strong>${jobTitle}</strong> at ${employer}, ${startDate} - ${endDate}
          </li>
        `;
      });
      previewHtml += `
        </ul>
      `;
    }

    // Add skills section
    const skillItems = document.querySelectorAll('.skills-item');
    if (skillItems.length > 0) {
      previewHtml += `
        <h2>Skills</h2>
        <ul>
      `;
      skillItems.forEach((item) => {
        const skill = item.querySelector('#skill').value;
        const level = item.querySelector('#skill-level').value;
        previewHtml += `
          <li>
            ${skill} - ${level}
          </li>
        `;
      });
      previewHtml += `
        </ul>
      `;
    }

    // Add languages section
    const languageItems = document.querySelectorAll('.languages-item');
    if (languageItems.length > 0) {
      previewHtml += `
        <h2>Languages</h2>
        <ul>
      `;
      languageItems.forEach((item) => {
        const language = item.querySelector('#language').value;
        const level = item.querySelector('#language-level').value;
        previewHtml += `
          <li>
            ${language} - ${level}
          </li>
        `;
      });
      previewHtml += `
        </ul>
      `;
    }

    // Add hobbies section
    const hobbyItems = document.querySelectorAll('.hobbies-item');
    if (hobbyItems.length > 0) {
      previewHtml += `
        <h2>Hobbies</h2>
        <ul>
      `;
      hobbyItems.forEach((item) => {
        const hobby = item.querySelector('#hobby').value;
        previewHtml += `
          <li>
            ${hobby}
          </li>
        `;
      });
      previewHtml += `
        </ul>
      `;
    }

    // Add certificates section
    const certificateItems = document.querySelectorAll('.certificates-item');
    if (certificateItems.length > 0) {
      previewHtml += `
        <h2>Certificates</h2>
        <ul>
      `;
      certificateItems.forEach((item) => {
        const certificate = item.querySelector('#certificate').value;
        const year = item.querySelector('#certificate-year').value;
        previewHtml += `
          <li>
            ${certificate} - ${year}
          </li>
        `;
      });
      previewHtml += `
        </ul>
      `;
    }

    // Add custom section
    const customSectionItems = document.querySelectorAll('.custom-section-item');
    if (customSectionItems.length > 0) {
      customSectionItems.forEach((item) => {
        const title = item.querySelector('#custom-title').value;
        const content = item.querySelector('#custom-content').value;
        previewHtml += `
          <h2>${title}</h2>
          <p>${content}</p>
        `;
      });
    }

    previewContent.innerHTML = previewHtml;

    // Save the form data to local storage
    saveDataToLocalStorage();
  }

  function saveDataToLocalStorage() {
    const resumeData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      education: Array.from(document.querySelectorAll('.education-item')).map((item) => ({
        school: item.querySelector('#school').value,
        degree: item.querySelector('#degree').value,
        graduationYear: item.querySelector('#graduation-year').value,
      })),
      employment: Array.from(document.querySelectorAll('.employment-item')).map((item) => ({
        jobTitle: item.querySelector('#job-title').value,
        employer: item.querySelector('#employer').value,
        startDate: item.querySelector('#start-date').value,
        endDate: item.querySelector('#end-date').value,
      })),
      skills: Array.from(document.querySelectorAll('.skills-item')).map((item) => ({
        skill: item.querySelector('#skill').value,
        level: item.querySelector('#skill-level').value,
      })),
      languages: Array.from(document.querySelectorAll('.languages-item')).map((item) => ({
        language: item.querySelector('#language').value,
        level: item.querySelector('#language-level').value,
      })),
      hobbies: Array.from(document.querySelectorAll('.hobbies-item')).map((item) => ({
        hobby: item.querySelector('#hobby').value,
      })),
      certificates: Array.from(document.querySelectorAll('.certificates-item')).map((item) => ({
        certificate: item.querySelector('#certificate').value,
        year: item.querySelector('#certificate-year').value,
      })),
      customSections: Array.from(document.querySelectorAll('.custom-section-item')).map((item) => ({
        title: item.querySelector('#custom-title').value,
        content: item.querySelector('#custom-content').value,
      })),
    };

    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }

  function downloadResume() {
    // Generate and download the resume in PDF format
    const doc = new jsPDF();

    // Add the preview content to the PDF
    const previewHtml = previewContent.innerHTML;
    doc.setFontSize(12);
    doc.html(previewHtml, {
      callback: function (doc) {
        doc.save('resume.pdf');
      },
    });
}


  function addEducationItem(container) {
    const newItem = document.createElement('div');
    newItem.classList.add('education-item');
    newItem.innerHTML = `
      <div class="form-group">
        <label for="school">School</label>
        <input type="text" id="school" name="school[]" required>
      </div>
      <div class="form-group">
        <label for="degree">Degree</label>
        <input type="text" id="degree" name="degree[]" required>
      </div>
      <div class="form-group">
        <label for="graduation-year">Graduation Year</label>
        <input type="number" id="graduation-year" name="graduation-year[]" required>
      </div>
      <button type="button" class="remove-education"><i class="fas fa-minus"></i></button>
    `;
    container.appendChild(newItem);
  }

  function removeEducationItem(item) {
    item.remove();
    updatePreview();
  }

  function addEmploymentItem(container) {
    const newItem = document.createElement('div');
    newItem.classList.add('employment-item');
    newItem.innerHTML = `
      <div class="form-group">
        <label for="job-title">Job Title</label>
        <input type="text" id="job-title" name="job-title[]" required>
      </div>
      <div class="form-group">
        <label for="employer">Employer</label>
        <input type="text" id="employer" name="employer[]" required>
      </div>
      <div class="form-group">
        <label for="start-date">Start Date</label>
        <input type="date" id="start-date" name="start-date[]" required>
      </div>
      <div class="form-group">
        <label for="end-date">End Date</label>
        <input type="date" id="end-date" name="end-date[]" required>
      </div>
      <button type="button" class="remove-employment"><i class="fas fa-minus"></i></button>
    `;
    container.appendChild(newItem);
  }

  function removeEmploymentItem(item) {
    item.remove();
    updatePreview();
  }

  function addSkillItem(container) {
    const newItem = document.createElement('div');
    newItem.classList.add('skills-item');
    newItem.innerHTML = `
      <div class="form-group">
        <label for="skill">Skill</label>
        <input type="text" id="skill" name="skill[]" required>
      </div>
      <div class="form-group">
        <label for="skill-level">Level</label>
        <select id="skill-level" name="skill-level[]" required>
          <option value="">Select level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      <button type="button" class="remove-skill"><i class="fas fa-minus"></i></button>
    `;
    container.appendChild(newItem);
  }

  function removeSkillItem(item) {
    item.remove();
    updatePreview();
  }

  function addLanguageItem(container) {
    const newItem = document.createElement('div');
    newItem.classList.add('languages-item');
    newItem.innerHTML = `
      <div class="form-group">
        <label for="language">Language</label>
        <input type="text" id="language" name="language[]" required>
      </div>
      <div class="form-group">
        <label for="language-level">Level</label>
        <select id="language-level" name="language-level[]" required>
          <option value="">Select level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="fluent">Fluent</option>
          <option value="native">Native</option>
        </select>
      </div>
      <button type="button" class="remove-language"><i class="fas fa-minus"></i></button>
    `;
    container.appendChild(newItem);
  }

  function removeLanguageItem(item) {
    item.remove();
    updatePreview();
  }

  function addHobbyItem(container) {
    const newItem = document.createElement('div');
    newItem.classList.add('hobbies-item');
    newItem.innerHTML = `
      <div class="form-group">
        <label for="hobby">Hobby</label>
        <input type="text" id="hobby" name="hobby[]" required>
      </div>
      <button type="button" class="remove-hobby"><i class="fas fa-minus"></i></button>
    `;
    container.appendChild(newItem);
  }

  function removeHobbyItem(item) {
    item.remove();
    updatePreview();
  }

  function addCertificateItem(container) {
    const newItem = document.createElement('div');
    newItem.classList.add('certificates-item');
    newItem.innerHTML = `
      <div class="form-group">
        <label for="certificate">Certificate</label>
        <input type="text" id="certificate" name="certificate[]" required>
      </div>
      <div class="form-group">
        <label for="certificate-year">Year</label>
        <input type="number" id="certificate-year" name="certificate-year[]" required>
      </div>
      <button type="button" class="remove-certificate"><i class="fas fa-minus"></i></button>
    `;
    container.appendChild(newItem);
  }

  function removeCertificateItem(item) {
    item.remove();
    updatePreview();
  }

  function addCustomSectionItem(container) {
    const newItem = document.createElement('div');
    newItem.classList.add('custom-section-item');
    newItem.innerHTML = `
      <div class="form-group">
        <label for="custom-title">Title</label>
        <input type="text" id="custom-title" name="custom-title[]" required>
      </div>
      <div class="form-group">
        <label for="custom-content">Content</label>
        <textarea id="custom-content" name="custom-content[]" required></textarea>
      </div>
      <button type="button" class="remove-custom-section"><i class="fas fa-minus"></i></button>
    `;
    container.appendChild(newItem);
  }

  function removeCustomSectionItem(item) {
    item.remove();
    updatePreview();
  }
});
