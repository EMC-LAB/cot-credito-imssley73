"use strict";

const PENSION_CLARA_AI_ENDPOINT = window.PENSION_CLARA_AI_ENDPOINT || "";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("aiForm");
  const input = document.getElementById("aiPregunta");
  const mensajes = document.getElementById("aiMensajes");
  const escribiendo = document.getElementById("aiEscribiendo");
  const sugerencias = document.querySelectorAll("[data-prompt]");
  if (!form || !input || !mensajes) return;

  const historial = [];

  sugerencias.forEach(btn => btn.addEventListener("click", () => {
    input.value = btn.dataset.prompt || "";
    form.requestSubmit();
  }));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pregunta = input.value.trim();
    if (!pregunta) return;
    agregar("usuario", pregunta);
    historial.push({ role: "user", content: pregunta });
    input.value = "";
    mostrarEscribiendo(true);

    try {
      let respuesta;
      if (PENSION_CLARA_AI_ENDPOINT) {
        const r = await fetch(PENSION_CLARA_AI_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historial.slice(-12) })
        });
        if (!r.ok) throw new Error("No se pudo consultar el asistente");
        const data = await r.json();
        respuesta = data.answer || data.output_text || data.message;
      } else {
        respuesta = respuestaLocal(pregunta);
      }
      agregar("bot", respuesta || "No pude generar una respuesta. Puedes hablar directamente con Daniel por WhatsApp.");
      historial.push({ role: "assistant", content: respuesta });
    } catch (err) {
      agregar("bot", "En este momento no pude conectarme al asistente inteligente. Puedes intentar de nuevo o hablar con Daniel por WhatsApp.");
    } finally {
      mostrarEscribiendo(false);
    }
  });

  function agregar(tipo, texto) {
    const wrap = document.createElement("div");
    wrap.className = tipo === "usuario" ? "mensaje-usuario" : "mensaje-bot";
    if (tipo === "usuario") {
      wrap.innerHTML = `<div class="mensaje-contenido"><p></p></div>`;
    } else {
      wrap.innerHTML = `<div class="mensaje-avatar"><i class="fa-solid fa-user-tie"></i></div><div class="mensaje-contenido"><p></p></div>`;
    }
    wrap.querySelector("p").textContent = texto;
    mensajes.appendChild(wrap);
    mensajes.scrollTop = mensajes.scrollHeight;
  }

  function mostrarEscribiendo(si) {
    if (escribiendo) escribiendo.classList.toggle("oculto", !si);
  }

  function respuestaLocal(q) {
    const t = q.toLowerCase();
    if (t.includes("ley 73") || t.includes("soy ley")) {
      return "Como referencia general, Ley 73 puede aplicar si cotizaste al IMSS antes del 1 de julio de 1997 y cumples los demás requisitos. Puedes revisar la sección Ley 73 del portal y confirmar tu caso con el IMSS.";
    }
    if (t.includes("semana")) {
      return "Puedes solicitar gratis tu Constancia de Semanas Cotizadas en el portal oficial del IMSS. Para Ley 73, el IMSS señala como referencia mínima 500 semanas para cesantía o vejez, además de otros requisitos.";
    }
    if (t.includes("pago") || t.includes("cayó") || t.includes("cayo") || t.includes("deposit")) {
      return "Si recibes tu pensión directamente del IMSS, la regla general publicada por el Instituto es el primer día hábil de cada mes. La hora exacta puede variar según el banco.";
    }
    if (t.includes("credito") || t.includes("crédito") || t.includes("presta") || t.includes("dinero")) {
      return "Podemos hacer una simulación informativa para pensionados IMSS Ley 73. El monto y la aprobación dependen de tu perfil y de la institución financiera. Nunca compartas NIP, CVV, contraseñas ni códigos bancarios.";
    }
    if (t.includes("bienestar") || t.includes("issste") || t.includes("gobierno")) {
      return "Si no eres pensionado IMSS Ley 73, podemos revisar tu perfil por separado. Recibir Pensión Bienestar no significa que exista un crédito del programa; se evalúan otras fuentes de ingreso y condiciones del solicitante.";
    }
    return "Puedo ayudarte con Ley 73, edad para pensionarte, semanas cotizadas, fechas de pago y opciones de crédito. Si tu pregunta depende de documentos o de una decisión de aprobación, lo mejor es que Daniel revise tu caso.";
  }
});
