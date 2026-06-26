# App-UTP: Portal de Registro de Proyectos Móviles

Este es un portal desarrollado en Ionic y Angular para gestionar e interactuar con registros de proyectos de desarrollo de aplicaciones móviles. La aplicación implementa un panel de control con métricas, formularios reactivos avanzados, simuladores interactivos en tiempo real y persistencia local híbrida.

## Enlace de Acceso Local
El servidor de desarrollo local de la aplicación se ejecuta de forma predeterminada en el puerto 4200. Puede acceder a la aplicación en el siguiente enlace:
* http://localhost:4200/

## Características Principales

### 1. Panel de Control y Estadísticas
El inicio de la aplicación incorpora un panel de estadísticas generales que recopila en tiempo real el total de proyectos y calcula la proporción exacta entre proyectos de tipo académico y de ventas a través de una barra de progreso bicolor.

### 2. Formulario Reactivo y Selectores Visuales
Se ha reemplazado la selección estándar de tipo de aplicación por tarjetas de selección táctil. Los campos de entrada de texto e email están validados en tiempo real mediante Angular Reactive Forms, con soporte visual completo para errores y notificaciones de conexión.

### 3. Simulador Móvil Interactivo
La pantalla de detalles cuenta con un simulador en tiempo real que emula un dispositivo móvil físico. Según el tipo de aplicación seleccionado (Académica o Ventas), el simulador adapta instantáneamente su interfaz para mostrar vistas dinámicas: un portal de calificaciones universitarias para Académica, o un panel de control de ventas y catálogo para Ventas.

### 4. Robustez de Red e Hibridación Local (Caching)
La aplicación interactúa con un backend en la nube. Dado que los servidores gratuitos pueden presentar tiempos de espera prolongados (cold starts), el servicio de API implementa un almacenamiento caché transparente mediante localStorage. Si se detecta un fallo o demora en la conexión, el registro se guarda localmente marcando su estado como sin sincronizar (Local) para permitir que el flujo continúe de forma fluida. Al restablecer la conexión, las listas locales e híbridas se fusionan de forma automática.

### 5. Búsqueda y Filtros de Consulta
La página de consulta contiene herramientas de búsqueda en tiempo real (por nombre y correo) y segmentadores de categoría que permiten filtrar los proyectos en pantalla instantáneamente. También incluye badges que reflejan el estado de sincronización de cada registro en la nube.

## Requisitos Previos
* Node.js (Versión 22.0.0 o superior recomendada)
* npm (Versión 10.0.0 o superior recomendada)

## Guía de Instalación y Ejecución

1. Descargue el proyecto y navegue al directorio de la aplicación:
   ```bash
   cd app-utp
   ```

2. Instale las dependencias necesarias:
   ```bash
   npm install
   ```

3. Inicie el servidor de desarrollo local:
   ```bash
   npm run start
   ```

4. Abra su navegador e ingrese a la dirección de acceso local:
   * http://localhost:4200/

## Estructura del Código
* **src/app/home**: Vista principal de formulario y panel de estadísticas.
* **src/app/detalle**: Vista de detalle del proyecto registrado y simulador móvil.
* **src/app/consulta**: Vista de búsqueda, listado y filtros de proyectos.
* **src/app/components**: Subcomponentes modulares de ficha técnica y selectores del simulador.
* **src/app/services/registro-api.ts**: Lógica de servicios HTTP, manejo de caché local y resiliencia de red.
* **src/theme/variables.scss**: Definición de la paleta de colores y variables CSS globales del sistema de diseño.
* **src/global.scss**: Configuración de tipografías e implementación de clases glassmorphism y simulador móvil.