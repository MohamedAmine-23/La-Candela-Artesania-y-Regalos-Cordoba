// Funciones compartidas de la tienda: favoritos, reseñas, búsqueda y tarjetas de producto.
// Necesita que js/carrito.js se cargue antes.
(function () {
  "use strict";

  var crear = Carrito.crear;
  var formato = Carrito.formatoPrecio;

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

  /* ---------------- Favoritos (lista de deseos) ---------------- */
  var CLAVE_FAV = "lacandela-favoritos";

  function listaFavoritos() {
    var l = leer(CLAVE_FAV, []);
    return Array.isArray(l) ? l.filter(function (x) { return Number.isInteger(x); }) : [];
  }

  function actualizarContadorFavoritos() {
    var contador = document.getElementById("favoritos-contador");
    var enlace = document.getElementById("enlace-favoritos");
    if (!contador || !enlace) { return; }
    var n = listaFavoritos().length;
    contador.textContent = String(n);
    contador.hidden = n === 0;
    enlace.setAttribute("aria-label", n === 0 ? "Favoritos" : "Favoritos, " + n + (n === 1 ? " producto" : " productos"));
  }

  var Favoritos = {
    lista: listaFavoritos,
    esFavorito: function (id) { return listaFavoritos().indexOf(id) !== -1; },
    // Añade o quita el producto. Devuelve true si ahora es favorito.
    alternar: function (id) {
      var l = listaFavoritos();
      var i = l.indexOf(id);
      if (i === -1) { l.push(id); } else { l.splice(i, 1); }
      escribir(CLAVE_FAV, l);
      actualizarContadorFavoritos();
      window.dispatchEvent(new CustomEvent("favoritos:cambio"));
      return i === -1;
    }
  };

  /* ---------------- Reseñas y estrellas ---------------- */
  var CLAVE_RES = "lacandela-resenas";

  function resenasLocales() {
    var l = leer(CLAVE_RES, []);
    return Array.isArray(l) ? l : [];
  }

  // Media de estrellas de una lista de reseñas.
  function media(lista) {
    if (!lista.length) { return { media: 0, total: 0 }; }
    var suma = lista.reduce(function (t, r) { return t + r.estrellas; }, 0);
    return { media: suma / lista.length, total: lista.length };
  }

  // Devuelve { idProducto: { media, total } } para todas las reseñas.
  function resumir(lista) {
    var porProducto = {};
    lista.forEach(function (r) {
      (porProducto[r.productoId] = porProducto[r.productoId] || []).push(r);
    });
    var resumen = {};
    Object.keys(porProducto).forEach(function (id) { resumen[id] = media(porProducto[id]); });
    return resumen;
  }

  function textoMedia(m) { return m.toFixed(1).replace(".", ","); }

  // ★★★★☆ (solo decoración: el texto accesible va en el contenedor)
  function estrellas(valor) {
    var r = Math.max(0, Math.min(5, Math.round(valor)));
    var s = crear("span", "estrellas-iconos", "★★★★★".slice(0, r) + "☆☆☆☆☆".slice(0, 5 - r));
    s.setAttribute("aria-hidden", "true");
    return s;
  }

  // Estrellas + media + número de reseñas.
  function valoracion(m) {
    var caja = crear("span", "valoracion");
    if (!m || m.total === 0) {
      caja.textContent = "Sin reseñas todavía";
      return caja;
    }
    caja.setAttribute("role", "img");
    caja.setAttribute("aria-label", "Valoración " + textoMedia(m.media) + " de 5, " + m.total + (m.total === 1 ? " reseña" : " reseñas"));
    caja.appendChild(estrellas(m.media));
    caja.appendChild(document.createTextNode(" " + textoMedia(m.media) + " (" + m.total + ")"));
    return caja;
  }

  // Reseñas del archivo data/resenas.json + las que ha escrito el visitante en este navegador.
  function cargarResenas() {
    return fetch("data/resenas.json")
      .then(function (r) {
        if (!r.ok) { throw new Error("Error " + r.status); }
        return r.json();
      })
      .catch(function () { return []; })
      .then(function (base) { return (Array.isArray(base) ? base : []).concat(resenasLocales()); });
  }

  function guardarResena(resena) {
    var l = resenasLocales();
    l.push(resena);
    escribir(CLAVE_RES, l);
  }

  var Resenas = {
    cargar: cargarResenas,
    guardarLocal: guardarResena,
    media: media,
    resumir: resumir,
    estrellas: estrellas,
    valoracion: valoracion,
    textoMedia: textoMedia
  };

  /* ---------------- Búsqueda ---------------- */
  // Quita tildes y mayúsculas para comparar: "Cerámica" == "ceramica".
  function normalizar(texto) {
    return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Devuelve los productos que contienen TODAS las palabras buscadas (en nombre, descripciones o categoría).
  function filtrar(productos, consulta) {
    var terminos = normalizar(consulta).split(/\s+/).filter(Boolean);
    if (terminos.length === 0) { return productos; }
    return productos.filter(function (p) {
      var texto = normalizar([p.nombre, p.descripcionCorta, p.descripcion, p.categoria].join(" "));
      return terminos.every(function (t) { return texto.indexOf(t) !== -1; });
    });
  }

  var Buscar = { filtrar: filtrar, normalizar: normalizar };

  /* ---------------- Tarjetas de producto ---------------- */
  function pintarCorazon(boton, activo) {
    boton.textContent = activo ? "♥" : "♡";
    boton.setAttribute("aria-pressed", activo ? "true" : "false");
    boton.classList.toggle("activo", activo);
  }

  function botonCorazon(p) {
    var b = crear("button", "corazon");
    b.type = "button";
    b.setAttribute("aria-label", "Favorito: " + p.nombre);
    pintarCorazon(b, Favoritos.esFavorito(p.id));
    b.addEventListener("click", function () { pintarCorazon(b, Favoritos.alternar(p.id)); });
    return b;
  }

  function crearTarjeta(p, resumen) {
    var li = crear("li", p.disponible ? "producto" : "producto producto-agotado");

    var imagen = crear("div", "producto-imagen");
    if (p.imagen) {
      var img = crear("img", "producto-foto");
      img.src = p.imagen;
      img.alt = p.nombre;
      img.loading = "lazy";
      imagen.appendChild(img);
    } else {
      var foto = crear("div", "foto-provisional", "Foto provisional");
      foto.setAttribute("role", "img");
      foto.setAttribute("aria-label", "Foto de " + p.nombre + " pendiente");
      imagen.appendChild(foto);
    }
    imagen.appendChild(botonCorazon(p));
    li.appendChild(imagen);

    var cuerpo = crear("div", "producto-cuerpo");
    cuerpo.appendChild(crear("h3", "", p.nombre));
    var val = crear("p", "producto-valoracion");
    val.appendChild(valoracion(resumen));
    cuerpo.appendChild(val);
    cuerpo.appendChild(crear("p", "producto-desc", p.descripcionCorta));

    var datos = crear("div", "producto-datos");
    datos.appendChild(crear("span", "precio", formato.format(p.precio)));
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

  var Tarjetas = { crear: crearTarjeta, pintarCorazon: pintarCorazon };

  window.Favoritos = Favoritos;
  window.Resenas = Resenas;
  window.Buscar = Buscar;
  window.Tarjetas = Tarjetas;

  actualizarContadorFavoritos();
  window.addEventListener("storage", function (ev) {
    if (ev.key === CLAVE_FAV) { actualizarContadorFavoritos(); }
  });
})();
