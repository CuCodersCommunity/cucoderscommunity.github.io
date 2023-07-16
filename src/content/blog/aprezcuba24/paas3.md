---
title: "Creando mi propio PAAS, al estilo Heroku, parte 3 (Arquitectura y primeros microservicios)"
pubDate: "Sun Jun 27 2023"
image: "https://i.pinimg.com/564x/7a/24/db/7a24db5cf388617f86b0b1462120eea3.jpg"
username: "aprezcuba24"
categories: ["tutorials","software"]
description: "Este es el tercer artículo de la serie \"Creando mi propio PaaS\". Aquí comenzamos con el desarrollo real del sistema. Presentaremos la arquitectura e implementaremos los primeros microservicios."
canonicalUrl: ""
---

# Introducción.

Este es el tercer artículo de la serie **Creando mi propio PaaS**. Hasta ahora hemos visto dos artículo.

## [Presentando la propuesta de proyecto](https://cucoders.dev/publicaciones/aprezcuba24/paas1/) 

Este fue el primer artículo, donde se explicó qué es lo que se iba a implementar y cuál va a hacer el alance de la prueba de concepto.

## [Proyecto de ejemplo](https://cucoders.dev/publicaciones/aprezcuba24/paas2/)

En este segundo artículo se presentó el ejemplo de un proyecto desarrollado en python y se le adicionó la configuración para ser desplegado en **kubernates**. Hacer este proyecto nos sirvió para tener un norte de qué es lo que nuestro **PaasS** debe hacer. Que básicamente es empaquetar una aplicación para ser desplegada en kubernates.

## Artículo actual.

En el presente artículo mostramos la arquitectura del proyecto y qué herramientas usamos en el desarrollo de la solución, pero antes que todo les comparto el link donde está el código fuente de lo que ya se ha implementado.

[Repositorio del proyecto](https://github.com/aprezcuba24/cupaas)

En el repositorio se creó el tag **0.0.1**, que tiene todo el código que veremos en este artículo. Si analiza con detenimiento el historial del git, verá todos los commits que fui haciendo para lograr este primer resultado. Con este quiero decirles que el desarrollo de proyectos no es un camino lineal y como programador se tiene que ir haciendo iteraciones para lograr lo que se desea.

# Desarrollo

La función principal del PaaS es desplegar de forma automática los proyectos de nuestros usuario. Para esto debe estar pendiente de los eventos que ocurran en los repositorios y ejecutar un conjunto de operaciones cada vez que exista nuevo código a desplegar. 

Como las operaciones son varias y muchas pueden durar bastante tiempo, cada etapa del proceso fue programado como un **microservicio**. Cada uno de ellos tiene una única responsabilidad y cuando termina pasa el flujo de ejecución al siguiente **microservicio**. Básicamente se sigue la arquitectura de **Tubería y filtros**.

<img src="https://live.staticflickr.com/65535/53001394880_7a6370837f_b.jpg">

Los filtros, que es donde implementamos nuestro código fuente, son funciones hechas con python. Y la tubería, que no es más que el mecanismo que usamos para el envío de mensajes entre los microservicios, se hace con **kafka**.

## ¿Por qué usar la arquitectura **Tubería y filtro** y Kafka?

En la figura donde se muestra la arquitectura, se puede apreciar que se deben ejecutar varios procesos para lograr desplegar un proyecto en kubernates. Algunos de ellos, como pueden ser, descargar el código el código fuente, crear la imagen de docker o publicar la imagen de docker en un repositorio, pueden ser potencialmente largos y propensos a fallos, pues debemos interactuar con sistemas externos que no podemos controlar con nuestro código.

Si hiciéramos todo este proceso en un solo script a base de código, tendríamos varios retos que sería difícil de controlar.

1. Podría fallar en cualquier parte del proceso y sería complicado reiniciarlo en el punto exacto donde falló. Nos obligaría a gestionar muchas variables de estado para determinar qué hemos logrado terminar y que falta todavía por hacer.

2. Cómo llevar la cantidad de re-intentos. No tendría sentido hacer lo mismo una y otra vez y que siempre falle. Si algo ha fallado una cantidad de terminada de veces lo más sensato es abortar la operación y que un especialista del sistema analice que es lo que pasa.

3. Cuando tenemos un fallo, en muchas ocasiones, no es prudente comenzar automáticamente con un nuevo intento porque lo más seguro es que vuelva fallar. Por ejemplo vamos a descargar el código y hay un error de red, lo lógico es esperar un tiempo antes de volver a hacerlo.

Estos problemas y otros que se pueden dar, se pueden solucionar usando un sistema de mensajería, como es el caso de Kafka. Usarlo nos libera de la responsabilidad  del control de los mensajes desde nuestro código fuente y solo nos preocupamos en ejecutar las acciones que corresponden según el mensaje que nos llega. Les sugiero que busquen información sobre Kafka y así conocerá el potencial que tiene esta herramienta.

## Webhook

Lo primero que debe hacer nuestro sistema es estar preparado para recibir mensajes desde github, los conocidos como **webhook**. Cada vez que ocurre un evento, por ejemplo un **PUSH**, en uno de los repositorios que debemos observar, el PaaS debe automáticamente comenzar con el despliegue.

En el PaaS se creó un endpoint que recibe request HTTP por método POST. En el repositorio del proyecto que queremos desplegar, debemos ir a ([settings/webhooks](https://docs.github.com/en/webhooks-and-events/webhooks/creating-webhooks)) y configurar la url de este endpoint. Luego de esto cada vez que subamos nuevo código se llamará a ese endpoint y comenzará el despliegue.

Durante el proceso de desarrollo, la aplicación se ejecuta localmente en nuestra PC, por lo que la url que tenemos tiene la forma de http://localhost. Esta url no nos sirve para configurar el webhook en github porque es local. Para resolver este problema podemos utilizar la herramienta [Ngrok](https://ngrok.com/) que nos da una url en internet que apunta a la url local en nuestra PC.

Desde el punto de vista técnico, un webhook debe ser un endpoint que responda lo más rápido posible, es decir, deberíamos evitar hacer operaciones pesadas que demoren la respuesta a github en este caso. Para resolver, esto lo que hacemos es enviar un mensaje para kafka con el request y dejar el procesamiento de información a otro proceso.

[código del webhook](https://github.com/aprezcuba24/cupaas/blob/main/app/webhook.py)

## Workers

Para poder recibir los mensajes que vienen de Kafka, necesitamos tener un script conectados permanentemente al bus de mensajes. A este tipo de scripts que se ejecutan constantemente se le conoce con el nombre de **workers**.

Para la interacción con Kafka se utiliza la librería [aiokafka](https://github.com/aio-libs/aiokafka), que es un wrapper de [kafka-python](https://github.com/dpkp/kafka-python), que me me permite hacer los workes asíncronos. En nuestro caso esto es fundamental porque van a hacer varios workers que se van a ejecutar de forma simultánea.

Los workers son arrancados con el script **start_workers.py** y en este link puede ver el código fuente.

[start_workers.py](https://github.com/aprezcuba24/cupaas/blob/main/start_workers.py)

## Workers implementados

En estos momentos solo se han implementado dos workers. Lo fundamental en esta iteración del proyecto era validar la arquitectura, definiendo la forma que va a tener cada worker y de que forma se van a mandar los mensajes entre ellos.

Un worker tiene la siguiente extructura.

```
from app.kafka import pipe


@pipe(<topic input>, <topic_output>)
async def <worker_name>(data, context):
    return <Value_to_next_pipe>
```

En esencia un worker es una función con el decorador **pipe**, que tiene la función de pasarle a la función (worker) los datos que lleguen en el topic **topic_input** de kafka. Este parámetro en el decorador es obligatorio. 

Por otro lado si se define un valor para el parámetro **topic_output** y además el worker devuelve un valor distinto de **None**, el decorador envía ese dato para ese topic de kafka. 

Este decorador hace la función de la **Tubería**, recibe un dato por el topic de entrada y la respuesta del worker los pasa para un topic de salida, que será escuchado por otro worker.

El código del decorador **pipe** lo puede ver en el siguiente link.

[Código del pipe](https://github.com/aprezcuba24/cupaas/blob/main/app/kafka/__init__.py)

Los workers que se han implementado hasta ahora son los siguientes.

## [github_events](https://github.com/aprezcuba24/cupaas/blob/main/app/functions/github_events.py)

Este es el primer worker que se ejecuta. Su función es, basado en los datos que se recibieron desde github, obtener los datos del proyecto registrado en la base de datos del PaaS y crear el primer payload  de datos que comenzará a transitar por los workers.

## [download_code](https://github.com/aprezcuba24/cupaas/blob/main/app/functions/download_code.py)

Este es el segundo worker. Su función es descargar el código fuente del proyecto, copiarlo en una carpeta en la máquina local y pasar al siguiente worker los datos que se recibieron unido al nombre y dirección de la carpeta que contiene el código fuente.

# Conclusión

Hasta este momento tenemos definida la arquitectura. Se ha implementado dos workers que nos permitió validarla. Localmente he hecho varias pruebas manuales subiendo código a un repositorio y viendo como el PaaS ejecuta todo el proceso.

Además se crearon pruebas automáticas a las funciones que ya se han implementado. Lo que nos permite mantener un desarrollo estable y minimizar la posibilidad de errores.

En el repositorio puede abrir **issue** si lo desea y por ahí podemos ver cualquier mejora o sugerencia.