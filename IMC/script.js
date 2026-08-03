function calcularIMC() {
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const divResultado = document.getElementById('resultado');

    if (!peso || !altura) {
        divResultado.innerHTML = "<p style='color:red'>Ingresa datos válidos</p>";
        return;
    }

    const imc = (peso / (altura * altura)).toFixed(1);
    let categoria = "";

    if (imc < 18.5) {
        categoria = "Bajo de peso";
    } else if (imc <= 24.9) {
        categoria = "Peso normal";
    } else if (imc <= 29.9) {
        categoria = "Sobrepeso";
    } else if (imc <= 34.9) {
        categoria = "Obesiidad Grado I";
    } else if (imc <= 39.9) {
        categoria = "Obesiidad Grado II";
    } else {
        categoria = "Obesiidad Grado III";
    }

    divResultado.innerHTML = `
        <span class="val-imc">${imc}</span>
        <span class="cat-imc">${categoria}</span>
    `;
}