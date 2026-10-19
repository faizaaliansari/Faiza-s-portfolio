/* ==========================================
   ANALOG CLOCK LOGIC
   ========================================== */

// Elements
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');
const digitalTime = document.getElementById('digitalTime');
const dateDisplay = document.getElementById('dateDisplay');
const ticksContainer = document.getElementById('ticks');

// 1. Generate Tick Marks Dynamically
function createTicks() {
  for (let i = 0; i < 60; i++) {
    const tick = document.createElement('div');
    tick.classList.add('tick');
    
    // Make every 5th tick (hour mark) thicker and longer
    if (i % 5 === 0) {
      tick.classList.add('major');
    }
    
    // Rotate each tick by 6 degrees (360 / 60)
    tick.style.transform = `rotate(${i * 6}deg)`;
    ticksContainer.appendChild(tick);
  }
}

// 2. Update Clock Hands & Digital Time
function updateClock() {
  const now = new Date();
  
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  // Calculate Degrees for smooth movement
  // Second hand moves 6deg per second (360/60)
  // Include milliseconds for smooth continuous motion instead of tick-tock
  const milliseconds = now.getMilliseconds();
  const secondsDegrees = ((seconds + milliseconds / 1000) * 6);
  
  // Minute hand moves 6deg per minute + small movement for seconds
  const minutesDegrees = ((minutes + seconds / 60) * 6);
  
  // Hour hand moves 30deg per hour + small movement for minutes
  const hoursDegrees = ((hours % 12 + minutes / 60) * 30);

  // Apply Rotations
  secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
  hourHand.style.transform = `rotate(${hoursDegrees}deg)`;

  // Update Digital Time
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // Convert 24hr to 12hr format
  
  digitalTime.textContent = `${displayHours.toString().padStart(2, '0')}:${formattedMinutes}:${formattedSeconds} ${ampm}`;

  // Update Date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  dateDisplay.textContent = now.toLocaleDateString('en-US', options);

  // Request next frame for smooth animation (better than setInterval)
  requestAnimationFrame(updateClock);
}

// Initialize
createTicks();
updateClock();