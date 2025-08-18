/**
 * Módulo de scroll por secciones
 * Maneja la navegación suave entre secciones de la página
 */

export function initSmoothScroll() {
    // No aplicar el scroll por secciones en dispositivos móviles/tablets
    if (window.innerWidth <= 1024) return;
    
    // Obtener todas las secciones
    const sections = document.querySelectorAll('.grid-section');
    const sectionsArray = Array.from(sections);
    
    // Obtener el footer y añadirlo como una sección más
    const footer = document.querySelector('footer.site-footer');
    if (footer) {
        sectionsArray.push(footer);
    }
    
    // Variables para controlar el scroll
    let isScrolling = false;
    let currentSectionIndex = 0;
    let lastScrollTime = 0;
    const scrollCooldown = 800; // Tiempo en ms
    
    // Configuración para ajustar posibles offsets por cabeceras fijas
    const offsetAdjustment = 0; // Ajustar según sea necesario
    
    // Función para desplazarse a una sección específica
    function scrollToSection(index) {
        if (index < 0) index = 0;
        if (index >= sectionsArray.length) index = sectionsArray.length - 1;
        
        currentSectionIndex = index;
        const targetSection = sectionsArray[index];
        
        isScrolling = true;
        
        // Calcular la posición exacta para centrar la sección
        const targetPosition = targetSection.offsetTop - (window.innerHeight - targetSection.offsetHeight) / 2 + offsetAdjustment;
        
        // Si es el footer, asegurar que se vea completo
        if (targetSection === footer) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            // Usar scrollTo para mayor compatibilidad entre navegadores
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        // Asegurar que isScrolling se restablezca después de un tiempo máximo
        setTimeout(() => {
            isScrolling = false;
        }, 1000); // Tiempo máximo de animación de scroll
    }
    
    // Usar IntersectionObserver para detectar cuando termina el scroll
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && isScrolling) {
                // La sección está visible, podemos desbloquear el scroll
                setTimeout(() => {
                    isScrolling = false;
                }, 100); // Pequeño retraso para evitar rebotes
            }
        });
    }, { threshold: 0.5 }); // Observar cuando al menos 50% de la sección es visible
    
    // Observar todas las secciones
    sectionsArray.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Detectar eventos de scroll
    window.addEventListener('wheel', (event) => {
        // Evitar procesamiento si ya estamos desplazándonos o si no ha pasado suficiente tiempo
        const now = new Date().getTime();
        if (isScrolling || now - lastScrollTime < scrollCooldown) {
            event.preventDefault();
            return;
        }
        
        lastScrollTime = now;
        
        // Determinar la dirección del scroll
        const direction = event.deltaY > 0 ? 1 : -1;
        
        // Calcular la siguiente sección
        const nextSectionIndex = currentSectionIndex + direction;
        
        // Desplazarse a la siguiente sección si es válida
        if (nextSectionIndex >= 0 && nextSectionIndex < sectionsArray.length) {
            event.preventDefault();
            scrollToSection(nextSectionIndex);
        }
    }, { passive: false });
    
    // Función para encontrar la sección visible
    function findVisibleSection() {
        // Punto medio de la ventana con ajuste de offset
        const scrollPosition = window.scrollY + window.innerHeight / 2 + offsetAdjustment;
        
        // Comprobar si estamos cerca del final de la página (footer)
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            currentSectionIndex = sectionsArray.length - 1;
            return;
        }
        
        for (let i = 0; i < sectionsArray.length; i++) {
            const section = sectionsArray[i];
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionIndex = i;
                break;
            }
        }
    }
    
    // Detectar cuando termina el scroll para centrar la sección
    if ('onscrollend' in window) {
        window.addEventListener('scrollend', () => {
            // Solo ajustar si no estamos en medio de una animación controlada
            if (!isScrolling) {
                findVisibleSection();
                // Usar un enfoque más suave para evitar bucles
                if (Math.abs(window.scrollY - (sectionsArray[currentSectionIndex].offsetTop - (window.innerHeight - sectionsArray[currentSectionIndex].offsetHeight) / 2)) > 50) {
                    // No reajustar si estamos en el footer
                    if (currentSectionIndex < sectionsArray.length - 1 || sectionsArray[currentSectionIndex] !== footer) {
                        scrollToSection(currentSectionIndex);
                    }
                }
            }
        });
    } else {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (isScrolling) return;
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                findVisibleSection();
                // Usar un enfoque más suave para evitar bucles
                if (Math.abs(window.scrollY - (sectionsArray[currentSectionIndex].offsetTop - (window.innerHeight - sectionsArray[currentSectionIndex].offsetHeight) / 2)) > 50) {
                    // No reajustar si estamos en el footer
                    if (currentSectionIndex < sectionsArray.length - 1 || sectionsArray[currentSectionIndex] !== footer) {
                        scrollToSection(currentSectionIndex);
                    }
                }
            }, 150);
        });
    }
    
    // Agregar un mecanismo de "escape" para desbloquear el scroll si se queda clavado
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            isScrolling = false;
        }
    });
    
    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
        // Desactivar en móvil/tablet
        if (window.innerWidth <= 1024) {
            // Desconectar el observer y limpiar eventos si cambia a móvil
            sectionObserver.disconnect();
            return;
        }
        
        // Recalcular la sección visible si cambia el tamaño en desktop
        findVisibleSection();
    });
    
    // Inicializar la sección visible al cargar
    findVisibleSection();
}