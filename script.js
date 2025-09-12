document.addEventListener('DOMContentLoaded', () => {
    // --- INICIALIZACIÓN DEL HEADER Y MENÚ ---
    const header = document.getElementById('main-header') || document.querySelector('header');
    const menuToggle = document.getElementById('menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    const menuLinks = mainMenu ? mainMenu.querySelectorAll('a, button') : [];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ICON_MENU = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    const ICON_CLOSE = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    if (header) {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    header.classList.toggle('scrolled', window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    let prevScrollY = 0;
    let prevBodyPaddingRight = '';

    const lockScroll = () => {
        prevScrollY = window.scrollY;
        const scrollBarComp = window.innerWidth - document.documentElement.clientWidth;
        prevBodyPaddingRight = document.body.style.paddingRight;
        if (scrollBarComp > 0) document.body.style.paddingRight = `${scrollBarComp}px`;
        document.body.classList.add('no-scroll');
        document.body.style.top = `-${prevScrollY}px`;
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    };

    const unlockScroll = () => {
        document.body.classList.remove('no-scroll');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = prevBodyPaddingRight || '';
        window.scrollTo(0, prevScrollY);
    };

    let lastFocused = null;
    const isOpen = () => mainMenu.classList.contains('is-open');
    const setInert = (on) => {
        const mainEl = document.querySelector('main');
        if (mainEl && 'inert' in mainEl) mainEl.inert = on;
    };

    const focusTrapKeydown = (e) => {
        if (!isOpen() || e.key !== 'Tab') return;
        const focusables = [...mainMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')].filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    const openMenu = () => {
        mainMenu.classList.add('is-open');
        if (header) header.classList.add('menu-open');
        lockScroll();
        if (menuToggle) {
            menuToggle.innerHTML = ICON_CLOSE;
            menuToggle.setAttribute('aria-label', 'Cerrar menú');
            menuToggle.setAttribute('aria-expanded', 'true');
        }
        lastFocused = document.activeElement;
        setTimeout(() => {
            const firstLink = mainMenu.querySelector('a, button');
            firstLink?.focus();
        }, 0);
        document.addEventListener('keydown', onEscClose, true);
        document.addEventListener('keydown', focusTrapKeydown, true);
        setInert(true);
    };

    const closeMenu = () => {
        mainMenu.classList.remove('is-open');
        if (header) header.classList.remove('menu-open');
        unlockScroll();
        if (menuToggle) {
            menuToggle.innerHTML = ICON_MENU;
            menuToggle.setAttribute('aria-label', 'Abrir menú');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.focus();
        }
        document.removeEventListener('keydown', onEscClose, true);
        document.removeEventListener('keydown', focusTrapKeydown, true);
        setInert(false);
        if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    };

    const toggleMenu = () => (isOpen() ? closeMenu() : openMenu());
    const onEscClose = (e) => {
        if (e.key === 'Escape' && isOpen()) {
            e.preventDefault();
            closeMenu();
        }
    };

    if (menuToggle && mainMenu) {
        menuToggle.setAttribute('aria-controls', 'main-menu');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        menuToggle.addEventListener('click', toggleMenu);
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isOpen()) closeMenu();
            });
        });
        mainMenu.addEventListener('click', (e) => {
            if (e.target === mainMenu && isOpen()) closeMenu();
        });
        mainMenu.addEventListener('touchmove', (e) => {
            if (isOpen()) e.stopPropagation();
        }, { passive: true });
    }

    // --- INICIALIZACIÓN DE ANIMACIONES ---
    const animated = document.querySelectorAll('.animate-on-scroll');
    if (animated.length && !prefersReducedMotion) {
        const observer = new IntersectionObserver((entries, obs) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            }
        }, { threshold: 0.12, rootMargin: '60px 0px -20px 0px' });
        animated.forEach(el => observer.observe(el));
    } else {
        animated.forEach(el => el.classList.add('visible'));
    }

    // --- INICIALIZACIÓN DEL BOTÓN DE WHATSAPP (MEJORADO) ---
    const fab = document.getElementById('whatsapp-fab');
    const badge = document.getElementById('wapp-badge');
    const overlay = document.getElementById('wapp-overlay');
    const popup = document.getElementById('whatsapp-popup');
    const closeBtn = document.getElementById('close-popup');

    const VISIT_TTL_HOURS = 24; // Horas para considerar una "nueva visita" y mostrar el badge de nuevo.
    const LS_KEY_LAST_OPEN = 'wapp_last_open_ts_v1';

    const nowTs = () => Date.now();
    const hoursSince = (ts) => (nowTs() - ts) / 3600000; // 36e5 es 3.600.000 ms = 1 hora

    const shouldShowBadge = () => {
        try {
            const raw = localStorage.getItem(LS_KEY_LAST_OPEN);
            if (!raw) return true; // Si nunca se ha abierto, mostrar.
            const lastOpenedTs = Number(raw);
            if (isNaN(lastOpenedTs)) return true; // Si el dato es inválido, mostrar.
            return hoursSince(lastOpenedTs) >= VISIT_TTL_HOURS; // Mostrar si ha pasado el tiempo definido.
        } catch {
            return true; // En caso de error (ej: localStorage bloqueado), mostrar por defecto.
        }
    };

    const hideBadge = () => badge?.classList.add('is-hidden');
    const showBadge = () => badge?.classList.remove('is-hidden');

    const openWappPopup = () => {
        if (!overlay) return;
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        
        // Al abrir, se oculta el badge y se guarda la marca de tiempo.
        hideBadge();
        try {
            localStorage.setItem(LS_KEY_LAST_OPEN, String(nowTs()));
        } catch {}

        // Mejorar accesibilidad: poner el foco en el primer elemento accionable.
        setTimeout(() => popup?.querySelector('a, button')?.focus(), 100);
    };

    const closeWappPopup = () => {
        if (!overlay) return;
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        fab?.focus(); // Devolver el foco al botón principal al cerrar.
    };

    if (fab && overlay && popup) {
        // 1. Determinar el estado inicial del badge al cargar la página.
        shouldShowBadge() ? showBadge() : hideBadge();

        // 2. Abrir el popup al hacer clic en el botón flotante.
        fab.addEventListener('click', (e) => {
            e.preventDefault();
            openWappPopup();
        });

        // 3. Cerrar al hacer clic fuera del popup (en el overlay).
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeWappPopup();
            }
        });

        // 4. Cerrar al presionar la tecla "Escape".
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
                closeWappPopup();
            }
        });

        // 5. (Opcional) Funcionalidad para el botón de cerrar explícito.
        closeBtn?.addEventListener('click', closeWappPopup);
    }
});
