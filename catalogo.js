// Catálogo: lee data/productos.json, pinta los productos y los filtra por categoría.
(function () {
  "use strict";

  var lista = document.getElementById("lista-productos");
  var selector = document.getElementById("filtro-categoria");
  var resultado = document.getElementById("resultado");
  var productos = [];

  var formatoPrecio = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

  // Crea un elemento con clase y texto opcionales.
  function crear(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) { el.className = clase; }
    if (texto) { el.textContent = texto; }
    return el;
  }

  // Construye la tarjeta de un producto.
  function tarjeta(p) {
    var li = crear("li", p.disponible ? "producto" : "producto producto-agotado");

    if (p.imagen) {
      var img = crear("img", "producto-foto");
      img.src = p.imagen;
      img.alt = p.nombre;
      img.loading = "lazy";
      li.appendChild(img);
    } else {
      var foto = crear("div", "foto-provisional", "Foto provisional");
      foto.setAttribute("role", "img");
      foto.setAttribute("aria-label", "Foto de " + p.nombre + " pendiente");
      li.appendChild(foto);
    }

    var cuerpo = crear("div", "producto-cuerpo");
    cuerpo.appendChild(crear("h3", "", p.nombre));
    cuerpo.appendChild(crear("p", "producto-desc", p.descripcionCorta));

    var datos = crear("div", "producto-datos");
    datos.appendChild(crear("span", "precio", formatoPrecio.format(p.precio)));
    datos.appendChild(crear("span", p.disponible ? "estado" : "estado estado-agotado",
      p.disponible ? "Disponible" : "Agotado"));
    cuerpo.appendChild(datos);

    var enlace = crear("a", "producto-enlace", "Ver producto");
    enlace.href = "producto.html?id=" + p.id;
    enlace.setAttribute("aria-label", "Ver producto: " + p.nombre);
    cuerpo.appendChild(enlace);

    li.appendChild(cuerpo);
    return li;
  }

  // Muestra los productos de la categoría elegida.
  function pintar() {
    var categoria = selector.value;
    var visibles = productos.filter(function (p) {
      return categoria === "todas" || p.categoria === categoria;
    });

    lista.textContent = "";
    visibles.forEach(function (p) { lista.appendChild(tarjeta(p)); });

    var n = visibles.length;
    var texto = n === 1 ? "Mostrando 1 producto" : "Mostrando " + n + " productos";
    if (categoria !== "todas") { texto += " de «" + categoria + "»"; }
    resultado.textContent = n === 0 ? "No hay productos en esta categoría." : texto;
  }

  function mostrarError() {
    lista.textContent = "";
    resultado.textContent = "";
    var aviso = crear("p", "mensaje",
      "No se han podido cargar los productos. Si has abierto la página directamente desde la carpeta, " +
      "ábrela con Live Server o desde la web publicada.");
    lista.appendChild(aviso);
  }

  // Al cambiar el filtro, actualiza la lista y la dirección (?categoria=...).
  selector.addEventListener("change", function () {
    pintar();
    try {
      var url = selector.value === "todas"
        ? window.location.pathname
        : "?categoria=" + encodeURIComponent(selector.value);
      window.history.replaceState(null, "", url);
    } catch (e) { /* no pasa nada si el navegador no lo permite */ }
  });

  // Si la dirección trae ?categoria=Cerámica, el filtro empieza en esa categoría.
  var inicial = new URLSearchParams(window.location.search).get("categoria");
  if (inicial) {
    var opciones = Array.prototype.map.call(selector.options, function (o) { return o.value; });
    if (opciones.indexOf(inicial) !== -1) { selector.value = inicial; }
  }

  fetch("data/productos.json")
    .then(function (respuesta) {
      if (!respuesta.ok) { throw new Error("Error " + respuesta.status); }
      return respuesta.json();
    })
    .then(function (datos) {
      productos = datos;
      pintar();
    })
    .catch(mostrarError);
})();
