/* ========== PRODUCTS DATA ========== */
const allProducts = [
  { id: 1, name: "Wireless Headphones", category: "electronics", price: 4500, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Smart Watch Pro", category: "electronics", price: 8999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Men's Casual Jacket", category: "fashion", price: 3500, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "Leather Handbag", category: "accessories", price: 2800, image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "Sunglasses UV400", category: "accessories", price: 1200, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "Bluetooth Speaker", category: "electronics", price: 3200, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 7, name: "Women's Sneakers", category: "fashion", price: 4200, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 8, name: "Classic Wrist Watch", category: "accessories", price: 5500, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" }
];

let cart = JSON.parse(localStorage.getItem('shopEaseCart')) || [];
let currentCategory = 'all';
let searchQuery = '';
const SHIPPING_FEE = 200;

/* ========== RENDER PRODUCTS ========== */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('productCount');
  grid.innerHTML = '';

  // Filter by Category & Search
  let filtered = allProducts;
  
  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }
  
  if (searchQuery) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  countEl.textContent = `Showing ${filtered.length} items`;

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:2rem; color:#64748b;">No products found.</p>';
    return;
  }

  filtered.forEach(p => {
    grid.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.name}" class="product-img" />
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3 class="product-title">${p.name}</h3>
          <p class="product-price">Rs ${p.price.toLocaleString()}</p>
          <button class="btn-add" onclick="addToCart(${p.id})">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
  });
}

/* ========== FILTERS & SEARCH ========== */
function filterCategory(cat, el) {
  currentCategory = cat;
  document.querySelectorAll('.category-list li').forEach(li => li.classList.remove('active'));
  el.classList.add('active');
  renderProducts();
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderProducts();
});

/* ========== CART LOGIC ========== */
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('active');
  document.getElementById('cartOverlay').classList.toggle('active');
}

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  renderCart();
  showToast(`${product.name} added to cart!`);
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('shopEaseCart', JSON.stringify(cart));
}

/* ========== RENDER CART ========== */
function renderCart() {
  const container = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const subtotalEl = document.getElementById('cartTotal');
  const shippingEl = document.getElementById('shippingFee');
  const grandTotalEl = document.getElementById('grandTotal');

  let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = totalQty;

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    subtotalEl.textContent = 'Rs 0';
    shippingEl.textContent = 'Rs 0';
    grandTotalEl.textContent = 'Rs 0';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Rs ${item.price.toLocaleString()}</p>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)"><i class="fas fa-minus"></i></button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');

  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let shipping = SHIPPING_FEE;
  let grandTotal = subtotal + shipping;

  subtotalEl.textContent = `Rs ${subtotal.toLocaleString()}`;
  shippingEl.textContent = `Rs ${shipping}`;
  grandTotalEl.textContent = `Rs ${grandTotal.toLocaleString()}`;
}

/* ========== CHECKOUT ========== */
function checkout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', true);
    return;
  }

  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let grandTotal = subtotal + SHIPPING_FEE;

  alert(`🛍️ Order Placed Successfully!\n\nTotal Bill: Rs ${grandTotal.toLocaleString()}\n\nThank you for shopping with ShopEase!\n(This is a demo project by Faiza Ali)`);
  
  cart = [];
  saveCart();
  renderCart();
  toggleCart();
}

/* ========== TOAST ========== */
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  
  toast.style.background = isError ? '#ef4444' : '#10b981';
  toast.querySelector('i').className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ========== INIT ========== */
renderProducts();
renderCart();