# myPC - Tienda de Componentes de PC

Una plataforma web completa para comprar componentes de hardware. Incluye un sistema de autenticación seguro, panel de administración con CRUD de usuarios y productos, carrito de compras con control de stock, pasarela de pago simulada, subida de avatars y estadísticas de compra avanzadas en tiempo real.

## Características principales

- 🔒 **Autenticación segura**: Registro, login con validación en tiempo real y OAuth de Google integrado.
- 🛒 **Sistema de Carrito**: Gestión en localStorage con control de stock dinámico y checkout con dirección de envío.
- 🛍️ **Catálogo de Productos**: Búsqueda, filtrado por categorías y marcas, y página de detalle con productos relacionados.
- 👤 **Perfil de Usuario**: Actualización de datos, subida de avatar vía Multer y panel de estadísticas de compra (Gasto total, compras realizadas, marca y categoría favoritas).
- 🛠️ **Panel de Administración**: Gestión completa de usuarios (CRUD) y control de inventario de productos.
- 🎨 **Interfaz de Vanguardia**: Diseño responsivo y moderno con Glassmorphism en login, fondo interactivo con sistema de partículas y modo oscuro tecnológico.

## Requisitos

- Node.js >= 18
- MongoDB Atlas (o instancia local de MongoDB)
- Cuenta de Google Cloud Console (para OAuth)

## Instalación y Configuración Local

1. **Clonar repositorio**
   ```bash
   git clone <tu-repo>
   cd "DW Practica4"
   ```

2. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` en la carpeta `backend` con las siguientes claves:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/practica4?retryWrites=true&w=majority
   JWT_SECRET=una_clave_secreta_segura
   GOOGLE_CLIENT_ID=tu_google_client_id
   GOOGLE_CLIENT_SECRET=tu_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   FRONTEND_URL=http://localhost:5000
   ```

4. **Sembrar base de datos (Seeding)**
   Opcionalmente puedes rellenar la base de datos con los productos iniciales y usuarios de prueba ejecutando:
   ```bash
   node seed.js
   ```
   *Usuarios de prueba:*
   - **Administrador**: `admin@mypc.com` / `admin123`
   - **Cliente Demo**: `demo@test.com` / `123456` (con historial de compras ficticias cargado)

5. **Ejecutar proyecto**
   ```bash
   npm run dev    # Con nodemon (desarrollo)
   # o
   npm start      # Producción
   ```
   Abre tu navegador en `http://localhost:5000`. El backend sirve el frontend de forma estática automáticamente.

## Endpoints de la API

### Autenticación y Perfil
| Método | Ruta | Descripción | Requiere Token |
|--------|------|-------------|:--------------:|
| POST | `/api/auth/register` | Registrar usuario (con teléfono y dirección) | No |
| POST | `/api/auth/login` | Iniciar sesión y obtener JWT | No |
| GET | `/api/auth/google` | Iniciar sesión con Google OAuth | No |
| GET | `/api/auth/perfil` | Obtener datos del perfil actual | Sí |
| PUT | `/api/auth/perfil` | Actualizar nombre, teléfono y dirección | Sí |
| POST | `/api/auth/avatar` | Subir foto de perfil (avatar) vía FormData | Sí |
| GET | `/api/auth/stats` | Calcular estadísticas de compra del usuario | Sí |

### CRUD de Usuarios (Administración)
| Método | Ruta | Descripción | Requiere Admin |
|--------|------|-------------|:--------------:|
| GET | `/api/usuarios` | Listar todos los usuarios registrados | Sí |
| POST | `/api/usuarios` | Registrar un nuevo usuario manualmente | Sí |
| GET | `/api/usuarios/:id` | Obtener información detallada de un usuario | Sí |
| PUT | `/api/usuarios/:id` | Actualizar rol o datos de un usuario | Sí |
| DELETE | `/api/usuarios/:id` | Eliminar usuario del sistema | Sí |

### Productos y Compras
| Método | Ruta | Descripción | Requiere Auth |
|--------|------|-------------|:-------------:|
| GET | `/api/productos` | Obtener catálogo (soporta filtros de marca/categoría) | No |
| GET | `/api/productos/:id` | Obtener detalle de un producto específico | No |
| POST | `/api/productos` | Añadir nuevo componente al stock (Solo Admin) | Sí (Admin) |
| PUT | `/api/productos/:id` | Actualizar stock/detalles de producto (Solo Admin) | Sí (Admin) |
| DELETE | `/api/productos/:id` | Retirar producto del catálogo (Solo Admin) | Sí (Admin) |
| POST | `/api/compras` | Finalizar compra, reducir stock y guardar en historial | Sí |

## Despliegue en Producción

### 1. Backend en Render
1. Sube tu proyecto a GitHub.
2. Crea un **Web Service** en [Render](https://render.com/).
3. Conecta tu repositorio e indica **`backend`** como **Root Directory**.
4. Usa los comandos por defecto:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Configura las variables de entorno (`MONGODB_URI`, `JWT_SECRET`, etc.).
6. Toma nota de la URL generada (ej. `https://mypc-backend.onrender.com`).

### 2. Frontend en Vercel
Para evitar problemas de CORS y llamadas absolutas rotas, empleamos **Vercel Rewrites** para delegar las peticiones a Render.

1. Crea el archivo `frontend/vercel.json` con tus URLs:
   ```json
   {
     "rewrites": [
       { "source": "/api/:path*", "destination": "https://TU-BACKEND.onrender.com/api/:path*" },
       { "source": "/uploads/:path*", "destination": "https://TU-BACKEND.onrender.com/uploads/:path*" }
     ]
   }
   ```
2. Crea un proyecto en **Vercel**, conecta el mismo repo.
3. Elige **`frontend`** como **Root Directory**.
4. ¡Despliega! Vercel servirá el frontend de manera estática e intermediará las peticiones a tu backend automáticamente.

---
Desarrollado con ❤️ para la Materia de Desarrollo Web.
