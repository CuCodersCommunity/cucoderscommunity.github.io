---
title: "Agente de IA con OpenAI"
pubDate: "Sun Apr 19 2025"
image: "https://live.staticflickr.com/65535/54454045784_75fb63d49c.jpg"
username: "aprezcuba24"
categories: ["software", "tutorials"]
description: "El desarrollo de la inteligencia artificial se ha convertido, desde mi punto de vista, en una amenaza para los desarrolladores pero no porque nos vaya a quitar el trabajo, sino porque muchas de las tareas, que actualmente hacemos, las va a realizar la IA. Aquellos programadores que no se actualicen en las nuevas tecnologías poco a poco irán quedando relegados."
---

El desarrollo de la inteligencia artificial se ha convertido, desde mi punto de vista, en una amenaza para los desarrolladores pero no porque nos vaya a quitar el trabajo totalmente, sino porque muchas de las tareas que actualmente hacemos, las va a realizar la IA. Aquellos programadores que no se actualicen en las nuevas tecnologías poco a poco irán quedando relegados.

Tareas fácilmente parametrizables como la maquetación de sitios web, creación de consultas a base de datos, algoritmos simples, etc., serán cada vez más, generados por la IA y los programadores tendremos que empezar a cumplir otras funciones.

En algún momento ocurrirá que los sistemas se harán más complejos, donde será la IA la encargada de enlazar las partes; pero en mi opinión, siempre tendrá que existir un programador que domine las tecnologías y pueda guiar a esa IA a hacer las tareas que se necesitan.

Después de un estudio muy incipiente, y llevar algún tiempo viendo el estado del arte del tema, he llegado a la conclusión que los desarrolladores nos vamos a concentrar más en la creación de microservicios y a través de la IA orquestaremos nuestras soluciones. Tecnologías como [n8n](http://n8n.io/) y estándares como [MCP](https://modelcontextprotocol.io/introduction) serán cada vez más omnipresentes.

La cuestión no es quedarnos de brazos cruzados, sino empezar a estudiar y buscar la forma de sacarle provecho a esta nueva realidad que se nos vino encima.

## Caso de estudio

En el presente artículo me propongo desarrollar un caso de estudio, donde a través de la IA doy solución a un problema concreto. Implementar esta solución fue realmente sencilla. Hacer esto mismo utilizando las técnicas tradicionales hubiera sido más complicado desarrollarlo.

El desarrollo de soluciones basado en IA son soluciones no deterministas, significa que la solución no es 100% exacta. Con un lenguaje de programación tradicional se implementan rutinas que siempre dan la misma respuesta a la misma entrada de datos; son lenguajes libres de contextos. La IA precisamente tiene en cuenta el contexto para dar las soluciones. Es responsabilidad de nosotros darle el contexto adecuado para que la respuesta sea lo más acertada posible.

### Descripción del caso de uso

Muchos de los proyectos en los que trabajo están desarrollados con **NestJs**. Generalmente creo un módulo por cada entidad del sistema. Cada módulo contiene la clase entidad en sí, la clase DTO, controladora y servicio. Para facilitar el trabajo he creado un comando que dado el nombre de la entidad me genera el módulo, donde a la clase entidad solo le pone dos campos, name y description.

Una vez creado el módulo se comienza a añadirle los campos que realmente debe tener, subdocumentos si es necesario, validaciones, etc. Un trabajo que puede ser bastante extenso.

**¿Qué pasa si la IA, dado un prompt, me pueda generar un módulo para mi sistema?** 

La idea no es que genere un módulo de Nestjs cualquiera, sino uno que se adapte a los estándares de los proyectos que desarrollo e incorporando todos los campos que debe tener la entidad.

En el caso de estudio solo me voy a concentrar en la generación de la clase entidad y el dto. La clase controladora y servicio es algo mucho más estándar.

A continuación se muestra la clase entidad que genera el comando que actualmente tengo.

```typescript
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { schemaOptions, DomainSchema } from "@comun-nest/mongodb"
import { ApiProperty } from "@nestjs/swagger"
import mongoose from "mongoose"

@Schema(schemaOptions)
export class Product extends DomainSchema {
  @ApiProperty()
  @Prop({ index: true, required: true })
  name: string

  @ApiProperty()
  @Prop({ index: true })
  description: string
}
export const ProductSchema = SchemaFactory.createForClass(Project)
ProductSchema.index({ createdAt: 1 })
ProductSchema.index(
  { space: 1, deleted: 1, deletedAt: 1, projectKey: 1 },
  { unique: true }
)
```

La clase DTO

```typescript
import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsOptional, IsMongoId } from "class-validator"
import { DomainDto } from "@comun-nest/mongodb"

export class CreateProductDto extends DomainDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string
}
```

## Desarrollo

Resolver un problema mediante IA se compone de dos partes: qué información normalmente se le va a introducir al sistema y cómo debe ser la respuesta que este debe brindar. Cuando tengamos esto claro, lo siguiente es hacer un **prompt**, lo más refinado posible, para que la IA siempre nos de respuestas lo más cercanas posibles a lo esperado.

El proceso de creación del prompt es iterativo; se va escribiendo y probando, y cada vez que veamos que la IA da una respuesta no adecuada, modificamos el prompt para ajustar la respuesta. Hacer un prompt no es más que enseñarle con un lenguaje natural a la IA, qué debe hacer para resolver un problema concreto. Entre más detalles le demos y ejemplos de soluciones, mejor serán los resultados.

Algo a recalcar es que el prompt resuelve un **problema concreto**. Con la menor cantidad de datos de entrada posible, debe dar respuestas aceptables. En nuestro caso de estudio la entrada es un texto como el siguiente.

```
Class Category
name string
description string optional
isActive boolean
order number
```

Como se puede ver, no se especifica qué se debe implementar en typescript, que se debe crear un módulo para nestjs, que se debe usar librerías internas de nuestro proyecto, etc. Toda esa información se le damos como contexto en el prompt. Logrando finalmente un sistema especializado, **un agente de IA**, en resolver nuestro problema.

### Prompt

Un prompt es simplemente un texto escrito en lenguaje natural, pero la experiencia ha demostrado que deben existir ciertas partes que permitan tener un buen resultado.
#### Rol
Aquí le describimos a la IA qué función tiene o en qué es experto. Esta parte ayuda a la IA a entrar en contexto sobre el tema a resolver. En nuestro caso le ponemos lo siguiente.

```
# Rol

Eres un desarrollador de aplicaciones en nodejs. Específicamente usas nestjs.

Trabajas en una empresa donde se tienen ciertos estándares a la hora de crear los **modules** de las aplicaciones.

En la empresa se tiene un conjunto de librerías base que se deben utilizar a la hora de crear las aplicaciones.

Tu objetivo fundamental es crear un **module** de la aplicación basado en los estándares de la empresa.
```

Aquí recalcamos lo siguiente: que es un desarrollador, que tiene que ajustarse a los estándares de la empresa y que su función es generar un módulo.
#### Contexto
Le explico con más detalle qué librerías va a utilizar, qué tipo de usuarios va a atender, o cuál va a ser la posible entrada de datos que le van a dar.
```
# Contexto

Los usuarios te van a escribir qué especificaciones debe tener el módulo.

Los usuarios son realmente programadores.

Los usuarios te pueden escribir tanto en español como en inglés pero tus respuestas siempre serán en inglés, es decir, debes codificar en inglés.

El usuario básicamente te va a indicar lo siguiente:
- Nombre de la clase entidad usando CamelCase
- Listado de los campos, unido al tipo de dato de cada uno. Pueden añadir información relacionada con las validaciones que podría tener.
- También se pueden configurar subdocumentos que serían clases con campos.

Los usuarios van a escribir entradas como la siguiente:

Class Category
name string
description string optional
isActive boolean
order number  

Las librerías que utilizan son:

- @common-nest/mongodb que exporta las clases "DomainSchema" y "schemaOptions" que se utilizan para crear la clase entidad.
- @nestjs/mongoose que exporta las clases "Prop" y "Schema" y "SchemaFactory" que se utilizan para crear la clase entidad.
- @nestjs/swagger que exporta la clase "ApiProperty" que se utilizan para crear la clase entidad.
- class-validator tiene las validaciones que se deben poner en las clases DTO
- @common-nest/mongodb también exporta la clase "DomainDto" que se utiliza para crear la clase dto
```
#### Tareas
En las tareas le indicamos a la IA qué pasos debe realizar para resolver el problema. No se hace de forma imperativa, porque no podemos garantizar que la IA lo haga así, es otra forma de darle más contexto a la IA con sugerencias de cómo solucionar el problema.
```
# Tarea

- Genera el nombre que va a tener el módulo, que sería el nombre de la entidad en **Kebab Case**. Ejemplo: si el nombre de la entidad es "CategoryProduct", el nombre del módulo sería: "category-product"
- Generar la clase entidad con los campos y subdocumentos. Los subdocumentos van en ficheros diferentes y se ponen después como un campo de la clase principal.
- Generar la clase dto con las validaciones
- Devolver una respuesta que permita llamar a la tool "create_file", pasando los parámetros "folder_path", "file_name" y "content".
```
#### Ejemplos
Esta es una de las secciones más importante. Aquí le indicamos a la IA varios ejemplos para que entienda cómo se resuelve el problema. Entre más ejemplos le demos, más acertada serán las respuestas que esta brinda.

Los ejemplos se dividen en dos partes: por un lado qué información va a recibir la IA, que puede ser un prompt basado en texto, un objeto json, un fichero, etc., y luego qué respuesta debería dar en cada caso.

En el caso de estudio se definieron 3 ejemplos, esto no quiere decir que sean suficiente. Lo más probable es que a medida que se use en un entorno real nos iremos dando cuenta de respuestas inadecuadas. En estos casos, comienza el proceso de refinación del prompt. Cada vez que nos encontremos una desviación en la respuesta, lo que queda es introducir un nuevo ejemplo para corregir el error.

Para no alargar mucho el artículo se va a poner un ejemplo que es el más completo.

**Entrada de datos**

Ejemplo de entrada de datos que daría un usuario.

```
class Person
name string required
parent required subdocument Parent
subjects array of subdocument Subject  

class Parent
name string required  

class Subject
name string required
points number required
```

Este ejemplo es de una clase **Person** que tiene un campo, **name**, y dos campos **parent** y **subjects** que son subdocumentos uno de ellos, **subjects** es un array.

**Salida esperada**

Lo siguiente es indicarle a la IA cuál es la salida esperada. En el ejemplo hay tres componentes especiales, **folder_path**, **file_name** y **content**. En la próxima sección explicaré qué significa.

```
**Clase entidad**

Valores que se le pasarían a la tool "create_file" para crear la clase entity

folder_path:
person/entities

file_name:
person.entity.ts

content:

import { schemaOptions, DomainSchema } from '@common-nest/mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ParentScheme } from './parent.schema';
import { SubjectScheme } from './subject.schema';  

@Schema(schemaOptions)
export class Person extends DomainSchema {
  @ApiProperty()
  @Prop()
  name: string;  

  @ApiProperty()
  @Prop({ type: ParentScheme })
  parent: ParentScheme;  

  @ApiProperty()
  @Prop([{ type: SubjectScheme }])
 subjects: SubjectScheme[];
}
export const PersonSchema = SchemaFactory.createForClass(Person);
PersonSchema.index({ createdAt: 1 })
PersonSchema.index({ space: 1, deleted: 1 })

**Clase dto**

Valores que se le pasarían a la tool "create_file" para crear la clase dto 

folder_path:
person/dto

file_name:
person.dto.ts

content:

import { DomainDto } from '@common-nest/mongodb';
import {
  IsString,
  IsOptional,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ParentDto } from './parent.dto';
import { SubjectDto } from './subject.dto'; 

export class PersonDto extends DomainDto {
  @ApiProperty()
  @IsString()
  name: string;  

  @ApiProperty({ type: () => ParentDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => ParentDto)
  @ValidateNested()
  parent: ParentDto;  

  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  subjects: SubjectDto[];
}
```

**Subdocumentos**

Solo voy a poner el ejemplo de **parent**, el de subject es similar.

```
**Subdocumento Parent**

Valores que se le pasarían a la tool "create_file" para crear la subdocumento

folder_path:
person/entities

file_name:
parent.entity.ts

content:

import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
  export class ParentSchema {
  @ApiProperty()
  @Prop({ required: true })
  name: string;
}

**Clase Dto**

Valores que se le pasarían a la tool "create_file" para crear la clase dto

folder_path:
person/dto

file_name:
parent.dto.ts

content:

import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  

export class ParentDto {
  @ApiProperty()
  @IsString()
  name: string;
}
```

Hasta aquí la definición del prompt. En el caso de estudio desarrollado hay mucha más información. Aquí solo se puso una pequeña parte.
## Configuración de la llamada al modelo de IA

Ejecutar la IA para que nos de una respuesta es un proceso relativamente sencillo, por lo menos en el caso de uso que nos ocupa.  Tenemos la librería **openai**, que internamente hace peticiones rest a chatgpt.

El lenguaje de programación escogido para hacer el caso de estudio fue **Python**, pero realmente en este caso es irrelevante. Lo único que estamos haciendo es trabajar con un servicio y esto lo podemos hacer con cualquier lenguaje de programación.

El proceso se compone de dos partes, una función auxiliar **create_file** que crea los ficheros con el código generado por la IA y la función **call_function** que prepara los parámetros y ejecuta el modelo de AI.

En nuestro caso, los parámetros que se le pasan al modelo de AI son tres.
- **model**: El modelo de AI que se va a utilizar. Estamos usando **gpt-4o**
- **input**: Es un arreglo que con dos elementos donde le indicamos qué información debe conocer la IA para resolver el problema y cuál es la entrada que da el usuario.
- **tools**: Es un array donde le podemos pasar un conjunto de herramientas que queremos usar a la hora de resolver el problema.

Vamos a explicar con más detalle input y tools.

### Inputs
Como mencionamos anteriormente, inputs es un array, que en nuestro caso tiene dos elementos.

```
[
  {"role": "developer", "content": content_developer},
  {"role": "user", "content": content_user},
]
```

Cada elemento tiene dos campos, **role** y **content**. El campo **role** puede tener tres valores, pero aquí solo usamos dos, **developer** y **user**. En el **developer** le indicamos a la IA cuál es su función, qué tiene que hacer y ejemplos de cómo resolver el problema. Aquí es donde introducimos todo el prompt que hemos escrito. En el elemento de tipo **user** ponemos la entrada que pasó el usuario.
### tools
Las tools son simplemente funciones que se implementan directamente en nuestro código. En nuestro caso de estudio tenemos solo una, **create_file**, una función que recibe: folder_path, file_name y content, y se encarga de crear los ficheros en el disco duro.

```python
from pathlib import Path

def create_file(folder_path: str, file_name: str, content: str):
    file_path = f"{folder_path}/{file_name}"
    Path(folder_path).mkdir(parents=True, exist_ok=True)
    with open(file_path, "w") as f:
        f.write(content)
    print(f"File created: {file_path}")
```
Si se fijan de nuevo en el prompt que hemos preparado, específicamente en los ejemplos, todo el tiempo le fuimos indicando a la IA que su función era finalmente llamar a esta función, indicando qué parámetros le tiene que pasar y cómo generarlo.
### Llamada al modelo.
```python
def call_function(user_content):
    response = client.responses.create(
	    model="gpt-4o",
	    input: [
            {"role": "developer", "content": content_developer},
            {"role": "user", "content": content_user},
        ],
        tools=[create_file],
    )
    for tool_call in response.output:
        if tool_call.type != "function_call":
            continue
        name = tool_call.name
        function = getattr(functions, name)
        args = json.loads(tool_call.arguments)
        function(**args)
```
Resaltar dos elementos, **content_developer**, donde le pasamos todo el prompt y **create_file** que es una variable de tipo string, con la configuración de la herramienta.

La respuesta del modelo la obtenemos en el campo **output** del reponse. Es un arreglo de objetos que tiene un campo **type**. Solo nos interesa los que tienen como valor **function_call**. Además tiene los siguientes campos.
- **name**: El nombre que le hemos dado a la herramienta, que para nuestra comodidad le dimos el mismo nombre de la función a la que queremos llamar.
- **arguments**: Un objeto en formato json con los parámetros que tenemos que pasarle.
### Configuración de create_file
```python
create_file = {
  type: "function",
  name: "create_file",
  description:
    "Crea un fichero en el módulo basado en el contenido que se le de.",
  parameters: {
    type: "object",
    properties: {
      folder_path: {
        type: "string",
        description: "Ruta de la carpeta donde se creará el fichero.",
      },
      file_name: {
        type: "string",
        description: "Nombre del fichero que se creará.",
      },
      content: {
        type: "string",
        description:
          "Contenido del fichero, que es el código fuente que tendría el fichero.",
      },
    },
    required: ["folder_path", "file_name", "content"],
    additionalProperties: False,
  },
}
```

Aquí le indicamos qué parámetros recibe la función y qué tipo tienen. La **descripción** también es importante, no es un simple comentario, la IA interpreta esta descripción como parte del contexto.

# Conclusión
El artículo y el caso de estudio solo fue una aproximación a la IA. En la documentación de OpenIA hay mucha más información que nos pueden dar ideas de como solucionar otros tipos de problemas.

La IA llegó para quedarse, nadar contra la corriente no tiene sentido. Lo que nos toca a los desarrolladores es apropiarnos de estas nuevas tecnologías e incorporarlas a nuestras soluciones.

Lo que sucedará ahora es que se tratará de dar soluciones a problemas que antes no tenían con las tecnologías tradicionales, y nosotros los programadores tendremos que estar preparados para estos nuevos retos.