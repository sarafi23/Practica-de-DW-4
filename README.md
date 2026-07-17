# Practica4 - CRUD MongoDB, JWT y OAuth Google

## Requisitos

- Node.js >= 18
- MongoDB Atlas (o instancia local de MongoDB)
- Cuenta de Google Cloud Console (para OAuth)

## Instalación

```bash
# Clonar repositorio
git clone <tu-repo>
cd "DW Practica4"

# Instalar dependencias del backend
cd backend
npm install
```

## Configuración

Renombrar o copiar `backend/.env` y completar las variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/practica4?retryWrites=true&w=majority
JWT_SECRET=una_clave_secreta_segura
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### MongoDB Atlas
1. Crear cluster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Obtener la URI de conexión.
3. Pegarla en `MONGODB_URI`.

### OAuth Google
1. Ir a [Google Cloud Console](https://console.cloud.google.com/).
2. Crear proyecto > Credenciales > ID de cliente OAuth.
3. Agregar origen `http://localhost:3000` y redirección `http://localhost:5000/api/auth/google/callback`.
4. Copiar Client ID y Secret al `.env`.

## Ejecución

```bash
cd backend
npm run dev    # Con nodemon (desarrollo)
# o
npm start      # Producción
```

Para el frontend estático, abrir `frontend/index.html` con un servidor:

```bash
npx serve frontend
# o con Live Server en VSCode
```

## Endpoints de la API

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión, devuelve token |
| GET | `/api/auth/perfil` | Obtener perfil (token requerido) |
| GET | `/api/auth/google` | Iniciar sesión con Google |
| GET | `/api/auth/google/callback` | Callback de Google |

### CRUD Usuarios (protegidas con JWT)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/usuarios` | Crear usuario |
| GET | `/api/usuarios` | Listar todos |
| GET | `/api/usuarios/:id` | Obtener uno |
| PUT | `/api/usuarios/:id` | Actualizar |
| DELETE | `/api/usuarios/:id` | Eliminar |

## Despliegue

### Backend en Render
1. Subir el proyecto a GitHub.
2. Crear servicio Web en [Render](https://render.com/).
3. Conectar repositorio, indicar `backend` como directorio raíz.
4. Build: `npm install`, Start: `npm start`.
5. Configurar variables de entorno en Render.

### Frontend en Vercel
1. Ir a [Vercel](https://vercel.com/).
2. Importar repositorio.
3. Configurar:
   - Root Directory: `frontend`
   - Build: vacío (sitio estático)
4. Actualizar `API` en los JS a la URL de Render.

## Estructura del proyecto

```
backend/
  ├── config/db.js         # Conexión MongoDB
  ├── models/User.js       # Modelo de usuario
  ├── routes/users.js      # CRUD usuarios
  ├── routes/auth.js       # Autenticación JWT + OAuth
  ├── middleware/auth.js   # Middleware de protección
  ├── middleware/passport.js # Estrategia Google
  ├── server.js            # Punto de entrada
  └── .env                 # Variables de entorno
frontend/
  ├── index.html           # Login / Registro
  ├── dashboard.html       # Panel protegido
  ├── css/style.css        # Estilos
  └── js/
      ├── app.js           # Lógica login/registro
      └── dashboard.js     # Lógica dashboard
```
