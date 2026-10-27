// Panel de administración (prototipo).
// Los cambios se guardan en data/productos.json del repositorio de GitHub mediante la API de GitHub.
// El token de acceso NO está en el código: lo escribe quien administra al entrar y solo se mantiene
// mientras la pestaña esté abierta (sessionStorage).
(function () {
  "use strict";

  var PROPIETARIO = "mohamedamine-23";
  var REPOSITORIO = "La-Candela-Artesania-y-Regalos-Cordoba";
  var RAMA = "main";
  var RUTA = "data/productos.json";
  var CLAVE_TOKEN = "lacandela-admin-token";
  var CLAVE_PEDIDOS = "lacandela-pedidos";
  var URL_API = "https://api.github.com/repos/" + PROPIETARIO + "/" + REPOSITORIO + "/contents/" + RUTA;
  var RUTA_FOTO = /^img\/productos\/[A-Za-z0-9_.-]+\.(png|jpe?g|webp)$/i;

  var formato = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

  var token = "";
  var productos = [];
  var sha = "";
  var sinGuardar = false;

  var seccionAcceso = document.getElementById("acceso");
  var formAcceso = document.getElementById("form-acceso");
  var campoToken = document.getElementById("token");
  var errorAcceso = document.getElementById("acceso-error");
  var panel = document.getElementById("panel");
  var botonSalir = document.getElementById("boton-salir");
  var cuerpoProductos = document.getElementById("tabla-productos");
  var avisoProductos = document.getElementById("aviso-productos");
  var botonGuardar = document.getElementById("boton-guardar");
  var formNuevo = document.getElementById("form-nuevo");
  var avisoNuevo = document.getElementById("aviso-nuevo");
  var cuerpoPedidos = document.getElementById("tabla-pedidos");
  var vacioPedidos = document.getElementById("pedidos-vacio");
  var avisoPedidos = document.getElementById("aviso-pedidos");

  function crear(etiqueta, clase, texto) {
    var el = document.createElement(etiqueta);
    if (clase) { el.className = clase; }
    if (texto) { el.textContent = texto; }
    return el;
  }

  /* ---------- Comunicación con GitHub ---------- */
  function cabeceras() {
    return {
      "Authorization": "Bearer " + token,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    };
  }

  // Texto <-> base64 con tildes y eñes (UTF-8).
  function decodificar(base64) {
    var binario = atob(base64.replace(/\s/g, ""));
    var bytes = new Uint8Array(binario.length);
    for (var i = 0; i < binario.length; i++) { bytes[i] = binario.charCodeAt(i); }
    return new TextDecoder("utf-8").decode(bytes);
  }

  function codificar(texto) {
    var bytes = new TextEncoder().encode(texto);
    var binario = "";
    for (var i = 0; i < bytes.length; i++) { binario += String.fromCharCode(bytes[i]); }
    return btoa(binario);
  }

  function describirError(estado) {
    if (estado === 401) { return "El token no es válido o ha caducado."; }
    if (estado === 403) { return "El token no tiene permiso para esto (necesita «Contents: Read and write») o GitHub ha limitado las peticiones."; }
    if (estado === 404) { return "No se encuentra el repositorio o el archivo, o el token no tiene acceso a este repositorio."; }
    if (estado === 409 || estado === 422) { return "El archivo ha cambiado en GitHub mientras tanto. Cierra sesión, vuelve a entrar y repite los cambios."; }
    return "GitHub ha respondido con un error (" + estado + ").";
  }

  function mensajeError(e) {
    return e instanceof TypeError ? "No se ha podido conectar con GitHub. Comprueba tu conexión." : e.message;
  }

  function cargarProductos() {
    return fetch(URL_API + "?ref=" + encodeURIComponent(RAMA), { headers: cabeceras(), cache: "no-store" })
      .then(function (r) {
        if (!r.ok) { throw new Error(describirError(r.status)); }
        return r.json();
      })
      .then(function (archivo) {
        var datos = JSON.parse(decodificar(archivo.content));
        if (!Array.isArray(datos)) { throw new Error("El archivo de productos no tiene el formato esperado."); }
        productos = datos;
        sha = archivo.sha;
      });
  }

  function guardar() {
    botonGuardar.disabled = true;
    avisoProductos.textContent = "Guardando en GitHub…";

    var cab = cabeceras();
    cab["Content-Type"] = "application/json";
    var cuerpo = JSON.stringify({
      message: "Panel de administración: actualiza los productos",
      content: codificar(JSON.stringify(productos, null, 2) + "\n"),
      sha: sha,
      branch: RAMA
    });

    fetch(URL_API, { method: "PUT", headers: cab, body: cuerpo })
      .then(function (r) {
        if (!r.ok) { throw new Error(describirError(r.status)); }
        return r.json();
      })
      .then(function (res) {
        sha = res.content.sha;
        sinGuardar = false;
        avisoProductos.textContent = "Guardado en GitHub. La web se actualizará en uno o dos minutos; en los navegadores que ya la tenían abierta puede tardar algo más.";
      })
      .catch(function (e) {
        botonGuardar.disabled = false;
        avisoProductos.textContent = "No se ha podido guardar. " + mensajeError(e);
      });
  }

  /* ---------- Productos ---------- */
  function marcarCambios() {
    sinGuardar = true;
    botonGuardar.disabled = false;
    avisoProductos.textContent = "Hay cambios sin guardar.";
  }

  function pintarProductos() {
    cuerpoProductos.textContent = "";
    productos.forEach(function (p) {
      var fila = crear("tr");

      var celdaNombre = crear("td");
      var caja = crear("div", "admin-producto");
      if (p.imagen) {
        var img = crear("img", "admin-miniatura");
        img.src = p.imagen;
        img.alt = "";
        caja.appendChild(img);
      }
      var textos = crear("div");
      textos.appendChild(crear("strong", "", p.nombre));
      textos.appendChild(crear("div", "ayuda", p.categoria + " · id " + p.id));
      caja.appendChild(textos);
      celdaNombre.appendChild(caja);
      fila.appendChild(celdaNombre);

      var celdaPrecio = crear("td");
      var precio = crear("input");
      precio.type = "number";
      precio.min = "0";
      precio.step = "0.01";
      precio.value = String(p.precio);
      precio.setAttribute("aria-label", "Precio de " + p.nombre);
      precio.addEventListener("change", function () {
        var v = Number(precio.value);
        if (precio.value === "" || !isFinite(v) || v < 0) {
          precio.value = String(p.precio);
          avisoProductos.textContent = "El precio tiene que ser un número igual o mayor que 0.";
          return;
        }
        p.precio = Math.round(v * 100) / 100;
        precio.value = String(p.precio);
        marcarCambios();
      });
      celdaPrecio.appendChild(precio);
      fila.appendChild(celdaPrecio);

      var celdaEstado = crear("td");
      var estado = crear("select");
      estado.setAttribute("aria-label", "Estado de " + p.nombre);
      [["true", "Disponible"], ["false", "Agotado"]].forEach(function (o) {
        var opcion = crear("option", "", o[1]);
        opcion.value = o[0];
        estado.appendChild(opcion);
      });
      estado.value = p.disponible ? "true" : "false";
      estado.addEventListener("change", function () {
        p.disponible = estado.value === "true";
        marcarCambios();
      });
      celdaEstado.appendChild(estado);
      fila.appendChild(celdaEstado);

      var celdaAcciones = crear("td");
      var borrar = crear("button", "boton boton-peligro", "Borrar");
      borrar.type = "button";
      borrar.setAttribute("aria-label", "Borrar " + p.nombre);
      borrar.addEventListener("click", function () {
        if (!window.confirm("¿Borrar «" + p.nombre + "»? Se quitará de la tienda cuando guardes los cambios.")) { return; }
        productos = productos.filter(function (x) { return x.id !== p.id; });
        pintarProductos();
        marcarCambios();
        avisoProductos.textContent = "«" + p.nombre + "» borrado de la lista. Hay cambios sin guardar.";
      });
      celdaAcciones.appendChild(borrar);
      fila.appendChild(celdaAcciones);

      cuerpoProductos.appendChild(fila);
    });
  }

  formNuevo.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var d = new FormData(formNuevo);
    avisoNuevo.textContent = "";

    var precio = Number(String(d.get("precio")).replace(",", "."));
    if (!isFinite(precio) || precio < 0) {
      avisoNuevo.textContent = "El precio tiene que ser un número igual o mayor que 0.";
      return;
    }
    var fotos = ["foto1", "foto2", "foto3"]
      .map(function (c) { return String(d.get(c) || "").trim(); })
      .filter(Boolean);
    for (var i = 0; i < fotos.length; i++) {
      if (!RUTA_FOTO.test(fotos[i])) {
        avisoNuevo.textContent = "La ruta «" + fotos[i] + "» no es válida. Tiene que ser como img/productos/vela.png (png, jpg, jpeg o webp).";
        return;
      }
    }

    var id = productos.reduce(function (m, p) { return Math.max(m, p.id); }, 0) + 1;
    var nuevo = {
      id: id,
      nombre: String(d.get("nombre")).trim(),
      categoria: String(d.get("categoria")),
      descripcionCorta: String(d.get("descripcionCorta")).trim(),
      descripcion: String(d.get("descripcion")).trim(),
      precio: Math.round(precio * 100) / 100,
      disponible: d.get("disponible") === "on"
    };
    if (fotos.length) {
      nuevo.imagen = fotos[0];
      nuevo.imagenes = fotos;
    }
    productos.push(nuevo);
    pintarProductos();
    marcarCambios();
    formNuevo.reset();
    avisoNuevo.textContent = "«" + nuevo.nombre + "» añadido a la lista (id " + id + "). Pulsa «Guardar cambios en GitHub» para publicarlo.";
  });

  botonGuardar.addEventListener("click", guardar);

  window.addEventListener("beforeunload", function (ev) {
    if (sinGuardar) { ev.preventDefault(); ev.returnValue = ""; }
  });

  /* ---------- Pedidos (solo los de este navegador) ---------- */
  function leerPedidos() {
    try {
      var l = JSON.parse(window.localStorage.getItem(CLAVE_PEDIDOS));
      return Array.isArray(l) ? l : [];
    } catch (e) {
      return [];
    }
  }

  function guardarPedidos(lista) {
    try { window.localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(lista)); } catch (e) { /* sin almacenamiento */ }
  }

  function pintarPedidos() {
    var pedidos = leerPedidos().slice().reverse();   // los más recientes primero
    cuerpoPedidos.textContent = "";
    vacioPedidos.hidden = pedidos.length > 0;

    pedidos.forEach(function (p) {
      var fila = crear("tr");

      var c1 = crear("td");
      c1.appendChild(crear("strong", "", p.numero));
      c1.appendChild(crear("div", "ayuda", p.fecha ? new Date(p.fecha).toLocaleString("es-ES") : ""));
      fila.appendChild(c1);

      var c2 = crear("td");
      var cli = p.cliente || {};
      c2.appendChild(crear("div", "", cli.nombre || ""));
      c2.appendChild(crear("div", "ayuda", [cli.telefono, cli.email].filter(Boolean).join(" · ")));
      fila.appendChild(c2);

      var c3 = crear("td");
      (p.lineas || []).forEach(function (l) { c3.appendChild(crear("div", "", l.cantidad + " × " + l.nombre)); });
      fila.appendChild(c3);

      var c4 = crear("td");
      c4.appendChild(crear("div", "", p.entrega === "recogida" ? "Recogida en tienda" : "Envío a domicilio"));
      if (p.entrega !== "recogida" && cli.direccion) { c4.appendChild(crear("div", "ayuda", cli.direccion)); }
      fila.appendChild(c4);

      fila.appendChild(crear("td", "", formato.format(p.total || 0)));

      var c6 = crear("td");
      var estado = crear("select");
      estado.setAttribute("aria-label", "Estado del pedido " + p.numero);
      ["Pendiente", "Enviado"].forEach(function (e) {
        var o = crear("option", "", e);
        o.value = e;
        estado.appendChild(o);
      });
      estado.value = p.estado === "Enviado" ? "Enviado" : "Pendiente";
      estado.addEventListener("change", function () {
        var lista = leerPedidos();
        lista.forEach(function (x) { if (x.numero === p.numero) { x.estado = estado.value; } });
        guardarPedidos(lista);
        avisoPedidos.textContent = "Pedido " + p.numero + " marcado como " + estado.value.toLowerCase() + ".";
      });
      c6.appendChild(estado);
      fila.appendChild(c6);

      cuerpoPedidos.appendChild(fila);
    });
  }

  /* ---------- Acceso ---------- */
  function mostrarPanel() {
    seccionAcceso.hidden = true;
    panel.hidden = false;
    botonSalir.hidden = false;
    pintarProductos();
    pintarPedidos();
  }

  function entrar(t) {
    token = t;
    errorAcceso.textContent = "Comprobando el token…";
    return cargarProductos()
      .then(function () {
        try { window.sessionStorage.setItem(CLAVE_TOKEN, token); } catch (e) { /* no pasa nada */ }
        errorAcceso.textContent = "";
        campoToken.value = "";
        mostrarPanel();
      })
      .catch(function (e) {
        token = "";
        try { window.sessionStorage.removeItem(CLAVE_TOKEN); } catch (x) { /* no pasa nada */ }
        errorAcceso.textContent = mensajeError(e);
      });
  }

  formAcceso.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var t = campoToken.value.trim();
    if (t) { entrar(t); }
  });

  botonSalir.addEventListener("click", function () {
    if (sinGuardar && !window.confirm("Hay cambios sin guardar. ¿Cerrar sesión de todos modos?")) { return; }
    sinGuardar = false;
    token = "";
    productos = [];
    try { window.sessionStorage.removeItem(CLAVE_TOKEN); } catch (e) { /* no pasa nada */ }
    panel.hidden = true;
    botonSalir.hidden = true;
    seccionAcceso.hidden = false;
    errorAcceso.textContent = "Sesión cerrada.";
  });

  // Si la pestaña ya tenía una sesión abierta, entra directamente.
  var guardado = "";
  try { guardado = window.sessionStorage.getItem(CLAVE_TOKEN) || ""; } catch (e) { guardado = ""; }
  if (guardado) { entrar(guardado); }
})();
