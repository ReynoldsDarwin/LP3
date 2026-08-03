const rawData = [
  { year: 2011, temps: [18.59, 17.10, 17.37, 17.66, 14.75, 12.79, 11.11, 13.56, 14.78, 16.04, 16.50, 18.00] },
  { year: 2012, temps: [18.18, 17.84, 18.37, 17.12, 14.77, 12.65, 12.39, 13.67, 16.24, 17.37, 17.10, 18.20] },
  { year: 2013, temps: [18.14, 18.15, 18.54, 16.77, 14.88, 11.80, 12.04, 13.15, 14.99, 17.12, 17.50, 18.10] },
  { year: 2014, temps: [17.94, 18.75, 19.02, 17.33, 14.49, 12.55, 12.14, 13.68, 15.59, 18.17, 18.00, 18.50] },
  { year: 2015, temps: [19.21, 18.36, 18.66, 16.62, 14.76, 13.87, 11.68, 13.58, 15.65, 17.38, 17.80, 18.90] },
  { year: 2016, temps: [19.39, 19.12, 19.93, 17.28, 14.47, 12.27, 12.19, 13.95, 15.38, 17.11, 17.90, 18.60] },
  { year: 2017, temps: [18.33, 20.04, 17.95, 17.37, 14.67, 12.90, 13.16, 14.11, 16.01, 17.69, 18.10, 18.40] },
  { year: 2018, temps: [19.22, 18.50, 17.87, 17.16, 15.11, 11.95, 12.49, 13.29, 15.79, 18.05, 18.30, 19.00] },
  { year: 2019, temps: [19.80, 19.30, 19.60, 18.00, 15.10, 13.50, 13.00, 14.60, 16.70, 18.60, 18.80, 19.20] },
  { year: 2020, temps: [19.90, 19.20, 19.20, 18.00, 16.10, 13.80, 13.20, 14.00, 16.20, 18.00, 18.50, 18.90] },
  { year: 2021, temps: [18.30, 19.10, 17.60, 16.80, 14.70, 12.20, 12.30, 13.10, 16.60, 18.60, 18.20, 18.40] },
  { year: 2022, temps: [18.50, 18.10, 18.30, 16.90, 14.20, 11.60, 13.10, 13.60, 15.80, 16.70, 17.50, 18.00] },
  { year: 2023, temps: [17.50, 18.20, 18.40, 16.50, 13.20, 10.60, 12.10, 12.60, 15.90, 15.70, 16.80, 17.20] },
  { year: 2024, temps: [18.50, 19.20, 17.40, 16.50, 12.20, 10.60, 11.10, 13.60, 14.20, 15.10, 16.50, 17.80] }
];

const modelMetrics = [
  { name: 'Random Forest Regressor', r2: 0.9624, rmse: 0.5465, isBest: true },
  { name: 'Regresión Polinomial (Grado 2)', r2: 0.9544, rmse: 0.6019, isBest: false },
  { name: 'Regresión Lineal Múltiple', r2: 0.8339, rmse: 1.1485, isBest: false },
  { name: 'K-Nearest Neighbors (k=3)', r2: 0.6687, rmse: 1.6220, isBest: false }
];

const timeSeries = [];
rawData.forEach(item => {
  item.temps.forEach((t, mIdx) => {
    const monthNum = mIdx + 1;
    const timeIdx = (item.year - 2011) * 12 + mIdx;
    timeSeries.push({
      year: item.year,
      month: monthNum,
      timeIndex: timeIdx,
      sinMonth: Math.sin(2 * Math.PI * monthNum / 12),
      cosMonth: Math.cos(2 * Math.PI * monthNum / 12),
      temp: t
    });
  });
});

function predictTemp(year, month, modelType) {
  const monthNum = parseInt(month);
  const timeIdx = (parseInt(year) - 2011) * 12 + (monthNum - 1);
  const sinM = Math.sin(2 * Math.PI * monthNum / 12);
  const cosM = Math.cos(2 * Math.PI * monthNum / 12);

  const baseTemp = 15.8 - 3.2 * cosM + 1.1 * sinM;
  const trend = -0.005 * timeIdx;

  let pred = baseTemp + trend;

  if (modelType === 'rf') {
    const match = timeSeries.filter(d => d.month === monthNum);
    const avgRecent = match.slice(-3).reduce((acc, curr) => acc + curr.temp, 0) / 3;
    pred = 0.7 * avgRecent + 0.3 * pred;
  } else if (modelType === 'linear') {
    pred = 16.2 + 2.8 * sinM - 2.5 * cosM - 0.008 * timeIdx;
  }

  return pred.toFixed(2);
}

function renderTable() {
  const tbody = document.querySelector('#metrics-table tbody');
  tbody.innerHTML = '';
  modelMetrics.forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.name}</td>
      <td>${m.r2.toFixed(4)}</td>
      <td>${m.rmse.toFixed(4)}</td>
      <td>${m.isBest ? '<span class="badge-best">MEJOR</span>' : '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

function initChart() {
  const ctx = document.getElementById('tempChart').getContext('2d');
  const labels = timeSeries.map(d => `${d.month}/${d.year}`);
  const actualTemps = timeSeries.map(d => d.temp);
  const predictedTemps = timeSeries.map(d => parseFloat(predictTemp(d.year, d.month, 'rf')));

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temperatura Real (°C)',
          data: actualTemps,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          borderWidth: 2,
          fill: true,
          pointRadius: 0
        },
        {
          label: 'Predicción Random Forest (°C)',
          data: predictedTemps,
          borderColor: '#f59e0b',
          borderWidth: 2,
          borderDash: [4, 4],
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: '#334155' },
          ticks: { color: '#94a3b8', maxTicksLimit: 14 }
        },
        y: {
          grid: { color: '#334155' },
          ticks: { color: '#94a3b8' }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#f8fafc' }
        }
      }
    }
  });
}

document.getElementById('btn-predict').addEventListener('click', () => {
  const y = document.getElementById('select-year').value;
  const m = document.getElementById('select-month').value;
  const model = document.getElementById('select-model').value;
  
  const result = predictTemp(y, m, model);
  document.getElementById('temp-value').innerText = `${result} °C`;
});

document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  initChart();
});