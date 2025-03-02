document.querySelectorAll('.linkedin-link').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        let username = link.getAttribute('data-linkedin');
        let linkedInAppUrl = `linkedin://in/${username}`;
        let linkedInWebUrl = `https://www.linkedin.com/in/${username}/`;

        // Intentar abrir en la app
        window.location.href = linkedInAppUrl;

        // Si no abre, ir al navegador después de 500ms
        setTimeout(() => {
            window.location.href = linkedInWebUrl;
        }, 500);
    });
});