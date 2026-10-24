// Portada: pinta las novedades leyendo data/productos.json (así llevan las mismas fotos que el catálogo).
(function () {
  "use strict";

  var CATEGORIA = "Novedades";   // categoría que se muestra en la portada

  var crear = Carrito.crear;
  var lista = document.getElementById("lista-novedades");

  Promise.all([
    fetch("data/productos.json").then(function (r) {
      if (!r.ok) { throw new Error("Error " + r.status); }
      return r.json();
    }),
    Resenas.cargar()
  ])
    .then(function (r) {
      var resumenes = Resenas.resumir(r[1]);
      var novedades = r[0].filter(function (p) { return p.categoria === CATEGORIA; });

      lista.textContent = "";
      if (novedades.length === 0) {
        lista.appendChild(crear("p", "mensaje", "Muy pronto tendremos novedades."));
        return;
      }
      novedades.forEach(function (p) { lista.appendChild(Tarjetas.crear(p, resumenes[p.id])); });
    })
    .catch(function () {
      lista.textContent = "";
      lista.appendChild(crear("p", "mensaje",
        "No se han podido cargar las novedades. Si has abierto la página directamente desde la carpeta, " +
        "ábrela con Live Server o desde la web publicada."));
    });
})();
