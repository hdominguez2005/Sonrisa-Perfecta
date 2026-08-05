/* ============================================
   Sonrisa Perfecta — interacciones de la landing
   ============================================ */

(function () {
  'use strict';

  /* ---------- Año dinámico en el footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header con sombra al hacer scroll ---------- */
  var header = document.getElementById('header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Animación de entrada por sección ---------- */
  var animated = document.querySelectorAll('.card, .quote, .about__panel, .section__head, .hero__card');
  animated.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = (i * 70) + 'ms';
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animated.forEach(function (el) { observer.observe(el); });
  } else {
    animated.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ============================================
     Formulario de citas
     ============================================ */
  var form = document.getElementById('bookingForm');
  var submitBtn = document.getElementById('submitBtn');
  var success = document.getElementById('formSuccess');
  var successDetail = document.getElementById('successDetail');
  var resetBtn = document.getElementById('resetForm');
  var fechaInput = document.getElementById('fecha');

  /* La fecha mínima es hoy; se permite reservar hasta 6 meses adelante */
  var hoy = new Date();
  var toISO = function (d) {
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  };
  var maxFecha = new Date(hoy);
  maxFecha.setMonth(maxFecha.getMonth() + 6);
  fechaInput.min = toISO(hoy);
  fechaInput.max = toISO(maxFecha);

  var setError = function (name, message) {
    var msgEl = form.querySelector('[data-error-for="' + name + '"]');
    var input = form.elements[name];
    if (msgEl) msgEl.textContent = message || '';
    if (input && input.closest('.field')) {
      input.closest('.field').classList.toggle('has-error', Boolean(message));
    }
    if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  var validators = {
    nombre: function (v) {
      if (!v.trim()) return 'Escribe tu nombre.';
      if (v.trim().length < 3) return 'El nombre es demasiado corto.';
      return '';
    },
    telefono: function (v) {
      var digits = v.replace(/\D/g, '');
      if (!digits) return 'Escribe tu teléfono.';
      if (digits.length < 10) return 'El teléfono debe tener al menos 10 dígitos.';
      return '';
    },
    email: function (v) {
      if (!v.trim()) return 'Escribe tu correo.';
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim())) return 'El correo no parece válido.';
      return '';
    },
    servicio: function (v) { return v ? '' : 'Selecciona un servicio.'; },
    hora: function (v) { return v ? '' : 'Selecciona un horario.'; },
    fecha: function (v) {
      if (!v) return 'Elige una fecha.';
      if (v < fechaInput.min) return 'La fecha ya pasó, elige otra.';
      var dia = new Date(v + 'T00:00:00').getDay();
      if (dia === 0) return 'Los domingos no atendemos.';
      return '';
    },
    aviso: function (_, el) { return el.checked ? '' : 'Debes aceptar el aviso de privacidad.'; }
  };

  var validateField = function (name) {
    var el = form.elements[name];
    var message = validators[name](el.value, el);
    setError(name, message);
    return !message;
  };

  /* Limpia el error mientras el usuario corrige */
  Object.keys(validators).forEach(function (name) {
    var el = form.elements[name];
    var evt = (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'date') ? 'change' : 'input';
    el.addEventListener(evt, function () {
      if (el.closest('.field') && el.closest('.field').classList.contains('has-error')) validateField(name);
      else if (el.type === 'checkbox') setError('aviso', '');
    });
    el.addEventListener('blur', function () { validateField(name); });
  });

  var formatFecha = function (iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('es-MX', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var names = Object.keys(validators);
    var firstInvalid = null;

    names.forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
    });

    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    /* Simulación de envío. Conecta aquí tu backend / servicio de formularios. */
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    setTimeout(function () {
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
        'Gracias, ' + datos.nombre.split(' ')[0] + '. Te contactaremos para confirmar tu cita del ' +
        formatFecha(datos.fecha) + ' (' + datos.hora + ').';

      success.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Solicitar cita';
    }, 700);
  });

  resetBtn.addEventListener('click', function () {
    form.reset();
    Object.keys(validators).forEach(function (name) { setError(name, ''); });
    success.hidden = true;
    form.elements.nombre.focus();
  });
})();
