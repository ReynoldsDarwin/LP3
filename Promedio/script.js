function calcularPromedio() {
    const n1 = parseFloat(document.getElementById('n1').value);
    const n2 = parseFloat(document.getElementById('n2').value);
    const n3 = parseFloat(document.getElementById('n3').value);
    
    const resultContainer = document.getElementById('result-container');
    const scoreValue = document.getElementById('score-value');
    const statusText = document.getElementById('status-text');

    const notas = [n1, n2, n3];
    const sonValidas = notas.every(n => !isNaN(n) && n >= 0 && n <= 20);

    if (!sonValidas) {
        alert("Por favor, ingresa notas válidas entre 0 y 20.");
        return;
    }
    const promedio = (n1 + n2 + n3) / 3;

    resultContainer.classList.remove('hidden');
    scoreValue.innerText = promedio.toFixed(1);

    if (promedio >= 10.5) {
        statusText.innerText = "Aprobado";
        statusText.style.color = "#0b52f7";
    } else {
        statusText.innerText = "Desaprobado";
        statusText.style.color = "#ff4d4d"; 
    }
}