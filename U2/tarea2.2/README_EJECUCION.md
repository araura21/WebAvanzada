# 🎓 Sistema Académico - Guía de Ejecución

## 📋 Requisitos Previos

- ✅ Node.js 16+ instalado
- ✅ MySQL/MariaDB ejecutándose en puerto 3306
- ✅ Credenciales en `.env` configuradas correctamente

---

## 🚀 FORMA 1: EJECUCIÓN MANUAL (RECOMENDADO PARA DESARROLLO)

### Terminal 1 - BACKEND

```bash
cd sistema-academico/sis-academico-backend
npm install    # Solo la primera vez
npm run dev    # Inicia en http://localhost:3000
```

**Output esperado:**
```
Conexion establecida con MySQL
Modelos sincronizados (alter mode)
Servidor ejecutandose en http://localhost:3000
```

### Terminal 2 - FRONTEND

En otra terminal diferente:

```bash
cd sistema-academico/sis-academico-frontend
npm install    # Solo la primera vez
npm start      # Inicia en http://localhost:3000
```

**Output esperado:**
```
Compiled successfully!
You can now view... in the browser.
  Local:            http://localhost:3000
```

---

## 🚀 FORMA 2: CON DOCKER (COMPLETAMENTE INDEPENDIENTE)

### Paso 1: Desde la carpeta `tarea2.2/`

```bash
docker-compose up
```

**Lo que hace:**
- ✅ Crea contenedor MySQL automáticamente
- ✅ Crea contenedor Backend (puerto 3000)
- ✅ Crea contenedor Frontend (puerto 3001)
- ✅ Crea red privada entre servicios

**URLs de acceso:**
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`

---

## ⚙️ CONFIGURACIÓN `.env`

Asegúrate de que exista `sis-academico-backend/.env`:

```env
DB_NAME=sis_academico
DB_USER=admin
DB_PASSWORD=admin123
DB_HOST=localhost    # O 'mysql' si usas Docker
DB_PORT=3306
JWT_SECRET=miclavesecreta
```

---

## 🧪 PRUEBAS RÁPIDAS

### 1. Verificar Backend

```bash
# En terminal con backend corriendo:
curl http://localhost:3000/api/estudiantes

# Deberías recibir: []  (array vacío al inicio)
```

### 2. Crear Estudiante

1. Abre: `http://localhost:3000` (Frontend)
2. Ve a: "Estudiantes" → "Registrar"
3. Llena el formulario
4. Haz clic en "Guardar"

**Errores comunes:**

| Error | Causa | Solución |
|-------|-------|----------|
| "Error de conexión con el servidor" | Backend no está corriendo | `npm run dev` en sis-academico-backend |
| "El correo ya existe" | Correo duplicado en BD | Usa otro correo |
| "Campo requerido: cedula..." | Falta campo obligatorio | Llena todos los campos |
| "Error 404" | Ruta no existe | Verifica api.service.js |

---

## 📊 ESTRUCTURA DE CARPETAS

```
tarea2.2/
├── sistema-academico/
│   ├── sis-academico-backend/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── middlewares/
│   │   ├── app.js
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── .env
│   │
│   └── sis-academico-frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── App.js
│       ├── package.json
│       ├── Dockerfile
│       └── public/
│
├── docker-compose.yml
├── ecuador.sql
├── start.sh
└── README.md
```

---

## 🔧 COMANDOS ÚTILES

### Backend

```bash
cd sistema-academico/sis-academico-backend

npm run dev           # Desarrollo con auto-reload
npm start             # Producción
npm install           # Instalar dependencias
```

### Frontend

```bash
cd sistema-academico/sis-academico-frontend

npm start             # Desarrollo
npm run build         # Compilar para producción
npm install           # Instalar dependencias
```

### Docker

```bash
docker-compose up              # Inicia todos los servicios
docker-compose up -d           # En background
docker-compose down            # Detiene todos
docker-compose logs -f         # Ver logs en tiempo real
docker-compose logs backend    # Logs específico del backend
```

---

## 🐛 TROUBLESHOOTING

### Backend no inicia

```bash
# Verificar puerto 3000
lsof -i :3000

# Matar proceso en puerto 3000
kill -9 $(lsof -t -i:3000)

# O si no funciona anterior:
fuser -k 3000/tcp
```

### MySQL no conecta

```bash
# Verificar MySQL corriendo
mysql -u root -p

# Conectar a DB específica
mysql -u admin -padmin123 -h localhost -P 3306 sis_academico

# Ver tablas
show tables;
```

### Frontend no conecta con Backend

1. Verificar `api.service.js` tiene URL correcta
2. Verificar Backend esté en puerto 3000
3. Verificar CORS en backend está permitiendo origen del frontend
4. Ver consola del navegador (F12 → Console)

---

## 📝 VARIABLES DE ENTORNO

### Backend (.env)

```env
# Base de datos
DB_NAME=sis_academico
DB_USER=admin
DB_PASSWORD=admin123
DB_HOST=localhost
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_super_segura

# Ambiente (opcional)
NODE_ENV=development
```

### Frontend (.env)

```env
# API Backend
REACT_APP_API_URL=http://localhost:3000/api
```

---

## ✅ CHECKLIST ANTES DE USAR

- [ ] Node.js instalado: `node --version`
- [ ] npm instalado: `npm --version`
- [ ] MySQL corriendo
- [ ] `.env` configurado en backend
- [ ] Carpeta `uploads/estudiantes/` existe en backend
- [ ] Puerto 3000 disponible
- [ ] Puerto 3001 disponible (si no usas Docker)

---

## 🎯 PRÓXIMOS PASOS

1. Ejecuta Backend: `npm run dev`
2. Ejecuta Frontend: `npm start`
3. Abre: `http://localhost:3000`
4. Prueba crear un estudiante
5. Verifica datos en BD: `mysql -u admin -padmin123 sis_academico -e "SELECT * FROM estudiantes;"`

---

## 📞 SOPORTE

Si tienes problemas:

1. Verifica logs en terminal (Backend)
2. Abre Console en navegador (F12)
3. Verifica Network tab en Developer Tools
4. Revisa archivos `.env` y configuración

---

**¡Listo para usar!** 🚀
