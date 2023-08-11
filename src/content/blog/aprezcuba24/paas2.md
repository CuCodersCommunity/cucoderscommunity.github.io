---
title: "Creando mi propio PAAS, al estilo Heroku, parte 2 (Proyecto de ejemplo)"
pubDate: "Sun Jun 20 2023"
image: "https://i.pinimg.com/564x/7a/24/db/7a24db5cf388617f86b0b1462120eea3.jpg"
username: "aprezcuba24"
categories: ["tutorials","software"]
description: "Este es segundo artículo de la serie creando mi propio PAAS. Aquí crearemos un proyecto sencillo en python y veremos la configuración necesaria para desplegarlo con kubernates."
canonicalUrl: ""
---

Este es el segundo artículo de una serie donde pretendo implementar un PAAS (Plataforma como servicio). Haciendo lo que se conoce como **build in public**. En el link que aparece debajo, puede ver el artículo anterior.

https://cucoders.dev/publicaciones/aprezcuba24/paas1/

Además en este repositorio podrá ver el código de ejemplo.

https://github.com/aprezcuba24/python-kubernates-example 

## Objetivos

En esta segunda entrega mostramos un proyecto de ejemplo, de una aplicación desarrollada con **Python** y **mongodb**. Es una aplicación sencilla, solo tendrá dos endpoint, uno para listar tareas y otro para crearlas. Donde cada tarea tendrá, id y task. El campo task es de tipo texto.

La aplicación en si no tiene nada de especial, la única novedad es que tendrá el fichero de configuración que permite desplegarla con kubernates. Como no es aconsejable instalar kubernates directo en el computadora personal lo que haremos es usar minikube.

## ¿Por qué desarrollar primero este proyecto de ejemplo?

El problema es que nuestro PAAS no tiene la responsabilidad de mantener o monitorear la ejecución de las aplicaciones en los servidores, para esto se usa kubernates. Nuestro PAAS en última instancia lo que hará es empaquetar la aplicación con toda la configuración necesaria para que kubernates la pueda desplegar.

Por lo tanto este proyecto de ejemplo nos servirá para definir qué es lo que nos deben dar los desarrolladores y a donde debemos llegar con nuestro PAAS.

## ¿Qué debe conocer antes de comenzar?

Para que pueda desarrollar los pasos que explicamos en el artículo. Debe tener conocimientos de las siguientes tecnologías.

**Minikube**: Que es la versión de kubernates que se usa para probar en la pc local.

**Kubectl**: Es la herramienta que nos permite interactuar con un cluster de kubernates.

Estas dos herramientas deben estar instaladas y configuradas en la pc para poder hacer las pruebas.

## Proyecto

La aplicación está desarrollada con Flask y como dije anteriormente solo tiene dos endpoits.

```
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://host.minikube.internal:27017/dev"
mongo = PyMongo(app)
db = mongo.db
```

La url “mongodb://host.minikube.internal:27017/dev” es la dirección donde estará nuestra base de datos. Esto depende de minikube y en nuestro proyecto final no deberíamos tener esta dirección hardcode. Nuestro PAAS deberá inyectar esta información a través de variables de entorno.

```
@app.route("/")
def get_all_tasks():
    tasks = db.task.find()
    data = []
    for task in tasks:
        item = {"id": str(task["_id"]), "task": task["task"]}
        data.append(item)
    return jsonify(data=data)


@app.route("/", methods=["POST"])
def create_task():
    data = request.get_json(force=True)
    db.task.insert_one({"task": data["task"]})
    return jsonify(message="Task saved successfully!")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
```

En el código anterior tenemos los dos endpoints y la lógica para arrancar el servidor web con Flask. El código para ejecutar el servidor no es el adecuado para un entorno de producción pero para el ejemplo que estamos desarrollando es suficiente.

# Kubernates

Para desplegar la aplicación tenemos que hacer lo siguiente.

1. Crear una imagen de docker con el código de nuestra aplicación.
2. Publicar la imagen en un repositorio de forma que kubernates la pueda descargar a la hora de hacer el despliegue.
3. Configurar los servicios.
4. Desplegar la aplicación.

### Docker image.

Lo primero es crear el fichero Dockerfile. En nuestro ejemplo este fichero es realmente sencillo, solo resaltar dos partes. Primero se copia el fichero de las dependencias y se luego se instalan. Después se copia el código fuente de la aplicación que solamente es un fichero llamado app.py.

```
FROM python:3.8.6-slim

RUN pip3 install --upgrade pip

WORKDIR /app

COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY ./app.py ./app.py

EXPOSE 5000

ENTRYPOINT ["python", "app.py"]
```

Lo que sigue es crear y publicar la imagen. En un entorno real se debería publica la imagen en un repositorio que sea visible al kubernates que estemos utilizando, por ejemplo DockerHub https://hub.docker.com/, pero en nuestro caso, para evitar tener que interactuar con sistemas externos, cargaremos la imagen directamente en minikube.

Para crear la imagen nos paramos en en el directorio del proyecto y ejecutamos el comando

```
docker build . -t <username>/<project>:<tag>
```

- username: Sería el nombre de nuestro usuario o empresa.
- project: nombre del proyeto
- tag: Versión del proyecto.

En nuestro caso sería

```
docker build . -t aprezcuba24/example:1.0
```

Lo siguiente, subir la imagen ya creada en minibuke

```
minikube image load aprezcuba24/example:1.0
```

### Configurar la aplicación.

Para poder desplegar la aplicación en kubernates, necesitamos indicarle cuáles son los componentes de nuestra aplicación. Existe distintas formas de hacerlo. En nuestro ejemplo lo haremos usando un fichero YML.

Me gustaría decir una vez más que esta configuración que mostraremos a continuación es simple. Un despliegue real a producción debería tener en cuenta otros aspectos.

#### Namespace

```
apiVersion: v1
kind: Namespace
metadata:
  name: python-app
```

Un namespace en kubernates se hace con el objetivo de agrupar varios servicios bajo el mismo nombre. Cada proyecto debería tener su propio namespace.

#### Pod del proyecto.

```
apiVersion: v1
kind: Pod
metadata:
  name: backend
  namespace: python-app
  labels:
    app.kubernetes.io/name: backend-app
spec:
  containers:
  - name: backend
    image: aprezcuba24/example:1.0
    ports:
      - containerPort: 5000
        name: backend-port
```

Aquí definimos un Pod para alojar nuestra aplicación. Se indica el namespace al que pertenece. Y en la sección **spec** configuramos el contenedor que se va ejecutar dentro del Pod, que sería la imagen que creamos de nuestro proyecto.

#### Servicio de la aplicación.

```
apiVersion: v1
kind: Service
metadata:
  namespace: python-app
  name: backend-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: backend-app
  ports:
  - name: backend-service-port
    protocol: TCP
    port: 80
    targetPort: backend-port
```

Para poder interactuar con los Pods se necesita definir un **Service**. En la sección **selector** se indica el nombre del Pod que está vinculado al servicio.

#### Pod de la imagen de mongo.

```
apiVersion: v1
kind: Pod
metadata:
  name: mongo
  namespace: python-app
  labels:
    app.kubernetes.io/name: mongo
spec:
  containers:
  - name: mongo
    image: mongo:6.0.2
    ports:
      - containerPort: 27017
        name: db-port
```

La configuración de este Pos es similar a la del Pod de la aplicación. Lo único que cambia básicamente es el nombre de la imagen a utilizar.

#### Servicio de mongo.

```
apiVersion: v1
kind: Service
metadata:
  name: mongo
  namespace: python-app
spec:
  selector:
    app: mongo
  ports:
    - port: 27017
      targetPort: db-port
```

Configuración del servicio del mongodb.

La configuración del mongodb se hizo muy sencilla pero en producción no debería ser así porque se debe configurar un volumen para almacenar los datos. Así como está es muy probable que cuando se reconstruya la aplicación se pierda la base de datos y en producción este es algo que no debería pasar.

### Desplegar la aplicación

Lo que nos va quedando es desplegar la aplicación en minikube y lo haremos con el siguiente commando.

```
kubectl apply -f app.yml
```

Para ver la aplicación en el navegador ejecutamos.

```
minikube service backend-service -n python-app
```

## Conclusión

En este segundo artículo desarrollamos un proyecto de ejemplo que nos servirá de base para entender qué debe hacer nuestro PAAS, que en esencia es crear una imagen de docker con el proyecto a desplegar y crear el fichero de configuración para desplegar en kubernates.

En el artículo se introducen términos, como Pod, Service, etc que son de kubernates. Si quiere profundizar en estos temas por favor buscar información especializada.

En esta url podrá ver el código del proyecto de ejemplo.

https://github.com/aprezcuba24/python-kubernates-example 
