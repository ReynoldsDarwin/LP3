const canvas = document.getElementById('kmeansCanvas');
const ctx = canvas.getContext('2d');

const clusterCountInput = document.getElementById('clusterCount');
const pointCountInput = document.getElementById('pointCount');
const iterationCountEl = document.getElementById('iterationCount');
const algoStatusEl = document.getElementById('algoStatus');

const btnGenerate = document.getElementById('btnGenerate');
const btnInit = document.getElementById('btnInit');
const btnStep = document.getElementById('btnStep');

let points = [];
let centroids = [];
let iterations = 0;
let isInitialized = false;

const colors = [
    '#00ffcc', '#ff007f', '#d4af37', '#3385ff', '#a020f0', '#ffa500'
];

function generatePoints() {
    points = [];
    centroids = [];
    iterations = 0;
    isInitialized = false;
    btnStep.disabled = true;
    iterationCountEl.textContent = '0';
    algoStatusEl.textContent = 'Puntos Generados';
    
    const count = parseInt(pointCountInput.value) || 100;
    for (let i = 0; i < count; i++) {
        points.push({
            x: Math.random() * 0.8 + 0.1,
            y: Math.random() * 0.8 + 0.1,
            cluster: -1
        });
    }
    draw();
}

function initCentroids() {
    if (points.length === 0) return;
    centroids = [];
    iterations = 0;
    iterationCountEl.textContent = '0';
    
    const k = parseInt(clusterCountInput.value) || 3;
    for (let i = 0; i < k; i++) {
        const randomIndex = Math.floor(Math.random() * points.length);
        centroids.push({
            x: points[randomIndex].x,
            y: points[randomIndex].y
        });
    }
    
    for (let p of points) p.cluster = -1;
    
    isInitialized = true;
    btnStep.disabled = false;
    algoStatusEl.textContent = 'Centroides Listos';
    draw();
}

function runStep() {
    if (!isInitialized) return;

    let changed = assignClusters();
    if (changed) {
        algoStatusEl.textContent = 'Asignando Clusters';
        draw();
        
        setTimeout(() => {
            updateCentroids();
            iterations++;
            iterationCountEl.textContent = iterations;
            algoStatusEl.textContent = 'Centroides Actualizados';
            draw();
        }, 300);
    } else {
        algoStatusEl.textContent = 'Algoritmo Convergido';
        btnStep.disabled = true;
    }
}

function assignClusters() {
    let changed = false;
    for (let p of points) {
        let minDist = Infinity;
        let clusterIdx = -1;
        
        for (let i = 0; i < centroids.length; i++) {
            let dist = Math.hypot(p.x - centroids[i].x, p.y - centroids[i].y);
            if (dist < minDist) {
                minDist = dist;
                clusterIdx = i;
            }
        }
        
        if (p.cluster !== clusterIdx) {
            p.cluster = clusterIdx;
            changed = true;
        }
    }
    return changed;
}

function updateCentroids() {
    const k = centroids.length;
    let sumsX = new Array(k).fill(0);
    let sumsY = new Array(k).fill(0);
    let counts = new Array(k).fill(0);

    for (let p of points) {
        if (p.cluster !== -1) {
            sumsX[p.cluster] += p.x;
            sumsY[p.cluster] += p.y;
            counts[p.cluster]++;
        }
    }

    for (let i = 0; i < k; i++) {
        if (counts[i] > 0) {
            centroids[i].x = sumsX[i] / counts[i];
            centroids[i].y = sumsY[i] / counts[i];
        }
    }
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

    for (let p of points) {
        ctx.fillStyle = p.cluster === -1 ? '#8e8e93' : colors[p.cluster % colors.length];
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, canvas.height - (p.y * canvas.height), 5, 0, Math.PI * 2);
        ctx.fill();
    }

    for (let i = 0; i < centroids.length; i++) {
        let c = centroids[i];
        let px = c.x * canvas.width;
        let py = canvas.height - (c.y * canvas.height);
        let size = 10;

        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = colors[i % colors.length];
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors[i % colors.length];
        
        ctx.beginPath();
        ctx.moveTo(px, py - size);
        ctx.lineTo(px + size, py + size);
        ctx.lineTo(px - size, py + size);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.shadowBlur = 0;
    }
}

btnGenerate.addEventListener('click', generatePoints);
btnInit.addEventListener('click', initCentroids);
btnStep.addEventListener('click', runStep);

generatePoints();