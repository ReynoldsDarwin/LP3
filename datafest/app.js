/* ═══════════════════════════════════════════════════════
   DATA FEST — UNA Puno
   Motor JS conectado a Supabase Cloud
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────
   CONFIGURACIÓN DE SUPABASE
   ────────────────────────────────────────────────────── */
const SUPABASE_URL = 'https://ydmadyhiyeeoekrmbjmb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkbWFkeWhpeWVlb2Vrcm1iam1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4MjYwNzMsImV4cCI6MjEwMTQwMjA3M30.jYeOoW09NzbR0KAUyTngEqdCCUqfOILIBpUDiQDkVvs';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ──────────────────────────────────────────────────────
   MÓDULO DE BASE DE DATOS (Supabase)
   Esquema:
   id (uuid), codigo, nombres, semestre, fecha_evento, titulo_trabajo, grupo, fecha_registro, estado
   ────────────────────────────────────────────────────── */
const DB = {
  TABLE: 'participantes',

  /** Obtener todos los participantes */
  async getAll() {
    const { data, error } = await supabaseClient
      .from(this.TABLE)
      .select('*')
      .order('fecha_registro', { ascending: false });

    if (error) {
      console.error('Error al obtener participantes:', error);
      mostrarToast('Error al conectar con la base de datos', 'error');
      return [];
    }
    return data || [];
  },

  /** Agregar un nuevo participante */
  async agregar(participante) {
    const { data, error } = await supabaseClient
      .from(this.TABLE)
      .insert([participante])
      .select();

    if (error) {
      console.error('Error al registrar participante:', error);
      mostrarToast('No se pudo registrar en Supabase', 'error');
      return null;
    }
    return data ? data[0] : null;
  },

  /** Eliminar un participante por su id */
  async eliminar(id) {
    const { error } = await supabaseClient
      .from(this.TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar participante:', error);
      mostrarToast('No se pudo eliminar el registro', 'error');
      return false;
    }
    return true;
  },

  /** Borrar TODA la base de datos de participantes */
  async borrarTodo() {
    const { error } = await supabaseClient
      .from(this.TABLE)
      .delete()
      .neq('codigo', '');

    if (error) {
      console.error('Error al borrar datos:', error);
      mostrarToast('No se pudieron borrar los datos', 'error');
      return false;
    }
    return true;
  },

  /** Buscar por texto libre (nombre, código, grupo) */
  async buscar(texto) {
    const q = texto.trim();
    if (!q) return await this.getAll();

    const { data, error } = await supabaseClient
      .from(this.TABLE)
      .select('*')
      .or(`nombres.ilike.%${q}%,codigo.ilike.%${q}%,grupo.ilike.%${q}%`)
      .order('fecha_registro', { ascending: false });

    if (error) {
      console.error('Error en búsqueda:', error);
      return [];
    }
    return data || [];
  }
};

/* ──────────────────────────────────────────────────────
   NAVEGACIÓN — cambio de vistas
   ────────────────────────────────────────────────────── */
const navBtns = document.querySelectorAll('.nav-btn');
const views   = document.querySelectorAll('.view');

async function activarVista(nombre) {
  views.forEach(v => v.classList.remove('active'));
  navBtns.forEach(b => b.classList.remove('active'));

  const vista  = document.getElementById(`view-${nombre}`);
  const btnNav = document.querySelector(`[data-view="${nombre}"]`);

  if (vista)  vista.classList.add('active');
  if (btnNav) btnNav.classList.add('active');

  if (nombre === 'lista')       await renderTabla();
  if (nombre === 'certificado') await renderSelectorCert();
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
const btnRegistrar = document.getElementById('btn-registrar');

inputFecha.valueAsDate = new Date();

btnRegistrar.addEventListener('click', async () => {
  const participante = {
    codigo:         inputCodigo.value.trim(),
    nombres:        inputNombres.value.trim(),
    semestre:       inputSem.value,
    fecha_evento:   inputFecha.value,
    titulo_trabajo: inputTitulo.value.trim(),
    grupo:          inputGrupo.value.trim(),
  };

  const faltantes = [];
  if (!participante.codigo)         faltantes.push('Código');
  if (!participante.nombres)        faltantes.push('Apellidos y Nombres');
  if (!participante.semestre)       faltantes.push('Semestre');
  if (!participante.fecha_evento)   faltantes.push('Fecha');
  if (!participante.titulo_trabajo) faltantes.push('Título del trabajo');
  if (!participante.grupo)          faltantes.push('Nombre del grupo');

  if (faltantes.length) {
    mostrarMsg(`Campos requeridos: ${faltantes.join(', ')}.`, 'error');
    return;
  }

  btnRegistrar.disabled = true;
  btnRegistrar.textContent = 'Guardando...';

  const res = await DB.agregar(participante);

  btnRegistrar.disabled = false;
  btnRegistrar.textContent = 'Registrar Participante';

  if (res) {
    mostrarMsg(`✓ ${participante.nombres} registrado exitosamente.`, 'success');
    limpiarFormulario();
    mostrarToast('Participante registrado en Supabase 🎉', 'ok');
  }
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

async function renderTabla(filtro = '') {
  const lista = filtro ? await DB.buscar(filtro) : await DB.getAll();

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
      <td>${formatearFecha(p.fecha_evento)}</td>
      <td>
        <button class="btn-icon btn-cert"  title="Ver certificado" data-id="${p.id}">📜</button>
        <button class="btn-icon btn-elim"  title="Eliminar"        data-id="${p.id}">🗑️</button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });

  tablaBody.querySelectorAll('.btn-cert').forEach(btn => {
    btn.addEventListener('click', async () => {
      await activarVista('certificado');
      setTimeout(() => seleccionarParticipante(btn.dataset.id), 50);
    });
  });

  tablaBody.querySelectorAll('.btn-elim').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('¿Eliminar este participante?')) {
        const ok = await DB.eliminar(btn.dataset.id);
        if (ok) {
          await renderTabla(buscador.value);
          mostrarToast('Participante eliminado', 'error');
        }
      }
    });
  });
}

let debounceTimer;
buscador.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => renderTabla(buscador.value), 300);
});

document.getElementById('btn-borrar-todo').addEventListener('click', async () => {
  if (confirm('¿Borrar TODOS los participantes de Supabase? Esta acción no se puede deshacer.')) {
    const ok = await DB.borrarTodo();
    if (ok) {
      await renderTabla();
      mostrarToast('Todos los datos fueron borrados', 'error');
    }
  }
});

/* ──────────────────────────────────────────────────────
   VISTA: CERTIFICADO
   ────────────────────────────────────────────────────── */
const selPart     = document.getElementById('sel-participante');
const btnGenerar  = document.getElementById('btn-generar');
const btnImprimir = document.getElementById('btn-imprimir');
const certWrapper = document.getElementById('cert-wrapper');

async function renderSelectorCert() {
  const lista = await DB.getAll();
  selPart.innerHTML = '<option value="">— Elige un participante —</option>';
  lista.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.nombres} (${p.codigo})`;
    selPart.appendChild(opt);
  });
}

async function seleccionarParticipante(id) {
  selPart.value = id;
  await generarCertificado(id);
}

btnGenerar.addEventListener('click', async () => {
  const id = selPart.value;
  if (!id) { mostrarToast('Selecciona un participante primero', 'error'); return; }
  await generarCertificado(id);
});

async function generarCertificado(id) {
  const lista = await DB.getAll();
  const p = lista.find(x => String(x.id) === String(id));
  if (!p) return;

  document.getElementById('cert-nombre').textContent   = p.nombres;
  document.getElementById('cert-codigo').textContent   = p.codigo;
  document.getElementById('cert-semestre').textContent = p.semestre;
  document.getElementById('cert-titulo').textContent   = p.titulo_trabajo;
  document.getElementById('cert-grupo').textContent    = p.grupo;
  document.getElementById('cert-fecha').textContent    = formatearFechaLarga(p.fecha_evento);

  const qrEl = document.getElementById('cert-qr-display');
  const codigoStr = String(p.id);
  qrEl.innerHTML = `<span style="font-size:.55rem;word-break:break-all;padding:4px;text-align:center">${codigoStr.slice(-6)}</span>`;

  certWrapper.classList.remove('hidden');
  btnImprimir.disabled = false;
  certWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

btnImprimir.addEventListener('click', () => window.print());

/* ──────────────────────────────────────────────────────
   UTILIDADES
   ────────────────────────────────────────────────────── */
function escHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const parts = iso.split('-');
  if (parts.length < 3) return iso;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}

function formatearFechaLarga(iso) {
  if (!iso) return '—';
  const meses = ['enero','febrero','marzo','abril','mayo','junio',
                 'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const parts = iso.split('-');
  if (parts.length < 3) return iso;
  const [y, m, d] = parts;
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