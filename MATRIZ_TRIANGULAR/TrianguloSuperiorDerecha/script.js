document.addEventListener("DOMContentLoaded", () => {
    const sizeInput = document.getElementById("sizeInput");
    const generateBtn = document.getElementById("generateBtn");
    const matrixDisplay = document.getElementById("matrixDisplay");

    function generateRightUpperMatrix() {
        const n = parseInt(sizeInput.value) || 6;
        
        // 1. Crear la matriz bidimensional vacía (n x n)
        const matriz = [];
        for (let i = 0; i < n; i++) {
            matriz[i] = new Array(n);
        }

        // 2. Llenar la matriz con la condición triangular superior derecha
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                // Condición: La columna (j) debe ser mayor o igual a la fila (i)
                if (j >= i) {
                    matriz[i][j] = 1; // Contenido
                } else {
                    matriz[i][j] = 0; // Espacio
                }
            }
        }

        // 3. Renderizar en el DOM mediante el Grid dinámico
        matrixDisplay.innerHTML = "";
        matrixDisplay.style.gridTemplateColumns = `repeat(${n}, 40px)`;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const cell = document.createElement("div");
                cell.classList.add("matrix-cell");
                cell.textContent = matriz[i][j];

                if (matriz[i][j] === 1) {
                    cell.classList.add("content-cell");
                } else {
                    cell.classList.add("empty-cell");
                }

                matrixDisplay.appendChild(cell);
            }
        }

        // Imprimir el mapa de datos real en la consola de comandos del navegador
        console.clear();
        console.log("Matriz Triangular Superior Derecha:");
        console.table(matriz);
    }

    // Inicializar al cargar por primera vez
    generateRightUpperMatrix();
    generateBtn.addEventListener("click", generateRightUpperMatrix);
});