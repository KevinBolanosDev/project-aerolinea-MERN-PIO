*BACKEND*

Carpetas del proyecto

**routes** 
*En esta carpeta implmentamos las rutas de la aplicación*

**controllers**
*En esta creamos las funciones que se ejecuntan cuando visitan una url o ruta*

**model**
*En esta guardamos los modelos de bases de datos, especificamos que datos mostrar y ejecutar errores creando schemas*

**middlewares**
*En esta creamos funciones que sirve para validar acceso a rutas con una autenticación y proteger estas*

**schemas**
*En esta validamos los datos que se reciben y antes de que lleguen al backend*

**libs**
*En esta escribimos código para reimportar varias veces*


*FRONTEND*

**Librerías**
*axios*
Es una librería de Javascript que se utiliza para realizar solicitudes HTTP desde el navegador o desde Node.js. Proporciona una interfaz simple y basada en promesas para realizar peticiones a servidores;
Interfaz fácil de usar: Axios proporciona una interfaz simple y consistente para realizar solicitudes HTTP, basada en promesas. Esto facilita la escritura de código limpio y comprensible para manejar operaciones asíncronas relacionadas con la comunicación HTTP.

Manejo de promesas: Al usar promesas, Axios facilita la gestión de operaciones asíncronas, lo que mejora la legibilidad del código y evita el anidamiento excesivo de callbacks.

Gestión automática de transformación de datos: Axios puede transformar automáticamente los datos de las solicitudes y respuestas en diversos formatos, como JSON. Esto simplifica el trabajo con datos y reduce la necesidad de realizar conversiones manuales.

Soporte para interceptores: Axios permite el uso de interceptores para manipular las solicitudes o respuestas antes de que se envíen o después de recibirlas. Esto es útil para añadir headers personalizados, gestionar errores de manera centralizada, entre otras tareas.

Compatibilidad con navegadores y Node.js: Axios es compatible tanto con entornos de navegador como con Node.js, lo que facilita la escritura de código que puede ejecutarse en diferentes contextos.

Manejo sencillo de errores: Axios simplifica el manejo de errores HTTP, proporcionando una forma clara de capturar y gestionar errores en las solicitudes.