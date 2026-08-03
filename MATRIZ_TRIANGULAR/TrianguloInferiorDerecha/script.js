document.addEventListener("DOMContentLoaded", () => {
    const sizeInput = document.getElementById("sizeInput");
    const generateBtn = document.getElementById("generateBtn");
    const matrixDisplay = document.getElementById("matrixDisplay");

    function generateTriangularMatrix() {
        const n = parseInt(sizeInput.value) || 6;
        
        const matriz = [];
        for (let i = 0; i < n; i++) {
            matriz[i] = new Array(n);
        }

        // Llenar la matriz con la condición triangular inferior derecha
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i + j >= n - 1) {
                    matriz[i][j] = 1; 
                } else {
                    matriz[i][j] = 0; 
                }
            }
        }

        matrixDisplay.innerHTML = "";
        matrixDisplay.style.gridTemplateColumns = `repeat(${n}, 40px)`;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const cell = document.createElement("div");
                cell.classList.add("matrix-cell");
                cell.textContent = matriz[i][j];

                // Aplicar clases de estilos según el valor numérico
                if (matriz[i][j] === 1) {
                    cell.classList.add("content-cell");
                } else {
                    cell.classList.add("empty-cell");
                }

                matrixDisplay.appendChild(cell);
            }
        }

        console.log("Estructura de la Matriz:");
        console.table(matriz);
    }
    generateTriangularMatrix();
    generateBtn.addEventListener("click", generateTriangularMatrix);
});