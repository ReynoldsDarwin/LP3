// Genera visualmente las celdas inputs en base a las dimensiones elegidas
function generateMatrices() {
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA_rowsB = parseInt(document.getElementById('colsA_rowsB').value);
    const colsB = parseInt(document.getElementById('colsB').value);

    // Configurar Grid de Matriz A
    const containerA = document.getElementById('containerA');
    containerA.style.gridTemplateColumns = `repeat(${colsA_rowsB}, 1fr)`;
    containerA.innerHTML = '';
    for (let i = 0; i < rowsA * colsA_rowsB; i++) {
        // Rellenamos con números aleatorios del 0 al 9 para facilitar las pruebas
        let randomValue = Math.floor(Math.random() * 10);
        containerA.innerHTML += `<input type="number" class="cellA" value="${randomValue}">`;
    }

    // Configurar Grid de Matriz B
    const containerB = document.getElementById('containerB');
    containerB.style.gridTemplateColumns = `repeat(${colsB}, 1fr)`;
    containerB.innerHTML = '';
    for (let i = 0; i < colsA_rowsB * colsB; i++) {
        let randomValue = Math.floor(Math.random() * 10);
        containerB.innerHTML += `<input type="number" class="cellB" value="${randomValue}">`;
    }

    // Limpiar el contenedor de la matriz resultado previa
    document.getElementById('containerResult').innerHTML = '';
}

// Lee los inputs, procesa las matrices y calcula el resultado
function multiplyMatrices() {
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA_rowsB').value);
    const rowsB = colsA; // Por definición de la multiplicación de matrices
    const colsB = parseInt(document.getElementById('colsB').value);

    // 1. Obtener y estructurar los valores de la Matriz A en un Array bidimensional
    const inputsA = document.querySelectorAll('.cellA');
    let matrixA = [];
    let indexA = 0;
    for (let i = 0; i < rowsA; i++) {
        let row = [];
        for (let j = 0; j < colsA; j++) {
            row.push(Number(inputsA[indexA++].value));
        }
        matrixA.push(row);
    }

    // 2. Obtener y estructurar los valores de la Matriz B en un Array bidimensional
    const inputsB = document.querySelectorAll('.cellB');
    let matrixB = [];
    let indexB = 0;
    for (let i = 0; i < rowsB; i++) {
        let row = [];
        for (let j = 0; j < colsB; j++) {
            row.push(Number(inputsB[indexB++].value));
        }
        matrixB.push(row);
    }

    // 3. Inicializar la matriz de resultados (Matriz C) llena de ceros
    // Tendrá el tamaño de: Filas de A x Columnas de B
    let matrixResult = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));

    // 4. Algoritmo de multiplicación de matrices (Triple bucle For)
    for (let i = 0; i < rowsA; i++) { // Recorre filas de A
        for (let j = 0; j < colsB; j++) { // Recorre columnas de B
            for (let k = 0; k < colsA; k++) { // Multiplica fila por columna (producto punto)
                matrixResult[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }

    // 5. Renderizar la matriz resultado en el HTML
    const containerResult = document.getElementById('containerResult');
    containerResult.style.gridTemplateColumns = `repeat(${colsB}, 1fr)`;
    containerResult.innerHTML = '';

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            containerResult.innerHTML += `<div class="result-cell">${matrixResult[i][j]}</div>`;
        }
    }
}

// Ejecución automática al cargar la web para que no aparezca vacía
window.onload = function() {
    generateMatrices();
};