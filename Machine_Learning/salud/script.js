let dataset = [];
let weights = [0, 0, 0, 0];
let bias = 0;
let minMax = {};
let pseudoR2 = 0;

const fileInput = document.getElementById('fileInput');
const downloadSampleBtn = document.getElementById('downloadSampleBtn');
const statusDiv = document.getElementById('status');
const predictionCard = document.getElementById('predictionCard');
const resultCard = document.getElementById('resultCard');
const patientForm = document.getElementById('patientForm');
const probPercent = document.getElementById('probPercent');
const progressBar = document.getElementById('progressBar');
const riskClass = document.getElementById('riskClass');
const r2Value = document.getElementById('r2Value');

const sampleData = [
  { Edad: 25, IMC: 21.5, Glucosa: 85, Presion: 110, Riesgo: 'Bajo' },
  { Edad: 28, IMC: 22.0, Glucosa: 90, Presion: 115, Riesgo: 'Bajo' },
  { Edad: 32, IMC: 24.1, Glucosa: 95, Presion: 120, Riesgo: 'Bajo' },
  { Edad: 35, IMC: 23.5, Glucosa: 88, Presion: 118, Riesgo: 'Bajo' },
  { Edad: 40, IMC: 25.0, Glucosa: 102, Presion: 122, Riesgo: 'Bajo' },
  { Edad: 22, IMC: 20.1, Glucosa: 82, Presion: 108, Riesgo: 'Bajo' },
  { Edad: 30, IMC: 22.8, Glucosa: 91, Presion: 112, Riesgo: 'Bajo' },
  { Edad: 52, IMC: 31.2, Glucosa: 155, Presion: 142, Riesgo: 'Alto' },
  { Edad: 60, IMC: 34.0, Glucosa: 170, Presion: 150, Riesgo: 'Alto' },
  { Edad: 48, IMC: 29.8, Glucosa: 140, Presion: 138, Riesgo: 'Alto' },
  { Edad: 58, IMC: 32.5, Glucosa: 162, Presion: 145, Riesgo: 'Alto' },
  { Edad: 65, IMC: 35.1, Glucosa: 180, Presion: 155, Riesgo: 'Alto' },
  { Edad: 55, IMC: 30.5, Glucosa: 148, Presion: 140, Riesgo: 'Alto' },
  { Edad: 62, IMC: 33.2, Glucosa: 165, Presion: 148, Riesgo: 'Alto' }
];

downloadSampleBtn.addEventListener('click', () => {
  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'DatosSalud');
  XLSX.writeFile(workbook, 'datos_salud_simulados.xlsx');
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      if (json.length < 5) {
        statusDiv.textContent = 'El archivo requiere al menos 5 registros para ajustar la regresión.';
        statusDiv.style.color = '#ef4444';
        return;
      }

      dataset = json;
      trainLogisticRegression();

      statusDiv.textContent = `Dataset cargado (${dataset.length} registros). Modelo de Regresión Logística entrenado.`;
      statusDiv.style.color = '#22c55e';
      predictionCard.classList.remove('disabled');
    } catch (err) {
      statusDiv.textContent = 'Error al procesar el archivo Excel.';
      statusDiv.style.color = '#ef4444';
    }
  };
  reader.readAsArrayBuffer(file);
});

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function trainLogisticRegression() {
  const features = ['Edad', 'IMC', 'Glucosa', 'Presion'];

  features.forEach(feat => {
    const values = dataset.map(d => Number(d[feat]));
    minMax[feat] = {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  });

  const X = dataset.map(item => {
    return features.map(feat => {
      const range = minMax[feat].max - minMax[feat].min || 1;
      return (Number(item[feat]) - minMax[feat].min) / range;
    });
  });

  const y = dataset.map(item => (item.Riesgo === 'Alto' ? 1 : 0));

  weights = [0, 0, 0, 0];
  bias = 0;
  const alpha = 0.1;
  const iterations = 1000;
  const m = X.length;

  for (let iter = 0; iter < iterations; iter++) {
    let dw = [0, 0, 0, 0];
    let db = 0;

    for (let i = 0; i < m; i++) {
      let z = bias;
      for (let j = 0; j < 4; j++) {
        z += weights[j] * X[i][j];
      }
      const yHat = sigmoid(z);
      const error = yHat - y[i];

      for (let j = 0; j < 4; j++) {
        dw[j] += error * X[i][j];
      }
      db += error;
    }

    for (let j = 0; j < 4; j++) {
      weights[j] -= (alpha * dw[j]) / m;
    }
    bias -= (alpha * db) / m;
  }

  calculatePseudoR2(X, y);
}

function calculatePseudoR2(X, y) {
  const eps = 1e-15;
  let logLikelihoodModel = 0;

  for (let i = 0; i < X.length; i++) {
    let z = bias;
    for (let j = 0; j < 4; j++) {
      z += weights[j] * X[i][j];
    }
    let p = Math.min(Math.max(sigmoid(z), eps), 1 - eps);
    logLikelihoodModel += y[i] * Math.log(p) + (1 - y[i]) * Math.log(1 - p);
  }

  const pNull = y.reduce((a, b) => a + b, 0) / y.length;
  let logLikelihoodNull = 0;
  for (let i = 0; i < y.length; i++) {
    logLikelihoodNull += y[i] * Math.log(pNull) + (1 - y[i]) * Math.log(1 - pNull);
  }

  pseudoR2 = 1 - (logLikelihoodModel / logLikelihoodNull);
  pseudoR2 = Math.max(0, Math.min(pseudoR2, 1));
}

function predictProbability(input) {
  const features = ['Edad', 'IMC', 'Glucosa', 'Presion'];
  let z = bias;

  features.forEach((feat, j) => {
    const range = minMax[feat].max - minMax[feat].min || 1;
    const normalizedVal = (input[feat] - minMax[feat].min) / range;
    z += weights[j] * normalizedVal;
  });

  return sigmoid(z);
}

patientForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputPatient = {
    Edad: parseFloat(document.getElementById('age').value),
    IMC: parseFloat(document.getElementById('bmi').value),
    Glucosa: parseFloat(document.getElementById('glucose').value),
    Presion: parseFloat(document.getElementById('pressure').value)
  };

  const probValue = predictProbability(inputPatient);
  const percentage = Math.round(probValue * 100);

  resultCard.classList.remove('hidden');
  probPercent.textContent = `${percentage}%`;
  progressBar.style.width = `${percentage}%`;

  if (percentage >= 50) {
    probPercent.className = 'prob-number risk-high';
    progressBar.className = 'progress-bar-fill bg-high';
    riskClass.textContent = 'Alto Riesgo';
    riskClass.className = 'metric-value risk-high';
  } else {
    probPercent.className = 'prob-number risk-low';
    progressBar.className = 'progress-bar-fill bg-low';
    riskClass.textContent = 'Bajo Riesgo';
    riskClass.className = 'metric-value risk-low';
  }

  r2Value.textContent = `${(pseudoR2 * 100).toFixed(1)}%`;
});