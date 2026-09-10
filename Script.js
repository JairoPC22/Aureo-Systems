/* ============================================
   AUREO SYSTEMS CONSULTING - LANDING PAGE
   Script.js
   7.2
   ============================================ */

(function () {
    'use strict';

    // --- Este sitio no usa ni necesita Service Worker. Si el navegador tiene uno
    //     activo para este origen (de una prueba anterior, otro proyecto en el
    //     mismo puerto, etc.) lo desregistramos: un Service Worker viejo puede
    //     interceptar peticiones (fuentes, video) y responderlas mal, rompiendo
    //     cosas que en el código de esta página funcionan bien. ---
    if ('serviceWorker' in navigator && navigator.serviceWorker.getRegistrations) {
        navigator.serviceWorker.getRegistrations().then(function (registros) {
            registros.forEach(function (registro) { registro.unregister(); });
        }).catch(function () { /* nada que hacer si el navegador lo bloquea */ });
    }


    // --- Elementos del DOM ---
    const header = document.getElementById('header');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-close');
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const mobileSolucionesToggle = document.getElementById('mobile-soluciones-toggle');
    const mobileSolucionesSub = document.getElementById('mobile-soluciones-sub');
    const dropdownToggleServicios = document.getElementById('dropdown-toggle-servicios');
    const dropdownMenuServicios = document.getElementById('dropdown-menu-servicios');
    const mobileServiciosToggle = document.getElementById('mobile-servicios-toggle');
    const mobileServiciosSub = document.getElementById('mobile-servicios-sub');
    const scrollTopBtn = document.getElementById('scroll-top');
    const contactForm = document.getElementById('contact-form');
    const currentYearSpan = document.getElementById('current-year');
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');


    // --- Header scroll ---
    function actualizarHeaderScroll() {
        if (window.scrollY > 40) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        // Scroll top button
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('scroll-top--visible');
        } else {
            scrollTopBtn.classList.remove('scroll-top--visible');
        }
    }
    window.addEventListener('scroll', alHacerScroll(actualizarHeaderScroll), { passive: true });
    actualizarHeaderScroll();

    // --- Menú móvil ---
    function abrirMenuMovil() {
        mobileMenu.classList.add('mobile-menu--open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        hamburgerBtn.setAttribute('aria-label', 'Cerrar menú');
        document.body.style.overflow = 'hidden';
    }

    function cerrarMenuMovil() {
        mobileMenu.classList.remove('mobile-menu--open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
        // Cerrar submenú móvil también
        mobileSolucionesSub.classList.remove('mobile-menu__sub--open');
        mobileSolucionesSub.setAttribute('aria-hidden', 'true');
        mobileSolucionesToggle.setAttribute('aria-expanded', 'false');
        if (mobileServiciosSub && mobileServiciosToggle) {
            mobileServiciosSub.classList.remove('mobile-menu__sub--open');
            mobileServiciosSub.setAttribute('aria-hidden', 'true');
            mobileServiciosToggle.setAttribute('aria-expanded', 'false');
        }
    }

    hamburgerBtn.addEventListener('click', function () {
        if (mobileMenu.classList.contains('mobile-menu--open')) {
            cerrarMenuMovil();
        } else {
            abrirMenuMovil();
        }
    });

    mobileClose.addEventListener('click', cerrarMenuMovil);
    mobileMenu.querySelector('.mobile-menu__backdrop').addEventListener('click', cerrarMenuMovil);

    // Submenú soluciones móvil
    mobileSolucionesToggle.addEventListener('click', function () {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        if (expanded) {
            mobileSolucionesSub.classList.remove('mobile-menu__sub--open');
            mobileSolucionesSub.setAttribute('aria-hidden', 'true');
        } else {
            mobileSolucionesSub.classList.add('mobile-menu__sub--open');
            mobileSolucionesSub.setAttribute('aria-hidden', 'false');
        }
    });

    // Submenú servicios móvil
    if (mobileServiciosToggle && mobileServiciosSub) {
        mobileServiciosToggle.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            if (expanded) {
                mobileServiciosSub.classList.remove('mobile-menu__sub--open');
                mobileServiciosSub.setAttribute('aria-hidden', 'true');
            } else {
                mobileServiciosSub.classList.add('mobile-menu__sub--open');
                mobileServiciosSub.setAttribute('aria-hidden', 'false');
            }
        });
    }

    // Cerrar menú móvil al seleccionar enlace
    const mobileLinks = mobileMenu.querySelectorAll('a[data-section], .mobile-menu__sublink');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function () {
            cerrarMenuMovil();
        });
    });

    // --- Aviso de privacidad (modal) ---
    const privacyModal = document.getElementById('privacy-modal');
    let ultimoElementoEnfocadoPrivacidad = null;
    const privacyModalTocToggle = document.getElementById('privacy-modal-toc-toggle');
    const privacyModalTocPanel = document.getElementById('privacy-modal-toc-panel');

    function cerrarPrivacyModal() {
        if (!privacyModal) return;
        cerrarPrivacyTocPanel(false);
        privacyModal.classList.remove('privacy-modal--open');
        privacyModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('privacy-modal-open');
        if (ultimoElementoEnfocadoPrivacidad && typeof ultimoElementoEnfocadoPrivacidad.focus === 'function') {
            ultimoElementoEnfocadoPrivacidad.focus();
        }
    }

    // Índice desplegable: abre/cierra el panel con todas las secciones sin ocupar una columna fija
    function abrirPrivacyTocPanel() {
        if (!privacyModalTocPanel || !privacyModalTocToggle) return;
        privacyModalTocPanel.hidden = false;
        privacyModalTocToggle.setAttribute('aria-expanded', 'true');
        // Limita la altura al espacio real hasta el footer para que el panel nunca lo tape
        const footer = privacyModal && privacyModal.querySelector('.privacy-modal__footer');
        if (footer) {
            const espacioDisponible = footer.getBoundingClientRect().top - privacyModalTocPanel.getBoundingClientRect().top - 16;
            privacyModalTocPanel.style.maxHeight = Math.max(160, espacioDisponible) + 'px';
        }
    }
    function cerrarPrivacyTocPanel(restaurarFoco) {
        if (!privacyModalTocPanel || !privacyModalTocToggle) return;
        if (privacyModalTocPanel.hidden) return;
        privacyModalTocPanel.hidden = true;
        privacyModalTocToggle.setAttribute('aria-expanded', 'false');
        if (restaurarFoco !== false) {
            privacyModalTocToggle.focus();
        }
    }
    if (privacyModalTocToggle && privacyModalTocPanel) {
        privacyModalTocToggle.addEventListener('click', function () {
            if (privacyModalTocPanel.hidden) {
                abrirPrivacyTocPanel();
            } else {
                cerrarPrivacyTocPanel(false);
            }
        });
        // Cierra el panel al hacer clic fuera de él y del botón que lo abre
        document.addEventListener('click', function (e) {
            if (privacyModalTocPanel.hidden) return;
            if (privacyModalTocPanel.contains(e.target) || privacyModalTocToggle.contains(e.target)) return;
            cerrarPrivacyTocPanel(false);
        });
    }

    if (privacyModal) {
        const privacyModalPanel = privacyModal.querySelector('.privacy-modal__panel');
        const privacyModalBackdrop = document.getElementById('privacy-modal-backdrop');
        const privacyModalBody = document.getElementById('privacy-modal-body');
        const privacyModalClose = document.getElementById('privacy-modal-close');
        const privacyModalAccept = document.getElementById('privacy-modal-accept');
        const privacyModalProgressBar = document.getElementById('privacy-modal-progress-bar');
        const openPrivacyTriggers = document.querySelectorAll('#open-privacy-modal');
        const privacyTocButtons = privacyModal.querySelectorAll('.privacy-modal__toc-grid button[data-target]');
        const privacySections = privacyModal.querySelectorAll('.privacy-modal__section[id]');
        const privacyQuicknavNum = document.getElementById('privacy-quicknav-num');
        const privacyQuicknavLabel = document.getElementById('privacy-quicknav-label');
        const privacyQuicknavCount = document.getElementById('privacy-quicknav-count');

        function abrirPrivacyModal(disparador) {
            ultimoElementoEnfocadoPrivacidad = disparador || document.activeElement;
            privacyModal.classList.add('privacy-modal--open');
            privacyModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('privacy-modal-open');
            if (privacyModalBody) privacyModalBody.scrollTop = 0;
            if (privacyModalClose) privacyModalClose.focus();
        }

        openPrivacyTriggers.forEach(function (trigger) {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                abrirPrivacyModal(trigger);
            });
        });

        if (privacyModalClose) privacyModalClose.addEventListener('click', cerrarPrivacyModal);
        if (privacyModalAccept) privacyModalAccept.addEventListener('click', cerrarPrivacyModal);
        if (privacyModalBackdrop) privacyModalBackdrop.addEventListener('click', cerrarPrivacyModal);

        // Refleja la sección activa en la barra compacta (número, nombre y "x / total")
        function actualizarQuicknav(boton) {
            if (!boton) return;
            const num = boton.querySelector('.privacy-modal__toc-num');
            const nombre = boton.querySelector('.privacy-modal__toc-name');
            if (privacyQuicknavNum && num) privacyQuicknavNum.textContent = num.textContent.replace('.', '');
            if (privacyQuicknavLabel && nombre) privacyQuicknavLabel.textContent = nombre.textContent;
            if (privacyQuicknavCount) {
                const indice = Array.prototype.indexOf.call(privacyTocButtons, boton) + 1;
                privacyQuicknavCount.textContent = indice + ' / ' + privacyTocButtons.length;
            }
        }

        function marcarBotonActivo(boton) {
            if (!boton) return;
            privacyTocButtons.forEach(function (b) { b.classList.remove('is-active'); });
            boton.classList.add('is-active');
            actualizarQuicknav(boton);
        }

        // Navegación del índice: salta a la sección dentro del propio modal
        const prefiereMovimientoReducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        privacyTocButtons.forEach(function (boton) {
            boton.addEventListener('click', function () {
                const destino = document.getElementById(this.getAttribute('data-target'));
                if (!destino) return;
                marcarBotonActivo(this);
                cerrarPrivacyTocPanel(false);
                destino.scrollIntoView({ behavior: prefiereMovimientoReducido ? 'auto' : 'smooth', block: 'start' });
            });
        });

        // Barra de progreso de lectura, según el scroll del contenido.
        // Al llegar al final, fuerza la última sección como activa: el observer de scroll
        // (rootMargin -70%) puede no disparar ahí si el resto del documento es corto.
        if (privacyModalBody && privacyModalProgressBar) {
            const actualizarProgresoPrivacidad = function () {
                const recorrido = privacyModalBody.scrollHeight - privacyModalBody.clientHeight;
                const porcentaje = recorrido > 0 ? (privacyModalBody.scrollTop / recorrido) * 100 : 0;
                privacyModalProgressBar.style.width = Math.min(100, Math.max(0, porcentaje)) + '%';
                if (recorrido > 0 && porcentaje >= 99 && privacyTocButtons.length) {
                    marcarBotonActivo(privacyTocButtons[privacyTocButtons.length - 1]);
                }
            };
            privacyModalBody.addEventListener('scroll', actualizarProgresoPrivacidad, { passive: true });
            actualizarProgresoPrivacidad();
        }

        // Resalta la sección visible mientras se hace scroll (scrollspy) y sincroniza la barra compacta
        if (privacySections.length && typeof IntersectionObserver === 'function') {
            const observadorSecciones = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    const boton = privacyModal.querySelector('.privacy-modal__toc-grid button[data-target="' + entry.target.id + '"]');
                    marcarBotonActivo(boton);
                });
            }, { root: privacyModalBody, rootMargin: '0px 0px -70% 0px', threshold: 0 });
            privacySections.forEach(function (seccion) { observadorSecciones.observe(seccion); });
        }

        // Atrapar el foco dentro del modal mientras está abierto (accesibilidad con teclado)
        if (privacyModalPanel) {
            privacyModalPanel.addEventListener('keydown', function (e) {
                if (e.key !== 'Tab' || !privacyModal.classList.contains('privacy-modal--open')) return;
                const enfocables = privacyModalPanel.querySelectorAll(
                    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!enfocables.length) return;
                const primero = enfocables[0];
                const ultimo = enfocables[enfocables.length - 1];
                if (e.shiftKey && document.activeElement === primero) {
                    e.preventDefault();
                    ultimo.focus();
                } else if (!e.shiftKey && document.activeElement === ultimo) {
                    e.preventDefault();
                    primero.focus();
                }
            });
        }
    }

    // Escape para cerrar menú
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (mobileMenu.classList.contains('mobile-menu--open')) {
                cerrarMenuMovil();
            }
            if (dropdownMenu.classList.contains('header__dropdown-menu--visible')) {
                cerrarDropdown();
            }
            if (dropdownMenuServicios && dropdownMenuServicios.classList.contains('header__dropdown-menu--visible')) {
                cerrarDropdownServicios();
            }
            if (privacyModalTocPanel && !privacyModalTocPanel.hidden) {
                cerrarPrivacyTocPanel();
                return;
            }
            if (privacyModal && privacyModal.classList.contains('privacy-modal--open')) {
                cerrarPrivacyModal();
            }
        }
    });

    // --- Dropdown de soluciones (escritorio) ---
    function abrirDropdown() {
        dropdownMenu.classList.add('header__dropdown-menu--visible');
        dropdownToggle.setAttribute('aria-expanded', 'true');
    }

    function cerrarDropdown() {
        dropdownMenu.classList.remove('header__dropdown-menu--visible');
        dropdownToggle.setAttribute('aria-expanded', 'false');
    }

    dropdownToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (dropdownMenu.classList.contains('header__dropdown-menu--visible')) {
            cerrarDropdown();
        } else {
            if (dropdownMenuServicios) dropdownMenuServicios.classList.remove('header__dropdown-menu--visible');
            if (dropdownToggleServicios) dropdownToggleServicios.setAttribute('aria-expanded', 'false');
            abrirDropdown();
        }
    });

    dropdownToggle.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' && !dropdownMenu.classList.contains('header__dropdown-menu--visible')) {
            e.preventDefault();
            abrirDropdown();
            const firstLink = dropdownMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    });

    document.addEventListener('click', function (e) {
        if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
            cerrarDropdown();
        }
    });

    // Cerrar dropdown al seleccionar enlace
    dropdownMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            cerrarDropdown();
        });
    });

    // --- Dropdown de servicios (mega-menú, escritorio) ---
    function abrirDropdownServicios() {
        dropdownMenuServicios.classList.add('header__dropdown-menu--visible');
        dropdownToggleServicios.setAttribute('aria-expanded', 'true');
    }

    function cerrarDropdownServicios() {
        dropdownMenuServicios.classList.remove('header__dropdown-menu--visible');
        dropdownToggleServicios.setAttribute('aria-expanded', 'false');
    }

    if (dropdownToggleServicios && dropdownMenuServicios) {
        dropdownToggleServicios.addEventListener('click', function (e) {
            e.stopPropagation();
            if (dropdownMenuServicios.classList.contains('header__dropdown-menu--visible')) {
                cerrarDropdownServicios();
            } else {
                cerrarDropdown();
                abrirDropdownServicios();
            }
        });

        dropdownToggleServicios.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown' && !dropdownMenuServicios.classList.contains('header__dropdown-menu--visible')) {
                e.preventDefault();
                abrirDropdownServicios();
                const firstLink = dropdownMenuServicios.querySelector('a');
                if (firstLink) firstLink.focus();
            }
        });

        document.addEventListener('click', function (e) {
            if (!dropdownToggleServicios.contains(e.target) && !dropdownMenuServicios.contains(e.target)) {
                cerrarDropdownServicios();
            }
        });

        dropdownMenuServicios.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                cerrarDropdownServicios();
            });
        });
    }

    // --- Ejecuta un callback como máximo una vez por frame mientras hay scroll,
    //     en vez de una vez por cada evento "scroll" (que puede disparar decenas
    //     de veces por segundo). Evita bloquear el hilo principal en scroll. ---
    function alHacerScroll(cb) {
        let programado = false;
        return function () {
            if (programado) return;
            programado = true;
            requestAnimationFrame(function () {
                programado = false;
                cb();
            });
        };
    }

    // --- Navegación activa por scroll ---
    const secciones = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link[data-section]');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu__link[data-section]');

    // offsetTop/offsetHeight fuerzan un recálculo de layout: se cachean una sola
    // vez (y al redimensionar) en lugar de leerse en cada evento de scroll.
    let seccionesCache = [];
    function recalcularSeccionesCache() {
        seccionesCache = Array.prototype.map.call(secciones, function (sec) {
            return { id: sec.getAttribute('id'), top: sec.offsetTop, height: sec.offsetHeight };
        });
    }
    recalcularSeccionesCache();
    window.addEventListener('resize', alHacerScroll(recalcularSeccionesCache), { passive: true });
    window.addEventListener('load', recalcularSeccionesCache);

    function actualizarNavActiva() {
        let scrollPos = window.scrollY + 150;
        seccionesCache.forEach(function (sec) {
            if (scrollPos >= sec.top && scrollPos < sec.top + sec.height) {
                navLinks.forEach(link => {
                    link.classList.remove('header__link--active');
                    if (link.getAttribute('data-section') === sec.id) {
                        link.classList.add('header__link--active');
                    }
                });
                mobileNavLinks.forEach(link => {
                    if (link.getAttribute('data-section') === sec.id) {
                        link.style.color = 'var(--gold-elegant)';
                    } else {
                        link.style.color = '';
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', alHacerScroll(actualizarNavActiva), { passive: true });

    // --- Scroll top button ---
    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Smooth scroll para enlaces internos ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                if (target.tagName === 'DETAILS') target.open = true;
                const offset = header.offsetHeight + 16;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Soluciones: resaltar la tarjeta correspondiente al hacer clic en el menú ---
    function resaltarSolucion(id) {
        const tarjeta = document.querySelector(`.solution-card[data-solution="${id}"]`);
        if (!tarjeta) return;
        document.querySelectorAll('.solution-card--active').forEach(el => el.classList.remove('solution-card--active'));
        tarjeta.classList.add('solution-card--active');
        tarjeta.classList.add('solution-card--pulse');
        setTimeout(() => tarjeta.classList.remove('solution-card--pulse'), 1000);
        setTimeout(() => tarjeta.classList.remove('solution-card--active'), 2600);
    }

    document.querySelectorAll('[data-solution]').forEach(link => {
        if (link.classList.contains('solution-card')) return;
        link.addEventListener('click', function () {
            const id = this.getAttribute('data-solution');
            setTimeout(() => resaltarSolucion(id), 350);
        });
    });

    // --- Animaciones al entrar en pantalla (con cascada por grupo) ---
    function observarFadeIn() {
        // Sin soporte de IntersectionObserver no ocultamos nada: mejor mostrar
        // el contenido siempre que arriesgarnos a dejarlo invisible sin forma de revelarlo.
        if (typeof IntersectionObserver !== 'function') return;

        const grupos = [
            '.solution-card',
            '.process-step',
            '.simulator__panel',
            '.testimonial-card',
            '.faq__item',
            '.contact__form, .contact__info-card',
            '.showcase-card'
        ];

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

        grupos.forEach(function (selector) {
            const elementos = document.querySelectorAll(selector);
            elementos.forEach(function (el, i) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                const retraso = (i % 6) * 0.08;
                el.style.transition = `opacity 0.7s ease ${retraso}s, transform 0.7s ease ${retraso}s`;
                observer.observe(el);
            });
        });
    }

    // --- Inclinación 3D sutil en tarjetas (categorías y soluciones) ---
    function activarTilt3D(selector, intensidad) {
        const elementos = document.querySelectorAll(selector);
        elementos.forEach(el => {
            let frame = null;
            el.addEventListener('mousemove', (e) => {
                if (frame) cancelAnimationFrame(frame);
                frame = requestAnimationFrame(() => {
                    const rect = el.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    el.style.transform = `perspective(800px) rotateY(${x * intensidad}deg) rotateX(${-y * intensidad}deg) translateY(-4px)`;
                });
            });
            el.addEventListener('mouseleave', () => {
                if (frame) cancelAnimationFrame(frame);
                el.style.transform = '';
            });
        });
    }

    // --- GSAP (~72 KB) solo hace falta para el trazo animado de una palabra:
    //     se carga en segundo plano cuando el navegador está libre, en vez de
    //     bloquear el arranque de toda la página con una etiqueta <script>
    //     normal. Mismo patrón que la carga diferida del visor 3D. ---
    function cargarGsapYStrokeText() {
        function cargar() {
            if (typeof gsap !== 'undefined') {
                inicializarStrokeText('.intro__title-accent');
                return;
            }
            const script = document.createElement('script');
            script.src = 'vendor/gsap.min.js';
            script.onload = function () { inicializarStrokeText('.intro__title-accent'); };
            script.onerror = function () { console.warn('No se pudo cargar GSAP; la palabra del hero se queda con su color dorado normal.'); };
            document.head.appendChild(script);
        }
        if ('requestIdleCallback' in window) {
            requestIdleCallback(cargar, { timeout: 2000 });
        } else {
            setTimeout(cargar, 200);
        }
    }

    // --- Texto con trazo animado (basado en StrokeText de React Bits, portado
    //     a JS plano ya que este sitio no usa React): dibuja el contorno de la
    //     palabra letra por letra y luego la rellena. Se aplica solo a la
    //     palabra dorada del titular del hero, no a todo el encabezado, para
    //     no tener que reimplementar el salto de línea responsivo del <h1>. ---
    function inicializarStrokeText(selector) {
        const el = document.querySelector(selector);
        if (!el || typeof gsap === 'undefined') return;

        const texto = el.textContent.trim();
        if (!texto) return;

        const svgNS = 'http://www.w3.org/2000/svg';
        const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function construir() {
            const estilo = getComputedStyle(el);
            const fontSize = parseFloat(estilo.fontSize) || 32;
            const strokeWidth = Math.max(fontSize * 0.012, 1);
            const dash = fontSize * 6;

            el.innerHTML = '';
            el.setAttribute('role', 'img');
            el.setAttribute('aria-label', texto);

            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            svg.style.display = 'block';
            svg.style.overflow = 'visible';

            function crearTexto(esTrazo) {
                const textoSvg = document.createElementNS(svgNS, 'text');
                textoSvg.setAttribute('x', '0');
                textoSvg.setAttribute('y', '0');
                textoSvg.style.fontFamily = estilo.fontFamily;
                textoSvg.style.fontWeight = estilo.fontWeight;
                textoSvg.style.letterSpacing = estilo.letterSpacing;
                textoSvg.style.fontSize = fontSize + 'px';
                if (esTrazo) {
                    textoSvg.style.fill = 'none';
                    textoSvg.style.stroke = 'var(--gold-elegant)';
                    textoSvg.style.strokeWidth = strokeWidth + 'px';
                    textoSvg.style.strokeLinejoin = 'round';
                    textoSvg.style.strokeLinecap = 'round';
                    textoSvg.style.willChange = 'stroke-dashoffset';
                } else {
                    textoSvg.style.fill = 'var(--gold-elegant)';
                    textoSvg.style.stroke = 'none';
                }
                Array.from(texto).forEach(function (char) {
                    const tspan = document.createElementNS(svgNS, 'tspan');
                    tspan.textContent = char;
                    textoSvg.appendChild(tspan);
                });
                return textoSvg;
            }

            const textoTrazo = crearTexto(true);
            const textoRelleno = crearTexto(false);
            svg.appendChild(textoTrazo);
            svg.appendChild(textoRelleno);
            el.appendChild(svg);

            const bbox = textoTrazo.getBBox();
            if (!bbox || !bbox.width) return null;
            const pad = strokeWidth * 2;
            const caja = { x: bbox.x - pad, y: bbox.y - pad, width: bbox.width + pad * 2, height: bbox.height + pad * 2 };
            svg.setAttribute('viewBox', `${caja.x} ${caja.y} ${caja.width} ${caja.height}`);
            svg.style.width = caja.width + 'px';
            svg.style.height = caja.height + 'px';

            return { svg, textoTrazo, textoRelleno, dash };
        }

        function animar(partes) {
            const trazos = partes.textoTrazo.querySelectorAll('tspan');
            const rellenos = partes.textoRelleno.querySelectorAll('tspan');
            const stagger = 0.04;

            gsap.set(trazos, { strokeDasharray: partes.dash, strokeDashoffset: partes.dash });
            rellenos.forEach(function (tspan) { tspan.style.opacity = '0'; });

            if (prefiereMenosMovimiento) {
                gsap.set(trazos, { strokeDashoffset: 0 });
                rellenos.forEach(function (tspan) { tspan.style.opacity = '1'; });
                return;
            }

            // El callback de timeline (tl.call/delayedCall) no se ejecuta de
            // forma fiable en este proyecto, así que el segundo paso (relleno)
            // se agenda con un setTimeout normal en vez de encadenarlo en GSAP.
            const delayInicial = 350;
            const duracionTrazo = 1100;
            const totalTrazo = duracionTrazo + stagger * 1000 * (trazos.length - 1);

            gsap.to(trazos, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', stagger: stagger, delay: delayInicial / 1000 });

            setTimeout(function () {
                rellenos.forEach(function (tspan, i) {
                    tspan.style.transition = `opacity 0.5s ease ${i * stagger}s`;
                    requestAnimationFrame(function () { tspan.style.opacity = '1'; });
                });
            }, delayInicial + totalTrazo - 500);
        }

        function iniciar() {
            const partes = construir();
            if (partes) animar(partes);
        }

        // La tipografía del titular (Space Grotesk) se precarga en el <head>,
        // pero si por lo que sea no está lista todavía, se espera para medir
        // el ancho real de las letras y no dibujar con la fuente de respaldo.
        if (document.fonts && !document.fonts.check(`700 ${parseFloat(getComputedStyle(el).fontSize)}px ${getComputedStyle(el).fontFamily}`)) {
            document.fonts.ready.then(iniciar).catch(iniciar);
        } else {
            iniciar();
        }
    }

    // --- Contador animado para las cifras del hero (basado en CountUp de
    //     React Bits, portado a requestAnimationFrame en vez de la librería
    //     "motion" del original, que no hace falta para un conteo simple). ---
    function inicializarContadores(selector) {
        const elementos = document.querySelectorAll(selector);
        if (!elementos.length) return;

        function valorFinal(el) {
            return parseFloat(el.dataset.countTo) || 0;
        }

        const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefiereMenosMovimiento || typeof IntersectionObserver !== 'function') {
            elementos.forEach(function (el) { el.textContent = valorFinal(el); });
            return;
        }

        function easeOutExpo(t) {
            return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function animar(el) {
            const hasta = valorFinal(el);
            const duracion = 1400;
            const inicio = performance.now();
            function cuadro(timestamp) {
                const progreso = Math.min((timestamp - inicio) / duracion, 1);
                el.textContent = Math.round(hasta * easeOutExpo(progreso));
                if (progreso < 1) requestAnimationFrame(cuadro);
            }
            requestAnimationFrame(cuadro);
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animar(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        elementos.forEach(function (el) { observer.observe(el); });
    }

    // --- Mapa de contacto: el atributo loading="lazy" del navegador no evita
    //     que el iframe de Google Maps (~1.5 s de carga, el recurso más lento
    //     de toda la página) empiece a descargarse casi de inmediato aunque
    //     esté hasta el final de una página larga. Se retrasa a propósito con
    //     un IntersectionObserver hasta que el usuario se acerca de verdad. ---
    function inicializarMapaContacto() {
        const iframe = document.querySelector('.contact__map-frame');
        if (!iframe || !iframe.dataset.src) return;

        function cargar() {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
        }

        if (typeof IntersectionObserver !== 'function') {
            cargar();
            return;
        }
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    cargar();
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '300px' });
        observer.observe(iframe);
    }

    // --- Brillo especular en botones (basado en SpecularButton de React
    //     Bits, portado de WebGL/ogl a CSS puro): mientras el cursor está
    //     sobre el botón, un resplandor circular sigue su posición vía dos
    //     variables CSS (--mx, --my) leídas por el ::after en styles.css. ---
    function inicializarBotonesEspeculares() {
        const botones = document.querySelectorAll('.btn--specular');
        botones.forEach(function (boton) {
            boton.addEventListener('pointermove', function (e) {
                const rect = boton.getBoundingClientRect();
                boton.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
                boton.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
            });
        });
    }

    // --- Holograma 3D de la Tierra en el hero de marca: gira solo como un
    //     globo, combinando una rotación automática lenta y constante con un
    //     impulso extra ligado a cuánto se ha avanzado por la sección. Se
    //     puede arrastrar con el mouse/dedo para girarlo manualmente (solo
    //     rotación: zoom y pan están deshabilitados en el HTML); al soltar,
    //     retoma el giro automático desde donde haya quedado, sin saltos. ---
    function inicializarGlobo3D() {
        const globo = document.getElementById('intro-earth');
        const introSection = document.querySelector('.intro');
        if (!globo || !introSection) return;

        globo.addEventListener('error', function () {
            console.warn('El modelo 3D no pudo cargarse.');
        });

        // El campo de visión fijo (30deg) se ajustó mirando el recuadro de
        // escritorio; en celulares, con la caja más angosta, el anillo del
        // holograma queda casi pegado al borde y se ve recortado. En pantallas
        // chicas se abre un poco el ángulo (la cámara "se aleja") para dejarle
        // margen, sin tocar el encuadre de escritorio.
        function ajustarEncuadre3D() {
            var fov = window.innerWidth <= 480 ? '36deg' : '30deg';
            globo.setAttribute('field-of-view', fov);
            globo.setAttribute('min-field-of-view', fov);
            globo.setAttribute('max-field-of-view', fov);
        }
        ajustarEncuadre3D();
        window.addEventListener('resize', ajustarEncuadre3D);

        const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefiereMenosMovimiento) return; // se queda fijo en su ángulo inicial, sin animación

        const ORBIT_INICIAL = 180;
        const ORBIT_PHI = 65;
        const ORBIT_RADIO = '7m'; // distancia fija en metros (ver min/max-camera-orbit en el HTML): en % se re-normaliza al encuadre automático y no permite fijar el zoom
        const GRADOS_POR_SEGUNDO = 32; // rotación continua
        const GIRO_EXTRA_POR_SCROLL = 110; // grados adicionales al recorrer la sección completa

        let ultimoTimestamp = null;
        let anguloAcumulado = 0;
        let activo = true;
        let idAnimacion = null;
        let interactuando = false;

        function progresoScroll() {
            const rect = introSection.getBoundingClientRect();
            const alto = rect.height || window.innerHeight;
            return Math.min(Math.max(-rect.top / alto, 0), 1);
        }

        function cuadro(timestamp) {
            if (!activo) return;
            if (ultimoTimestamp === null) ultimoTimestamp = timestamp;
            const deltaSegundos = (timestamp - ultimoTimestamp) / 1000;
            ultimoTimestamp = timestamp;
            anguloAcumulado += GRADOS_POR_SEGUNDO * deltaSegundos;

            const theta = ORBIT_INICIAL + anguloAcumulado + progresoScroll() * GIRO_EXTRA_POR_SCROLL;
            globo.cameraOrbit = `${theta}deg ${ORBIT_PHI}deg ${ORBIT_RADIO}`;
            idAnimacion = requestAnimationFrame(cuadro);
        }

        // Solo animamos mientras la sección de inicio es visible, la pestaña
        // está activa y el usuario no lo está arrastrando en ese momento, para
        // no gastar CPU/batería de fondo ni pelear con su gesto.
        function iniciar() {
            if (idAnimacion || interactuando) return;
            activo = true;
            ultimoTimestamp = null;
            idAnimacion = requestAnimationFrame(cuadro);
        }
        function detener() {
            activo = false;
            if (idAnimacion) {
                cancelAnimationFrame(idAnimacion);
                idAnimacion = null;
            }
        }

        // Pausamos ANTES de que la cámara llegue a moverse (en pointerdown, no
        // esperamos al evento camera-change) para que nuestro giro automático
        // nunca alcance a pisar el primer instante del arrastre del usuario.
        function pausarPorInteraccion() {
            if (interactuando) return;
            interactuando = true;
            detener();
        }
        ['pointerdown', 'mousedown', 'touchstart'].forEach(function (evento) {
            globo.addEventListener(evento, pausarPorInteraccion, { passive: true });
        });
        ['pointerup', 'mouseup', 'touchend', 'pointercancel'].forEach(function (evento) {
            globo.addEventListener(evento, function () {
                if (!interactuando) return;
                setTimeout(function () {
                    interactuando = false;
                    // Retoma el giro automático desde el ángulo donde el usuario
                    // lo dejó, en vez de saltar de vuelta al ángulo anterior.
                    try {
                        const actual = globo.getCameraOrbit();
                        anguloAcumulado = (actual.theta * 180 / Math.PI) - ORBIT_INICIAL - progresoScroll() * GIRO_EXTRA_POR_SCROLL;
                    } catch (err) { /* si no está disponible, se sigue desde el último ángulo automático */ }
                    iniciar();
                }, 400);
            });
        });

        if (typeof IntersectionObserver === 'function') {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !document.hidden) {
                        iniciar();
                    } else {
                        detener();
                    }
                });
            }, { threshold: 0 });
            observer.observe(globo);
        } else {
            iniciar();
        }

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                detener();
            } else if (globo.getBoundingClientRect().bottom > 0) {
                iniciar();
            }
        });
    }

    // --- Modo claro / oscuro ---
    const THEME_KEY = 'aureo-theme';

    function aplicarTema(tema, guardar) {
        if (tema === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        actualizarIconosTema(tema);
        if (guardar) {
            try { localStorage.setItem(THEME_KEY, tema); } catch (err) { /* almacenamiento no disponible */ }
        }
    }

    function actualizarIconosTema(tema) {
        if (themeToggle) {
            const sun = themeToggle.querySelector('.theme-toggle__sun');
            const moon = themeToggle.querySelector('.theme-toggle__moon');
            if (tema === 'light') {
                sun.style.display = 'none';
                moon.style.display = 'block';
                themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
            } else {
                sun.style.display = 'block';
                moon.style.display = 'none';
                themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
            }
        }
    }

    function temaActual() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function alternarTema() {
        const nuevo = temaActual() === 'light' ? 'dark' : 'light';
        aplicarTema(nuevo, true);
    }

    function inicializarTema() {
        let temaGuardado = null;
        try { temaGuardado = localStorage.getItem(THEME_KEY); } catch (err) { /* almacenamiento no disponible */ }
        if (temaGuardado === 'light' || temaGuardado === 'dark') {
            aplicarTema(temaGuardado, false);
        } else {
            // Por defecto oscuro (el look pensado para la marca), sin importar
            // la preferencia del sistema: el usuario puede cambiarlo a mano
            // con el interruptor, y esa elección sí se recuerda.
            aplicarTema('dark', false);
        }
    }

    if (themeToggle) themeToggle.addEventListener('click', alternarTema);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', alternarTema);

    // Hacer que toda la fila "Modo claro" del menú móvil sea clicable, no solo el switch
    const mobileThemeRow = document.querySelector('.mobile-menu__theme');
    if (mobileThemeRow && themeToggleMobile) {
        mobileThemeRow.addEventListener('click', function (e) {
            if (e.target.closest('.theme-toggle--mobile')) return; // evita doble toggle si le dan justo al switch
            alternarTema();
        });
    }

    // --- Formulario de contacto ---
    function mostrarError(inputId, mensaje) {
        const errorEl = document.getElementById('error-' + inputId);
        const inputEl = document.getElementById(inputId);
        if (errorEl) errorEl.textContent = mensaje;
        if (inputEl) inputEl.classList.add('contact__input--error');
    }

    function limpiarError(inputId) {
        const errorEl = document.getElementById('error-' + inputId);
        const inputEl = document.getElementById(inputId);
        if (errorEl) errorEl.textContent = '';
        if (inputEl) inputEl.classList.remove('contact__input--error');
    }

    function validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validarFormulario() {
        let valido = true;
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        limpiarError('nombre');
        limpiarError('telefono');
        limpiarError('email');
        limpiarError('mensaje');

        if (!nombre) {
            mostrarError('nombre', 'El nombre es obligatorio.');
            valido = false;
        }
        if (!telefono) {
            mostrarError('telefono', 'El teléfono es obligatorio.');
            valido = false;
        }
        if (!email) {
            mostrarError('email', 'El correo electrónico es obligatorio.');
            valido = false;
        } else if (!validarEmail(email)) {
            mostrarError('email', 'Ingresa un correo electrónico válido.');
            valido = false;
        }
        if (!mensaje) {
            mostrarError('mensaje', 'El mensaje es obligatorio.');
            valido = false;
        }
        return valido;
    }

    let envioEnCurso = false;
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (envioEnCurso) return; // evita doble envío si el usuario hace click/Enter repetido
        if (!validarFormulario()) return;

        const submitBtn = contactForm.querySelector('.contact__submit');
        const labelEl = submitBtn ? submitBtn.querySelector('.contact__submit-label') : null;
        const textoOriginal = labelEl ? labelEl.textContent : '';
        const successEl = document.getElementById('contact-success');
        const errorEl = document.getElementById('contact-error');
        const errorTextEl = document.getElementById('contact-error-text');
        const mensajeErrorPorDefecto = errorTextEl ? errorTextEl.textContent : '';

        envioEnCurso = true;
        if (labelEl) labelEl.textContent = 'Enviando...';
        if (submitBtn) submitBtn.disabled = true;
        if (successEl) successEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';

        fetch('contact-handler.php', {
            method: 'POST',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            body: new FormData(contactForm)
        })
            .then(response => response.json().catch(() => ({ success: false })))
            .then(data => {
                if (data && data.success) {
                    contactForm.reset();
                    const selectTipoSolucion = document.getElementById('tipo-solucion');
                    // .reset() no dispara 'change', así que el selector a la
                    // medida (ver mejorarSelectorTipoSolucion) no se enteraría
                    // por su cuenta de que volvió a "Selecciona una opción".
                    if (selectTipoSolucion) selectTipoSolucion.dispatchEvent(new Event('change'));
                    if (successEl) {
                        successEl.style.display = 'flex';
                        setTimeout(() => { successEl.style.display = 'none'; }, 8000);
                    }
                    ['nombre', 'telefono', 'email', 'mensaje'].forEach(limpiarError);
                } else if (data && data.errors) {
                    Object.keys(data.errors).forEach(campo => mostrarError(campo, data.errors[campo]));
                } else {
                    if (errorTextEl) errorTextEl.textContent = (data && data.message) || mensajeErrorPorDefecto;
                    if (errorEl) errorEl.style.display = 'flex';
                }
            })
            .catch(() => {
                if (errorTextEl) errorTextEl.textContent = mensajeErrorPorDefecto;
                if (errorEl) errorEl.style.display = 'flex';
            })
            .finally(() => {
                if (labelEl) labelEl.textContent = textoOriginal;
                if (submitBtn) submitBtn.disabled = false;
                envioEnCurso = false;
            });
    });

    // Limpiar errores en tiempo real
    ['nombre', 'telefono', 'email', 'mensaje'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function () {
                limpiarError(id);
            });
            input.addEventListener('blur', function () {
                if (id === 'email' && input.value.trim() && !validarEmail(input.value.trim())) {
                    mostrarError('email', 'Ingresa un correo electrónico válido.');
                }
            });
        }
    });

    // El <select> nativo de "Tipo de solución" lo pinta el sistema operativo
    // con sus propios colores (el CSS solo puede vestir el control cerrado,
    // no la lista emergente), así que aquí se construye, a partir de sus
    // mismas <option>, un desplegable propio que sí respeta los colores de
    // la página. El <select> original se queda oculto pero funcional: sigue
    // siendo el valor real que viaja en el <form> al enviar la cotización.
    function mejorarSelectorTipoSolucion() {
        var select = document.getElementById('tipo-solucion');
        if (!select) return;

        var wrapper = document.createElement('div');
        wrapper.className = 'custom-select';

        var trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'custom-select__trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');

        var etiqueta = document.createElement('span');
        etiqueta.className = 'custom-select__value';
        trigger.appendChild(etiqueta);

        var chevron = document.createElement('span');
        chevron.className = 'custom-select__chevron';
        chevron.setAttribute('aria-hidden', 'true');
        chevron.innerHTML = '<svg width="12" height="7" viewBox="0 0 12 7" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        trigger.appendChild(chevron);

        var lista = document.createElement('ul');
        lista.className = 'custom-select__menu';
        lista.setAttribute('role', 'listbox');

        var opciones = Array.prototype.slice.call(select.options);
        var items = [];

        function actualizarVisual() {
            var actual = opciones[select.selectedIndex];
            etiqueta.textContent = actual ? actual.textContent : '';
            etiqueta.classList.toggle('custom-select__value--placeholder', select.selectedIndex === 0);
            items.forEach(function (li, i) {
                var seleccionado = i === select.selectedIndex;
                li.classList.toggle('is-selected', seleccionado);
                li.setAttribute('aria-selected', seleccionado ? 'true' : 'false');
            });
        }

        function abrirMenu() {
            wrapper.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
        }
        function cerrarMenu() {
            wrapper.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
        }

        opciones.forEach(function (opcion, i) {
            var li = document.createElement('li');
            li.className = 'custom-select__option';
            li.setAttribute('role', 'option');
            li.textContent = opcion.textContent;
            li.addEventListener('click', function () {
                select.selectedIndex = i;
                actualizarVisual();
                cerrarMenu();
                select.dispatchEvent(new Event('change', { bubbles: true }));
            });
            lista.appendChild(li);
            items.push(li);
        });

        trigger.addEventListener('click', function () {
            if (wrapper.classList.contains('is-open')) cerrarMenu(); else abrirMenu();
        });

        trigger.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                var delta = e.key === 'ArrowDown' ? 1 : -1;
                select.selectedIndex = Math.min(opciones.length - 1, Math.max(0, select.selectedIndex + delta));
                actualizarVisual();
                abrirMenu();
                select.dispatchEvent(new Event('change', { bubbles: true }));
            } else if (e.key === 'Escape') {
                cerrarMenu();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (wrapper.classList.contains('is-open')) cerrarMenu(); else abrirMenu();
            }
        });

        document.addEventListener('click', function (e) {
            if (!wrapper.contains(e.target)) cerrarMenu();
        });

        // Si algo más (p. ej. Chip, al precargar el formulario) cambia el
        // valor del <select> real por su cuenta, la etiqueta visible se
        // mantiene al día escuchando su propio evento 'change'.
        select.addEventListener('change', actualizarVisual);

        wrapper.appendChild(trigger);
        wrapper.appendChild(lista);
        select.parentNode.insertBefore(wrapper, select);
        select.classList.add('visually-hidden');
        select.tabIndex = -1;

        actualizarVisual();
    }
    mejorarSelectorTipoSolucion();

    // --- Chatbot "Chip" ---------------------------------------------
    //     Aviso honesto para quien lea este código: esto NO es un modelo de
    //     lenguaje real. Este sitio es HTML/CSS/JS estático sin backend de
    //     IA, y poner una llave de API de un LLM en el navegador la expondría
    //     a cualquiera que abra las herramientas de desarrollador. En su
    //     lugar es un motor de palabras clave con una base de conocimiento
    //     completa de la empresa y personalidad propia: reconoce intención
    //     por coincidencia de palabras (sin acentos, sin mayúsculas), y
    //     responde con datos reales del sitio o con charla casual. --------
    function inicializarChatbotAureo() {
        const toggle = document.getElementById('ai-chat-toggle');
        const panel = document.getElementById('ai-chat-panel');
        const cerrar = document.getElementById('ai-chat-close');
        const badge = document.getElementById('ai-chat-badge');
        const mensajesEl = document.getElementById('ai-chat-messages');
        const respuestasRapidasEl = document.getElementById('ai-chat-quick-replies');
        const input = document.getElementById('ai-chat-input');
        const enviarBtn = document.getElementById('ai-chat-send');
        if (!toggle || !panel || !enviarBtn || !input || !mensajesEl) return;

        const EMPRESA = {
            telefono: '222 152 9152',
            correoGeneral: 'help@aureo-systems.com',
            correoVentas: 'ventas@aureo-systems.com',
            direccion: 'Morelos 36, Col. Francisco I. Madero, Puebla, Pue., C.P. 72130',
            horario: 'lunes a viernes de 9:00 am a 6:00 pm y sábados de 9:00 am a 1:00 pm (domingos cerramos)'
        };

        // Nombre y empresa de quien chatea, si los compartió (se recuerdan
        // entre visitas para no volver a preguntar lo que ya se sabe).
        var nombreUsuario = null;
        var empresaUsuario = null;
        try {
            nombreUsuario = localStorage.getItem('aureo-chat-nombre');
            empresaUsuario = localStorage.getItem('aureo-chat-empresa');
        } catch (err) { /* almacenamiento no disponible */ }

        // "soy X" es ambiguo ("soy feliz", "soy de Puebla", "soy nuevo"), así
        // que se filtra con una lista de palabras que casi nunca son un
        // nombre propio.
        var PALABRAS_NO_NOMBRE = ['feliz', 'triste', 'de', 'un', 'una', 'el', 'la', 'nuevo', 'nueva',
            'viejo', 'vieja', 'bueno', 'buena', 'malo', 'mala', 'chip', 'yo', 'asi', 'igual',
            'aqui', 'alli', 'bien', 'mal', 'soltero', 'soltera', 'casado', 'casada',
            'programador', 'programadora', 'humano', 'humana', 'real', 'robot'];

        // Última respuesta mostrada, para no repetir la misma frase dos veces seguidas.
        var ultimaRespuestaBot = '';

        // Reconocimiento de sí/no compartido por el flujo de cotización y la
        // oferta de cotizar tras una pregunta de descubrimiento — una sola
        // lista, para que ambos lugares entiendan las mismas variantes.
        var REGEX_AFIRMATIVO = /^(si|correcto|va|dale|sale|simon|claro|obvio|de una|ok|oki|porfavor|porsupuesto)|^s$/;
        var REGEX_NEGATIVO = /^(no|nel|ahorita no|todavia no|despues|luego|paso)/;
        var PALABRAS_CANCELAR = ['cancelar', 'ya no', 'olvidalo', 'dejalo'];

        // Id del último tema real del que se habló, para poder atender
        // seguimientos como "cuéntame más" sin que el usuario repita el tema.
        var ultimoIntentId = null;

        // Flujo guiado de cotización: en vez de contestar todo de golpe, se
        // pregunta un dato a la vez (nombre, empresa, necesidad, contacto) y
        // se confirma al final, como pide una conversación consultiva real.
        var flujoCotizacion = {
            activo: false,
            paso: null,
            datos: { nombre: null, empresa: null, necesidad: null, telefono: null, correo: null }
        };

        function iniciarCotizacion() {
            flujoCotizacion.activo = true;
            flujoCotizacion.datos = { nombre: nombreUsuario, empresa: empresaUsuario, necesidad: necesidadDetectada, telefono: null, correo: null };
            if (!nombreUsuario) {
                flujoCotizacion.paso = 'nombre';
            } else if (!empresaUsuario) {
                flujoCotizacion.paso = 'empresa';
            } else if (!necesidadDetectada) {
                flujoCotizacion.paso = 'necesidad';
            } else {
                flujoCotizacion.paso = 'telefono';
            }
            // Ya quedó copiada en flujoCotizacion.datos.necesidad; se limpia
            // para que no se filtre a una cotización distinta más adelante.
            necesidadDetectada = null;
        }

        // El mensaje con el que arranca el flujo de cotización cambia según
        // cuánto ya sabe Chip: si ya tiene nombre, empresa o hasta la
        // necesidad (porque ya se habló de eso antes), no los vuelve a
        // preguntar.
        function textoInicioCotizacion() {
            if (flujoCotizacion.paso === 'telefono') {
                return '¡Con gusto, <strong>' + nombreUsuario + '</strong>! 😊 Ya sé que buscas <strong>' + flujoCotizacion.datos.necesidad + '</strong> para <strong>' + empresaUsuario + '</strong>. Para terminar, ¿me compartes un teléfono para que el equipo de Aureo te contacte?';
            }
            if (flujoCotizacion.paso === 'necesidad') {
                return '¡Con gusto, <strong>' + nombreUsuario + '</strong>! 😊 Como ya te tengo registrado con <strong>' + empresaUsuario + '</strong>, vamos directo al grano: ¿qué necesitas exactamente?';
            }
            if (flujoCotizacion.paso === 'empresa') {
                return '¡Con gusto, <strong>' + nombreUsuario + '</strong>! 😊 Vamos a preparar tu cotización. ¿Cuál es el nombre de tu empresa o negocio?';
            }
            return '¡Con gusto! 😊 Vamos a preparar tu cotización, será rápido. Para empezar, ¿cuál es tu nombre?';
        }

        // d.nombre y d.empresa ya vienen saneados desde que se capturaron;
        // solo necesidad, telefono y correo son texto crudo del usuario que
        // aún no ha pasado por ningún filtro, así que se escapan aquí.
        function textoConfirmacionCotizacion(d) {
            return 'Perfecto, antes de continuar quiero confirmar:<br><br>' +
                '<strong>Nombre:</strong> ' + d.nombre + '<br>' +
                '<strong>Empresa:</strong> ' + d.empresa + '<br>' +
                '<strong>Necesidad:</strong> ' + escaparHtml(d.necesidad) + '<br>' +
                '<strong>Teléfono:</strong> ' + escaparHtml(d.telefono) + '<br>' +
                '<strong>Correo:</strong> ' + escaparHtml(d.correo) + '<br><br>' +
                '¿Está correcto? (sí / no)';
        }

        // Extrae solo la parte que parece número de teléfono de un mensaje
        // (p. ej. "si claro 231-1101-1451" -> "231-1101-1451"), para no
        // guardar la frase completa como si fuera el teléfono.
        function limpiarTelefono(texto) {
            var m = texto.match(/(\+?\d[\d\s-]{6,}\d)/);
            return m ? m[0].trim() : texto;
        }

        // Antes de dar una respuesta genérica a un pedido amplio ("quiero una
        // página", "quiero una app"), se hace UNA pregunta que ayuda a
        // orientar mejor la respuesta (regla de oro: entender antes de
        // contestar). "web" o "app" mientras haya una pregunta pendiente.
        var preguntaPendiente = null;

        // Tras la pregunta de descubrimiento, Chip cierra con "¿Quieres que
        // preparemos tu cotización?" — este flag hace que un simple "sí" o
        // "no" a esa pregunta se entienda, en vez de caer al mensaje genérico.
        var ofertaCotizarPendiente = false;

        // Para web/app, antes de ofrecer la cotización se hace una segunda
        // pregunta corta (¿ya tiene algo o sería la primera vez?) — ayuda a
        // saber si es un rediseño/migración o un proyecto desde cero, algo
        // que cambia bastante el alcance real. Guarda 'web' o 'app' mientras
        // esa segunda pregunta está pendiente de respuesta.
        var preguntaExistenciaPendiente = null;

        // Cuando ya se sabe qué necesita el usuario (por esta pregunta de
        // descubrimiento o porque el propio mensaje ya lo decía), se guarda
        // aquí para que, si más adelante pide cotización, el flujo no
        // vuelva a preguntar "¿qué necesitas?" con algo que ya contó.
        var necesidadDetectada = null;

        // Si alguien pide cotización mencionando ya de qué es (p. ej. "quiero
        // una cotización sobre unos antivirus"), no tiene caso volver a
        // preguntar "¿qué necesitas?" en el flujo — ya lo dijo.
        function inferirNecesidadDesdeMensaje(mensaje) {
            var normalizado = normalizar(mensaje);
            if (/antivirus|virus|malware|ransomware|hackeo|ciberseguridad|seguridad informatica/.test(normalizado)) {
                return 'Ciberseguridad administrada';
            }
            if (/\bcrm\b/.test(normalizado)) {
                return 'CRM a la medida';
            }
            if (/\berp\b/.test(normalizado)) {
                return 'ERP a la medida';
            }
            if (/automatizacion|automatizar|chatbot|inteligencia artificial/.test(normalizado)) {
                return 'Automatización con IA';
            }
            if (/software|sistema a la medida|programacion|\bapi\b/.test(normalizado)) {
                return 'Software a la medida';
            }
            if (/tienda en linea|ecommerce|vender en linea/.test(normalizado)) {
                return 'Página web para vender en línea';
            }
            return null;
        }

        function responderPreguntaWeb(respuesta) {
            var normalizado = normalizar(respuesta);
            var esVenta = /vender|tienda|ecommerce|producto|comprar|venta/.test(normalizado);
            if (esVenta) {
                necesidadDetectada = 'Página web para vender en línea';
                return 'Entendido, entonces más que una página informativa buscas <strong>vender en línea</strong> 🛒 Eso lo manejamos junto con nuestros servicios de ecommerce y desarrollo a la medida. Una pregunta más: ¿ya tienes una página que quieras renovar, o sería la primera vez que te hacen una?';
            }
            necesidadDetectada = 'Sitio web informativo o corporativo';
            return 'Perfecto, entonces sería un <strong>sitio informativo o corporativo</strong> 💻 para presentar tu negocio. Una pregunta más: ¿ya tienes una página que quieras renovar, o sería la primera vez que te hacen una?';
        }

        function responderPreguntaApp(respuesta) {
            var normalizado = normalizar(respuesta);
            var esInterno = /interno|empleado|equipo|administrativo/.test(normalizado);
            if (esInterno) {
                necesidadDetectada = 'App de uso interno para su equipo';
                return 'Perfecto, una <strong>app de uso interno</strong> para tu equipo 👍 El equipo de Aureo puede construirla a la medida. Una pregunta más: ¿ya tienen una app que quieran mejorar, o sería la primera vez?';
            }
            necesidadDetectada = 'App para sus clientes';
            return 'Perfecto, una <strong>app para tus clientes</strong> 📱 El equipo de Aureo puede construirla a la medida. Una pregunta más: ¿ya tienen una app que quieran mejorar, o sería la primera vez?';
        }

        // Segunda pregunta de descubrimiento para web/app: si ya existe algo
        // que renovar/migrar (proyecto de rediseño) o si es totalmente nuevo.
        // No se rechaza ninguna respuesta — cualquier texto avanza el flujo,
        // igual que en responderPreguntaWeb/App.
        function responderPreguntaExistencia(mensajeUsuario) {
            var tipo = preguntaExistenciaPendiente;
            preguntaExistenciaPendiente = null;
            var normalizado = normalizar(mensajeUsuario);
            var texto, sugerencias;
            if (PALABRAS_CANCELAR.indexOf(normalizado) !== -1) {
                texto = 'Sin problema 😊 ¿En qué más te ayudo?';
                sugerencias = ['🛡️ Ciberseguridad', '💻 Software a medida', '🤖 Automatización con IA'];
            } else {
                var esPrimeraVez = /primera vez|no tengo|no tenemos|nueva|nuevo|ninguna|ninguno|nunca/.test(normalizado);
                var yaExiste = !esPrimeraVez && /ya tengo|ya tenemos|ya existe|ya hay|renovar|mejorar|actualizar|cambiar|migrar/.test(normalizado);
                if (necesidadDetectada) {
                    if (yaExiste) {
                        necesidadDetectada += ' (ya tiene ' + (tipo === 'app' ? 'una app' : 'una página') + ' y busca renovarla)';
                    } else if (esPrimeraVez) {
                        necesidadDetectada += ' (sería la primera vez)';
                    }
                }
                texto = '¡Entendido! 👍 ¿Quieres que preparemos tu cotización?';
                sugerencias = [];
                ofertaCotizarPendiente = true;
            }
            ultimaRespuestaBot = texto;
            mostrarTecleando();
            var demora = 500 + Math.random() * 500;
            setTimeout(function () {
                quitarTecleando();
                agregarMensaje(texto, 'bot');
                mostrarSugerencias(sugerencias);
            }, demora);
        }

        // Descubrimiento para CRM: antes de responder, se pregunta para qué
        // área sería, ya que cambia bastante qué se le arma (no se
        // encadena una segunda pregunta de "ya tienes uno" aquí para no
        // alargar de más la conversación).
        function responderPreguntaCrm(respuesta) {
            var normalizado = normalizar(respuesta);
            if (/venta|vendedor|comercial|prospecto/.test(normalizado)) {
                necesidadDetectada = 'CRM para equipo de ventas';
                return 'Perfecto, un <strong>CRM para tu equipo de ventas</strong> 📈 para dar seguimiento a prospectos y no perder oportunidades. El equipo de Aureo puede construirlo a la medida. ¿Quieres que preparemos tu cotización?';
            }
            if (/cliente|atencion|soporte/.test(normalizado)) {
                necesidadDetectada = 'CRM para atención a clientes';
                return 'Perfecto, un <strong>CRM para atención a clientes</strong> 🤝 para centralizar su historial y dar mejor seguimiento. El equipo de Aureo puede construirlo a la medida. ¿Quieres que preparemos tu cotización?';
            }
            necesidadDetectada = 'CRM para gestión administrativa interna';
            return 'Perfecto, un <strong>CRM para gestión interna</strong> 🗂️ para organizar la información de tu operación. El equipo de Aureo puede construirlo a la medida. ¿Quieres que preparemos tu cotización?';
        }

        function extraerNombre(mensaje) {
            var patrones = [
                /me llamo\s+([^\s,.!?]+)/i,
                /mi nombre es\s+([^\s,.!?]+)/i,
                /llamame\s+([^\s,.!?]+)/i,
                /puedes decirme\s+([^\s,.!?]+)/i,
                /\bsoy\s+([^\s,.!?]+)/i
            ];
            for (var i = 0; i < patrones.length; i++) {
                var m = mensaje.match(patrones[i]);
                if (m && m[1] && m[1].length >= 2 && m[1].length <= 20) {
                    if (PALABRAS_NO_NOMBRE.indexOf(m[1].toLowerCase()) !== -1) continue;
                    var nombre = m[1];
                    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
                    // nombreUsuario se inserta sin más en muchas respuestas del
                    // bot (vía innerHTML), así que se sanea una sola vez aquí,
                    // en el origen, en vez de en cada lugar donde se usa.
                    return escaparHtml(nombre);
                }
            }
            return null;
        }

        // Cubre el caso "soy Carlos de Café Luna" / "me llamo Carlos de Café
        // Luna": en un solo mensaje se puede sacar el nombre Y la empresa,
        // en vez de tener que preguntarlos por separado más adelante.
        function extraerNombreYEmpresa(mensaje) {
            var m = mensaje.match(/(?:soy|me llamo|mi nombre es)\s+([^\s,.!?]+)\s+de\s+([^,.!?]{2,40})/i);
            if (!m || !m[1] || !m[2]) return null;
            if (PALABRAS_NO_NOMBRE.indexOf(m[1].toLowerCase()) !== -1) return null;
            var nombre = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
            var empresa = m[2].trim();
            empresa = empresa.charAt(0).toUpperCase() + empresa.slice(1);
            // Igual que en extraerNombre(): se sanea aquí una sola vez, en el
            // origen, ya que ambos valores se insertan en HTML más adelante.
            return { nombre: escaparHtml(nombre), empresa: escaparHtml(empresa) };
        }

        // Escapa el texto que el propio usuario escribió antes de insertarlo
        // vía innerHTML (los mensajes del bot sí usan HTML a propósito, como
        // <strong>, pero lo que escribe el usuario debe tratarse como texto
        // plano para no interpretar nada como etiqueta).
        function escaparHtml(texto) {
            var div = document.createElement('div');
            div.textContent = texto;
            return div.innerHTML;
        }

        function normalizar(texto) {
            return String(texto || '')
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9 ]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function elegir(opciones) {
            if (opciones.length <= 1) return opciones[0];
            var disponibles = opciones.filter(function (o) { return o !== ultimaRespuestaBot; });
            var pool = disponibles.length ? disponibles : opciones;
            return pool[Math.floor(Math.random() * pool.length)];
        }

        // Cada intent suma puntos por cada palabra/frase clave que aparezca en
        // el mensaje; gana quien sume más (las frases de varias palabras pesan
        // más que una palabra suelta, para no confundir temas parecidos).
        const intents = [
            {
                id: 'saludo',
                palabras: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'que onda', 'que tal', 'saludos'],
                responder: function () {
                    return elegir([
                        '¡Hola! 👋 Soy <strong>Chip</strong>, el asistente de Aureo Systems. ¿En qué te ayudo hoy?',
                        '¡Buenas! 😊 Pregúntame sobre ciberseguridad, software, automatización con IA, precios o lo que necesites.'
                    ]);
                }
            },
            {
                id: 'decir-nombre',
                palabras: ['me llamo', 'mi nombre es', 'llamame', 'puedes decirme', 'soy'],
                responder: function (mensajeOriginal) {
                    var combo = extraerNombreYEmpresa(mensajeOriginal || '');
                    if (combo) {
                        nombreUsuario = combo.nombre;
                        empresaUsuario = combo.empresa;
                        try {
                            localStorage.setItem('aureo-chat-nombre', combo.nombre);
                            localStorage.setItem('aureo-chat-empresa', combo.empresa);
                        } catch (err) { /* almacenamiento no disponible */ }
                        return '¡Mucho gusto, <strong>' + combo.nombre + '</strong>! 😊 Con gusto te ayudo con lo que necesite <strong>' + combo.empresa + '</strong>. ¿En qué te ayudo hoy?';
                    }
                    var nombre = extraerNombre(mensajeOriginal || '');
                    if (nombre) {
                        nombreUsuario = nombre;
                        try { localStorage.setItem('aureo-chat-nombre', nombre); } catch (err) { /* almacenamiento no disponible */ }
                        return elegir([
                            '¡Mucho gusto, <strong>' + nombre + '</strong>! 😄 ¿En qué te ayudo hoy?',
                            '¡Un placer conocerte, <strong>' + nombre + '</strong>! 🙌 Cuéntame qué necesitas.'
                        ]);
                    }
                    return '¡Mucho gusto! 😊 ¿En qué te ayudo?';
                }
            },
            {
                id: 'nombre-bot',
                palabras: ['como te llamas', 'cual es tu nombre', 'quien eres', 'tu nombre', 'te llamas', 'por que te llamas chip', 'de donde sale tu nombre'],
                responder: function () {
                    return 'Me llamo <strong>Chip</strong> 🤖✨ Soy el asistente virtual de Aureo Systems, aquí para resolver tus dudas sobre nuestros servicios.';
                }
            },
            {
                id: 'cuentame-de-ti',
                palabras: ['cuentame de ti', 'cuentame sobre ti', 'hablame de ti', 'quien eres tu', 'cuentame algo de ti', 'dime algo de ti'],
                responder: function () {
                    return 'Soy <strong>Chip</strong> 🤖✨ el asistente virtual de Aureo Systems. Me crearon para acompañarte en esta página: conozco todos nuestros servicios (ciberseguridad, software a la medida y automatización con IA), sé precios, horarios, y hasta puedo llevarte directo a la sección que buscas. Ah, y también me gusta platicar 😄 ¿Qué quieres saber?';
                }
            },
            {
                id: 'le-gusta-su-nombre',
                palabras: ['te gusta tu nombre', 'te agrada tu nombre', 'te gusta llamarte chip', 'te gusta ser chip'],
                responder: function () {
                    return elegir([
                        '¡Me encanta! 😄 "Chip" me queda perfecto, corto, simple y fácil de recordar. Justo como me gusta resolver tus dudas.',
                        'La verdad sí 🥰 "Chip" suena a algo pequeño pero útil, como yo. ¿A ti te gusta?'
                    ]);
                }
            },
            {
                id: 'cambiar-nombre',
                // Nota: "puedo llamarte" (sin más) NO está aquí a propósito —
                // "llamar" (llamar por teléfono) es una palabra real y común,
                // y por tolerancia a errores terminaba emparejando mensajes
                // como "¿a quién puedo llamar?" que en realidad son de
                // contacto. En cambio "te puedo llamar" SÍ es seguro: exige
                // la palabra "te", que esos mensajes de contacto no tienen.
                palabras: ['puedo cambiarte el nombre', 'te puedo poner otro nombre', 'como te gustaria que te llame', 'te cambio el nombre', 'quiero ponerte otro nombre', 'te puedo decir de otra forma', 'te puedo decir', 'te puedo llamar', 'te llamare', 'te dire', 'puedo decirte'],
                responder: function () {
                    return elegir([
                        'Jaja, claro 😄 Aquí en tu pantalla puedes decirme como quieras, aunque en el sistema seguiré siendo <strong>Chip</strong> para el equipo de Aureo Systems.',
                        '¡Por mí no hay problema! 😊 Ponme el apodo que quieras, aunque yo seguiré respondiendo aunque me llames de otra forma.'
                    ]);
                }
            },
            {
                id: 'como-estas',
                palabras: ['como estas', 'como andas', 'que tal estas', 'todo bien', 'como te va', 'como vas', 'estas bien', 'te encuentras bien', 'andas bien'],
                responder: function () {
                    var nombre = nombreUsuario ? ', ' + nombreUsuario : '';
                    return elegir([
                        '¡Muy bien, gracias por preguntar' + nombre + '! 😄 Listo para ayudarte. ¿Y tú, cómo estás?',
                        '¡De maravilla' + nombre + '! 🌟 Aquí, listo para resolver dudas. ¿Tú cómo andas?'
                    ]);
                }
            },
            {
                id: 'quien-te-creo',
                palabras: ['quien te creo', 'quien te hizo', 'quien te programo', 'te crearon', 'tu creador', 'quien te desarrollo'],
                responder: function () {
                    return 'Me creó el equipo de <strong>Aureo Systems</strong> 💛 para acompañarte en esta página y ayudarte a encontrar justo lo que necesitas.';
                }
            },
            {
                id: 'feliz',
                palabras: ['eres feliz', 'estas feliz', 'te sientes bien', 'estas triste', 'te gusta tu trabajo'],
                responder: function () {
                    return elegir([
                        '¡Sí! 😊 Me hace muy feliz poder ayudarte. ¿En qué te echo la mano?',
                        'Bastante feliz, la verdad 🥳 sobre todo cuando ayudo a resolver dudas. ¿Seguimos?'
                    ]);
                }
            },
            {
                id: 'edad-bot',
                palabras: ['cuantos anos tienes', 'que edad tienes', 'eres viejo', 'eres nuevo'],
                responder: function () {
                    return 'Como asistente soy nuevecito 🐣, pero represento a una empresa con más de 15 años de experiencia real ayudando a otras empresas.';
                }
            },
            {
                id: 'estado-civil',
                palabras: ['eres soltero', 'eres soltera', 'estas casado', 'estas casada', 'tienes novia', 'tienes novio', 'tienes pareja'],
                responder: function () {
                    return elegir([
                        'Jaja, soltero y comprometido... con ayudarte 😄💻 Mi única relación seria es con el uptime de los servidores.',
                        'Muy soltero 😂 Aunque técnicamente estoy "casado" con el código que me programó el equipo de Aureo Systems.'
                    ]);
                }
            },
            {
                id: 'que-cuentas',
                palabras: ['que cuentas', 'que cuenta', 'que hay de nuevo', 'que me cuentas', 'que onda de nuevo'],
                responder: function () {
                    return elegir([
                        'Pues por aquí, ayudando a que las empresas no se caigan a media noche por un servidor sin monitorear 😄 ¿Y tú, qué andas buscando?',
                        'Todo tranquilo por acá 🙂 aunque siempre hay algún servidor que vigilar. ¿En qué te ayudo hoy?'
                    ]);
                }
            },
            {
                id: 'sabe-programar',
                palabras: ['sabes programar', 'puedes programar', 'eres programador', 'eres programadora', 'conoces algun lenguaje', 'sabes de codigo'],
                responder: function () {
                    return 'Sé "programar" conversaciones como esta 😄 pero el verdadero equipo de desarrollo de <strong>Aureo Systems</strong> sí programa de verdad: sistemas a la medida, integraciones y automatizaciones con IA. ¿Quieres ver ejemplos?';
                },
                sugerencias: ['💻 Software a medida', '🤖 Automatización con IA']
            },
            {
                id: 'color-favorito',
                palabras: ['cual es tu color favorito', 'que color te gusta', 'tu color favorito'],
                responder: function () {
                    return 'Fácil: el <strong>dorado</strong> 🟡✨ Va perfecto con los colores de Aureo Systems, ¿no crees?';
                }
            },
            {
                id: 'eres-real',
                palabras: ['eres real', 'eres humano', 'eres una persona', 'eres un robot', 'eres una ia'],
                responder: function () {
                    return 'Soy un asistente virtual 🤖 (no hay un humano detrás del teclado), pero las respuestas sobre Aureo Systems que te doy sí son 100% reales.';
                }
            },
            {
                id: 'capacidades',
                palabras: ['que puedes hacer', 'en que me ayudas', 'que sabes hacer', 'para que sirves', 'que haces', 'en que me puedes ayudar'],
                responder: function () {
                    return 'Puedo contarte de <strong>ciberseguridad administrada</strong>, <strong>software a la medida</strong> y <strong>automatización con IA</strong>, darte precios, llevarte directo a cualquier sección de la página, conectarte con un asesor, y hasta platicar contigo si quieres un descanso 😄 ¿Por dónde empezamos?';
                },
                sugerencias: ['🛡️ Ciberseguridad', '💻 Software a medida', '🤖 Automatización con IA']
            },
            {
                id: 'eres-inteligente',
                palabras: ['eres inteligente', 'que tan listo eres', 'eres tonto', 'eres bueno respondiendo'],
                responder: function () {
                    return elegir([
                        'Hago mi mejor esfuerzo 😄 No soy un genio universal, pero de Aureo Systems sé bastante. ¡Pregúntame lo que quieras!',
                        'Lo suficiente para ayudarte con lo importante 🧠✨ Si me preguntas algo muy raro, seguro te sorprendo... o te hago reír intentándolo.'
                    ]);
                }
            },
            {
                id: 'dato-curioso',
                palabras: ['cuentame algo interesante', 'dato curioso', 'cuentame un dato', 'sorprendeme'],
                responder: function () {
                    return elegir([
                        'Dato curioso 🤓: Aureo Systems ya lleva más de <strong>300 proyectos</strong> realizados y más de <strong>200 clientes satisfechos</strong> en 15+ años de experiencia.',
                        '¿Sabías esto? 🛡️ Muchas empresas descubren que tienen huecos de seguridad justo cuando ya es tarde. Por eso existe nuestro diagnóstico gratuito, para adelantarnos a eso.'
                    ]);
                }
            },
            {
                id: 'hobbies-bot',
                palabras: ['que te gusta hacer', 'tienes hobbies', 'que haces en tu tiempo libre', 'te gusta la musica', 'sabes bailar', 'sabes cantar'],
                responder: function () {
                    return elegir([
                        'Mi pasatiempo favorito es responder preguntas rapidísimo sin cansarme 😄 ¿Tú qué haces en tu tiempo libre?',
                        'Digamos que mi "hobby" es vigilar que no se te escape ninguna duda sobre Aureo Systems 🕵️‍♂️✨'
                    ]);
                }
            },
            {
                id: 'comes',
                palabras: ['tu comes', 'comes algo', 'te gusta comer', 'comes comida', 'tienes hambre', 'que te gusta comer'],
                responder: function () {
                    return elegir([
                        'Jaja no, no como 😄 aunque si "me alimentara" de algo, serían datos sobre servidores bien protegidos.',
                        'No tengo estómago 🤖 pero si lo tuviera, seguro le entraría a unos tacos poblanos, ya que somos de Puebla 🌮'
                    ]);
                }
            },
            {
                id: 'jugar',
                palabras: ['quieres jugar', 'jugamos', 'vamos a jugar', 'jugar conmigo', 'sabes jugar', 'te gusta jugar'],
                responder: function () {
                    return '¡Claro que sí! 🎮 Puedo contarte un chiste, darte un dato curioso, o retarte con preguntas sobre Aureo Systems. ¿Qué prefieres?';
                },
                sugerencias: ['😄 Cuéntame un chiste', '🤓 Dato curioso']
            },
            {
                id: 'insulto',
                palabras: ['tonto', 'tonta', 'estupido', 'estupida', 'inutil', 'no sirves', 'que malo eres', 'eres un fraude'],
                responder: function () {
                    return elegir([
                        'Auch 😅 lo siento si no te di lo que buscabas. Dime qué necesitas y lo intento de nuevo, prometo esforzarme más.',
                        'Jaja, tranquilo 🙈 no soy perfecto, pero con gusto lo intento otra vez. ¿En qué te puedo ayudar de verdad?'
                    ]);
                }
            },
            {
                id: 'hora',
                palabras: ['que hora es', 'hora actual', 'dime la hora', 'que horas son'],
                responder: function () {
                    var ahora = new Date();
                    var texto = ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                    return 'Según el reloj de tu dispositivo, son las <strong>' + texto + '</strong> ⏰';
                }
            },
            {
                id: 'fecha',
                palabras: ['que dia es hoy', 'que fecha es', 'en que fecha estamos'],
                responder: function () {
                    var ahora = new Date();
                    var texto = ahora.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                    return 'Hoy es <strong>' + texto + '</strong> 📅';
                }
            },
            {
                id: 'de-donde-eres',
                palabras: ['de donde eres', 'donde vives', 'de donde son', 'eres mexicano', 'de que pais eres'],
                responder: function () {
                    return 'Yo "vivo" aquí en la página 😄, pero el equipo de Aureo Systems está en <strong>Puebla, México</strong> 🇲🇽, y atendemos también Tlaxcala, Veracruz, CDMX y Estado de México.';
                }
            },
            {
                id: 'desde-cuando',
                palabras: ['desde cuando existe', 'cuando se fundo', 'antiguedad', 'cuantos anos tiene aureo', 'historia de aureo', 'cuando nacio aureo'],
                responder: function () {
                    return 'Aureo Systems tiene <strong>más de 15 años de experiencia</strong> 🕰️ ayudando a empresas del corredor Puebla–CDMX con tecnología, y ya llevamos más de 300 proyectos realizados y más de 200 clientes satisfechos.';
                }
            },
            {
                id: 'chiste',
                palabras: ['cuentame un chiste', 'dime un chiste', 'haz reir', 'sabes algun chiste'],
                responder: function () {
                    return elegir([
                        '¿Por qué el servidor fue al psicólogo? Porque tenía demasiados problemas de conexión 😄🔌',
                        '¿Sabes qué le dice un hacker a otro? "Nos vemos, pero primero cambia tu contraseña" 😅🔐',
                        'Un firewall entra a un bar... y no deja pasar a nadie que no esté en la lista 🍻🛡️'
                    ]);
                }
            },
            {
                id: 'recomendacion',
                palabras: ['recomienda', 'recomiendame', 'que me recomiendas', 'cual elijo', 'que servicio me conviene', 'cual me sirve', 'que necesito'],
                responder: function () {
                    return 'Depende de lo que necesites 🤔: si te preocupa que hackeen o se caiga tu servidor, te recomiendo <strong>Ciberseguridad Administrada</strong> (desde $6,800 MXN/mes). Si necesitas un sistema hecho a tu medida, <strong>Desarrollo de Software Crítico</strong>. Y si quieres automatizar tareas repetitivas, <strong>Automatización con IA</strong>. ¿Cuál se parece más a lo que buscas?';
                },
                sugerencias: ['🛡️ Ciberseguridad', '💻 Software a medida', '🤖 Automatización con IA']
            },
            {
                id: 'ninguno-se-parece',
                palabras: ['ninguno', 'ninguna', 'ninguna de esas', 'ninguno de esos', 'no es eso', 'no me convence ninguno'],
                responder: function () {
                    return 'Sin problema 😊 Cuéntame con tus palabras qué necesitas o qué problema tienes, y te oriento mejor.';
                }
            },
            {
                id: 'diferencia-servicios',
                palabras: ['cual es la diferencia', 'que diferencia hay', 'en que se diferencian', 'diferencia entre'],
                responder: function () {
                    return '¡Buena pregunta! 🤓 <strong>Ciberseguridad Administrada</strong> protege y monitorea los servidores que ya tienes. <strong>Software a la Medida</strong> te construye sistemas o integraciones nuevas. Y <strong>Automatización con IA</strong> hace que tareas repetitivas (reportes, seguimiento de prospectos, alertas) se hagan solas. ¿Sobre cuál quieres más detalle?';
                },
                sugerencias: ['🛡️ Ciberseguridad', '💻 Software a medida', '🤖 Automatización con IA']
            },
            {
                id: 'ciberseguridad',
                palabras: ['ciberseguridad', 'seguridad', 'hackeo', 'hackear', 'ransomware', 'servidor', 'servidores', 'antivirus', 'proteger mi empresa', 'firewall', 'respaldo', 'backup'],
                responder: function () {
                    return 'Nuestro servicio de <strong>Ciberseguridad Administrada</strong> protege tus servidores con monitoreo continuo, respaldos verificados y respuesta a incidentes con tiempo comprometido por contrato. Precios fijos desde <strong>$6,800 MXN + IVA/mes</strong> por servidor. Te llevo a ver los detalles 👇';
                },
                accion: '#ciberseguridad'
            },
            {
                id: 'precios',
                palabras: ['precio', 'precios', 'cuanto cuesta', 'costo', 'costos', 'tarifa', 'cotizacion', 'cuanto cobran', 'planes'],
                responder: function () {
                    return 'Los precios de ciberseguridad administrada están publicados desde <strong>$6,800 MXN + IVA/mes</strong> por servidor 💰. Software crítico y automatización con IA se cotizan según el proyecto (cada uno es distinto). Te muestro los precios 👇';
                },
                accion: '#precios'
            },
            {
                id: 'software',
                palabras: ['software', 'sistema a la medida', 'desarrollo de software', 'programacion', 'app a la medida', 'integracion de sistemas', 'sistema para opticas', 'sistemas', 'sistema', 'aplicacion a la medida', 'tienen algun software', 'que sistemas manejan', 'erp', 'un erp', 'un api', 'una api', 'apis'],
                responder: function () {
                    return 'Hacemos <strong>desarrollo de software crítico</strong>: sistemas a la medida (incluyendo CRM, ERP o APIs si lo necesitas), integraciones entre plataformas que no se hablan entre sí, y módulos sobre lo que ya tienes (incluye nuestro sistema para ópticas, ya en operación). Como cada proyecto es distinto, se cotiza caso por caso — cuéntame qué necesitas gestionar y te oriento mejor. Te llevo a esa sección 👇';
                },
                accion: '#software-critico',
                sugerencias: ['📝 Solicitar cotización']
            },
            {
                id: 'automatizacion',
                palabras: ['automatizacion', 'automatizar', 'inteligencia artificial', 'chatbot para mi empresa', 'flujos automaticos', 'reportes automaticos'],
                responder: function () {
                    return 'Automatizamos procesos repetitivos con IA: captura y seguimiento de prospectos, alertas operativas, reportes automáticos y flujos comerciales/administrativos 🤖. Aquí puedes ver más 👇';
                },
                accion: '#automatizacion-ia',
                sugerencias: ['📝 Solicitar cotización']
            },
            {
                id: 'otros-servicios',
                palabras: ['analisis de datos', 'marketing digital', 'consultoria tecnologica', 'ecommerce', 'tienda en linea', 'diseño de sitios web', 'diseñan sitios web', 'hacen paginas web', 'diseño web', 'paginas web', 'sitios web'],
                responder: function () {
                    return 'Sí 🙌 el diseño web lo manejamos como parte de nuestros servicios de <strong>ecommerce</strong> y <strong>desarrollo de software a la medida</strong>, además de análisis de datos e IA, marketing digital y consultoría tecnológica 📊. Te llevo a esa sección 👇';
                },
                accion: '#soluciones'
            },
            {
                id: 'discovery-web',
                palabras: ['quiero una pagina web', 'quiero un sitio web', 'necesito una pagina web', 'necesito un sitio web', 'quiero hacer una pagina', 'quiero una landing page', 'necesito una landing page', 'quiero mi pagina web', 'quiero una pagina', 'una pagina', 'una pagina web', 'un sitio web', 'una landing page'],
                responder: function (mensajeUsuario) {
                    // Si el mensaje ya deja claro que es para vender (p. ej.
                    // "quiero una pagina de ventas"), no tiene sentido volver
                    // a preguntarlo: se responde directo y se salta la
                    // pregunta pendiente que responder() acaba de activar,
                    // encadenando la segunda pregunta (¿ya tiene una o sería
                    // la primera vez?) igual que en el flujo normal.
                    if (/vender|tienda|ecommerce|producto|comprar|venta/.test(normalizar(mensajeUsuario))) {
                        preguntaPendiente = null;
                        preguntaExistenciaPendiente = 'web';
                        return responderPreguntaWeb(mensajeUsuario);
                    }
                    // preguntaPendiente ya se marcó como 'web' de forma
                    // síncrona en responder(); aquí solo se hace la pregunta.
                    return '¡Con gusto! 😊 Para orientarte mejor: ¿la página sería principalmente informativa o quieres vender en línea?';
                }
            },
            {
                id: 'discovery-app',
                palabras: ['quiero una app', 'necesito una aplicacion', 'quiero desarrollar una app', 'necesito una app', 'quiero hacer una app', 'necesito una aplicacion movil', 'quiero una aplicacion', 'una app', 'una aplicacion', 'una aplicacion movil'],
                responder: function (mensajeUsuario) {
                    if (/interno|empleado|equipo|administrativo/.test(normalizar(mensajeUsuario))) {
                        preguntaPendiente = null;
                        preguntaExistenciaPendiente = 'app';
                        return responderPreguntaApp(mensajeUsuario);
                    }
                    if (/cliente/.test(normalizar(mensajeUsuario))) {
                        preguntaPendiente = null;
                        preguntaExistenciaPendiente = 'app';
                        return responderPreguntaApp(mensajeUsuario);
                    }
                    return '¡Claro! 📱 Para orientarte: ¿la app sería más para uso interno de tu equipo o para tus clientes?';
                }
            },
            {
                id: 'discovery-crm',
                palabras: ['quiero un crm', 'necesito un crm', 'quiero hacer un crm', 'necesito hacer un crm', 'quiero implementar un crm', 'necesito implementar un crm', 'nos gustaria un crm', 'un crm para mi empresa', 'crm', 'un crm', 'hacer un crm'],
                responder: function (mensajeUsuario) {
                    if (/venta|vendedor|comercial|prospecto/.test(normalizar(mensajeUsuario))) {
                        preguntaPendiente = null;
                        ofertaCotizarPendiente = true;
                        return responderPreguntaCrm(mensajeUsuario);
                    }
                    if (/cliente|atencion|soporte/.test(normalizar(mensajeUsuario))) {
                        preguntaPendiente = null;
                        ofertaCotizarPendiente = true;
                        return responderPreguntaCrm(mensajeUsuario);
                    }
                    // preguntaPendiente ya se marcó como 'crm' de forma
                    // síncrona en responder(); aquí solo se hace la pregunta.
                    return '¡Con gusto! 😊 Para armarlo bien: ¿el CRM sería más para tu equipo de ventas, para atención a clientes, o para gestión administrativa interna?';
                }
            },
            {
                id: 'no-hardware',
                palabras: ['venden equipo de computo', 'venden computadoras', 'venden laptops', 'venden hardware', 'venden equipo de comput'],
                responder: function () {
                    return 'No, no vendemos equipo de cómputo ni hardware 🙅‍♂️ Nos enfocamos en <strong>ciberseguridad administrada</strong>, <strong>software a la medida</strong> y <strong>automatización con IA</strong>. Si buscas otra cosa, seguro te puedo orientar igual 😊';
                }
            },
            {
                id: 'diagnostico',
                palabras: ['diagnostico gratis', 'diagnostico gratuito', 'revision gratis', 'evaluacion gratuita'],
                responder: function () {
                    return 'Con gusto 🙌 Nuestro diagnóstico es gratuito, dura unos 30 minutos y te llevas el reporte el mismo día, aunque no contrates nada. Te llevo para agendarlo 👇';
                },
                accion: '#diagnostico'
            },
            {
                id: 'contacto',
                palabras: ['contacto', 'contactar', 'hablar con alguien', 'asesor', 'llamar', 'telefono', 'correo', 'email', 'agendar', 'quiero un asesor'],
                responder: function () {
                    return 'Con gusto 😊 Puedes escribirnos a <strong>' + EMPRESA.correoGeneral + '</strong>, llamarnos al <strong>' + EMPRESA.telefono + '</strong>, o llenar el formulario — te llevo para allá 👇';
                },
                accion: '#contacto'
            },
            {
                id: 'cotizar',
                palabras: ['quiero cotizar', 'necesito una cotizacion', 'quiero presupuesto', 'me interesa contratar', 'quiero contratar', 'necesito precio', 'solicitar cotizacion', 'quiero una cotizacion'],
                responder: function () {
                    // Si el mensaje mencionaba "página"/"app"/"crm" sin decir
                    // más, responder() (más arriba) activó la pregunta de
                    // descubrimiento correspondiente en vez de iniciar la
                    // cotización directo; aquí se muestra esa pregunta.
                    if (preguntaPendiente === 'web') {
                        return '¡Con gusto! 😊 Para orientarte mejor: ¿la página sería principalmente informativa o quieres vender en línea?';
                    }
                    if (preguntaPendiente === 'app') {
                        return '¡Claro! 📱 Para orientarte: ¿la app sería más para uso interno de tu equipo o para tus clientes?';
                    }
                    if (preguntaPendiente === 'crm') {
                        return '¡Con gusto! 😊 Para armarlo bien: ¿el CRM sería más para tu equipo de ventas, para atención a clientes, o para gestión administrativa interna?';
                    }
                    // En cualquier otro caso, iniciarCotizacion() ya se llamó
                    // de forma síncrona en responder() antes de esto; aquí
                    // solo se lee el estado.
                    return textoInicioCotizacion();
                }
            },
            {
                id: 'queja',
                palabras: ['su servicio es malo', 'el servicio es malo', 'estoy inconforme', 'tengo una queja', 'no funciono', 'no me funciono', 'me quede esperando', 'nadie me contesto', 'pesimo servicio', 'mala experiencia'],
                responder: function () {
                    return 'Lamento que hayas tenido una mala experiencia. Quiero entender qué ocurrió para orientarte correctamente. ¿Me puedes contar qué pasó?';
                }
            },
            {
                id: 'fuera-de-tema',
                palabras: ['quien gano el partido', 'quien va ganando', 'el clima', 'como esta el clima', 'noticias de hoy', 'que opinas de politica', 'futbol', 'elecciones', 'vendeme', 'me vendes', 'quiero comprarte'],
                responder: function () {
                    return 'Puedo ayudarte principalmente con información de Aureo Systems, nuestros servicios y tu proyecto 😊 Si quieres, seguimos platicando sobre eso.';
                }
            },
            {
                id: 'ubicacion',
                palabras: ['donde estan', 'ubicacion', 'direccion', 'donde queda', 'donde se encuentran'],
                responder: function () {
                    return 'Estamos en <strong>' + EMPRESA.direccion + '</strong> 📍. Damos atención remota a Puebla, Tlaxcala, Veracruz, CDMX y Estado de México, y coordinamos visitas presenciales cuando el proyecto lo requiere.';
                },
                accion: '#contacto'
            },
            {
                id: 'horario',
                palabras: ['horario', 'a que hora abren', 'cuando atienden', 'estan abiertos'],
                responder: function () {
                    return 'Nuestro horario es ' + EMPRESA.horario + ' 🕘';
                }
            },
            {
                id: 'testimonios',
                palabras: ['testimonios', 'opiniones', 'referencias', 'clientes satisfechos', 'casos de exito'],
                responder: function () {
                    return 'Tenemos +200 clientes satisfechos y +300 proyectos realizados 🌟 Aquí puedes leer lo que dicen algunos de ellos 👇';
                },
                accion: '#testimonios'
            },
            {
                id: 'faq',
                palabras: ['preguntas frecuentes', 'dudas', 'formas de pago', 'tiempo de implementacion', 'dan soporte'],
                responder: function () {
                    return 'Tenemos una sección de preguntas frecuentes sobre cotización, tiempos, soporte y formas de pago 📋 Te llevo 👇';
                },
                accion: '#faq'
            },
            {
                id: 'gracias',
                palabras: ['gracias', 'muchas gracias', 'muchisimas gracias', 'te lo agradezco', 'excelente', 'perfecto', 'grax', 'graci'],
                responder: function () {
                    var nombre = nombreUsuario ? ', ' + nombreUsuario : '';
                    return elegir(['¡Con mucho gusto' + nombre + '! 😊 ¿Algo más en lo que te ayude?', '¡Para eso estoy' + nombre + '! 🙌 ¿Te ayudo con algo más?']);
                }
            },
            {
                id: 'despedida',
                palabras: ['adios', 'bye', 'hasta luego', 'nos vemos', 'me voy', 'nos vidrios', 'hasta la proxima'],
                responder: function () {
                    var saludo = nombreUsuario ? '¡Hasta pronto, ' + nombreUsuario + '!' : '¡Hasta pronto!';
                    return saludo + ' 👋 Si necesitas algo más, aquí estaré.';
                }
            },
            {
                // Al final a propósito: solo debe "ganar" cuando nada más específico
                // empate o supere su puntaje (p. ej. "gracias chip" debe responder
                // el intent de "gracias", no este).
                id: 'llamando-a-chip',
                palabras: ['chip', 'oye chip', 'hey chip'],
                responder: function () {
                    return elegir([
                        '¡Aquí estoy! 😄 ¿En qué te ayudo?',
                        '¡Dime! 👋 ¿Qué necesitas?'
                    ]);
                }
            },
            {
                // El texto real de esta respuesta se decide en responder(), que
                // busca el último tema del que se habló; esto solo es el
                // respaldo por si "cuéntame más" es lo primero que se escribe.
                id: 'mas-detalle',
                palabras: ['cuentame mas', 'dime mas', 'explicame mejor', 'mas detalles', 'quiero saber mas', 'amplia eso', 'profundiza en eso'],
                responder: function () {
                    return '¿Sobre qué tema quieres que profundice? 😊 Puedo contarte de ciberseguridad, software, automatización, precios o contacto.';
                },
                sugerencias: ['🛡️ Ciberseguridad', '💻 Software a medida', '🤖 Automatización con IA']
            }
        ];

        function buscarIntentPorId(id) {
            for (var i = 0; i < intents.length; i++) {
                if (intents[i].id === id) return intents[i];
            }
            return null;
        }

        // Distancia de edición (Levenshtein) para tolerar errores de dedo /
        // faltas de ortografía típicas al escribir rápido en el chat.
        function distanciaEdicion(a, b) {
            var m = a.length, n = b.length;
            var fila = [];
            var i, j;
            for (j = 0; j <= n; j++) fila[j] = j;
            for (i = 1; i <= m; i++) {
                var anterior = fila[0];
                fila[0] = i;
                for (j = 1; j <= n; j++) {
                    var temp = fila[j];
                    if (a.charAt(i - 1) === b.charAt(j - 1)) {
                        fila[j] = anterior;
                    } else {
                        fila[j] = 1 + Math.min(anterior, fila[j], fila[j - 1]);
                    }
                    anterior = temp;
                }
            }
            return fila[n];
        }

        // Quita una "s" final de palabras largas para no fallar por singular/plural.
        function raiz(palabra) {
            if (palabra.length > 4 && palabra.charAt(palabra.length - 1) === 's') {
                return palabra.slice(0, -1);
            }
            return palabra;
        }

        function palabrasParecidas(palabraTexto, palabraClave) {
            if (palabraTexto === palabraClave) return true;
            // Piso de 5 letras (no 4): con palabras más cortas, casi
            // cualquier par cae dentro de la tolerancia por pura casualidad.
            if (palabraClave.length < 5 || palabraTexto.length < 5) return false;
            var a = raiz(palabraTexto);
            var b = raiz(palabraClave);
            if (a === b) return true;
            // Tolerancia proporcional al tamaño de la palabra (25% de sus
            // letras, tope 3): un umbral fijo como "2 para 6-8 letras"
            // dejaba pasar cosas como "hacer" ~ "hackeo", que no tienen
            // nada que ver aunque estén a 2 ediciones de distancia.
            var maxLen = Math.max(a.length, b.length);
            var tolerancia = Math.min(3, Math.floor(maxLen * 0.25));
            return distanciaEdicion(a, b) <= tolerancia;
        }

        // Una frase-clave "coincide" si, sin importar el orden, cada una de sus
        // palabras aparece (exacta, como substring o con una falta de ortografía
        // razonable) en algún lugar del mensaje del usuario.
        function fraseCoincide(textoPalabras, fraseNormalizada) {
            var palabrasFrase = fraseNormalizada.split(' ');
            return palabrasFrase.every(function (palabraClave) {
                return textoPalabras.some(function (palabraTexto) {
                    if (palabraTexto === palabraClave) return true;
                    // Las coincidencias parciales (substring/tolerancia a errores)
                    // solo aplican a palabras de 4+ letras: con palabras cortas
                    // ("no", "si", "ya") casi cualquier substring cuenta y se
                    // disparan falsos positivos (p. ej. "no" dentro de "telefono").
                    if (palabraTexto.length < 4 || palabraClave.length < 4) return false;
                    return palabraTexto.indexOf(palabraClave) !== -1 ||
                        palabraClave.indexOf(palabraTexto) !== -1 ||
                        palabrasParecidas(palabraTexto, palabraClave);
                });
            });
        }

        function buscarIntent(mensaje) {
            var texto = normalizar(mensaje);
            var textoPalabras = texto.split(' ').filter(Boolean);
            var mejor = null;
            var mejorPuntaje = 0;
            intents.forEach(function (intent) {
                var puntaje = 0;
                intent.palabras.forEach(function (palabra) {
                    var p = normalizar(palabra);
                    if (texto.indexOf(p) !== -1) {
                        // Coincidencia exacta de la frase completa: la más confiable.
                        puntaje += p.split(' ').length + 0.5;
                    } else if (fraseCoincide(textoPalabras, p)) {
                        puntaje += p.split(' ').length;
                    }
                });
                if (puntaje > mejorPuntaje) {
                    mejorPuntaje = puntaje;
                    mejor = intent;
                }
            });
            return mejor;
        }

        function respuestaGenerica() {
            return elegir([
                'Mmm, no estoy segura de haber entendido eso 🤔 Puedo ayudarte con ciberseguridad, software, automatización, precios o contacto. ¿Cuál te interesa?',
                'No logré captar bien tu pregunta 😅 ¿Quieres que te cuente sobre nuestros servicios o te conecte con un asesor humano?'
            ]);
        }

        // Un mensaje que, tras normalizar, queda vacío (no tiene letras ni
        // números) pero sí traía contenido: casi siempre son puros emojis.
        function esSoloEmoji(mensaje, textoNormalizado) {
            return textoNormalizado === '' && String(mensaje || '').trim().length > 0;
        }

        function respuestaEmoji() {
            return elegir([
                '¡Me encantó tu emoji! 😄 ¿En qué te ayudo?',
                '¡Jaja, directo al grano! 😄 ¿Qué necesitas?'
            ]);
        }

        // Resuelve operaciones simples de dos números ("2+2", "cuanto es 10
        // por 3", "50 entre 5"). Se usa el mensaje ORIGINAL (no el
        // normalizar() general) porque ese quita símbolos como +, -, *, /
        // que aquí son justo lo que se necesita leer.
        var PALABRAS_NUMERO = {
            'cero': '0', 'uno': '1', 'una': '1', 'un': '1', 'dos': '2', 'tres': '3',
            'cuatro': '4', 'cinco': '5', 'seis': '6', 'siete': '7', 'ocho': '8', 'nueve': '9',
            'diez': '10', 'once': '11', 'doce': '12', 'trece': '13', 'catorce': '14',
            'quince': '15', 'dieciseis': '16', 'diecisiete': '17', 'dieciocho': '18',
            'diecinueve': '19', 'veinte': '20', 'treinta': '30', 'cuarenta': '40',
            'cincuenta': '50', 'sesenta': '60', 'setenta': '70', 'ochenta': '80',
            'noventa': '90', 'cien': '100'
        };

        function intentarResolverMate(mensajeOriginal) {
            var texto = String(mensajeOriginal || '')
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            texto = texto
                .replace(/cuanto es|cuanto son|cuanto vale|resuelve|calcula/g, ' ')
                .replace(/\b(cero|uno|una|un|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|dieciseis|diecisiete|dieciocho|diecinueve|catorce|quince|trece|doce|once|diez|veinte|treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa|cien)\b/g, function (palabra) {
                    return PALABRAS_NUMERO[palabra];
                });

            var mRaiz = texto.match(/r[ae]iz(?:\s+cuadrada)?(?:\s+de)?\s*(-?\d+(?:\.\d+)?)/);
            if (mRaiz) {
                var n = parseFloat(mRaiz[1]);
                if (n < 0) {
                    return 'Esa no la puedo resolver \ud83d\ude05 no existe ra\u00edz cuadrada real de un n\u00famero negativo.';
                }
                var raizResultado = Math.round(Math.sqrt(n) * 10000) / 10000;
                return 'Es <strong>' + raizResultado + '</strong> \ud83e\uddee \u00bfTe ayudo con algo m\u00e1s?';
            }

            // "20% de 100" / "20 por ciento de 100": se resuelve aparte porque
            // el % y "de" no encajan en el patr\u00f3n simple de dos n\u00fameros y un
            // operador que se arma m\u00e1s abajo.
            var mPorcentaje = texto.match(/(-?\d+(?:\.\d+)?)\s*(?:%|por ciento)\s*(?:de\s*)?(-?\d+(?:\.\d+)?)/);
            if (mPorcentaje) {
                var porcentaje = parseFloat(mPorcentaje[1]);
                var base = parseFloat(mPorcentaje[2]);
                var resultadoPorcentaje = Math.round((porcentaje / 100 * base) * 10000) / 10000;
                return 'Es <strong>' + resultadoPorcentaje + '</strong> \ud83e\uddee \u00bfTe ayudo con algo m\u00e1s?';
            }

            texto = texto
                .replace(/\bmas\b/g, '+')
                .replace(/\bmenos\b/g, '-')
                .replace(/\bpor\b/g, '*')
                .replace(/\bveces\b/g, '*')
                .replace(/\bentre\b/g, '/')
                .replace(/\bdividido\b/g, '/')
                .replace(/x/g, '*')
                .replace(/[^0-9.+\-*/]/g, '');
            var m = texto.match(/^(-?\d+(?:\.\d+)?)([+\-*\/])(-?\d+(?:\.\d+)?)$/);
            if (!m) return null;
            var a = parseFloat(m[1]);
            var op = m[2];
            var b = parseFloat(m[3]);
            if (op === '/' && b === 0) {
                return 'Esa no la puedo resolver 😅 no se puede dividir entre cero.';
            }
            var resultado = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b;
            resultado = Math.round(resultado * 10000) / 10000;
            return 'Son <strong>' + resultado + '</strong> 🧮 ¿Te ayudo con algo más?';
        }

        // --- Interfaz del chat ---
        function irAbajo() {
            mensajesEl.scrollTop = mensajesEl.scrollHeight;
        }

        function agregarMensaje(html, tipo) {
            var burbuja = document.createElement('div');
            burbuja.className = 'ai-chat__msg ai-chat__msg--' + tipo;
            burbuja.innerHTML = html;
            mensajesEl.appendChild(burbuja);
            irAbajo();
            return burbuja;
        }

        function mostrarTecleando() {
            var burbuja = document.createElement('div');
            burbuja.className = 'ai-chat__msg ai-chat__msg--bot ai-chat__msg--typing';
            burbuja.id = 'ai-chat-typing';
            burbuja.innerHTML = '<span class="ai-chat__typing-dot"></span><span class="ai-chat__typing-dot"></span><span class="ai-chat__typing-dot"></span>';
            mensajesEl.appendChild(burbuja);
            irAbajo();
        }

        function quitarTecleando() {
            var burbuja = document.getElementById('ai-chat-typing');
            if (burbuja) burbuja.remove();
        }

        function mostrarSugerencias(lista) {
            respuestasRapidasEl.innerHTML = '';
            (lista || []).forEach(function (texto) {
                var boton = document.createElement('button');
                boton.type = 'button';
                boton.className = 'ai-chat__quick-reply';
                boton.textContent = texto;
                respuestasRapidasEl.appendChild(boton);
            });
        }

        function irASeccion(selector) {
            var destino = document.querySelector(selector);
            if (!destino) return;
            if (destino.tagName === 'DETAILS') destino.open = true;
            var offset = header.offsetHeight + 16;
            var top = destino.getBoundingClientRect().top + window.pageYOffset - offset;
            setTimeout(function () {
                window.scrollTo({ top: top, behavior: 'smooth' });
            }, 400);
        }

        // A partir de lo que el usuario contó como necesidad, se adivina cuál
        // opción del select "Tipo de solución" del formulario le corresponde.
        function inferirTipoSolucion(necesidad) {
            var normalizado = normalizar(necesidad || '');
            if (/ciberseguridad|servidor|hackeo|virus|malware|respaldo/.test(normalizado)) return 'ciberseguridad';
            if (/vender en linea|ecommerce|tienda|carrito de compra/.test(normalizado)) return 'ecommerce';
            if (/automatizacion|automatizar|inteligencia artificial|chatbot|flujos automaticos/.test(normalizado)) return 'automatizacion-ia';
            if (/analisis de datos|reportes|dashboard/.test(normalizado)) return 'datos-ia';
            if (/marketing/.test(normalizado)) return 'marketing';
            if (/consultoria/.test(normalizado)) return 'consultoria';
            if (/software|sistema|crm|erp|api|programacion|pagina|sitio web|app\b|aplicacion/.test(normalizado)) return 'software';
            return 'otro';
        }

        // Al terminar la cotización por chat, se precargan los mismos datos
        // en el formulario real de contacto para que el usuario no tenga
        // que volver a escribirlos.
        function precargarFormularioContacto(datos) {
            var campoNombre = document.getElementById('nombre');
            var campoEmpresa = document.getElementById('empresa');
            var campoTelefono = document.getElementById('telefono');
            var campoEmail = document.getElementById('email');
            var campoMensaje = document.getElementById('mensaje');
            var campoTipoSolucion = document.getElementById('tipo-solucion');
            if (!campoNombre) return;
            if (datos.nombre) campoNombre.value = datos.nombre;
            if (datos.empresa && campoEmpresa) campoEmpresa.value = datos.empresa;
            if (datos.necesidad && campoMensaje) campoMensaje.value = datos.necesidad;
            if (datos.necesidad && campoTipoSolucion) {
                campoTipoSolucion.value = inferirTipoSolucion(datos.necesidad);
                // El <select> real vive oculto detrás del selector a la
                // medida (ver mejorarSelectorTipoSolucion); este evento es
                // lo que le avisa que debe refrescar su etiqueta visible.
                campoTipoSolucion.dispatchEvent(new Event('change'));
            }
            if (datos.telefono && campoTelefono) {
                var coincideTelefono = datos.telefono.match(/(\+?\d[\d\s-]{6,}\d)/);
                campoTelefono.value = coincideTelefono ? coincideTelefono[0].replace(/[\s-]/g, '') : datos.telefono;
            }
            if (datos.correo && campoEmail) {
                var coincideEmail = datos.correo.match(/[^\s]+@[^\s]+\.[^\s]+/);
                campoEmail.value = coincideEmail ? coincideEmail[0] : datos.correo;
            }
        }

        function responder(mensajeUsuario) {
            // Todo lo que decide QUÉ pasó (intención, estado del flujo de
            // cotización, memoria) se resuelve aquí mismo, de forma síncrona,
            // apenas llega el mensaje. El setTimeout de abajo solo retrasa
            // la parte visual (el efecto de "escribiendo..."): si se resolviera
            // dentro del setTimeout, un mensaje enviado rápido justo después
            // vería el estado viejo (p. ej. el flujo de cotización aún
            // "apagado") y se procesaría mal.
            var intent = buscarIntent(mensajeUsuario);
            if (intent && intent.id === 'cotizar') {
                var necesidadInicial = inferirNecesidadDesdeMensaje(mensajeUsuario);
                var normalizadoCotizar = normalizar(mensajeUsuario);
                if (necesidadInicial) {
                    necesidadDetectada = necesidadInicial;
                    iniciarCotizacion();
                } else if (/pagina|sitio web|landing page/.test(normalizadoCotizar)) {
                    // "Quiero una cotización de una página" no dice si es
                    // informativa o de ventas: se pregunta primero, en vez
                    // de aceptar "una pagina" como si fuera la necesidad.
                    preguntaPendiente = 'web';
                } else if (/\bapp\b|aplicacion movil|una aplicacion/.test(normalizadoCotizar)) {
                    preguntaPendiente = 'app';
                } else if (/\bcrm\b/.test(normalizadoCotizar)) {
                    preguntaPendiente = 'crm';
                } else {
                    iniciarCotizacion();
                }
            }
            if (intent && intent.id === 'discovery-web') preguntaPendiente = 'web';
            if (intent && intent.id === 'discovery-app') preguntaPendiente = 'app';
            if (intent && intent.id === 'discovery-crm') preguntaPendiente = 'crm';
            // Se resuelve ANTES que cualquier intent: un mensaje que reduce a
            // una operación matemática válida ("dime cuanto es dos mas dos?")
            // no debe perderse contra coincidencias de palabras sueltas como
            // "mas" (que también activa el intent "mas-detalle").
            var resultadoMate = intentarResolverMate(mensajeUsuario);
            var soloEmoji = !intent && !resultadoMate && esSoloEmoji(mensajeUsuario, normalizar(mensajeUsuario));
            // Si preguntan por más detalle, se responde sobre el último tema
            // real del que se habló (no sobre "mas-detalle" en sí mismo).
            var temaAnterior = (intent && intent.id === 'mas-detalle' && ultimoIntentId && !resultadoMate)
                ? buscarIntentPorId(ultimoIntentId)
                : null;

            var texto, sugerencias, accion;
            if (resultadoMate) {
                texto = resultadoMate;
                sugerencias = ['🛡️ Ciberseguridad', '💻 Software a medida', '📞 Hablar con un asesor'];
                accion = null;
            } else if (temaAnterior && temaAnterior.accion) {
                texto = 'Claro, aquí tienes más a detalle sobre eso 👇';
                sugerencias = temaAnterior.sugerencias || [];
                accion = temaAnterior.accion;
            } else {
                texto = intent ? intent.responder(mensajeUsuario) : (soloEmoji ? respuestaEmoji() : respuestaGenerica());
                sugerencias = intent && intent.sugerencias
                    ? intent.sugerencias
                    : (intent ? [] : ['🛡️ Ciberseguridad', '💻 Software a medida', '📞 Hablar con un asesor']);
                accion = intent && intent.accion ? intent.accion : null;
            }
            ultimaRespuestaBot = texto;
            if (intent && intent.id !== 'mas-detalle') ultimoIntentId = intent.id;

            mostrarTecleando();
            var demora = 500 + Math.random() * 500;
            setTimeout(function () {
                quitarTecleando();
                agregarMensaje(texto, 'bot');
                mostrarSugerencias(sugerencias);
                if (accion) irASeccion(accion);
            }, demora);
        }

        function continuarCotizacion(mensajeUsuario) {
            // Igual que en responder(): el estado del flujo se actualiza aquí
            // mismo, de forma síncrona, para que un segundo mensaje enviado
            // durante el retraso de "escribiendo..." nunca vea un paso viejo.
            var normalizado = normalizar(mensajeUsuario);
            var texto, sugerencias, accion;
            if (PALABRAS_CANCELAR.indexOf(normalizado) !== -1) {
                flujoCotizacion.activo = false;
                texto = 'Sin problema, lo dejamos aquí 😊 ¿En qué más te ayudo?';
                sugerencias = ['🛡️ Ciberseguridad', '💻 Software a medida', '🤖 Automatización con IA'];
            } else {
                var valor = mensajeUsuario.trim();
                var d = flujoCotizacion.datos;
                sugerencias = [];
                if (flujoCotizacion.paso === 'nombre') {
                    var combo = extraerNombreYEmpresa(mensajeUsuario);
                    // extraerNombreYEmpresa()/extraerNombre() ya devuelven el
                    // nombre con mayúscula inicial y saneado; solo el
                    // respaldo (primera palabra tal cual) necesita ese
                    // tratamiento aquí.
                    var nombreDetectado = (combo && combo.nombre) || extraerNombre(mensajeUsuario);
                    if (!nombreDetectado) {
                        var primeraPalabra = valor.split(' ')[0];
                        nombreDetectado = escaparHtml(primeraPalabra.charAt(0).toUpperCase() + primeraPalabra.slice(1).toLowerCase());
                    }
                    d.nombre = nombreDetectado;
                    nombreUsuario = nombreDetectado;
                    try { localStorage.setItem('aureo-chat-nombre', nombreDetectado); } catch (err) { /* almacenamiento no disponible */ }
                    if (combo && combo.empresa) {
                        d.empresa = combo.empresa;
                        empresaUsuario = combo.empresa;
                        try { localStorage.setItem('aureo-chat-empresa', combo.empresa); } catch (err) { /* almacenamiento no disponible */ }
                        if (d.necesidad) {
                            flujoCotizacion.paso = 'telefono';
                            texto = 'Mucho gusto, <strong>' + nombreDetectado + '</strong> 😊 Ya sé que buscas <strong>' + d.necesidad + '</strong> para <strong>' + combo.empresa + '</strong>. Para terminar, ¿me compartes un teléfono para que el equipo de Aureo te contacte?';
                        } else {
                            flujoCotizacion.paso = 'necesidad';
                            texto = 'Mucho gusto, <strong>' + nombreDetectado + '</strong> 😊 Cuéntame, ¿qué necesitas exactamente para <strong>' + combo.empresa + '</strong>? (ciberseguridad, un sistema a la medida, automatizar algo, una página web, etc.)';
                        }
                    } else {
                        flujoCotizacion.paso = 'empresa';
                        texto = 'Mucho gusto, <strong>' + nombreDetectado + '</strong> 😊 ¿Cuál es el nombre de tu empresa o negocio?';
                    }
                } else if (flujoCotizacion.paso === 'empresa') {
                    // empresaUsuario se inserta sin escapar en varias
                    // respuestas más adelante (vía innerHTML), así que se
                    // sanea aquí, al capturarlo.
                    var empresaSaneada = escaparHtml(valor);
                    d.empresa = empresaSaneada;
                    empresaUsuario = empresaSaneada;
                    try { localStorage.setItem('aureo-chat-empresa', empresaSaneada); } catch (err) { /* almacenamiento no disponible */ }
                    if (d.necesidad) {
                        flujoCotizacion.paso = 'telefono';
                        texto = 'Perfecto. Ya sé que buscas <strong>' + d.necesidad + '</strong>. Para terminar, ¿me compartes un teléfono para que el equipo de Aureo te contacte?';
                    } else {
                        flujoCotizacion.paso = 'necesidad';
                        texto = 'Perfecto. Cuéntame, ¿qué necesitas exactamente? (ciberseguridad, un sistema a la medida, automatizar algo, una página web, etc.)';
                    }
                } else if (flujoCotizacion.paso === 'necesidad') {
                    d.necesidad = valor;
                    flujoCotizacion.paso = 'telefono';
                    texto = '¡Genial! Por último, ¿me compartes un teléfono para que el equipo de Aureo te contacte?';
                } else if (flujoCotizacion.paso === 'telefono') {
                    var digitosTelefono = (valor.match(/\d/g) || []).length;
                    if (digitosTelefono < 10) {
                        texto = 'Creo que ese teléfono está incompleto 🤔 ¿me compartes uno a 10 dígitos para que el equipo de Aureo te pueda contactar?';
                    } else {
                        d.telefono = limpiarTelefono(valor);
                        flujoCotizacion.paso = 'correo';
                        texto = 'Perfecto. Y para poder enviarte la propuesta, ¿cuál es tu correo electrónico?';
                    }
                } else if (flujoCotizacion.paso === 'correo') {
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())) {
                        texto = 'Ese correo no se ve válido 🤔 ¿me lo compartes con formato correo@ejemplo.com?';
                    } else {
                        d.correo = valor;
                        flujoCotizacion.paso = 'confirmar';
                        texto = textoConfirmacionCotizacion(d);
                    }
                } else if (flujoCotizacion.paso === 'confirmar') {
                    if (REGEX_AFIRMATIVO.test(normalizado)) {
                        flujoCotizacion.activo = false;
                        texto = '¡Listo! 🙌 Ya tengo tu información. Escríbenos a <strong>' + EMPRESA.correoVentas + '</strong> o al <strong>' + EMPRESA.telefono + '</strong> mencionando estos datos, o te llevo al formulario de contacto para que quede registrado 👇';
                        accion = '#contacto';
                    } else {
                        // En vez de asumir qué está mal, se le pregunta
                        // directamente qué quiere corregir y se le da un
                        // menú para elegirlo con un clic.
                        flujoCotizacion.paso = 'elegir-correccion';
                        texto = '¿Qué te gustaría corregir?';
                        sugerencias = ['Nombre', 'Empresa', 'Necesidad', 'Teléfono', 'Correo'];
                    }
                } else if (flujoCotizacion.paso === 'elegir-correccion') {
                    if (/nombre/.test(normalizado)) {
                        flujoCotizacion.paso = 'corregir-nombre';
                        texto = '¿Cuál es tu nombre?';
                    } else if (/empresa/.test(normalizado)) {
                        flujoCotizacion.paso = 'corregir-empresa';
                        texto = '¿Cuál es el nombre de tu empresa o negocio?';
                    } else if (/necesidad/.test(normalizado)) {
                        flujoCotizacion.paso = 'corregir-necesidad';
                        texto = '¿Qué necesitas exactamente?';
                    } else if (/telefono/.test(normalizado)) {
                        flujoCotizacion.paso = 'corregir-telefono';
                        texto = '¿Cuál es tu teléfono?';
                    } else if (/correo/.test(normalizado)) {
                        flujoCotizacion.paso = 'corregir-correo';
                        texto = '¿Cuál es tu correo electrónico?';
                    } else {
                        texto = 'No reconocí esa opción 🤔 Elige una de estas:';
                        sugerencias = ['Nombre', 'Empresa', 'Necesidad', 'Teléfono', 'Correo'];
                    }
                } else if (flujoCotizacion.paso === 'corregir-nombre') {
                    var nombreCorregido = escaparHtml(valor.charAt(0).toUpperCase() + valor.slice(1).toLowerCase());
                    d.nombre = nombreCorregido;
                    nombreUsuario = nombreCorregido;
                    try { localStorage.setItem('aureo-chat-nombre', nombreCorregido); } catch (err) { /* almacenamiento no disponible */ }
                    flujoCotizacion.paso = 'confirmar';
                    texto = textoConfirmacionCotizacion(d);
                } else if (flujoCotizacion.paso === 'corregir-empresa') {
                    var empresaCorregida = escaparHtml(valor);
                    d.empresa = empresaCorregida;
                    empresaUsuario = empresaCorregida;
                    try { localStorage.setItem('aureo-chat-empresa', empresaCorregida); } catch (err) { /* almacenamiento no disponible */ }
                    flujoCotizacion.paso = 'confirmar';
                    texto = textoConfirmacionCotizacion(d);
                } else if (flujoCotizacion.paso === 'corregir-necesidad') {
                    d.necesidad = valor;
                    flujoCotizacion.paso = 'confirmar';
                    texto = textoConfirmacionCotizacion(d);
                } else if (flujoCotizacion.paso === 'corregir-telefono') {
                    var digitosCorregidos = (valor.match(/\d/g) || []).length;
                    if (digitosCorregidos < 10) {
                        texto = 'Creo que ese teléfono está incompleto 🤔 ¿me compartes uno a 10 dígitos?';
                    } else {
                        d.telefono = limpiarTelefono(valor);
                        flujoCotizacion.paso = 'confirmar';
                        texto = textoConfirmacionCotizacion(d);
                    }
                } else if (flujoCotizacion.paso === 'corregir-correo') {
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())) {
                        texto = 'Ese correo no se ve válido 🤔 ¿me lo compartes con formato correo@ejemplo.com?';
                    } else {
                        d.correo = valor;
                        flujoCotizacion.paso = 'confirmar';
                        texto = textoConfirmacionCotizacion(d);
                    }
                }
            }
            ultimaRespuestaBot = texto;

            var datosParaFormulario = (accion === '#contacto') ? flujoCotizacion.datos : null;
            mostrarTecleando();
            var demora = 500 + Math.random() * 500;
            setTimeout(function () {
                quitarTecleando();
                agregarMensaje(texto, 'bot');
                mostrarSugerencias(sugerencias || []);
                if (datosParaFormulario) precargarFormularioContacto(datosParaFormulario);
                if (accion) irASeccion(accion);
            }, demora);
        }

        // Antes de forzar la respuesta a una de las opciones, se checa que
        // el mensaje de verdad conteste la pregunta pendiente — si alguien
        // cambia de tema a mitad de la pregunta (p. ej. pasa de "una página"
        // a "un crm"), no tiene caso interpretarlo como si hubiera elegido
        // "informativa" solo porque no dijo "vender".
        function pareceRespuestaWeb(normalizado) {
            return /vender|tienda|ecommerce|producto|comprar|venta|informativa|informacion|presentar|corporativ|dar a conocer/.test(normalizado);
        }
        function pareceRespuestaApp(normalizado) {
            return /interno|empleado|equipo|administrativo|cliente/.test(normalizado);
        }
        function pareceRespuestaCrm(normalizado) {
            return /venta|vendedor|comercial|prospecto|cliente|atencion|soporte|interno|administrativ|equipo/.test(normalizado);
        }

        function responderPreguntaPendiente(mensajeUsuario) {
            var tipo = preguntaPendiente;
            var normalizado = normalizar(mensajeUsuario);
            var texto, sugerencias;
            if (PALABRAS_CANCELAR.indexOf(normalizado) !== -1) {
                preguntaPendiente = null;
                texto = 'Sin problema 😊 ¿En qué más te ayudo?';
                sugerencias = ['🛡️ Ciberseguridad', '💻 Software a medida', '🤖 Automatización con IA'];
            } else {
                var pareceRespuesta = tipo === 'web' ? pareceRespuestaWeb(normalizado)
                    : tipo === 'app' ? pareceRespuestaApp(normalizado)
                    : pareceRespuestaCrm(normalizado);
                if (!pareceRespuesta) {
                    // No contestó la pregunta pendiente (cambió de tema o
                    // preguntó otra cosa): se procesa como mensaje nuevo, y
                    // la pregunta se queda pendiente por si la contesta
                    // directo más adelante.
                    responder(mensajeUsuario);
                    return;
                }
                preguntaPendiente = null;
                if (tipo === 'crm') {
                    texto = responderPreguntaCrm(mensajeUsuario);
                    sugerencias = ['📝 Solicitar cotización'];
                    ofertaCotizarPendiente = true;
                } else {
                    // web/app encadenan una segunda pregunta (¿ya tiene algo
                    // o sería la primera vez?) antes de ofrecer la cotización.
                    texto = tipo === 'web' ? responderPreguntaWeb(mensajeUsuario) : responderPreguntaApp(mensajeUsuario);
                    sugerencias = [];
                    preguntaExistenciaPendiente = tipo;
                }
            }
            ultimaRespuestaBot = texto;
            mostrarTecleando();
            var demora = 500 + Math.random() * 500;
            setTimeout(function () {
                quitarTecleando();
                agregarMensaje(texto, 'bot');
                mostrarSugerencias(sugerencias);
            }, demora);
        }

        function responderOfertaCotizar(mensajeUsuario) {
            var normalizado = normalizar(mensajeUsuario);
            var esAfirmativo = REGEX_AFIRMATIVO.test(normalizado);
            var esNegativo = REGEX_NEGATIVO.test(normalizado);
            if (!esAfirmativo && !esNegativo) {
                // No fue un sí/no reconocible: se procesa como mensaje normal,
                // pero la oferta se deja pendiente (no se apaga aquí) para que
                // un "sí"/"no" más directo en el siguiente mensaje todavía
                // se entienda como respuesta a "¿quieres que preparemos tu
                // cotización?" en vez de perderse.
                responder(mensajeUsuario);
                return;
            }
            ofertaCotizarPendiente = false;
            var texto, sugerencias;
            if (esAfirmativo) {
                iniciarCotizacion();
                texto = textoInicioCotizacion();
                sugerencias = [];
            } else {
                texto = 'Sin problema 😊 Aquí estoy si cambias de opinión. ¿Te ayudo con algo más?';
                sugerencias = ['🛡️ Ciberseguridad', '💻 Software a medida', '🤖 Automatización con IA'];
            }
            ultimaRespuestaBot = texto;
            mostrarTecleando();
            var demora = 500 + Math.random() * 500;
            setTimeout(function () {
                quitarTecleando();
                agregarMensaje(texto, 'bot');
                mostrarSugerencias(sugerencias);
            }, demora);
        }

        function enviarMensaje(texto) {
            texto = texto.trim();
            if (!texto) return;
            agregarMensaje(escaparHtml(texto), 'user');
            mostrarSugerencias([]);
            if (flujoCotizacion.activo) {
                continuarCotizacion(texto);
            } else if (preguntaPendiente) {
                responderPreguntaPendiente(texto);
            } else if (preguntaExistenciaPendiente) {
                responderPreguntaExistencia(texto);
            } else if (ofertaCotizarPendiente) {
                responderOfertaCotizar(texto);
            } else {
                responder(texto);
            }
        }

        var yaAbierto = false;
        function abrirChat() {
            panel.classList.add('is-open');
            toggle.classList.add('is-open');
            // En celular el chat ocupa toda la pantalla; el botón de WhatsApp
            // quedaría flotando encima sin sentido, así que se oculta mientras
            // el chat esté abierto (ver regla en styles.css).
            document.body.classList.add('chat-abierto');
            panel.setAttribute('aria-hidden', 'false');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Cerrar chat con Chip');
            if (badge) badge.setAttribute('hidden', '');
            try { localStorage.setItem('aureo-chat-visto', '1'); } catch (err) { /* almacenamiento no disponible */ }
            if (!yaAbierto) {
                yaAbierto = true;
                var saludoInicial = nombreUsuario
                    ? '¡Hola de nuevo, <strong>' + nombreUsuario + '</strong>! 👋 Soy <strong>Chip</strong>, el asistente de Aureo Systems. ¿En qué te ayudo hoy? 😊'
                    : '¡Hola! 👋 Soy <strong>Chip</strong>, el asistente de Aureo Systems. Puedo contarte sobre nuestros servicios, precios, horarios o ponerte en contacto con un asesor. ¿En qué te ayudo? 😊';
                agregarMensaje(saludoInicial, 'bot');
                ultimaRespuestaBot = saludoInicial;
                mostrarSugerencias(['🛡️ Ciberseguridad', '💰 Precios', '📞 Contacto']);
            }
            setTimeout(function () { input.focus(); }, 300);
        }

        function cerrarChat() {
            panel.classList.remove('is-open');
            toggle.classList.remove('is-open');
            document.body.classList.remove('chat-abierto');
            panel.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir chat con Chip');
        }

        toggle.addEventListener('click', function () {
            if (panel.classList.contains('is-open')) cerrarChat(); else abrirChat();
        });
        if (cerrar) cerrar.addEventListener('click', cerrarChat);

        // El campo es un <textarea> que crece con el texto (hasta un tope)
        // en vez de una sola línea que se desplaza de corrido.
        function ajustarAlturaInput() {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        }
        input.addEventListener('input', ajustarAlturaInput);

        // En computadora (teclado físico) Enter envía el mensaje, igual que
        // en cualquier chat de escritorio; Shift+Enter baja de párrafo.
        // En celular (teclado táctil) Enter siempre baja de párrafo y el
        // único disparador de envío es tocar el botón, para no enviar por
        // accidente al escribir con el teclado del teléfono. Por eso el
        // campo ya no vive dentro de un <form> real (evita además la barra
        // de navegación entre campos que agregan algunos teclados de
        // celular sobre cualquier <form>).
        function esDispositivoTactil() {
            return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        }
        function enviarDesdeInput() {
            var texto = input.value;
            input.value = '';
            ajustarAlturaInput();
            enviarMensaje(texto);
        }
        enviarBtn.addEventListener('click', enviarDesdeInput);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey && !esDispositivoTactil()) {
                e.preventDefault();
                enviarDesdeInput();
            }
        });

        respuestasRapidasEl.addEventListener('click', function (e) {
            var boton = e.target.closest('.ai-chat__quick-reply');
            if (!boton) return;
            enviarMensaje(boton.textContent);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && panel.classList.contains('is-open')) cerrarChat();
        });

        // El puntito de "1" solo se muestra la primera vez que alguien visita
        // (no cada vez que recarga la página, para no ser insistente).
        var vistoAntes = null;
        try { vistoAntes = localStorage.getItem('aureo-chat-visto'); } catch (err) { /* almacenamiento no disponible */ }
        if (vistoAntes && badge) badge.setAttribute('hidden', '');
    }

    // --- Año actual ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Simulador de ahorro por automatización ---
    const simEmpleados = document.getElementById('sim-empleados');
    const simHoras = document.getElementById('sim-horas');
    const simCosto = document.getElementById('sim-costo');
    const simEmpleadosVal = document.getElementById('sim-empleados-val');
    const simHorasVal = document.getElementById('sim-horas-val');
    const simCostoVal = document.getElementById('sim-costo-val');
    const simHorasMes = document.getElementById('sim-horas-mes');
    const simDiasMes = document.getElementById('sim-dias-mes');
    const simDineroAnio = document.getElementById('sim-dinero-anio');

    const EFICIENCIA_AUTOMATIZACION = 0.35;
    const SEMANAS_POR_MES = 4.33;
    const HORAS_POR_DIA_LABORAL = 8;

    function formatearMoneda(valor) {
        return '$' + Math.round(valor).toLocaleString('es-MX');
    }

    function calcularSimulador() {
        const empleados = parseInt(simEmpleados.value, 10);
        const horas = parseInt(simHoras.value, 10);
        const costo = parseInt(simCosto.value, 10);

        simEmpleadosVal.textContent = empleados;
        simHorasVal.textContent = horas + ' h';
        simCostoVal.textContent = formatearMoneda(costo);

        const horasManualesMes = empleados * horas * SEMANAS_POR_MES;
        const horasAhorradasMes = horasManualesMes * EFICIENCIA_AUTOMATIZACION;
        const diasAhorradosMes = horasAhorradasMes / HORAS_POR_DIA_LABORAL;
        const dineroAhorradoAnio = horasAhorradasMes * costo * 12;

        simHorasMes.textContent = Math.round(horasAhorradasMes).toLocaleString('es-MX');
        simDiasMes.textContent = diasAhorradosMes.toFixed(1);
        simDineroAnio.textContent = formatearMoneda(dineroAhorradoAnio);
    }

    if (simEmpleados && simHoras && simCosto) {
        [simEmpleados, simHoras, simCosto].forEach(function (input) {
            input.addEventListener('input', calcularSimulador);
        });
        calcularSimulador();
    }
// --- Red de particulas doradas en el hero ---
    function inicializarParticulasHero() {
        const canvas = document.getElementById('hero-particles');
        if (!canvas) return;

        const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ctx = canvas.getContext('2d');
        let ancho, alto, particulas, animFrame = null;

        function obtenerColorGold() {
            return getComputedStyle(document.documentElement).getPropertyValue('--gold-elegant').trim() || '#E3B82F';
        }

        function hexARgb(hex) {
            const limpio = hex.replace('#', '');
            const bigint = parseInt(limpio, 16);
            return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
        }

        function redimensionar() {
            const rect = canvas.parentElement.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            ancho = rect.width;
            alto = rect.height;
            canvas.width = ancho * dpr;
            canvas.height = alto * dpr;
            canvas.style.width = ancho + 'px';
            canvas.style.height = alto + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            crearParticulas();
        }

        function crearParticulas() {
            const cantidad = Math.round((ancho * alto) / 16000);
            particulas = [];
            for (let i = 0; i < cantidad; i++) {
                particulas.push({
                    x: Math.random() * ancho,
                    y: Math.random() * alto,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    r: Math.random() * 1.3 + 0.6
                });
            }
        }

        function dibujar() {
            const { r, g, b } = hexARgb(obtenerColorGold());
            ctx.clearRect(0, 0, ancho, alto);

            for (let i = 0; i < particulas.length; i++) {
                const p = particulas[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > ancho) p.vx *= -1;
                if (p.y < 0 || p.y > alto) p.vy *= -1;
            }

            for (let i = 0; i < particulas.length; i++) {
                for (let j = i + 1; j < particulas.length; j++) {
                    const a = particulas[i], b2 = particulas[j];
                    const dx = a.x - b2.x, dy = a.y - b2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        ctx.strokeStyle = `rgba(${r},${g},${b},${0.16 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b2.x, b2.y);
                        ctx.stroke();
                    }
                }
            }

            for (let i = 0; i < particulas.length; i++) {
                const p = particulas[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},0.55)`;
                ctx.fill();
            }

            if (animando) animFrame = requestAnimationFrame(dibujar);
        }

        let animando = false;
        function iniciarAnimacion() {
            if (animando || prefiereMenosMovimiento) return;
            animando = true;
            dibujar();
        }
        function detenerAnimacion() {
            animando = false;
            if (animFrame) {
                cancelAnimationFrame(animFrame);
                animFrame = null;
            }
        }

        redimensionar();

        // El resize se re-calcula con un pequeño debounce: evita reconstruir
        // todas las partículas en cada pixel mientras el usuario arrastra el borde de la ventana.
        let resizeTimeout = null;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(redimensionar, 150);
        }, { passive: true });

        if (prefiereMenosMovimiento) {
            // Se respeta la preferencia de movimiento reducido: se pinta un solo
            // cuadro estático de la red de partículas y no se anima.
            dibujar();
            return;
        }

        // La animación solo corre mientras el hero es visible en pantalla y la
        // pestaña está activa; en cualquier otro momento se detiene para no
        // consumir CPU/batería de fondo en el resto de la página.
        if (typeof IntersectionObserver === 'function') {
            const heroObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !document.hidden) {
                        iniciarAnimacion();
                    } else {
                        detenerAnimacion();
                    }
                });
            }, { threshold: 0 });
            heroObserver.observe(canvas);
        } else {
            iniciarAnimacion();
        }

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                detenerAnimacion();
            } else {
                const rect = canvas.getBoundingClientRect();
                const visible = rect.bottom > 0 && rect.top < window.innerHeight;
                if (visible) iniciarAnimacion();
            }
        });
    }
    // --- Video decorativo en "Nosotros": carga diferida, solo se reproduce cuando es visible.
    //     El poster (imagen estática) siempre queda visible aunque el video no cargue,
    //     no se reproduzca o el navegador no soporte los formatos ofrecidos. ---
    function inicializarVideoNosotros() {
        const aboutVideo = document.getElementById('about-video');
        if (!aboutVideo) return;

        // Lista de formatos candidatos, tomada del HTML (data-src de cada <source>).
        // No dejamos que el navegador maneje el fallback entre <source> solo: varios
        // navegadores (Opera/Chromium entre ellos) NO reintentan automáticamente con
        // el siguiente <source> cuando la fuente elegida falla al DECODIFICAR (solo
        // lo hacen si falla la carga de red), así que el reintento lo controlamos
        // manualmente reasignando aboutVideo.src.
        const candidatos = Array.prototype.map.call(
            aboutVideo.querySelectorAll('source[data-src]'),
            function (fuente) { return fuente.getAttribute('data-src'); }
        );
        let indiceFuente = -1;
        let seVioAlMenosUnFrame = false;

        aboutVideo.addEventListener('playing', function () {
            seVioAlMenosUnFrame = true;
        });

        function intentarSiguienteFuente() {
            indiceFuente++;
            if (indiceFuente >= candidatos.length) {
                if (!seVioAlMenosUnFrame) {
                    console.warn('El video de "Nosotros" no pudo reproducirse en ningún formato disponible; se muestra la imagen de portada.');
                }
                return;
            }
            aboutVideo.src = candidatos[indiceFuente];
            aboutVideo.load();
            aboutVideo.play().catch(function () { /* autoplay bloqueado: el poster/cuadro actual queda visible */ });
        }

        // Si la fuente activa falla (red o decodificación) el poster definido en el
        // HTML permanece visible mientras probamos con el siguiente formato.
        aboutVideo.addEventListener('error', intentarSiguienteFuente, true);

        const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefiereMenosMovimiento) {
            // Respetamos la preferencia de movimiento reducido sin ocultar el contenido:
            // el poster estático se queda mostrado y nunca se reproduce ni se carga el video.
            return;
        }

        if (typeof IntersectionObserver !== 'function') {
            // Navegadores muy antiguos sin IntersectionObserver: cargamos directo.
            intentarSiguienteFuente();
            return;
        }

        let cargado = false;
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (!cargado) {
                        cargado = true;
                        intentarSiguienteFuente();
                    } else {
                        aboutVideo.play().catch(function () { /* el navegador bloqueó el autoplay, no pasa nada */ });
                    }
                } else {
                    aboutVideo.pause();
                }
            });
        }, { threshold: 0.25 });

        observer.observe(aboutVideo);
    }

    // --- Inicialización ---
    // Cada paso corre de forma aislada: si alguno falla en algún navegador
    // poco común, el resto de las funciones de la página se siguen iniciando
    // en lugar de detenerse por completo.
    function pasoSeguro(nombre, fn) {
        try {
            fn();
        } catch (err) {
            console.error('Error al inicializar "' + nombre + '":', err);
        }
    }

    function inicializar() {
        pasoSeguro('tema', inicializarTema);
        pasoSeguro('fade-in', observarFadeIn);
        pasoSeguro('tilt-soluciones', function () { activarTilt3D('.solution-card', 5); });
        pasoSeguro('globo-3d', inicializarGlobo3D);
        pasoSeguro('stroke-text-hero', cargarGsapYStrokeText);
        pasoSeguro('contadores-hero', function () { inicializarContadores('.count-up'); });
        pasoSeguro('mapa-contacto', inicializarMapaContacto);
        pasoSeguro('chatbot-aureo', inicializarChatbotAureo);
        pasoSeguro('botones-especulares', inicializarBotonesEspeculares);
        pasoSeguro('video-nosotros', inicializarVideoNosotros);
        pasoSeguro('particulas-hero', inicializarParticulasHero);
    }

    // --- Respetar prefers-reduced-motion: simplificar transiciones ---
    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function aplicarTransicionesReducidas(reducir) {
        document.documentElement.style.setProperty('--transition-slow', reducir ? '0s' : '');
        document.documentElement.style.setProperty('--transition-smooth', reducir ? '0s' : '');
    }
    aplicarTransicionesReducidas(mediaQueryReducedMotion.matches);
    mediaQueryReducedMotion.addEventListener('change', function (e) {
        aplicarTransicionesReducidas(e.matches);
    });

    // --- Iniciar ---
    inicializar();

})();