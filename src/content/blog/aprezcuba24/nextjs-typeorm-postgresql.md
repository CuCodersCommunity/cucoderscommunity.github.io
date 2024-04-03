---
title: "Propuesta de Arquitectura de aplicaciones NextJs con el ORM Typeorm y base de datos postgresql"
pubDate: "Fri Mar 22 2024"
image: "https://live.staticflickr.com/65535/53602841667_b154e4d0c8_z.jpg"
username: "aprezcuba24"
categories: ["software", "tutorials"]
description: "Nextjs ha llegado para revolucionar el desarrollo web. La adopción de los Server Component ha supuesto un cambio radical, que es hasta cierto punto es un regreso a los inicios del desarrollo web, donde el servidor interviene también en la generación de interfaces de usuario.

También pienso que los perfiles de programadores, frontend y backend, que por mucho tiempo se han manejados, con esta nueva filosofía dejan un poco de ser útiles. Y los desarrolladores fullstack tendrán ventaja."
---

Antes que todo les dejo el link del repositorio de ejemplo por si quieren entrar directo en el código. Aclarar que en el momento de publicación del artículo la aplicación todavía tiene errores, pero es funcional.

https://github.com/aprezcuba24/nextjs-example

Desde que fue lanzado la versión 13 de **Nextjs** tuvo mucha repercusión en el mundo del desarrollo Web. Venía con una tecnología muy novedosa, los **Server Component**. El paradigma en el desarrollo de aplicación web usando el tradicional framework **React** cambió. Ahora se puede implementar código donde una parte se ejecutará en el servidor y otra en el cliente.

Este cambio de paradigma trajo muchas confusiones, fundamentalmente porque no quedaba claro para los programadores, qué código se ejecuta en el servidor y cuál en el cliente. Ahora teníamos que aprender un metalenguajes propio del framework para diferenciar qué código es del cliente y cuál de servidor, las directivas `use server` y `use client`.

Unido al punto anterior, en la presentación del famework, se usaron ejemplos muy poco afortunados, poniendo código **SQL** muy cerca del código React. Muchos programadores mal interpretaron esos ejemplos y trajo mucho malestar.

Si bien es verdad qué fue chocante en un principio, el cambio del framework NextJs fue para mejor porque ahora tenemos en nuestra manos un framework con el que podemos cubrir todas las capas de la arquitectura de una aplicación web. Importante, tenemos que definir qué arquitectura tendrá nuestra aplicación porque el framework como tal no define cómo es que se debe ser.

**El presente artículo va de esto. Me propongo presentar un proyecto tipo y analizar la arquitectura que tiene.**

## La aplicación

La aplicación es el clásico CRUD de una entidad, que se llama **Category**. Esta cuenta con dos campos, **name** que es de tipo `string` y **description** que también es de tipo `string`.

La aplicación cuenta con las siguientes acciones.

**List**: En una pantalla se muestra una tabla con todos los datos registrados y se le permite al usuario paginar.

**New**: Se muestra un botón, `New`, que al pincharlo se levanta un modal con el formulario. Cuando se introduce los datos y se pincha el botón de `Save`. El formulario valida que los datos estén correctos y si lo están salva la información en la base de datos y actualiza el listado.

**Edit**: Básicamente funciona igual que el **New**, lo que antes hay que seleccionar el registro a editar.

**Delete**: El usuario selecciona el registro a eliminar y pincha el botón para eliminar. El sistema le muestra al usuario una ventana de confirmación y si el usuario le da continuar se elimina el registro.

## Arquitectura

Desde el punto de vista **arquitectónico** la aplicación la divido en 4 partes fundamentales.

1. **modelo**: Aquí se define las clases **Entidad** con la configuración del **ORM**  y validación.
2. **accions**: Se define las operaciones relacionadas con la lógica del negocio.
3. **Server component**: Como su nombre lo indica es un **server component** de **React** y es el encargado de recibir las peticiones que vienen desde el cliente. Es aquí donde comienza el control de nuestro código.
4. **Componentes de React**: Se encuentran todos los componentes de React que hagan falta para mostrar la información al usuario e implementar las pantallas.

A continuación basándonos en el ejemplo ya descrito, iremos describiendo cada una de las capas de la aplicación. Pero antes hablemos de qué tecnologías que se utilizaron.

## Tecnologías

### Typeorm

Todo sistema necesita guardar información en una base de datos. En la aplicación se utilizó **Postgresql** y para gestionar la integración se utilizó el **ORM Typeorm**. En internet puede encontrar abundante documentación. Particularmente lo que más me interesa es que se puede hacer migraciones de la base de datos.

### Class Validator

Class Validator es una librería que nos permiten validar si un objeto cumple con con un conjunto de reglas. Librerías de validación existen varias, pero la ventaja que le veo a esta es que nos permite definir la validación sobre la misma clase a validar, sin necesidad de crear un fichero externo.

## Modelo
Las entidades se pondrán en la carpeta `src/models/entity`. En nuestro ejemplo solo tenemos una entidad que es **Category** y este es el código fuente.

```
import { Length } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { AppBaseEntity } from "../app-base.entity"

@Entity()
export class Category extends AppBaseEntity {
  @PrimaryGeneratedColumn()
  id: number | undefined

  @Length(2)
  @Column("varchar", { length: 30 })
  name: string | undefined

  @Length(2)
  @Column("varchar", { length: 200 })
  description: string | undefined
}
```

En el código anterior vemos la mezcla de dos cosas. Por un lado tenemos decoradores propio del ORM para definir por ejemplo que esto es una entidad que se puede guardar en la base de datos y cuales son sus campos y a la vez validadores de **class validator** para configurar las reglas que debe cumplir los objetos de esta clase.

Por lo tanto esta clase cumple las dos funciones, validación y de medio de transporte entre la aplicación y la base de datos a través del ORM.

## Actions

Junto con la entidad se pone un fichero con el nombre **actions** y es aquí donde se implementa los métodos de la lógica del negocio. En el ejemplo solo tenemos los 4 básicos: list, create, remove y update.

```
'use server'

import { instanceToPlain, plainToClass } from "class-transformer";
import { Category } from "./category.entity";
import { PaginateData } from "@/types/pagination";

export async function create(props: any) {
  const entity = plainToClass(Category, props)
  return instanceToPlain(await entity.save())
}

export async function list(props: PaginateData) {
  return Category.paginate(props)
}

export async function remove(id: number) {
  return Category.delete(id)
}

export async function update(props: any) {
  const entity = plainToClass(Category, props)
  return instanceToPlain(await entity.save())
}
```

El código que se pone es muy sencillo pero evidentemente puede ser más o menos complejo según las necesidades de cada proyecto.

## Nextjs y React

Una de los puntos más importantes en cualquier arquitectura es la definición lo más pronto posible de todos los componentes reutilizables. Con tal objetivo en el proyecto se podrá encontrar un conjunto de componentes y helpers que ayudan a implementar casos de uso CRUD como el que estamos analizando. Componentes que son lo suficientemente sencillos para que su reutilización sea eficiente. Para no alargar tanto la explicación no se entrará en detalles, puede verlos en el repositorio del código fuente.

## Server component

Como se mencionó anteriormente este componente es el que recibe las peticiones del usuario. Es el encargado de interpretar qué quiere hacer y ejecutar la acción. 

Para la lógica se usa el helper **crud** que lo puede encontrar en el fichero `src/lib/crud.ts`. El uso del helper permite que implementar nuevos cruds sea realmente sencillo.

Aquí puede ver el código fuente del server component

```
import * as categories from "@/models/entity/category/actions"
import { CategoryTable } from "./Table"
import { DialogForm } from "./DialogForm"
import { crud } from "@/lib/crud"
import { TableContextProvider } from "@/context/table"

type PageProps = {
  searchParams: any
}

export default async function Page({ searchParams }: PageProps) {
  const { list, create, remove, update, paginate } = crud('/categories', categories)
  return (
    <div className="p-5">
      <TableContextProvider update={update} remove={remove}>
        <div className="mb-2 flex justify-end">
          <DialogForm title="New" action={create} defaultValues={{ name: '', description: '' }} />
        </div>
        <CategoryTable pagination={await list(searchParams)} paginate={paginate} />
      </TableContextProvider>
    </div>
  )
}
```

### Table

Lo siguiente es el componente de la tabla. Solo se pone el código relevante. Una vez más se usa un componente genérico **TableData** para facilitar el desarrollo. Fíjense que a pesar de ser un componete cliente se utiliza la entidad como tipo de dato. Esto es una de las ventajas de Next, el código del cliente y el servidor están realmente cerca.

```
function RowActions({ row }: ActionProps) {
  const { remove, update } = useTableContext()
  return (
    <BtnList>
      <DialogForm title="Edit" action={update} defaultValues={row} btnIcon={<Pencil1Icon />} />
      <BtnRemove action={remove} entityId={row.id} />
    </BtnList>
  )
}

const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: 'Description',
  },
  {
    accessorKey: "id",
    header: 'Actions',
    cell: ({ row }) => <RowActions row={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]

export function CategoryTable(props: Omit<TableDataProps, 'columns'>) {
  return <TableData {...props} columns={columns} />
}
```

### Formulario

No me gustaría poner el código del formulario porque es realmente extenso. Siempre puede verlo en el repositorio. En el formulario se utiliza la librería **react-hook-form** y para la validación **class validator** y una vez más utilizamos la misma clase entidad como modelo de la validación.

## Conclusión

El nuevo paradigma propuesto por Nextjs tiene muchas ventajas. 

Elimina la replicación de código, el mismo código que se usa para el backend es el que se utiliza para el frontend.

Las aplicaciones pueden ser más rápida. Antes el usuario necesitaba cargar el frontend y esperar que renderizara. Luego el frontend comenzaba a hacer llamadas al backend para obtener los datos y cuando los tiene es que empieza a mostrarlos. Con la nueva filosofía ya desde el backend se envían al cliente pantallas completas y las que se necesite del navegador, para terminarlas, se envían junto con los datos.

También facilita el desarrollo de perfiles **fullstack**. Un mismo desarrollador trabajará tanto en el frontend como en el backend y es que las fronteras en una aplicación Nextjs son casi inexistentes. Las empresas que logren aprovechar esta ventaja lograran una reducción en el coste de desarrollo.