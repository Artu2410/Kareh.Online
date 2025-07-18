function traer() {
    const contenido = document.getElementById('contenido'); // Obtener el elemento donde se mostrará el contenido

    fetch('https://randomuser.me/api') // URL de la API para obtener un usuario aleatorio
        .then(res => res.json()) // Convertir la respuesta a JSON
        .then(res => {
            console.log(res); // Mostrar la respuesta completa en la consola
            console.log(res.results[0].email); // Mostrar el email del usuario en la consola

            // Crear el contenido dinámicamente
            contenido.innerHTML = `
                <img src="${res.results[0].picture.large}" width="150px" class="img-fluid rounded-circle">
                <p>Nombre:${res.results[0].name.first}</p>
                <p>Email:${res.results[0].email}</p>
                <p>País:${res.results[0].location.country}</p>
            `;
        })
        .catch(error => console.error('Error al obtener los datos:', error)); // Manejo de errores
}