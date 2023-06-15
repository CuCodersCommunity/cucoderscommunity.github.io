---
title: "Creando mi propipo PAAS, al estilo Heroku, parte 1"
pubDate: "Sun Jun 15 2023"
image: "https://i.pinimg.com/564x/7a/24/db/7a24db5cf388617f86b0b1462120eea3.jpg"
username: "aprezcuba24"
categories: ["tutorials","software"]
description: "En la actualidad se han popularizado el uso de PAAS (Platform as a Service), exisitiendo varias alternativas como heroku, vercel, netlify, etc. En una serie de artículos me propongo implementar mi propio PAAS. Haciendo una prueba de concepto e integrando varias tecnologías libres disponibles para la comunidad."
canonicalUrl: ""
---

## Introducción

Un programdor se especializa fundamentalmente en el diseño e implementación de sistemas informáticos, haciendo tareas como, diseño de la arquitectura, implementación del código fuente, implementación de pruebas automáticas, etc. Generalmente, les cuesta trabajo llevar a producción las aplicaciones, debido a que necesitan otras competencias que están más en el ámbito de los Devops. Estos últimos se encargan de controlar la infraestructura de servidores donde se ejecuta las aplicaciones y para esto necesitan conocer diferentes tecnologías y herramientas que se aleja de la zona de confort de los programadores.

Existen diferentes tipologías a la hora de clasificar las infraestructuras en las nube para alojar sistemas.

- IAAS: Infraestructura como servicios. Qué básicamente son servidores en la nube donde podemos acceder directamente al sistema operativo e instalar todo lo que necesitemos.
- PAAS: Plataformas como servicio. Este tipo de plataformas nos brindan mecanismos para desplegar aplicaciones según el lenguaje y herramientas que soporta. En este caso como desarrollador perdemos el control de los servidores donde se ejecuta la aplicación pero nos permite desplegar mucho más fácil nuestra solución.
- SAAS: Software como servicio. Este es un nivel superior de sistemas en la nube, conocido como cloudcomputing. Los desarrolladores implementan la aplicación a través de la configuración e interacción de los software que ya existen en la infraestructura.

En Cuba, producto del bloqueo, tenemos vedado el uso de este tipo de plataformas en la nube. Además que en muchas ocasiones no tenemos como pagar estos servicios. Lo que nos hace difícil el desarrollo de aplicaciones desde la isla. 

Este artículo es el primero de una serie, donde me propongo desarrollar mi propio PAAS. Haré lo que se conoce como Build in Public e iré desarrollando un sistema al estilo de Heroku o Vercel.

Lo primero que debo aclarar que esto será un prueba de concepto, por lo tanto me tomaré libertades a la hora de diseñar la aplicación. Habrá requerimientos que solo los dejaré indicados pero no los desarrollé y el resultado final no será completamente funcional. Con esto aclarado vamos a pasar a los requerimientos que tendrá nuestro PAAS.

### Requerimientos

El PAAS tendrá la siguientes funcionalidades.

- Registrar la url de un repositorio git. El desarrollador podrá registrar la url de su repositorio y la rama que quiere desplegar. Después de esto el sistema tendrá que desplegar de forma automática cada nueva versión de la aplicación que se adicione a la rama.
- Registrar variables de entorno: Deberá tener un mecanismo que permita registrar un diccionario clave-valor con posibles variables de entorno que será inyectada a la aplicación ya construida.
- Brindar una url que permita ver la aplicación en ejecución.
- Definir servicios extras que usará la aplicación, ejemplo sistema de base de datos.
- Definir en qué lenguaje se ejecutará la aplicación.

Nuestro PAAS se llamará **cupaas** y cada aplicación que queramos desplegar debe tener un fichero en la carpeta raíz, llamado ".cupaas" con la siguiente estructura.

```
runtime: python
services:
  - mongodb
```

- En el campo runtime se podrá el lenguaje de programación de nuestra aplicación. Por ahora solo soportaremos python pero deberíamos tener una arquitectura que nos permita incorporar otros lenguajes en el futuro.
- El campo services, será un arreglo con los servicios extras que necesitamos. Una vez más decir que inicialmente solo soportaremos mongodb pero en el futuro podrá ser, postgresql, kafka, redis, etc.

### Tecnologías

¿Qué tecnologías y herramientas usaremos?

- Kubernates: Es la plataforma líder para gestionar clusters de aplicaciones. Solamente por esto tenemos todas las de ganar, porque básicamente lo que hará el sistema es generar la configuración necesaria para que kubernates pueda desplegar la aplicación. Para el desarrollo local usaremos minikube.
- Docker: En la actualidad todas las aplicaciones que desarrollo las monto sobre docker. Lo que me permite empaquetar mejor las aplicaciones.
- Kafka: Es un sistema de mensajería para la gestión de mensajes en un sistema basado en microservicios. Nuestro PAAS tendrá este tipo de arquitectura.

Python: Para el desarrollo usaremos este lenguaje de programación. Quizás para exista otro más adecuado, pero para los objetivos de la prueba de concepto me parece perfecto python.

### Roadmap

Trataré de hacer un artículo semanal explicando el avance del proyecto. Me guiaré por los puntos que pongo a continuación pero puede ser que en la medida que vaya desarrollando necesite modificar, eliminar o adicionar algún paso.

1. Hacer un proyecto de ejemplo. Haremos un proyecto en python que sea una aplicación web que nos permita registrar y listar tareas que se almacenarán en una base de datos mongodb.
Incluirá la configuración para desplegar en kubernates.
2. Crearemos el esqueleto de nuestro PAAS. Se configurará el docker y se pondrá a punto el ambiente de trabajo.
3. Haremos el webhook que nos permita estar pendiente a los cambios del repositorio del proyecto a desplegar.
4. Hacer los microservicios que se encargará de cada una de las tareas.
5. Integración de todo el proyecto y ajustes finales.

### Conclusión

Espero que me acompañen en este viaje. En este sueño de crear mi propio PAAS y ojalá en el futuro se pueda convertir en un proyecto real. Cualquier duda o sugerencia me gustaría que me las comuniquen y quizás podamos construir una solución entre todos.