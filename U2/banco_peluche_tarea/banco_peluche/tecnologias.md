# Resumen de Tecnologías Utilizadas

## Backend

El backend fue desarrollado utilizando **Node.js**, un entorno de ejecución para JavaScript construido con el motor V8 de Chrome. Se utilizaron las siguientes librerías y herramientas clave:

*   **Express.js**: Framework web rápido, minimalista y flexible para Node.js. Se utilizó para manejar las rutas, peticiones HTTP (GET, POST) y la lógica del servidor.
*   **Sequelize**: ORM (Object-Relational Mapping) basado en promesas para Node.js. Facilita la interacción con la base de datos relacional mediante el uso de modelos y abstracciones en lugar de escribir consultas SQL puras.
*   **MySQL2**: Driver de cliente MySQL para Node.js, optimizado para rendimiento y compatibilidad con Sequelize.
*   **Dotenv**: Módulo para cargar variables de entorno desde un archivo `.env` a `process.env`, permitiendo gestionar configuraciones sensibles como credenciales de base de datos de manera segura.
*   **Cors**: Middleware para habilitar CORS (Cross-Origin Resource Sharing), permitiendo que el frontend (que corre en un puerto diferente) pueda comunicarse con el backend.
*   **Nodemon**: Herramienta de desarrollo que reinicia automáticamente la aplicación cuando se detectan cambios en los archivos.

## Frontend

El frontend fue construido con **React**, una biblioteca de JavaScript para construir interfaces de usuario. Se utilizaron las siguientes tecnologías y librerías:

*   **React (Create React App)**: Base del proyecto frontend, permitiendo la creación de componentes reutilizables y el manejo del estado de la aplicación.
*   **Axios**: Cliente HTTP basado en promesas para el navegador y Node.js. Se utilizó para realizar las peticiones a la API del backend.
*   **Chart.js y React-Chartjs-2**: Librerías para la creación de gráficos dinámicos e interactivos. Se utilizaron para visualizar las estadísticas de los clientes.
*   **jsPDF y jsPDF-AutoTable**: Librerías para la generación de documentos PDF desde el lado del cliente. Se utilizaron para exportar los reportes individuales de los clientes.
*   **XLSX (SheetJS)**: Librería para leer y escribir archivos de hojas de cálculo. Se implementó para permitir la exportación de la lista de clientes a formato Excel.
*   **CSS**: Se utilizaron hojas de estilo en cascada para el diseño y la maquetación de la interfaz de usuario, asegurando una presentación limpia y amigable.

## Base de Datos

*   **MySQL**: Sistema de gestión de bases de datos relacional utilizado para almacenar la información de los clientes y sus transacciones. Se encuentra alojada en la nube (según la configuración del proyecto).

## Arquitectura

El proyecto sigue una arquitectura **Cliente-Servidor**:
1.  **Cliente (Frontend)**: La interfaz de usuario en React que captura los datos y muestra la información.
2.  **Servidor (Backend)**: La API RESTful en Node.js/Express que procesa la lógica de negocio (cálculos de intereses, multas, etc.) y gestiona la persistencia de datos.
3.  **Base de Datos**: El almacén de datos persistente.
