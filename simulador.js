"use strict";

/*
==================================================
CONFIGURACIÓN DEL CRÉDITO
==================================================
*/

const CONFIGURACION_CREDITO = {

    // Tasa anual utilizada por el cotizador
    tasaAnualConIVA: 0.26564645,

    // Base para convertir tasa anual a mensual
    diasDelMes: 30,
    diasDelAno: 360,

    // Monto máximo permitido
    topeMaximoCredito: 650000,

    // La capacidad mensual equivale al 30% de la pensión
    porcentajeMaximoDescuento: 0.30,

    // Plazos disponibles
    plazosPermitidos: [12, 24, 36, 48, 60]

};


/*
==================================================
INICIAR SIMULADOR
==================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    const formularioSimulador =
        document.getElementById("formSimulador");

    if (!formularioSimulador) {
        return;
    }

    formularioSimulador.addEventListener(
        "submit",
        procesarSimulacion
    );

});


/*
==================================================
PROCESAR LA SIMULACIÓN
==================================================
*/

function procesarSimulacion(evento) {

    evento.preventDefault();

    const montoDeseado = obtenerNumero("montoDeseado");
    const edad = obtenerNumero("edad");
    const plazo = obtenerNumero("plazoCredito");
    const pensionMensual = obtenerNumero("pensionBruta");

    const mensajeValidacion = validarDatosSimulador({
        montoDeseado,
        edad,
        plazo,
        pensionMensual
    });

    if (mensajeValidacion) {
        alert(mensajeValidacion);
        return;
    }

    const resultado = calcularCreditoIMSS({
        montoSolicitado: montoDeseado,
        plazoMeses: plazo,
        pensionMensual
    });

    mostrarResultadoSimulacion(
        resultado,
        {
            edad,
            pensionMensual
        }
    );

}


/*
==================================================
FUNCIÓN PRINCIPAL DEL CÁLCULO

La capacidad mensual corresponde directamente
al 30% de la pensión mensual percibida.
==================================================
*/

function calcularCreditoIMSS(datos) {

    const {
        montoSolicitado,
        plazoMeses,
        pensionMensual
    } = datos;

    const tasaMensual = obtenerTasaMensual();

    /*
    La capacidad mensual corresponde al 30%
    de la pensión mensual.
    */

    const capacidadPagoMensual =
        pensionMensual *
        CONFIGURACION_CREDITO.porcentajeMaximoDescuento;


    /*
    IMPORTANTE:
    El escenario de capacidad máxima siempre
    se calcula utilizando el plazo máximo de 60 meses.
    */

    const plazoMaximoMeses = 60;


    /*
    Calculamos cuánto podría alcanzar usando
    toda su capacidad mensual durante 60 meses.
    */

    const creditoCalculado =
        calcularValorPresente(
            capacidadPagoMensual,
            tasaMensual,
            plazoMaximoMeses
        );


    /*
    Aplicamos el tope máximo permitido.
    */

    const creditoMaximo =
        Math.min(
            Math.floor(creditoCalculado),
            CONFIGURACION_CREDITO.topeMaximoCredito
        );


    /*
    Mensualidad correspondiente al crédito máximo,
    calculada a 60 meses.
    */

    const pagoMensualMaximo =
        calcularPagoMensual(
            creditoMaximo,
            tasaMensual,
            plazoMaximoMeses
        );


    /*
    Total estimado del crédito máximo.
    */

    const pagoTotalMaximo =
        pagoMensualMaximo *
        plazoMaximoMeses;


    /*
    SEGUNDO ESCENARIO:
    El monto solicitado conserva el plazo
    seleccionado por el usuario.
    */

    const montoEvaluado =
        Math.min(
            montoSolicitado,
            creditoMaximo
        );


    const pagoMensual =
        calcularPagoMensual(
            montoEvaluado,
            tasaMensual,
            plazoMeses
        );


    const pagoTotal =
        pagoMensual *
        plazoMeses;


    const solicitudDentroDeCapacidad =
        montoSolicitado <= creditoMaximo;


    return {

        montoSolicitado,
        montoEvaluado,

        creditoMaximo,
        capacidadPagoMensual,
        pagoMensualMaximo,
        pagoTotalMaximo,

        pagoMensual,
        pagoTotal,

        /*
        Plazo elegido para la solicitud.
        */

        plazoMeses,

        /*
        Plazo fijo del escenario máximo.
        */

        plazoMaximoMeses,

        tasaMensual,
        solicitudDentroDeCapacidad

    };

}
/*
==================================================
CONVERTIR TASA ANUAL A MENSUAL
==================================================
*/

function obtenerTasaMensual() {

    return (
        CONFIGURACION_CREDITO.tasaAnualConIVA /
        CONFIGURACION_CREDITO.diasDelAno
    ) * CONFIGURACION_CREDITO.diasDelMes;

}


/*
==================================================
VALOR PRESENTE
==================================================
*/

function calcularValorPresente(
    pagoMensual,
    tasaMensual,
    numeroPagos
) {

    if (pagoMensual <= 0) {
        return 0;
    }

    if (tasaMensual === 0) {
        return pagoMensual * numeroPagos;
    }

    return pagoMensual *
        (
            1 -
            Math.pow(
                1 + tasaMensual,
                -numeroPagos
            )
        ) /
        tasaMensual;

}


/*
==================================================
CÁLCULO DE MENSUALIDAD
==================================================
*/

function calcularPagoMensual(
    montoCredito,
    tasaMensual,
    numeroPagos
) {

    if (montoCredito <= 0) {
        return 0;
    }

    if (tasaMensual === 0) {
        return montoCredito / numeroPagos;
    }

    return montoCredito *
        tasaMensual /
        (
            1 -
            Math.pow(
                1 + tasaMensual,
                -numeroPagos
            )
        );

}
/*
==================================================
VALIDAR DATOS DEL SIMULADOR
==================================================
*/

function validarDatosSimulador(datos) {

    const {
        montoDeseado,
        edad,
        plazo,
        pensionMensual
    } = datos;


    /*
    Validamos que todos los datos estén completos.
    */

    if (
        !montoDeseado ||
        !edad ||
        !plazo ||
        !pensionMensual
    ) {
        return "Por favor completa todos los datos para realizar la simulación.";
    }


    /*
    REGLA 1:
    El crédito mínimo es de $6,000.
    */

    if (montoDeseado < 6000) {
        return "El monto mínimo que puedes solicitar es de $6,000.";
    }


    /*
    REGLA 2:
    El crédito máximo es de $600,000.
    */

    if (montoDeseado > 600000) {
        return "El monto máximo que puedes solicitar es de $600,000.";
    }


    /*
    REGLA 3:
    La edad mínima es de 60 años.
    */

    if (edad < 60) {
        return "La edad mínima para solicitar un crédito es de 60 años.";
    }


    /*
    REGLA 4:
    La edad máxima es de 74 años.
    */

    if (edad > 74) {
        return "La edad máxima para solicitar un crédito es de 74 años.";
    }


    /*
    Validación de pensión.
    */

    if (pensionMensual <= 0) {
        return "Ingresa una cantidad válida para tu pensión mensual.";
    }


    /*
    Validamos que exista un plazo seleccionado.
    */

    if (![12, 24, 36, 48, 60].includes(plazo)) {
        return "Selecciona un plazo válido para continuar.";
    }


    /*
    Si todo está correcto, no devolvemos error.
    */

    return "";

}
/*
==================================================
MOSTRAR RESULTADOS
==================================================
*/

function mostrarResultadoSimulacion(
    resultado,
    datosSimulacion
) {

    const contenedorResultado =
        document.getElementById("resultadoSimulacion");

    const estadoSolicitud =
        document.getElementById("estadoSolicitud");

    if (!contenedorResultado || !estadoSolicitud) {
        console.error(
            "No se encontró el modal o el estado de la solicitud."
        );
        return;
    }


    /*
    RESULTADO 1:
    CAPACIDAD MÁXIMA A 60 MESES
    */

    document.getElementById(
        "resultadoMonto"
    ).textContent =
        formatoMoneda(resultado.creditoMaximo);

    document.getElementById(
        "resultadoCapacidad"
    ).textContent =
        formatoMoneda(resultado.pagoMensualMaximo);

    document.getElementById(
        "resultadoPlazoMaximo"
    ).textContent =
        resultado.plazoMaximoMeses + " meses";

    document.getElementById(
        "resultadoTotalMaximo"
    ).textContent =
        formatoMoneda(resultado.pagoTotalMaximo);


    /*
    RESULTADO 2:
    MONTO SOLICITADO
    */

    document.getElementById(
        "resultadoSolicitado"
    ).textContent =
        formatoMoneda(resultado.montoSolicitado);

    document.getElementById(
        "resultadoPago"
    ).textContent =
        formatoMoneda(resultado.pagoMensual);

    document.getElementById(
        "resultadoPlazo"
    ).textContent =
        resultado.plazoMeses + " meses";

    document.getElementById(
        "resultadoPagoTotal"
    ).textContent =
        formatoMoneda(resultado.pagoTotal);


    /*
    MENSAJE SEGÚN EL RESULTADO
    */

    if (resultado.solicitudDentroDeCapacidad) {

        estadoSolicitud.className =
            "estado-solicitud capacidad-positiva";

        estadoSolicitud.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>

            <div>
                <strong>
                    El monto solicitado está dentro de tu estimación inicial.
                </strong>

                <p>
                    La aprobación definitiva depende de la revisión
                    de documentos y de la institución financiera.
                </p>
            </div>
        `;

    } else {

        estadoSolicitud.className =
            "estado-solicitud requiere-revision";

        estadoSolicitud.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>

            <div>
                <strong>
                    El monto solicitado supera la estimación inicial.
                </strong>

                <p>
                    Un asesor puede ayudarte a revisar otro monto,
                    plazo o alternativa disponible.
                </p>
            </div>
        `;

    }


    /*
    PREPARAMOS EL MENSAJE DE WHATSAPP
    */

    actualizarEnlaceWhatsApp(
        resultado,
        datosSimulacion
    );


    /*
    ABRIMOS EL MODAL
    */

    contenedorResultado.classList.remove("oculto");

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    document.body.classList.add(
        "modal-resultados-abierto"
    );


    /*
    CONFETI Y SONIDO
    */

    reproducirSonidoExito();

    lanzarConfetiResultado();

}

/*
==================================================
CREAR MENSAJE COMPLETO PARA WHATSAPP
==================================================
*/

function actualizarEnlaceWhatsApp(
    resultado,
    datosSimulacion
) {

    const boton =
        document.getElementById("whatsappResultado");

    let datosGuardados = {};

    try {

        datosGuardados =
            JSON.parse(
                sessionStorage.getItem(
                    "datosClienteCredito"
                )
            ) || {};

    } catch (error) {

        datosGuardados = {};

    }

    const nombre =
        datosGuardados.nombre || "Cliente";

    const correo =
        datosGuardados.correo || "No proporcionado";

    const telefono =
        datosGuardados.telefono || "No proporcionado";

    const tramite =
        convertirTipoTramite(
            datosGuardados.tipoTramite
        );

    const creditoAnterior =
        convertirRespuesta(
            datosGuardados.creditoAnterior
        );

    const curp =
        datosGuardados.curp || "No proporcionada";

    const nss =
        datosGuardados.nss || "No proporcionado";

    const resultadoSolicitud =
        resultado.solicitudDentroDeCapacidad
            ? "Dentro de la estimación inicial"
            : "Requiere revisión personalizada";

    const mensaje = [
        "Hola Daniel, soy " + nombre + ".",
        "",
        "Realicé una simulación de crédito para pensionados IMSS.",
        "",
        "DATOS DE CONTACTO",
        "Nombre: " + nombre,
        "Teléfono: " + telefono,
        "Correo: " + correo,
        "",
        "DATOS DEL TRÁMITE",
        "Tipo de trámite: " + tramite,
        "¿Ha tenido crédito antes?: " + creditoAnterior,
        "CURP: " + curp,
        "NSS: " + nss,
        "",
        "DATOS DE LA SIMULACIÓN",
        "Edad: " + datosSimulacion.edad + " años",
        "Pensión mensual: " +
            formatoMoneda(datosSimulacion.pensionMensual),
        "Capacidad mensual del 30%: " +
            formatoMoneda(resultado.capacidadPagoMensual),
        "Monto solicitado: " +
            formatoMoneda(resultado.montoSolicitado),
        "Crédito máximo estimado: " +
            formatoMoneda(resultado.creditoMaximo),
        "Mensualidad estimada: " +
            formatoMoneda(resultado.pagoMensual),
        "Plazo: " +
            resultado.plazoMeses + " meses",
        "Pago total estimado: " +
            formatoMoneda(resultado.pagoTotal),
        "Resultado: " + resultadoSolicitud,
        "",
        "Quiero recibir asesoría personalizada."
    ].join("\n");

    boton.href =
        "https://wa.me/525518417167?text=" +
        encodeURIComponent(mensaje);

}


/*
==================================================
FUNCIONES AUXILIARES
==================================================
*/

function obtenerNumero(id) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return 0;
    }

    return Number(elemento.value);

}


function formatoMoneda(cantidad) {

    return new Intl.NumberFormat(
        "es-MX",
        {
            style: "currency",
            currency: "MXN",
            maximumFractionDigits: 2
        }
    ).format(cantidad || 0);

}


function convertirTipoTramite(valor) {

    const tipos = {
        "credito-nuevo": "Crédito nuevo",
        "renovacion": "Renovación",
        "mejora": "Mejora de crédito"
    };

    return tipos[valor] || "Por definir";

}


function convertirRespuesta(valor) {

    const respuestas = {
        "si": "Sí",
        "no": "No"
    };

    return respuestas[valor] || "No indicado";

}
/*
==================================================
ABRIR Y CERRAR VENTANA DE RESULTADOS
==================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    const modalResultado =
        document.getElementById("resultadoSimulacion");

    const cerrarResultado =
        document.getElementById("cerrarResultado");

    const fondoResultado =
        document.getElementById("fondoResultado");

    if (
        !modalResultado ||
        !cerrarResultado
    ) {
        return;
    }

    cerrarResultado.addEventListener("click", function () {

        cerrarVentanaResultado();

    });

    if (fondoResultado) {

        fondoResultado.addEventListener("click", function () {

            cerrarVentanaResultado();

        });

    }

    document.addEventListener("keydown", function (evento) {

        if (
            evento.key === "Escape" &&
            !modalResultado.classList.contains("oculto")
        ) {

            cerrarVentanaResultado();

        }

    });


    function cerrarVentanaResultado() {

        modalResultado.classList.add("oculto");

        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";

    }

});
/*
==================================================
PREPARAR MODAL DE RESULTADOS
==================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    const modalResultado =
        document.getElementById("resultadoSimulacion");

    if (!modalResultado) {
        return;
    }

    /*
    Movemos automáticamente el modal al final del body.
    Así deja de depender del ancho del formulario.
    */

    document.body.appendChild(modalResultado);

});
/*
==================================================
CONFETI DE RESULTADO
==================================================
*/

function lanzarConfetiResultado() {
    const canvas =
        document.createElement("canvas");

    canvas.className =
        "canvas-confeti-resultado";

    document.body.appendChild(canvas);
    
canvas.style.position = "fixed";
canvas.style.inset = "0";
canvas.style.width = "100vw";
canvas.style.height = "100dvh";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "1000001";
    
    const contexto =
        canvas.getContext("2d");

    let anchoPantalla;
    let altoPantalla;

    const particulas = [];

    const colores = [
        "#f2c94c",
        "#ffffff",
        "#19b65b",
        "#1674d1",
        "#ff7043",
        "#ec407a"
    ];


    function ajustarCanvas() {

        anchoPantalla =
            window.innerWidth;

        altoPantalla =
            window.innerHeight;

        canvas.width =
            anchoPantalla;

        canvas.height =
            altoPantalla;

    }


    ajustarCanvas();


    /*
    Creamos las partículas.
    */

    for (let indice = 0; indice < 150; indice++) {

        particulas.push({

            x:
                anchoPantalla / 2 +
                (Math.random() - 0.5) * 280,

            y:
                altoPantalla * 0.28,

            ancho:
                5 + Math.random() * 7,

            alto:
                8 + Math.random() * 10,

            velocidadX:
                (Math.random() - 0.5) * 13,

            velocidadY:
                -5 - Math.random() * 9,

            gravedad:
                0.20 + Math.random() * 0.10,

            rotacion:
                Math.random() * Math.PI,

            velocidadRotacion:
                (Math.random() - 0.5) * 0.30,

            opacidad:
                1,

            color:
                colores[
                    Math.floor(
                        Math.random() *
                        colores.length
                    )
                ]

        });

    }


    const inicio =
        performance.now();

    const duracion =
        2300;


    function animarConfeti(tiempoActual) {

        contexto.clearRect(
            0,
            0,
            anchoPantalla,
            altoPantalla
        );


        particulas.forEach(function (particula) {

            particula.velocidadY +=
                particula.gravedad;

            particula.x +=
                particula.velocidadX;

            particula.y +=
                particula.velocidadY;

            particula.rotacion +=
                particula.velocidadRotacion;

            /*
            Desvanecemos al final.
            */

            const progreso =
                (tiempoActual - inicio) /
                duracion;

            if (progreso > 0.70) {

                particula.opacidad =
                    Math.max(
                        0,
                        1 -
                        (
                            progreso - 0.70
                        ) / 0.30
                    );

            }


            contexto.save();

            contexto.globalAlpha =
                particula.opacidad;

            contexto.translate(
                particula.x,
                particula.y
            );

            contexto.rotate(
                particula.rotacion
            );

            contexto.fillStyle =
                particula.color;

            contexto.fillRect(
                -particula.ancho / 2,
                -particula.alto / 2,
                particula.ancho,
                particula.alto
            );

            contexto.restore();

        });


        if (
            tiempoActual - inicio <
            duracion
        ) {

            requestAnimationFrame(
                animarConfeti
            );

        } else {

            canvas.remove();

            window.removeEventListener(
                "resize",
                ajustarCanvas
            );

        }

    }


    window.addEventListener(
        "resize",
        ajustarCanvas
    );

    requestAnimationFrame(
        animarConfeti
    );

}
/*
==================================================
SONIDO DE ÉXITO
No requiere archivos de audio externos.
==================================================
*/

function reproducirSonidoExito() {

    try {

        const AudioContexto =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContexto) {
            return;
        }

        const contextoAudio =
            new AudioContexto();

        const volumen =
            contextoAudio.createGain();

        volumen.connect(
            contextoAudio.destination
        );

        volumen.gain.setValueAtTime(
            0.0001,
            contextoAudio.currentTime
        );

        volumen.gain.exponentialRampToValueAtTime(
            0.12,
            contextoAudio.currentTime + 0.02
        );

        volumen.gain.exponentialRampToValueAtTime(
            0.0001,
            contextoAudio.currentTime + 0.65
        );


        /*
        Primera nota.
        */

        crearNotaExito(
            contextoAudio,
            volumen,
            523.25,
            0,
            0.22
        );


        /*
        Segunda nota.
        */

        crearNotaExito(
            contextoAudio,
            volumen,
            659.25,
            0.16,
            0.26
        );


        /*
        Nota final.
        */

        crearNotaExito(
            contextoAudio,
            volumen,
            783.99,
            0.34,
            0.32
        );


        setTimeout(function () {

            contextoAudio.close();

        }, 1000);

    } catch (error) {

        /*
        Si el navegador bloquea el audio,
        la simulación continúa normalmente.
        */

        console.warn(
            "El sonido de éxito no pudo reproducirse."
        );

    }

}


function crearNotaExito(
    contexto,
    volumen,
    frecuencia,
    retraso,
    duracion
) {

    const oscilador =
        contexto.createOscillator();

    oscilador.type =
        "sine";

    oscilador.frequency.setValueAtTime(
        frecuencia,
        contexto.currentTime + retraso
    );

    oscilador.connect(
        volumen
    );

    oscilador.start(
        contexto.currentTime + retraso
    );

    oscilador.stop(
        contexto.currentTime +
        retraso +
        duracion
    );

}

