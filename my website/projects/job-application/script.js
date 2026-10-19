/* ==========================================
   JOB APPLICATION LOGIC
   ========================================== */

const form = document.getElementById('jobForm');
const successBox = document.getElementById('successBox');
const steps = document.querySelectorAll('.form-step');
const indicators = [
  document.getElementById('step1Indicator'),
  document.getElementById('step2Indicator'),
  document.getElementById('step3Indicator')
];

let currentStep = 1;

/* ==========================================
   1. MULTI-STEP NAVIGATION
   ========================================== */
function nextStep(step) {
  // Basic Validation for Step 1 & 2
  if (step === 1) {
    const fName = document.getElementById('firstName').value.trim();
    const lName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!fName || !lName || !email || !phone) {
      showToast("Please fill all required personal details!");
      return;
    }
  }

  if (step === 2) {
    const exp = document.getElementById('experienceYears').value;
    const skills = document.getElementById('skills').value.trim();

    if (!exp || !skills) {
      showToast("Please select experience and enter skills!");
      return;
    }
  }

  // Hide current step, show next step
  document.getElementById(`step${step}`).classList.remove('active');
  document.getElementById(`step${step + 1}`).classList.add('active');
  
  // Update indicators
  indicators[step - 1].classList.remove('active');
  indicators[step].classList.add('active');
  
  currentStep = step + 1;
}

function prevStep(step) {
  document.getElementById(`step${step}`).classList.remove('active');
  document.getElementById(`step${step - 1}`).classList.add('active');
  
  indicators[step - 1].classList.remove('active');
  indicators[step - 2].classList.add('active');
  
  currentStep = step - 1;
}

/* ==========================================
   2. FILE UPLOAD (Drag & Drop)
   ========================================== */
const uploadArea = document.getElementById('uploadArea');
const fileUpload = document.getElementById('fileUpload');
const fileInfo = document.getElementById('fileInfo');

uploadArea.addEventListener('click', () => fileUpload.click());

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    fileUpload.files = files;
    handleFileSelection(files[0]);
  }
});

fileUpload.addEventListener('change', () => {
  if (fileUpload.files.length > 0) {
    handleFileSelection(fileUpload.files[0]);
  }
});

function handleFileSelection(file) {
  // Check size (Max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast("File is too large! Max size is 5MB.");
    fileUpload.value = ''; // Clear
    return;
  }
  
  fileInfo.innerHTML = `<i class="fas fa-file-pdf" style="color:#10b981;"></i> <strong>${file.name}</strong> selected`;
  fileInfo.style.color = "#10b981";
  uploadArea.style.borderColor = "#10b981";
  uploadArea.style.background = "#f0fdf4";
}

/* ==========================================
   3. FORM SUBMISSION
   ========================================== */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate checkbox
  const terms = document.getElementById('terms');
  if (!terms.checked) {
    showToast("Please agree to the terms before submitting.");
    return;
  }

  // Validate File (Optional, but good practice)
  if (fileUpload.files.length === 0) {
    showToast("Please upload your CV before submitting.");
    return;
  }

  // Simulate API Call / Submission
  const submitBtn = document.querySelector('.btn-submit');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  submitBtn.disabled = true;

  setTimeout(() => {
    // Hide form, show success message
    form.style.display = 'none';
    document.querySelector('.progress-container').style.display = 'none';
    successBox.style.display = 'block';
    
    // Reset submit button for next time
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }, 1500);
});

/* ==========================================
   4. RESET FORM
   ========================================== */
function resetForm() {
  form.reset();
  form.style.display = 'block';
  document.querySelector('.progress-container').style.display = 'flex';
  successBox.style.display = 'none';
  
  // Reset to Step 1
  document.getElementById('step3').classList.remove('active');
  document.getElementById('step1').classList.add('active');
  
  indicators[2].classList.remove('active');
  indicators[0].classList.add('active');
  currentStep = 1;

  // Reset File Upload UI
  fileInfo.innerHTML = "Supported formats: PDF, DOC, DOCX (Max 5MB)";
  fileInfo.style.color = "#94a3b8";
  uploadArea.style.borderColor = "#cbd5e1";
  uploadArea.style.background = "#f8fafc";
}

/* ==========================================
   5. TOAST NOTIFICATION
   ========================================== */
let toastTimeout;
function showToast(msg, isSuccess = false) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  
  toast.style.background = isSuccess ? '#10b981' : '#ef4444';
  toast.querySelector('i').className = isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
  
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}