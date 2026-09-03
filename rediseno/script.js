/* ============================================================
   Una Sonrisa Perfecta — rediseño
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Año ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Filete del header al hacer scroll ---------- */
  var head = document.getElementById('head');
  var onScroll = function () { head.classList.toggle('is-stuck', window.scrollY > 6); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============================================================
     Odontograma (notación FDI)

     Cuadrantes vistos de frente al paciente:
       1 superior derecho   18…11      2 superior izquierdo  21…28
       4 inferior derecho   48…41      3 inferior izquierdo  31…38
     El último dígito indica el tipo de pieza.
     ============================================================ */

  var PIEZAS = {
    1: { glifo: 'incisivo', nombre: 'Incisivo central', genero: 'm', tx: ['Resina estética', 'Carilla', 'Blanqueamiento'] },
    2: { glifo: 'incisivo', nombre: 'Incisivo lateral', genero: 'm', tx: ['Resina estética', 'Carilla', 'Blanqueamiento'] },
    3: { glifo: 'incisivo', nombre: 'Canino',           genero: 'm', tx: ['Resina estética', 'Carilla', 'Ortodoncia'] },
    4: { glifo: 'premolar', nombre: 'Primer premolar',  genero: 'm', tx: ['Resina', 'Corona', 'Ortodoncia'] },
    5: { glifo: 'premolar', nombre: 'Segundo premolar', genero: 'm', tx: ['Resina', 'Corona', 'Ortodoncia'] },
    6: { glifo: 'molar',    nombre: 'Primer molar',     genero: 'm', tx: ['Resina', 'Endodoncia', 'Corona'] },
    7: { glifo: 'molar',    nombre: 'Segundo molar',    genero: 'm', tx: ['Resina', 'Endodoncia', 'Corona'] },
    8: { glifo: 'molar',    nombre: 'Muela del juicio', genero: 'f', tx: ['Extracción', 'Cirugía'] }
  };

  var CUADRANTES = {
    1: { m: 'superior derecho',  f: 'superior derecha' },
    2: { m: 'superior izquierdo', f: 'superior izquierda' },
    3: { m: 'inferior izquierdo', f: 'inferior izquierda' },
    4: { m: 'inferior derecho',  f: 'inferior derecha' }
  };

  /* Corona alta y raíz corta: con la proporción invertida, las piezas
     del arco superior (que van rotadas 180°) se leían como jarrones. */
  var GLIFOS = {
    incisivo: 'M13 6.5A4 4 0 0 1 17 3h6a4 4 0 0 1 4 3.5V26q0 3-2.5 4.5L21.4 51a1.4 1.4 0 0 1-2.8 0L15.5 30.5Q13 29 13 26Z',
    premolar: 'M9.5 8A5 5 0 0 1 14.5 3h11a5 5 0 0 1 5 5v19q0 3-3 4.5L21.8 51a1.8 1.8 0 0 1-3.6 0L12.5 31.5q-3-1.5-3-4.5Z',
    molar:    'M6.5 8.5A5.5 5.5 0 0 1 12 3h16a5.5 5.5 0 0 1 5.5 5.5V27q0 3-3 4.5L26.2 50a1.9 1.9 0 0 1-3.8 0L21 33h-2l-1.4 17a1.9 1.9 0 0 1-3.8 0L9.5 31.5q-3-1.5-3-4.5Z'
  };

  var ARCADAS = [
    { arco: 'upper', fdi: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28] },
    { arco: 'lower', fdi: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38] }
  ];

  var describir = function (fdi) {
    var cuadrante = Math.floor(fdi / 10);
    var pieza = PIEZAS[fdi % 10];
    return {
      nombre: pieza.nombre + ' ' + CUADRANTES[cuadrante][pieza.genero],
      tx: pieza.tx,
      glifo: pieza.glifo
    };
  };

  var arch = document.getElementById('arch');
  var readoutEmpty = document.getElementById('readoutEmpty');
  var readoutDetail = document.getElementById('readoutDetail');
  var readoutFdi = document.getElementById('readoutFdi');
  var readoutName = document.getElementById('readoutName');
  var readoutTx = document.getElementById('readoutTx');
  var bookTooth = document.getElementById('bookTooth');

  var seleccion = null;

  var crearDiente = function (fdi, distanciaMedia) {
    var info = describir(fdi);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tooth';
    btn.dataset.fdi = String(fdi);
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Pieza ' + fdi + ', ' + info.nombre.toLowerCase());
    /* Las piezas brotan desde la línea media hacia afuera */
    btn.style.animationDelay = (distanciaMedia * 26) + 'ms';

    var num = document.createElement('span');
    num.className = 'tooth__num';
    num.textContent = fdi;

    var body = document.createElement('span');
    body.className = 'tooth__body';

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'tooth__glyph');
    svg.setAttribute('viewBox', '0 0 40 56');
    svg.setAttribute('aria-hidden', 'true');

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', GLIFOS[info.glifo]);
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);

    var mark = document.createElement('span');
    mark.className = 'tooth__mark';

    body.appendChild(svg);
    body.appendChild(mark);
    btn.appendChild(num);
    btn.appendChild(body);
    return btn;
  };

  ARCADAS.forEach(function (arcada) {
    var row = document.createElement('div');
    row.className = 'chart__row';
    row.dataset.arch = arcada.arco;

    arcada.fdi.forEach(function (fdi, i) {
      if (i === 8) {
        var gap = document.createElement('span');
        gap.className = 'chart__gap';
        row.appendChild(gap);
      }
      /* 0 = pegado a la línea media, 7 = la muela del juicio */
      var distanciaMedia = i < 8 ? 7 - i : i - 8;
      row.appendChild(crearDiente(fdi, distanciaMedia));
    });

    arch.appendChild(row);
  });

  arch.classList.add('is-drawing');

  var seleccionar = function (btn) {
    var fdi = Number(btn.dataset.fdi);
    var info = describir(fdi);

    arch.querySelectorAll('.tooth[aria-pressed="true"]').forEach(function (t) {
      t.setAttribute('aria-pressed', 'false');
    });
    btn.setAttribute('aria-pressed', 'true');

    readoutFdi.textContent = fdi;
    readoutName.textContent = info.nombre;
    readoutTx.replaceChildren();
    info.tx.forEach(function (t) {
      var li = document.createElement('li');
      li.textContent = t;
      readoutTx.appendChild(li);
    });

    readoutEmpty.hidden = true;
    readoutDetail.hidden = false;
    seleccion = { fdi: fdi, nombre: info.nombre };
  };

  arch.addEventListener('click', function (e) {
    var btn = e.target.closest('.tooth');
    if (btn) seleccionar(btn);
  });

  /* ---------- De la pieza al formulario ---------- */
  var form = document.getElementById('bookingForm');
  var mensajeEl = document.getElementById('mensaje');
  var servicioEl = document.getElementById('servicio');

  bookTooth.addEventListener('click', function () {
    if (!seleccion) return;

    /* El motivo lo decide la clínica en la consulta, no la web:
       aquí solo dejamos anotada la pieza. */
    if (!servicioEl.value) servicioEl.value = 'Valoración general';

    var nota = 'Consulta sobre la pieza ' + seleccion.fdi + ' (' + seleccion.nombre.toLowerCase() + ').';
    mensajeEl.value = mensajeEl.value.indexOf(nota) === -1
      ? (mensajeEl.value ? mensajeEl.value.trim() + '\n' + nota : nota)
      : mensajeEl.value;

    document.getElementById('agendar').scrollIntoView({ block: 'start', behavior: 'smooth' });
    window.setTimeout(function () { document.getElementById('nombre').focus(); }, 420);
  });

  /* ============================================================
     Formulario
     ============================================================ */
  var submitBtn = document.getElementById('submitBtn');
  var done = document.getElementById('formSuccess');
  var successDetail = document.getElementById('successDetail');
  var resetBtn = document.getElementById('resetForm');
  var fechaEl = document.getElementById('fecha');

  var toISO = function (d) {
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  };
  var hoy = new Date();
  var tope = new Date(hoy);
  tope.setMonth(tope.getMonth() + 6);
  fechaEl.min = toISO(hoy);
  fechaEl.max = toISO(tope);

  var setError = function (name, message) {
    var msgEl = form.querySelector('[data-error-for="' + name + '"]');
    var el = form.elements[name];
    if (msgEl) msgEl.textContent = message || '';
    if (el && el.closest('.field')) el.closest('.field').classList.toggle('is-bad', Boolean(message));
    if (el) el.setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  var reglas = {
    nombre: function (v) {
      if (!v.trim()) return 'Escribe tu nombre.';
      if (v.trim().length < 3) return 'El nombre es demasiado corto.';
      return '';
    },
    telefono: function (v) {
      var digitos = v.replace(/\D/g, '');
      if (!digitos) return 'Escribe tu teléfono.';
      if (digitos.length < 10) return 'El teléfono debe tener al menos 10 dígitos.';
      return '';
    },
    email: function (v) {
      if (!v.trim()) return 'Escribe tu correo.';
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim())) return 'Ese correo no parece válido.';
      return '';
    },
    servicio: function (v) { return v ? '' : 'Selecciona un motivo.'; },
    hora: function (v) { return v ? '' : 'Selecciona un horario.'; },
    fecha: function (v) {
      if (!v) return 'Elige una fecha.';
      if (v < fechaEl.min) return 'Esa fecha ya pasó, elige otra.';
      if (new Date(v + 'T00:00:00').getDay() === 0) return 'Los domingos no atendemos.';
      return '';
    },
    aviso: function (_, el) { return el.checked ? '' : 'Necesitamos que aceptes el aviso.'; }
  };

  var validar = function (name) {
    var el = form.elements[name];
    var msg = reglas[name](el.value, el);
    setError(name, msg);
    return !msg;
  };

  Object.keys(reglas).forEach(function (name) {
    var el = form.elements[name];
    var evento = (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'date') ? 'change' : 'input';
    el.addEventListener(evento, function () {
      var campo = el.closest('.field');
      if (campo && campo.classList.contains('is-bad')) validar(name);
      else if (el.type === 'checkbox') setError('aviso', '');
    });
    el.addEventListener('blur', function () { validar(name); });
  });

  var formatoFecha = function (iso) {
    return new Date(iso + 'T00:00:00')
      .toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var primerFallo = null;
    Object.keys(reglas).forEach(function (name) {
      if (!validar(name) && !primerFallo) primerFallo = form.elements[name];
    });

    if (primerFallo) {
      primerFallo.focus();
      primerFallo.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    /* Simulación de envío. Conecta aquí tu backend o servicio de formularios. */
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    window.setTimeout(function () {
      var datos = {
        nombre: form.elements.nombre.value.trim(),
        telefono: form.elements.telefono.value.trim(),
        email: form.elements.email.value.trim(),
        servicio: form.elements.servicio.value,
        fecha: form.elements.fecha.value,
        hora: form.elements.hora.value,
        mensaje: form.elements.mensaje.value.trim()
      };
      console.log('Solicitud de cita:', datos);

      successDetail.textContent =
        datos.nombre.split(' ')[0] + ', te contactamos para confirmar tu cita del ' +
        formatoFecha(datos.fecha) + ', ' + datos.hora + '.';

      done.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Solicitar cita';
    }, 650);
  });

  resetBtn.addEventListener('click', function () {
    form.reset();
    Object.keys(reglas).forEach(function (name) { setError(name, ''); });
    done.hidden = true;
    form.elements.nombre.focus();
  });
})();
