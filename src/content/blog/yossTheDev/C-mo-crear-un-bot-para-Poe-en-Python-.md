---
title: "Cómo crear un bot para Poe en Python?"
pubDate: "Tue May 16 2023"
image: "https://github.com/yossTheDev/yossthedev.github.io/blob/main/public/blogImages/como-crear-bot-poe.png?raw=true"
username: "yossTheDev"
categories: ["ia","tutorials"]
description: "Creamos un nuevo bot para Poe en Python sencillo y en pocos pasos"
canonicalUrl: "https://yossthedev.github.io/blog/como_crear_bot_poe_python/"
---

Hola, en los últimos tiempos la Inteligencia Artificial a sido tema de debate recurrente en todo internet. Cada día salen cientos y quien dice cientos quizás miles de productos basados en esta nueva tecnología que muchos definen como la siguiente Revolución Tecnológica, no tengo autoridad para afirmar esto, lo que si es seguro es que sus usos son ilimitados así como la creatividad de los desarrolladores que se basan en estas para mejorar sistemas existentes o crear nuevas soluciones a distintos problemas

Ha todo esto nos preguntamos como usuarios promedios como nos beneficiamos de ella? o en qué nos afecta? y la respuesta es simple ya está entre nosotros y vino para quedarse. Ya hemos visto como las grandes tecnológicas están en una especie de carrera, al estilo de la Guerra Fría a ver quien llega a dominar la tecnología o al menos quien la integra a la mayor cantidad de productos. Gracias a esto tenemos a un poderoso [Bing](https://bing.com) *(sí, el buscador de internet propiedad de **Microsoft**, del que nadie hablaba mucho hasta que se ha integrado con GPT, la famosa tecnología desarrollada por **OpenAI**)* capaz de responder a consultas en lenguaje natural y hasta generar imágenes a petición del usuario, también se habla de una próxima integración de **Bard**, el modelo de inteligencia artificial de Google con su buscador. 

Pero bueno después de esta introducción vayamos a los que nos interesa y es que hoy quiero hablarte de una de estas soluciones basadas en inteligencia artificial disponible para todos los usuarios y que hace muy poco ha habilitado una API para desarrolladores, te hablo de **POE** y hoy veremos como crear bots en esta plataforma en Python, así que empezemos....

## Qué es POE?

[Poe](https://poe.com) es una plataforma que viene de la mano de [Quora](https://quora.com) que brinda a los usuarios la posibilidad de interactuar con diferentes bots basados en Inteligencia Artificial, entre los que se incluyen el archiconocido **ChatGPT**, **GPT4** *(solo para el plan premium)*, **Anthropic Claude**, **Claude+** *(solo plan premium)* y **Neeva**. Puedes acceder a ella a través de su web y también disponen de una versión para iOS. Entre sus características destaca la persistencia de Chats entre dispositivos, su interfaz simple y amigable y lo que nos interesa hoy, la posibilidad de crear y [explorar](https://poe.com/explore) bots personalizados por los usuarios que ha ido un paso mas allá gracias a la disposición de una API para su creación

Por el motivo de este post vamos a saltar la parte de la creación de la cuenta en Poe y su uso mas básico y vamos a ir directo a crear un nuevo bot personalizado usando la API, para ello nos dirigimos al siguiente [enlace](https://poe.com/create_bot?api=1), elegimos un nombre, una descripción y si deseas una imagen para nuestro bot, aquí lo importante es copiar el **API key** que nos disponen mas abajo. 😁 Todo bien hasta aquí, bueno cuando la tengas copiada seguimos...

## Preparando El Entorno

Ya tenemos nuestra Key? Espero que si, ahora vamos a preparar el entorno para desarrollar un nuevo bot de Poe en Python, así que vamos a desplazarnos al directorio donde queramos nuestro nuevo proyecto, crearemos una carpeta y empezaremos con nuetro IDE favorito o en la terminal y seguiremos estos pasos:

* Instalamos las librerías necesarias en nuestro entorno:

```bash
pip install fastapi-poe
```

* Creamos un nuevo archivo bot.py y copiamos el siguiente codigo:

```python
from fastapi_poe import PoeBot, run

class EchoBot(PoeBot):
    async def get_response (self,query):
        last_message = query.query[-1].content
        yield self.text.text_event (last_message)
        
if __name__ == "__main__":
    run(EchoBot(), api_key="api_key")
```

* Reemplazamos "api_key" por nuestra Key que ya habíamos copiado antes y ejecutamos nuestro bot:

```bash
python3 bot.py
```

Este es un ejemplo simple de un bot que lo que hace es hacer eco de nuestros mensajes. Para los que estamos familiarizados con la creación de bots para Telegram pudiera resultar similar y no hay dudas de que esto abrirá las puertas a un montón de soluciones creativas que los desarrolladores podrán hacer realidad. Pero... este bot que hicimos aún no esta disponible para su uso público, porque lo estamos ejecutando de forma local, así que tenemos que hacer Deploy 🚀

## Desplegando Nuestro Bot En Internet

Para esto hay muchas formas y vías para hacerlo, pero para este artículo usaremos [Heroku](https://heroku.com) y te describo a continuación el proceso, recuerda que debes tener una cuenta en este servicio para  continuar con el tutorial y también instalar [Heroku CLI](https://devcenter.heroku.com/articles/3heroku-cli#install-the-heroku-cli) que la estaremos usando para hacer todo el proceso en la Terminal

* Crear una nueva aplicación en Heroku, con el nombre que desees, para el ejemplo usaremos Poe-Bot
* Tener la API Key de nuestro bot de Poe copiada en el portapapeles
* Abrimos la terminal y creamos un nuevo repositorio git en nuestro proyecto:
```bash
git init
```
* Añadimos todos los cambios y creamos el primer commit:

```bash
git add .
```

```bash
git commit -m "The First Commit"
```
* Iniciar sesión en Heroku usando la CLI:
```bash
heroku login
```

* Añadimos el repositorio remoto de nuestra app en la plataforma: 

```bash
heroku git:remote -a Poe-Bot
```

* Subimos nuestro proyecto a la plataforma *(recuerda reemplazar "Poe-Bot" por el nombre que le hayas puesto a tu aplicación en Heroku)*

```bash
git push heroku main
```

Listo 👌, si todo ha salido bien y espero que sea así, tendremos nuestro bot hospedado en Heroku, en un enlace similar a este: https://el-nombre-de-tu-app.herokuapp.com

Hemos terminado, muchas gracias por llegar hasta aquí, espero que te haya sido de utilidad lo que aprendimos en este post, sin más a seguir tirando código mi amigo 😁 y no te olvides de compartir la publicación para que otros también se beneficien de ella. Muchas Gracias.

## Enlaces De Interés

* [api-bot-tutorial](https://github.com/poe-platform/api-bot-tutorial)
* [poe-protocol](https://github.com/poe-platform/poe-protocol)
