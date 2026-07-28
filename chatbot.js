"use strict";

/*
==================================================
CHATBOT AVANZADO SIN API EXTERNA

Responde mediante detección de palabras clave.
Más adelante la función obtenerRespuestaChatbot()
podrá conectarse a una API de inteligencia artificial.
==================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    const abrirBoton =
        document.getElementById("abrirChatbot");

    const invitacion =
        document.getElementById("chatbotInvitacion");

    const cerrarBoton =
        document.getElementById("cerrarChatbot");

    const ventana =
        document.getElementById("chatbotVentana");

    const mensajes =
        document.getElementById("chatbotMensajes");

    const escribiendo =
        document.getElementById("chatbotEscribiendo");

    const formulario =
        document.getElementById("chatbotFormulario");

    const campoPregunta =
        document.getElementById("chatbotPregunta");

    const botonesRapidos =
        document.querySelectorAll(
            ".chatbot-opciones button"
        );

    const botonWhatsapp =
        document.getElementById("chatbotWhatsapp");

    const notificacion =
        document.getElementById("chatbotNotificacion");


    /*
    Verificamos que exista el chatbot.
    */

    if (
        !abrirBoton ||
        !cerrarBoton ||
        !ventana ||
        !mensajes ||
        !formulario ||
        !campoPregunta
    ) {
        return;
    }


    /*
    Historial de preguntas del visitante.
    Se utilizará para crear el mensaje de WhatsApp.
    */

    const historialChat = [];


    /*
    ABRIR Y CERRAR CHAT
    */

    abrirBoton.addEventListener("click", function () {

        alternarChatbot();

    });

    if (invitacion) {

        invitacion.addEventListener("click", function () {

            abrirChatbot();

        });

    }

    cerrarBoton.addEventListener("click", function () {

        cerrarChatbot();

    });


    /*
    BOTONES RÁPIDOS
    */

    botonesRapidos.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const pregunta =
                boton.dataset.pregunta || "";

            if (!pregunta) {
                return;
            }

            procesarPregunta(pregunta);

        });

    });


    /*
    FORMULARIO PARA PREGUNTAS ABIERTAS
    */

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const pregunta =
            campoPregunta.value.trim();

        if (!pregunta) {
            return;
        }

        procesarPregunta(pregunta);

        campoPregunta.value = "";
        ajustarAlturaCampo();

    });


    /*
    ENTER ENVÍA.
    SHIFT + ENTER CREA SALTO DE LÍNEA.
    */

    campoPregunta.addEventListener("keydown", function (evento) {

        if (
            evento.key === "Enter" &&
            !evento.shiftKey
        ) {

            evento.preventDefault();

            formulario.requestSubmit();

        }

    });


    /*
    AJUSTAR ALTURA DEL TEXTAREA
    */

    campoPregunta.addEventListener("input", function () {

        ajustarAlturaCampo();

    });


    /*
    FUNCIONES DE VENTANA
    */

    function alternarChatbot() {

        if (ventana.classList.contains("oculto")) {

            abrirChatbot();

        } else {

            cerrarChatbot();

        }

    }


    function abrirChatbot() {

        ventana.classList.remove("oculto");

        abrirBoton.setAttribute(
            "aria-expanded",
            "true"
        );

        if (invitacion) {
            invitacion.classList.add("oculto");
        }

        if (notificacion) {
            notificacion.classList.add("oculto");
        }

        setTimeout(function () {

            campoPregunta.focus();

        }, 150);

    }


    function cerrarChatbot() {

        ventana.classList.add("oculto");

        abrirBoton.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    /*
    PROCESAR PREGUNTA
    */

    function procesarPregunta(pregunta) {

        agregarMensajeUsuario(pregunta);

        historialChat.push(pregunta);

        actualizarWhatsapp();

        mostrarEscribiendo();

        const respuesta =
            obtenerRespuestaChatbot(pregunta);

        const tiempoRespuesta =
            calcularTiempoRespuesta(respuesta);

        setTimeout(function () {

            ocultarEscribiendo();

            agregarMensajeBot(respuesta);

            actualizarWhatsapp();

        }, tiempoRespuesta);

    }


    /*
    MOTOR DE RESPUESTAS
    */

    function obtenerRespuestaChatbot(preguntaOriginal) {

        const pregunta =
            normalizarTexto(preguntaOriginal);


        /*
        SALUDOS
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "hola",
                    "buen dia",
                    "buenas tardes",
                    "buenas noches",
                    "que tal",
                    "hey"
                ]
            )
        ) {

            return (
                "¡Hola! 😊 Con gusto te ayudo. " +
                "Puedes preguntarme sobre requisitos, documentos, " +
                "renovación, tiempos, simulación o seguridad del trámite."
            );

        }


        /*
        INTENCIÓN DE HABLAR CON ASESOR
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "asesor",
                    "daniel",
                    "whatsapp",
                    "hablar con alguien",
                    "hablar con una persona",
                    "me interesa",
                    "quiero solicitar",
                    "quiero tramitar",
                    "quiero contratar",
                    "llamar",
                    "contacto"
                ]
            )
        ) {

            return (
                "Claro 😊 Daniel puede revisar personalmente tu caso. " +
                "Pulsa el botón verde de WhatsApp que aparece abajo " +
                "y se enviará un mensaje con el resumen de tus preguntas."
            );

        }


        /*
        REQUISITOS
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "requisito",
                    "requisitos",
                    "que necesito",
                    "que se necesita",
                    "puedo solicitar",
                    "puedo pedir",
                    "califico",
                    "soy candidato"
                ]
            )
        ) {

            return (
                "Los requisitos generales son:\n\n" +
                "• Ser pensionado del IMSS bajo Ley 73.\n" +
                "• Tener la pensión activa.\n" +
                "• Contar con identificación oficial vigente.\n" +
                "• Tener una cuenta bancaria.\n" +
                "• Proporcionar datos personales básicos.\n\n" +
                "La financiera puede solicitar documentos adicionales " +
                "después de revisar tu caso."
            );

        }


        /*
        DOCUMENTOS
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "documento",
                    "documentos",
                    "papeles",
                    "ine",
                    "curp",
                    "nss",
                    "estado de cuenta",
                    "comprobante"
                ]
            )
        ) {

            return (
                "Normalmente se puede solicitar:\n\n" +
                "• Identificación oficial vigente.\n" +
                "• CURP.\n" +
                "• Número de Seguridad Social.\n" +
                "• Estado de cuenta bancario.\n" +
                "• Información o comprobante de la pensión.\n\n" +
                "La lista definitiva depende de la financiera y de tu trámite."
            );

        }


        /*
        LEY 73
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "ley 73",
                    "regimen 73",
                    "regimen de 1973",
                    "soy ley 73",
                    "como se si soy ley 73"
                ]
            )
        ) {

            return (
                "Este servicio está enfocado principalmente en pensionados " +
                "del IMSS bajo la Ley 73. Si no sabes bajo qué régimen estás, " +
                "Daniel puede ayudarte a revisar tu información antes de iniciar."
            );

        }


        /*
        RENOVACIÓN
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "renovacion",
                    "renovar",
                    "ya tengo credito",
                    "tengo un credito",
                    "otro credito",
                    "credito activo",
                    "volver a solicitar"
                ]
            )
        ) {

            return (
                "Sí, una renovación puede ser posible si ya tienes un crédito. " +
                "La financiera revisará el saldo actual, los pagos realizados, " +
                "tu pensión y la capacidad disponible. " +
                "Daniel puede revisar tu caso y decirte qué alternativas existen."
            );

        }


        /*
        CRÉDITO NUEVO
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "credito nuevo",
                    "primera vez",
                    "nunca he tenido credito",
                    "primer credito"
                ]
            )
        ) {

            return (
                "El crédito nuevo aplica cuando realizas una solicitud por " +
                "primera vez o cuando no tienes un financiamiento activo. " +
                "Se revisan tu pensión, edad, documentos y las políticas de " +
                "las instituciones financieras disponibles."
            );

        }


        /*
        EDAD
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "edad",
                    "anos",
                    "años",
                    "tengo 60",
                    "tengo 65",
                    "tengo 70",
                    "tengo 75",
                    "tengo 80",
                    "limite de edad",
                    "edad maxima"
                ]
            )
        ) {

            return (
                "La edad puede influir en el plazo y en las opciones disponibles, " +
                "pero no determina por sí sola una aprobación. Cada financiera " +
                "maneja criterios distintos. Lo mejor es revisar tu edad junto " +
                "con tu pensión y el monto que deseas."
            );

        }


        /*
        MONTO Y CAPACIDAD
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "cuanto me prestan",
                    "cuanto puedo pedir",
                    "cuanto alcanzó",
                    "cuanto alcanzo",
                    "monto maximo",
                    "capacidad",
                    "30%",
                    "30 por ciento",
                    "descuento mensual"
                ]
            )
        ) {

            return (
                "La simulación inicial toma hasta el 30% de la pensión mensual " +
                "como capacidad máxima de descuento. Con esa cantidad, el plazo " +
                "y la tasa configurada se calcula un monto estimado. " +
                "El resultado no representa una aprobación definitiva."
            );

        }


        /*
        SIMULADOR
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "simulacion",
                    "simulador",
                    "calcular",
                    "calculo",
                    "resultado",
                    "mensualidad",
                    "pago mensual"
                ]
            )
        ) {

            return (
                "Para realizar una simulación, primero completa el formulario " +
                "del sitio y después ingresa:\n\n" +
                "• Monto que necesitas.\n" +
                "• Edad.\n" +
                "• Plazo deseado.\n" +
                "• Pensión mensual.\n\n" +
                "El sistema mostrará tu capacidad máxima estimada y el escenario " +
                "correspondiente al monto solicitado."
            );

        }


        /*
        TASAS E INTERESES
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "tasa",
                    "tasas",
                    "interes",
                    "intereses",
                    "cat",
                    "cuanto cobran",
                    "comision"
                ]
            )
        ) {

            return (
                "La tasa, el CAT, las comisiones y el costo total pueden cambiar " +
                "según la institución financiera, el plazo y el perfil del " +
                "solicitante. La simulación del sitio es informativa. " +
                "Daniel debe confirmar las condiciones vigentes antes de cualquier trámite."
            );

        }


        /*
        TIEMPOS
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "cuanto tarda",
                    "cuanto tiempo",
                    "tiempo del proceso",
                    "cuando depositan",
                    "deposito",
                    "rapido",
                    "dias tarda"
                ]
            )
        ) {

            return (
                "El tiempo depende de que la documentación esté completa, " +
                "del análisis y de la financiera seleccionada. " +
                "Después de revisar tu información, Daniel puede darte una " +
                "estimación más precisa sobre tu caso."
            );

        }


        /*
        SEGURIDAD Y FRAUDE
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "seguro",
                    "seguridad",
                    "fraude",
                    "estafa",
                    "confiable",
                    "datos personales",
                    "privacidad",
                    "nip",
                    "contrasena",
                    "contraseña"
                ]
            )
        ) {

            return (
                "Para protegerte, nunca compartas contraseñas, NIP, códigos " +
                "de verificación ni accesos a tu banca. Tus datos deben usarse " +
                "únicamente para revisar y dar seguimiento a tu solicitud. " +
                "Antes de firmar, revisa siempre monto, plazo, tasa y pago total."
            );

        }


        /*
        DESCUENTO DE LA PENSIÓN
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "descuento",
                    "descuentan",
                    "como se paga",
                    "pago de pension",
                    "pago de la pension",
                    "domiciliacion",
                    "domiciliación"
                ]
            )
        ) {

            return (
                "Dependiendo del producto y de la financiera, el pago puede " +
                "gestionarse mediante descuentos programados relacionados con " +
                "la pensión. Antes de aceptar, deben explicarte claramente " +
                "cuánto se descontará, durante cuántos meses y cuánto pagarás en total."
            );

        }


        /*
        SALIR DE CASA
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "salir de casa",
                    "sucursal",
                    "presencial",
                    "en linea",
                    "en línea",
                    "desde casa",
                    "visita"
                ]
            )
        ) {

            return (
                "Gran parte de la orientación y revisión inicial puede hacerse " +
                "a distancia. Si alguna etapa requiere presencia física o firma, " +
                "el asesor te lo informará previamente."
            );

        }


        /*
        BANCOS Y FINANCIERAS
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "banco",
                    "bancos",
                    "financiera",
                    "financieras",
                    "multiva",
                    "inbursa",
                    "bancrea"
                ]
            )
        ) {

            return (
                "Se revisan alternativas con distintas instituciones financieras. " +
                "La opción disponible dependerá de tu perfil y de las condiciones " +
                "vigentes al momento de solicitar el crédito."
            );

        }


        /*
        CANCELAR O PAGAR ANTES
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "cancelar",
                    "liquidar",
                    "pagar antes",
                    "abonar",
                    "adelantar pagos",
                    "pago anticipado"
                ]
            )
        ) {

            return (
                "La posibilidad de liquidar anticipadamente o adelantar pagos " +
                "depende del contrato de la financiera. Antes de aceptar, solicita " +
                "que te expliquen si existen condiciones, comisiones o beneficios " +
                "por pago anticipado."
            );

        }


        /*
        AGRADECIMIENTO
        */

        if (
            contieneAlguna(
                pregunta,
                [
                    "gracias",
                    "muchas gracias",
                    "entendido",
                    "perfecto",
                    "ok",
                    "vale"
                ]
            )
        ) {

            return (
                "Con gusto 😊. Cuando estés listo, puedes realizar la simulación " +
                "o escribirle directamente a Daniel mediante el botón de WhatsApp."
            );

        }


        /*
        RESPUESTA GENERAL
        */

        return (
            "Puedo orientarte sobre créditos para pensionados IMSS, requisitos, " +
            "documentos, renovación, simulación, tasas, tiempos y seguridad. " +
            "Para responder correctamente una situación particular, lo mejor es " +
            "que Daniel revise personalmente tu caso por WhatsApp."
        );

    }


    /*
    AGREGAR MENSAJE DEL USUARIO
    */

    function agregarMensajeUsuario(texto) {

        const contenedor =
            document.createElement("div");

        contenedor.className =
            "mensaje-usuario";

        const contenido =
            document.createElement("div");

        contenido.className =
            "mensaje-contenido";

        contenido.textContent = texto;

        contenedor.appendChild(contenido);

        mensajes.appendChild(contenedor);

        moverChatAlFinal();

    }


    /*
    AGREGAR MENSAJE DEL BOT
    */

    function agregarMensajeBot(texto) {

        const contenedor =
            document.createElement("div");

        contenedor.className =
            "mensaje-bot";

        const avatar =
            document.createElement("div");

        avatar.className =
            "mensaje-avatar";

        avatar.innerHTML =
            '<i class="fa-solid fa-user-tie"></i>';

        const contenido =
            document.createElement("div");

        contenido.className =
            "mensaje-contenido";

        /*
        Separamos saltos de línea en párrafos.
        Usamos textContent para evitar inyección HTML.
        */

        texto
            .split("\n")
            .forEach(function (linea) {

                if (!linea.trim()) {
                    return;
                }

                const parrafo =
                    document.createElement("p");

                parrafo.textContent = linea;

                contenido.appendChild(parrafo);

            });

        contenedor.appendChild(avatar);
        contenedor.appendChild(contenido);

        mensajes.appendChild(contenedor);

        moverChatAlFinal();

    }


    /*
    INDICADOR ESCRIBIENDO
    */

    function mostrarEscribiendo() {

        if (!escribiendo) {
            return;
        }

        escribiendo.classList.remove("oculto");

    }


    function ocultarEscribiendo() {

        if (!escribiendo) {
            return;
        }

        escribiendo.classList.add("oculto");

    }


    /*
    ACTUALIZAR MENSAJE DE WHATSAPP
    */

    function actualizarWhatsapp() {

        if (!botonWhatsapp) {
            return;
        }

        const datosLead =
            obtenerDatosGuardados();

        const nombre =
            datosLead.nombre || "Cliente";

        const preguntas =
            historialChat.length
                ? historialChat
                    .slice(-6)
                    .map(function (pregunta, indice) {

                        return (
                            (indice + 1) +
                            ". " +
                            pregunta
                        );

                    })
                    .join("\n")
                : "No se registraron preguntas.";

        const mensaje = [
            "Hola Daniel, soy " + nombre + ".",
            "",
            "Estuve utilizando el asistente virtual del sitio.",
            "",
            "Mis preguntas fueron:",
            preguntas,
            "",
            "Quiero recibir asesoría personalizada sobre un crédito para pensionados IMSS."
        ].join("\n");

        botonWhatsapp.href =
            "https://wa.me/525518417167?text=" +
            encodeURIComponent(mensaje);

    }


    /*
    OBTENER DATOS DEL FORMULARIO
    */

    function obtenerDatosGuardados() {

        try {

            return JSON.parse(
                sessionStorage.getItem(
                    "datosClienteCredito"
                )
            ) || {};

        } catch (error) {

            return {};

        }

    }


    /*
    FUNCIONES AUXILIARES
    */

    function normalizarTexto(texto) {

        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[¿?¡!.,;:()"']/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    }


    function contieneAlguna(texto, palabras) {

        return palabras.some(function (palabra) {

            return texto.includes(
                normalizarTexto(palabra)
            );

        });

    }


    function calcularTiempoRespuesta(respuesta) {

        const tiempo =
            450 + respuesta.length * 4;

        return Math.min(
            Math.max(tiempo, 650),
            1450
        );

    }


    function moverChatAlFinal() {

        mensajes.scrollTop =
            mensajes.scrollHeight;

    }


    function ajustarAlturaCampo() {

        campoPregunta.style.height =
            "auto";

        campoPregunta.style.height =
            Math.min(
                campoPregunta.scrollHeight,
                110
            ) + "px";

    }


    /*
    Preparamos el primer enlace de WhatsApp.
    */

    actualizarWhatsapp();

});