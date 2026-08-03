/* ═══════════════════════════════════════════════════════
   DATA FEST — UNA Puno
   Motor JS con LocalStorage
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────
   MÓDULO LOCALSTORGE  ·  Base de datos local del navegador
   Clave: "datafest_participantes"
   Valor: JSON.stringify( Array<Participante> )
   ────────────────────────────────────────────────────── */
const DB = {
  KEY: 'datafest_participantes',

  /** Leer todos los participantes del localStorage */
  getAll() {
    try {
      const raw = localStorage.getItem(this.KEY);   // getItem — lee por clave
      return raw ? JSON.parse(raw) : [];             // parseamos el JSON a array
    } catch {
      return [];
    }
  },

  /** Guardar (sobreescribir) el array completo en localStorage */
  saveAll(lista) {
    localStorage.setItem(this.KEY, JSON.stringify(lista)); // setItem — escribe par clave-valor
  },

  /** Agregar un nuevo participante */
  agregar(participante) {
    const lista = this.getAll();
    lista.push(participante);
    this.saveAll(lista);
  },

  /** Eliminar un participante por su id */
  eliminar(id) {
    const lista = this.getAll().filter(p => p.id !== id);
    this.saveAll(lista);                               // removeItem conceptual: filtro y reescribo
  },

  /** Borrar TODA la base de datos local */
  borrarTodo() {
    localStorage.removeItem(this.KEY);                // removeItem — borra la clave completa
  },

  /** Buscar por texto libre (nombre, código, grupo) */
  buscar(texto) {
    const q = texto.toLowerCase().trim();
    if (!q) return this.getAll();
    return this.getAll().filter(p =>
      p.nombres.toLowerCase().includes(q) ||
      p.codigo.toLowerCase().includes(q)  ||
      p.grupo.toLowerCase().includes(q)
    );
  }
};

/* ──────────────────────────────────────────────────────
   NAVEGACIÓN — cambio de vistas
   ────────────────────────────────────────────────────── */
const navBtns  = document.querySelectorAll('.nav-btn');
const views    = document.querySelectorAll('.view');

function activarVista(nombre) {
  views.forEach(v => v.classList.remove('active'));
  navBtns.forEach(b => b.classList.remove('active'));

  const vista  = document.getElementById(`view-${nombre}`);
  const btnNav = document.querySelector(`[data-view="${nombre}"]`);

  if (vista)  vista.classList.add('active');
  if (btnNav) btnNav.classList.add('active');

  // Acciones al entrar a cada vista
  if (nombre === 'lista')       renderTabla();
  if (nombre === 'certificado') renderSelectorCert();
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => activarVista(btn.dataset.view));
});

/* ──────────────────────────────────────────────────────
   FORMULARIO DE REGISTRO
   ────────────────────────────────────────────────────── */
const inputCodigo  = document.getElementById('codigo');
const inputNombres = document.getElementById('nombres');
const inputSem     = document.getElementById('semestre');
const inputFecha   = document.getElementById('fecha');
const inputTitulo  = document.getElementById('titulo');
const inputGrupo   = document.getElementById('grupo');
const msgEl        = document.getElementById('form-msg');

// Fecha por defecto = hoy
inputFecha.valueAsDate = new Date();

document.getElementById('btn-registrar').addEventListener('click', () => {
  const participante = {
    id:       Date.now().toString(),           // ID único basado en timestamp
    codigo:   inputCodigo.value.trim(),
    nombres:  inputNombres.value.trim(),
    semestre: inputSem.value,
    fecha:    inputFecha.value,
    titulo:   inputTitulo.value.trim(),
    grupo:    inputGrupo.value.trim(),
  };

  /* ── Validación básica ── */
  const faltantes = [];
  if (!participante.codigo)  faltantes.push('Código');
  if (!participante.nombres) faltantes.push('Apellidos y Nombres');
  if (!participante.semestre)faltantes.push('Semestre');
  if (!participante.fecha)   faltantes.push('Fecha');
  if (!participante.titulo)  faltantes.push('Título del trabajo');
  if (!participante.grupo)   faltantes.push('Nombre del grupo');

  if (faltantes.length) {
    mostrarMsg(`Campos requeridos: ${faltantes.join(', ')}.`, 'error');
    return;
  }

  /* ── Guardar en LocalStorage ── */
  DB.agregar(participante);
  mostrarMsg(`✓ ${participante.nombres} registrado exitosamente.`, 'success');
  limpiarFormulario();
  mostrarToast('Participante registrado 🎉', 'ok');
});

document.getElementById('btn-limpiar').addEventListener('click', limpiarFormulario);

function limpiarFormulario() {
  inputCodigo.value  = '';
  inputNombres.value = '';
  inputSem.value     = '';
  inputFecha.valueAsDate = new Date();
  inputTitulo.value  = '';
  inputGrupo.value   = '';
  inputCodigo.focus();
}

function mostrarMsg(texto, tipo) {
  msgEl.textContent = texto;
  msgEl.className = `form-msg ${tipo}`;
  msgEl.classList.remove('hidden');
  setTimeout(() => msgEl.classList.add('hidden'), 4000);
}

/* ──────────────────────────────────────────────────────
   VISTA: LISTA DE PARTICIPANTES
   ────────────────────────────────────────────────────── */
const tablaBody  = document.getElementById('tabla-body');
const emptyState = document.getElementById('empty-state');
const buscador   = document.getElementById('buscador');

function renderTabla(filtro = '') {
  const lista = filtro ? DB.buscar(filtro) : DB.getAll();

  tablaBody.innerHTML = '';

  if (lista.length === 0) {
    emptyState.classList.remove('hidden');
    document.getElementById('tabla-participantes').style.display = 'none';
    return;
  }

  emptyState.classList.add('hidden');
  document.getElementById('tabla-participantes').style.display = '';

  lista.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${escHtml(p.codigo)}</code></td>
      <td><strong>${escHtml(p.nombres)}</strong></td>
      <td><span class="badge-semestre">${escHtml(p.semestre)}</span></td>
      <td>${escHtml(p.grupo)}</td>
      <td>${formatearFecha(p.fecha)}</td>
      <td>
        <button class="btn-icon btn-cert"  title="Ver certificado" data-id="${p.id}">📜</button>
        <button class="btn-icon btn-elim"  title="Eliminar"        data-id="${p.id}">🗑️</button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });

  // Botón certificado rápido desde la tabla
  tablaBody.querySelectorAll('.btn-cert').forEach(btn => {
    btn.addEventListener('click', () => {
      activarVista('certificado');
      setTimeout(() => seleccionarParticipante(btn.dataset.id), 50);
    });
  });

  // Botón eliminar
  tablaBody.querySelectorAll('.btn-elim').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('¿Eliminar este participante?')) {
        DB.eliminar(btn.dataset.id);
        renderTabla(buscador.value);
        mostrarToast('Participante eliminado', 'error');
      }
    });
  });
}

buscador.addEventListener('input', () => renderTabla(buscador.value));

document.getElementById('btn-borrar-todo').addEventListener('click', () => {
  if (confirm('¿Borrar TODOS los participantes del localStorage? Esta acción no se puede deshacer.')) {
    DB.borrarTodo();
    renderTabla();
    mostrarToast('Todos los datos borrados del almacenamiento local', 'error');
  }
});

/* ──────────────────────────────────────────────────────
   VISTA: CERTIFICADO
   ────────────────────────────────────────────────────── */
const selPart    = document.getElementById('sel-participante');
const btnGenerar = document.getElementById('btn-generar');
const btnImprimir= document.getElementById('btn-imprimir');
const certWrapper= document.getElementById('cert-wrapper');

function renderSelectorCert() {
  const lista = DB.getAll();
  selPart.innerHTML = '<option value="">— Elige un participante —</option>';
  lista.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.nombres} (${p.codigo})`;
    selPart.appendChild(opt);
  });
}

function seleccionarParticipante(id) {
  selPart.value = id;
  generarCertificado(id);
}

btnGenerar.addEventListener('click', () => {
  const id = selPart.value;
  if (!id) { mostrarToast('Selecciona un participante primero', 'error'); return; }
  generarCertificado(id);
});

function generarCertificado(id) {
  const p = DB.getAll().find(x => x.id === id);
  if (!p) return;

  document.getElementById('cert-nombre').textContent   = p.nombres;
  document.getElementById('cert-codigo').textContent   = p.codigo;
  document.getElementById('cert-semestre').textContent = p.semestre;
  document.getElementById('cert-titulo').textContent   = p.titulo;
  document.getElementById('cert-grupo').textContent    = p.grupo;
  document.getElementById('cert-fecha').textContent    = formatearFechaLarga(p.fecha);

  // Generar QR simbólico (texto, sin librería externa)
  const qrEl = document.getElementById('cert-qr-display');
  qrEl.innerHTML = `<span style="font-size:.55rem;word-break:break-all;padding:4px;text-align:center">${p.id.slice(-6)}</span>`;

  certWrapper.classList.remove('hidden');
  btnImprimir.disabled = false;
  certWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

btnImprimir.addEventListener('click', () => window.print());

/* ──────────────────────────────────────────────────────
   UTILIDADES
   ────────────────────────────────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function formatearFechaLarga(iso) {
  if (!iso) return '—';
  const meses = ['enero','febrero','marzo','abril','mayo','junio',
                  'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const [y, m, d] = iso.split('-');
  return `${parseInt(d)} de ${meses[parseInt(m)-1]} de ${y}`;
}

/* ── TOAST ── */
let toastTimer;
function mostrarToast(msg, tipo = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${tipo}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3200);
}

/* ──────────────────────────────────────────────────────
   INIT
   ────────────────────────────────────────────────────── */
activarVista('registro');