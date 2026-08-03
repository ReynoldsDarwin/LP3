document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("rollBtn");
    const resultText = document.getElementById("result-text");
    const die1 = document.getElementById("die1");
    const die2 = document.getElementById("die2");
    const sampleSpace = document.getElementById("sample-space");

    // Rotaciones de las caras del dado 3D
    const faceRotations = {
        1: { x: 0, y: 0 },
        2: { x: 90, y: 0 },   // Bottom
        3: { x: 0, y: -90 },  // Right
        4: { x: 0, y: 90 },   // Left
        5: { x: -90, y: 0 },  // Top
        6: { x: 180, y: 0 }   // Back
    };

    // 1. Generar Espacio Muestral (Matriz 6x6)
    const cells = {};
    for (let i = 1; i <= 6; i++) {
        for (let j = 1; j <= 6; j++) {
            const div = document.createElement("div");
            div.className = "cell";
            div.textContent = `${i},${j}`;
            sampleSpace.appendChild(div);
            cells[`${i},${j}`] = div;
        }
    }

    // 2. Configurar Gráfico (Chart.js)
    const ctx = document.getElementById('probChart').getContext('2d');
    const theoreticalProbabilities = [
        1/36, 2/36, 3/36, 4/36, 5/36, 6/36, 5/36, 4/36, 3/36, 2/36, 1/36
    ].map(p => (p * 100).toFixed(2));
    const labels = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Probabilidad Teórica (%)',
                data: theoreticalProbabilities,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { 
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            },
            plugins: {
                legend: { labels: { color: '#f8fafc' } }
            }
        }
    });

    // 3. Lógica de Lanzamiento
    btn.addEventListener("click", () => {
        // Deshabilitar botón durante la animación
        btn.disabled = true;
        
        // Limpiar estilos anteriores
        document.querySelectorAll('.cell.active').forEach(el => el.classList.remove('active'));

        // Resultados aleatorios (1-6)
        const val1 = Math.floor(Math.random() * 6) + 1;
        const val2 = Math.floor(Math.random() * 6) + 1;
        const sum = val1 + val2;

        // Calcular rotación sumando vueltas completas (360 * n) para emular el giro
        const rot1 = faceRotations[val1];
        const rot2 = faceRotations[val2];
        const randomSpinsX1 = 360 * (Math.floor(Math.random() * 3) + 2);
        const randomSpinsY1 = 360 * (Math.floor(Math.random() * 3) + 2);
        const randomSpinsX2 = 360 * (Math.floor(Math.random() * 3) + 2);
        const randomSpinsY2 = 360 * (Math.floor(Math.random() * 3) + 2);

        die1.style.transform = `rotateX(${rot1.x + randomSpinsX1}deg) rotateY(${rot1.y + randomSpinsY1}deg)`;
        die2.style.transform = `rotateX(${rot2.x + randomSpinsX2}deg) rotateY(${rot2.y + randomSpinsY2}deg)`;

        // Esperar a que termine la animación de CSS (1.5s)
        setTimeout(() => {
            resultText.textContent = `Suma: ${sum}`;
            
            // Resaltar en la matriz el resultado exacto
            const activeCell = cells[`${val1},${val2}`];
            if(activeCell) activeCell.classList.add('active');

            // Habilitar botón de nuevo
            btn.disabled = false;
        }, 1500);
    });
});