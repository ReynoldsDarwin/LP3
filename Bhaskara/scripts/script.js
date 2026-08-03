function calcular() {
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const c = parseFloat(document.getElementById('c').value);
    const res = document.getElementById('resultado');

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        res.innerHTML = "Por favor, completa todos los campos.";
        return;
    }

    if (a === 0) {
        res.innerHTML = "El valor de 'a' no puede ser 0.";
        return;
    }

    const discriminante = Math.pow(b, 2) - (4 * a * c);

    if (discriminante >= 0) {
        const x1 = (-b + Math.sqrt(discriminante)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminante)) / (2 * a);
        res.innerHTML = `x1 = ${x1.toFixed(2)} <br> x2 = ${x2.toFixed(2)}`;
    } else {
        const real = (-b / (2 * a)).toFixed(2);
        const imaginaria = (Math.sqrt(-discriminante) / (2 * a)).toFixed(2);
        res.innerHTML = `x1 = ${real} + ${imaginaria}i <br> x2 = ${real} - ${imaginaria}i`;
    }
}   