---
title: "Presentado Knative. El FaaS de kubernates."
pubDate: "Sun Aug 22 2023"
image: "https://miro.medium.com/v2/resize:fit:700/1*r9QDxPnX7FL35LSjUSXq2Q.png"
username: "aprezcuba24"
categories: ["tutorials","software"]
description: "Knative es una tecnología que corre sobre kubernates. Nos facilita la implementación de aplicaciones basadas en microservicios, implementando una plataforma FaaS. En el presente artículo veremos que es knative y un ejemplo sencillo de cómo usarlo."
---

Cuando conocí **AWS** y comencé adentrarme en la **computación en la nube**, realmente quedé maravillado. Hasta ese momento solo había implementado aplicaciones basado en los clásicos frameworks que existen para los distintos lenguajes pero la computación en la nube es otra cosa. En la nube el framework de desarrollo es los conjuntos de servicios que tiene implementado nuestro proveedor de servicios.

Los cubanos estamos bloqueados para usar **AWS** y me puse a investigar qué tecnologías open source existe que nos permitan implementar **cloud computing** y es ahí cuando empiezo a conocer **kubernates** y específicamente **knative**. Lo primero que tengo que alertar es que no podemos esperar que esta tecnología sea tan potente como **AWS** pero las facilidades que nos brindan realmente nos van a sorprender.

En este artículo me propongo a presentar **knative** y cuáles son los componentes fundamentales. Explicaré cómo funciona y mostraré un ejemplo sencillo.

Para empezar diremos de forma muy básica que es **kubernates**, que sirve como base para **knative**. Es un sistema basado en **contenedores**, que permite monitorear y administrar, un clúster de servidores de forma centralizada. Donde en cada nodo podemos tener corriendo una infinidad de servicios. Generalmente la tecnología que se utiliza para los contenedores es **Docker**. Kubernates automatiza el monitoreo de cada contenedor durante todo el ciclo de vida.

## ¿Qué es knative?

Por otro lado **knative** es una solución open source que funciona sobre **kubernates**. Permite construir aplicaciones **serverless**, **basadas en eventos**. Básicamente nos brinda una plataforma **FaaS** (Fuctions as a Service), lo que facilita la creación de aplicaciones basada en **microservicios**.

## ¿Qué aporta knative a kubernates?

Una de funcionalidades fundamentales de kubernates es garantizar que los contenedores donde están corriendo nuestras aplicaciones nunca dejen de funcionar. Si un contenedor falla, generalmente por causa de un error de nuestro código, kubernates automáticamente vuelve a ejecutarlo y lo intentará tantas veces como lo tengamos configurado. Esto tiene sentido para aplicaciones monolíticas implementada en algún framework de cualquier lenguaje.

Cuando hacemos una aplicación basada en microservicios, donde una funcionalidad muy pequeña estará en su propio contenedor, el enfoque de kubernates no nos sirve porque vamos a tener contenedores corriendo todo el tiempo y que en realidad no lo estamos usando. Un contenedor corriendo es un servicio consumiendo memoria y recursos del servidor.

Veamos un ejemplo. Supongamos que tenemos un microservicio para enviar correos pero solo enviamos correos cuando un usuario se registra en nuestro sistema. No tiene sentido tener este microservicio todo el tiempo corriendo si solo es usado de vez en cuando. Y es aquí cuando knative es útil.

## Componentes de knative

Knative está formado por dos componentes.

### Serving

El **Serving** se encarga de crear, escalar y destruir los contenedores de nuestro sistema. Siguiendo con el ejemplo del microservicio de enviar correos. Supongamos que queremos enviar un correo y para esto invocamos el microservicio. Realmente lo que se hace es invocarse el componente **serving** de knative. Este primero verifica si hay algún contenedor ya creado, si no hay lo crea y luego le pasa la petición. 

Si existe muchas peticiones en un corto periodo de tiempo automáticamente el serving creará varias instancias del contenedor, lo escalará. 

Si pasado un tiempo no se recibe más peticiones, el serving comenzará a destruir todos los contenedores y así libera los recursos del servidor. Este enfoque nos permite tener muchos contenedores “corriendo” en un mismo servidor.

### Eventing

Si un contenedor no existe, no ha sido creado, no es capaz de responder a ningún comando. No podemos decirle al microservicio de enviar un correo que envíe un correo, si este no está creado. En este punto necesitamos un servicio extra al que le podamos informar que queremos hacer y nos abstraiga del proceso de mandar a crear el contenedor y pasarle la información, además se podría cerrar el proceso actual y confiar de que el correo se enviará.

Incluso se puede dar el caso que el microservicio de enviar correos no esté ni siquiera configurado en el cluster pero tenemos que tener la confianza que cuando se configure automáticamente se creará y se le pasara el mensaje.

Toda esta magia se logra a través del componente **eventing**. Para esto tiene diferente tipos de eventos como puede ser un simple http o integración con **brokers** tales como kafka o RabbitMQ.

## Ejemplo

Para poder ilustrar un poco más lo que estamos haciendo veamos un ejemplo sencillo. Crearemos dos microservicios le llamaremos:

- **Web** que recibirá peticiones http, responderá un un response y en el intermedio lanzará un mensaje que será capturado por otro microservicio.
- **Process** estará a la espera del mensaje que envía el microservicio web y lo único que hará es escribir el mensaje en el los logs.

Los dos microservicios se implementarán en python pero se podría usar cualquier lenguaje, incluso cada microservicio puede estar implementado en un lenguaje distinto.

### Pre-requisitorios

Si quiere hacer pruebas tiene que tener un servidor con kubernates y knative configurado. También puede hacer pruebas locales usando **minikube** y sobre minikube configurar knative. El proceso de instalación y configuración del todo el entorno es realmente complicado y más si antes no ha utilizado kubernates. Explicar este proceso se escapa del alcance del artículo.

También debe tener configurado en la computadora: kubectl, kn y kn func

### Crear las dos funciones

Un servicio de knative es un contenedor que sea capaz de recibir peticiones http. No importa que el microservicio sea para responder a un evento de kafka por ejemplo, la forma que tiene knative de invocar un contenedor es a través de peticiones http.

Con el objetivo de facilitar el desarrollo ya existe **wrappers** de contenedores que tienen la funcionalidad común, es decir, reciben peticiones http y el request se lo pasan a una función **main** que debe estar implementada en un fichero con el nombre **func.py**. Y estos wrappers pueden ser de dos tipos, **http** o **cloudevent**, por defecto son de tipo http.

### Crear el microservicio para la web

```
kn func create -l python web
```

Aquí le estoy diciendo que quiero crear una nueva función con el nombre **web** y que la implementaremos en python. Esto me crea una carpeta con varios ficheros y entre ellos el fichero `func.py` que le pondremos el siguiente código.

```
from parliament import Context
import json
import os
from cloudevents.conversion import to_binary
from cloudevents.http import CloudEvent
import requests


def send_event(K_SINK):
    attributes = {
        "type": "dev.knative.foo.bar",
        "source": "https://example.com/event-producer",
    }
    data = {"message": "Hello World microservice"}
    event = CloudEvent(attributes, data)

    # Creates the HTTP request representation of the CloudEvent in binary content mode
    headers, body = to_binary(event)

    requests.post(K_SINK, data=body, headers=headers)


def main(context: Context):
    print("Request data", context.request)
    if K_SINK:
        send_event(K_SINK)

    return json.dumps({"hello": "world"}), 200
```

La función **main** es la primera que se ejecuta y luego llama la función **send_event**, si la variable de entorno **K_SINK** existe. Después veremos qué es esta variable.

La función **send_event** lanza un evento que tiene dos campos:

- **attributes**: Básicamente son metadatos para clasificar lo eventos.
- **data**: Los datos, los que viajan en el evento.

### Crear el servicio de proceso

En este caso tenemos que indicar que el servicio es de tipo **cloudevents**.

```
kn func create -l python process -t cloudevents
```

Y el código que tendría sería el siguiente. Lo único que hace es poner un mensaje en los logs.

```
from parliament import Context, event


@event
def main(context: Context):
    print("Event data", context.cloud_event.data)
    return context.cloud_event.data
```

A partir de cada función se necesita crear una imagen de docker y luego subirla a un repositorio de imágenes.

Construir la imagen se haría con el siguiente comando.

```
kn func build
```

Este comando crea una imagen de docker en nuestra computadora que luego podemos subir a un repositorio con este comando.

```
docker push aprezcuba24/example-web:latest
```

Algo similar hay que hacer para la otra función.

## Configurar todo en kubernates.

Primero configurar un namespace en kubernates para crear todo en el.

```
apiVersion: v1
kind: Namespace
metadata:
  name: microservices
```

Configurar el servicio web

```
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: web
  namespace: microservices
spec:
  template:
    spec:
      containers:
        - image: docker.io/aprezcuba24/example-web:latest
```

Solo con hacer esto ya nuestro servicio es capaz de recibir peticiones http porque por defecto todos los hacen.

Configurar el servicio de proceso.

```
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: process
  namespace: microservices
spec:
  template:
    spec:
      containers:
        - image: docker.io/aprezcuba24/process:latest
```

Hasta este punto tenemos un namespace y dos servicios creados. Faltaría configurar de que el evento que lanza el servicio web, lo reciba el servicio de proceso y esto lo hacemos con otro recurso que se llama **SinkBinding**.

```
apiVersion: sources.knative.dev/v1
kind: SinkBinding
metadata:
  name: sink-web
  namespace: microservices
spec:
  subject:
    apiVersion: serving.knative.dev/v1
    kind: Service
    name: web
  sink:
    ref:
      apiVersion: serving.knative.dev/v1
      kind: Service
      name: process
```

Esta configuración hace lo siguiente. Al servicio web le crea una nueva variable de entorno llamada **K_SINK** que tendrá la url del servicio de proceso. Por lo tanto cuando en la web hacemos esto.

```
requests.post(K_SINK, data=body, headers=headers)
```

En la práctica lo que estamos haciendo es haciendo una petición http al servicio de proceso con los datos de un evento. Pero el servicio web y el de proceso se abstraen de a quién envío y de quién recibe los eventos. El link entre ambos lo hace **SinkBinding**.

## Mejora.

Una configuración como esta a pesar de que funciona tiene debilidades. Primero los mensajes serán enviados a un único servicio. Que tal si queremos que varios microservicios hagan cosas diferentes basado en el mismo evento. Lo otro es que no tendríamos una forma de monitorear qué eventos se envían, como se procesaron, tener un control de fallo, etc.

Para resolver los problemas anteriores tendríamos que usar un **broker**. En knative tenemos integración con muchos de ellos pero el que más se usa es **kafka**. Usamos un broker el sistema funcionaría de la siguiente forma. El microservicio web envía el evento al broker y todos los microservicios que estén escuchando reaccionarán basado en los filtros que implementemos según los **atributos** del evento.

Para verlo en funcionamiento vamos a eliminar la configuración del **SinkBinding** y lo cambiaremos por lo siguiente.

Primero creamos un **broker**

```
apiVersion: eventing.knative.dev/v1
kind: Broker
metadata:
  name: default
  namespace: microservices
```

Este es el broker más sencillo que podemos crear. Internamente knative utiliza uno que se llama **MTChannelBasedBroker** que funciona en memoria. En un entorno de producción no se aconseja su uso y sería bueno sustituirlo por **kafka** por ejemplo.

Luego configuramos un **Trigger**

```
apiVersion: eventing.knative.dev/v1
kind: Trigger
metadata:
  name: process-trigger
  namespace: microservices
spec:
  broker: default
  filter:
    attributes:
      type: dev.knative.foo.bar
      source: https://example.com/event-producer
  subscriber:
    ref:
      apiVersion: serving.knative.dev/v1
      kind: Service
      name: process
```

Aquí estamos diciendo que llame al servicio **Process** cada vez que tengamos un evento en el broker default y que ese evento tenga como atributos

```
  attributes:
      type: dev.knative.foo.bar
      source: https://example.com/event-producer
```

que es lo que ponemos a la hora de lanzar el evento en el servicio web.

Finalmente solo faltaría crear un nuevo **SinkBinding** pero ahora en vez de conectar directamente el servicio receptor con el servicio emisor, conectamos al emisor al broker.

```
apiVersion: sources.knative.dev/v1
kind: SinkBinding
metadata:
  name: sink-web
  namespace: microservices
spec:
  subject:
    apiVersion: serving.knative.dev/v1
    kind: Service
    name: web
  sink:
    ref:
      apiVersion: eventing.knative.dev/v1
      kind: Broker
      name: default
```
## Conclusión

El objetivo de este artículo fue presentar knative y como con esta tecnología podemos crear un sistema basado en microservicios. Donde nuestro código lo único que hace es responder a las acciones concretas y deja todo el proceso de orquestación a kubernates y knative.

Es una tecnología open source que puede ser utilizada en el entorno cubano, donde no tenemos acceso a cloud computing como AWS, google cloud, azure, etc.