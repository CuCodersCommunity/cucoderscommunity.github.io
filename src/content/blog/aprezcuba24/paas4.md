---
title: "Creando mi propio PAAS, al estilo Heroku, parte 4 (Final)"
pubDate: "Sun Jul 5 2023"
image: "https://i.pinimg.com/564x/7a/24/db/7a24db5cf388617f86b0b1462120eea3.jpg"
username: "aprezcuba24"
categories: ["tutorials","software"]
description: "Este es el artículo final de la serie “Creando mi propio PaaS”. Se analizará como quedó implementado el proyecto. Y tendremos un anexo un poco extenso, donde veremos cómo funciona y qué genera cada uno de los workers."
canonicalUrl: ""
---

# Introducción.

Este es el artículo final de la serie **Creando mi propio PaaS**. Como es el último artículo, haremos un resumen de todo lo que que se ha construido. Cuáles son los cambios en la arquitectura con respecto al artículo anterior. Y en las conclusiones explicaremos qué otras cosas se deberían implementar para crear un proyecto real que se pueda llevar a producción.

## Artículos anteriores.

- [Presentando la propuesta de proyecto](https://cucoders.dev/publicaciones/aprezcuba24/paas1/) 
- [Proyecto de ejemplo](https://cucoders.dev/publicaciones/aprezcuba24/paas2/)
- [Arquitectura y primeros servicios](https://cucoders.dev/publicaciones/aprezcuba24/paas3/)

## Repositorios

Todo el código del PaaS está en el repositorio https://github.com/aprezcuba24/cupaas. Siéntase libres de clonar el proyecto y hacer las pruebas que desee.

En este otro repositorio https://github.com/aprezcuba24/python-kubernates-example tiene un proyecto de ejemplo para simular lo que un cliente de nuestro PaaS quiere desplegar.

# Cambios en la arquitectura.

En el tercer artículo se explicó la arquitectura del proyecto. La arquitectura no debería cambiar mucho porque es la base sobre la cual estamos implementando. De todas maneras teniendo en cuenta las nuevas necesidades en muchas ocasiones hay que hacer pequeños ajustes.

## Cambios en la secuencia de workers.

Entre los workers a construir está **Create kubernates configuration**. En la cola de workers se había definido que se colocaría en la 6ta posición pero a la hora de implementar el worker **Create docker image** me hizo falta tener primero la configuración. Por lo tanto moví el worker **Create kubernates configuration** para la 4ta posición.

## Cambios en el decorador “pipe”

En el artículo anterior se describió que para configurar el **pipeline** a cada worker se le debía poner el decorador

```
@pipe(<topic input>, <topic_output>)
```

Este decorador tenía dos funciones. Implementar la lógica de leer los mensajes desde **kafka** y saber a qué otro topic de kafka debe enviar el siguiente mensaje.

Hasta ese momento solo se tenía implementado dos workers y definir el topic de entrada y el topic de salida en el mismo **pipe** no era un problema pero cuando se comenzó a implementar el resto de los workers se convirtió en algo inviable. La razón era que no se tenía en un solo lugar la secuencia-orden de los workers.

Por lo tanto se hizo el siguiente cambio.

### Nueva definición del decorador **pipe**

```
from app.kafka import pipe

@pipe
async def <worker_name>(data, context):
    return <Value_to_next_pipe>
```

Ahora a cada worker solo se le pone el decorador **pipe** y no se define cual es el topic de entrada y cuál es el de salida.

Para definir el **pipeline** se hace en el fichero `start_workers.py`. En un array se pone todos los workers y el orden en este array es el pipeline. Quedando de la siguiente forma.

```
pipeline = [
    github_events,
    download_code,
    validate_configuration,
    create_docker_image,
    upload_docker_image,
    upload_to_kubernates,
    get_final_url,
]
```

# Cómo construir las imágenes y dónde almacenarlas.

Si fuéramos a construir un PaaS real, tendríamos que tener un repositorio donde publicar las imágenes de docker y un cluster de kubernates para desplegar las aplicaciones. Como lo que estamos haciendo es algo para probar y que en principio solo va a funcionar en nuestra PC local, no vamos a usar un repositorio de imágenes de docker y vamos a usar en vez de un servidor de kubernates, **minikube**.

En este punto tenemos que diferencias dos tipos de contenedores de docker. El **cupaas** en si, se ejecuta dentro de un contenedor de docker pero cuando se va a desplegar una aplicación de uno de nuestros usuarios también hay que crear contenedores docker para esas aplicaciones. En resumen son dos tipos de contenedores, los contenedores donde se ejecuta **cupaas** y por otro lado los contenedores que construye cupaas para desplegar las aplicaciones. Hago esta explicación para que se pueda entender de qué tipo de contenedor estoy hablando en cada caso.

Teniendo en cuenta lo anterior nos encontramos con el siguiente problema, desde **cupaas** no podemos construir imágenes porque dentro del contenedor donde se ejecuta nuestro código no tenemos docker instalado. Por otro lado **minikube** está instalado en la pc local y no dentro del contenedor.

### ¿Cómo ejecutar comandos en la pc local desde el interior de un contenedor?

No me quiero extender en los detalles, solo explicaré lo que hay que hacer pero sin abundar mucho en los detalles técnicos.

Dentro del proyecto se debe crear la carpeta **localmachine** y dentro se crean dos ficheros **pipe**. Esto es propio de linux, no tiene que ver con el "pipe" que creamos para nuestro decorador.

**Crear el Pipe de entrada**

```
mkfifo localmachine/input_pipe
```

**Crear el Pipe de salida**

```
mkfifo localmachine/output_pipe
```

En la computadora local, fuera del contenedor, ejecutamos el siguiente comando en la carpeta raíz del proyecto.

```
while true; do eval "$(cat localmachine/input_pipe)" &> localmachine/output_pipe; done
```

Este comando lo que hace es leer constantemente lo que se manda por el pipe de entrada, lo ejecuta en la pc y la salida la manda para el pipe de salida.

Básicamente lo que el PaaS hace es lo siguiente. Cada vez que se quiere ejecutar un comando en la pc local, se manda como texto para el pipe de entrada y se lee luego la respuesta en el pipe de salida.

La función que hace este proceso es la siguiente.

```
from pathlib import Path
from app.config import INPUT_PIPE, OUTPUT_PIPE


def run(command):
    input_fifo_path = Path(INPUT_PIPE)
    input_fifo_path.write_text(command)
    with open(OUTPUT_PIPE) as fifo:
        for line in fifo:
            yield line.strip()
```

Si desea abundar más en este tema puede ver este excelente hilo de [Stackoverflow](https://stackoverflow.com/questions/32163955/how-to-run-shell-script-on-host-from-docker-container)

# Workers con sus responsabilidades.

- **github_events**: Carga los datos iniciales que vienen desde github y sirve los datos iniciales para el pipeline.
- **download_code**: Descarga el código fuente del proyecto y lo pone en una carpeta accesible para el resto de los workers.
- **validate_configuration** Valida la configuración que se puso en el proyecto y genera la configuración para kubernates.
- **create_docker_image**: Crea la imagen de docker.
- **upload_docker_image**: Sube la imagen de docker para minikube para que pueda construir el proyecto.
- **upload_to_kubernates**: Manda a construir el proyecto en kubernates.
- **get_final_url**: Obtiene la url del proyecto ya desplegado y la pone en la consola para que se pueda visualizar en el navegador.

# Conclusión

Este es el artículo final de la serie creando mi propio PaaS. Con todo lo implementado hasta este momento tenemos un proyecto funcional que es capaz de desplegar un proyecto en kubernates. Pero para facilitar el desarrollo se obviaron varios puntos técnicos que serían de importancia en un proyecto real.

- No se ha hecho un control de errores, si el sistema falla no es posible recuperarlo.
- Solo se le dio soporte la despliegue de proyectos basado en python. La idea sería tener una colección amplia de lenguajes.
- El fichero de configuración de kubernates que se genera es es muy simple. Realmente lo que se genera no es algo sólido para proyectos en producción. Solo se hizo lo imprescindible para probar.

# Anexo

En esta parte del artículo se va a describir con el mayor detalle posible qué exactamente hace cada worker y que va generando en cada paso.

Todo lo que se describe es basado en un proyecto de ejemplo que está en este repositorio.

https://github.com/aprezcuba24/python-kubernates-example

La idea es suponer que este proyecto es el de un cliente y lo quiere desplegar en nuestra plataforma.

## github_events

Cada vez que llega un payload desde github. Hace lo siguiente.

1. Verifica si el proyecto está registrado en la base de datos, es decir, es uno de los que tiene que desplegar.
2. Guarda en la colección **deploy** de mongo los datos llegados desde github.
3. Finalmente devuelve para el próximo worker un objeto con los siguientes datos.
    - project: Los datos del proyecto que se obtuvieron desde la base de datos.
    - zip_url: Url para descargar desde github, el fichero Zip con todo el código.
    - commit_hash: El hash del commit. Esto se utilizará para poder nombrar de forma única los diferentes recursos que se van creando.

## download_code

Su función es descargar el código fuente, a partir de la url del zip que obtiene del worker anterior.

1. Descarga el fichero zip y lo pone en la carpeta **DATA** dentro del proyecto. Esto se hace así para que después los demás workers tenga acceso al código fuente y fundamentalmente los comandos que se ejecutarán en la máquina local.
2. Descomprime el proyecto y lo pone en una carpeta que tendrá como nombre el **commit_hash**.
3. Borra el fichero Zip que descargó, ya no me hace falta más.
4. Devuelve al siguiente worker todos los datos que recibió además de la dirección donde está el código del proyecto.

## validate_configuration

Después que el código está descargado, este worker tiene la función de verificar si la estructura es la correcta para poder desplegarlo. Se debe crear una documentación para que los usuario del sistema sepan como hacerlo.

Lo primero que se haces verificar que exista el fichero **.cupaas.yml** dentro del proyecto descargado. Este fichero debe tener lo siguiente.

```
runtime: python:3.8.6
entrypoint:
  - python
  - app.py
services:
  - mongodb: 6.0.2
```

- **runtime**: Lenguaje y versión en que se debe ejecutar la aplicación.
- **entrypoint**: Qué comando se debe ejecutar para que la aplicación comience a ejecutarse dentro del contenedor.
- **services**: Que otros servicios adicionales necesita la aplicación y la versión.

El worker genera dentro de la carpeta del proyecto un fichero con el nombre **_cupaas_ks8.yml** con toda la configuración para desplegar la aplicación en kubernates. Les pongo la configuración tal cual se genera para que la puedan analizar.

```
apiVersion: v1
kind: Namespace
metadata:
  name: aprezcuba24-python-kubernates-example
---
apiVersion: v1
kind: Pod
metadata:
  name: mongo
  namespace: aprezcuba24-python-kubernates-example
  labels:
    app.kubernetes.io/name: mongo
spec:
  containers:
  - name: mongo
    image: mongo:6.0.2
    ports:
      - containerPort: 27017
        name: mongodb-port
---
apiVersion: v1
kind: Service
metadata:
  name: mongo
  namespace: aprezcuba24-python-kubernates-example
spec:
  selector:
    app: mongo
  ports:
    - port: 27017
      targetPort: mongodb-port
---
apiVersion: v1
kind: Pod
metadata:
  name: backend
  namespace: aprezcuba24-python-kubernates-example
  labels:
    app.kubernetes.io/name: backend-app
spec:
  containers:
  - name: backend
    image: aprezcuba24/python-kubernates-example:70c9d9051dc56120a2e7e93592bd8c75fcbcf76d
    ports:
      - containerPort: 5000
        name: backend-port
    envFrom:
      - configMapRef:
          name: backend-config-env
---
apiVersion: v1
kind: Service
metadata:
  namespace: aprezcuba24-python-kubernates-example
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
---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: aprezcuba24-python-kubernates-example
  name: backend-config-env
data:
  MONGODB_URI: mongodb://host.minikube.internal:27017/aprezcuba24-python-kubernates-example_db
  PORT: '5000'
```

Finalmente devuelve al próximo worker todos los datos recibidos unidos a los siguientes.

- **image_name**: Nombre de la imagen que se debe usar para crear la imagen de docker con el código del proyecto.
- **docker_port**: Que puerto se debe configurar dentro del contenedor.
- **yml_data**: Los datos que el usuario puso en el fichero **.cupaas.yml**
- **cupaas_ks8**: Dirección del fichero donde está la configuración para kubernates.
- **namespace**: Como se llama el namespace que se debe crear para kubernates.
- **service_name**: Cual es el nombre del servicio donde estará corriendo el proyecto.

Todos estos datos son basado en lo que se configuró en el fichero para kubernates.

## create_docker_image

Este worker tiene dos funciones, primero generar un fichero **Dockerfile** y luego construye la imagen de docker.

El Dockerfile generado es el siguiente.

```
FROM python:3.8.6-slim

RUN pip3 install --upgrade pip

WORKDIR /app

COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

ENTRYPOINT ["python","app.py"]
```

Aquí las partes que varían es, la versión de python y el entrypoint, se pone en función de lo configurado por el usuario en el fichero **.cupaas.yml** y el el puerto que es lo que se devuelve en el worker **validate_configuration**

Luego para construir la imagen se ejecuta el comando.

```
docker build {project_code} -t {image_name} -f {docker_file}
```

- **project_code**: Tiene la dirección donde se descargó el poryecto.
- **image_name**: El nombre de la imagen que se obtiene del worker anterior.
- **docker_file**: La dirección del Dockerfile que se generó.

## upload_docker_image

Se carga la imagen en **minikube** con el comandos

```
minikube image load  {image_name}
```

## upload_to_kubernates

Se manda a construir todos los recursos en kubernates.

```
kubectl apply -f {cupaas_ks8}
```

**cupaas_ks8**: Tiene la dirección donde está el fichero de configuración de kubernates.

## get_final_url

Este es el último worker y lo que se hace es pedirle a minikube la dirección url del proyecto que acabamos de desplegar.

```
minikube service {service_name} -n {namespace} --url
```
