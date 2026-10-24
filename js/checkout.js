// Finalizar pedido: resumen, formulario con los datos del cliente, método de pago y confirmación.
// IMPORTANTE: es un prototipo. No se cobra nada ni se envía el pedido a ningún servidor.
(function () {
  "use strict";

  var crear = Carrito.crear;
  var formato = Carrito.formatoPrecio;

  var vacio = document.getElementById("checkout-vacio");
  var contenido = document.getElementById("checkout-contenido");
  var formulario = document.getElementById("formulario-pedido");
  var lineasUl = document.getElementById("resumen-lineas");
  var tSubtotal = document.getElementById("total-subtotal");
  var filaDescuento = document.getElementById("fila-descuento");
  var tDescuento = document.getElementById("total-descuento");
  var tEnvio = document.getElementById("total-envio");
  var tTotal = document.getElementById("total-total");
  var textoEntrega = document.getElementById("resumen-entrega");
  var bloqueDireccion = document.getElementById("bloque-direccion");
  var bloqueRecogida = document.getElementById("bloque-recogida");
  var campoDireccion = document.getElementById("direccion");
  var confirmacion = document.getElementById("confirmacion");

  var PAGOS = { tarjeta: "Tarjeta", bizum: "Bizum" };
  var ENTREGAS = {
    envio: "Envío a domicilio por mensajería",
    recogida: "Recogida gratuita en la tienda de Córdoba"
  };

  var lineas = [];
  var entrega = "envio";
  var t = null;   // importes calculados (subtotal, descuento, envío, total)

  function calcular(catalogo) {
    var estado = Carrito.obtener();
    entrega = estado.entrega;
    lineas = [];
    estado.items.forEach(function (it) {
      var p = catalogo[it.id];
      if (p && p.disponible) { lineas.push({ producto: p, cantidad: it.cantidad }); }
    });
    t = Carrito.totales(lineas, entrega);
  }

  function pintarResumen() {
    lineasUl.textContent = "";
    lineas.forEach(function (l) {
      var li = crear("li");
      li.appendChild(crear("span", "", l.cantidad + " × " + l.producto.nombre));
      li.appendChild(crear("span", "", formato.format(Carrito.redondear(l.producto.precio * l.cantidad))));
      lineasUl.appendChild(li);
    });
    tSubtotal.textContent = formato.format(t.subtotal);
    filaDescuento.hidden = t.descuento === 0;
    tDescuento.textContent = "\u2212" + formato.format(t.descuento);
    tEnvio.textContent = t.envio === 0 ? "Gratis" : formato.format(t.envio);
    tTotal.textContent = formato.format(t.total);
    textoEntrega.textContent = ENTREGAS[entrega];

    var aDomicilio = entrega === "envio";
    bloqueDireccion.hidden = !aDomicilio;
    bloqueRecogida.hidden = aDomicilio;
    campoDireccion.required = aDomicilio;
    campoDireccion.disabled = !aDomicilio;
  }

  function numeroPedido() {
    var d = new Date();
    var dos = function (n) { return (n < 10 ? "0" : "") + n; };
    var azar = String(Math.floor(1000 + Math.random() * 9000));
    return "LC-" + d.getFullYear() + dos(d.getMonth() + 1) + dos(d.getDate()) + "-" + azar;
  }

  function mostrarConfirmacion(pedido) {
    contenido.hidden = true;
    confirmacion.hidden = false;
    document.getElementById("numero-pedido").textContent = pedido.numero;

    var detalle = document.getElementById("confirmacion-detalle");
    detalle.textContent = "";
    var filas = [
      ["Entrega", ENTREGAS[pedido.entrega]],
      ["Pago", PAGOS[pedido.pago]]
    ];
    if (pedido.entrega === "envio") { filas.splice(1, 0, ["Dirección", pedido.cliente.direccion]); }
    if (pedido.descuento > 0) { filas.push(["Descuento primera compra (10 %)", "\u2212" + formato.format(pedido.descuento)]); }
    filas.push(["Total", formato.format(pedido.total)]);
    filas.forEach(function (f) {
      var fila = crear("div");
      fila.appendChild(crear("dt", "", f[0]));
      fila.appendChild(crear("dd", "", f[1]));
      detalle.appendChild(fila);
    });

    document.getElementById("titulo-confirmacion").focus();
    window.scrollTo(0, 0);
  }

  formulario.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var datos = new FormData(formulario);
    var pedido = {
      numero: numeroPedido(),
      fecha: new Date().toISOString(),
      estado: "Pendiente",
      cliente: {
        nombre: String(datos.get("nombre")).trim(),
        telefono: String(datos.get("telefono")).trim(),
        email: String(datos.get("email")).trim(),
        direccion: entrega === "envio" ? String(datos.get("direccion")).trim() : ""
      },
      entrega: entrega,
      pago: String(datos.get("pago")),
      lineas: lineas.map(function (l) {
        return { id: l.producto.id, nombre: l.producto.nombre, precio: l.producto.precio, cantidad: l.cantidad };
      }),
      subtotal: t.subtotal,
      descuento: t.descuento,
      envio: t.envio,
      total: t.total
    };
    Carrito.guardarPedido(pedido);
    Carrito.vaciar();
    mostrarConfirmacion(pedido);
  });

  fetch("data/productos.json")
    .then(function (respuesta) {
      if (!respuesta.ok) { throw new Error("Error " + respuesta.status); }
      return respuesta.json();
    })
    .then(function (productos) {
      var catalogo = {};
      productos.forEach(function (p) { catalogo[p.id] = p; });
      calcular(catalogo);
      if (lineas.length === 0) {
        vacio.hidden = false;
        return;
      }
      contenido.hidden = false;
      pintarResumen();
    })
    .catch(function () {
      vacio.textContent = "No se han podido cargar los productos. Si has abierto la página directamente desde la carpeta, ábrela con Live Server o desde la web publicada.";
      vacio.hidden = false;
    });
})();
