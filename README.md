# ArteLocal · Tienda web de artesanía local

Proyecto del módulo **Entornos de Desarrollo** · 1.º CFGS Desarrollo de Aplicaciones Web · IES Fidiana (Córdoba) · Curso 2026–2027

🌐 **Web publicada:** 

---

## ¿Qué es LaCandela - Artesania y regalos Córdoba?

LaCandela es una tienda web pensada para un pequeño comercio de artesanía local. Permite que los clientes conozcan las piezas del taller (cerámica, cuero, joyería…) y que la tienda pueda mostrar su catálogo por internet.

- **¿Quién la utiliza?** Clientes que quieren comprar artesanía local y la persona responsable de la tienda.
- **¿Qué necesidad resuelve?** Que un comercio pequeño pueda vender sus piezas online sin necesitar conocimientos técnicos.

## Equipo y roles Scrum

Trabajamos con la metodología **Scrum**. Los roles organizan el trabajo, pero todo el equipo participa en las decisiones.

| Integrante | Rol | Aportación principal |
|---|---|---|
| Nombre 1 | Product Owner | Representa a la tienda, ordena el Product Backlog y aporta el contenido de ejemplo |
| Nombre 2 | Scrum Master | Facilita las reuniones y ayuda a quitar impedimentos |
| Nombre 3 | Desarrollador/a | Diseño y maquetación del catálogo y la ficha |
| Nombre 4 | Desarrollador/a | Datos de productos |
| Nombre 5 | Desarrollador/a | Gestión de productos |
| Nombre 6 | Desarrollador/a | Ficha de producto, enlaces y pruebas |

## Funcionalidades previstas (Product Backlog)

Ordenadas de mayor a menor prioridad:

1. Catálogo de productos
2. Ficha de producto
3. Gestión de productos
4. Carrito de compra
5. Filtrar por categoría
6. Registro e inicio de sesión
7. Finalizar pedido
8. Gestión de pedidos
9. Quiénes somos y contacto
10. Adaptación al móvil

> El Product Backlog completo y la planificación de Sprints están en el libro de Excel del proyecto (`Practica2_Scrum_Artesania.xlsx`).

## Estado del proyecto

| Sprint | Duración | Objetivo | Estado |
|---|---|---|---|
| Sprint 1 | 3 semanas | Ver el catálogo y la ficha de cada producto, y gestionar los productos | 🔄 En curso |
| Sprint 2 | 3 semanas | Registro, filtros por categoría y carrito | ⏳ Pendiente |
| Sprint 3 | 3 semanas | Finalizar pedido, gestión de pedidos y contacto | ⏳ Pendiente |

## Tecnologías

- **HTML** y **CSS** para las páginas.
- **JavaScript** para la parte dinámica (catálogo, carrito…).
- **GitHub** para el código y **GitHub Pages** para publicar la web.

## Estructura del repositorio

```
artelocal-web/
├── index.html          # Portada
├── catalogo.html       # Catálogo de productos
├── producto.html       # Ficha de producto
├── css/
│   └── estilos.css     # Estilos de la web
├── js/                 # Código JavaScript
├── img/                # Fotos de los productos
└── README.md
```

## Cómo ver la web en tu ordenador

1. Clona el repositorio:
   ```
   git clone https://github.com/TU-USUARIO/artelocal-web.git
   ```
2. Abre la carpeta del proyecto en tu editor (por ejemplo, VS Code).
3. Abre `index.html` en el navegador.

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
