# Una Sonrisa Perfecta — Clínica Dental

Landing page estática de una sola página con formulario para agendar citas.
Sin dependencias, sin paso de build: HTML, CSS y JavaScript puros.

## Archivos

| Archivo | Contenido |
|---|---|
| `index.html` | Estructura: header, hero, servicios, nosotros, testimonios, formulario de cita, footer |
| `styles.css` | Estilos y responsive. La paleta vive en variables CSS dentro de `:root` |
| `script.js` | Menú móvil, animaciones de entrada y validación del formulario |

## Ver en local

Basta con abrir `index.html` en el navegador.

## Despliegue en Vercel

Es un sitio estático servido desde la raíz del repositorio.
Al importar el proyecto en Vercel:

- **Framework Preset:** Other
- **Build Command:** vacío
- **Output Directory:** vacío (raíz)

## Pendientes antes de publicar

- [ ] **Conectar el formulario.** Hoy solo simula el envío: valida los campos y muestra la
      confirmación, pero la cita no llega a ningún lado. El punto de integración está en
      `script.js`, en el bloque `setTimeout` marcado con un comentario.
- [ ] **Reemplazar los testimonios.** Los tres testimonios son ficticios, escritos como
      relleno de diseño. Sustituirlos por reseñas reales o quitar la sección.
- [ ] **Actualizar los datos de contacto.** Teléfono, correo, dirección y horarios son de ejemplo.
- [ ] **Revisar las cifras del hero.** «+15 años», «+4,800 pacientes» y «4.9» son de ejemplo.
- [ ] **Añadir el aviso de privacidad.** El formulario pide aceptarlo, pero el enlace aún no existe.
