---
title: "CoffeeTime"
pubDate: "Sun Mar 10 2024"
image: "https://live.staticflickr.com/65535/53579702890_edeb445645_z.jpg"
username: "aprezcuba24"
categories: ["software", "tutorials"]
description: "Trabajo en una oficina donde nos gusta tomar café, algo normal entre los programadores 😁. Pero como buen programador también nos gusta resolver problemas y automatizar procesos 😎.
El problema era ¿Quién hace el café? 😈"
---

Trabajo en una oficina donde nos gusta tomar café, algo normal entre los programadores 😁. Pero como buen programador también nos gusta resolver problemas y automatizar procesos 😎.

**El problema era ¿Quién hace el café?** 😈

Lo primero que se nos ocurrió fue crear un grupo de telégram donde usando el imoji ``dice`` 🎲 cada miembro lanza un dado y el que menos punto saque es el que tiene que hacer el café 😏.

Como es lógico hay miembros que hacen más café que otros y eso es bueno porque aumenta la competitividad y tomar un café se convierte en algo divertido.

Basado en esto se nos ocurrió hacer un bot que hace lo siguiente.

- Se registran en el bot todos los usuarios que hacen café en el grupo de telégram.
- Todos los días a las 9:30 de la mañana y a las 1 de la tarde, el bot llamará a todos los miembros a que tiren el dado para ver quién hace el café.
- Cuando comienza el juego, el bot registra el valor de cada dado lanzado por los usuarios.
- Cuando todos los usuarios lancen el dado o manualmente se cierra el juego, el bot debe decir el ganador (o perdedor como lo prefieran) y si hay empate indicar los usuarios que deben volver a jugar en una nueva ronda.

Esto es groso modo las funcionalidades fundamentales que tiene el bot.

## Tecnologías utilizadas.

Todo el sistema fue desplegado en **AWS**. El uso de AWS tiene muchas ventajas. El costo puede ser muy económico o nulo porque la capa gratuita es muy generosa. Se paga por lo que se usa y el bot usa muy poco.

**Lambdas** El bot en si es una **lambda url**. Las lambdas siempre necesita un ejecutor, es decir, un evento que haga que se ejecuten. Lo más tradicional es usar por ejemplo **api gateway** e invocar las lambdas a través de http, pero las lambdas url va un paso más allá, no nos hace falta api gateway para ejecutarlas a través de http. La propia lambda url ya incorpora una url. Esto nos garantiza que sea más fácil de gestionar y configurar. Como es lógico las lambdas url no son convenientes en todos los escenarios, pero en nuestro caso viene como anillo al dedo.

**EventBridge (CloudWatch Events)** Es un servicio de AWS que nos permite ejecutar tareas periódicas. La tarea en este caso es otra lambda, que ya no es una lambda url, porque no hace falta acceder a ella vía http, sino que será ejecutada por un **schedule**. Básicamente se configura cuándo se debe ejecutar la lambda en cuestión. En nuestro caso será todos los días, de lunes a viernes, a las 9:30 de la mañana y 1 en punto de la tarde.

**DynamoDB** es una base de datos muy ligera que sigue básicamente el esquema **key => value**. Como se puede apreciar es muy sencilla pero para el objetivo del proyecto es suficiente.

**Serverles framework** Es una tecnología que nos permite gestionar de forma sencilla todo el proceso de vida de una aplicación serverless. Todo el proyecto se configura usando ficheros yml y SF nos permite desplegar de forma rápida y sencilla la aplicación en la infraestructura de AWS.

**Python** El código del proyecto está en este lenguaje. SF soporta varios lenguajes, es decir, es agnóstico al lenguaje de programación, pero en Python tenemos la librería **python-telegram-bot** que para mi es la mejor para crear bot de telegram.

**Github** es muy amigable para proyectos **opensource** y este lo es. En esta url puedes encontrar todo el código fuente del bot https://github.com/aprezcuba24/coffe_time_bot 
Además en Github uso los **Github actions**. Se utiliza para implementar los pipeline de despliegues.

## Conclusión
Buscar un problema sencillo y darle solución es un ejercicio de aprendizaje importante en nuestra formación continua como desarrollador. Tecnologías gratis para hacer estos proyecto existen muchas y sin duda AWS es un ejemplo.

Por otro lado el desarrollo de bots de telégram es relativamente sencillo. Existe mucha documentación y espero que el código fuente de este proyecto les sea útil.