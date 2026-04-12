GameHub - Plataforma de Videojuegos 2D

GameHub es una plataforma web dedicada a la gestión y ejecución de videojuegos casuales desarrollados en 2D. Este proyecto forma parte de un Trabajo de Fin de Grado (TFG) y destaca por su arquitectura moderna, separando completamente la lógica de negocio en el servidor de la interfaz de usuario.

Arquitectura del Proyecto

El sistema sigue un modelo de Arquitectura Desacoplada (Headless), facilitando la escalabilidad y el mantenimiento independiente de sus componentes.

Backend (API REST)

Desarrollado con Java y Spring Boot, actúa como el núcleo lógico del sistema.

Gestión de Datos: Persistencia en base de datos MySQL.

Endpoints: API RESTful para la gestión de usuarios, catálogo de juegos y almacenamiento de High Scores.

Seguridad: Implementación de validaciones y lógica de negocio centralizada.

Frontend (SPA)

Desarrollado con React y Vite, ofreciendo una experiencia de usuario fluida y reactiva.

Motor de Juego: Uso de la API de HTML5 Canvas para el renderizado de gráficos 2D con alto rendimiento.

Estilos: Diseño "Arcade/Retro" personalizado mediante CSS3 (incluyendo efectos neón y layouts responsivos).

Comunicación: Consumo de la API REST mediante peticiones asíncronas.

Juegos Incluidos(por ahora...)

Fruit Basket: Juego de habilidad donde el usuario debe recolectar frutas evitando que toquen el suelo.

Crocodile Run: Endless runner que pone a prueba los reflejos del jugador mediante la esquiva de obstáculos dinámicos.

Tecnologías utilizadas

Frontend: React, Vite, JavaScript (ES6+), HTML5 Canvas, CSS3
Backend: Java 17+, Spring Boot, Maven
Base de datos: MySql
Herramientas: Postman,Git, Github

INSTALACIÓN Y DESPLIEGUE

Requisitos Previos

Java JDK 17 o superior.
Node.js (versión 18 o superior).
MySQL Server.

PASOS

Clonar el repositorio:

git clone https://github.com/JuanDev-art/gamehub.git
Configurar el Backend:

Importar el proyecto en tu IDE (IntelliJ/Eclipse).

Ejecutar la aplicación Spring Boot.

Configurar el Frontend:

cd frontend
npm install
npm run dev

ESTADO DEL PROYECTO

Actualmente en desarrollo.

