"use strict";

/*
========================================
DATOS TEMPORALES DEL CLIENTE
Estos datos se guardan en memoria mientras
el usuario permanece dentro de la página.
========================================
*/

const datosCliente = {
    nombre: "",
    correo: "",
    telefono: "",
    tipoTramite: "",
    creditoAnterior: "",
    curp: "",
    nss: ""
};

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formLead");

    if (!formulario) {
        return;
    }

    const telefono = document.getElementById("telefono");
    const nss = document.getElementById("nss");
    const curp = document.getElementById("curp");

    /*
    Permitir únicamente números en teléfono y NSS
    */

    telefono.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").slice(0, 10);
    });

    if (nss) {
        nss.addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "").slice(0, 11);
        });
    }

    /*
    Convertir la CURP a mayúsculas
    */

    if (curp) {
        curp.addEventListener("input", function () {
            this.value = this.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 18);
        });
    }

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        limpiarErrores();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefonoValor = telefono.value.trim();
        const tipoTramite = document.getElementById("tipoTramite").value;
        const creditoAnterior =
            document.getElementById("creditoAnterior").value;

        const curpValor = curp ? curp.value.trim() : "";
        const nssValor = nss ? nss.value.trim() : "";
        const privacidad = document.getElementById("privacidad").checked;

        let formularioValido = true;

        if (nombre.length < 5) {
            mostrarError(
                "nombre",
                "errorNombre",
                "Escribe tu nombre completo."
            );

            formularioValido = false;
        }

        if (correo && !validarCorreo(correo)) {
            mostrarError(
                "correo",
                "errorCorreo",
                "Escribe un correo electrónico válido."
            );

            formularioValido = false;
        }

        if (!/^\d{10}$/.test(telefonoValor)) {
            mostrarError(
                "telefono",
                "errorTelefono",
                "El teléfono debe contener 10 dígitos."
            );

            formularioValido = false;
        }

        if (!tipoTramite) {
            mostrarError(
                "tipoTramite",
                "errorTramite",
                "Selecciona el tipo de trámite."
            );

            formularioValido = false;
        }

        if (!creditoAnterior) {
            mostrarError(
                "creditoAnterior",
                "errorCreditoAnterior",
                "Selecciona una opción."
            );

            formularioValido = false;
        }

        if (!privacidad) {
            document.getElementById("errorPrivacidad").textContent =
                "Debes aceptar el uso de tus datos para continuar.";

            formularioValido = false;
        }

        if (!formularioValido) {
            return;
        }

        /*
        Guardamos los datos en la variable global
        */

        datosCliente.nombre = nombre;
        datosCliente.correo = correo;
        datosCliente.telefono = telefonoValor;
        datosCliente.tipoTramite = tipoTramite;
        datosCliente.creditoAnterior = creditoAnterior;
        datosCliente.curp = curpValor;
        datosCliente.nss = nssValor;

        /*
        Guardado temporal en el navegador.
        Después puede sustituirse por Google Sheets,
        CRM, base de datos o servidor.
        */

        sessionStorage.setItem(
            "datosClienteCredito",
            JSON.stringify(datosCliente)
        );

        mostrarSimulador(nombre);
    });

});


function validarCorreo(correo) {

    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return expresion.test(correo);

}


function mostrarError(campoId, errorId, mensaje) {

    const campo = document.getElementById(campoId);
    const error = document.getElementById(errorId);

    campo.classList.add("campo-error");
    error.textContent = mensaje;

}


function limpiarErrores() {

    document
        .querySelectorAll(".campo-error")
        .forEach(function (campo) {
            campo.classList.remove("campo-error");
        });

    document
        .querySelectorAll(".mensaje-error")
        .forEach(function (mensaje) {
            mensaje.textContent = "";
        });

}


function mostrarSimulador(nombre) {

    const contenedorFormulario =
        document.getElementById("contenedorFormulario");

    const contenedorSimulador =
        document.getElementById("contenedorSimulador");

    const saludo =
        document.getElementById("saludoSimulador");

    contenedorFormulario.classList.add("oculto");
    contenedorSimulador.classList.remove("oculto");

    saludo.textContent =
        "Gracias, " + obtenerPrimerNombre(nombre) +
        ". Realiza tu simulación";

    contenedorSimulador.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


function obtenerPrimerNombre(nombreCompleto) {

    return nombreCompleto
        .trim()
        .split(/\s+/)[0];

}