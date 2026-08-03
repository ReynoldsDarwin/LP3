const canvas = document.getElementById('plotCanvas');
const ctx = canvas.getContext('2d');
const equationEl = document.getElementById('equation');
const lossEl = document.getElementById('loss');
const trainBtn = document.getElementById('trainBtn');
const canvasHint = document.getElementById('canvasHint');

const meanXEl = document.getElementById('meanX');
const geoXEl = document.getElementById('geoX');
const meanYEl = document.getElementById('meanY');
const geoYEl = document.getElementById('geoY');

let points = [];
let w = 0.0;
let b = 0.0;
const learningRate = 0.1;

function forward(x) {
    return x * w + b;
}

function computeLoss() {
    if (points.length === 0) return 0;
    let totalLoss = 0;
    for (let p of points) {
        let error = forward(p.x) - p.y;
        totalLoss += error * error;
    }
    return totalLoss / points.length;
}

function computeAverages() {
    if (points.length === 0) return;
    let sumX = 0, sumY = 0;
    let prodX = 1, prodY = 1;
    const n = points.length;

    for (let p of points) {
        sumX += p.x;
        sumY += p.y;
        prodX *= p.x;
        prodY *= p.y;
    }

    meanXEl.textContent = (sumX / n).toFixed(4);
    meanYEl.textContent = (sumY / n).toFixed(4);
    geoXEl.textContent = Math.pow(Math.abs(prodX), 1 / n).toFixed(4);
    geoYEl.textContent = Math.pow(Math.abs(prodY), 1 / n).toFixed(4);
}

function trainStep() {
    if (points.length < 2) return;
    let gradW = 0;
    let gradB = 0;

    for (let p of points) {
        let error = forward(p.x) - p.y;
        gradW += 2 * error * p.x;
        gradB += 2 * error;
    }

    w -= (gradW / points.length) * learningRate;
    b -= (gradB / points.length) * learningRate;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#22222a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    if (points.length === 2) {
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffcc';
        ctx.beginPath();
        
        let x1 = 0;
        let y1 = forward(x1);
        let x2 = 1;
        let y2 = forward(x2);

        ctx.moveTo(x1 * canvas.width, canvas.height - (y1 * canvas.height));
        ctx.lineTo(x2 * canvas.width, canvas.height - (y2 * canvas.height));
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    ctx.fillStyle = '#d4af37';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#d4af37';
    for (let p of points) {
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, canvas.height - (p.y * canvas.height), 8, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.shadowBlur = 0;

    equationEl.textContent = `y = ${w.toFixed(2)}x + ${b.toFixed(2)}`;
    lossEl.textContent = computeLoss().toFixed(5);
}

function animateTrain() {
    let steps = 0;
    function step() {
        if (steps < 100) {
            trainStep();
            draw();
            steps++;
            requestAnimationFrame(step);
        }
    }
    step();
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const normX = clickX / canvas.width;
    const normY = (canvas.height - clickY) / canvas.height;

    if (points.length >= 2) {
        points = [];
        w = 0.0;
        b = 0.0;
        trainBtn.disabled = true;
        trainBtn.classList.remove('active');
        trainBtn.textContent = "Esperando Puntos...";
        canvasHint.textContent = "Haz clic en el plano para colocar 2 puntos";
        meanXEl.textContent = "-";
        geoXEl.textContent = "-";
        meanYEl.textContent = "-";
        geoYEl.textContent = "-";
    }

    points.push({ x: normX, y: normY });

    if (points.length === 1) {
        canvasHint.textContent = "Coloca el segundo punto";
    }

    if (points.length === 2) {
        canvasHint.textContent = "¡Puntos listos! Haz clic de nuevo para reiniciar";
        trainBtn.disabled = false;
        trainBtn.classList.add('active');
        trainBtn.textContent = "Entrenar Red (Iterar)";
        computeAverages();
    }

    draw();
});

trainBtn.addEventListener('click', () => {
    if (points.length === 2) {
        animateTrain();
    }
});

draw();