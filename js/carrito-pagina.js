// Página del carrito: muestra las líneas, permite cambiar cantidades, elegir entrega y ver el total.
(function () {
  "use strict";

  var crear = Carrito.crear;
  var formato = Carrito.formatoPrecio;

  var lineasUl = document.getElementById("carrito-lineas");
  var contenido = document.getElementById("carrito-contenido");
  var vacio = document.getElementById("carrito-vacio");
  var aviso = document.getElementById("carrito-aviso");
  var avisoEnvio = document.getElementById("aviso-envio");
  var tSubtotal = document.getElementById("total-subtotal");
  var filaDescuento = document.getElementById("fila-descuento");
  var tDescuento = document.getElementById("total-descuento");
  var tEnvio = document.getElementById("total-envio");
  var tTotal = document.getElementById("total-total");
  var textoEnvio = document.getElementById("texto-envio");
  var radios = document.querySelectorAll('input[name="entrega"]');

  var catalogo = {};   // id -> producto
  var enfoque = null;  // botón que debe recuperar el foco tras repintar

  function linea(l) {
    var p = l.producto;
    var li = crear("li", "linea");

    if (p.imagen) {
      var img = crear("img", "linea-foto");
      img.src = p.imagen;
      img.alt = p.nombre;
      li.appendChild(img);
    } else {
      var foto = crear("div", "foto-provisional foto-mini", "Foto");
      foto.setAttribute("role", "img");
      foto.setAttribute("aria-label", "Foto de " + p.nombre + " pendiente");
      li.appendChild(foto);
    }

    var info = crear("div", "linea-info");
    var h = crear("h3");
    var a = crear("a", "", p.nombre);
    a.href = "producto.html?id=" + p.id;
    h.appendChild(a);
    info.appendChild(h);
    info.appendChild(crear("p", "linea-unitario", formato.format(p.precio) + " por unidad"));
    li.appendChild(info);

    var controles = crear("div", "linea-controles");

    var cantidad = crear("div", "cantidad");
    var menos = crear("button", "", "\u2212");
    menos.type = "button";
    menos.dataset.id = String(p.id);
    menos.dataset.accion = "menos";
    menos.setAttribute("aria-label", "Quitar una unidad de " + p.nombre);
    menos.disabled = l.cantidad <= 1;
    var valor = crear("span", "cantidad-valor", String(l.cantidad));
    var mas = crear("button", "", "+");
    mas.type = "button";
    mas.dataset.id = String(p.id);
    mas.dataset.accion = "mas";
    mas.setAttribute("aria-label", "Añadir una unidad de " + p.nombre);
    mas.disabled = l.cantidad >= Carrito.MAX_UNIDADES;
    cantidad.appendChild(menos);
    cantidad.appendChild(valor);
    cantidad.appendChild(mas);
    controles.appendChild(cantidad);

    var quitar = crear("button", "enlace-boton", "Quitar");
    quitar.type = "button";
    quitar.dataset.id = String(p.id);
    quitar.dataset.accion = "quitar";
    quitar.setAttribute("aria-label", "Quitar " + p.nombre + " del carrito");
    controles.appendChild(quitar);

    controles.appendChild(crear("strong", "linea-total", formato.format(Carrito.redondear(p.precio * l.cantidad))));
    li.appendChild(controles);
    return li;
  }

  function textoAvisoEnvio(t, entrega) {
    if (entrega !== "envio") { return ""; }
    if (t.envioGratis) { return "¡Tienes el envío gratis!"; }
    var faltan = Carrito.UNIDADES_ENVIO_GRATIS - t.unidades;
    return "Añade " + faltan + (faltan === 1 ? " unidad más" : " unidades más") + " y el envío será gratis.";
  }

  function pintar() {
    var estado = Carrito.obtener();
    var lineas = [];
    var quitadas = 0;

    estado.items.forEach(function (it) {
      var p = catalogo[it.id];
      if (p && p.disponible) {
        lineas.push({ producto: p, cantidad: it.cantidad });
      } else {
        Carrito.quitar(it.id);
        quitadas++;
      }
    });
    if (quitadas) { aviso.textContent = "Hemos quitado del carrito productos que ya no están disponibles."; }

    if (lineas.length === 0) {
      contenido.hidden = true;
      vacio.hidden = false;
      return;
    }
    vacio.hidden = true;
    contenido.hidden = false;

    lineasUl.textContent = "";
    lineas.forEach(function (l) { lineasUl.appendChild(linea(l)); });

    var t = Carrito.totales(lineas, estado.entrega);
    tSubtotal.textContent = formato.format(t.subtotal);
    filaDescuento.hidden = t.descuento === 0;
    tDescuento.textContent = "\u2212" + formato.format(t.descuento);
    tEnvio.textContent = t.envio === 0 ? "Gratis" : formato.format(t.envio);
    tTotal.textContent = formato.format(t.total);
    textoEnvio.textContent = formato.format(Carrito.PRECIO_ENVIO) + " (gratis desde " + Carrito.UNIDADES_ENVIO_GRATIS + " unidades)";
    avisoEnvio.textContent = textoAvisoEnvio(t, estado.entrega);
    Array.prototype.forEach.call(radios, function (r) { r.checked = r.value === estado.entrega; });

    if (enfoque) {
      var boton = lineasUl.querySelector('[data-id="' + enfoque.id + '"][data-accion="' + enfoque.accion + '"]');
      if (boton && !boton.disabled) { boton.focus(); }
      enfoque = null;
    }
  }

  lineasUl.addEventListener("click", function (ev) {
    var boton = ev.target.closest("button[data-accion]");
    if (!boton) { return; }
    var id = parseInt(boton.dataset.id, 10);
    var accion = boton.dataset.accion;
    var actual = Carrito.obtener().items.find(function (l) { return l.id === id; });
    if (!actual) { return; }

    if (accion === "quitar") {
      var nombre = catalogo[id] ? catalogo[id].nombre : "El producto";
      Carrito.quitar(id);
      aviso.textContent = nombre + " se ha quitado del carrito.";
      aviso.focus();
    } else {
      Carrito.cambiarCantidad(id, actual.cantidad + (accion === "mas" ? 1 : -1));
      enfoque = { id: id, accion: accion };
    }
    pintar();
  });

  Array.prototype.forEach.call(radios, function (r) {
    r.addEventListener("change", function () {
      Carrito.establecerEntrega(r.value);
      pintar();
    });
  });

  fetch("data/productos.json")
    .then(function (respuesta) {
      if (!respuesta.ok) { throw new Error("Error " + respuesta.status); }
      return respuesta.json();
    })
    .then(function (productos) {
      productos.forEach(function (p) { catalogo[p.id] = p; });
      pintar();
    })
    .catch(function () {
      aviso.textContent = "No se han podido cargar los productos. Si has abierto la página directamente desde la carpeta, ábrela con Live Server o desde la web publicada.";
    });
})();
