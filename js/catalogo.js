// Catálogo: lee data/productos.json, busca por palabra clave (?q=...), filtra por categoría y pinta las tarjetas.
(function () {
  "use strict";

  var crear = Carrito.crear;
  var lista = document.getElementById("lista-productos");
  var selector = document.getElementById("filtro-categoria");
  var resultado = document.getElementById("resultado");
  var campoBusqueda = document.getElementById("buscar");

  var productos = [];
  var resumenes = {};

  var params = new URLSearchParams(window.location.search);
  var consulta = (params.get("q") || "").trim();
  if (campoBusqueda) { campoBusqueda.value = consulta; }

  // Dirección con la búsqueda y la categoría actuales (?q=...&categoria=...).
  function direccion(categoria) {
    var p = new URLSearchParams();
    if (consulta) { p.set("q", consulta); }
    if (categoria !== "todas") { p.set("categoria", categoria); }
    var texto = p.toString();
    return texto ? "?" + texto : window.location.pathname;
  }

  function pintar() {
    var categoria = selector.value;
    var visibles = Buscar.filtrar(productos, consulta).filter(function (p) {
      return categoria === "todas" || p.categoria === categoria;
    });

    lista.textContent = "";
    visibles.forEach(function (p) { lista.appendChild(Tarjetas.crear(p, resumenes[p.id])); });

    var n = visibles.length;
    var texto = n === 0 ? "No hay productos"
      : (n === 1 ? "Mostrando 1 producto" : "Mostrando " + n + " productos");
    if (categoria !== "todas") { texto += " de «" + categoria + "»"; }
    if (consulta) { texto += " para «" + consulta + "»"; }
    resultado.textContent = texto + ".";

    if (consulta) {
      var borrar = crear("a", "", "Borrar búsqueda");
      borrar.href = categoria === "todas" ? "catalogo.html" : "catalogo.html?categoria=" + encodeURIComponent(categoria);
      resultado.appendChild(document.createTextNode(" "));
      resultado.appendChild(borrar);
    }
  }

  function mostrarError() {
    lista.textContent = "";
    resultado.textContent = "";
    lista.appendChild(crear("p", "mensaje",
      "No se han podido cargar los productos. Si has abierto la página directamente desde la carpeta, " +
      "ábrela con Live Server o desde la web publicada."));
  }

  selector.addEventListener("change", function () {
    pintar();
    try { window.history.replaceState(null, "", direccion(selector.value)); } catch (e) { /* no pasa nada */ }
  });

  // Si la dirección trae ?categoria=Cerámica, el filtro empieza en esa categoría.
  var inicial = params.get("categoria");
  if (inicial) {
    var opciones = Array.prototype.map.call(selector.options, function (o) { return o.value; });
    if (opciones.indexOf(inicial) !== -1) { selector.value = inicial; }
  }

  Promise.all([
    fetch("data/productos.json").then(function (r) {
      if (!r.ok) { throw new Error("Error " + r.status); }
      return r.json();
    }),
    Resenas.cargar()
  ])
    .then(function (r) {
      productos = r[0];
      resumenes = Resenas.resumir(r[1]);
      pintar();
    })
    .catch(mostrarError);
})();
