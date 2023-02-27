# CuCoders | La Plataforma de los devs cubanos

![image](https://user-images.githubusercontent.com/53962116/221084096-8354bbea-77dd-416e-8154-581f279ada27.png)

CuCoders es una plataforma creada con el fin de potenciar el desarrollo de software en Cuba y apoyar a los desarrolladores y emprendedores en su carrera profesional. En CuCoders puedes descubrir recursos, aplicaciones, artículos, perfiles de programadores y ofertas laborales. CuCoders es el lugar perfecto para encontrar oportunidades y mantenerse actualizado en el mundo de la programación.

## Stack

- [Astro](https://astro.build/)
- [Taildwind](https://tailwindcss.com/)
- [Flowbyte](https://flowbite.com/)
- [Giscus](https://giscus.app/) for comments box

## 🚀 Estructura del Proyecto

Dentro del proyecto encontrarás las estructura de carpetas siguientes:

```
/
├── .github/workflows  # Workflows de Github Actions para compilar el proyecto
├── public/            # Directorio con los ficheros publicos del proyecto
│   └── assets/
|       └── img/
├── src/
│   ├── components/   # Todos los compoenentes reutilizables de la web
│   ├── content/   # Aqui se almacena el conenido que se muestra en la web, organizado por categorias y usuarios
|       └── apps/
|       └── blogs/
|       └── events/
|       └── resources/
│   ├── layouts/     
│   └── pages/
│   └── data/  # Data config and static site data like categories.
│   └── templates/   # Las plantillas utilizadas para la generacion de ciertos documentos .md
└── package.json
```

Cualquier activo estático, como imágenes, se puede colocar en el directorio `público/`.

## CLI

Todos los comandos se ejecutan desde la raíz del proyecto, desde una terminal:

| Command                | Action                                             |
| :--------------------- | :------------------------------------------------- |
| `npm install`          | Installs dependencies                              |
| `npm run dev`          | Starts local dev server at `localhost:3000`        |
| `npm run build`        | Build your production site to `./dist/`            |
| `npm run preview`      | Preview your build locally, before deploying       |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro preview` |
| `npm run astro --help` | Get help using the Astro CLI                       |

## Arquitectura

CuCoders funciona con una arquitectura descentralizada utilizando como backend a GitHub. Los datos de los artículos, las aplicaciones y los eventos se almacenan en los ficheros físicos del repositorio público y los datos de cada usuario están en su poder en los repositorios especiales de cada usuario. La información más volátil que no necesita ser conservada en el tiempo como las ofertas laborales se encuentran almacenadas en microservicios que se acceden mediante una API, para los cuales en primera versión se crearon utilizando Airtable.

El sitio se recompila utilizando las GitHub Actions nutriéndose de la información almacenada en GitHub y utilizando el [backend serverless](https://github.com/CuCodersCommunity/cucoders-backend) desarrollado con Astro, el cual se encarga de conectarse y consumir información de los servicios de empleos y próximamente de los servicios y aplicaciones destacadas en la web.

El usuario visualiza la información en el sitio web estático construido con Astro y mediante el bot de Telegram con la publicación de las nuevas ofertas laborales.

Arquitectura permite mantener los costos del mantenimiento del proyecto casi nulos así como permite que la información se mantenga pública y siempre accesible para garantizar la continuidad del proyecto.

![image](https://user-images.githubusercontent.com/53962116/221088113-980b185a-0241-4388-a94f-92fc59178853.png)

## Despliegue

CuCoders puede ser desplegado en cualquier proveedor que permita la construcción de páginas estáticas. En estos momentos estamos utilizando GitHub Pages para la cual hay una serie de configuraciones específicas en los ficheros de configuración de las GitHub Actions y los ficheros de configuración de Astro.

## Constribuir

CuCoders es una solución de código abierto. Los Pull Requests y las contribuciones son bienvenidas! Para contribuir con el proyecto puedes informar de algún [error](https://github.com/CuCodersCommunity/cucoderscommunity.github.io/issues/new), sugerir una [nueva característica](https://github.com/CuCodersCommunity/cucoderscommunity.github.io/issues/new) o comenzar a trabar solucionando algún Issue que haya sido marcado como "[aceptado](https://github.com/CuCodersCommunity/cucoderscommunity.github.io/labels/Accepted)".

Para más información lea el fichero [Contributing.md](/CONTRIBUTING.md).

## Autor

- [Manuel Ernesto Garcia](https://manuelernestog.github.io/)

## Contribuidores

<a href="https://github.com/CuCodersCommunity/cucoderscommunity.github.io/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=CuCodersCommunity/cucoderscommunity.github.io" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

