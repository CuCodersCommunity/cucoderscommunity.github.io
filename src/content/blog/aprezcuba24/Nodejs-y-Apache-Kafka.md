---
title: "Nodejs y Apache Kafka"
pubDate: "Sun May 14 2023"
image: ""
username: "aprezcuba24"
categories: ["tutorials","software"]
description: "En el desarrollo de aplicaciones basados en microservicios, uno de los puntos claves es la transmisión de mensajes entre todos los componentes. Y es ahí donde Apache kafka entra en acción. Kafka fue desarrollada por LinkedIn es open source."
canonicalUrl: "https://i.pinimg.com/564x/c2/12/4b/c2124be06ded5d423a398df32a6d41c9.jpg"
---

## Introducción

El desarrollo de aplicaciones basado en microservicios es una de las arquitecturas que más se utiliza en estos momentos. Básicamente lo que propone es la creación de aplicaciones a través de la conjunción de pequeñas sistemas que interactúan entre ellas para cumplimentar las reglas del negocio.

Con una arquitectura de este tipo es lógico pensar que la comunicación entre todas las aplicaciones debe ser óptimo y es ahí donde entra Apache Kafka. Kafka es una plataforma de transmisión de mensajes. Fue desarrollada por LinkedIn y fue liberada como software open source. Dentro de LinkedIn es capaz de manejar un promedio de 1,4 billones de mensajes por día.

## Herramientas.

En este trabajo nos proponemos crear una aplicación sencilla hecha con nodejs que tiene dos scripts, uno que envía un mensaje a kafka y otro script que consumen el mensaje y lo escribe en los logs. Es el clásico ejemplo hola mundo, con lo mínimo que se puede implementar para entender la filosofía.

En el ejemplo se usarán las siguientes herramientas.

  - Apache Kafka https://kafka.apache.org/.
  - Kafka UI: https://docs.kafka-ui.provectus.io/overview/readme. Esta herramienta nos permite ver visualmente que ocurre en el cluster de kafka, ver los mensajes que se envían, consumidores, tópicos, etc.
  - Nodejs: Lenguaje de programación que se usará. Para los objetivos de este trabajo podría ser cualquiera.
  - Docker: Todas estas herramientas se montaran como contenedores de dockers.
  - Docker compose: Se usará para configurar todos los contenedores.
  - VSCode: Esto es opcional, pero escogí este IDE de desarrollo porque me facilita el trabajo con Docker.

## Configuración de Docker.

Para configurar docker usaremos dos ficheros: Dockerfile y docker-compose.yml

```
version: '3'
services:
  app:
    build: .
    command: sleep infinity
    volumes:
      - ..:/app
    links:
      - kafka
      - kafka-ui
  kafka:
    image: 'bitnami/kafka:latest'
    environment:
      - ALLOW_PLAINTEXT_LISTENER=yes
  kafka-ui:
    container_name: kafka-ui
    image: provectuslabs/kafka-ui:latest
    depends_on:
      - kafka
    ports:
      - 8080:8080
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092

```

En este fichero se configuran tres contenedores; **app**, que es donde estará el código fuente; **kafka** y **kafka-ui**.

Algo que podemos aclarar es que docker-compose nos crea una red virtual entre todos los contenedores. Significa que todos los contenedores se podrán comunicar entre ellos. Por ejemplo desde nodejs podemos acceder al servidor kafka usando el siguiente dominio y puerto **kafka:9092**, el dominio es kafka porque así le pusimos como nombre al contenedor.

El fichero Dockerfile en este caso es muy sencillo. Se crea un contenedor basado en node:16 donde se ejecutará la aplicación que en nuestro caso solo serán dos scripts.

## Código fuente de la aplicación.

Para interactuar con kafka usaremos la librería kafkajs, https://kafka.js.org/.

La aplicación está compuesta por tres ficheros:

  - configure.js: Donde se configura la conexión a kafka
  - producer.js: Script que envía los mensajes a kafka.
  - consumer.js: Script que estará a la espera de los mensajes entrantes.

## configure.js

En este fichero creamos un cliente de kafka que será usado tanto por consumer.js como por el producer.js.

```
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
})

module.exports = { kafka }
```

## producer.js

Este es el código más simple que podemos hacer . Solamente enviamos un mensaje a un topic (test-topic).

```
const { kafka } = require('./configure')

async function start() {
  const producer = kafka.producer()

  await producer.connect()
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })
}

start()
```

## consumer.js

Script que se queda a la espera de los mensajes que están en el topic (test-topic)

```
const { kafka } = require('./configure')

async function start() {
  const consumer = kafka.consumer({ groupId: 'test-group' })
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      })
    },
  })
}
start();
```

## Conclusión.

El ejemplo que se muestra es muy sencillo. En este repositorio podrá ver el código fuente y clonarlo y probarlo.

https://github.com/aprezcuba24/kafka