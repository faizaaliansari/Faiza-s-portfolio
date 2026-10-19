// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMsg = document.getElementById('errorMsg');
const loader = document.getElementById('loader');
const weatherInfo = document.getElementById('weatherInfo');

const cityNameEl = document.getElementById('cityName');
const currentDateEl = document.getElementById('currentDate');
const tempEl = document.getElementById('temp');
const conditionEl = document.getElementById('condition');
const mainIconEl = document.getElementById('mainIcon');
const feelsLikeEl = document.getElementById('feelsLike');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');

// Weather Code to Icon & Condition Mapping
const weatherIcons = {
  0: { icon: 'fa-sun', text: 'Clear Sky', color: '#FFD700' },
  1: { icon: 'fa-sun', text: 'Mainly Clear', color: '#FFD700' },
  2: { icon: 'fa-cloud-sun', text: 'Partly Cloudy', color: '#B0C4DE' },
  3: { icon: 'fa-cloud', text: 'Overcast', color: '#A9A9A9' },
  45: { icon: 'fa-smog', text: 'Fog', color: '#D3D3D3' },
  48: { icon: 'fa-smog', text: 'Depositing Rime Fog', color: '#D3D3D3' },
  51: { icon: 'fa-cloud-rain', text: 'Light Drizzle', color: '#4682B4' },
  53: { icon: 'fa-cloud-rain', text: 'Moderate Drizzle', color: '#4682B4' },
  55: { icon: 'fa-cloud-rain', text: 'Dense Drizzle', color: '#4682B4' },
  61: { icon: 'fa-cloud-showers-heavy', text: 'Slight Rain', color: '#4682B4' },
  63: { icon: 'fa-cloud-showers-heavy', text: 'Moderate Rain', color: '#4682B4' },
  65: { icon: 'fa-cloud-showers-heavy', text: 'Heavy Rain', color: '#4682B4' },
  71: { icon: 'fa-snowflake', text: 'Slight Snow', color: '#FFFFFF' },
  73: { icon: 'fa-snowflake', text: 'Moderate Snow', color: '#FFFFFF' },
  75: { icon: 'fa-snowflake', text: 'Heavy Snow', color: '#FFFFFF' },
  95: { icon: 'fa-cloud-bolt', text: 'Thunderstorm', color: '#FFD700' },
  96: { icon: 'fa-cloud-bolt', text: 'Thunderstorm with Hail', color: '#FFD700' },
  99: { icon: 'fa-cloud-bolt', text: 'Heavy Thunderstorm', color: '#FFD700' }
};

// Update Date
function updateDate() {
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);
}

// Search Function
async function getWeatherData(city) {
  if (!city) return;

  // Reset UI
  errorMsg.classList.remove('show');
  weatherInfo.classList.remove('show');
  loader.classList.add('show');

  try {
    // Step 1: Get Latitude & Longitude of City
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found');
    }

    const location = geoData.results[0];
    const lat = location.latitude;
    const lon = location.longitude;
    const displayName = `${location.name}, ${location.country || location.admin1 || ''}`;

    // Step 2: Get Weather Data using Lat & Lon
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const current = weatherData.current;
    
    // Update UI
    cityNameEl.textContent = displayName;
    tempEl.innerHTML = `${Math.round(current.temperature_2m)}<span>°C</span>`;
    feelsLikeEl.textContent = `${Math.round(current.apparent_temperature)}°C`;
    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    windSpeedEl.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

    // Weather Icon & Condition
    const code = current.weather_code;
    const info = weatherIcons[code] || { icon: 'fa-cloud', text: 'Unknown', color: '#fff' };
    
    conditionEl.textContent = info.text;
    mainIconEl.className = `fas ${info.icon}`;
    mainIconEl.style.color = info.color;

    // Show Data
    loader.classList.remove('show');
    weatherInfo.classList.add('show');

  } catch (error) {
    loader.classList.remove('show');
    errorMsg.classList.add('show');
    errorMsg.textContent = error.message === 'City not found' 
      ? `City "${city}" not found. Please try again.` 
      : 'Something went wrong. Please try again later.';
  }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
  getWeatherData(cityInput.value.trim());
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    getWeatherData(cityInput.value.trim());
  }
});

// Initial Load
updateDate();
getWeatherData('Karachi'); // Default city on load