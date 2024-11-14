
document.addEventListener("DOMContentLoaded", function () {
    cargarClientes(); // Cargar los clientes cuando la página cargue

    const clienteForm = document.querySelector("#clienteForm");
    const guardarBtn = document.querySelector("#guardarBtn");
    const modificarBtn = document.querySelector("#modificarBtn");

    clienteForm.addEventListener("submit", function (event) {
        event.preventDefault();
        agregarCliente(); // Guardar nuevo cliente
    });

    // Botón de modificar cliente
    modificarBtn.addEventListener("click", function () {
        const idCliente = clienteForm.dataset.idCliente;
        if (idCliente) {
            actualizarCliente(idCliente);
        }
    });
});

// Función para cargar clientes y mostrarlos en la tabla
function cargarClientes() {
    fetch('http://localhost:6500/api/clientes')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#table_usuario");
            tableBody.innerHTML = '';
            data.forEach(cliente => {
                const row = document.createElement("tr");
                
                // Verifica si el cliente está en estado "Baja" para aplicar un estilo específico
                const rowClass = cliente.estado === 'Baja' ? 'estado-baja' : '';

                // Desactivar los botones de "Consultar" y "Modificar" si el estado es "Baja"
                const consultarDisabled = cliente.estado === 'Baja' ? 'disabled' : '';
                const modificarDisabled = cliente.estado === 'Baja' ? 'disabled' : '';
                
                row.innerHTML = `
                    <td>${cliente.idCliente}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.dni}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.direccion}</td>
                    <td>${cliente.zona}</td>
                    <td>${cliente.estado}</td>
                    <td>${cliente.localidad}</td>
                    <td>
                        <button onclick="consultarCliente(${cliente.idCliente})" ${consultarDisabled}>Consultar</button>
                        <button onclick="prepararModificacion(${cliente.idCliente})" ${modificarDisabled}>Modificar</button>
                        <button onclick="cambiarEstadoCliente(${cliente.idCliente}, '${cliente.estado}')">
                            ${cliente.estado === 'Alta' ? 'Baja' : 'Alta'}
                        </button>
                    </td>
                `;

                // Aplica la clase de "estado-baja" si el cliente está dado de baja
                if (rowClass) {
                    row.classList.add(rowClass);
                }

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error al cargar los clientes:", error);
        });
}


// Función para consultar datos de un cliente (solo lectura)
function consultarCliente(idCliente) {
    fetch(`http://localhost:6500/api/clientes/${idCliente}`)
        .then(response => response.json())
        .then(data => {
            llenarFormulario(data);
            deshabilitarFormulario(true); // Pone al form en modo solo lectura
            mostrarBotones(false); // Ocultar botón de modificar cliente
        })
        .catch(error => {
            console.error("Error al consultar el cliente:", error);
        });
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
}

// Función para preparar el formulario para modificar un cliente
function prepararModificacion(idCliente) {
    fetch(`http://localhost:6500/api/clientes/${idCliente}`)
        .then(response => response.json())
        .then(data => {
            llenarFormulario(data); //Función para llenar el formulario
            deshabilitarFormulario(false); // Habilitar campos para edición
            document.querySelector("#clienteForm").dataset.idCliente = idCliente;
            mostrarBotones(true); // Permite mostrar el botón de modificar
        })
        .catch(error => {
            console.error("Error al preparar la modificación del cliente:", error);
        });
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
}

// Función para llenar el formulario con los datos del cliente
function llenarFormulario(cliente) {
    document.querySelector("#nombre").value = cliente.nombre;
    document.querySelector("#dni").value = cliente.dni;
    document.querySelector("#telefono").value = cliente.telefono;
    document.querySelector("#direccion").value = cliente.direccion;
    document.querySelector("#zona").value = cliente.zona; 
    document.querySelector("#localidad").value = cliente.localidad;
}

// Función para deshabilitar el formulario
function deshabilitarFormulario(desactivar) {
    document.querySelector("#nombre").disabled = desactivar;
    document.querySelector("#dni").disabled = desactivar;
    document.querySelector("#telefono").disabled = desactivar;
    document.querySelector("#direccion").disabled = desactivar;
    document.querySelector("#zona").disabled = desactivar;
    document.querySelector("#localidad").disabled = desactivar;
}

// Función para mostrar u ocultar los botones de acción
function mostrarBotones(modoModificacion) {
    if (modoModificacion) {
        document.querySelector("#guardarBtn").style.display = "none";
        document.querySelector("#modificarBtn").style.display = "inline-block";
    } else {
        document.querySelector("#guardarBtn").style.display = "inline-block";
        document.querySelector("#modificarBtn").style.display = "none";
    }
}

// Función para agregar un cliente nuevo
function agregarCliente() {
    const data = {
        nombre: document.querySelector("#nombre").value,
        dni: document.querySelector("#dni").value,
        telefono: document.querySelector("#telefono").value,
        direccion: document.querySelector("#direccion").value,
        zona: document.querySelector("#zona").value, // Obtiene el valor seleccionado
        localidad: document.querySelector("#localidad").value
    };
    fetch('http://localhost:6500/api/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        Swal.fire({ //Alerta de que la carga fue exitosa (SweetAlert)
            title: 'Cliente agregado con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: "#213442"});
        cargarClientes(); // Recargar la lista de clientes
        limpiarFormulario(); //Limpia el formulario para poder cargar más clientes
    })
    .catch(error => {
        console.error("Error al agregar el cliente:", error);
    });
}

// Función para actualizar un cliente
function actualizarCliente(idCliente) {
    const data = {
        nombre: document.querySelector("#nombre").value,
        dni: document.querySelector("#dni").value,
        telefono: document.querySelector("#telefono").value,
        direccion: document.querySelector("#direccion").value,
        zona: document.querySelector("#zona").value, // Obtiene el valor seleccionado
        localidad: document.querySelector("#localidad").value
    };
    fetch(`http://localhost:6500/api/clientes/${idCliente}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) { //Alerta de confirmación
            Swal.fire({
                title: 'Cliente actualizado con éxito.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: "#213442"
            });
            cargarClientes(); // Recargar la lista de clientes
            limpiarFormulario(); //Limpiar el formulario
            mostrarBotones(false); //Oculta el botón de modificar
        } else {
            Swal.fire({ //Alerta de error
                title: 'Error',
                text: 'Error al actualizar el cliente.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: "#213442"
            });
        }
    })
    .catch(error => {
        console.error("Error al actualizar el cliente:", error);
    });
}

function cambiarEstadoCliente(idCliente, estado) {
    const nuevoEstado = estado === 'Alta' ? 'Baja' : 'Alta'; // Cambiar el estado

    // Mostrar una solicitud de confirmación antes de proceder
    Swal.fire({
        title: `¿Estás seguro que quieres dar de ${nuevoEstado} el cliente?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, procede con la acción
            fetch(`http://localhost:6500/api/clientes/${idCliente}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ estado: nuevoEstado })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cambiar el estado del cliente');
                }
                return response.json();
            })
            .then(data => {
                if (data.respuesta) {
                    Swal.fire(
                        '¡Éxito!',
                        `El cliente ha sido dado de ${nuevoEstado}.`,
                        'success'
                    );
                    cargarClientes(); // Recargar la lista de clientes
                } else {
                    Swal.fire(
                        'Error',
                        'No se pudo actualizar el estado del cliente.',
                        'error'
                    );
                }
            })
            .catch(error => {
                console.error("Error al cambiar el estado del cliente:", error);
                Swal.fire(
                    'Error',
                    'Hubo un problema al cambiar el estado del cliente.',
                    'error'
                );
            });
        }
    });
}

// Función para limpiar el formulario y restablecer el estado
function limpiarFormulario() {
    document.querySelector("#nombre").value = '';
    document.querySelector("#dni").value = '';
    document.querySelector("#telefono").value = '';
    document.querySelector("#direccion").value = '';
    document.querySelector("#zona").value = '';
    document.querySelector("#localidad").value = '';
    document.querySelector("#clienteForm").dataset.idCliente = ''; // Limpiar ID del formulario
    mostrarBotones(false); // Mostrar botón para guardar un nuevo cliente
}

document.addEventListener("DOMContentLoaded", function () {
    cargarClientes(); // Cargar los clientes cuando la página cargue

    const searchInput = document.querySelector("#searchInput");
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        buscarClientes(query);
    });
});

// Función para buscar clientes por nombre y estado
function buscarClientes(query) {
    const rows = document.querySelectorAll("#table_usuario tr");
    const searchQuery = query.toLowerCase();

    rows.forEach(row => {
        const nombre = row.cells[1].textContent.toLowerCase(); 
        const estado = row.cells[6].textContent.toLowerCase(); 

        
        if (nombre.includes(searchQuery) || estado.includes(searchQuery)) {
            row.style.display = ""; // Mostrar la fila
        } else {
            row.style.display = "none"; // Ocultar la fila
        }
    });
}

// Función para actualizar la visualización de una fila al cambiar el estado
function actualizarEstadoFila(idCliente, nuevoEstado) {
    const fila = document.querySelector(`#fila-cliente-${idCliente}`);
    if (fila) {
        // Cambiar estilo de la fila
        if (nuevoEstado === 'Baja') {
            fila.classList.add('fila-desactivada'); // Clase para aspecto desactivado
            fila.querySelector('.btn-baja').textContent = 'Alta';
            fila.querySelector('.btn-baja').classList.replace('btn-danger', 'btn-success');
            // Ocultar botones de modificar y consultar
            fila.querySelector('.btn-modificar').style.display = 'none';
            fila.querySelector('.btn-consultar').style.display = 'none';
        } else {
            fila.classList.remove('fila-desactivada'); // Quitar clase desactivada
            fila.querySelector('.btn-baja').textContent = 'Baja';
            fila.querySelector('.btn-baja').classList.replace('btn-success', 'btn-danger');
            // Mostrar botones de modificar y consultar
            fila.querySelector('.btn-modificar').style.display = 'inline-block';
            fila.querySelector('.btn-consultar').style.display = 'inline-block';
        }
    }
}

