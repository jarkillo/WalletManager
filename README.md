# Gestor de Cartera Web3

Este proyecto tiene como objetivo desarrollar un gestor de cartera para criptomonedas, utilizando tecnologías Web3. La aplicación contará con un frontend sencillo y un backend robusto que interactuará con la blockchain.

Se ha usado ChatGPT para diseñar una estructura del proyecto

## Contenidos
- [Planificación y Diseño](#planificación-y-diseño)
- [Backend](#backend)
- [Frontend](#frontend)
- [Testing](#testing)
- [Despliegue y Mantenimiento](#despliegue-y-mantenimiento)
- [Herramientas y Tecnologías](#herramientas-y-tecnologías)

## ❤️ Contributors

[![Contributor 1](https://avatars.githubusercontent.com/u/114604731?v=4)](https://github.com/alvsedcar)
[![Contributor 2](https://avatars.githubusercontent.com/u/149080929?v=4)](https://github.com/tomastravis)
[![Contributor 3](https://avatars.githubusercontent.com/u/148989122?v=4)](https://github.com/Mpzapata)
[![Contributor 4](https://avatars.githubusercontent.com/u/152426648?v=4)](https://github.com/rosamaya22)
[![Contributor 5](https://avatars.githubusercontent.com/u/107489788?v=4)](https://github.com/jarkillo)


## Planificación y Diseño (Reunion del Sabado)

### Requerimientos

- **Git**: Tener instalado git en el pc (https://git-scm.com/downloads), En el link esta la descarga de mac y de windows
- **Extension Git VSCODE**: Instalar la extensión de github en VSCODE (Git Extension Pack, gitignore, git History)
- **Extension docker VSCODE**: Instalar la extensión de VSCODE (Docker, Docker compose, Docker explorer, Docker Extension Pack, Docker Run)
- **Tener cuenta de Github**: Crear una cuenta de github si no la teneis ya y loguearos en vscode con la cuenta
- **Instalar Docker Desktop**: Instalar docker Desktop en el pc (https://www.docker.com/products/docker-desktop/)

(Cualquier duda instalando las aplicaciones preguntad a manu por whatsapp)

### Tareas a discutir en la reunion

- **Definición de requerimientos**: Identificación de funcionalidades clave, incluyendo soporte de múltiples criptomonedas, transacciones, visualización de balances, y más. 
- **Arquitectura del sistema**: Diseño de la arquitectura general, incluyendo microservicios para el backend y patrones de diseño para el frontend.
- **Explicacion de git y github**: Se realizará una explicación por videoconferencia para explicar la forma de trabajar, el uso de git y github y el metodo de revisión del código.

### Responsable
- Líder del proyecto

## Backend
### Tareas
- **Configuración del entorno de desarrollo**: Preparación de entornos virtuales y configuración de dependencias.
- **Desarrollo de la API**: Implementación de endpoints para las operaciones principales del gestor de cartera.
- **Integración con blockchain**: Conexión con nodos de blockchain utilizando la librería Web3.py.
- **Seguridad**: Implementación de prácticas de seguridad para proteger la información y las transacciones.

### Responsables
- Desarrollador Backend 1: API y lógica de negocio.
- Desarrollador Backend 2: Medidas de seguridad.

## Frontend
### Tareas
- **Diseño de UI/UX**: Creación de un diseño intuitivo y responsivo.
- **Implementación del frontend**: Desarrollo utilizando frameworks modernos como React o Vue.js.
- **Integración con la API del backend**: Consumo de los endpoints proporcionados por el backend.

### Responsable
- Desarrollador Frontend

## Testing
### Tareas
- **Pruebas unitarias y de integración**: Asegurar el correcto funcionamiento de los componentes individuales y su integración.
- **Pruebas de seguridad**: Identificación y mitigación de vulnerabilidades.

### Responsable
- Tester / QA Engineer

## Despliegue y Mantenimiento
### Tareas
- **Configuración del servidor de producción**: Preparativos para el entorno de producción.
- **Despliegue de la aplicación**: Implementación en el servidor y verificación de funcionalidades.
- **Mantenimiento continuo**: Supervisión y actualización del sistema según sea necesario.

### Responsable
- DevOps / Ingeniero de mantenimiento

## Herramientas y Tecnologías
- **Backend**: Python, FastAPI, Web3.py
- **Frontend**: React, Vue.js, angular, o el lenguaje que decidamos usar en la reunion
- **Base de datos**: MySQL (En caso de que decidamos usar una base de datos)
- **Pruebas**: Pendiente de decidir (pytest, Selenium)
- **Despliegue**: Docker, Docker-Compose
