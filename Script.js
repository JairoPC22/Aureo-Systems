/* ============================================
   AUREO SYSTEMS CONSULTING - LANDING PAGE
   Script.js
   ============================================ */

(function () {
    'use strict';

    // --- Datos de productos ---
    // Para usar tu propia foto en un producto, pon la ruta del PNG en "imagen".
    // Si "imagen" es null (o el archivo no existe), se usa el dibujo SVG como respaldo automático.
    const productos = [
        {
            id: 'HONOR MagicBook X 14',
            categoria: 'Cómputo empresarial',
            nombre: 'HONOR MagicBook X 14',
            descripcion: 'Laptop empresarial ultraligera con rendimiento excepcional para profesionales en movimiento.',
            caracteristicas: ['Procesador de última generación', 'Pantalla de alta resolución', 'Batería de larga duración'],
            precio: 'Cotizar',
            etiqueta: 'Recomendado',
            colorPrincipal: '#1A3C5F',
            colorSecundario: '#2C5F8A',
            colorIluminacion: 'rgba(44,95,138,0.5)',
            svgType: 'laptop',
            imagen: 'assets/Honor.png'
        },
        {
            id: 'Workstation Z de escritorio | HP',
            categoria: 'Cómputo empresarial',
            nombre: 'Workstation Z de escritorio | HP',
            descripcion: 'Estación de trabajo de alto rendimiento para diseño, análisis de datos y desarrollo de software.',
            caracteristicas: ['GPU profesional', 'Memoria expandible', 'Certificación ISV'],
            precio: 'Cotizar',
            etiqueta: 'Empresarial',
            colorPrincipal: '#1A3050',
            colorSecundario: '#3A6090',
            colorIluminacion: 'rgba(58,96,144,0.5)',
            svgType: 'desktop',
            imagen: 'assets/HP.png'
        },
        {
            id: 'Server Core X20r',
            categoria: 'Servidores y almacenamiento',
            nombre: 'Server Core X20r',
            descripcion: 'Servidor compacto diseñado para pequeñas y medianas empresas que necesitan fiabilidad y rendimiento.',
            caracteristicas: ['RAID integrado', 'Gestión remota', 'Bajo consumo energético'],
            precio: 'Cotizar',
            etiqueta: 'Nuevo',
            colorPrincipal: '#142131',
            colorSecundario: '#4A6A8A',
            colorIluminacion: 'rgba(74,106,138,0.5)',
            svgType: 'server',
            imagen: 'assets/Dell.png'
        },
        {
            id: 'linkmesh-business',
            categoria: 'Redes y conectividad',
            nombre: 'LinkMesh Business',
            descripcion: 'Sistema integral de conectividad y red empresarial con gestión centralizada y seguridad avanzada.',
            caracteristicas: ['Wi-Fi 6', 'Firewall integrado', 'Gestión en la nube'],
            precio: 'Cotizar',
            etiqueta: 'Recomendado',
            colorPrincipal: '#1A3C5F',
            colorSecundario: '#5B8CB8',
            colorIluminacion: 'rgba(91,140,184,0.5)',
            svgType: 'network',
            imagen: 'assets/Router.png'
        },
        {
            id: 'BenQ PD2706QN',
            categoria: 'Periféricos',
            nombre: 'BenQ PD2706QN',
            descripcion: 'Monitor profesional de 27 pulgadas con alta resolución, precisión de color y ergonomía avanzada.',
            caracteristicas: ['Resolución 4K UHD', 'Color 100% sRGB', 'Bisel ultradelgado'],
            precio: 'Cotizar',
            etiqueta: 'Empresarial',
            colorPrincipal: '#1A3550',
            colorSecundario: '#3A6580',
            colorIluminacion: 'rgba(58,101,128,0.5)',
            svgType: 'monitor',
            imagen: 'assets/BenQ.png'
        },
        {
            id: 'Xerox Altalink C8045',
            categoria: 'Impresión y oficina',
            nombre: 'Xerox Altalink C8045',
            descripcion: 'Impresora multifuncional láser para oficinas con alta productividad y bajo costo por página.',
            caracteristicas: ['Impresión dúplex', 'Escaneo en red', 'Bandeja de 250 hojas'],
            precio: 'Cotizar',
            etiqueta: 'Nuevo',
            colorPrincipal: '#1A3040',
            colorSecundario: '#5A7078',
            colorIluminacion: 'rgba(90,112,120,0.5)',
            svgType: 'printer',
            imagen: 'assets/Xerox.png'
        },
        {
            id: 'vaultstore-nas',
            categoria: 'Servidores y almacenamiento',
            nombre: 'VaultStore NAS',
            descripcion: 'Sistema de almacenamiento y respaldo empresarial con protección de datos y acceso remoto seguro.',
            caracteristicas: ['Hasta 48 TB', 'Snapshot automático', 'Cifrado AES-256'],
            precio: 'Cotizar',
            etiqueta: 'Empresarial',
            colorPrincipal: '#142530',
            colorSecundario: '#4A6068',
            colorIluminacion: 'rgba(74,96,104,0.5)',
            svgType: 'storage',
            imagen: 'assets/NAS.png'
        },
        {
            id: 'office-essential-kit',
            categoria: 'Suministros tecnológicos',
            nombre: 'Office Essential Kit',
            descripcion: 'Paquete completo de periféricos y suministros tecnológicos para equipar tu oficina desde cero.',
            caracteristicas: ['Teclado y mouse', 'Cables y adaptadores', 'Webcam HD'],
            precio: 'Cotizar',
            etiqueta: 'Recomendado',
            colorPrincipal: '#1A3830',
            colorSecundario: '#5A8878',
            colorIluminacion: 'rgba(90,136,120,0.5)',
            svgType: 'kit',
            imagen: 'assets/Office.png'
        }
    ];

    // --- Estado ---
    let productoActual = 0;
    let estaTransicionando = false;
    let autoplayActivo = true;
    let autoplayIntervalo = null;
    let autoplayPausadoPorUsuario = false;
    const DURACION_AUTOPLAY = 6000;
    const DURACION_TRANSICION = 550;

    // --- Elementos del DOM ---
    const header = document.getElementById('header');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-close');
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const mobileSolucionesToggle = document.getElementById('mobile-soluciones-toggle');
    const mobileSolucionesSub = document.getElementById('mobile-soluciones-sub');
    const scrollTopBtn = document.getElementById('scroll-top');
    const contactForm = document.getElementById('contact-form');
    const heroSection = document.querySelector('.hero');
    const heroBg = document.getElementById('hero-bg');
    const productSvgContainer = document.getElementById('product-svg-container');
    const productGlow = document.getElementById('product-glow');
    const productBadge = document.getElementById('product-badge');
    const productName = document.getElementById('product-name');
    const productDesc = document.getElementById('product-desc');
    const productFeatures = document.getElementById('product-features');
    const productPrice = document.getElementById('product-price');
    const heroPrev = document.getElementById('hero-prev');
    const heroNext = document.getElementById('hero-next');
    const heroIndicators = document.getElementById('hero-indicators');
    const heroCounter = document.getElementById('hero-counter');
    const nextProductName = document.getElementById('next-product-name');
    const autoplayToggle = document.getElementById('autoplay-toggle');
    const heroProductVisual = document.getElementById('hero-product-visual');
    const currentYearSpan = document.getElementById('current-year');
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    // --- SVG generators para cada tipo de producto (respaldo cuando no hay foto) ---
    function generarSVGLaptop(color1, color2) {
        return `
        <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${color1}"/>
              <stop offset="100%" stop-color="${color2}"/>
            </linearGradient>
            <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(255,255,255,0.15)"/>
              <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <rect x="25" y="30" width="150" height="95" rx="6" fill="url(#lg1)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
          <rect x="32" y="38" width="136" height="78" rx="2" fill="#0D1520" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <rect x="32" y="38" width="136" height="78" rx="2" fill="url(#lg2)" opacity="0.3"/>
          <rect x="55" y="95" width="90" height="6" rx="3" fill="rgba(255,255,255,0.1)"/>
          <path d="M40 125h120l12 10H28l12-10z" fill="url(#lg1)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <rect x="75" y="132" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.08)"/>
          <circle cx="170" cy="20" r="3" fill="rgba(227,184,47,0.4)" filter="url(#glow)"/>
        </svg>`;
    }

    function generarSVGDesktop(color1, color2) {
        return `
        <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${color1}"/>
              <stop offset="100%" stop-color="${color2}"/>
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="2"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <rect x="30" y="10" width="140" height="100" rx="8" fill="url(#dg1)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
          <rect x="38" y="20" width="124" height="78" rx="3" fill="#0D1520" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <rect x="38" y="20" width="124" height="78" rx="3" fill="rgba(255,255,255,0.04)"/>
          <rect x="85" y="72" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.12)"/>
          <rect x="60" y="110" width="80" height="8" rx="3" fill="url(#dg1)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <rect x="70" y="118" width="60" height="40" rx="4" fill="#1A2535" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
          <rect x="40" y="118" width="20" height="40" rx="3" fill="url(#dg1)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
          <circle cx="180" cy="15" r="3" fill="rgba(227,184,47,0.4)" filter="url(#glow)"/>
        </svg>`;
    }

    function generarSVGServer(color1, color2) {
        return `
        <svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${color1}"/>
              <stop offset="100%" stop-color="${color2}"/>
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="2"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <rect x="30" y="15" width="140" height="28" rx="5" fill="url(#sg1)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
          <circle cx="45" cy="29" r="4" fill="#2ecc71" filter="url(#glow)"/>
          <rect x="55" y="26" width="20" height="6" rx="3" fill="rgba(255,255,255,0.12)"/>
          <rect x="30" y="48" width="140" height="28" rx="5" fill="url(#sg1)" stroke="rgba(255,255,255,0.15)" stroke-width="1.2"/>
          <rect x="55" y="59" width="20" height="6" rx="3" fill="rgba(255,255,255,0.1)"/>
          <rect x="30" y="81" width="140" height="28" rx="5" fill="url(#sg1)" stroke="rgba(255,255,255,0.15)" stroke-width="1.2"/>
          <rect x="55" y="92" width="20" height="6" rx="3" fill="rgba(255,255,255,0.1)"/>
          <rect x="30" y="114" width="140" height="28" rx="5" fill="url(#sg1)" stroke="rgba(255,255,255,0.15)" stroke-width="1.2"/>
          <rect x="55" y="125" width="20" height="6" rx="3" fill="rgba(255,255,255,0.1)"/>
          <circle cx="155" cy="29" r="3" fill="rgba(227,184,47,0.4)"/>
        </svg>`;
    }

    function generarSVGNetwork(color1, color2) {
        return `
        <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ng1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${color1}"/>
              <stop offset="100%" stop-color="${color2}"/>
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="2"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <rect x="60" y="20" width="80" height="60" rx="10" fill="url(#ng1)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
          <rect x="70" y="32" width="60" height="5" rx="2" fill="rgba(255,255,255,0.1)"/>
          <rect x="70" y="42" width="40" height="5" rx="2" fill="rgba(255,255,255,0.08)"/>
          <line x1="60" y1="50" x2="40" y2="80" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="4 3"/>
          <line x1="140" y1="50" x2="160" y2="80" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="4 3"/>
          <line x1="100" y1="80" x2="100" y2="110" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="4 3"/>
          <circle cx="40" cy="85" r="10" fill="url(#ng1)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <circle cx="160" cy="85" r="10" fill="url(#ng1)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <circle cx="100" cy="120" r="12" fill="url(#ng1)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
          <circle cx="100" cy="120" r="4" fill="rgba(227,184,47,0.5)" filter="url(#glow)"/>
        </svg>`;
    }

    function generarSVGMonitor(color1, color2) {
        return `
        <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${color1}"/>
              <stop offset="100%" stop-color="${color2}"/>
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="2"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <rect x="20" y="15" width="160" height="105" rx="6" fill="#0D1520" stroke="url(#mg1)" stroke-width="4"/>
          <rect x="24" y="20" width="152" height="96" rx="3" fill="#0A1018"/>
          <rect x="24" y="20" width="152" height="96" rx="3" fill="rgba(255,255,255,0.03)"/>
          <rect x="75" y="100" width="50" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>
          <rect x="70" y="120" width="60" height="10" rx="4" fill="url(#mg1)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
          <rect x="55" y="130" width="90" height="8" rx="3" fill="url(#mg1)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
          <circle cx="175" cy="25" r="3" fill="rgba(227,184,47,0.5)" filter="url(#glow)"/>
        </svg>`;
    }

    function generarSVGPrinter(color1, color2) {
        return `
        <svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${color1}"/>
              <stop offset="100%" stop-color="${color2}"/>
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="2"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <rect x="30" y="55" width="140" height="70" rx="8" fill="url(#pg1)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
          <rect x="40" y="65" width="120" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
          <rect x="50" y="75" width="40" height="30" rx="3" fill="#0D1520" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <rect x="50" y="75" width="40" height="30" rx="3" fill="rgba(255,255,255,0.03)"/>
          <rect x="100" y="75" width="50" height="30" rx="3" fill="#0D1520" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <rect x="30" y="30" width="80" height="28" rx="4" fill="url(#pg1)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
          <rect x="38" y="36" width="64" height="16" rx="2" fill="rgba(255,255,255,0.04)"/>
          <rect x="40" y="125" width="120" height="14" rx="4" fill="url(#pg1)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="160" cy="50" r="3" fill="rgba(227,184,47,0.4)" filter="url(#glow)"/>
        </svg>`;
    }

    function generarSVGStorage(color1, color2) {
        return `
        <svg viewBox="0 0 200 170" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="stg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${color1}"/>
              <stop offset="100%" stop-color="${color2}"/>
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="2"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <rect x="40" y="20" width="120" height="110" rx="10" fill="url(#stg1)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
          <rect x="55" y="35" width="90" height="8" rx="4" fill="rgba(255,255,255,0.1)"/>
          <rect x="55" y="50" width="70" height="6" rx="3" fill="rgba(255,255,255,0.07)"/>
          <rect x="55" y="65" width="80" height="6" rx="3" fill="rgba(255,255,255,0.07)"/>
          <rect x="55" y="80" width="60" height="6" rx="3" fill="rgba(255,255,255,0.07)"/>
          <circle cx="145" cy="35" r="4" fill="rgba(227,184,47,0.5)" filter="url(#glow)"/>
          <circle cx="145" cy="55" r="4" fill="#2ecc71" opacity="0.6"/>
        </svg>`;
    }

    function generarSVGKit(color1, color2) {
        return `
        <svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="kg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="${color1}"/>
              <stop offset="100%" stop-color="${color2}"/>
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="2"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <rect x="50" y="50" width="100" height="70" rx="8" fill="url(#kg1)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
          <rect x="62" y="62" width="35" height="20" rx="4" fill="#0D1520" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <rect x="105" y="62" width="32" height="20" rx="4" fill="#0D1520" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <rect x="62" y="90" width="25" height="16" rx="3" fill="#0D1520" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <rect x="95" y="90" width="42" height="16" rx="3" fill="#0D1520" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <circle cx="160" cy="55" r="4" fill="rgba(227,184,47,0.5)" filter="url(#glow)"/>
          <circle cx="40" cy="60" r="3" fill="rgba(255,255,255,0.2)"/>
          <circle cx="45" cy="80" r="2.5" fill="rgba(255,255,255,0.15)"/>
        </svg>`;
    }

    function obtenerSVGProducto(producto) {
        switch (producto.svgType) {
            case 'laptop':
                return generarSVGLaptop(producto.colorPrincipal, producto.colorSecundario);
            case 'desktop':
                return generarSVGDesktop(producto.colorPrincipal, producto.colorSecundario);
            case 'server':
                return generarSVGServer(producto.colorPrincipal, producto.colorSecundario);
            case 'network':
                return generarSVGNetwork(producto.colorPrincipal, producto.colorSecundario);
            case 'monitor':
                return generarSVGMonitor(producto.colorPrincipal, producto.colorSecundario);
            case 'printer':
                return generarSVGPrinter(producto.colorPrincipal, producto.colorSecundario);
            case 'storage':
                return generarSVGStorage(producto.colorPrincipal, producto.colorSecundario);
            case 'kit':
                return generarSVGKit(producto.colorPrincipal, producto.colorSecundario);
            default:
                return generarSVGLaptop(producto.colorPrincipal, producto.colorSecundario);
        }
    }

    // --- Renderiza la foto del producto si existe "imagen"; si falla o no existe, usa el SVG ---
    function renderizarVisualProducto(producto) {
        productSvgContainer.innerHTML = '';
        if (producto.imagen) {
            const img = document.createElement('img');
            img.src = producto.imagen;
            img.alt = producto.nombre;
            img.className = 'hero__product-img';
            img.loading = 'lazy';
            img.onerror = function () {
                productSvgContainer.innerHTML = obtenerSVGProducto(producto);
            };
            productSvgContainer.appendChild(img);
        } else {
            productSvgContainer.innerHTML = obtenerSVGProducto(producto);
        }
    }

    // --- Crear indicadores ---
    function crearIndicadores() {
        heroIndicators.innerHTML = '';
        productos.forEach((_, index) => {
            const btn = document.createElement('button');
            btn.className = 'hero__indicator';
            btn.setAttribute('aria-label', `Ir al producto ${index + 1}: ${productos[index].nombre}`);
            btn.setAttribute('role', 'tab');
            btn.setAttribute('aria-selected', index === productoActual ? 'true' : 'false');
            btn.addEventListener('click', () => {
                cambiarProducto(index, index > productoActual ? 'next' : 'prev');
                reiniciarAutoplay();
            });
            heroIndicators.appendChild(btn);
        });
        actualizarIndicadores();
    }

    function actualizarIndicadores() {
        const indicadores = heroIndicators.querySelectorAll('.hero__indicator');
        indicadores.forEach((ind, i) => {
            if (i === productoActual) {
                ind.classList.add('hero__indicator--active');
                ind.setAttribute('aria-selected', 'true');
            } else {
                ind.classList.remove('hero__indicator--active');
                ind.setAttribute('aria-selected', 'false');
            }
        });
    }

    // --- Actualizar UI del producto ---
    function actualizarUIProducto(producto) {
        productBadge.textContent = producto.etiqueta;
        productName.textContent = producto.nombre;
        productDesc.textContent = producto.descripcion;
        productPrice.textContent = producto.precio;
        productFeatures.innerHTML = producto.caracteristicas.map(c => `<li>${c}</li>`).join('');
        renderizarVisualProducto(producto);
        productGlow.style.background = producto.colorIluminacion;
        heroBg.style.background = `radial-gradient(ellipse at 60% 40%, ${producto.colorIluminacion} 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(20,33,49,0.8) 0%, transparent 50%)`;
        actualizarContador();
        actualizarSiguienteProducto();
        actualizarIndicadores();
    }

    function actualizarContador() {
        const num = String(productoActual + 1).padStart(2, '0');
        const total = String(productos.length).padStart(2, '0');
        heroCounter.textContent = `${num} / ${total}`;
    }

    function actualizarSiguienteProducto() {
        const siguiente = (productoActual + 1) % productos.length;
        nextProductName.textContent = productos[siguiente].nombre;
    }

    // --- Cambiar producto con animación ---
    function cambiarProducto(nuevoIndice, direccion = 'next') {
        if (estaTransicionando || nuevoIndice === productoActual) return;
        if (nuevoIndice < 0 || nuevoIndice >= productos.length) return;

        estaTransicionando = true;
        productoActual = nuevoIndice;

        heroPrev.disabled = true;
        heroNext.disabled = true;

        const container = heroProductVisual.querySelector('.hero__product-svg-container');
        const details = document.getElementById('hero-product-details');

        const salidaX = direccion === 'next' ? '-40px' : '40px';
        const entradaX = direccion === 'next' ? '40px' : '-40px';

        container.style.transition = `all ${DURACION_TRANSICION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        container.style.transform = `translateX(${salidaX}) scale(0.85)`;
        container.style.opacity = '0';
        container.style.filter = 'blur(6px)';

        if (details) {
            details.style.transition = `all ${DURACION_TRANSICION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            details.style.transform = `translateX(${salidaX})`;
            details.style.opacity = '0';
        }

        setTimeout(() => {
            actualizarUIProducto(productos[productoActual]);

            container.style.transition = 'none';
            container.style.transform = `translateX(${entradaX}) scale(0.85)`;
            container.style.opacity = '0';
            container.style.filter = 'blur(4px)';

            if (details) {
                details.style.transition = 'none';
                details.style.transform = `translateX(${entradaX})`;
                details.style.opacity = '0';
            }

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    container.style.transition = `all ${DURACION_TRANSICION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                    container.style.transform = 'translateX(0) scale(1)';
                    container.style.opacity = '1';
                    container.style.filter = 'blur(0)';

                    if (details) {
                        details.style.transition = `all ${DURACION_TRANSICION * 0.8}ms cubic-bezier(0.4, 0, 0.2, 1) ${DURACION_TRANSICION * 0.15}ms`;
                        details.style.transform = 'translateX(0)';
                        details.style.opacity = '1';
                    }
                });
            });

            setTimeout(() => {
                estaTransicionando = false;
                heroPrev.disabled = false;
                heroNext.disabled = false;
            }, DURACION_TRANSICION + 100);
        }, DURACION_TRANSICION * 0.6);
    }

    function productoAnterior() {
        const nuevoIndice = productoActual === 0 ? productos.length - 1 : productoActual - 1;
        cambiarProducto(nuevoIndice, 'prev');
        reiniciarAutoplay();
    }

    function productoSiguiente() {
        const nuevoIndice = (productoActual + 1) % productos.length;
        cambiarProducto(nuevoIndice, 'next');
        reiniciarAutoplay();
    }

    // --- Ir a un producto específico por categoría (desde el catálogo) ---
    function irAProductoDeCategoria(categoria) {
        const indice = productos.findIndex(p => p.categoria === categoria);
        if (indice === -1) return;
        const direccion = indice > productoActual ? 'next' : 'prev';
        if (indice !== productoActual) {
            cambiarProducto(indice, direccion);
            reiniciarAutoplay();
        }
        const offset = header.offsetHeight + 16;
        const top = heroSection.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // Pulso visual sobre la vista del producto para confirmar la selección
        setTimeout(() => {
            heroProductVisual.classList.add('category-card--pulse');
            setTimeout(() => heroProductVisual.classList.remove('category-card--pulse'), 1000);
        }, 400);
    }

    // --- Autoplay ---
    function iniciarAutoplay() {
        detenerAutoplay();
        if (!autoplayActivo) return;
        autoplayIntervalo = setInterval(() => {
            if (!document.hidden && autoplayActivo && !estaTransicionando && !autoplayPausadoPorUsuario) {
                productoSiguiente();
            }
        }, DURACION_AUTOPLAY);
    }

    function detenerAutoplay() {
        if (autoplayIntervalo) {
            clearInterval(autoplayIntervalo);
            autoplayIntervalo = null;
        }
    }

    function reiniciarAutoplay() {
        detenerAutoplay();
        autoplayPausadoPorUsuario = false;
        actualizarIconoAutoplay();
        iniciarAutoplay();
    }

    function toggleAutoplay() {
        autoplayPausadoPorUsuario = !autoplayPausadoPorUsuario;
        if (autoplayPausadoPorUsuario) {
            detenerAutoplay();
        } else {
            iniciarAutoplay();
        }
        actualizarIconoAutoplay();
    }

    function actualizarIconoAutoplay() {
        const playIcon = autoplayToggle.querySelector('.hero__play-icon');
        const pauseIcon = autoplayToggle.querySelector('.hero__pause-icon');
        if (autoplayPausadoPorUsuario) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            autoplayToggle.setAttribute('aria-label', 'Reanudar reproducción automática');
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            autoplayToggle.setAttribute('aria-label', 'Pausar reproducción automática');
        }
    }

    // --- Eventos del catálogo ---
    heroPrev.addEventListener('click', productoAnterior);
    heroNext.addEventListener('click', productoSiguiente);
    autoplayToggle.addEventListener('click', toggleAutoplay);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft' && !mobileMenu.classList.contains('mobile-menu--open')) {
            e.preventDefault();
            productoAnterior();
        } else if (e.key === 'ArrowRight' && !mobileMenu.classList.contains('mobile-menu--open')) {
            e.preventDefault();
            productoSiguiente();
        }
    });

    // Touch swipe
    let touchStartX = 0;
    let touchEndX = 0;
    heroSection.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    heroSection.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                productoSiguiente();
            } else {
                productoAnterior();
            }
        }
    });

    // Pausar autoplay al pasar el cursor sobre el hero
    heroSection.addEventListener('mouseenter', function () {
        detenerAutoplay();
    });
    heroSection.addEventListener('mouseleave', function () {
        if (!autoplayPausadoPorUsuario) {
            iniciarAutoplay();
        }
    });

    // Pausar cuando la pestaña no está visible
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            detenerAutoplay();
        } else if (!autoplayPausadoPorUsuario) {
            iniciarAutoplay();
        }
    });

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
    window.addEventListener('scroll', actualizarHeaderScroll, { passive: true });
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

    // Cerrar menú móvil al seleccionar enlace
    const mobileLinks = mobileMenu.querySelectorAll('a[data-section], .mobile-menu__sublink');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function () {
            cerrarMenuMovil();
        });
    });

    // Escape para cerrar menú
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (mobileMenu.classList.contains('mobile-menu--open')) {
                cerrarMenuMovil();
            }
            if (dropdownMenu.classList.contains('header__dropdown-menu--visible')) {
                cerrarDropdown();
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

    // --- Navegación activa por scroll ---
    const secciones = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__link[data-section]');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu__link[data-section]');

    function actualizarNavActiva() {
        let scrollPos = window.scrollY + 150;
        secciones.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('header__link--active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('header__link--active');
                    }
                });
                mobileNavLinks.forEach(link => {
                    if (link.getAttribute('data-section') === id) {
                        link.style.color = 'var(--gold-elegant)';
                    } else {
                        link.style.color = '';
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', actualizarNavActiva, { passive: true });

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
                const offset = header.offsetHeight + 16;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Catálogo: al hacer clic en una tarjeta de categoría, salta al producto de esa categoría ---
    document.querySelectorAll('.category-card').forEach(card => {
        const categoria = card.getAttribute('data-categoria');
        const activar = (e) => {
            if (e.target.closest('a')) {
                e.preventDefault();
            }
            irAProductoDeCategoria(categoria);
        };
        card.addEventListener('click', activar);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                irAProductoDeCategoria(categoria);
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

    // --- Contadores animados ---
    const statsSection = document.querySelector('.about__stats');
    const statElements = statsSection ? statsSection.querySelectorAll('.about__stat') : [];
    let contadoresAnimados = false;

    function animarContador(el, valorFinal) {
        const numberEl = el.querySelector('.about__stat-number');
        if (!numberEl) return;
        const duracion = 2000;
        const inicio = performance.now();
        const inicioValor = 0;

        function actualizar(timestamp) {
            const progreso = Math.min((timestamp - inicio) / duracion, 1);
            const ease = 1 - Math.pow(1 - progreso, 3);
            const valorActual = Math.round(inicioValor + (valorFinal - inicioValor) * ease);
            numberEl.textContent = valorActual;
            if (progreso < 1) {
                requestAnimationFrame(actualizar);
            } else {
                numberEl.textContent = valorFinal;
            }
        }
        requestAnimationFrame(actualizar);
    }

    function observarContadores() {
        if (!statsSection || contadoresAnimados) return;
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !contadoresAnimados) {
                    contadoresAnimados = true;
                    statElements.forEach(stat => {
                        const count = parseInt(stat.getAttribute('data-count'));
                        if (count) animarContador(stat, count);
                    });
                    observer.unobserve(statsSection);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }

    // --- Animaciones al entrar en pantalla (con cascada por grupo) ---
    function observarFadeIn() {
        const grupos = [
            '.category-card',
            '.solution-card',
            '.about__stat',
            '.process-step',
            '.simulator__panel',
            '.testimonial-card',
            '.cta__title, .cta__desc, .cta__actions',
            '.faq__item',
            '.contact__form, .contact__info-card'
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

    // --- Inclinación 3D del producto destacado en el hero (sigue al cursor) ---
    function activarTiltHeroProducto() {
        if (!heroProductVisual || window.matchMedia('(pointer: coarse)').matches) return;
        let frame = null;
        heroProductVisual.addEventListener('mousemove', (e) => {
            if (frame) cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const rect = heroProductVisual.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                productSvgContainer.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateZ(10px)`;
            });
        });
        heroProductVisual.addEventListener('mouseleave', () => {
            if (frame) cancelAnimationFrame(frame);
            productSvgContainer.style.transform = '';
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
            const prefiereClaro = window.matchMedia('(prefers-color-scheme: light)').matches;
            aplicarTema(prefiereClaro ? 'light' : 'dark', false);
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

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validarFormulario()) return;

        // Simular envío
        const submitBtn = contactForm.querySelector('.contact__submit');
        const textoOriginal = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = textoOriginal;
            submitBtn.disabled = false;
            contactForm.reset();
            const successEl = document.getElementById('contact-success');
            successEl.style.display = 'flex';
            // Limpiar errores
            ['nombre', 'telefono', 'email', 'mensaje'].forEach(limpiarError);
            // Ocultar mensaje de éxito después de 8 segundos
            setTimeout(() => {
                successEl.style.display = 'none';
            }, 8000);
        }, 1200);
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

            animFrame = requestAnimationFrame(dibujar);
        }

        redimensionar();
        window.addEventListener('resize', redimensionar, { passive: true });

        if (prefiereMenosMovimiento) {
            dibujar();
            cancelAnimationFrame(animFrame);
        } else {
            dibujar();
        }
    }
    // --- Video decorativo en "Nosotros": carga diferida, solo se reproduce cuando es visible ---
    function inicializarVideoNosotros() {
        const aboutVideo = document.getElementById('about-video');
        if (!aboutVideo) return;

        const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefiereMenosMovimiento) {
            const contenedor = aboutVideo.closest('.about__media');
            if (contenedor) contenedor.style.display = 'none';
            return;
        }

        const fuentes = aboutVideo.querySelectorAll('source[data-src]');
        let cargado = false;

        aboutVideo.addEventListener('error', function () {
            const contenedor = aboutVideo.closest('.about__video-wrap');
            if (contenedor) contenedor.style.display = 'none';
        }, true);

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    if (!cargado) {
                        fuentes.forEach(function (fuente) {
                            fuente.src = fuente.getAttribute('data-src');
                        });
                        aboutVideo.load();
                        cargado = true;
                    }
                    aboutVideo.play().catch(function () { /* el navegador bloqueó el autoplay, no pasa nada */ });
                } else {
                    aboutVideo.pause();
                }
            });
        }, { threshold: 0.25 });

        observer.observe(aboutVideo);
    }

    // --- Inicialización ---
    function inicializar() {
        inicializarTema();
        crearIndicadores();
        actualizarUIProducto(productos[productoActual]);
        iniciarAutoplay();
        observarContadores();
        observarFadeIn();
        actualizarIconoAutoplay();
        activarTilt3D('.category-card', 6);
        activarTilt3D('.solution-card', 5);
        activarTiltHeroProducto();
        inicializarVideoNosotros();
        inicializarParticulasHero();
    }

    // --- Respetar prefers-reduced-motion ---
    const mediaQueryReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQueryReducedMotion.matches) {
        autoplayActivo = false;
        detenerAutoplay();
        // Simplificar transiciones
        document.documentElement.style.setProperty('--transition-slow', '0s');
        document.documentElement.style.setProperty('--transition-smooth', '0s');
    }
    mediaQueryReducedMotion.addEventListener('change', function (e) {
        if (e.matches) {
            autoplayActivo = false;
            detenerAutoplay();
        } else {
            autoplayActivo = true;
            if (!autoplayPausadoPorUsuario) iniciarAutoplay();
        }
    });

    // --- Iniciar ---
    inicializar();

})();