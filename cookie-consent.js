document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos los elementos del DOM una sola vez para mayor eficiencia.
    const banner = document.getElementById('cookie-consent-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const rejectBtn = document.getElementById('cookie-reject-btn');
    const funcionCheckbox = document.getElementById('cookies-funcion');

    // Si alguno de los elementos cruciales no existe, detenemos la ejecución.
    if (!banner || !acceptBtn || !rejectBtn || !funcionCheckbox) {
        console.error('No se encontraron los elementos del banner de cookies. Asegúrate de que el HTML es correcto.');
        return;
    }

    // 1. Verificamos si el usuario ya ha tomado una decisión previamente.
    // Usamos localStorage, que es una pequeña "memoria" en el navegador del usuario.
    const consent = localStorage.getItem('cookie_consent_armlaboral');

    // Si no se encuentra un valor guardado, significa que es la primera visita (o se borraron las cookies).
    if (!consent) {
        // Mostramos el banner añadiendo una clase que controla su visibilidad.
        banner.classList.add('is-visible');
    }

    // Función para ocultar el banner con una animación suave.
    const hideBanner = () => {
        banner.classList.add('is-hidden');
        // Usamos un temporizador que coincide con la duración de la animación en el CSS.
        // Esto asegura que el banner se oculte del DOM solo después de que la animación de desvanecimiento termine.
        setTimeout(() => {
            // Cambiamos el estilo 'display' a 'none' para que no ocupe espacio ni sea interactuable.
            banner.style.display = 'none';
        }, 500); // 500ms, igual que la transición en el CSS
    };

    // 2. Definimos lo que sucede al hacer clic en "Aceptar todo".
    acceptBtn.addEventListener('click', () => {
        // Marcamos la casilla de "Función y Análisis" como un efecto visual.
        funcionCheckbox.checked = true;

        // Guardamos la decisión del usuario con el valor 'accepted'.
        localStorage.setItem('cookie_consent_armlaboral', 'accepted');

        // Ocultamos el banner.
        hideBanner();
    });

    // 3. Definimos lo que sucede al hacer clic en "Rechazar".
    rejectBtn.addEventListener('click', () => {
        // Aunque rechace, la casilla de "Función y Análisis" no se marca.
        funcionCheckbox.checked = false;

        // Guardamos la decisión del usuario con el valor 'rejected'.
        // Podrías usar esta información para no cargar Google Analytics si lo deseas en un futuro.
        localStorage.setItem('cookie_consent_armlaboral', 'rejected');

        // Ocultamos el banner.
        hideBanner();
    });
});
