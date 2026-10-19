/* ========== PRODUCTS DATA ========== */
const products = [
  { id: 1, brand: 'Nike', name: 'Air Max Pro', price: 15000, category: 'men', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 2, brand: 'Adidas', name: 'Ultra Boost', price: 18000, category: 'sports', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 3, brand: 'Puma', name: 'RS-X Casual', price: 12000, category: 'men', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 4, brand: 'Jordan', name: 'Air 1 Retro', price: 25000, category: 'men', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 5, brand: 'Nike', name: 'Zoom Pegasus', price: 16000, category: 'sports', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 6, brand: 'New Balance', name: 'Fresh Foam', price: 14000, category: 'women', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 7, brand: 'Vans', name: 'Old Skool', price: 8000, category: 'women', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { id: 8, brand: 'Converse', name: 'Chuck Taylor', price: 7000, category: 'women', image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }
];

let cart = JSON.parse(localStorage.getItem('urbanKicksCart')) || [];

/* ========== RENDER PRODUCTS ========== */
function renderProducts(category = 'all') {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  const filtered = category === 'all' ? products : products.filter(p => p.category === category);

  filtered.forEach(p => {
    grid.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" class="product-image" />
        <span class="product-brand">${p.brand}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-price">Rs ${p.price.toLocaleString()}</p>
        <button class="add-to-cart-btn" onclick="addToCart(${p.id})">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    `;
  });
}

/* ========== FILTER PRODUCTS ========== */
function filterProducts(category) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderProducts(category);
}

/* ========== CART FUNCTIONS ========== */
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('active');
  document.getElementById('cartOverlay').classList.toggle('active');
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  renderCart();
  showToast('Item added to cart!');
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += change;
    if (item.qty <= 0) removeFromCart(id);
    else { saveCart(); renderCart(); }
  }
}

function saveCart() {
  localStorage.setItem('urbanKicksCart', JSON.stringify(cart));
}

/* ========== RENDER CART ========== */
function renderCart() {
  const container = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');

  let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = totalQty;

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    totalEl.textContent = 'Rs 0';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Rs ${item.price.toLocaleString()}</p>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');

  let totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  totalEl.textContent = `Rs ${totalPrice.toLocaleString()}`;
}

/* ========== CHECKOUT ========== */
function checkout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', true);
    return;
  }
  alert('Thank you for your order! (Demo checkout)\n\nThis is a portfolio project by Faiza Ali.');
  cart = [];
  saveCart();
  renderCart();
  toggleCart();
}

/* ========== TOAST ========== */
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  toastMsg.textContent = msg;
  toast.style.background = isError ? '#333' : 'var(--primary)';
  toast.querySelector('i').className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ========== INITIAL LOAD ========== */
renderProducts();
renderCart();