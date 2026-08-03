// Importar funciones de Firebase (SDK V9 Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =========================================================
// ⚠️ REEMPLAZA ESTO CON LA CONFIGURACIÓN DE TU FIREBASE ⚠️
// =========================================================
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referencias al DOM
const form = document.getElementById('registroForm');
const listaCuerpo = document.getElementById('listaCuerpo');
const certificadoArea = document.getElementById('certificadoArea');
const btnCertificado = document.getElementById('btnCertificado');
const btnDescargarLista = document.getElementById('btnDescargarLista');

// Variable para guardar los datos del usuario recién registrado
let usuarioActual = null;
// Variable para almacenar todos los asistentes cargados de la BD
let asistentesRegistrados = [];

// 1. REGISTRAR ASISTENCIA EN LA BASE DE DATOS
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const tipo = document.getElementById('tipo').value;
    
    try {
        // Guardar en la colección "asistentes" en Firestore
        await addDoc(collection(db, "asistentes"), {
            nombre: nombre,
            email: email,
            tipo: tipo,
            fecha: new Date().toISOString()
        });
        
        // Guardar datos temporalmente para su certificado
        usuarioActual = { nombre, tipo };
        
        // Limpiar formulario y mostrar botón de certificado
        form.reset();
        certificadoArea.classList.remove('hidden');
        alert("¡Asistencia registrada con éxito!");
        
    } catch (error) {
        console.error("Error al registrar: ", error);
        alert("Hubo un error al registrar en la nube. Revisa la consola.");
    }
});

// 2. LEER DATOS EN TIEMPO REAL DESDE LA BASE DE DATOS
onSnapshot(collection(db, "asistentes"), (snapshot) => {
    listaCuerpo.innerHTML = '';
    asistentesRegistrados = [];
    
    snapshot.forEach((doc) => {
        const data = doc.data();
        asistentesRegistrados.push(data);
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${data.nombre}</td>
            <td>${data.email}</td>
            <td>${data.tipo}</td>
        `;
        listaCuerpo.appendChild(tr);
    });
});

// 3. GENERAR CERTIFICADO EN PDF (Para el usuario que acaba de registrarse)
btnCertificado.addEventListener('click', () => {
    if(!usuarioActual) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    
    // Diseño del Certificado
    doc.setDrawColor(0, 51, 102); // Azul UNAP
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190); // Borde exterior
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 102);
    doc.text("UNIVERSIDAD NACIONAL DEL ALTIPLANO", 148, 40, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text("Facultad de Ingeniería Estadística e Informática", 148, 50, { align: 'center' });
    
    doc.setFontSize(30);
    doc.setTextColor(200, 150, 0); // Dorado
    doc.text("CERTIFICADO DE PARTICIPACIÓN", 148, 80, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.text("Otorgado a:", 148, 105, { align: 'center' });
    
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text(usuarioActual.nombre.toUpperCase(), 148, 120, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Por su participación como ${usuarioActual.tipo.toUpperCase()} en el festival de datos`, 148, 135, { align: 'center' });
    
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text('"DATA FEST"', 148, 150, { align: 'center' });
    
    // Guardar PDF
    doc.save(`Certificado_${usuarioActual.nombre.replace(/\s+/g, '_')}.pdf`);
});

// 4. GENERAR LISTADO DE ASISTENTES EN PDF
btnDescargarLista.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Listado de Asistentes - DATA FEST", 14, 20);
    doc.setFontSize(12);
    doc.text("Universidad Nacional del Altiplano", 14, 28);
    
    // Usar el plugin autotable para dibujar la tabla
    const tableData = asistentesRegistrados.map(a => [a.nombre, a.email, a.tipo]);
    
    doc.autoTable({
        head: [['Nombre Completo', 'Correo Electrónico', 'Tipo']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [0, 51, 102] } // Cabecera azul UNAP
    });
    
    doc.save("Listado_Asistentes_DataFest.pdf");
});