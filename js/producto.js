// Ficha de detalle: lee ?id=... de la dirección, busca el producto en data/productos.json y lo muestra.
(function () {
  "use strict";

  var ficha = document.getElementById("ficha");
  var volver = document.getElementById("enlace-volver");
  var crear = Carrito.crear;
  var formato = Carrito.formatoPrecio;
  var id = parseInt(new URLSearchParams(window.location.search).get("id"), 10);

  function mensaje(texto) {
    ficha.textContent = "";
    var p = crear("p", "mensaje");
    p.appendChild(document.createTextNode(texto + " "));
    var a = crear("a", "", "Ir al catálogo");
    a.href = "catalogo.html";
    p.appendChild(a);
    ficha.appendChild(p);
  }

  // Fotos del producto: "imagenes" (hasta 3), o "imagen", o 3 recuadros provisionales (null).
  function fotosDe(p) {
    var reales = (p.imagenes && p.imagenes.length) ? p.imagenes.slice(0, 3) : (p.imagen ? [p.imagen] : []);
    return reales.length ? reales : [null, null, null];
  }

  function galeria(p) {
    var fotos = fotosDe(p);
    var caja = crear("div", "galeria");
    var principal = crear("div", "galeria-principal");
    var miniaturas = crear("div", "galeria-miniaturas");
    var botones = [];

    function mostrar(i) {
      principal.textContent = "";
      if (fotos[i]) {
        var img = crear("img", "ficha-foto");
        img.src = fotos[i];
        img.alt = p.nombre + ", foto " + (i + 1) + " de " + fotos.length;
        principal.appendChild(img);
      } else {
        var f = crear("div", "foto-provisional foto-grande", "Foto provisional " + (i + 1) + " de " + fotos.length);
        f.setAttribute("role", "img");
        f.setAttribute("aria-label", "Foto " + (i + 1) + " de " + p.nombre + " pendiente");
        principal.appendChild(f);
      }
      botones.forEach(function (b, j) { b.setAttribute("aria-pressed", j === i ? "true" : "false"); });
    }

    caja.appendChild(principal);

    if (fotos.length > 1) {
      fotos.forEach(function (src, i) {
        var b = crear("button", "miniatura");
        b.type = "button";
        b.setAttribute("aria-label", "Ver foto " + (i + 1) + " de " + fotos.length);
        if (src) {
          var im = crear("img");
          im.src = src;
          im.alt = "";
          b.appendChild(im);
        } else {
          b.textContent = String(i + 1);
        }
        b.addEventListener("click", function () { mostrar(i); });
        botones.push(b);
        miniaturas.appendChild(b);
      });
      caja.appendChild(miniaturas);
    }

    mostrar(0);
    return caja;
  }

  function pintar(p) {
    document.title = p.nombre + " · LaCandela - Artesania y regalos Córdoba";
    volver.href = "catalogo.html?categoria=" + encodeURIComponent(p.categoria);
    ficha.textContent = "";
    ficha.appendChild(galeria(p));

    var info = crear("div", "ficha-info");

    var cat = crear("p", "ficha-categoria", "Categoría: ");
    var enlaceCat = crear("a", "", p.categoria);
    enlaceCat.href = "catalogo.html?categoria=" + encodeURIComponent(p.categoria);
    cat.appendChild(enlaceCat);
    info.appendChild(cat);

    info.appendChild(crear("h1", "", p.nombre));

    var datos = crear("div", "ficha-datos");
    datos.appendChild(crear("span", "precio precio-grande", formato.format(p.precio)));
    datos.appendChild(crear("span", p.disponible ? "estado" : "estado estado-agotado",
      p.disponible ? "Disponible" : "Agotado"));
    info.appendChild(datos);

    info.appendChild(crear("p", "ficha-descripcion", p.descripcion));

    var boton = crear("button", "boton", p.disponible ? "Añadir al carrito" : "Agotado");
    boton.type = "button";
    boton.disabled = !p.disponible;
    info.appendChild(boton);

    var aviso = crear("p", "ficha-aviso");
    aviso.setAttribute("role", "status");
    if (!p.disponible) { aviso.textContent = "Este producto está agotado por ahora."; }
    info.appendChild(aviso);

    boton.addEventListener("click", function () {
      var r = Carrito.anadir(p.id, 1);
      aviso.textContent = "";
      if (r.enLimite) {
        aviso.appendChild(document.createTextNode("Ya tienes el máximo de unidades (" + Carrito.MAX_UNIDADES + ") de este producto. "));
      } else {
        aviso.appendChild(document.createTextNode("«" + p.nombre + "» añadido al carrito (" + r.cantidad + "). "));
      }
      var ver = crear("a", "", "Ver carrito");
      ver.href = "carrito.html";
      aviso.appendChild(ver);
    });

    ficha.appendChild(info);
  }

  if (!id) {
    mensaje("No hemos encontrado el producto que buscas.");
    return;
  }

  fetch("data/productos.json")
    .then(function (respuesta) {
      if (!respuesta.ok) { throw new Error("Error " + respuesta.status); }
      return respuesta.json();
    })
    .then(function (productos) {
      var p = productos.find(function (x) { return x.id === id; });
      if (p) { pintar(p); } else { mensaje("No hemos encontrado el producto que buscas."); }
    })
    .catch(function () {
      mensaje("No se ha podido cargar el producto. Si has abierto la página directamente desde la carpeta, ábrela con Live Server o desde la web publicada.");
    });
})();
