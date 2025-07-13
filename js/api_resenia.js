// Importa la función de alerta personalizada
// En un entorno real, esto se manejaría con módulos ES6 o un bundler.
// Para este ejemplo, asumimos que showCustomAlert está disponible globalmente.

function traer() {
    const contenido = document.getElementById("contenido");
    const loadingMessage = document.getElementById("loadingMessage");
    const errorMessage = document.getElementById("errorMessage");

    // Mostrar mensaje de carga y ocultar errores anteriores
    if (loadingMessage) loadingMessage.classList.remove('hidden');
    if (errorMessage) errorMessage.classList.add('hidden');
    contenido.innerHTML = ''; // Limpiar contenido anterior

    fetch('https://randomuser.me/api')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(res => {
            if (loadingMessage) loadingMessage.classList.add('hidden'); // Ocultar carga
            console.log(res);

            const user = res.results[0]; // Asumiendo que siempre hay al menos un resultado

            contenido.innerHTML = `
                <img src="${user.picture.large}" alt="Foto de ${user.name.first} ${user.name.last}" width="150px" class="img-fluid rounded-circle">
                <p><strong>Nombre:</strong> ${user.name.first} ${user.name.last}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>País:</strong> ${user.location.country}</p>
            `;
        })
        .catch(error => {
            if (loadingMessage) loadingMessage.classList.add('hidden'); // Ocultar carga
            console.error('Error al obtener los datos:', error);
            if (errorMessage) {
                errorMessage.textContent = `Error al cargar la reseña: ${error.message}. Inténtalo de nuevo.`;
                errorMessage.classList.remove('hidden');
            } else {
                showCustomAlert(`Error al cargar la reseña: ${error.message}.`);
            }
        });
}

// Cargar una reseña al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    traer();
});
