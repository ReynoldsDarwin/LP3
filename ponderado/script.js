// script.js
function calcular() {
    // Obtenemos los valores y los convertimos a números
    const n1 = parseFloat(document.getElementById('nota1').value);
    const n2 = parseFloat(document.getElementById('nota2').value);
    const n3 = parseFloat(document.getElementById('nota3').value);

    // Validación de rango (0 a 20)
    if ([n1, n2, n3].some(n => isNaN(n) || n < 0 || n > 20)) {
        document.getElementById('resultado').innerText = "Resultado: Error (Nota fuera de rango 0-20)";
        return;
    }

    // Cálculo ponderado
    const promedio = (n1 * 0.4) + (n2 * 0.4) + (n3 * 0.2);
    
    document.getElementById('resultado').innerText = "Resultado: " + promedio.toFixed(2);
}