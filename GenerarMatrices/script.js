function generarMatrices() {
    const rows =  document.getElementById('rows').value;
    const cols =  document.getElementById('cols').value;

    renderMatrix('matrix1-container', 'm1', rows, cols);
    renderMatrix('matrix2-container', 'm2', rows, cols);

    document.getElementById('result-container').innerHTML = '';
    document.getElementById('btn-sumar').style.display = 'inline-block';

}

function renderMatrix(containerId, prefix, rows, cols) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'matrix-grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `${prefix}-${i}-${j}`;
            input.value = 0;
            grid.appendChild(input);
        }
    }

    container.appendChild(grid);
}