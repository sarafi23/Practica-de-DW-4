# myPC — Tienda de Componentes de PC

Proyecto de la **Unidad 4: Pruebas, seguridad y despliegue**.
Implementa un CRUD completo en MongoDB con Mongoose, autenticación con JWT y OAuth de Google, carrito de compras con control de stock, y despliegue en producción (Frontend en Vercel + Backend en Render).

---

## 📋 Contenido de la asignación cumplido

| Sesión | Tema | Estado |
|--------|------|:------:|
| 1 | CRUD en MongoDB (modelo, endpoints, Postman) | ✅ |
| 2 | Autenticación JWT (login, middleware de protección) | ✅ |
| 3 | OAuth con Google + Despliegue (Vercel + Render) | ✅ |

---

## ✨ Características

- 🔐 **Autenticación**: registro, login con validación en tiempo real y OAuth de Google.
- 🛒 **Carrito**: gestión en `localStorage`, control de stock dinámico y checkout con dirección de envío.
- 🛍️ **Catálogo**: listado de productos, filtros por categoría/marca y página de detalle con productos relacionados.
- 👤 **Perfil**: edición de datos, subida de avatar (Multer) y estadísticas de compra (total gastado, compras, categoría y marca favorita).
- 🛠️ **Panel admin**: CRUD de usuarios y de productos (solo rol `admin`).
- 🎨 **UI moderna**: glassmorphism en login, fondo de PC gamer, partículas interactivas con el mouse y diseño responsivo.

---

## 🗂️ Estructura del proyecto

```
DW Practica4/
├── backend/
│   ├── config/db.js          # Conexión a MongoDB
│   ├── models/
│   │   ├── User.js           # Usuario (auth, perfil, compras)
│   │   └── Producto.js       # Producto (catálogo, stock)
│   ├── routes/
│   │   ├── auth.js           # Registro, login, perfil, avatar, stats, Google
│   │   ├── users.js          # CRUD de usuarios (admin)
│   │   ├── productos.js      # CRUD de productos
│   │   └── compras.js        # Checkout / compras
│   ├── middleware/
│   │   ├── auth.js           # Verifica token JWT
│   │   ├── passport.js       # Estrategia Google
│   │   └── upload.js         # Subida de avatar (Multer)
│   ├── seed.js               # Datos de prueba
│   ├── server.js             # Punto de entrada (sirve el frontend)
│   ├── .env                  # Variables de entorno (no se sube a Git)
│   └── package.json
├── frontend/
│   ├── index.html            # Login / Registro (glassmorphism + partículas)
│   ├── tienda.html           # Catálogo de productos
│   ├── producto.html         # Detalle de producto
│   ├── carrito.html          # Carrito + checkout
│   ├── perfil.html           # Perfil, avatar, stats, panel admin
│   ├── admin.html            # Acceso directo al panel (redirige a perfil)
│   ├── dashboard.html        # (legacy) panel básico
│   ├── css/style.css         # Estilos
│   ├── js/                   # Lógica del frontend
│   └── vercel.json           # Rewrites de /api y /uploads a Render
└── README.md
```

---

## 🚀 Instalación y ejecución en LOCAL

### 1. Requisitos
- Node.js >= 18
- Cuenta de MongoDB Atlas (o MongoDB local)
- Cuenta de Google Cloud Console (para OAuth)

### 2. Clonar el repositorio
```bash
git clone https://github.com/sarafi23/Practica-de-DW-4.git
cd "DW Practica4"
```

### 3. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 4. Configurar variables de entorno
Creá un archivo **`backend/.env`** con este contenido (ajustá los valores a los tuyos):

```env
PORT=5000
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@cluster0.3etvmtr.mongodb.net/practica4?retryWrites=true&w=majority
JWT_SECRET=una_clave_secreta_segura
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5000
```

> ⚠️ **Nota sobre redes locales**: algunos ISPs/routers bloquean el descubrimiento del replicaSet de Atlas (DNS SRV). Si al correr el proyecto obtenés `Server selection timed out`, cambiá la `MONGODB_URI` por la conexión **directa a un shard**:
> ```env
> MONGODB_URI=mongodb://USUARIO:PASSWORD@ac-gppbbg3-shard-00-00.3etvmtr.mongodb.net:27017/practica4?directConnection=true&ssl=true&authSource=admin&retryWrites=true&w=majority
> ```
> En servicios en la nube (Render) esto no es necesario; usá la URI normal con `mongodb+srv://`.

### 5. Poblar la base de datos (opcional)
```bash
node seed.js
```
Crea 12 productos y 2 usuarios de prueba:
- **Administrador**: `admin@mypc.com` / `admin123`
- **Cliente demo**: `demo@test.com` / `123456` (con historial de compras cargado)

### 6. Ejecutar
```bash
npm run dev      # desarrollo (con nodemon, se reinicia solo)
# o
npm start        # producción
```
Abrí el navegador en **http://localhost:5000**. El backend sirve el frontend automáticamente.

---

## 🌐 Despliegue en PRODUCCIÓN

### Backend — Render
1. Subí el repo a GitHub.
2. En [Render](https://render.com) creá un **Web Service**, conectá el repo y poné **Root Directory = `backend`**.
3. Build: `npm install` · Start: `npm start`.
4. Variables de entorno en Render:
   | Variable | Valor |
   |---|---|
   | `MONGODB_URI` | URI de Atlas (`mongodb+srv://...`) |
   | `JWT_SECRET` | clave secreta |
   | `GOOGLE_CLIENT_ID` | ID de OAuth |
   | `GOOGLE_CLIENT_SECRET` | Secret de OAuth |
   | `GOOGLE_CALLBACK_URL` | `https://TU-BACKEND.onrender.com/api/auth/google/callback` |
   | `FRONTEND_URL` | `https://TU-FRONTEND.vercel.app` |

### Frontend — Vercel
1. En [Vercel](https://vercel.com) importá el repo.
2. **Root Directory = `frontend`**, sin comando de build (sitio estático).
3. El archivo `frontend/vercel.json` ya redirige `/api/*` y `/uploads/*` al backend de Render (rewrites), por lo que **no hace falta cambiar ninguna URL en el código del frontend**.
4. Desplegá. Tu web queda en `https://TU-FRONTEND.vercel.app`.

> 💡 Con los rewrites de Vercel no hay problemas de CORS y el frontend sigue usando rutas relativas (`/api/...`).

### Configuración de Google OAuth (importante)
En [Google Cloud Console → Credentials → OAuth Client ID](https://console.cloud.google.com/apis/credentials) agregá:
- **Orígenes de JavaScript autorizados**:
  - `http://localhost:5000`
  - `https://TU-FRONTEND.vercel.app`
- **URI de redirección autorizados**:
  - `http://localhost:5000/api/auth/google/callback`
  - `https://TU-FRONTEND.vercel.app/api/auth/google/callback`

---

## 🔌 Endpoints de la API

### Autenticación y perfil
| Método | Ruta | Descripción | Token |
|--------|------|-------------|:-----:|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Login, devuelve JWT | No |
| GET | `/api/auth/google` | Iniciar OAuth Google | No |
| GET | `/api/auth/google/callback` | Callback de Google | No |
| GET | `/api/auth/perfil` | Obtener perfil | Sí |
| PUT | `/api/auth/perfil` | Editar nombre/teléfono/dirección | Sí |
| POST | `/api/auth/avatar` | Subir avatar (multipart/form-data) | Sí |
| GET | `/api/auth/stats` | Estadísticas de compra | Sí |

### Usuarios (admin)
| Método | Ruta | Descripción | Admin |
|--------|------|-------------|:-----:|
| GET | `/api/usuarios` | Listar usuarios | Sí |
| POST | `/api/usuarios` | Crear usuario | Sí |
| GET | `/api/usuarios/:id` | Ver usuario | Sí |
| PUT | `/api/usuarios/:id` | Editar usuario | Sí |
| DELETE | `/api/usuarios/:id` | Eliminar usuario | Sí |

### Productos y compras
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|:-----:|
| GET | `/api/productos` | Catálogo (filtros `?categoria=` `?marca=`) | No |
| GET | `/api/productos/:id` | Detalle de producto | No |
| POST | `/api/productos` | Crear producto | Admin |
| PUT | `/api/productos/:id` | Editar producto/stock | Admin |
| DELETE | `/api/productos/:id` | Eliminar producto | Admin |
| POST | `/api/compras` | Checkout (reduce stock, guarda historial) | Sí |

---

## 🧪 Pruebas con Postman
Se incluye `Practica4.postman_collection.json` con ejemplos de todas las rutas.
Para rutas protegidas, enviá en los headers:
```
Authorization: Bearer <token>
```

---

## 🔑 Accesos de demostración
- Admin: `admin@mypc.com` / `admin123`
- Cliente: `demo@test.com` / `123456`

---

Desarrollado para la materia de Desarrollo Web — Unidad 4.
