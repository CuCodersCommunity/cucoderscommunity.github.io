---

title: "Arquitectura serverless en AWS para Nautacloud"
username: "Alejo2075"
pubDate: "May 23 2026"
description: "Nautacloud es una plataforma gratuita de hosting estático para desarrolladores en Cuba, construida con una arquitectura serverless sobre AWS."
image: "https://media.licdn.com/dms/image/v2/D4E12AQHypLUNRCiYfQ/article-cover_image-shrink_720_1280/B4EZ5TWIaGKoAQ-/0/1779514778149?e=1781740800&v=beta&t=4WoIb58uSz392jCG5bnYi-lX8BDOCTcADcUfCt47ZjI"
categories: ["cloud", "aws", "serverless"]
---

# Arquitectura serverless en AWS para Nautacloud

Nautacloud es un servicio gratuito de hosting estático pensado para desarrolladores en Cuba. La idea es simple: permitir que cualquier persona pueda publicar sus proyectos web sin depender de grandes proveedores cloud, dominios propios o infraestructura compleja.

El contexto técnico de Cuba obliga a tomar decisiones diferentes:

* El ancho de banda es limitado y costoso.
* La conexión puede ser inestable.
* Muchos servicios externos no siempre son accesibles.
* La latencia hacia Estados Unidos es la mejor opción disponible.

Por eso Nautacloud está diseñado para ser ligero, barato, resiliente y completamente serverless.

## Arquitectura general

La plataforma corre sobre AWS en `us-east-1` y evita servidores tradicionales, contenedores o recursos con costo fijo por hora.

Los componentes principales son:

* **CloudFront** para servir los sitios desde el edge.
* **S3** para almacenar los archivos de cada sitio.
* **CloudFront Functions** para enrutar subdominios.
* **API Gateway** para exponer la API.
* **Lambda** para la lógica backend.
* **DynamoDB** como base de datos principal.
* **SQS** para procesar despliegues de forma asíncrona.
* **Cognito** para autenticación.

La idea central es mantener una arquitectura simple, escalable y de bajo costo.

## Un bucket, una distribución, muchos sitios

Todos los sitios viven dentro de un mismo bucket de S3 usando prefijos:

```txt
sites/{subdomain}/index.html
sites/{subdomain}/assets/app.js
```

Cuando alguien visita:

```txt
miapp.nautacloud.net
```

una CloudFront Function lee el subdominio y reescribe la ruta internamente hacia:

```txt
/sites/miapp/index.html
```

Esto evita crear un bucket o una distribución de CloudFront por cada usuario. Menos recursos, menos costo y menos complejidad.

## Deploys asíncronos

El usuario no sube sus archivos directamente a una Lambda. El flujo es:

1. El cliente pide una URL firmada.
2. La API valida cuotas y genera un `uploadId`.
3. El usuario sube un `.zip` directamente a S3.
4. S3 envía un evento a SQS.
5. Una Lambda procesa el archivo, valida el contenido y publica el sitio.

Este diseño permite que un despliegue sobreviva a conexiones lentas, caídas del cliente o reintentos duplicados.

## DynamoDB single-table

Nautacloud usa una sola tabla de DynamoDB para todo el estado persistente.

Ejemplo de modelo:

```txt
pk = USER#{userId}
sk = ACCOUNT

pk = USER#{userId}
sk = SITE#{subdomain}

pk = SUBDOMAIN#{subdomain}
sk = RESERVATION
```

Esto permite consultar todos los sitios de un usuario con una sola operación y reservar subdominios de forma atómica, evitando que dos usuarios reclamen el mismo nombre.

También deja la puerta abierta para futuros servicios como almacenamiento, bases de datos o funciones sin rediseñar todo el sistema.

## Autenticación con Cognito

La autenticación se maneja con Cognito y API Gateway valida los JWT antes de invocar cualquier Lambda.

Esto significa que las funciones backend ya reciben un usuario confiable desde:

```txt
event.requestContext.authorizer.jwt.claims.sub
```

No hay API keys largas, credenciales en el cliente ni validaciones manuales repetidas en cada handler.

## Cuotas para mantenerlo gratis

Como Nautacloud busca ser gratuito, las cuotas son esenciales.

Se validan en dos momentos:

* Antes de generar la URL firmada.
* Después de subir el archivo, durante el procesamiento real.

Así se evita confiar en datos enviados por el cliente y se protege la plataforma contra archivos demasiado grandes o despliegues abusivos.

## Infraestructura como código

Toda la infraestructura está definida con AWS CDK en TypeScript.

Los stacks están separados por dominio:

* `AuthStack`
* `StorageStack`
* `SitesStack`
* `ApiStack`
* `WafStack`
* `ObservabilityStack`

Los recursos críticos como buckets, tablas y logs usan `RemovalPolicy.RETAIN` para evitar pérdida accidental de datos.

## Qué sigue

El hosting estático es solo el primer paso. El mismo modelo puede crecer hacia otros servicios:

* Almacenamiento de objetos.
* Bases de datos pequeñas.
* Funciones serverless.
* Cargas ligeras tipo contenedor.
* Acceso controlado a modelos de IA.

La clave es que todo parte del mismo modelo: usuarios, recursos, cuotas, autenticación y despliegue serverless.

Nautacloud intenta demostrar que una nube pensada para Cuba puede construirse con una arquitectura moderna, económica y realista.

Si eres desarrollador en Cuba, puedes probarlo en:

```txt
nautacloud.net
```
