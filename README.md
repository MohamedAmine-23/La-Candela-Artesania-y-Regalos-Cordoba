# LaCandela - Artesania y regalos Córdoba · Tienda web de artesanía y regalos de Córdoba

Proyecto del módulo **Entornos de Desarrollo** · 1.º CFGS Desarrollo de Aplicaciones Web · IES Fidiana (Córdoba) · Curso 2026–2027

🌐 **Web publicada:** 

---

## ¿Qué es La Candela Online?

La Candela es una pequeña tienda física del centro de Córdoba especializada en regalos personalizados, cerámica artesanal, productos de marroquinería y recuerdos locales de alta calidad. Este proyecto es su tienda web: permite vender online a clientes de toda España y que los clientes locales hagan pedidos para recoger en la tienda.

- **¿Quién la utiliza?** Clientes de toda España, clientes locales que recogen en tienda y la dueña, que no tiene conocimientos técnicos.
- **¿Qué necesidad resuelve?** Que La Candela pueda empezar a vender online de forma sencilla.

## Equipo y roles Scrum

Trabajamos con la metodología **Scrum**. Los roles organizan el trabajo, pero todo el equipo participa en las decisiones.

| Integrante | Rol | Aportación principal |
|---|---|---|
| Nombre 1 | Product Owner | Representa a la dueña de la tienda, ordena el Product Backlog y aporta el contenido de ejemplo |
| Nombre 2 | Scrum Master | Facilita las reuniones y ayuda a quitar impedimentos |
| Nombre 3 | Desarrollador/a | Diseño y maquetación del catálogo |
| Nombre 4 | Desarrollador/a | Archivo de datos de productos y pruebas |
| Nombre 5 | Desarrollador/a | Filtros por categoría |
| Nombre 6 | Desarrollador/a | Ficha de detalle del producto |

## Funcionalidades previstas (Product Backlog)

Ordenadas de mayor a menor prioridad, según lo que pide la dueña de la tienda:

**Prioridad alta (imprescindibles)**
1. Catálogo de productos (foto, nombre, descripción corta, precio y disponibilidad)
2. Filtros por categoría (Cerámica, Cuero, Regalos personalizados, Novedades)
3. Ficha de detalle del producto
4. Carrito de compra
5. Proceso de pago (checkout) básico
6. Dos opciones de entrega: envío a domicilio o recogida gratuita en la tienda de Córdoba

**Prioridad media**

7. Buscador de productos
8. Panel de administración simple
9. Pago simulado (tarjeta o Bizum)

**Prioridad baja (futuras versiones)**

10. Reseñas y opiniones
11. Newsletter con 10 % de descuento en la primera compra
12. Lista de deseos

> El Product Backlog completo y la planificación de Sprints están en el libro de Excel del proyecto (`Practica2_Scrum_Artesania.xlsx`).

## Estado del proyecto

| Sprint | Duración | Objetivo | Estado |
|---|---|---|---|
| Sprint 1 | 3 semanas | Ver el catálogo con disponibilidad, filtrar por categoría y abrir la ficha de cada producto | 🔄 En curso |
| Sprint 2 | 3 semanas | Carrito, formulario de pedido y opciones de entrega | ⏳ Pendiente |
| Sprint 3 | 3 semanas | Buscador, panel de administración simple y pago simulado | ⏳ Pendiente |

## Tecnologías

- **HTML** y **CSS** para las páginas.
- **JavaScript** para la parte dinámica (catálogo, filtros, carrito…).
- Los datos de los productos se guardan en un archivo del proyecto (la web no tiene servidor propio).
- **GitHub** para el código y **GitHub Pages** para publicar la web.

## Estructura del repositorio

```
la-candela-web/
├── index.html          # Portada
├── catalogo.html       # Catálogo de productos
├── producto.html       # Ficha de detalle
├── css/
│   └── estilos.css     # Estilos de la web
├── js/                 # Código JavaScript
├── data/
│   └── productos.json  # Datos de los productos
├── img/                # Fotos de los productos
└── README.md
```

## Cómo ver la web en tu ordenador

1. Clona el repositorio:
   ```
   git clone https://github.com/TU-USUARIO/la-candela-web.git
   ```
2. Abre la carpeta del proyecto en tu editor (por ejemplo, VS Code).
3. Abre `index.html` en el navegador. Si el catálogo no carga los productos, usa la extensión *Live Server* de VS Code: algunos navegadores no permiten leer el archivo de datos al abrir la página directamente desde la carpeta.

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
