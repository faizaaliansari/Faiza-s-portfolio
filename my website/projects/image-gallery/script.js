/* ==========================================
   IMAGE GALLERY LOGIC
   ========================================== */

// 1. Gallery Data (Unsplash Images)
const galleryData = [
  { id: 1, title: "Mountain Lake", category: "nature", src: "https://images.unsplash.com/photo-1506744626753-1fa44df31c38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "City Lights", category: "city", src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Cute Dog", category: "animals", src: "https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Forest Path", category: "nature", src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 5, title: "Macbook Setup", category: "tech", src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 6, title: "New York Night", category: "city", src: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 7, title: "Wild Lion", category: "animals", src: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 8, title: "Waterfall", category: "nature", src: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 9, title: "Coding Workspace", category: "tech", src: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 10, title: "Mountain Sunrise", category: "nature", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

let currentCategory = 'all';
let filteredImages = [...galleryData]; // Track currently displayed images for lightbox
let currentImageIndex = 0;

const galleryGrid = document.getElementById('galleryGrid');
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbTitle = document.getElementById('lbTitle');
const lbCategory = document.getElementById('lbCategory');

/* ==========================================
   2. RENDER GALLERY
   ========================================== */
function renderGallery() {
  galleryGrid.innerHTML = '';

  filteredImages = currentCategory === 'all' 
    ? [...galleryData] 
    : galleryData.filter(img => img.category === currentCategory);

  if (filteredImages.length === 0) {
    galleryGrid.innerHTML = '<p style="text-align:center; width:100%; color:#94a3b8;">No images found.</p>';
    return;
  }

  filteredImages.forEach((img, index) => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
      <img src="${img.src}" alt="${img.title}" loading="lazy" />
      <div class="gallery-info">
        <h3>${img.title}</h3>
        <p>${img.category}</p>
      </div>
    `;
    // Open lightbox on click
    div.onclick = () => openLightbox(index);
    galleryGrid.appendChild(div);
  });
}

/* ==========================================
   3. FILTER IMAGES
   ========================================== */
function filterImages(category, btn) {
  currentCategory = category;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGallery();
}

/* ==========================================
   4. LIGHTBOX FUNCTIONS
   ========================================== */
function openLightbox(index) {
  currentImageIndex = index;
  updateLightboxContent();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function updateLightboxContent() {
  const img = filteredImages[currentImageIndex];
  lbImage.src = img.src;
  lbTitle.textContent = img.title;
  lbCategory.textContent = img.category;
}

function changeImage(direction) {
  currentImageIndex += direction;

  // Loop around if at the end
  if (currentImageIndex >= filteredImages.length) {
    currentImageIndex = 0;
  } else if (currentImageIndex < 0) {
    currentImageIndex = filteredImages.length - 1;
  }

  // Add slight fade animation
  lbImage.style.opacity = 0;
  setTimeout(() => {
    updateLightboxContent();
    lbImage.style.opacity = 1;
  }, 200);
}

/* ==========================================
   5. KEYBOARD SUPPORT (Esc, Left, Right)
   ========================================== */
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') changeImage(1);
  if (e.key === 'ArrowLeft') changeImage(-1);
});

// Close lightbox if clicked outside the image
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* ==========================================
   6. INITIALIZE
   ========================================== */
renderGallery();