---
layout: "../../../../layouts/postLayout.astro"
title: "CuCoders | Propuesta inicial para una Comunidad de Desarrolladores Cubanos"
pubDate: "Jan 13 2023"
description: "Hace unos días salí buscando opiniones sobre que tan beneficioso sería tener una comunidad de desarrolladores cubanos y qué características debería tener."
image: "https://user-images.githubusercontent.com/53962116/211159681-f1700806-8fa9-41d0-90c2-eb4ebdd6fec4.png"
categories: ["database","mobile","ia"]
---

Hace unos días salí buscando opiniones sobre que tan beneficioso sería tener una comunidad de desarrolladores cubanos y qué características debería tener. Luego de mezclar todas las ideas que tenía y las que dieron aquí, te traigo una propuesta de como podría ser la comunidad y la ejecución.

## Propuesta

De manera general la idea es que tengamos una web (Algo similar a https://dev.to ) donde se agrupe toda la información y se complemente con un foro (comunidad en Telegram) y una serie de canales de difusión. 

La web tendría las siguientes secciones: 
- Feed Principal con publicaciones de posts los miembros de la comunidad divididos por categorías.
- Perfiles para los devs 
- Directorio de los devs para poder filtrarlos, en busca de trabajo, categoría, etc. Esto apunta a su perfil donde tienen sus proyectos, servicios, contacto, etc.
- Ofertas laborales
-  Lista con próximos Eventos: nacionales, internacionales y de la comunidad.
-  Directorio de Recursos (iconos, frameworks, apps, postings, etc)
-  Directorio de Aplicaciones Cubanas: móviles, web y desktop. 
- Directorio de Servicios (Un lugar para que los interesados puedan ver ofertas de diseñadores, creación de webs, freelancers, formaciones, cursos y mentorías impartidos por miembros de la comunidad.)
- Info / Guías
	-  Rutas de programación según perfiles con vínculos a los recursos, etc.
	-  Howto, con soluciones probadas por la comunidad cubana.
	- Guías para principiantes (Setups, Softwares, etc..)
- Banco de Problemas con debates y votos

La web se complementaría con una comunidad en Telegram que contaría con:

-  Canal principal donde se publican los nuevos articulos, eventos, lanzamiento de nuevas apps e información de la comunidad.
- Canal dedicado para las ofertas de trabajo.
- Grupo de debate subdividido por temáticas (web, mobile, desktop, ia, blockchain, devops, game, QA)
- La información en los canales se publicaría por los miembros a través de un bot en Telegram y los administradores.
- El canal de ofertas y el de anuncios podrían tener un espejo en Twitter para replicar la información ahí también.

## Análisis 

En base a todas las características y opiniones recogidas cree la siguiente matriz DAFO.

![Dafo](https://user-images.githubusercontent.com/53962116/211059339-20e5ecb8-0778-471c-9f27-dc5034ffb090.png)

Con esto en mente, para intentar que el proyecto logre materializarse y partir de ahí tratar de garantizar su persistencia y la información que se comparta en el más allá de sí lo mantenemos nosotros o no, considero que la plataforma debe cumplir con los siguientes criterios:

- La plataforma debe crearse con un costo reducido y utilizará un generador de sitios estáticos para almacenar la información en texto plano de forma tal que sea pública.
- Algunas funcionalidades pueden ser manejadas por servicios de terceros para ahorrar tiempo y esfuerzo. 
- El desarrollo será asíncrono y se seguirán las guías comunes para contribuir en repositorios de código abierto. 
- Antes de comenzar a trabajar en la plataforma, se deben establecer las líneas de desarrollo y un estándar para el proyecto.

## Implementación

Ya que los usuarios finales de la comunidad son desarrolladores y para hacer el proyecto lo más económico y abierto posible, mi propuesta es crear una página web estática con arquitectura de islas generada con Github Actions y utilizar el propio Github como backend. Para los posts se utilizaría un formulario en la página web para crear la información y enviarla en la creación de un pull request automáticamente. Esto tiene varias ventajas, como obligar a los nuevos usuarios a familiarizarse con Github, permitir que los contribuidores aparezcan en el repositorio, almacenar todas las imágenes y datos en Github, y utilizar la infraestructura gratuita e ilimitada de Github para los build y el sitio. Además, la moderación del contenido y administración también se llevaría a cabo en Github y no sería necesario crear un backend o dashboard para esto. La otra parte de la información del usuario se obtendría de la API de Github así como del perfil personal del usuario.

![New Project](https://user-images.githubusercontent.com/53962116/211059555-79ef9167-ad32-455f-82bd-a408a15e0281.png)

El otro contenido que es más dinámico y no está pensado para ser creado por desarrolladores como las ofertas de trabajo o los patrocinadores si se almacenaría en un pequeño backend fuera de GitHub.

### Arquitectura 

![Arquitectura excalidraw](https://user-images.githubusercontent.com/53962116/211059657-8b6569e1-d784-4320-b5d9-e13d09169df6.png)

En este caso la página web estática que se alimenta de archivos en Github para mostrar el contenido de la comunidad. Los anuncios de trabajo y patrocinios serán manejados mediante micro-servicios que pueden ser creados con Airtable o algún backend as a service. Para las llamadas a la API o al bot de Telegram se utilizarán funciones serverless, que podrían desplegarse en Vercel o en Github Page. El bot de Telegram se encargará de gestionar los envíos de ofertas de trabajo desde la página web y la publicación de eventos y artículos en el canal de la comunidad por parte de los miembros. Para enviar el contenido a Twitter, se pueden utilizar servicios de integración como IFTTT.

### Stack

Para el desarrollo de la solución se emplearía principalmente JavaScript. Como metaframework para generar la web [Astro](https://astro.build/) y la UI se haría con [Tailwind](https://tailwindcss.com/).

### Comunidad

Todos los cambios o direcciones que tome este proyecto serán validados en gran medida por la comunidad (admins y miembros), esto se hará desde el [canal de telegram](https://t.me/cucoders) mediante votaciones.

Este proyecto ahora mismo no es más que una semilla, así que falta mucho por hacer y definir. Si te interesa que el proyecto salga adelante, la manera de apoyarlo es involucrándote de la forma en que te sea posible, ya sea con feedback, creando contenido, ayudando con el código, la moderación o compartiéndoselo a un amigo que le pueda interesar.

Mi intención es que logremos que esto se mantenga sencillo, que sea una ayuda y no una carga, que tengamos un espacio con mucha buena onda para ayudarnos entre todos y crecer entre todos. Sin más te invito a que se pasen por la [comunidad de Telegram](https://t.me/CuCodersComunidad/1) y al [canal principal](https://t.me/cucoders) para ir dándole forma a esto. Un saludo grande y nos vemos por allá. 👋