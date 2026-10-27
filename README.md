# LaCandela Online · Tienda web de artesanía y regalos de Córdoba

Proyecto del módulo **Entornos de Desarrollo** · 1.º CFGS Desarrollo de Aplicaciones Web · IES Fidiana (Córdoba) · Curso 2026–2027

🌐 **Web publicada:** [https://mohamedamine-23.github.io/La-Candela-Artesania-y-Regalos-Cordoba/](https://mohamedamine-23.github.io/La-Candela-Artesania-y-Regalos-Cordoba/)

---

## ¿Qué es LaCandela Online?

**LaCandela - Artesania y regalos Córdoba** es una pequeña tienda física del centro de Córdoba especializada en regalos personalizados, cerámica artesanal, productos de marroquinería y recuerdos locales de alta calidad. Este proyecto es su tienda web: permite vender online a clientes de toda España y que los clientes locales hagan pedidos para recoger en la tienda.

- **¿Quién la utiliza?** Clientes de toda España, clientes locales que recogen en tienda y la dueña, que no tiene conocimientos técnicos.
- **¿Qué necesidad resuelve?** Que LaCandela pueda empezar a vender online de forma sencilla.

> ⚠️ **Es un prototipo de clase.** La web no tiene servidor: no se cobra nada y los pedidos no llegan a ninguna tienda real. Ver [Limitaciones del prototipo](#limitaciones-del-prototipo).

## Equipo y roles Scrum

Trabajamos con la metodología **Scrum**. Los roles organizan el trabajo, pero todo el equipo participa en las decisiones.

| Integrante | Rol | Aportación principal |
|---|---|---|
| Juan Rosa | Product Owner | Representa a la dueña de la tienda, ordena el Product Backlog y aporta el contenido de ejemplo |
| Ángel Castro | Scrum Master | Facilita las reuniones y ayuda a quitar impedimentos |
| Mohamed Amine El Harchal | Desarrollador/a | Hacer la pagina y preparar el github |
| Eduardo Ibarra | Desarrollador/a | Hacer la pagina |
| Adrián Rodríguez | Desarrollador/a | Obtener productos y sus imagenes |
| Olga Lara | Desarrollador/a | Obtener productos y sus imagenes |

## Requisitos de la clienta y estado

La dueña de la tienda no tiene conocimientos técnicos: vende en su tienda física, pero quiere empezar a vender online a toda España y permitir que los clientes locales hagan pedidos para recoger en tienda. Estos son sus requisitos, de mayor a menor prioridad, y cómo van.

### Prioridad alta · imprescindibles para abrir la tienda online

| # | Requisito | Estado |
|---|---|---|
| 1 | **Catálogo de productos:** listado con foto, nombre, descripción corta, precio y si hay stock disponible | ✅ Hecho |
| 2 | **Filtros por categoría:** Cerámica, Cuero, Regalos Personalizados, Novedades | ✅ Hecho |
| 3 | **Ficha de detalle:** fotos más grandes (3 por producto), descripción completa y botón «Añadir al carrito» | ✅ Hecho |
| 4 | **Carrito de compra:** productos añadidos, cantidades, subtotal y coste de envío | ✅ Hecho |
| 5 | **Proceso de pago (checkout) básico:** datos del cliente (nombre, dirección, teléfono y email) y método de pago | ✅ Hecho |
| 6 | **Dos opciones de entrega:** envío a domicilio por mensajería o recogida gratuita en la tienda de Córdoba | ✅ Hecho |

### Prioridad media · mejoran la experiencia

| # | Requisito | Estado |
|---|---|---|
| 7 | **Buscador de productos:** barra de búsqueda en la cabecera por palabra clave | ✅ Hecho |
| 8 | **Panel de administración simple:** añadir productos, cambiar precios y marcar pedidos como «Enviados» | ⏳ Pendiente |
| 9 | **Pago simulado:** simulación de pago con tarjeta o Bizum | ⏳ Pendiente (ahora solo se elige el método de pago) |

### Prioridad baja · futuras versiones

| # | Requisito | Estado |
|---|---|---|
| 10 | **Reseñas y opiniones:** estrellas y comentarios en los productos | ✅ Hecho (con limitaciones, ver más abajo) |
| 11 | **Newsletter:** cajetín de email y 10 % de descuento en la primera compra | 🔶 Parcial: hay descuento automático del 10 % en la primera compra, pero no el cajetín de email |
| 12 | **Lista de deseos (wishlist):** guardar productos favoritos | ✅ Hecho |

> El Product Backlog completo y la planificación de Sprints están en el libro de Excel del proyecto (`Practica2_Scrum_Artesania.xlsx`).

## Cómo funciona la tienda

- **Envío:** el envío a domicilio cuesta 4,95 € (tarifa de ejemplo) y es **gratis a partir de 3 unidades** en el carrito. La recogida en la tienda de Córdoba es siempre gratuita.
- **Descuento de bienvenida:** 10 % sobre el subtotal en la primera compra. Se detecta si el navegador no tiene ningún pedido guardado.
- **Buscador:** busca por nombre, descripción y categoría, sin distinguir tildes ni mayúsculas, y se combina con el filtro por categoría.
- **Favoritos:** el corazón de cada producto guarda el favorito; la página «Favoritos» los muestra todos.
- **Reseñas:** cada producto muestra la media de estrellas y sus opiniones. Cualquier visitante puede escribir la suya con un formulario.
- **Pedido:** al confirmar, la web muestra un número de pedido de prueba y guarda el pedido en el navegador.

## Tecnologías

- **HTML** y **CSS** para las páginas.
- **JavaScript** para la parte dinámica (catálogo, filtros, buscador, carrito, favoritos, reseñas…).
- **JSON** para los datos de productos y reseñas (la web no tiene servidor propio).
- **localStorage** del navegador para el carrito, los favoritos, los pedidos y las reseñas de cada visitante.
- **GitHub** para el código y **GitHub Pages** para publicar la web.

## Estructura del repositorio

```
La-Candela-Artesania-y-Regalos-Cordoba/
├── index.html            # Portada
├── catalogo.html         # Catálogo, filtros y buscador
├── producto.html         # Ficha de detalle y reseñas
├── carrito.html          # Carrito y opciones de entrega
├── checkout.html         # Finalizar pedido
├── favoritos.html        # Lista de deseos
├── css/
│   └── estilos.css       # Estilos de toda la web
├── js/
│   ├── carrito.js        # Carrito, envío y descuento (compartido)
│   ├── tienda.js         # Favoritos, reseñas, búsqueda y tarjetas (compartido)
│   ├── portada.js        # Novedades de la portada
│   ├── catalogo.js       # Catálogo, filtros y buscador
│   ├── producto.js       # Ficha de producto y reseñas
│   ├── carrito-pagina.js # Página del carrito
│   ├── checkout.js       # Finalizar pedido
│   └── favoritos-pagina.js # Página de favoritos
├── data/
│   ├── productos.json    # Datos de los productos
│   └── resenas.json      # Reseñas de ejemplo
├── img/
│   ├── icono.svg         # Icono de la tienda
│   └── productos/        # Fotos de los productos (3 por producto)
└── README.md
```

## Cómo añadir o cambiar productos

1. **Fotos:** súbelas a `img/productos/`. Usa nombres en minúsculas, sin espacios ni tildes (por ejemplo, `vela.png`, `vela2.png`, `vela3.png`).
2. **Datos:** edita `data/productos.json` y añade o modifica el producto con estos campos: `id`, `nombre`, `categoria`, `descripcionCorta`, `descripcion`, `precio`, `disponible` (`true` o `false`), `imagen` (foto principal) e `imagenes` (lista de hasta 3 fotos).
3. **Reseñas de ejemplo:** se editan en `data/resenas.json`.

Los nombres de las fotos del JSON tienen que coincidir letra por letra con los archivos de `img/productos/`. Si un producto sale con la imagen rota, casi siempre es una diferencia de nombre o de extensión (`.png` o `.jpg`).

## Limitaciones del prototipo

Como la web se publica en GitHub Pages, no tiene servidor ni base de datos:

- **No se cobra nada** y los **pedidos no llegan a la tienda**: solo se guardan en el navegador de quien los hace.
- **El descuento de primera compra** se calcula con los pedidos guardados en el navegador, así que no puede saber si el cliente ya compró desde otro dispositivo.
- **Las reseñas:** las de `data/resenas.json` son de ejemplo y las ven todos los visitantes. Las que escribe cada visitante se guardan solo en su navegador y solo las ve esa persona.
- **Favoritos y carrito** también son personales de cada navegador.
- **El panel de administración** está pendiente y, sin servidor, solo podría funcionar como simulación.

## Cómo ver la web en tu ordenador

1. Clona el repositorio:
   ```
   git clone https://github.com/mohamedamine-23/La-Candela-Artesania-y-Regalos-Cordoba.git
   ```
2. Abre la carpeta del proyecto en tu editor (por ejemplo, VS Code).
3. Abre la web con la extensión *Live Server* de VS Code. Si abres `index.html` haciendo doble clic, el navegador no permite leer los archivos de datos y el catálogo no cargará los productos.

## Cómo trabajamos en equipo

1. **Antes de empezar:** haz *pull* para tener la última versión.
2. **Una rama por tarea:** crea una rama con un nombre claro (por ejemplo, `catalogo-maqueta`).
3. **Commits pequeños y claros:** por ejemplo, `Maqueta del catálogo`.
4. **Pull Request:** al terminar, abre un Pull Request hacia `main`.
5. **Revisión:** otra persona del equipo prueba el cambio y lo aprueba. Una tarea solo se considera **completada** cuando funciona y otra persona la ha probado.
6. **Estado de las tareas:** cada responsable actualiza el estado en el Excel a diario.

## Reuniones Scrum

- **Planificación del Sprint:** al empezar cada Sprint.
- **Reunión diaria:** máximo 15 minutos (qué hice, qué haré, qué problemas tengo).
- **Revisión del Sprint:** al terminar, se enseña el resultado al Product Owner.
- **Retrospectiva:** el equipo acuerda cómo mejorar en el siguiente Sprint.

---

*Proyecto con fines educativos.*
