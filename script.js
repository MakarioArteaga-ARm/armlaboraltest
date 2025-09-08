document.addEventListener('DOMContentLoaded', () => {
    // --- INICIALIZACIÓN DEL HEADER Y MENÚ ---
    const header = document.getElementById('main-header') || document.querySelector('header');
    const menuToggle = document.getElementById('menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('no-scroll');
            mainMenu.classList.toggle('is-open');
            header.classList.toggle('menu-open');
        });
    }

    // --- INICIALIZACIÓN DE ANIMACIONES (ESTRATEGIA "VAMOS TODOS JUNTOS") ---
    const animated = document.querySelectorAll('.animate-on-scroll');
    
    if (animated.length && !prefersReducedMotion) {
        // --- PASO 1: Hacer visible el PRIMER elemento INMEDIATAMENTE ---
        // Esto asegura que el contenido clave (la primera tarjeta) siempre se vea al cargar la página.
        const firstAnimatedElement = animated[0];
        if (firstAnimatedElement) {
            firstAnimatedElement.classList.add('visible');
        }

        // --- PASO 2: Observar el RESTO de los elementos para animarlos con el scroll ---
        const observer = new IntersectionObserver((entries, obs) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            }
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        // Se inicia el bucle desde el SEGUNDO elemento (índice 1) en adelante.
        for (let i = 1; i < animated.length; i++) {
            observer.observe(animated[i]);
        }

    } else {
        // Fallback: si no hay animaciones o el usuario las prefiere reducidas, se muestra todo.
        animated.forEach(el => el.classList.add('visible'));
    }

    // --- INICIALIZACIÓN DEL BOTÓN DE WHATSAPP ---
    const fab = document.getElementById('whatsapp-fab');
    const popup = document.getElementById('whatsapp-popup');
    const closeBtn = document.getElementById('close-popup');

    if (fab && popup && closeBtn) {
        fab.addEventListener('click', () => popup.style.display = 'block');
        closeBtn.addEventListener('click', () => popup.style.display = 'none');
    }
});

