document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const botonesComprar = document.querySelectorAll('.comprar');
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarritoSpan = document.getElementById('total-carrito');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const btnPagar = document.getElementById('btnPagar');

    // Inicializar el carrito desde sessionStorage o como un array vacío
    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

    /**
     * Guarda el estado actual del carrito en sessionStorage y actualiza la interfaz de usuario.
     */
    const guardarCarrito = () => {
        sessionStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarDisplayCarrito(); // Vuelve a renderizar el carrito para reflejar los cambios
    };

    /**
     * Calcula el total de los productos en el carrito y actualiza el display.
     */
    const calcularTotal = () => {
        const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        totalCarritoSpan.textContent = total.toFixed(2); // Formatear a 2 decimales para la visualización
        sessionStorage.setItem('total', total.toFixed(2)); // Guardar el total para la página de compra
    };

    /**
     * Renderiza la lista de productos en el carrito en el HTML.
     */
    const actualizarDisplayCarrito = () => {
        listaCarrito.innerHTML = ''; // Limpiar la lista actual del carrito

        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p>El carrito está vacío.</p>'; // Mostrar mensaje si está vacío
        } else {
            carrito.forEach(item => {
                const li = document.createElement('li');
                li.setAttribute('data-id', item.id); // Asignar el ID del producto al elemento de lista

                // Estructura HTML para cada ítem del carrito, incluyendo controles de cantidad
                li.innerHTML = `
                    <span>${item.nombre}: $${item.precio.toFixed(2)}</span>
                    <div class="cantidad-control">
                        <button class="disminuir-cantidad" data-id="${item.id}">-</button>
                        <span class="cantidad-producto">${item.cantidad}</span>
                        <button class="aumentar-cantidad" data-id="${item.id}">+</button>
                    </div>
                    <button class="eliminar-producto" data-id="${item.id}">X</button>
                `;
                listaCarrito.appendChild(li); // Añadir el ítem a la lista del carrito
            });
        }
        calcularTotal(); // Recalcular el total cada vez que se actualiza el display
    };

    // --- Event Listeners ---

    /**
     * Maneja el clic en los botones "Comprar" de los productos.
     * Añade el producto al carrito o aumenta su cantidad si ya existe.
     */
    botonesComprar.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const nombre = e.target.dataset.nombre;
            const precio = parseFloat(e.target.dataset.precio); // Convertir el precio a número

            const productoExistente = carrito.find(item => item.id === id);

            if (productoExistente) {
                productoExistente.cantidad++; // Si el producto ya está en el carrito, aumenta su cantidad
            } else {
                carrito.push({ id, nombre, precio, cantidad: 1 }); // Si es un producto nuevo, lo añade con cantidad 1
            }
            guardarCarrito(); // Guarda el carrito y actualiza la UI
        });
    });

    /**
     * Maneja los clics dentro de la lista del carrito (delegación de eventos).
     * Detecta si se hizo clic en un botón de aumentar, disminuir o eliminar.
     */
    listaCarrito.addEventListener('click', (e) => {
        const target = e.target; // El elemento específico en el que se hizo clic
        const id = target.dataset.id; // Obtener el ID del producto asociado al botón

        if (target.classList.contains('aumentar-cantidad')) {
            const item = carrito.find(p => p.id === id);
            if (item) {
                item.cantidad++; // Aumenta la cantidad del producto
            }
        } else if (target.classList.contains('disminuir-cantidad')) {
            const item = carrito.find(p => p.id === id);
            if (item && item.cantidad > 1) {
                item.cantidad--; // Disminuye la cantidad si es mayor que 1
            } else if (item && item.cantidad === 1) {
                // Si la cantidad es 1 y se presiona disminuir, elimina el producto del carrito
                carrito = carrito.filter(p => p.id !== id);
            }
        } else if (target.classList.contains('eliminar-producto')) {
            // Elimina completamente el producto del carrito
            carrito = carrito.filter(p => p.id !== id);
        }
        guardarCarrito(); // Guarda el carrito y actualiza la UI después de cualquier cambio
    });

    /**
     * Maneja el clic en el botón "Vaciar Carrito".
     * Elimina todos los productos del carrito.
     */
    vaciarCarritoBtn.addEventListener('click', () => {
        carrito = []; // Vacía completamente el array del carrito
        guardarCarrito(); // Guarda el carrito vacío y actualiza la UI
    });

    /**
     * Maneja el clic en el botón "Pagar".
     * Redirige a la página de compra si el carrito no está vacío.
     */
    btnPagar.addEventListener('click', () => {
        if (carrito.length > 0) {
            // El carrito ya se guarda automáticamente con guardarCarrito(),
            // pero nos aseguramos de que los 'productos' para compra.js estén bien
            sessionStorage.setItem('productos', JSON.stringify(carrito)); 
            window.location.href = './compra.html'; // Redirige a la página de resumen de compra
        } else {
            alert('El carrito está vacío. Agrega productos antes de pagar.'); // Usa un modal personalizado en lugar de alert en producción
        }
    });

    // --- Inicialización ---
    // Cargar y mostrar el carrito al cargar la página por primera vez
    actualizarDisplayCarrito();
});