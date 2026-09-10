# Simplificar sitio: quitar catálogo de productos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar el catálogo de productos físicos y el modelo 3D del hero, quitar contenido duplicado entre "Soluciones" y las secciones de servicio, y reordenar la página según `docs/superpowers/specs/2026-08-26-simplificar-sitio-sin-catalogo-design.md`.

**Architecture:** Sitio estático de una sola página (`index.html` + `styles.css` + `Script.js`, sin build step ni test runner). No hay suite de pruebas automatizadas; la verificación de cada tarea es (a) un grep dirigido que confirma que no quedan referencias colgantes al elemento eliminado, y (b) al final del plan, una revisión visual en navegador (claro/oscuro, escritorio/móvil) — el mismo método usado en el resto de esta sesión.

**Tech Stack:** HTML5, CSS3 (custom properties, sin preprocesador), JavaScript vanilla (sin framework, sin bundler).

## Global Constraints

- No tocar nada de `sitio/` (el borrador multi-página es un proyecto aparte).
- No borrar archivos de imagen de `assets/` del disco — solo dejar de referenciarlos.
- No hacer `git commit` salvo que el usuario lo pida explícitamente.
- Mantener el mecanismo genérico de scroll-spy (`section[id]` + `.header__link[data-section]`) intacto: no requiere cambios de JS al reordenar secciones, solo mover el HTML.
- Todo texto de precios/servicios ya existente debe permanecer exacto (no se toca contenido de `#ciberseguridad`, `#software-critico`, `#automatizacion-ia`, `#contacto`, aviso de privacidad).

---

### Task 1: Quitar el modelo 3D del hero de inicio

**Files:**
- Modify: `index.html` (sección `<section class="intro" id="inicio">`, líneas ~186-237 aprox.; y el `<script>` de carga perezosa de `vendor/model-viewer.min.js` al final del `<body>`)
- Modify: `Script.js` (función `inicializarLaptop3D()` y su llamada en `pasoSeguro(...)`)
- Modify: `styles.css` (reglas de `.intro__visual` y el contenedor del `<model-viewer>`; `.intro__container` pasa de 2 columnas a 1)

**Interfaces:**
- Produces: `.intro` queda como sección de una sola columna (texto centrado: tag, `h1`, descripción, botones, cifras de confianza). Ningún otro archivo depende de `#intro-laptop`.

- [ ] **Paso 1:** En `index.html`, dentro de `.intro__container`, eliminar el bloque `.intro__visual` completo (el que contiene `<model-viewer id="intro-laptop">`), dejando solo `.intro__info`.
- [ ] **Paso 2:** Quitar el `<script>` al final del `<body>` que hace `requestIdleCallback(cargarVisor3D, ...)` / carga `vendor/model-viewer.min.js`.
- [ ] **Paso 3:** En `Script.js`, eliminar la función `inicializarLaptop3D()` completa y su llamada (`pasoSeguro('laptop-3d', inicializarLaptop3D)` o como esté registrada).
- [ ] **Paso 4:** En `styles.css`, eliminar las reglas exclusivas de `.intro__visual` y sus hijos (contenedor del `model-viewer`, animaciones asociadas). Cambiar `.intro__container` de grid de 2 columnas a 1 columna centrada (ajustar `max-width` del `.intro__info` para que no quede demasiado ancho en pantallas grandes).
- [ ] **Paso 5 (verificación):** Ejecutar:
  ```bash
  grep -rn "intro-laptop\|inicializarLaptop3D\|model-viewer\|intro__visual" index.html Script.js styles.css
  ```
  Esperado: sin resultados (0 coincidencias).
- [ ] **Paso 6 (verificación):**
  ```bash
  grep -n "vendor/model-viewer" index.html
  ```
  Esperado: sin resultados. (El archivo `vendor/model-viewer.min.js` puede quedar en disco sin usarse; no se borra.)

---

### Task 2: Quitar el carrusel de productos destacados (`#destacados`)

**Files:**
- Modify: `index.html` (sección `<section class="hero" id="destacados">`)
- Modify: `Script.js` (autoplay del carrusel, tilt de `heroProductVisual`/`productSvgContainer`, y cualquier función que solo exista para este carrusel — p. ej. navegación de slides, contador `01/08`)
- Modify: `styles.css` (reglas `.hero*` correspondientes a este carrusel — cuidado de no tocar `.header`, que también usa prefijos distintos)

**Interfaces:**
- Consumes: nada de tareas anteriores.
- Produces: ninguna otra sección depende de `#destacados`.

- [ ] **Paso 1:** Eliminar la sección `<section class="hero" id="destacados">` completa de `index.html`.
- [ ] **Paso 2:** En `Script.js`, eliminar: la lógica de autoplay del carrusel (`autoplayActivo`, `autoplayIntervalo`, `iniciarAutoplay`, `detenerAutoplay`, `reiniciarAutoplay`, `toggleAutoplay`, `actualizarIconoAutoplay`, listeners de `autoplayToggle`), la función `activarTiltHeroProducto()` y su llamada, y cualquier función de navegación de slides (buscar por `estaTransicionando`, `DURACION_TRANSICION`, `siguienteSlide`/`slideAnterior` o nombres equivalentes) que exista solo para este carrusel.
- [ ] **Paso 3:** En `styles.css`, eliminar las reglas de `.hero`, `.hero__*` (tag, title, product visual, controles, contador, autoplay toggle) — confirmar primero con grep que ningún selector `.hero__*` se reutiliza en otra sección antes de borrar cada bloque.
- [ ] **Paso 4 (verificación):**
  ```bash
  grep -n 'id="destacados"\|#destacados' index.html Script.js
  ```
  Esperado: sin resultados.
- [ ] **Paso 5 (verificación):**
  ```bash
  grep -n "heroProductVisual\|productSvgContainer\|autoplayToggle\|autoplayIntervalo" Script.js
  ```
  Esperado: sin resultados.

---

### Task 3: Quitar categorías de producto (`#productos`)

**Files:**
- Modify: `index.html` (sección `<section class="categories" id="productos">`)
- Modify: `Script.js` (click/keydown handler de `.category-card`, función `irAProductoDeCategoria`, llamada `activarTilt3D('.category-card', 6)`)
- Modify: `styles.css` (`.categories`, `.category-card*`)

**Interfaces:**
- Produces: ninguna otra sección depende de `#productos` ni de `.category-card`.

- [ ] **Paso 1:** Eliminar la sección `<section class="categories" id="productos">` completa (6 `.category-card`).
- [ ] **Paso 2:** En `Script.js`, eliminar el bloque `document.querySelectorAll('.category-card').forEach(...)` (click + keydown) y la función `irAProductoDeCategoria`. Quitar la llamada `activarTilt3D('.category-card', 6)` (dejar `activarTilt3D('.solution-card', 5)` intacta).
- [ ] **Paso 3:** En `styles.css`, eliminar `.categories`, `.categories__container`, `.categories__grid`, `.category-card` y todos sus modificadores/pseudo-clases (`__glow`, `__icon`, `__title`, `__desc`, `__link`, `--pulse`, `@keyframes cardPulse` **solo si** ya no la usa `.solution-card--pulse` — verificar antes de borrar el keyframe).
- [ ] **Paso 4 (verificación):**
  ```bash
  grep -n 'id="productos"\|#productos\|category-card\|data-categoria\|irAProductoDeCategoria' index.html Script.js styles.css
  ```
  Esperado: sin resultados.

---

### Task 4: Actualizar navegación (header, móvil, footer, CTA final)

**Files:**
- Modify: `index.html` (`header__menu`, `mobile-menu__list`, lista de enlaces del footer, sección `.cta` final, `.intro__scroll-cue`)

**Interfaces:**
- Consumes: Task 1-3 ya eliminaron `#destacados` y `#productos`, así que ningún enlace debe apuntar ahí después de esta tarea.

- [ ] **Paso 1:** Quitar el `<li>` con el link "Productos" (`data-section="productos"`) del `header__menu` (escritorio) y del `mobile-menu__list` (móvil).
- [ ] **Paso 2:** Quitar el link "Productos" de la lista de enlaces del footer.
- [ ] **Paso 3:** En la sección `.cta` final, quitar el botón `<a href="#productos" class="btn btn--outline-light btn--lg">Explorar catálogo</a>`, dejando solo el botón "Solicitar asesoría" (ajustar `.cta__actions` si el CSS asume 2 botones — revisar `justify-content`/`gap`, debe verse bien con 1 solo botón centrado).
- [ ] **Paso 4:** Cambiar `<a href="#destacados" class="intro__scroll-cue" ...>` a `href="#ciberseguridad"`.
- [ ] **Paso 5:** Cambiar el botón `<a href="#soluciones" class="btn btn--gold">Ver soluciones</a>` del hero de inicio a `href="#ciberseguridad"` (la nueva primera sección de contenido tras el hero).
- [ ] **Paso 6 (verificación):**
  ```bash
  grep -n 'href="#productos"\|href="#destacados"\|data-section="productos"' index.html
  ```
  Esperado: sin resultados.

---

### Task 5: Reducir y renombrar `#soluciones` → "Otros servicios"

**Files:**
- Modify: `index.html` (sección `<section class="solutions" id="soluciones">`: `.section-header` y las 6 `.solution-card`; dropdown "Soluciones" del header y submenú móvil equivalente)

**Interfaces:**
- Consumes: clases CSS `.solution-card` ya existentes (Task de sesiones anteriores) — no se tocan, solo se elimina el markup de 2 de las 6 tarjetas.

- [ ] **Paso 1:** Eliminar las tarjetas `data-solution="desarrollo"` (la grande, con lista) y `data-solution="automatizacion"` de `.solutions__layout`. Quedan 4: `datos-ia`, `marketing`, `consultoria`, `ecommerce`.
- [ ] **Paso 2:** Como ya no queda ninguna tarjeta `--large`, revisar `styles.css` → `.solutions__layout` (`grid-template-columns: 1.3fr 1fr 1fr; grid-template-rows: auto auto;`) y cambiarlo a un grid simple de 4 columnas iguales en desktop (`repeat(4, 1fr)`) que colapse a 2 y luego a 1 en los breakpoints existentes (1024px / 768px, mismo patrón que `.solutions__layout--software`).
- [ ] **Paso 3:** Actualizar `.section-header__tag` de "SOLUCIONES INTEGRALES" a "OTROS SERVICIOS", el `h2` a algo como "Otros servicios que también ofrecemos", y la descripción para que no mencione desarrollo/automatización (ya cubiertos en sus propias secciones).
- [ ] **Paso 4:** En el dropdown "Soluciones" del header (desktop) y su submenú móvil equivalente, eliminar los `<li>` con `data-solution="desarrollo"` y `data-solution="automatizacion"`. Cambiar el texto visible del botón/toggle de "Soluciones" a "Otros servicios" (desktop `header__dropdown-toggle` y móvil `mobile-menu__sub-toggle` correspondientes) — mantener los `id` existentes tal cual para no romper el JS que los referencia por `getElementById`.
- [ ] **Paso 5 (verificación):**
  ```bash
  grep -n 'data-solution="desarrollo"\|data-solution="automatizacion"' index.html
  ```
  Esperado: sin resultados.
- [ ] **Paso 6 (verificación):** Confirmar que `Script.js` no referencia `data-solution="desarrollo"` ni `"automatizacion"` por valor literal (el manejo es genérico vía atributo, así que no debería requerir cambios — solo confirmar con grep que no hay hardcodeo).

---

### Task 6: Reordenar secciones

**Files:**
- Modify: `index.html` (mover bloques de sección completos; no se edita contenido interno salvo lo ya cubierto en tareas anteriores)

**Interfaces:**
- Consumes: todas las secciones ya limpias de Tasks 1-5.
- Produces: orden final en el DOM: `#inicio` → `#ciberseguridad` → `#software-critico` → `#automatizacion-ia` → `#simulador` → `#soluciones` → `#proceso` → `#nosotros` → `#testimonios` → `#faq` → `#contacto`.

- [ ] **Paso 1:** Mover el bloque `<section class="cyber" id="ciberseguridad">...</section>` completo para que quede inmediatamente después de `</section>` de `#inicio`.
- [ ] **Paso 2:** Mover `<section class="software-critico" id="software-critico">...</section>` justo después de `#ciberseguridad`.
- [ ] **Paso 3:** Mover `<section class="automation-ia" id="automatizacion-ia">...</section>` justo después de `#software-critico`.
- [ ] **Paso 4:** Mover `<section class="simulator" id="simulador">...</section>` justo después de `#automatizacion-ia`.
- [ ] **Paso 5:** Confirmar que lo que queda a continuación, en este orden, es: `#soluciones` (ya renombrada/reducida en Task 5), `#proceso`, `#nosotros`, `#testimonios`, `#faq`, `#contacto` — sin necesidad de mover estas, ya quedan en su lugar tras extraer las 4 secciones anteriores.
- [ ] **Paso 6 (verificación):**
  ```bash
  grep -n '<section class="[a-z-]* " *id="' index.html
  grep -n 'id="inicio"\|id="ciberseguridad"\|id="software-critico"\|id="automatizacion-ia"\|id="simulador"\|id="soluciones"\|id="proceso"\|id="nosotros"\|id="testimonios"\|id="faq"\|id="contacto"' index.html
  ```
  Esperado: los `id` aparecen en ese orden exacto de arriba hacia abajo.

---

### Task 7: Editar testimonio, FAQ y limpiar copy residual de hardware

**Files:**
- Modify: `index.html` (`.testimonials__grid` — testimonio de Lucía Contreras; `.faq__item` — pregunta de tiempos de implementación)

- [ ] **Paso 1:** Reemplazar el texto del testimonio de Lucía Contreras (Corporativo Altamira) — actualmente `"Buscábamos renovar todo nuestro equipo de cómputo sin parar operaciones. Aureo lo planeó por etapas y cumplió cada fecha comprometida."` — por: `"Necesitábamos un proveedor que entendiera nuestra operación antes de proponer nada. Aureo lo planeó por etapas y cumplió cada fecha comprometida."` (mantener nombre, cargo y empresa igual).
  ```html
  <p class="testimonial-card__quote">"Necesitábamos un proveedor que entendiera nuestra operación antes de proponer nada. Aureo lo planeó por etapas y cumplió cada fecha comprometida."</p>
  ```
- [ ] **Paso 2:** En la respuesta FAQ de "¿Cuánto tiempo toma implementar una solución?", quitar la cláusula de suministro de equipo. Cambiar:
  `"Depende del alcance: un suministro de equipo puede resolverse en días, mientras que un desarrollo a medida o una automatización de procesos suele tomar entre 3 y 10 semanas. Esto se define en la propuesta inicial."`
  por:
  `"Depende del alcance: un desarrollo a medida o una automatización de procesos suele tomar entre 3 y 10 semanas; el aseguramiento de servidores queda operando desde la primera semana tras el diagnóstico. Esto se define en la propuesta inicial."`
- [ ] **Paso 3 (verificación):**
  ```bash
  grep -n "equipo de cómputo\|suministro de equipo" index.html
  ```
  Esperado: sin resultados.

---

### Task 8: Limpiar meta/SEO/`llms.txt` de menciones a hardware

**Files:**
- Modify: `index.html` (`<meta name="keywords">`, JSON-LD `Organization`)
- Modify: `llms.txt`

- [ ] **Paso 1:** En `<meta name="keywords">`, quitar `"suministro de equipo de cómputo"` de la lista.
- [ ] **Paso 2:** En el JSON-LD `"@type":["Organization","LocalBusiness"]`, editar el campo `"description"` para quitar la cláusula `"y suministro de equipo tecnológico"`.
- [ ] **Paso 3:** En `llms.txt`, quitar por completo la sección `### Soluciones y suministro de equipo — https://aureo-systems.com/#soluciones y https://aureo-systems.com/#productos`, y agregar en su lugar una entrada corta para los servicios que sí siguen (Datos e IA, Marketing digital, Consultoría, Ecommerce) apuntando a `https://aureo-systems.com/#soluciones` (ya renombrada "Otros servicios" en Task 5).
- [ ] **Paso 4 (verificación):**
  ```bash
  grep -rn "suministro de equipo\|#productos" index.html llms.txt
  ```
  Esperado: sin resultados.

---

### Task 9: Verificación final en navegador

**Files:** ninguno (solo QA visual, mismo método usado en el resto de la sesión: servidor local + `claude-in-chrome`).

- [ ] **Paso 1:** Levantar servidor local (`python -m http.server`) y abrir el sitio.
- [ ] **Paso 2:** Revisar consola sin errores (`read_console_messages`, `onlyErrors: true`).
- [ ] **Paso 3:** Recorrer la página completa en modo oscuro: header (sin "Productos", dropdown "Otros servicios" con 4 tarjetas), hero de inicio sin visual 3D, orden de secciones correcto, sección "Otros servicios" con grid de 4 sin huecos, testimonios (2 o 3 con el texto nuevo), FAQ.
- [ ] **Paso 4:** Repetir el recorrido en modo claro.
- [ ] **Paso 5:** Repetir en viewport móvil: menú hamburguesa, submenú "Otros servicios" sin las 2 entradas quitadas.
- [ ] **Paso 6:** Confirmar con grep final de todo el repo (excluyendo `sitio/` y `docs/`) que no queda ninguna referencia a los identificadores eliminados:
  ```bash
  grep -rn "intro-laptop\|model-viewer\|#destacados\|#productos\|category-card\|heroProductVisual" \
    --include='*.html' --include='*.js' --include='*.css' \
    --exclude-dir=sitio --exclude-dir=docs --exclude-dir=vendor .
  ```
  Esperado: sin resultados.
