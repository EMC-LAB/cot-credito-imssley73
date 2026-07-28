"use strict";

/*
========================================
PREGUNTAS FRECUENTES
========================================
*/

document.addEventListener("DOMContentLoaded", function () {

    const preguntas =
        document.querySelectorAll(".faq-pregunta");

    preguntas.forEach(function (pregunta) {

        pregunta.addEventListener("click", function () {

            const item =
                pregunta.closest(".faq-item");

            const respuesta =
                item.querySelector(".faq-respuesta");

            const estabaAbierto =
                item.classList.contains("activo");

            /*
            Cerramos las demás preguntas para mantener
            el acordeón limpio.
            */

            document
                .querySelectorAll(".faq-item")
                .forEach(function (otroItem) {

                    otroItem.classList.remove("activo");

                    const otraRespuesta =
                        otroItem.querySelector(".faq-respuesta");

                    const otroBoton =
                        otroItem.querySelector(".faq-pregunta");

                    otraRespuesta.style.maxHeight = null;

                    otroBoton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                });

            /*
            Abrimos la pregunta seleccionada si estaba cerrada.
            */

            if (!estabaAbierto) {

                item.classList.add("activo");

                respuesta.style.maxHeight =
                    respuesta.scrollHeight + "px";

                pregunta.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        });

    });

});
/*
========================================
FOOTER Y AVISO DE PRIVACIDAD
========================================
*/

document.addEventListener("DOMContentLoaded", function () {

    const anioActual =
        document.getElementById("anioActual");

    const abrirPrivacidad =
        document.getElementById("abrirPrivacidad");

    const cerrarPrivacidad =
        document.getElementById("cerrarPrivacidad");

    const cerrarFondo =
        document.getElementById("cerrarFondoPrivacidad");

    const modal =
        document.getElementById("modalPrivacidad");


    /*
    Año automático
    */

    if (anioActual) {

        anioActual.textContent =
            new Date().getFullYear();

    }


    /*
    Si el modal no existe, terminamos.
    */

    if (
        !abrirPrivacidad ||
        !cerrarPrivacidad ||
        !modal
    ) {
        return;
    }


    /*
    Abrir modal
    */

    abrirPrivacidad.addEventListener("click", function () {

        modal.classList.remove("oculto");

        document.body.style.overflow =
            "hidden";

    });


    /*
    Cerrar con botón
    */

    cerrarPrivacidad.addEventListener("click", function () {

        cerrarModalPrivacidad();

    });


    /*
    Cerrar tocando el fondo
    */

    if (cerrarFondo) {

        cerrarFondo.addEventListener("click", function () {

            cerrarModalPrivacidad();

        });

    }


    /*
    Cerrar con Escape
    */

    document.addEventListener("keydown", function (evento) {

        if (
            evento.key === "Escape" &&
            !modal.classList.contains("oculto")
        ) {

            cerrarModalPrivacidad();

        }

    });


    function cerrarModalPrivacidad() {

        modal.classList.add("oculto");

        document.body.style.overflow =
            "";
            document.body.classList.remove("modal-resultados-abierto");

    }

});
