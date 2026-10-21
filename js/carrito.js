// Carrito compartido por todas las páginas. Se guarda en el navegador (localStorage).
(function () {
  "use strict";

  var CLAVE = "lacandela-carrito";
  var CLAVE_PEDIDOS = "lacandela-pedidos";
  var PRECIO_ENVIO = 4.95;   // euros. Dato de ejemplo: confirmar la tarifa real con la dueña (Product Owner)
  var MAX_UNIDADES = 10;     // máximo de unidades de un mismo producto

  var formato = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

  function leer(clave, porDefecto) {
    try {
      var texto = window.localStorage.getItem(clave);
      return texto ? JSON.parse(texto) : porDefecto;
    } catch (e) {
      return porDefecto;
    }
  }

  function escribir(clave, valor) {
    try { window.localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ }
  }

  function obtener() {
    var e = leer(CLAVE, null);
    if (!e || !Array.isArray(e.items)) { e = { items: [], entrega: "envio" }; }
    if (e.entrega !== "envio" && e.entrega !== "recogida") { e.entrega = "envio"; }
    e.items = e.items.filter(function (l) {
      return l && Number.isInteger(l.id) && Number.isInteger(l.cantidad) && l.cantidad > 0;
    });
    return e;
  }

  function unidades() {
    return obtener().items.reduce(function (total, l) { return total + l.cantidad; }, 0);
  }

  function actualizarContador() {
    var contador = document.getElementById("carrito-contador");
    var enlace = document.getElementById("enlace-carrito");
    if (!contador || !enlace) { return; }
    var n = unidades();
    contador.textContent = String(n);
    contador.hidden = n === 0;
    enlace.setAttribute("aria-label", n === 0 ? "Carrito" : "Carrito, " + n + (n === 1 ? " unidad" : " unidades"));
  }

  function guardarEstado(e) {
    escribir(CLAVE, e);
    actualizarContador();
    window.dispatchEvent(new CustomEvent("carrito:cambio"));
  }

  // Añade n unidades. Devuelve la cantidad que queda y si se ha llegado al máximo.
  function anadir(id, n) {
    var e = obtener();
    var linea = e.items.find(function (l) { return l.id === id; });
    var antes = linea ? linea.cantidad : 0;
    var despues = Math.min(MAX_UNIDADES, antes + (n || 1));
    if (linea) { linea.cantidad = despues; } else { e.items.push({ id: id, cantidad: despues }); }
    guardarEstado(e);
    return { cantidad: despues, enLimite: despues === antes };
  }

  function quitar(id) {
    var e = obtener();
    e.items = e.items.filter(function (l) { return l.id !== id; });
    guardarEstado(e);
  }

  function cambiarCantidad(id, cantidad) {
    if (cantidad <= 0) { quitar(id); return; }
    var e = obtener();
    var linea = e.items.find(function (l) { return l.id === id; });
    if (linea) {
      linea.cantidad = Math.min(MAX_UNIDADES, cantidad);
      guardarEstado(e);
    }
  }

  function vaciar() {
    var e = obtener();
    e.items = [];
    guardarEstado(e);
  }

  function establecerEntrega(valor) {
    var e = obtener();
    e.entrega = valor === "recogida" ? "recogida" : "envio";
    guardarEstado(e);
  }

  function costeEnvio(entrega) {
    return (entrega || obtener().entrega) === "envio" ? PRECIO_ENVIO : 0;
  }

  function guardarPedido(pedido) {
    var lista = leer(CLAVE_PEDIDOS, []);
    if (!Array.isArray(lista)) { lista = []; }
    lista.push(pedido);
    escribir(CLAVE_PEDIDOS, lista);
  }

  function redondear(x) { return Math.round(x * 100) / 100; }

  // Crea un elemento con clase y texto opcionales.
  function crear(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) { el.className = clase; }
    if (texto) { el.textContent = texto; }
    return el;
  }

  window.Carrito = {
    PRECIO_ENVIO: PRECIO_ENVIO,
    MAX_UNIDADES: MAX_UNIDADES,
    obtener: obtener,
    unidades: unidades,
    anadir: anadir,
    quitar: quitar,
    cambiarCantidad: cambiarCantidad,
    vaciar: vaciar,
    establecerEntrega: establecerEntrega,
    costeEnvio: costeEnvio,
    guardarPedido: guardarPedido,
    redondear: redondear,
    crear: crear,
    formatoPrecio: formato
  };

  actualizarContador();
  // Si el carrito cambia en otra pestaña, el contador se actualiza aquí también.
  window.addEventListener("storage", function (ev) {
    if (ev.key === CLAVE) { actualizarContador(); }
  });
})();
