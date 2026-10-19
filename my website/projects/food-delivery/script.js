/* ========== FOOD MENU DATA ========== */
const menuItems = [
  { id: 1, name: "Zinger Burger", desc: "Crispy chicken fillet with spicy mayo", price: 650, category: "fastfood", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Pepperoni Pizza", desc: "Loaded with cheese and beef pepperoni", price: 1200, category: "fastfood", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Chicken Biryani", desc: "Aromatic basmati rice with tender chicken", price: 450, category: "desi", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "Beef Karahi", desc: "Traditional spicy beef cooked in wok", price: 1800, category: "desi", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "Chicken Chowmein", desc: "Stir-fried noodles with veggies & chicken", price: 600, category: "chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 6, name: "Cold Coffee", desc: "Chilled coffee blended with ice cream", price: 350, category: "drinks", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 7, name: "French Fries", desc: "Crispy golden fries with ketchup", price: 250, category: "fastfood", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  { id: 8, name: "Mint Margarita", desc: "Refreshing mint & lemon cooler", price: 300, category: "drinks", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" }
];

let cart = JSON.parse(localStorage.getItem('foodieCart')) || [];
const DELIVERY_FEE = 150;

/* ========== RENDER MENU ========== */
function renderMenu(category = 'all') {
  const grid = document.getElementById('foodGrid');
  grid.innerHTML = '';

  const filtered = category === 'all' ? menuItems : menuItems.filter(item => item.category === category);

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align:center; width:100%;">No items found in this category.</p>';
    return;
  }

  filtered.forEach(item => {
    grid.innerHTML += `
      <div class="food-card">
        <img src="${item.image}" alt="${item.name}" class="food-img" />
        <div class="food-info">
          <h3 class="food-title">${item.name}</h3>
          <p class="food-desc">${item.desc}</p>
          <div class="food-bottom">
            <span class="food-price">Rs ${item.price}</span>
            <button class="btn-add" onclick="addToCart(${item.id})">
              <i class="fas fa-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

/* ========== FILTER MENU ========== */
function filterMenu(category) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderMenu(category);
}

/* ========== CART LOGIC ========== */
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('active');
  document.getElementById('cartOverlay').classList.toggle('active');
}

function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  saveCart();
  renderCart();
  showToast(`${item.name} added to basket!`);
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
  localStorage.setItem('foodieCart', JSON.stringify(cart));
}

/* ========== RENDER CART ========== */
function renderCart() {
  const container = document.getElementById('cartItems');
  const countEl = document.getElementById('cartCount');
  const subtotalEl = document.getElementById('cartTotal');
  const grandTotalEl = document.getElementById('grandTotal');

  let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = totalQty;

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart-msg">Your basket is empty.</p>';
    subtotalEl.textContent = 'Rs 0';
    grandTotalEl.textContent = 'Rs 0';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Rs ${item.price}</p>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');

  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let grandTotal = subtotal + DELIVERY_FEE;

  subtotalEl.textContent = `Rs ${subtotal}`;
  grandTotalEl.textContent = `Rs ${grandTotal}`;
}

/* ========== CHECKOUT ========== */
function checkout() {
  if (cart.length === 0) {
    showToast('Your basket is empty!', true);
    return;
  }

  let subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let grandTotal = subtotal + DELIVERY_FEE;

  alert(`🎉 Order Placed Successfully!\n\nTotal Amount: Rs ${grandTotal}\n\nThank you for ordering from FoodieExpress!\n(This is a demo project by Faiza Ali)`);
  
  cart = [];
  saveCart();
  renderCart();
  toggleCart();
}

/* ========== TOAST ========== */
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  
  toast.style.background = isError ? '#ff4757' : '#2ed573';
  toast.querySelector('i').className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ========== INIT ========== */
renderMenu();
renderCart();