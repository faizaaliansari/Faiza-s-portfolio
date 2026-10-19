/* ==========================================
   CHART.JS ANALYTICS DASHBOARD
   ========================================== */

// Global Chart Defaults (Dark Theme ke liye)
Chart.defaults.color = '#94a3b8'; // Text color
Chart.defaults.font.family = "'Poppins', sans-serif";
Chart.defaults.borderColor = 'rgba(51, 65, 85, 0.5)'; // Grid line color

// ==========================================
// 1. LINE CHART (Revenue Overview)
// ==========================================
const revenueCtx = document.getElementById('revenueChart').getContext('2d');

// Gradient for line chart fill
const gradient = revenueCtx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');   // Top color (Primary)
gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');   // Bottom color (Transparent)

const revenueChart = new Chart(revenueCtx, {
  type: 'line',
  data: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Revenue ($)',
      data: [12000, 19000, 15000, 25000],
      borderColor: '#6366f1',
      backgroundColor: gradient,
      borderWidth: 3,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#6366f1',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      fill: true,
      tension: 0.4 // Smooth curve
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return '$' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value / 1000 + 'k';
          }
        }
      },
      x: { grid: { display: false } }
    }
  }
});

// ==========================================
// 2. DOUGHNUT CHART (Traffic Sources)
// ==========================================
const trafficCtx = document.getElementById('trafficChart').getContext('2d');

const trafficChart = new Chart(trafficCtx, {
  type: 'doughnut',
  data: {
    labels: ['Direct', 'Social', 'Search', 'Referral'],
    datasets: [{
      data: [35, 25, 30, 10],
      backgroundColor: [
        '#6366f1', // Primary
        '#10b981', // Success
        '#f59e0b', // Warning
        '#ef4444'  // Danger
      ],
      borderWidth: 0,
      hoverOffset: 10
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // Doughnut hole size
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    }
  }
});

// ==========================================
// 3. BAR CHART (Top Categories)
// ==========================================
const categoryCtx = document.getElementById('categoryChart').getContext('2d');

const categoryChart = new Chart(categoryCtx, {
  type: 'bar',
  data: {
    labels: ['Electronics', 'Clothing', 'Home & Living', 'Beauty', 'Sports'],
    datasets: [{
      label: 'Sales',
      data: [450, 320, 280, 210, 150],
      backgroundColor: '#6366f1',
      borderRadius: 8, // Rounded bars
      barThickness: 40
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(51, 65, 85, 0.5)' }
      },
      x: { grid: { display: false } }
    }
  }
});

// ==========================================
// 4. DYNAMIC DATA FILTERING
// ==========================================
document.getElementById('timeFilter').addEventListener('change', function() {
  const value = this.value;
  
  // Chart ke purane data ko update karna
  if (value === '7') {
    revenueChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    revenueChart.data.datasets[0].data = [4000, 6000, 3500, 7000, 5500, 9000, 8000];
  } 
  else if (value === '30') {
    revenueChart.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    revenueChart.data.datasets[0].data = [12000, 19000, 15000, 25000];
  } 
  else if (value === '12') {
    revenueChart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    revenueChart.data.datasets[0].data = [50000, 45000, 60000, 55000, 70000, 85000, 80000, 90000, 75000, 95000, 100000, 110000];
  }

  // Chart ko update karein (animation ke sath)
  revenueChart.update();
});