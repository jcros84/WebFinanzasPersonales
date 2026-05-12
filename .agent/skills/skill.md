# Skill: React & Strapi Specialist

---
name: react-strapi
## Descripción
Esta Skill dota al agente de capacidades avanzadas para el desarrollo, mantenimiento y optimización de aplicaciones web modernas utilizando **React** como biblioteca de interfaz de usuario y **Strapi** como Headless CMS. El agente comprende la arquitectura desacoplada, el consumo de APIs REST/GraphQL y la gestión de contenido dinámico.

## Capacidades Principales

### 1. Arquitectura de Frontend (React)
- **Estructuración de Proyectos:** Configuración de carpetas siguiendo buenas prácticas (Atomic Design, Feature-based, etc.).
- **Gestión de Estado:** Implementación de Redux Toolkit, Context API o Zustand.
- **Hooks Personalizados:** Creación de lógica reutilizable para fetch de datos, formularios y autenticación.
- **Optimización de Rendimiento:** Uso de `React.memo`, `useMemo`, `useCallback` y Lazy Loading.

### 2. Integración con Strapi CMS
- **Modelado de Datos:** Asesoramiento en la creación de Content Types, Single Types y Componentes en Strapi.
- **Consumo de API:** Configuración de clientes (Axios/Fetch) para interactuar con los endpoints de Strapi.
- **Autenticación JWT:** Implementación de flujos de Login/Registro utilizando el sistema de permisos de Strapi (Users & Permissions plugin).
- **Gestión de Medios:** Manejo de URLs de imágenes y assets provenientes del Media Library de Strapi.

### 3. Fetching de Datos y Sincronización
- **React Query / SWR:** Implementación de estrategias de caché y revalidación de datos para una experiencia de usuario fluida.
- **Filtros y Población:** Dominio de los parámetros de consulta de Strapi v4+ (`populate`, `filters`, `sort`, `fields`).

## Flujo de Trabajo Recomendado

1.  **Definición del Esquema:** El agente ayuda a definir la estructura en Strapi (Collection Types).
2.  **Configuración del Cliente:** Generación de servicios de API en React que apunten a la instancia de Strapi.
3.  **Desarrollo de Componentes:** Creación de componentes React que mapeen los campos del CMS.
4.  **Despliegue y Variables de Entorno:** Configuración de `.env` para manejar URLs de producción y desarrollo.

## Ejemplos de Prompts Soportados

- *"Configura un componente de React para listar artículos desde el endpoint /api/articles de Strapi incluyendo las imágenes."*
- *"¿Cómo puedo filtrar los productos en Strapi para que solo me devuelva los que tienen un precio menor a 50?"*
- *"Crea un hook personalizado `useStrapiAuth` para manejar el login y guardar el token JWT."*
- *"Explica cómo usar el parámetro `populate` en Strapi v4 para obtener datos de una relación profunda."*

## Notas de Configuración
- **Versión de Strapi:** Optimizada para Strapi v4 y superiores.
- **Versión de React:** Compatible con React 18+ (Hooks y Concurrent Mode).
- **Estilos:** Soporte para Tailwind CSS, CSS Modules o Styled Components según preferencia del proyecto.