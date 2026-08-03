const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const btnNext = document.getElementById('btnNext');
const btnReset = document.getElementById('btnReset');
const stepCountEl = document.getElementById('stepCount');
const currentStateEl = document.getElementById('currentState');

let steps = 0;
let initialDistribution = [1.0, 0.0, 0.0];
let currentDistribution = [...initialDistribution];

const states = ['Soleado', 'Nublado', 'Lluvioso'];
const nodeRadius = 35;
const nodes = [
    { x: 200, y: 90, label: 'Sol' },
    { x: 90, y: 290, label: 'Nub' },
    { x: 310, y: 290, label: 'Llu' }
];

function getMatrix() {
    return [
        [parseFloat(document.getElementById('p00').value) || 0, parseFloat(document.getElementById('p01').value) || 0, parseFloat(document.getElementById('p02').value) || 0],
        [parseFloat(document.getElementById('p10').value) || 0, parseFloat(document.getElementById('p11').value) || 0, parseFloat(document.getElementById('p12').value) || 0],
        [parseFloat(document.getElementById('p20').value) || 0, parseFloat(document.getElementById('p21').value) || 0, parseFloat(document.getElementById('p22').value) || 0]
    ];
}

function normalizeMatrix() {
    for (let i = 0; i < 3; i++) {
        let sum = 0;
        for (let j = 0; j < 3; j++) {
            sum += parseFloat(document.getElementById(`p${i}${j}`).value) || 0;
        }
        if (sum !== 1 && sum > 0) {
            for (let j = 0; j < 3; j++) {
                let input = document.getElementById(`p${i}${j}`);
                input.value = ((parseFloat(input.value) || 0) / sum).toFixed(2);
            }
        }
    }
}

function drawNextStep() {
    normalizeMatrix();
    const P = getMatrix();
    let nextDist = [0, 0, 0];

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            nextDist[j] += currentDistribution[i] * P[i][j];
        }
    }

    currentDistribution = nextDist;
    steps++;
    updateUI();
}

function resetSimulation() {
    currentDistribution = [...initialDistribution];
    steps = 0;
    updateUI();
}

function drawArrow(x1, y1, x2, y2, value, isSelf) {
    if (value <= 0.01) return;

    ctx.strokeStyle = `rgba(0, 255, 204, ${0.1 + value * 0.7})`;
    ctx.fillStyle = `rgba(0, 255, 204, ${0.1 + value * 0.7})`;
    ctx.lineWidth = 1 + value * 4;

    if (isSelf) {
        ctx.beginPath();
        ctx.arc(x1, y1 - nodeRadius, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x1 + 10, y1 - nodeRadius - 10);
        ctx.lineTo(x1, y1 - nodeRadius - 15);
        ctx.lineTo(x1 + 5, y1 - nodeRadius - 3);
        ctx.fill();
        return;
    }

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const fromX = x1 + nodeRadius * Math.cos(angle + 0.2);
    const fromY = y1 + nodeRadius * Math.sin(angle + 0.2);
    const toX = x2 + nodeRadius * Math.cos(angle + Math.PI - 0.2);
    const toY = y2 + nodeRadius * Math.sin(angle + Math.PI - 0.2);

    const cpX = (fromX + toX) / 2 + 30 * Math.cos(angle + Math.PI / 2);
    const cpY = (fromY + toY) / 2 + 30 * Math.sin(angle + Math.PI / 2);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(cpX, cpY, toX, toY);
    ctx.stroke();

    const tAngle = Math.atan2(toY - cpY, toX - cpX);
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - 10 * Math.cos(tAngle - 0.4), toY - 10 * Math.sin(tAngle - 0.4));
    ctx.lineTo(toX - 10 * Math.cos(tAngle + 0.4), toY - 10 * Math.sin(tAngle + 0.4));
    ctx.closePath();
    ctx.fill();
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const P = getMatrix();

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            drawArrow(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, P[i][j], i === j);
        }
    }

    nodes.forEach((node, i) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        
        if (currentDistribution[i] > 0.5) {
            ctx.fillStyle = '#16161c';
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#d4af37';
        } else {
            ctx.fillStyle = '#121216';
            ctx.strokeStyle = '#22222a';
            ctx.lineWidth = 2;
            ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#f5f5f7';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
    });
}

function updateUI() {
    let maxVal = -1;
    let maxIdx = 0;

    for (let i = 0; i < 3; i++) {
        const val = currentDistribution[i];
        document.getElementById(`val${i}`).textContent = val.toFixed(4);
        document.getElementById(`bar${i}`).style.width = `${val * 100}%`;

        if (val > maxVal) {
            maxVal = val;
            maxIdx = i;
        }
    }

    stepCountEl.textContent = steps;
    currentStateEl.textContent = states[maxIdx];
    drawGraph();
}

btnNext.addEventListener('click', drawNextStep);
btnReset.addEventListener('click', resetSimulation);

const inputs = document.querySelectorAll('.matrix-grid input');
inputs.forEach(input => input.addEventListener('input', () => {
    normalizeMatrix();
    drawGraph();
}));

updateUI();