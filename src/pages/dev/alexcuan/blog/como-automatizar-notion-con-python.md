---
layout: "../../../../layouts/postLayout.astro"
title: "Como automatizar Notion con Python"
pubDate: "Jan 8 2023"
description: "Notion es una gran herramienta y esencial para mí. Es como un segundo cerebro. Sin embargo, una vez entendidos los conceptos básicos, se puede sacar aún más partido."
image: "https://i.pinimg.com/564x/ab/5b/10/ab5b1049f9dc3e3afd176e77357c3895.jpg"
tags: ["Tutorial"]
---

## Introducción

Notion es una gran herramienta y esencial para mí. Es como un segundo cerebro. Sin embargo, una vez entendidos los conceptos básicos, se puede sacar aún más partido. Hay muchas tareas repetitivas que, a pesar de lo usable que es la plataforma, se pueden acortar o incluso automatizar. Afortunadamente, cuenta con una API pública y muy funcional que le da un impulso extra a la plataforma.

En mi camino para entender el API, a pesar de contar con un wrapper bastante cómodo, me topé con una curva que, aunque no es pronunciada, puede considerarse incómoda. Este tutorial es para todos aquellos que quieran convertirse en usuarios avanzados de la plataforma y aprovechar sus habilidades de programación.

## Configuracion del API

Asumire que ya poseen una cuenta de [Notion](https://www.notion.so/). Para comenzar a desarrollar una integracion, lo primero sera obtener un token de acceso en la siguiente [pagina](https://www.notion.so/my-integrations)

En el apartado de "Nueva Integración", introduciremos los datos de la integración (nombre, foto, workspace, etc). Quiero hacer hincapié en una opción aquí, y es la de los permisos. A la hora de otorgar estos permisos, deben tener claro el propósito de la integración, ya que otorgar permisos innecesarios puede conllevar a una pérdida de información sensible si el token acaba en manos incorrectas.

Una vez obtenido el token, podemos empezar a desarrollar. La elección del lenguaje fue Python debido a su sencillez y facilidad de uso. Además, también es uno de mis lenguajes preferidos. Esto nos permite comenzar a trabajar de forma rápida y eficaz. Para abstraer el trabajo con la API usaremos una librería llamada `notion-client.`

## Manos a la obra!

Primero, instalemos la librería con `pip install notion-client` y la importamos en el archivo como `notion_client`. Luego, creamos un archivo `.env` que nos servirá para guardar el token de integración y algunas otras variables útiles. También recomiendo instalar e importar la librería `dotenv` para importar las variables de entorno.

Para indicar con qué cuenta de Notion en específico queremos trabajar, instanciamos la clase `Client` y le pasamos como argumento el token de integración anterior.

```
import notion_client
import dotenv
import os

dotenv.load() #Carga el archivo .env

notion = notion_client.Client(auth=os.getenv(<Nombre_de_la_variable>)

```

Esta clase `Client` tiene una serie de atributos (_pages, search, databases, blocks…_) sobre los cuales vamos a ejecutar métodos. El primer ejemplo será sencillo, haremos una búsqueda por nombre de una base de datos.

Creamos una página cualquiera en Notion y dentro insertamos una base de datos con el nombre "_Media-Center_". Es importante tener en cuenta que, para que la integración tenga acceso a una página y a sus páginas hijas, debemos otorgarle permisos expresamente. Esta es una medida de seguridad adicional muy acertada.

A continuación haremos algo simple. Una búsqueda dentro de las páginas a las que tiene acceso la integración.

```
def retrieve_db_id(db_name):
"""
El metodo search admite como argumentos tipo key-value queries, filtros,
cursores y algunos mas para hacer las busquedas mas precisas. Mas informacion 
en: <https://developers.notion.com/reference/post-search>
"""
    search_database = notion.search(
        query=f"{db_name}",
        property='object',
        value='database'
    )

```

Es bastante intuitivo todo. Este método hará una petición al endpoint correspondiente, y devolverá un JSON con un formato similar al siguiente:

```
[
  {
    "object": "database",
    "id": "33df8e82-44c2-4b56-aa71-f9e741ce6036",
    "cover": "None",
    "icon": "None",
    "created_time": "2023-01-09T00:13:00.000Z",
    "created_by": {
      "object": "user",
      "id": "73f136ee-80e3-40ca-bee7-8edd495910a5"
    },
    "last_edited_by": {
      "object": "user",
      "id": "73f136ee-80e3-40ca-bee7-8edd495910a5"
    },
    "last_edited_time": "2023-01-09T00:33:00.000Z",
    "title": [
      {
        "type": "text",
        "text": {
          "content": "Media-Center",
          "link": "None"
        },
        "annotations": {
          "bold": false,
          "italic": false,
          "strikethrough": false,
          "underline": false,
          "code": false,
          "color": "default"
        },
        "plain_text": "Media-Center",
        "href": "None"
      }
    ],
    "description": [],
    "is_inline": true,
    "properties": {
      "Tags": {
        "id": "LtkD",
        "name": "Tags",
        "type": "multi_select",
        "multi_select": {
          "options": []
        }
      },
      "Name": {
        "id": "title",
        "name": "Name",
        "type": "title",
        "title": {}
      }
    },
    "parent": {
      "type": "page_id",
      "page_id": "fe7a9d3f-2991-424f-8b48-3f05cfe08bd0"
    },
    "url": "<https://www.notion.so/33df8e8244c24b56aa71f9e741ce6036>",
    "archived": false
  }
]

```

Dependiendo de la cantidad de bases de datos y sus características, este JSON tomará una forma diferente, pero se darán cuenta de que sigue un patrón entendible. Por ahora, solo nos devolvió un resultado y de aquí extraeremos la segunda propiedad llamada `id` con la cual trabajaremos a partir de ahora. Esta también se encuentra en la URL de la página con el siguiente formato `https://www.notion.so/{workspace_name}/{database_id}?v={view_id}.`

Una vez tengamos el `id` de la base de datos, podemos obtener directamente los metadatos de la base de datos de la siguiente manera:

```
def retrieve_db(id):
    database = notion.databases.retrieve(database_id=id)
    return database

```

Ojo: este método no devuelve el contenido, sino información similar a la búsqueda del principio, pero solamente de la base de datos seleccionada. Para obtener la información dentro, usamos el método `query` :

```
def retrieve_db_content(id):
    database = notion.databases.query(database_id=id)
    return database

```

Ahora vamos con algo más útil. Manipular bases de datos. Una base de datos está compuesta por páginas, y estas a su vez contienen una serie de elementos dentro que nos interesa manipular. Vamos a insertar los siguientes campos en nuestra base de datos para simular un caso real:

-   Name (title)
-   Image (files)
-   Summary (rich\_text)
-   Genre (multiple\_select)
-   Year (date)
-   URL (url)

Para crear una página (fila) en esta base de datos, usamos el siguiente método:

```
def insert_page(database_id, properties):

    notion_page = notion.pages.create(
        parent={'database_id': database_id},
        properties=properties)

return notion_page

```

El argumento `database_id` se refiere al `id` de la base de datos a la cual pertenece la página, y el cual aprendimos a extraer al principio. El otro argumento `properties` se refiere a un diccionario que contiene la información de las propiedades de la base de datos.

Cada propiedad de una base de datos de Notion tiene características particulares. Al final del artículo voy a dejar un enlace donde aparecen todas y sus requerimientos. El diccionario toma la siguiente forma:

```
properties = {
    'Name': {'title': [{'text': {'content': <title_name>}}]},
    'Image': {'files': [{'name': <image_name>, 'external': {'url': <image_url>}}]},
    'Summary': {'rich_text': [{'text': {'content': <summary_text>}}]},
    'Genre': {'multi_select': [{'name': <genre_name>}, {'name': <genre_name>}]},
    'Year': {'date': {'start': f'{datetime.datetime.now().isoformat()}'}},
    "URL": {"url": <url>}
}
```

Cada campo sigue un patrón parecido en principio.

```
<Property_name> : {<property_type> : <specific_data>}
```

Sin embargo, cada propiedad tiene particularidades. Por ejemplo:

La primera tiene el nombre de `title`. Toda página tiene esa propiedad y es obligatoria.

La propiedad de archivos `files` puede ser tipo `file` (hosteado por Notion) o`external`(hosteado externamente), aunque de momento solo se puede insertar mediante llamadas la API enlaces externos. Es obligatorio un nombre alternativo para el archivo.

Summary es `rich_text`, lo que significa que puede tener colores, estilos y mucho más. Sin embargo, solamente pasamos texto plano en esta ocasión.

Genre es de tipo `multiple_select`, lo cual significa que dentro contiene una lista de diccionarios, que a su vez dentro estan formado por la llave `name` y su valor correspondiente.

Las fechas en Notion se manejan de acorde al formato ISO 8601, por lo que en el caso de Year usamos la libreria `datetime` para formatear la hora adecuadamente. Solo use la fecha de inicio para representar un dia, pero existe la opcion de fecha final.

La `url` es bastante sencilla. Simplemente le pasas la url y listo.

En la documentación los campos para insertar una propiedad pueden aparecer con el siguiente formato:

```
<Property_name> : {'type': <property_type>, <property_type> : <specific_data>}
```

Pero realmente no es necesario, incluso, llega a ser redundante.

Vamos a probar si funciona con datos de prueba:

A partir de este punto ya se tiene el contexto suficiente para empezar a consumir la API y, junto a la documentación, empezar a hacer cosas increíbles con Notion: desde manejar finanzas personales, llevar seguimiento de hábitos, notas, planes de entrenamiento, almacenamiento de información, etc… ¡La imaginación es el límite!

Espero que les haya servido. Cualquier duda pueden pasar por mi [canal](https://t.me/Alex_Cuan) y [grupo](https://t.me/Alex_Cuan_Group) de Telegram y estaré encantado de ayudarlos.

### Enlace útiles

Página principal de notion - [https://notion.so](https://notion.so/)

Documentación - [https://developers.notion.com](https://developers.notion.com/)

Lista de propiedades de una pagina - [https://developers.notion.com/reference/page-property-values](https://developers.notion.com/reference/page-property-values)

Github de la librería - [https://github.com/ramnes/notion-sdk-py](https://github.com/ramnes/notion-sdk-py)
