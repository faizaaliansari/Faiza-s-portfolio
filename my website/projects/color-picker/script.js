/* ==========================================
   COLOR PICKER LOGIC
   ========================================== */

// Elements
const mainColorBox = document.getElementById('mainColorBox');
const mainHex = document.getElementById('mainHex');
const mainRgb = document.getElementById('mainRgb');
const colorInput = document.getElementById('colorInput');
const savedGrid = document.getElementById('savedGrid');
const emptyMsg = document.getElementById('emptyMsg');

let savedColors = JSON.parse(localStorage.getItem('faizaSavedColors')) || [];
let currentHex = "#6C63FF";

/* ========== 1. HEX TO RGB CONVERTER ========== */
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/* ========== 2. UPDATE UI ========== */
function updateUI(hex) {
  currentHex = hex.toUpperCase();
  
  // Update Main Box Background
  mainColorBox.style.backgroundColor = currentHex;
  
  // Update Text
  mainHex.textContent = currentHex;
  
  // Convert and update RGB text
  const rgb = hexToRgb(currentHex);
  mainRgb.textContent = `RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`;
  
  // Update Picker Input
  colorInput.value = currentHex;
  
  // Update body background to match (very cool effect)
  document.body.style.background = `radial-gradient(circle at center, ${currentHex}33, #121212)`;

  /* 
   * Text Color Contrast Logic
   * If color is dark, make text white. If light, make text dark.
   * Formula: (R * 0.299 + G * 0.587 + B * 0.114) > 186 = light color
   */
  const brightness = Math.round(((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000);
  
  if (brightness > 155) {
    mainColorBox.classList.remove('light-text');
    mainColorBox.classList.add('dark-text');
  } else {
    mainColorBox.classList.remove('dark-text');
    mainColorBox.classList.add('light-text');
  }
}

/* ========== 3. GENERATE RANDOM COLOR ========== */
function generateRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const hex = "#" + randomColor.padStart(6, '0');
  updateUI(hex);
}

/* ========== 4. COPY TO CLIPBOARD ========== */
function copyToClipboard(elementId) {
  let textToCopy = document.getElementById(elementId).textContent;
  
  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast(`${textToCopy} Copied!`);
  }).catch(err => {
    showToast('Failed to copy!', true);
  });
}

/* ========== 5. SAVED COLORS ========== */
function saveColor() {
  if (savedColors.includes(currentHex)) {
    showToast('Color already saved!', true);
    return;
  }
  
  savedColors.unshift(currentHex); // Add to start of array
  if (savedColors.length > 12) savedColors.pop(); // Limit to 12
  
  localStorage.setItem('faizaSavedColors', JSON.stringify(savedColors));
  renderSavedColors();
  showToast('Color saved successfully!');
}

function renderSavedColors() {
  if (savedColors.length === 0) {
    savedGrid.innerHTML = `<p class="empty-msg" id="emptyMsg">No colors saved yet.</p>`;
    return;
  }

  savedGrid.innerHTML = savedColors.map(color => `
    <div class="color-swatch" style="background-color: ${color};" onclick="updateUI('${color}')">
      <button class="delete-swatch" onclick="deleteColor(event, '${color}')">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');
}

function deleteColor(event, color) {
  event.stopPropagation(); // Prevent main box update when deleting
  savedColors = savedColors.filter(c => c !== color);
  localStorage.setItem('faizaSavedColors', JSON.stringify(savedColors));
  renderSavedColors();
  showToast('Color removed', true);
}

function clearSavedColors() {
  if (savedColors.length === 0) return;
  if (confirm('Are you sure you want to delete all saved colors?')) {
    savedColors = [];
    localStorage.removeItem('faizaSavedColors');
    renderSavedColors();
    showToast('All colors cleared');
  }
}

/* ========== 6. TOAST ========== */
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  
  toast.style.background = isError ? '#ff4757' : '#1dd1a1';
  toast.querySelector('i').className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ========== EVENT LISTENERS ========== */
// Manual picker change
colorInput.addEventListener('input', (e) => {
  updateUI(e.target.value);
});

/* ========== INITIALIZE ========== */
renderSavedColors();
updateUI(currentHex);