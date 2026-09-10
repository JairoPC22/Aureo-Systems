# Simplificar el sitio: quitar catálogo de productos y reducir carga informativa

## Contexto

Encuestas a usuarios reales indican que la página se percibe como confusa y
sobrecargada de información. Además, el negocio ya no vende equipo de cómputo
físico (laptops, redes, servidores, impresión, periféricos, suministros): el
catálogo de productos debe eliminarse por completo. El negocio se enfoca ahora
en tres pilares de servicio (Ciberseguridad administrada, Desarrollo de
software crítico, Automatización con IA) más un grupo más pequeño de
servicios adicionales (Análisis de datos e IA, Marketing digital, Consultoría
tecnológica, Ecommerce) que el cliente confirmó que sigue ofreciendo.

Este documento cubre solo el sitio en vivo (`Aureo-Systems/`, página única).
No toca el borrador multi-página en `sitio/`.

## Objetivo

Reducir la carga cognitiva de la página: eliminar todo lo relacionado con el
catálogo de productos físicos, quitar el modelo 3D del hero, eliminar
contenido duplicado entre la sección "Soluciones" y las 3 secciones de
servicio ya existentes, y reordenar las secciones para que el servicio con
precio publicado (Ciberseguridad) aparezca primero.

## Alcance — Eliminar por completo

- Sección `<section class="hero" id="destacados">` ("Explora nuestros
  productos destacados", carrusel de 8 productos con autoplay).
- Sección `<section class="categories" id="productos">` ("Categorías de
  producto", 6 tarjetas `.category-card`).
- El modelo 3D de la laptop: `<model-viewer id="intro-laptop">` dentro de
  `.intro`, la función `inicializarLaptop3D()` y su llamada, y el `<script>`
  al final del `<body>` que carga `vendor/model-viewer.min.js` de forma
  perezosa. El contenedor visual del hero (`.intro__visual`) se elimina; el
  hero queda solo con texto + botones + cifras de confianza.
- Enlaces al link "Productos" del menú: `header__menu` (escritorio),
  `mobile-menu__list` (móvil) y lista de enlaces del footer.
- Botón "Explorar catálogo" (→ `#productos`) en la sección `.cta` final; la
  sección queda con un solo botón principal ("Solicitar asesoría").
- JS asociado al carrusel/categorías: autoplay del hero de productos, tilt
  del `heroProductVisual`/`productSvgContainer`, click handler de
  `.category-card` / `irAProductoDeCategoria`, y la llamada
  `activarTilt3D('.category-card', 6)`.
- CSS específico de esas secciones/elementos que quede huérfano
  (`.hero*`, `.categories*`, `.category-card*`, `.intro__visual` y
  relacionados con el visor 3D), sin tocar el resto de `.intro`.
- Menciones a "suministro de equipo de cómputo" en `<meta name="keywords">`,
  el JSON-LD de Organización, y `llms.txt`.

## Alcance — Ajustar

- **Sección `#soluciones`**: quitar las tarjetas "Desarrollo de sistemas" y
  "Automatización de procesos" (ya cubiertas en detalle por `#software-critico`
  y `#automatizacion-ia`). Quedan 4 tarjetas: Análisis de datos e IA,
  Marketing digital, Consultoría tecnológica, Ecommerce. Retitular la
  sección de "Soluciones integrales" a **"Otros servicios"** (tag, `h2` y
  descripción se ajustan al alcance reducido). En el dropdown del header y
  el submenú móvil, quitar las entradas "Desarrollo de sistemas" y
  "Automatización de procesos"; renombrar el botón/label del dropdown de
  "Soluciones" a "Otros servicios".
- **Testimonio de Lucía Contreras** (Corporativo Altamira): reescribir la
  cita para que no mencione "renovar todo nuestro equipo de cómputo",
  manteniendo tono positivo genérico y su atribución real (nombre, cargo,
  empresa se mantienen).
- **FAQ** — pregunta "¿Cuánto tiempo toma implementar una solución?": quitar
  la mención a "un suministro de equipo puede resolverse en días", dejar la
  respuesta enfocada en desarrollo a medida / automatización.
- **`#inicio` (hero de marca)**: pasa de layout de 2 columnas
  (texto + visual 3D) a una columna centrada; conserva tag, `h1`, descripción,
  botones ("Ver soluciones" → debe apuntar a la nueva primera sección de
  contenido, "Hablar con un asesor" → `#contacto`) y cifras de confianza.
  El "scroll cue" que apuntaba a `#destacados` pasa a apuntar a
  `#ciberseguridad`.
- **Reordenar secciones** (de arriba hacia abajo):
  1. `#inicio`
  2. `#ciberseguridad`
  3. `#software-critico`
  4. `#automatizacion-ia`
  5. `#simulador` (se mueve aquí, justo después de Automatización con IA)
  6. `#soluciones` ("Otros servicios", ya reducida)
  7. `#proceso` ("Cómo trabajamos")
  8. `#nosotros`
  9. `#testimonios`
  10. `#faq`
  11. `#contacto`
  El reordenamiento es un mover-de-lugar en el HTML; no requiere cambios en
  el JS de scroll-spy (`section[id]` + `data-section` ya es genérico y
  agnóstico al orden).

## Fuera de alcance

- No se borran los archivos de imagen de producto (`BenQ.webp`, `Dell.webp`,
  etc.) del disco — solo se dejan de referenciar en el código. El usuario
  puede pedir borrarlos por separado si lo desea.
- No se toca el borrador `sitio/`.
- No se modifican precios, textos legales (aviso de privacidad) ni el
  formulario de contacto.

## Riesgos / notas de implementación

- Verificar que ningún otro lugar del HTML/JS quede referenciando
  `#productos`, `#destacados`, `.category-card`, `productSvgContainer`,
  `heroProductVisual`, `irAProductoDeCategoria` o `intro-laptop` tras el
  borrado (grep de verificación antes de cerrar la tarea).
- Revisar visualmente en claro/oscuro y escritorio/móvil tras el cambio,
  igual que en iteraciones anteriores de esta sesión.
- El `sitemap.xml`/`robots.txt` no listan URLs específicas de producto (el
  sitio es de una sola página), así que no requieren cambios.
