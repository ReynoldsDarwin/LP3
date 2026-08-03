const canvas = document.getElementById('knnCanvas');
const ctx = canvas.getContext('2d');
const kValueInput = document.getElementById('kValue');
const votosOroEl = document.getElementById('votosOro');
const votosNeonEl = document.getElementById('votosNeon');
const predictionResultEl = document.getElementById('predictionResult');
const btnGenerate = document.getElementById('btnGenerate');

let points = [];
let testPoint = null;
let nearestNeighbors = [];

function generateDataset() {
    points = [];
    testPoint = null;
    nearestNeighbors = [];
    
    votosOroEl.textContent = '0';
    votosNeonEl.textContent = '0';
    predictionResultEl.textContent = '-';
    predictionResultEl.className = 'card-value';

    for (let i = 0; i < 35; i++) {
        points.push({
            x: Math.random() * 0.45 + 0.05,
            y: Math.random() * 0.5 + 0.3,
            label: 'oro'
        });
    }

    for (let i = 0; i < 35; i++) {
        points.push({
            x: Math.random() * 0.45 + 0.5,
            y: Math.random() * 0.5 + 0.1,
            label: 'neon'
        });
    }
    draw();
}

function calculateKNN(tPoint) {
    const k = parseInt(kValueInput.value) || 3;
    
    let distances = points.map(p => {
        let dist = Math.hypot(p.x - tPoint.x, p.y - tPoint.y);
        return { point: p, dist: dist };
    });

    distances.sort((a, b) => a.dist - b.dist);
    nearestNeighbors = distances.slice(0, k);

    let goldVotes = 0;
    let neonVotes = 0;

    nearestNeighbors.forEach(n => {
        if (n.point.label === 'oro') goldVotes++;
        else neonVotes++;
    });

    votosOroEl.textContent = goldVotes;
    votosNeonEl.textContent = neonVotes;

    if (goldVotes > neonVotes) {
        predictionResultEl.textContent = 'CLASE ORO';
        predictionResultEl.className = 'card-value gold-text';
        tPoint.label = 'oro';
    } else {
        predictionResultEl.textContent = 'CLASE NEÓN';
        predictionResultEl.className = 'card-value neon-text';
        tPoint.label = 'neon';
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

    if (testPoint && nearestNeighbors.length > 0) {
        nearestNeighbors.forEach(n => {
            ctx.strokeStyle = 'rgba(245, 245, 247, 0.15)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(testPoint.x * canvas.width, canvas.height - (testPoint.y * canvas.height));
            ctx.lineTo(n.point.x * canvas.width, canvas.height - (n.point.y * canvas.height));
            ctx.stroke();
            ctx.setLineDash([]);
        });
    }

    points.forEach(p => {
        ctx.fillStyle = p.label === 'oro' ? '#d4af37' : '#00ffcc';
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, canvas.height - (p.y * canvas.height), 6, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.shadowBlur = 0;

    if (testPoint) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = testPoint.label === 'oro' ? '#d4af37' : (testPoint.label === 'neon' ? '#00ffcc' : '#ffffff');
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = ctx.strokeStyle;
        
        ctx.beginPath();
        ctx.arc(testPoint.x * canvas.width, canvas.height - (testPoint.y * canvas.height), 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    testPoint = {
        x: clickX / canvas.width,
        y: (canvas.height - clickY) / canvas.height,
        label: null
    };

    calculateKNN(testPoint);
    draw();
});

kValueInput.addEventListener('input', () => {
    if (testPoint) {
        calculateKNN(testPoint);
        draw();
    }
});

btnGenerate.addEventListener('click', generateDataset);

generateDataset();