---
title: "Como crear una librería para Vue3"
pubDate: "Thu Mar 21 2024"
image: "https://github.com/CuCodersCommunity/cucoderscommunity.github.io/assets/50055316/06b16b54-012b-4d23-8334-e22b8ab5576a"
username: "carlosjorger"
categories: ["tutorials"]
description: "En este artículo explicare paso a paso como crear un librería para Vue3 usando Vite** y **Typescript."
canonicalUrl: ""
---

# Como crear una librería para Vue3

![vue-cover](https://github.com/CuCodersCommunity/cucoderscommunity.github.io/assets/50055316/06b16b54-012b-4d23-8334-e22b8ab5576a)

Estas interesado en ir un paso más allá de crear un producto; estás frustrado de que el ecosistema de **Vue** no es tan rico como el de **React** en cuanto a librerías, frameworks, etc y quieres contribuir a este. Una buena idea podría ser crear tu propia librería donde podrías reutilizar tus propias componentes, composable o módulos js/ts.

En este presente articulo plasmaré mis experiencia creando la librería de drad and drop [vue-fluid-dnd](https://github.com/carlosjorger/vue-fluid-dnd) para **Vue3** en la que actualmente estoy trabajando desde 0 usando **Vite** y **Typescript**. A diferencia de muchos artículos en internet voy a ir un paso más allá explicando un poco más algunos detalles de la configuración de nuestro proyecto que me hubiera gustado encontrarme cuando era un principiante.

### Creando el proyecto

Para crear el proyecto usando **Vite**, se necesita inicializar un proyecto de **Vite** con el siguiente comando:

```bash
npm create vite@latest
```

Se debe seguir los pasos de la creación eligiendo un nombre (en este caso **`template-vue-component-lib`**) y después seleccionar **Vue** y **Typescript**.

```bash
❯ npm create vite@latest
Need to install the following packages:
create-vite@5.2.1
Ok to proceed? (y) y
√ Project name: ... template-vue-component-lib
√ Select a framework: » Vue
√ Select a variant: » TypeScript
```

Después ir al directorio correspondiente y instalar las dependencias:

```bash
cd template-vue-component-lib
npm install
```

Esta es la estructura del proyecto:

![project-structure](https://github.com/CuCodersCommunity/cucoderscommunity.github.io/assets/50055316/c34920cb-691b-456a-b027-07b11ce75855)

Después se limpia el proyecto removiendo los archivos innecesarios (los archivos `index.html`, `App.vue`, `main.ts`, `stye.css` y las carpetas `public` y `assets`).

## Creando la componente de la librería

A continuación se crea una componente que es la funcionalidad que va a proveer nuestra librería.
Creamos el archivo `MessageText.vue` en la carpeta `/src/components`. Este es el código de nuestra componente, note que se está usando sintaxis `script setup` de **Vue3** con **Typescript**:

```vue
<script setup lang="ts">
defineProps<{ msg: string }>();
</script>

<template>
   
  <h1 class="message">{{ msg }}</h1>
</template>

<style scoped>
.message {
  color: #bbb;
  background-color: #222;
}
</style>
```

Después se crea el archivo `index.ts` en el directorio `/src`. Este archivo será el que exporte todas las herramientas que va a proveer nuestra librería, en nuestro caso la componente `MessageText`, pero de ser conveniente podemos exportar funciones, constantes, composables de **Vue**, todo lo que se necesite:

```ts
import MessageText from "./components/MessageText.vue";

export { MessageText };
```

## Configuración

Con el código de nuestra librería listo, a continuación se procede a configurar **Vite**, `package.json` y el `tsconfig.json` de nuestro proyecto.

### Configuración de Vite

Para crear nuestra librería haremos uso del ["Modo librería"](https://vitejs.dev/guide/build.html#library-mode) usando la configuración [`build.lib`](https://vitejs.dev/config/build-options#build-lib) dentro de `defineConfig`. Dentro del código se explica cada sección a través de comentarios:

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
    }),
  ],
  build: {
    lib: {
      // src/indext.ts es donde se expone el código que se va a usar de le librería
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "TemplateVueComponentLib",
      // el nombre de los archivos de salida cuando se le hace build al proyecto
      fileName: "template-vue-component-lib",
    },

    rollupOptions: {
      // asegúrate de externalizar las dependencias que no deben ser empaquetadas
      // dentro de tu biblioteca, en este caso es `vue` ya que se hará uso del
      // `vue` instalada por la aplicación que hace uso de esta librería.
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
```

### Configuración del archivo `tsconfig.json`

A continuación se procede a modificar el archivo `tsconfig.json`, este contiene las opciones requeridas para compilar el código de **Typescript** de nuestro proyecto:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true /* Bundler mode */,

    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "outDir": "dist",
    "declaration": true,
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": [],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

En breve se va a explicar los apartados más importantes de esta configuración, puede profundizar más en la [documentación oficial](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html):

- **esModuleInterop** : Con este flag activado podemos importar módulos de **CommonJS** cumpliendo con la especificación de los módulos de **ES6** en js transpilado.
- **outDir**: es el directorio en el cual se va a generar el js transpilado, por default se genera dicho js en la carpeta que contiene el código de **Typescript** compilado.
- **declaration**: con `declaration` igual a `true` se genera los archivos `.d.ts` para cada archivo **TypeScript** o **JavaScript** dentro de tu proyecto. Dichos archivos de definición de tipos describen la API externa de tu módulo. Con archivos `.d.ts` permiten que herramientas como **Visual Studio** pueden proporcionar _intellisense_ y tipos precisos para código sin tipificar.
- **include**: Especifica un array de nombres de ficheros o patrones de los ficheros que se van incluir en el programa.
- **exclude**: Especifica un array de nombres de ficheros o patrones de los ficheros que no se van a incluir de los especificados en `include`.

### Configuración del archivo `package.json`

El último archivo a configurar pero no menos importante es el `package.json`. En este se puede encontrar detalles como la versión del proyecto, las dependencias necesarias, las compatibilidades, entre otros datos:

```json
{
  "name": "template-vue-component-lib",
  "version": "0.0.0",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "https://github.com/carlosjorger/template-component-lib.git"
  },
  "files": ["dist"],
  "main": "./dist/template-vue-component-lib.cjs",
  "module": "./dist/template-vue-component-lib.js",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/template-vue-component-lib.js",
      "require": "./dist/template-vue-component-lib.umd.cjs"
    },
    "./style.css": "./dist/style.css"
  },
  "types": "./dist/index.d.ts",
  "scripts": {
    "dev": "vite",
    "build": "vite build && vue-tsc --emitDeclarationOnly",
    "preview": "vite preview"
  },
  "peerDependencies": {
    "vue": ">=3.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.4",
    "typescript": "^5.2.2",
    "vite": "^5.1.4",
    "vue-tsc": "^1.8.27"
  }
}
```

A continuación voy a indagar en las propiedades del `package.json` que a efectos de nuestra librería son más importantes, sino no le interesa este apartado mucho más detallado y técnico puede continuar leyendo en la próxima sección:

- **repository**: Aquí se concibe la información del repositorio y el sistema de control de versiones usado.
- **files**: Este campo opcional es un array de patrones de archivo que describe el contenido que se va a incluir cuando tu paquete se instala como una dependencia. En este caso incluimos la carpeta **dist** que incluye todo el contenido compilado.
- **main**: A este campo se le asigna el punto de entrada principal a tu programa, el cual es la raíz de la cual se va importar las funciones, objetos o componentes de `Vue`(como en este caso) que necesite el cliente. Aca sería el `javascript` compilado en formato **CommonJS** `./dist/template-vue-component-lib.cjs`.
- **exports**: Esta propiedad permite declarar qué módulo se debe utilizar al realizar solicitudes de módulos como `import "package"` o `import "package/sub/path"`. Dentro se encuentra los siguientes campos anidados:
  - Se define los tipos (`types`) en caso de usar `Typescript`.
  - El campo`import` define el recurso que se emite desde una solicitud una sintaxis **ESM** o similar.
  - El campo `require` es similar al campo `import` pero en el caso de las solicitudes de una sintaxis de `CommonJs/AMD` o similar.
- **types**: Aca se indica la ubicación del archivo que contiene la definición de los tipos de nuestra librería (los `.d.ts`).
- **build**: Este sería el comando que se corre cuando corremos en la consola `npm build`, en este caso primero corremos corremos `vite build` para desplegar nuestro proyecto en la carpeta **dist** y a continuación con el comando `vue-tsc --emitDeclarationOnly` para crear los archivos `.d.ts`.
- **peerDependencies**: Cuando una dependencia se enumera en un paquete como una `peerDependency`, no se instala automáticamente. En su lugar, el código que incluye el paquete debe ser incluido como su dependencia. `npm` lanzara un mensaje alarma sino encuentra este paquete. En este caso nos es muy útil ya que solo verificamos que el cliente tenga una versión de `vue` ya instalada al usar nuestra librería. Este [articulo](https://flaviocopes.com/npm-peer-dependencies/) lo explica de manera muy amena.

## Publicación de la librería

Para publicar nuestra librería, primero corremos el comando `npm run build` para preparar nuestra librería antes de ser publicada.
Después sino estas registrado en **NPM** puedes hacerlo a través de la terminal con el comando `npm adduser` y finalmente publicarlo a **NPM** ejecutando `npm publish`.

## Conclusiones

Gracias a las potencialidades de **Vite** podemos crear fácilmente una librería enriquecida con el tipado de **Vite**. Además, podemos adaptar el conocimiento adquirido en este artículo para hacer una librería para **Vanilla**, **React**, **Svelte**, etc. Si tiene alguna duda me puede contactar en [X](https://twitter.com/carlosjorgerc)
o en [linkedin](https://www.linkedin.com/in/carlosjorger/).
El repositorio del código mostrado se encuentra aquí <https://github.com/carlosjorger/template-component-lib>.
