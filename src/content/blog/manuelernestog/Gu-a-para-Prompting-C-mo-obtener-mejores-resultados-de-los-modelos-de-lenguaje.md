---
title: "Guía para Prompting. Cómo obtener mejores resultados de los modelos de lenguaje"
pubDate: "Tue May 02 2023"
image: "https://user-images.githubusercontent.com/53962116/235784627-d7470f5a-eacd-4607-a1ec-ae668cdcade3.png"
username: "manuelernestog"
categories: ["tutorials","ia","software"]
description: "En este artículo, discutiremos algunas guías para el prompting efectivo, incluyendo cómo escribir instrucciones claras y específicas, cómo darle al modelo tiempo para pensar, y cómo abordar algunas de las limitaciones comunes de los modelos."
canonicalUrl: ""
---

Los modelos de lenguaje, especialmente aquellos basados en redes neuronales como GPT-3, han demostrado ser muy útiles para una amplia variedad de tareas, desde la generación de texto hasta la traducción automática, pasando por la clasificación de texto y la comprensión del lenguaje natural. Sin embargo, para obtener los mejores resultados de estos modelos, es necesario proporcionarles un prompt claro y específico que indique exactamente qué tarea se debe realizar y cómo debe hacerse.

En este artículo, discutiremos algunas guías para el prompting efectivo, incluyendo cómo escribir instrucciones claras y específicas, cómo darle al modelo tiempo para pensar, y cómo abordar algunas de las limitaciones comunes de los modelos de lenguaje.

## Guías para Prompting

### Escribir instrucciones claras y especificas

Una de las claves para un buen prompting es proporcionar instrucciones claras y específicas al modelo. Aquí hay algunas sugerencias para lograr esto:

-   Utilizar delimitadores: Es importante usar delimitadores para que el modelo pueda distinguir entre el texto que está proporcionando como entrada y el prompt que le está diciendo qué hacer. Los delimitadores pueden ser comillas, triple comillas, signos <> o cualquier otro que definamos.
    
-   Pedir salidas estructuradas: Es útil pedirle al modelo que produzca salidas estructuradas en lugar de texto sin procesar. Por ejemplo, puede pedirle que produzca un archivo JSON, XML o HTML.
    
-   Pedirle al modelo que haga algo cuando se cumplan ciertas condiciones: En lugar de simplemente pedirle al modelo que genere un texto, también puede pedirle que haga algo en función de ciertas condiciones. Por ejemplo, puede pedirle que genere un texto si ciertas palabras o frases están presentes, o que realice una acción específica si se cumplen ciertas condiciones.
    
-   Few-shot Prompting: Otra técnica útil es el few-shot prompting, que implica darle al modelo algunos ejemplos satisfactorios de una tarea completada y luego preguntarle qué hacer en función de esos ejemplos. Esto puede ser útil para tareas que no tienen una respuesta única o para las que es difícil proporcionar instrucciones precisas.
    

### Darle tiempo al modelo para pensar

Otra consideración importante para el prompting es darle tiempo al modelo para pensar. Con esto no referimos a crear un contexto detallado sobre cómo realizar una tarea en lugar de simplemente pedirle un resultado. Aquí hay algunas sugerencias:

-   Especificar los pasos para cumplir una tarea: En lugar de simplemente pedirle al modelo que realice una tarea, especifique los pasos que debe seguir para cumplir esa tarea. Por ejemplo, puedes proporcionar una lista de pasos numerados, como "Paso 1: identificar los problemas, Paso 2: proponer soluciones, etc."
    
-   Instruir al modelo a que trabaje en sus propias conclusiones: En lugar de decirle al modelo qué hacer en cada paso, puede pedirle que trabaje en sus propias conclusiones antes de presentar una respuesta. Por ejemplo, en lugar de decirle "¿Es correcta esta solución?" Puede pedirle que solucione el problema primero, y luego que compare su solución con la que se quiere abordar.

### Limitaciones del modelo

Es importante tener en cuenta que los modelos de lenguaje natural tienen sus limitaciones. Uno de los problemas más comunes es el de las "alucinaciones". Esto ocurre cuando se le pregunta algo al modelo y responde como si supiera la respuesta, incluso si no lo sabe. Para reducir este problema, es útil pedirle primero que encuentre información relevante sobre el tema que estamos abordando y luego pedirle información basada en esa información relevante.

### Ejemplo

Aquí tienes un ejemplo de un prompt que utiliza delimitadores claros para indicar qué información debe ser generada y cómo debe ser estructurada la salida, así como los pasos para cumplir.

```
Given a paragraph of text about a restaurant delimited by <>, generate a description of the restaurant's atmosphere and food, including any recommendations for dishes. Output the description as a JSON object with the following keys: 'atmosphere', 'food', and 'is_recomendated' 

Step 1: Read the paragraph and identify keywords related to atmosphere, food and if is recomended or not.

Step 2: Generate a sentence describing the atmosphere, a list with the food of the restaurant and if the restaurant is recomended based on the keywords identified in Step 1.

Step 3: Return a JSON object with the keys 'atmosphere', an arrays of 'food', a boolean 'is_recomendated', and their respective values." 

For example, given the following paragraph: "The restaurant is located in the heart of San Francisco and has a cozy atmosphere with dim lighting and comfortable seating. The menu features a variety of dishes, including seafood, pasta, and steak. The seafood is fresh and flavorful, and the pasta is made in-house daily. The steak is cooked to perfection and served with a side of roasted vegetables. Don't miss the tiramisu for dessert!" 

The output generated by the prompt might look like this: 

{ 
"atmosphere": "The restaurant has a cozy atmosphere with dim lighting and comfortable seating.",
"food": ["seafood","pasta","steak","vegetables"],
"is_recomendated": true
}

Restaurant text:

< Your Input Here >

```

#### Input

```
The restaurant serving jamon serrano and chicken in Japan was a disappointment. The dark and gloomy ambiance made it difficult to enjoy the food, which itself was mediocre at best. Overall, I would not recommend this place.
```


#### Output

```
{ 
"atmosphere": "The ambiance of the restaurant is described as dark and gloomy.",
"food": ["jamon serrano","chicken"],
"is_recomendated": false 
}
```

## Desarrollo iterativo de prompts 

Difícilmente vamos a ser capaces de obtener los resultados que deseamos con la creación de nuestro primer prompt, por lo que debemos llevar a cabo un proceso iterativo para irnos acercando al resultado deseado. Para llevar a cabo este proceso, los pasos serían los siguientes:

1.  Ser claro y específico: Debe ser específico y detallado para evitar alucinaciones y resultados inesperados.
2.  Analizar los resultados: después de que el modelo haya generado una salida, es importante analizar los resultados para comprender por qué el resultado no es el esperado. 
3.  Refinar la idea y el prompt: después de analizar los resultados, es posible que sea necesario ajustar la idea o el prompt para que el modelo pueda generar resultados más precisos. Esto puede implicar agregar más detalles al prompt o ajustar los parámetros del modelo.
4.  Repetir: Este proceso iterativo puede repetirse varias veces hasta que se obtengan los resultados deseados.

## Capacidades de los modelos de lenguaje natural

Los modelos de lenguaje natural tienen capacidades muy diversas que permiten procesar el texto de diferentes maneras. Algunas de las mas utilizadas que puedes emplear haciendo uso de las practicas anteriormente mencionadas son:

-   **Resumir texto**: la capacidad de generar un resumen del texto, enfocado en un área en particular, con una cantidad limitada de palabras u oraciones.
-   **Análisis**: la capacidad de identificar emociones y determinar si un texto es positivo , negativo o extraer información de un texto.
-   **Transformación**: la capacidad de traducir un texto a otro idioma, convertirlo de un estilo informal a uno formal o transformarlo de un formato a otro, como de JSON a HTML.
-   **Expansión**: la capacidad de expandir un texto, agregando más información y detalles para hacerlo más completo y detallado.


En conclusión, las todas técnicas mencionadas en esta guía pueden ser utilizadas tanto por desarrolladores para crear soluciones utilizando herramientas como la API de OpenAI, como por usuarios tradicionales para conseguir mejores resultados en su trabajo cotidiano. Todo el contenido de este artículo fue tomado del curso [ChatGPT Prompt Engineering for Developer](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/) de la plataforma [Deeplearning](https://www.deeplearning.ai/) y como no podía ser de otra forma pre-procesado por gpt-3 utilizando las mismas técnicas expuestas en el artículo. 

Si quieres profundizar un poco más en este tema viendo ejemplos prácticos, te invito a que le eches un vistazo al curso y a que te embulles a practicar creando tus propios prompts. Nos vemos en la próxima. Happy Prompting :) 
