// Página de favoritos: muestra los productos marcados con el corazón.
(function () {
  "use strict";

  var crear = Carrito.crear;
  var lista = document.getElementById("lista-favoritos");
  var vacio = document.getElementById("favoritos-vacio");
  var resultado = document.getElementById("favoritos-resultado");

  var productos = [];
  var resumenes = {};

  function pintar() {
    var favoritos = Favoritos.lista()
      .map(function (id) { return productos.find(function (p) { return p.id === id; }); })
      .filter(Boolean);

    lista.textContent = "";
    if (favoritos.length === 0) {
      vacio.hidden = false;
      resultado.textContent = "";
      return;
    }
    vacio.hidden = true;
    favoritos.forEach(function (p) { lista.appendChild(Tarjetas.crear(p, resumenes[p.id])); });
    resultado.textContent = favoritos.length === 1 ? "1 producto favorito." : favoritos.length + " productos favoritos.";
  }

  // Al quitar un favorito, la tarjeta desaparece: el foco pasa al resumen para no perderlo.
  window.addEventListener("favoritos:cambio", function () {
    pintar();
    (vacio.hidden ? resultado : vacio).focus();
  });

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
    .catch(function () {
      lista.textContent = "";
      lista.appendChild(crear("p", "mensaje",
        "No se han podido cargar los productos. Si has abierto la página directamente desde la carpeta, " +
        "ábrela con Live Server o desde la web publicada."));
    });
})();
