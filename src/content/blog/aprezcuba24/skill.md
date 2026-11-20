---
title: "IA Skills"
pubDate: "Sun Feb 26 2026"
image: "https://live.staticflickr.com/65535/55117898594_64752ded05_c.jpg"
username: "aprezcuba24"
categories: ["software", "tutorials"]
description: "La inteligencia artificial ha entrado con mucha fuerza en el desarrollo de software. Y uno de los elementos más importantes son los Skilss. Crear skills propios y adaptados para cada proyecto es una forma de mejorar la calidad del código y la productividad."
---

La inteligencia artificial ha entrado con mucha fuerza en el desarrollo de software. Términos como **vibe coding** se hacen cada vez más cotidianos en nuestra profesión. Esto ha traído mucha preocupación a los programadores, pero entre más conozco la tecnología más me convenzo de que somos más necesarios que nunca, solo que nuestro enfoque a la hora de desarrollar debe cambiar.

Un programador que use IA para codificar aumenta su productividad de manera exponencial. La IA es capaz de generar mucho más código en menos tiempo, pero si el que está programando no conoce los conceptos básicos, no conoce de arquitectura, no conoce de patrones de diseño, etc., lo más seguro es que el producto final no sea escalable o que no funcione del todo bien.

En tiempos de IA, programar ya no va de escribir código. Cada vez será más extraño que tengamos que implementar por nosotros mismos un ciclo for, una clase o cualquier código en general. Nuestra función estará más enfocada en el diseño de software y arquitectura, y en tener la habilidad suficiente para guiar a la IA a programar según los estándares que tenemos definidos. El programador se convierte de esta forma en un jefe de equipo que tiene programadores a su servicio (la IA) que son los encargados de hacer la codificación.

Uno de los conceptos básicos son los **skills**, que en esencia son recetas donde se le explica a la IA cuál es la forma correcta para resolver un determinado problema. Por ejemplo, supongamos que queremos implementar una pantalla con React. Nuestra función sería indicarle a la IA qué debe tener la pantalla, pero por mucho contexto que le demos siempre se nos van a quedar elementos fuera. No le diríamos a la IA de qué manera se deben declarar las variables, o cuáles son los hooks que debe utilizar, cómo garantizar que la pantalla haga la menor cantidad de rerenders, etc. Todas estas decisiones la IA las va a tomar por nosotros y nos tocaría después revisar el código resultante y arreglar los elementos en los que no estamos de acuerdo. Es aquí donde los skills son una solución. Se puede tener un skill donde tengamos definidas cuáles son todas estas consideraciones de diseño de código y la IA las puede tener como parte del contexto.

Existen muchos sitios en internet donde se pueden encontrar skills desarrollados por la comunidad que podemos usar en nuestros proyectos. En lo personal, el sitio que más utilizo es https://skills.sh/, plataforma creada por Vercel. Aquí podrás encontrar skills para muchas tareas: optimización de código React, garantizar que tus páginas cumplan con las reglas de SEO, cómo desarrollar mejores interfaces, etc. Usar estos skills garantiza que el resultado se vea más profesional y que el código generado por la IA cumpla con las mejores prácticas de desarrollo.

## Creación de skills en los proyectos

Cuando se comienza un nuevo proyecto, una de las primeras tareas es identificar los skills de la comunidad que nos son útiles. Para esto tenemos que tener en cuenta las tecnologías que vamos a utilizar: framework, lenguajes de programación, sistema de base de datos, etc.

Por ejemplo, si vamos a desarrollar una aplicación basada en React, que utilice Next.js y el ORM Prisma, podríamos seleccionar los siguientes:

- [vercel-react-best-practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices) Este skill le indica a la IA cuáles son las mejores prácticas a la hora de desarrollar aplicaciones con React. Cómo es la forma correcta de crear componentes, cómo evitar rerenders, cuáles son los hooks más importantes y cómo se utilizan, etc.
- [interface-design](https://skills.sh/dammyjay93/interface-design/interface-design) Contiene sugerencias de cómo usar las sombras, cómo hacer el borde de los elementos, etc. Nos permite crear interfaces más elaboradas y no las clásicas que generan los sistemas de IA.
- [prisma-expert](https://skills.sh/sickn33/antigravity-awesome-skills/prisma-expert) Contiene las buenas prácticas a la hora de desarrollar con el ORM Prisma.

Estos son algunos de los skills que podríamos utilizar, pero existe un amplio catálogo que se adapta a la mayoría de las necesidades.

Por lo general la documentación que he encontrado sobre el tema se queda hasta aquí: buscar skills de terceros e instalarlos en el proyecto, y eso está bien, pero es solamente la punta del iceberg. El poder real aparece cuando comenzamos a crear skills propios y muy adaptados a las condiciones y arquitectura de un proyecto en particular.

Para desarrollar mi idea lo vamos a hacer a través de un caso real que tuve en uno de mis proyectos.

Estoy desarrollando una aplicación con el framework **HonoJs** e, independientemente del framework utilizado, uno de los casos típicos es la necesidad de crear CRUDs de entidades. Una de las entidades del proyecto es **Advertisement**, entidad que tiene los campos: title, description, imageUrl y targetUrl.

Lo primero que hice fue escribir un prompt para indicarle a la IA que quería crear el CRUD de la entidad y que debía tener tres componentes:

- Un repositorio, que se va a encargar del acceso a la base de datos.
- Una clase servicio con la lógica de negocio.
- Las rutas en Hono para poder implementar las endpoints.
- Usando el sistema de contexto de Hono.js, debía implementar un mecanismo de inyección de dependencias.

Basado en el prompt, la IA creó los 4 artefactos de código, pero tenía un problema fundamental: tanto la clase Repositorio como la de Servicio y los endpoints tenían toda la lógica dentro, lógica que al crear un nuevo CRUD se iba a tener que repetir. Con los siguientes problemas:

- Tener código repetido en un sistema afecta la gestión del código. Cambiar algo implica hacerlo en todos los lugares donde está.
- Nuestro código crecerá innecesariamente, lo que traería problemas de rendimiento.
- Y algo fundamental en estos tiempos de la IA: **cada vez que la IA tenga que implementar una nueva funcionalidad tiene que cargar todos estos ficheros con código repetido, con el consiguiente gasto de tokens, que es dinero**.

El siguiente paso en el desarrollo fue refactorizar los componentes. Le fui indicando a la IA que debía crear una clase base para el Repositorio y el Servicio donde pusiera todo el código que podría ser reutilizado en nuevos CRUDs.

Algo similar hice con los endpoints. Le indiqué a la IA que creara un helper que, dado un modelo de la base de datos y el servicio, creara los endpoints. De esta forma solo tengo que llamar al helper y pasarle la configuración necesaria.

Todo esto me llevó un tiempo considerable y no podía permitirme pasar por todos estos pasos otra vez cuando volviera a crear un nuevo CRUD, y es aquí cuando la magia de los skills aparece.

**Crear un skill muy particular para el proyecto, indicándole a la IA cómo es que debe crear los CRUDs en el sistema.**

Este skill podría ser utilizado en otros proyectos, pero realmente no es algo en lo que nos debamos preocupar en este momento. Entre más especializado esté el skill en el proyecto, mejores resultados obtendremos. A la larga, crear nuevos skills en otros proyectos tiene un costo mínimo, como veremos más adelante.

Después de que tuve el código del CRUD completo, con la arquitectura deseada, le dije a la IA que creara un skill basado en lo que ya había hecho. La IA lo generó, lo revisé y ajusté lo que consideré necesario.

A partir de ahora, cuando tenga que crear un nuevo CRUD, solo tengo que decirle a la IA que utilice el skill y quedará exactamente como lo quiero. Por otro lado, el skill no es una receta estática: si en el proceso de desarrollo identifico nuevos elementos, solo tendría que añadirlos al skill y listo.

## Conclusión

El desarrollo de skills particulares para los proyectos aumenta considerablemente la velocidad de desarrollo. La cuestión es ir identificando constantemente procesos repetitivos y crear a partir de ellos nuevos skills.

Se podrían tener skills donde le indicamos cómo se crean los formularios en nuestra aplicación, cómo se deben hacer los componentes de interfaz como botones, inputs, selects, etc. Cuáles son las pautas de diseño, colores, etc.

Con todo esto, la IA se convierte en nuestro mejor aliado porque conocerá cómo nosotros hacemos las cosas y lo hará siempre perfecto.