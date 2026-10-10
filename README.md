<p align="center">
  <img src="assets/img/icon-192.png" width="96" height="96" alt="Nativé · Bienestar natural">
</p>

<h1 align="center">Nativé Pedidos</h1>

<p align="center">
  Plataforma de registro de pedidos de <strong>Nativé · Bienestar natural</strong>.<br>
  Toma pedidos en segundos, controla el despacho y lleva la cuenta de lo que falta cobrar.
</p>

---

## Qué hace

| Sección | Para qué sirve |
| --- | --- |
| **Nuevo pedido** | Registro rápido: el cliente se reconoce por su celular, los productos se agregan con un toque desde el catálogo y la nota de pedido calcula subtotal, envío, descuento y total al instante. |
| **Pedidos** | Libro de pedidos por día con ventas del periodo, monto por cobrar y pedidos por despachar. Cada pedido avanza por *Nuevo → Empacado → En ruta / En agencia / Listo para recojo → Entregado*. |
| **Catálogo** | Productos con presentación, precio, unidades vendidas en los últimos 30 días y un interruptor para pausarlos. |

También incluye:

- Entrega por **delivery en Lima y Callao**, **envío a provincia** por agencia (Shalom, Olva Courier, Marvisur, Cruz del Sur Cargo, Flores Cargo) o **recojo en tienda**.
- Pagos con **Yape, Plin, transferencia, efectivo o tarjeta**, como pagado, adelanto o contra entrega, con N° de operación y registro del cobro del saldo.
- **Resumen para WhatsApp** listo para copiar o enviar directo al cliente.
- **Exportación a CSV** para Excel o Google Sheets.
- **Respaldo y restauración** de toda la información en un archivo `.json`.
- Modo claro y oscuro automático, diseño adaptado a celular y atajos de teclado.

## Publicarlo en GitHub Pages

1. Crea un repositorio en GitHub, por ejemplo `native-pedidos`. Con una cuenta gratuita debe ser **público** para usar GitHub Pages.
2. Sube **todo el contenido de esta carpeta** a la raíz del repositorio (botón *Add file → Upload files*, o con GitHub Desktop). Incluye los archivos ocultos `.nojekyll` y `.gitignore`.
3. En el repositorio entra a **Settings → Pages**.
4. En *Build and deployment*, elige **Source: Deploy from a branch**, rama **`main`** y carpeta **`/ (root)`**. Pulsa **Save**.
5. En unos minutos la página estará en:

   ```
   https://TU-USUARIO.github.io/native-pedidos/
   ```

Cada vez que subas un cambio a `main`, GitHub vuelve a publicar la página automáticamente.

### Dominio propio (opcional)

Si más adelante compras un dominio (por ejemplo `pedidos.tumarca.pe`), escríbelo en **Settings → Pages → Custom domain** y crea en tu proveedor de dominio el registro DNS que GitHub te indique.

## Dónde se guardan los datos

> [!IMPORTANT]
> En GitHub Pages los pedidos y el catálogo se guardan **en el navegador del dispositivo donde los registras** (almacenamiento local). No viajan a ningún servidor.

Esto significa que:

- Cada computadora o celular tiene su propia información. Lo que registras en la laptop no aparece en el celular.
- Si borras los datos de navegación o usas una ventana privada, la información de ese navegador se pierde.
- En iPhone, la página abierta en Safari y la instalada en la pantalla de inicio guardan datos por separado. Usa siempre el mismo acceso.

Para protegerte, en la sección **Pedidos** encontrarás el panel **Respaldo**:

- **Descargar respaldo** guarda un archivo `respaldo-native-AAAA-MM-DD.json` con todos tus pedidos y productos. Hazlo al cerrar cada día.
- **Restaurar desde archivo** recupera esa información en cualquier navegador. Si un pedido ya existe, se conserva la versión más reciente.

Cuando el negocio necesite que varias personas vean los mismos pedidos en tiempo real, el siguiente paso es conectar una base de datos en la nube (por ejemplo Supabase o Firebase).

## Uso diario

| Atajo | Acción |
| --- | --- |
| <kbd>/</kbd> | Ir a buscar un producto |
| <kbd>Enter</kbd> en el buscador | Agregar el primer producto que coincide |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Registrar el pedido |
| <kbd>Esc</kbd> | Cerrar el detalle de un pedido |

**Primer uso:** el catálogo empieza vacío. Agrega tus productos en **Catálogo**, o pulsa **Cargar ejemplos** para probar la plataforma con datos de muestra y luego bórralos con **Borrar ejemplos**.

**Instalar en el celular:** abre la página en el navegador y elige *Agregar a pantalla de inicio*. Se abrirá como una app, con el logo de Nativé.

## Estructura del proyecto

```
.
├── index.html                 Página principal
├── manifest.webmanifest       Datos para instalar la página como app
├── robots.txt                 Bloquea buscadores cuando usas dominio propio
├── .nojekyll                  Publica los archivos tal cual, sin procesarlos
├── .gitignore
├── LICENSE
├── README.md
└── assets/
    ├── css/styles.css         Estilos, colores y tipografías
    ├── js/app.js              Lógica de la plataforma
    ├── js/ejemplos.js         Datos de muestra para «Cargar ejemplos»
    └── img/                   Logo, favicon e íconos de la app
```

No necesita instalación, compilación ni servidor propio: son archivos estáticos.

## Personalizar

- **Colores:** están definidos como variables al inicio de `assets/css/styles.css` (`--forest`, `--leaf`, etc.), con una versión para modo claro y otra para modo oscuro.
- **Distritos, ciudades, agencias, métodos de pago y horarios:** listas al inicio de `assets/js/app.js` (`LIMA`, `DEPS`, `AGENCIAS`, `METODOS`, `FRANJAS`).
- **Productos y precios:** se manejan desde la sección **Catálogo**, sin tocar código.

## Probarlo en tu computadora

Basta con abrir `index.html` con doble clic. Si prefieres simular el hosting, desde esta carpeta ejecuta:

```bash
python -m http.server 8000
```

y abre `http://localhost:8000`.

## Privacidad

La página incluye la etiqueta `noindex` para que Google no la muestre en resultados de búsqueda (el `robots.txt` solo surte efecto si usas un dominio propio). Aun así, cualquier persona con el enlace puede abrirla. Como los datos viven en cada navegador, quien la abra desde otro dispositivo solo verá una plataforma vacía.

## Licencia

El código se distribuye bajo la licencia [MIT](LICENSE). El nombre **Nativé**, el logotipo y la identidad visual de la marca no están incluidos en esa licencia y no pueden reutilizarse sin autorización.
