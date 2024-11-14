const pedidoForm = document.getElementById('pedidoForm');
const pedidoList = document.getElementById('pedidoList');

document.addEventListener("DOMContentLoaded", function () {
    cargarClientes(); // Cargar clientes en el select
    cargarProductos(); // Cargar productos en el select
    cargarPedidos();
    // Evento para enviar el formulario
    pedidoForm.addEventListener("submit", function (event) {
        event.preventDefault();
        crearPedido();
    });
});

// Función para cargar los clientes en el select
function cargarClientes() {
    fetch('http://localhost:6500/api/clientes')
        .then(response => response.json())
        .then(clientes => {
            const clienteSelect = document.getElementById("Cliente");
            clienteSelect.innerHTML = "";
            clientes.forEach(cliente => {
                const option = document.createElement("option");
                option.value = cliente.idCliente; // Usar ID como valor
                option.textContent = `${cliente.idCliente} - ${cliente.nombre}`; // Mostrar ID y nombre
                clienteSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar clientes:", error));
}

// Función para cargar y mostrar los pedidos en la tabla
async function cargarPedidos() {
    try {
        const pedidosResponse = await fetch('http://localhost:6500/api/pedidos');
        const pedidos = await pedidosResponse.json();

        const clientesResponse = await fetch('http://localhost:6500/api/clientes');
        const clientes = await clientesResponse.json();

        // Crear un objeto que mapea idCliente a nombre del cliente
        const clientesMap = clientes.reduce((acc, cliente) => {
            acc[cliente.idCliente] = cliente.nombre;
            return acc;
        }, {});

        // Selecciona el cuerpo de la tabla
        const tablaPedidos = document.getElementById('table_pedidos');
        tablaPedidos.innerHTML = '';

        pedidos.forEach(pedido => {
            const fila = document.createElement('tr');
            const nombreCliente = clientesMap[pedido.idCliente] || 'Cliente no encontrado'; // Usar el nombre del cliente

            fila.innerHTML = `
                <td>| ${pedido.idPedido}</td>
                <td>| ${pedido.fecha}</td>
                <td>| $${pedido.precioFinal.toFixed(2)}</td>
                <td>| ${nombreCliente}</td> <!-- Mostrar nombre del cliente -->
            `;
            tablaPedidos.appendChild(fila); // Agregar fila a la tabla
        });
    } catch (error) {
        console.error("Error al cargar pedidos:", error);
    }
}


// Lista para acumular productos
let pedido = [];
// Función para agregar un producto a la lista de pedidos
function agregarProducto(id, nombre, precioUnitario, cantidad) {
    console.log("hola", id)
    pedido.push({
        id: id,
        nombre: nombre,
        precioUnitario: precioUnitario,
        cantidad: cantidad
    });
    mostrarPedido();
}

function mostrarPedido() {
    const pedidoContainer = document.getElementById('pedidoContainer');
    pedidoContainer.innerHTML = ''; // Limpia el contenido previo
    let total = 0;
    pedido.forEach(item => {
        const itemTotal = item.precioUnitario * item.cantidad;
        total += itemTotal;
        // Crea un elemento para mostrar el producto
        const productoElemento = document.createElement('div');
        productoElemento.textContent = `${item.nombre} - Cantidad: ${item.cantidad} - Precio Unitario: $${item.precioUnitario.toFixed(2)} - Total: $${itemTotal.toFixed(2)}`;
        pedidoContainer.appendChild(productoElemento);
    });

    // Muestra el total del pedido
    const totalElemento = document.createElement('div');
    totalElemento.textContent = `Total del Pedido: $${total.toFixed(2)}`;
    pedidoContainer.appendChild(totalElemento);
}

// Función para crear el pedido
function crearPedido() {
    const idCliente = document.getElementById("Cliente").value;
    const fecha = document.getElementById("fecha").value;
    // Validar campos requeridos
    if (!idCliente || !fecha) {
        alert("Por favor, complete todos los campos correctamente.");
        return;
    }
    // Calcular el precio final sumando el total de todos los productos
    const precioFinal = pedido.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
    // Crear el pedido
    fetch('http://localhost:6500/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idCliente: idCliente, fecha: fecha, precioFinal: precioFinal })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al crear el pedido: ' + response.status);
            }
            return response.json();
        })
        .then(pedidoCreado => {
            console.log("hola", pedido);
            const idPedido = pedidoCreado.idPedido; // Obtener ID del pedido creado
            // Crear el producto asociado al pedido en productoPedido
            const productosPromises = pedido.map(item => {
                return fetch('http://localhost:6500/api/productopedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        idPedido: idPedido,
                        idProducto: item.id,
                        cantidad: item.cantidad,
                        precioUnitario: item.precioUnitario
                    })
                });
            });
            return Promise.all(productosPromises);
        })
        .then(() => {
            alert("Pedido creado con éxito.");
            cargarPedidos();
            pedido = [];
            mostrarPedido();
            pedidoForm.reset();
        })
        .catch(error => console.error("Error al crear el pedido o productos:", error));
}

// Función para cargar productos en el select
async function cargarProductos() {
    try {
        const response = await fetch('http://localhost:6500/api/productos');
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        const productos = await response.json();
        // Obtener el select
        const productoSelect = document.getElementById('productoSelect');
        console.log("hola", productos)
        // Llenar el select con los productos
        productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.idProducto;
            option.textContent = producto.nombre;
            productoSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Evento para agregar productos al pedido
document.getElementById('agregarProductoBtn').addEventListener('click', (event) => {
    event.preventDefault();
    const productoSelect = document.getElementById('productoSelect');
    const cantidadInput = document.getElementById('cantidadInput');
    const precioInput = document.getElementById('precioInput');

    const productoId = productoSelect.value;
    const productoNombre = productoSelect.options[productoSelect.selectedIndex].text;
    const precioUnitario = parseFloat(precioInput.value) || 0;
    const cantidad = parseInt(cantidadInput.value, 10) || 1; // Si no se introduce cantidad, usa por defecto la cant 1

    if (productoId && precioUnitario > 0) {
        agregarProducto(productoId, productoNombre, precioUnitario, cantidad);

        cantidadInput.value = 1;
        precioInput.value = '';
        productoSelect.value = '';
    } else {
        alert('Por favor, selecciona un producto y asegúrate de que el precio sea válido.');
    }
});


// Función para cargar pedidos y mostrarlos en la tabla
function cargarPedidos() {
    fetch('http://localhost:6500/api/pedidos')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#table_pedidos");
            tableBody.innerHTML = '';
            data.forEach(pedido => {
                const fecha = new Date(pedido.fecha);
                // Formatear la fecha como DD-MM-YYYY
                const dia = fecha.getDate().toString().padStart(2, '0'); // Asegura dos dígitos
                const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Mes comienza en 0
                const anio = fecha.getFullYear();
                const fechaFormateada = `${dia}-${mes}-${anio}`;

                const row = document.createElement("tr");
                row.innerHTML = `
                                <td>${pedido.idPedido}</td>
                                <td>${fechaFormateada}</td>
                                <td>$${pedido.precioFinal}</td>
                                <td>${pedido.idCliente}</td>
                                <td>${pedido.estado}</td>
                                <td>
                                    <button onclick="">Modificar</button>
                                    <button onclick="">
                                        ${pedido.estado === 'Alta' ? 'Baja' : 'Alta'}
                                    </button>
                                </td>
                            `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error al cargar los pedidos:", error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    cargarPedidos();
});

// Función para cambiar el estado de un pedido
function cambiarEstadoPedido(idPedido, estado) {
    const nuevoEstado = estado === 'Alta' ? 'Baja' : 'Alta'; // Cambiar el estado
    Swal.fire({
        title: `¿Estás seguro de cambiar el estado del pedido a ${nuevoEstado}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:6500/api/pedidos/${idPedido}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: nuevoEstado })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al cambiar el estado del pedido');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.respuesta) {
                        Swal.fire(
                            '¡Éxito!',
                            `El pedido ha sido actualizado a estado ${nuevoEstado}.`,
                            'success'
                        );
                        cargarPedidos(); // Recargar la lista de pedidos
                    } else {
                        Swal.fire(
                            'Error',
                            'No se pudo actualizar el estado del pedido.',
                            'error'
                        );
                    }
                })
                .catch(error => {
                    console.error("Error al cambiar el estado del pedido:", error);
                    Swal.fire(
                        'Error',
                        'Hubo un problema al cambiar el estado del pedido.',
                        'error'
                    );
                });
        }
    });
}


