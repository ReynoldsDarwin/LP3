document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Animaciones al hacer scroll (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // 2. Resaltar menú activo según el scroll
    const sections = document.querySelectorAll("section.hero, h2.category-title");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                if (section.id) {
                    current = section.getAttribute("id");
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (current !== "" && link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // 3. Interruptor de Tema (Modo Claro / Oscuro)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
});

// 4. Lógica Inteligente para Documentos Word
function readDoc(fileName) {
    const isLocal = window.location.hostname === "localhost" || 
                    window.location.hostname === "127.0.0.1" || 
                    window.location.protocol === "file:";

    if (isLocal) {
        // En entorno local abre/descarga el archivo directamente de tu disco
        window.open(encodeURIComponent(fileName), '_blank');
    } else {
        // En producción (GitHub Pages) utiliza el visor web de Office
        let currentPath = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1);
        let fileUrl = currentPath + encodeURIComponent(fileName);
        let viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${fileUrl}`;
        window.open(viewerUrl, '_blank');
    }
}