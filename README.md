# Web Finanzas Personales 📈

Una aplicación web moderna y profesional diseñada para la gestión integral de finanzas personales, carteras de inversión y seguimiento detallado de dividendos (DGI).

## 🚀 Características

- **Dashboard de Inversiones**: Visualización analítica de carteras con gráficos interactivos.
- **Gestión de Cartera (DGI)**:
  - Registro de transacciones (Compra, Venta, Reinversión de Dividendos - DRIP).
  - Seguimiento de ingresos por dividendos.
  - Clasificación por tipo de activo (Acciones, ETFs, Opciones).
- **Mantenimiento de Maestros**: Gestión completa de activos financieros (CRUD de activos).
- **Interfaz Premium**: Diseño minimalista y moderno construido con Tailwind CSS 4.
- **Formulario de Contacto**: Integración directa para recibir mensajes en la base de datos.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Base de Datos y Backend**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Navegación**: [React Router Dom 7](https://reactrouter.com/)

## ⚙️ Configuración del Proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/jcros84/WebFinanzasPersonales.git
cd WebFinanzasPersonales
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 4. Configuración de la Base de Datos
Ejecuta el script SQL que se encuentra en `supabase_schema.sql` dentro del editor SQL de tu proyecto en Supabase para crear las tablas necesarias:
- `portfolios`
- `transactions`
- `dividends`
- `assets` (Maestros)
- `messages`

## 🏃‍♂️ Ejecución

Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## 📦 Despliegue
Para generar la versión de producción:
```bash
npm run build
```

---
Desarrollado con ❤️ para una mejor gestión financiera.
