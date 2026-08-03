function convertirConCase() {
    const numero = parseInt(document.getElementById("numInput").value);
    const output = document.getElementById("output");

    if (isNaN(numero) || numero < 0 || numero > 10000) {
        output.innerText = "Ingresa un número válido entre 0 y 10000.";
        return;
    }

    if (numero === 0) {
        output.innerText = "cero";
        return;
    }

    if (numero === 10000) {
        output.innerText = "diez mil";
        return;
    }

    const millar = Math.floor(numero / 1000);
    const centena = Math.floor((numero % 1000) / 100);
    const decena = Math.floor((numero % 100) / 10);
    const unidad = numero % 10;

    let strMillar = "";
    let strCentena = "";
    let strDecena = "";
    let strUnidad = "";

    switch (millar) {
        case 1: strMillar = "mil "; break;
        case 2: strMillar = "dos mil "; break;
        case 3: strMillar = "tres mil "; break;
        case 4: strMillar = "cuatro mil "; break;
        case 5: strMillar = "cinco mil "; break;
        case 6: strMillar = "seis mil "; break;
        case 7: strMillar = "siete mil "; break;
        case 8: strMillar = "ocho mil "; break;
        case 9: strMillar = "nueve mil "; break;
    }

    if (centena === 1) {
        strCentena = (decena === 0 && unidad === 0) ? "cien " : "ciento ";
    } else {
        switch (centena) {
            case 2: strCentena = "doscientos "; break;
            case 3: strCentena = "trescientos "; break;
            case 4: strCentena = "cuatrocientos "; break;
            case 5: strCentena = "quinientos "; break;
            case 6: strCentena = "seiscientos "; break;
            case 7: strCentena = "setecientos "; break;
            case 8: strCentena = "ochocientos "; break;
            case 9: strCentena = "novecientos "; break;
        }
    }

    if (decena === 1) {
        switch (unidad) {
            case 0: strDecena = "diez"; break;
            case 1: strDecena = "once"; break;
            case 2: strDecena = "doce"; break;
            case 3: strDecena = "trece"; break;
            case 4: strDecena = "catorce"; break;
            case 5: strDecena = "quince"; break;
            default: strDecena = "dieci" + ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"][unidad]; break;
        }
    } else if (decena === 2) {
        strDecena = (unidad === 0) ? "veinte" : "veinti" + ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"][unidad];
    } else {
        switch (decena) {
            case 3: strDecena = "treinta"; break;
            case 4: strDecena = "cuarenta"; break;
            case 5: strDecena = "cincuenta"; break;
            case 6: strDecena = "sesenta"; break;
            case 7: strDecena = "setenta"; break;
            case 8: strDecena = "ochenta"; break;
            case 9: strDecena = "noventa"; break;
        }
        if (strDecena !== "" && unidad > 0) strDecena += " y ";
        switch (unidad) {
            case 1: strUnidad = "uno"; break;
            case 2: strUnidad = "dos"; break;
            case 3: strUnidad = "tres"; break;
            case 4: strUnidad = "cuatro"; break;
            case 5: strUnidad = "cinco"; break;
            case 6: strUnidad = "seis"; break;
            case 7: strUnidad = "siete"; break;
            case 8: strUnidad = "ocho"; break;
            case 9: strUnidad = "nueve"; break;
        }
    }

    output.innerText = (strMillar + strCentena + strDecena + strUnidad).trim();
}