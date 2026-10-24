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

  function fechaCorta(iso) {
    var partes = String(iso || "").split("-");
    return partes.length === 3 ? partes[2] + "/" + partes[1] + "/" + partes[0] : "";
  }

  function hoy() { return new Date().toISOString().slice(0, 10); }

  // Sección de opiniones: lista de reseñas + formulario para escribir la tuya.
  function seccionResenas(p, todas, cabecera) {
    var caja = crear("section", "resenas");
    caja.setAttribute("aria-labelledby", "titulo-resenas");

    function pintar(aviso) {
      var mias = todas.filter(function (r) { return r.productoId === p.id; });
      var m = Resenas.media(mias);

      cabecera.textContent = "";
      cabecera.appendChild(Resenas.valoracion(m));

      caja.textContent = "";
      var titulo = crear("h2", "", "Opiniones");
      titulo.id = "titulo-resenas";
      titulo.tabIndex = -1;
      caja.appendChild(titulo);
      caja.appendChild(crear("p", "ayuda", "Las reseñas de esta web son de ejemplo, escritas para el proyecto de clase."));
      if (aviso) {
        var a = crear("p", "ficha-aviso", aviso);
        a.setAttribute("role", "status");
        caja.appendChild(a);
      }

      if (mias.length === 0) {
        caja.appendChild(crear("p", "", "Todavía no hay reseñas de este producto. ¡Escribe la primera!"));
      } else {
        var ul = crear("ul", "lista-resenas");
        mias.forEach(function (r) {
          var li = crear("li", "resena");
          var cab = crear("div", "resena-cabecera");
          cab.appendChild(crear("strong", "", r.autor));
          var est = crear("span", "valoracion");
          est.setAttribute("role", "img");
          est.setAttribute("aria-label", r.estrellas + " de 5 estrellas");
          est.appendChild(Resenas.estrellas(r.estrellas));
          cab.appendChild(est);
          if (r.fecha) { cab.appendChild(crear("span", "resena-fecha", fechaCorta(r.fecha))); }
          li.appendChild(cab);
          li.appendChild(crear("p", "", r.texto));
          if (r.local) { li.appendChild(crear("p", "resena-local", "Tu reseña (solo se guarda en este navegador).")); }
          ul.appendChild(li);
        });
        caja.appendChild(ul);
      }

      var form = crear("form", "formulario form-resena");
      form.innerHTML =
        '<h3>Escribe tu reseña</h3>' +
        '<div class="campo"><label for="resena-autor">Tu nombre</label>' +
        '<input id="resena-autor" name="autor" type="text" maxlength="40" required autocomplete="given-name"></div>' +
        '<fieldset class="estrellas-campo"><legend>Valoración</legend><div class="estrellas-opciones">' +
        [1, 2, 3, 4, 5].map(function (n) {
          return '<label><input type="radio" name="estrellas" value="' + n + '"' + (n === 1 ? ' required' : '') + '> ' + n + ' ★</label>';
        }).join("") +
        '</div></fieldset>' +
        '<div class="campo"><label for="resena-texto">Tu opinión</label>' +
        '<textarea id="resena-texto" name="texto" rows="4" minlength="10" maxlength="500" required></textarea></div>' +
        '<button class="boton" type="submit">Enviar reseña</button>' +
        '<p class="ayuda">Tu reseña se guardará solo en este navegador: la web no tiene servidor.</p>';
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var d = new FormData(form);
        var r = {
          productoId: p.id,
          autor: String(d.get("autor")).trim(),
          estrellas: parseInt(d.get("estrellas"), 10),
          texto: String(d.get("texto")).trim(),
          fecha: hoy(),
          local: true
        };
        Resenas.guardarLocal(r);
        todas.push(r);
        pintar("Gracias: tu reseña se ha guardado en este navegador.");
        document.getElementById("titulo-resenas").focus();
      });
      caja.appendChild(form);
    }

    pintar();
    return caja;
  }

  function pintarFicha(p, resenas) {
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

    var cabecera = crear("p", "ficha-valoracion");
    info.appendChild(cabecera);

    var datos = crear("div", "ficha-datos");
    datos.appendChild(crear("span", "precio precio-grande", formato.format(p.precio)));
    datos.appendChild(crear("span", p.disponible ? "estado" : "estado estado-agotado",
      p.disponible ? "Disponible" : "Agotado"));
    info.appendChild(datos);

    info.appendChild(crear("p", "ficha-descripcion", p.descripcion));

    var acciones = crear("div", "ficha-acciones");

    var boton = crear("button", "boton", p.disponible ? "Añadir al carrito" : "Agotado");
    boton.type = "button";
    boton.disabled = !p.disponible;
    acciones.appendChild(boton);

    var fav = crear("button", "boton boton-secundario");
    fav.type = "button";
    function pintarFav() {
      var activo = Favoritos.esFavorito(p.id);
      fav.textContent = activo ? "♥ En favoritos" : "♡ Añadir a favoritos";
      fav.setAttribute("aria-pressed", activo ? "true" : "false");
    }
    pintarFav();
    fav.addEventListener("click", function () { Favoritos.alternar(p.id); pintarFav(); });
    acciones.appendChild(fav);

    info.appendChild(acciones);

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
    ficha.appendChild(seccionResenas(p, resenas, cabecera));
  }

  if (!id) {
    mensaje("No hemos encontrado el producto que buscas.");
    return;
  }

  Promise.all([
    fetch("data/productos.json").then(function (respuesta) {
      if (!respuesta.ok) { throw new Error("Error " + respuesta.status); }
      return respuesta.json();
    }),
    Resenas.cargar()
  ])
    .then(function (r) {
      var p = r[0].find(function (x) { return x.id === id; });
      if (p) { pintarFicha(p, r[1]); } else { mensaje("No hemos encontrado el producto que buscas."); }
    })
    .catch(function () {
      mensaje("No se ha podido cargar el producto. Si has abierto la página directamente desde la carpeta, ábrela con Live Server o desde la web publicada.");
    });
})();
