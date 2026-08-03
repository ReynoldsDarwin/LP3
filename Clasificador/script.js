function clasificar() {
    const input = document.getElementById('userInput').value.toLowerCase().trim();
    const mensaje = document.getElementById('mensaje');
    
    // Limpiar estados previos
    const bins = document.querySelectorAll('.bin');
    bins.forEach(bin => bin.classList.remove('active'));
    mensaje.innerText = "";

    // Diccionarios de palabras clave
    const categorias = {
        azul: ['papel', 'carton', 'periodico', 'revista', 'caja', 'folio', 'sobre'],
        verde: ['vidrio', 'botella de vidrio', 'frasco', 'tarro'],
        amarillo: ['plastico', 'botella', 'lata', 'envase', 'briks', 'bolsa'],
        gris: ['organico', 'comida', 'manzana', 'platano', 'cascara', 'restos', 'pan', 'frutas', 'verduras', 'cascara de huevo']
    };

    let encontrado = false;

    // Buscar en qué categoría encaja
    for (let color in categorias) {
        if (categorias[color].some(keyword => input.includes(keyword))) {
            document.getElementById(color).classList.add('active');
            mensaje.innerText = `¡Eso va al contenedor ${color.toUpperCase()}!`;
            mensaje.style.color = "#2c3e50";
            encontrado = true;
            break;
        }
    }

    if (!encontrado && input !== "") {
        mensaje.innerText = "No estoy seguro de dónde va eso. ¡Intenta con otra palabra!";
        mensaje.style.color = "red";
    }
}