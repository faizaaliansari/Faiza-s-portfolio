/* ==========================================
   SCHOOL MANAGEMENT SYSTEM LOGIC
   ========================================== */

// 1. Data Initialization (Local Storage se data uthana)
let students = JSON.parse(localStorage.getItem('faizaSchool_students')) || [];
let teachers = JSON.parse(localStorage.getItem('faizaSchool_teachers')) || [];
let classes = JSON.parse(localStorage.getItem('faizaSchool_classes')) || [];

// 2. Save Data Function
function saveData() {
  localStorage.setItem('faizaSchool_students', JSON.stringify(students));
  localStorage.setItem('faizaSchool_teachers', JSON.stringify(teachers));
  localStorage.setItem('faizaSchool_classes', JSON.stringify(classes));
}

/* ==========================================
   NAVIGATION & MODAL CONTROLS
   ========================================== */

// Tab Switching (Dashboard, Students, Teachers, Classes)
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons and sections
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    
    // Add active class to clicked button and target section
    btn.classList.add('active');
    document.getElementById(btn.dataset.target).classList.add('active');
  });
});

// Open Modal
function openModal(id) {
  document.getElementById(id).classList.add('active');
  if (id === 'classModal') populateTeacherDropdown(); // Classes ke liye teachers update karein
}

// Close Modal
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.getElementById('studentForm').reset();
  document.getElementById('teacherForm').reset();
  document.getElementById('classForm').reset();
  document.getElementById('studentId').value = '';
  document.getElementById('teacherId').value = '';
}

// Close Modal on clicking outside (Overlay)
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Toast Notification
function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  toastMsg.textContent = message;
  toast.classList.toggle('error', isError);
  toast.querySelector('i').className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ==========================================
   DASHBOARD LOGIC
   ========================================== */

function updateDashboard() {
  // Counts Update
  document.getElementById('totalStudentsCount').textContent = students.length;
  document.getElementById('totalTeachersCount').textContent = teachers.length;
  document.getElementById('totalClassesCount').textContent = classes.length;
  
  // Total Fees Calculate
  const totalFees = students
    .filter(s => s.status === 'Paid')
    .reduce((sum, s) => sum + Number(s.fees || 0), 0);
  document.getElementById('totalFeesCollected').textContent = `Rs ${totalFees.toLocaleString()}`;

  // Recent Students Table (Last 5)
  const recentBody = document.getElementById('recentStudentsBody');
  const recent = students.slice(-5).reverse();
  
  if (recent.length === 0) {
    recentBody.innerHTML = `<tr><td colspan="4" class="empty-msg">No students added yet.</td></tr>`;
  } else {
    recentBody.innerHTML = recent.map(s => `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td>${s.className}</td>
        <td>${s.roll}</td>
        <td><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></td>
      </tr>
    `).join('');
  }
}

/* ==========================================
   STUDENTS LOGIC
   ========================================== */

document.getElementById('studentForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const id = document.getElementById('studentId').value;
  const newStudent = {
    id: id || Date.now().toString(), // Agar edit hai toh purani ID, warna nayi
    name: document.getElementById('stuName').value.trim(),
    roll: document.getElementById('stuRoll').value.trim(),
    className: document.getElementById('stuClass').value,
    fees: Number(document.getElementById('stuFees').value),
    status: document.getElementById('stuStatus').value
  };

  if (id) {
    // Update existing
    students = students.map(s => s.id === id ? newStudent : s);
    showToast('Student updated successfully!');
  } else {
    // Add new
    students.push(newStudent);
    showToast('Student added successfully!');
  }

  saveData();
  renderStudents();
  updateDashboard();
  closeModal('studentModal');
});

function renderStudents(filter = '') {
  const tbody = document.getElementById('studentsTableBody');
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.className.toLowerCase().includes(filter.toLowerCase()) ||
    s.roll.includes(filter)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-msg">No students found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>${s.roll}</td>
      <td><strong>${s.name}</strong></td>
      <td>${s.className}</td>
      <td>Rs ${Number(s.fees).toLocaleString()}</td>
      <td><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-icon btn-edit" onclick="editStudent('${s.id}')"><i class="fas fa-edit"></i></button>
          <button class="btn-icon btn-delete" onclick="deleteStudent('${s.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editStudent(id) {
  const s = students.find(item => item.id === id);
  if (!s) return;

  document.getElementById('studentId').value = s.id;
  document.getElementById('stuName').value = s.name;
  document.getElementById('stuRoll').value = s.roll;
  document.getElementById('stuClass').value = s.className;
  document.getElementById('stuFees').value = s.fees;
  document.getElementById('stuStatus').value = s.status;
  
  openModal('studentModal');
}

function deleteStudent(id) {
  if (confirm('Are you sure you want to delete this student?')) {
    students = students.filter(s => s.id !== id);
    saveData();
    renderStudents(document.getElementById('studentSearch').value);
    updateDashboard();
    showToast('Student deleted!', true);
  }
}

// Search
document.getElementById('studentSearch').addEventListener('input', (e) => {
  renderStudents(e.target.value);
});

/* ==========================================
   TEACHERS LOGIC
   ========================================== */

document.getElementById('teacherForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const id = document.getElementById('teacherId').value;
  const newTeacher = {
    id: id || Date.now().toString(),
    name: document.getElementById('tchName').value.trim(),
    subject: document.getElementById('tchSubject').value.trim(),
    qual: document.getElementById('tchQual').value.trim(),
    salary: Number(document.getElementById('tchSalary').value)
  };

  if (id) {
    teachers = teachers.map(t => t.id === id ? newTeacher : t);
    showToast('Teacher updated successfully!');
  } else {
    teachers.push(newTeacher);
    showToast('Teacher added successfully!');
  }

  saveData();
  renderTeachers();
  updateDashboard();
  closeModal('teacherModal');
});

function renderTeachers(filter = '') {
  const tbody = document.getElementById('teachersTableBody');
  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(filter.toLowerCase()) ||
    t.subject.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-msg">No teachers found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(t => `
    <tr>
      <td><strong>${t.name}</strong></td>
      <td>${t.subject}</td>
      <td>${t.qual}</td>
      <td>Rs ${Number(t.salary).toLocaleString()}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon btn-edit" onclick="editTeacher('${t.id}')"><i class="fas fa-edit"></i></button>
          <button class="btn-icon btn-delete" onclick="deleteTeacher('${t.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editTeacher(id) {
  const t = teachers.find(item => item.id === id);
  if (!t) return;

  document.getElementById('teacherId').value = t.id;
  document.getElementById('tchName').value = t.name;
  document.getElementById('tchSubject').value = t.subject;
  document.getElementById('tchQual').value = t.qual;
  document.getElementById('tchSalary').value = t.salary;
  
  openModal('teacherModal');
}

function deleteTeacher(id) {
  if (confirm('Are you sure you want to delete this teacher?')) {
    teachers = teachers.filter(t => t.id !== id);
    saveData();
    renderTeachers(document.getElementById('teacherSearch').value);
    updateDashboard();
    showToast('Teacher deleted!', true);
  }
}

// Search
document.getElementById('teacherSearch').addEventListener('input', (e) => {
  renderTeachers(e.target.value);
});

/* ==========================================
   CLASSES LOGIC
   ========================================== */

function populateTeacherDropdown() {
  const select = document.getElementById('clsTeacher');
  select.innerHTML = '<option value="">Select Teacher</option>';
  teachers.forEach(t => {
    select.innerHTML += `<option value="${t.name}">${t.name} (${t.subject})</option>`;
  });
}

document.getElementById('classForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newClass = {
    id: Date.now().toString(),
    name: document.getElementById('clsName').value.trim(),
    teacher: document.getElementById('clsTeacher').value || 'Not Assigned',
    room: document.getElementById('clsRoom').value.trim()
  };

  classes.push(newClass);
  saveData();
  renderClasses();
  updateDashboard();
  closeModal('classModal');
  showToast('Class added successfully!');
});

function renderClasses() {
  const grid = document.getElementById('classesGrid');
  
  if (classes.length === 0) {
    grid.innerHTML = `<div class="empty-msg" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #888;">No classes created yet. Click "Add New Class" to start.</div>`;
    return;
  }

  grid.innerHTML = classes.map(c => `
    <div class="class-card">
      <button class="delete-class-btn" onclick="deleteClass('${c.id}')"><i class="fas fa-trash"></i></button>
      <h3><i class="fas fa-door-open"></i> ${c.name}</h3>
      <p><i class="fas fa-chalkboard-teacher"></i> <strong>Teacher:</strong> ${c.teacher}</p>
      <p><i class="fas fa-map-marker-alt"></i> <strong>Room:</strong> ${c.room}</p>
    </div>
  `).join('');
}

function deleteClass(id) {
  if (confirm('Are you sure you want to delete this class?')) {
    classes = classes.filter(c => c.id !== id);
    saveData();
    renderClasses();
    updateDashboard();
    showToast('Class deleted!', true);
  }
}

/* ==========================================
   INITIALIZE APP
   ========================================== */

// Load everything on start
function init() {
  updateDashboard();
  renderStudents();
  renderTeachers();
  renderClasses();
}

// Run app
init();