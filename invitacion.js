// Obtener parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const nombre = urlParams.get('nombre');
const apellido = urlParams.get('apellido');

// Función para capitalizar la primera letra
function capitalizarPrimeraLetra(texto) {
    if (!texto) return '';
    texto = texto.trim();
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// Función para formatear nombre completo
function formatearNombreCompleto(nombre, apellido) {
    if (!nombre || !apellido) return '';
    
    // Dividir nombres y apellidos
    const nombres = nombre.split(' ').filter(n => n.trim() !== '');
    const apellidos = apellido.split(' ').filter(a => a.trim() !== '');
    
    // Capitalizar cada parte
    const nombresFormateados = nombres.map(n => capitalizarPrimeraLetra(n));
    const apellidosFormateados = apellidos.map(a => capitalizarPrimeraLetra(a));
    
    // Unir con espacios
    return `${nombresFormateados.join(' ')} ${apellidosFormateados.join(' ')}`;
}

// Mostrar nombre del invitado
if (nombre && apellido) {
    const nombreCompleto = formatearNombreCompleto(nombre, apellido);
    document.getElementById('guestName').textContent = nombreCompleto;
    console.log('Nombre formateado:', nombreCompleto);
}

// Función para descargar la invitación
function downloadInvitation() {
    const invitationCard = document.querySelector('.invitation-card');
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'loading-message';
    loadingMessage.innerHTML = '<div class="loading-spinner"></div><p>Generando invitación...</p>';
    document.body.appendChild(loadingMessage);

    // Asegurarse de que todas las imágenes estén cargadas
    const images = invitationCard.getElementsByTagName('img');
    const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve, reject) => {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
                img.onerror = reject;
            }
        });
    });

    Promise.all(imagePromises)
        .then(() => {
            return html2canvas(invitationCard, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: true,
                onclone: (clonedDoc) => {
                    const clonedCard = clonedDoc.querySelector('.invitation-card');
                    clonedCard.style.transform = 'none';
                    clonedCard.style.width = '800px';
                    clonedCard.style.height = 'auto';
                }
            });
        })
        .then(canvas => {
            const link = document.createElement('a');
            const nombre = document.getElementById('guestName').textContent;
            link.download = `Invitacion_${nombre.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
            loadingMessage.remove();
            
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = '¡Invitación descargada con éxito!';
            document.body.appendChild(successMessage);
            setTimeout(() => successMessage.remove(), 3000);
        })
        .catch(error => {
            console.error('Error al generar la invitación:', error);
            loadingMessage.remove();
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Error al generar la invitación. Por favor, intente nuevamente.';
            document.body.appendChild(errorMessage);
            setTimeout(() => errorMessage.remove(), 3000);
        });
}

// Crear partículas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) {
        const container = document.createElement('div');
        container.id = 'particles';
        document.body.appendChild(container);
    }

    const particleCount = 100;
    const colors = [
        '#FFD700',    // Amarillo vivo
        '#FFA500',    // Anaranjado
        '#808080',    // Gris
        '#000000',    // Negro
        '#DAA520',    // Marrón amarillento
        '#FFE4B5',    // Yema de huevo
        '#696969',    // Gris oscuro
        '#FFD700',    // Amarillo
        '#FFFFFF',    // Blanco
        '#FFE5B4'     // Melocotón
    ];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() < 0.4 ? 'small' : Math.random() < 0.7 ? 'medium' : 'large';
        particle.className = `particle ${size}`;

        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.opacity = Math.random() * 0.6 + 0.2;
        particle.style.animationDuration = `${Math.random() * 15 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;

        document.getElementById('particles').appendChild(particle);
    }
}

// Iniciar partículas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
});

// Función para mover partículas con el mouse
function moveParticles(e) {
    const particles = document.querySelectorAll('.particle');
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    particles.forEach(particle => {
        const rect = particle.getBoundingClientRect();
        const particleX = rect.left + rect.width / 2;
        const particleY = rect.top + rect.height / 2;

        const deltaX = mouseX - particleX;
        const deltaY = mouseY - particleY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 200;

        if (distance < maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            const force = (maxDistance - distance) / maxDistance;
            const moveX = Math.cos(angle) * force * 30;
            const moveY = Math.sin(angle) * force * 30;

            particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
            particle.style.transform = 'translate(0, 0)';
        }
    });
}

// Agregar eventos de mouse y touch
document.addEventListener('mousemove', moveParticles);
document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    moveParticles({
        clientX: touch.clientX,
        clientY: touch.clientY
    });
});

// Restaurar posición original cuando el mouse/touch sale
document.addEventListener('mouseleave', () => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.style.transform = 'translate(0, 0)';
    });
}); 