function inicioSesion() {
    // Lista de usuarios y contraseñas
    const usuarios = [
        { usuario: "maxibergese", contrasenia: "maximo123" },
        { usuario: "jose2024", contrasenia: "churruca2024" },
        { usuario: "natalia2025", contrasenia: "soderia2025" }
    ];

    // Obtener los valores ingresados por el usuario
    const usuario = document.getElementById("usuario").value;
    const contrasenia = document.getElementById("contrasenia").value;

    // Comprobar si el usuario y la contraseña coinciden con alguno de los usuarios en la lista
    const usuarioValido = usuarios.some(user => user.usuario === usuario && user.contrasenia === contrasenia);

    if (usuarioValido) {
        // Mostrar un mensaje de éxito y redirigir al panel de control
        Swal.fire({
            icon: "success",
            title: "Bienvenido a MBSodaSoft",
            text: "Inicio de sesión exitoso",
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = "../html/index-panel.html";
        });
    } else {
        // Mostrar un mensaje de error si no coincide ningún usuario
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Usuario o contraseña incorrectos. Inténtalo de nuevo.",
            confirmButtonText: "Aceptar"
        });
    }
}
