---
title: "Escuchando los cambios en los datos de tablas en PostgreSQL"
pubDate: "Mon Feb 27 2023"
image: "https://user-images.githubusercontent.com/53962116/221750863-ff8b2f5a-022e-409b-a7d6-83b31721591b.png"
username: "ppmaluch"
categories: ["tutorials","database","software"]
description: "Cómo podemos escuchar y reaccionar a eventos en la base de datos que creen o modifiquen datos, para luego ser procesados o manipulados."
canonicalUrl: ""
---

## El problema

A partir de la necesidad de enviar datos a un broker de Kafka cada vez que se insertaba una nueva fila en una tabla de la base de datos, surge el problema de cómo hacerlo de una manera lo más inmediata posible y eficiente. Después de que el equipo abordó diferentes soluciones, se decidió escribir una aplicación de consola simple que "escuchara" las notificaciones de la base de datos y las enviara a Kafka. Se pudiera haber usado para ello algún conector de Kafka para Postgres pero era necesario hacer lógica sobre los datos antes de enviarlos a Kafka, así que.... tocaba codear!

## La solución

Para poder usar event listening, se estarán usando los comandos NOTIFY/LISTEN a lo largo de este artículo.

Primero nececsitamos una base de datos, y luego crear una tabla con algunos datos (paso que asumiré que tienes o sabes hacer, de manera de no salirnos del tópico de este post, aquí puedes consultar referencias [aquí](https://lifewithdata.com/2021/12/08/sql-create-a-database-and-a-table-in-postgresql/))

Después de ello necesitamos enviar un evento a nuestra app a la escucha cada vez que ocurre un cambio en la tabla. En este caso en particular, solo se necesitaban los eventos de inserción, pero bien pudieran ser otros.

Entonces, el primer paso para el objetivo, es crear en nuestra base de datos una función PSQL.

### Creando una función de notificación en PSQL

Cualquier tabla de la que querramos "observar" los cambios en sus datos, tendrá asociado un trigger para reenviar estos cambios a una función (la función trigger que tenemos a continuación 😁) que use la sentencia ``NOTIFY``.

```SQL
CREATE FUNCTION public.NotifyOnDataChange()
  RETURNS trigger
  LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
  data JSON;
BEGIN
  -- si eliminamos, entonces pasamos a la notificación la data antigua
  -- si insertamos o actualizamos, pasamos la data nueva
  IF (TG_OP = 'DELETE') THEN
    data = row_to_json(OLD);
  ELSE
    data = row_to_json(NEW);
  END IF;

    -- el channel name (datachangeevent en este caso) TIENE que estar en lowercase, de otra manera pg_notify() no funcionará
    PERFORM pg_notify('datachangeevent', data::TEXT);
  RETURN NULL;
END
$BODY$;
```

Para explicar un poco de que va el snippet anterior, primeramente declaramos la variabla _data_, la cuál contedrá el resultado final que se emite a través de un evento de notificación, luego, se define la lógica a tratar según la operación que se está realizando por la base de datos, esto se conoce mediante la variable _TG_OP_. _row_to_json_ permite parsear los campos de la tabla en formato JSON. Finalmente se tiene que emitir el evento, para ello se usa _pg_notify()_, la función de Postgres que emite estos cambios a través de un channel.

**Nótese que podemos escuchar todos los cambios, si solo quisiéramos escuchar uno de ellos, entonces no se especificaría aquí con la sentencia _IF (TG_OP)_**

### Creando el trigger

Después de eso se necesita crear un trigger que se dispare según la operación de la tabla que se defina (_INSERT, DELETE_, etc) y ejecute la función **NotifyOnDataChange()** creada anteriormente.

```SQL
CREATE TRIGGER OnDataChange
  AFTER INSERT OR DELETE OR UPDATE
  ON public.table1
  FOR EACH ROW
  EXECUTE PROCEDURE public.NotifyOnDataChange();
```

**Nótese otra vez, que hemos especificado INSERT, DELETE y UPDATE. Es tu decisión según tu caso de uso usar una o más operaciones.**

Ok, ya tenemos todo, pero, qué pasa si tenemos más tablas y queremos escuchar los cambios en todas ellas?

En nuestro entorno de trabajo, existía particularmente una tabla con particiones físicas, asi que era necesario tener todos los eventos de todas ellas.

La siguiente función itera sobre todas las tablas y crea los triggers en cada una de ellas.

```SQL
CREATE FUNCTION public.CreateTriggerForAllTables()
  RETURNS void
  LANGUAGE 'plpgsql'
AS $BODY$
DECLARE
  createTriggerStatement TEXT;
BEGIN
  FOR createTriggerStatement IN SELECT
    'CREATE TRIGGER OnDataChange AFTER INSERT OR DELETE OR UPDATE ON '
    || tab_name
    || ' FOR EACH ROW EXECUTE PROCEDURE public.NotifyOnDataChange();' AS trigger_creation_query
  FROM (
    SELECT
      quote_ident(table_schema) || '.' || quote_ident(table_name) as tab_name
    FROM
      information_schema.tables
    WHERE
      table_schema NOT IN ('pg_catalog', 'information_schema')
      AND table_schema NOT LIKE 'pg_toast%'
  ) as TableNames
  LOOP
    EXECUTE  createTriggerStatement; -- crea el trigger ;)
  END LOOP;
END$BODY$;
```

💪 Y eso es todo!. Ya está listo nuestro servidor para enviar las notificaciones en los cambios de datos.

### Crear un cliente para recibir los cambios generados

Para nuestra aplicación de pruebas en consola, usamos .NET 7.0 con Npgsql.

En este caso muy simple, establecemos una conexión a Postgres a través del cliente Npgsql y se le asigna una acción al evento ``notification`` del objeto conexión ``conn`` de Npgsql. Aquí solo se está imprimiendo por consola el payload de la notificación proveniente de la base de datos por motivos educativos.  

```c#
using Npgsql;

const string connString = "<connection string>";

await using var conn = new NpgsqlConnection(connString);
await conn.OpenAsync();

//e.Payload es una representacion del JSON string que construimos enla función NotifyOnDataChange()
conn.Notification += (o, e) => Console.WriteLine("Received notification: " + e.Payload);

await using (var cmd = new NpgsqlCommand("LISTEN datachangeevent;", conn))
    cmd.ExecuteNonQuery();

while (true)
    conn.Wait();
```

Esto es todo, ya estamos escuchando todos los cambios desde la base de datos y podemos manipularlos como se requiera. Esto lo podemos hacer desde cualquier tecnología siempre y cuando nos podamos conectar a postgres y ejecutemos el comando ``LISTEN``.

**Nota, si el cliente no está conectado cuando están ocurriendo los cambios, estos se pierden.**

