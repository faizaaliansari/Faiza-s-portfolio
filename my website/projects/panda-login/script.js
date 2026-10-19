/* ==========================================
   PANDA LOGIN LOGIC
   ========================================== */

const passwordInput = document.getElementById('password');
const panda = document.querySelector('.panda');
const eyeBtn = document.getElementById('eyeBtn');

// 1. Animation: Jab user type kare toh panda aankhein chupaye
passwordInput.addEventListener('input', () => {
  // Agar user ne kuch type kiya hai
  if (passwordInput.value.length > 0) {
    // Agar password hidden hai, toh hands up (cover eyes)
    if (passwordInput.type === 'password') {
      panda.classList.add('active');
      panda.classList.remove('show-password');
    } 
    // Agar password show hai, toh hands neechay (uncover)
    else {
      panda.classList.add('show-password');
      panda.classList.remove('active');
    }
  } 
  // Agar user ne sara text delete kar diya
  else {
    panda.classList.remove('active');
    panda.classList.remove('show-password');
  }
});

// 2. Eye Toggle: Password show/hide karne ka button
eyeBtn.addEventListener('click', () => {
  // Toggle password type
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    
    // Panda hands neechay
    if (passwordInput.value.length > 0) {
      panda.classList.add('show-password');
      panda.classList.remove('active');
    }
  } else {
    passwordInput.type = 'password';
    eyeBtn.innerHTML = '<i class="fas fa-eye"></i>';
    
    // Panda hands wapis aankhon par
    if (passwordInput.value.length > 0) {
      panda.classList.add('active');
      panda.classList.remove('show-password');
    }
  }
});

// 3. Focus Events (Optional: Jab input field se bahar nikle toh hath neechay)
passwordInput.addEventListener('blur', () => {
  if (passwordInput.type === 'password') {
    panda.classList.remove('active');
    panda.classList.remove('show-password');
  }
});