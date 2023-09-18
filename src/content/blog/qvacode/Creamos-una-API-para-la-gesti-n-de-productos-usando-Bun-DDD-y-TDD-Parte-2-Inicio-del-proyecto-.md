---
title: "Creamos una API para la gestión de productos usando Bun, DDD y TDD. Parte 2: Inicio del proyecto. Desarrollo Limpio y Pruebas Unitarias con Bun y Express."
pubDate: "Sun Sep 17 2023"
image: "https://res.cloudinary.com/dlwhh53by/image/upload/v1695000998/bun-ddd_sldxqz.png"
username: "qvacode"
categories: ["tutorials","software","web"]
description: "Este artículo explora la creación de una API de gestión de productos con enfoque en Clean Architecture y Desarrollo Guiado por Pruebas (TDD). Utilizando la potente herramienta Bun junto con Express, se muestra cómo establecer una base sólida para el desarrollo de software limpio y confiable."
canonicalUrl: ""
---


## **Introducción**

El desarrollo de software es un viaje continuo de descubrimiento y mejora. Cada proyecto representa una oportunidad para aprender y aplicar nuevas prácticas y tecnologías que nos permitan construir aplicaciones más sólidas y eficientes. En este viaje, dos principios fundamentales se destacan: Clean Architecture (Arquitectura Limpia) y Test-Driven Development (Desarrollo Guiado por Pruebas, TDD).

En este artículo, nos sumergiremos en el emocionante mundo de la arquitectura limpia y el desarrollo guiado por pruebas, y exploraremos cómo podemos aplicar estos principios en la práctica. Utilizaremos herramientas modernas como Bun y Express para crear un proyecto sólido y bien estructurado. A lo largo de este recorrido, nuestros objetivos serán los siguientes:

### **Objetivos del Artículo**

1. **Introducción a Clean Architecture**: Comprenderemos en qué consiste Clean Architecture y cómo nos ayuda a crear aplicaciones más mantenibles y escalables.

2. **TDD: Desarrollo Guiado por Pruebas**: Exploraremos los conceptos clave de TDD y cómo nos ayuda a escribir código más robusto y libre de errores desde el principio.

3. **Configuración con Bun**: Descubriremos cómo utilizar Bun, una herramienta poderosa que facilita el desarrollo y la gestión de configuraciones en entornos variables.

4. **Creación de un Servidor Express**: Utilizaremos Express para configurar un servidor web y expondremos nuestros servicios al mundo.

5. **Diseño Basado en Clean Architecture**: Diseñaremos la arquitectura de nuestro proyecto siguiendo los principios de Clean Architecture, separando claramente las responsabilidades.

6. **Pruebas Unitarias Eficientes**: Aprenderemos cómo escribir pruebas unitarias efectivas utilizando el test runner interno de Bun.

A medida que avanzamos, veremos cómo todos estos elementos se combinan para formar un proyecto sólido y bien organizado. Estamos listos para comenzar nuestro viaje hacia un desarrollo de software más limpio y orientado a pruebas. ¡Vamos a sumergirnos en el mundo de Clean Architecture y TDD! 🚀

### ¿Qué es Clean Architecture?

Clean Architecture es un enfoque arquitectónico que promueve la separación de responsabilidades en una aplicación. Divide la aplicación en capas concéntricas, cada una con un propósito claro y definido. Las capas típicas incluyen:

-   **Entidades**: Representan objetos de negocio o dominio.
-   **Casos de uso**: Contienen la lógica de negocio y orquestan las interacciones entre las entidades.
-   **Interfaces de usuario (UI)**: Manejan la interacción con el usuario.
-   **Controladores**: Actúan como puntos de entrada para las solicitudes HTTP y presentan los resultados al usuario.

### ¿Qué es TDD?

Test-Driven Development (Desarrollo Guiado por Pruebas) es una metodología de desarrollo que implica escribir pruebas unitarias antes de escribir el código real de la aplicación. Esto ayuda a definir los requisitos y comportamientos esperados antes de implementar la funcionalidad, lo que conduce a un código más limpio y más robusto.

## Configurando el Proyecto con Bun

Iniciamos nuestro proyecto. Para ello nos aseguramos de tener instalado Bun en nuestra máquina. Si no es así, podemos instalarlo con el siguiente comando:

```bash
    curl -fsSL https://bun.sh/install | bash
```

Una vez instalado, nos movemos a al directorio donde vamos a tener nuestro proyecto y lo creamos con el siguiente comando:

```bash
    bun init
```

Bun nos pedirá establecer el nombre del proyecto y definir el path base del mismo, en mi caso:

```bash
    name: bun-product-api
    path: src/index.ts
```

Listo, tenemos nuestro proyecto creado.

## Creación del Servidor Express

Con Bun configurado, creamos un servidor Express:

```bash
    bun add express
```

Ahora, por que elegimos express y no otro framework. Express es un framework flexible, con el que podemos adoptar la arquitectura de software que queramos, esto si bien puede ser malo, porque no te traza una ruta, en nuestro caso es de gran utilidad, ya que nos permite crear una arquitectura limpia y escalable.

Volveremos luego al servidor, ahora hablemos de arquitectura.

## Diseño Basado en Clean Architecture

Siguiendo los principios de Clean Architecture, diseñamos nuestra aplicación con una estructura modular y organizada. Utilizamos capas como "domain", "application", "adapters" e "infrastructure" para separar las responsabilidades y facilitar el mantenimiento y la escalabilidad. Usamos un modulo compartido que nos permite reutilizar código en toda la aplicación. La estructura del proyecto es la siguiente:

bun-product-api/
│
├── test/
│ ├── server.test.ts
├── src/
│ ├── config/
│ │ ├── env.config.ss
│ │ ├── server.js
│ ├── modules/
│ │ ├── Products/
│ │ │ │ ├── adapters/
│ │ │ │ ├── application/
│ │ │ │ ├── domain/
│ │ │ │ ├── infrastructure/
│ │ ├── Shared/
│ │ ├── Store/
│ │ │ │ ├── adapters/
│ │ │ │ ├── application/
│ │ │ │ ├── domain/
│ │ │ │ ├── infrastructure/

## Pruebas. Hablemos de TDD

Una parte fundamental de nuestro proceso de desarrollo es la escritura de pruebas. Utilizamos el potente test runner interno de Bun para ejecutar nuestras pruebas de manera eficiente. Veamos un ejemplo de cómo creamos una prueba de Integración de la API el caso de uso de salud de la aplicación:

```javascript
import { expect, test, describe, afterAll } from 'bun:test';
import { Server } from '../src/config/server';

describe('Testing init server', async () => {
    const server = new Server();
    server.listen();

    const API_URI = 'http://localhost:3300/api/v1/health';
    const result = await fetch(API_URI);
    const toJSON = await result.json();

    afterAll(() => {
        server.close();
    });

    test('Should return server status code 200', () => {
        expect(result.status).toBe(200);
    });

    test('Should return server message', () => {
        expect(toJSON).toEqual({ message: '🤖 -->> Server is up and running' });
    });
});
```

Si vienes de Jest.js, Bun te resultará familiar. Pero bun nos promete un rendimiento hasta 10 veces mayor que Jest.js. Verdaderamente ridículo 😱.

<div align="center">
  <img src="https://github-production-user-asset-6210df.s3.amazonaws.com/3084745/266451125-05148dc1-eb42-419b-8c92-8c1b574447e4.png" alt="Comparación de rendimiento con otros test runner" width="600">
</div>

## Volvemos al servidor

Ya tenemos nuestro test petando, no hemos hecho nada, solo crear carpetitas 🤭 y un test, pero ya tenemos un test petando. Ahora vamos a crear nuestro servidor, para ello nos vamos a la carpeta src/config y creamos un archivo server.ts, en el cual vamos a crear nuestro servidor express.

El servidor debe permitirnos configurar el el puerto, el enrutador, los middlewares globales, asi como poder levantar o cerrar la conexión de este server.

Puedes ver el código del Servidor en este enlace de [GitHub](https://github.com/qvacode/bun-product-api/blob/main/src/config/server.ts)

Una vez tenemos el server listo, creamos una instancia en nuestro path base (**te acuerdas cual era 🫣**), si, justo la que le comentamos a Bun en el proceso de inicio del proyecto (pero vamos, que eso lo cambias cuando quieras 🤷) **src/index.ts**

```javascript
import { Server } from './config/server';

const server = new Server();
server.listen();
```

Listo, ahora corremos nuestras pruebas y voilà: 

<div align="center">
  <img src="https://res.cloudinary.com/dlwhh53by/image/upload/v1694999558/Captura_de_pantalla_de_2023-09-17_21-12-16_rnciru.png" alt="Pruebas del proyecto ejecutadas en consola" width="600">
</div>

## Conclusión

Hasta el momento solo tenemos un montón de carpetas y el servidor corriendo y testado, pero no hemos hecho nada, ¿o si?.

En la siguiente entrega estaremos creando el modulo Store, con sus respectivas capas y pruebas unitarias. Entonces todo tendrá un pco de sentido y veremos el potencial del desarrollo propuesto.

[Repositorio del proyecto](https://github.com/qvacode/bun-product-api)

¡Esperamos que este artículo te haya inspirado a adoptar estas prácticas en tu propio desarrollo de software! Si tienes preguntas o comentarios, ¡no dudes en compartirlos en la sección de comentarios!

¡Feliz desarrollo! 🚀
