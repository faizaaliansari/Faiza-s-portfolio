/* ==========================================
   RESUME BUILDER LOGIC
   ========================================== */

let experienceCount = 0;
let educationCount = 0;

/* ==========================================
   1. ACCORDION LOGIC
   ========================================== */
function toggleAccordion(header) {
  const item = header.parentElement;
  // Close others
  document.querySelectorAll('.acc-item').forEach(acc => {
    if (acc !== item) acc.classList.remove('active');
  });
  // Toggle current
  item.classList.toggle('active');
}

/* ==========================================
   2. ADD EXPERIENCE
   ========================================== */
function addExperience() {
  experienceCount++;
  const id = `exp-${experienceCount}`;
  
  const container = document.getElementById('experienceList');
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = id;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeItem('${id}')"><i class="fas fa-trash"></i></button>
    <div class="form-group">
      <label>Job Title</label>
      <input type="text" class="exp-title" placeholder="e.g. Web Developer" oninput="updatePreview()" />
    </div>
    <div class="form-group">
      <label>Company</label>
      <input type="text" class="exp-company" placeholder="e.g. Tech Company" oninput="updatePreview()" />
    </div>
    <div class="form-group">
      <label>Duration</label>
      <input type="text" class="exp-date" placeholder="e.g. Jan 2020 - Present" oninput="updatePreview()" />
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea class="exp-desc" rows="2" placeholder="What did you do?" oninput="updatePreview()"></textarea>
    </div>
  `;
  container.appendChild(div);
  updatePreview();
}

/* ==========================================
   3. ADD EDUCATION
   ========================================== */
function addEducation() {
  educationCount++;
  const id = `edu-${educationCount}`;
  
  const container = document.getElementById('educationList');
  const div = document.createElement('div');
  div.className = 'dynamic-item';
  div.id = id;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeItem('${id}')"><i class="fas fa-trash"></i></button>
    <div class="form-group">
      <label>Degree / Certificate</label>
      <input type="text" class="edu-degree" placeholder="e.g. BSCS" oninput="updatePreview()" />
    </div>
    <div class="form-group">
      <label>Institute / University</label>
      <input type="text" class="edu-school" placeholder="e.g. University of Karachi" oninput="updatePreview()" />
    </div>
    <div class="form-group">
      <label>Year</label>
      <input type="text" class="edu-date" placeholder="e.g. 2018 - 2022" oninput="updatePreview()" />
    </div>
  `;
  container.appendChild(div);
  updatePreview();
}

function removeItem(id) {
  document.getElementById(id).remove();
  updatePreview();
}

/* ==========================================
   4. UPDATE PREVIEW (Live)
   ========================================== */
function updatePreview() {
  // --- Personal Info ---
  const name = document.getElementById('nameInput').value || 'Your Name';
  const title = document.getElementById('titleInput').value || 'Job Title';
  const email = document.getElementById('emailInput').value || 'email@example.com';
  const phone = document.getElementById('phoneInput').value || '+92 300 0000000';
  const location = document.getElementById('locationInput').value || 'City, Country';
  const summary = document.getElementById('summaryInput').value;

  document.getElementById('rName').textContent = name;
  document.getElementById('rTitle').textContent = title;

  // Contact with icons
  document.getElementById('rContact').innerHTML = `
    <span><i class="fas fa-envelope"></i> ${email}</span>
    <span><i class="fas fa-phone"></i> ${phone}</span>
    <span><i class="fas fa-map-marker-alt"></i> ${location}</span>
  `;

  // Summary Section
  const summarySection = document.getElementById('rSummarySection');
  if (summary.trim() !== '') {
    summarySection.style.display = 'block';
    document.getElementById('rSummary').textContent = summary;
  } else {
    summarySection.style.display = 'none';
  }

  // --- Experience ---
  const expItems = document.querySelectorAll('.dynamic-item[id^="exp-"]');
  const expList = document.getElementById('rExperienceList');
  const expSection = document.getElementById('rExperienceSection');
  expList.innerHTML = '';
  
  let hasExp = false;
  expItems.forEach(item => {
    const t = item.querySelector('.exp-title').value;
    const c = item.querySelector('.exp-company').value;
    const d = item.querySelector('.exp-date').value;
    const desc = item.querySelector('.exp-desc').value;

    if (t || c || desc) {
      hasExp = true;
      expList.innerHTML += `
        <div class="r-item">
          <h3>${t || 'Job Title'}</h3>
          <h4>${c || 'Company Name'}</h4>
          ${d ? `<div class="r-item-date">${d}</div>` : ''}
          ${desc ? `<p>${desc}</p>` : ''}
        </div>
      `;
    }
  });
  expSection.style.display = hasExp ? 'block' : 'none';

  // --- Education ---
  const eduItems = document.querySelectorAll('.dynamic-item[id^="edu-"]');
  const eduList = document.getElementById('rEducationList');
  const eduSection = document.getElementById('rEducationSection');
  eduList.innerHTML = '';
  
  let hasEdu = false;
  eduItems.forEach(item => {
    const deg = item.querySelector('.edu-degree').value;
    const sch = item.querySelector('.edu-school').value;
    const date = item.querySelector('.edu-date').value;

    if (deg || sch) {
      hasEdu = true;
      eduList.innerHTML += `
        <div class="r-item">
          <h3>${deg || 'Degree'}</h3>
          <h4>${sch || 'School / University'}</h4>
          ${date ? `<div class="r-item-date">${date}</div>` : ''}
        </div>
      `;
    }
  });
  eduSection.style.display = hasEdu ? 'block' : 'none';

  // --- Skills ---
  const skillsVal = document.getElementById('skillsInput').value;
  const skillsList = document.getElementById('rSkillsList');
  const skillsSection = document.getElementById('rSkillsSection');
  skillsList.innerHTML = '';

  if (skillsVal.trim() !== '') {
    skillsSection.style.display = 'block';
    // Comma se separate karke badges banayein
    const skillsArray = skillsVal.split(',').filter(s => s.trim() !== '');
    skillsArray.forEach(skill => {
      skillsList.innerHTML += `<span class="r-skill-badge">${skill.trim()}</span>`;
    });
  } else {
    skillsSection.style.display = 'none';
  }
}

/* ==========================================
   5. INITIALIZE
   ========================================== */
// Start with one experience and one education block
window.onload = () => {
  addExperience();
  addEducation();
  updatePreview();
};