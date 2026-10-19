/* ==========================================
   QR CODE GENERATOR LOGIC
   ========================================== */

let qrCodeInstance = null;
let isGenerated = false;

const qrText = document.getElementById('qrText');
const qrColor = document.getElementById('qrColor');
const qrSize = document.getElementById('qrSize');
const qrcodeDiv = document.getElementById('qrcode');
const placeholderText = document.getElementById('placeholderText');
const downloadBtn = document.getElementById('downloadBtn');

/* ==========================================
   1. GENERATE QR CODE
   ========================================== */
function generateQR() {
  const text = qrText.value.trim();

  if (!text) {
    showToast("Please enter some text or URL first!", true);
    qrText.focus();
    return;
  }

  // Clear previous QR code
  qrcodeDiv.innerHTML = '';
  
  const size = parseInt(qrSize.value);
  const color = qrColor.value;

  // Generate new QR Code using the library
  qrCodeInstance = new QRCode(qrcodeDiv, {
    text: text,
    width: size,
    height: size,
    colorDark: color,
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H // High error correction
  });

  // Update UI
  qrcodeDiv.style.display = 'block';
  placeholderText.style.display = 'none';
  downloadBtn.disabled = false;
  isGenerated = true;

  showToast("QR Code Generated Successfully!");
}

/* ==========================================
   2. DOWNLOAD QR CODE
   ========================================== */
function downloadQR() {
  if (!isGenerated) return;

  // QRCode library creates an image tag inside the div
  const img = qrcodeDiv.querySelector('img');
  
  if (!img) return;

  // Create a temporary link to download the image
  const link = document.createElement('a');
  link.href = img.src;
  link.download = `Faiza_QRCode_${Date.now()}.png`; // Unique filename
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Downloading QR Code...");
}

/* ==========================================
   3. AUTO-GENERATE ON LIVE CHANGE (Optional)
   ========================================== */
// Agar user color ya size change kare, toh QR auto-update ho jaye (agar pehle se generate hai)
qrColor.addEventListener('change', () => {
  if (isGenerated) generateQR();
});

qrSize.addEventListener('change', () => {
  if (isGenerated) generateQR();
});

// Press Enter to generate (instead of new line in textarea)
qrText.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault(); // Prevent new line
    generateQR();
  }
});

/* ==========================================
   4. TOAST NOTIFICATION
   ========================================== */
let toastTimeout;
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  
  toast.style.background = isError ? '#ef4444' : '#10b981';
  toast.querySelector('i').className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  
  toast.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}