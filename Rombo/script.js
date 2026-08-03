document.addEventListener("DOMContentLoaded", () => {
    const charInput = document.getElementById("charInput");
    const sizeInput = document.getElementById("sizeInput");
    const generateBtn = document.getElementById("generateBtn");
    const matrixDisplay = document.getElementById("matrixDisplay");

    function generateMatrixDiamond() {
        let n = parseInt(sizeInput.value) || 7;
        const char = charInput.value || "♦";

        // Asegurarnos de que el tamaño sea impar para un rombo simétrico
        if (n % 2 === 0) {
            n++;
            sizeInput.value = n;
        }

        const centro = Math.floor(n / 2);
        
        // 1. Crear e inicializar la matriz bidimensional vacía (n x n)
        const matriz = [];
        for (let i = 0; i < n; i++) {
            matriz[i] = new Array(n).fill(" "); 
        }

        // 2. Llenar la matriz con la lógica del rombo
        // Si quieres el rombo RELLENO usa: <= centro
        // Si quieres solo el BORDE del rombo usa: === centro
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                // Ecuación de la distancia Manhattan al centro
                if (Math.abs(i - centro) + Math.abs(j - centro) === centro) {
                    matriz[i][j] = char;
                }
            }
        }

        // 3. Renderizar la matriz en el HTML usando CSS Grid
        matrixDisplay.innerHTML = "";
        matrixDisplay.style.gridTemplateColumns = `repeat(${n}, 35px)`;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const cell = document.createElement("div");
                cell.classList.add("matrix-cell");

                if (matriz[i][j] !== " ") {
                    cell.textContent = matriz[i][j];
                    cell.classList.add("active-cell");
                } else {
                    cell.textContent = "·"; // Un punto tenue para notar la matriz vacía
                    cell.classList.add("empty-cell");
                }

                matrixDisplay.appendChild(cell);
            }
        }
        
        // Opcional: Imprimir la matriz real en la consola del navegador para verificarla
        console.table(matriz);
    }

    // Ejecutar al cargar la página
    generateMatrixDiamond();
    generateBtn.addEventListener("click", generateMatrixDiamond);
});