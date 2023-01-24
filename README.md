# CuCoders Web

> Esta página web se encuentra en desarrollo y aún no está lista para ser utilizada por los usuarios finales. Actualmente, se encuentra hosteada y puede ser probada para tener una idea de su funcionamiento, pero tenga en cuenta que al estar en desarrollo va a encontrar muchas faltas o errores. Las funcionalidades se irán informando porel canal de telegram a medida que se liberen. El código está abierto y puede ser utilizado como material de estudio, pero aún no se han establecido las directrices para contribuir al proyecto. Por lo tanto, por el momento no se aceptarán solicitudes de pull request. Se informará a través del canal de Telegram cuando se permitan contribuciones.

## 🚀 Estructura del Proyecto

Dentro del proyecto verás las estructura de carpetas y archivos:

```
/
├── public/
│   └── assets/
|       └── img/
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## CLI

All commands are run from the root of the project, from a terminal:

| Command                | Action                                             |
| :--------------------- | :------------------------------------------------- |
| `npm install`          | Installs dependencies                              |
| `npm run dev`          | Starts local dev server at `localhost:3000`        |
| `npm run build`        | Build your production site to `./dist/`            |
| `npm run preview`      | Preview your build locally, before deploying       |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro preview` |
| `npm run astro --help` | Get help using the Astro CLI                       |
