---
title: "7 pasos para configurar tu backend en Node.js en un servidor VPS con CentOS 7"
pubDate: "Tue Mar 28 2023"
image: "https://firebasestorage.googleapis.com/v0/b/a-manyar.appspot.com/o/pm2banner.png?alt=media&token=0bf8d179-9d43-44b3-a6a1-6cddc7f921e7"
username: "kader1303"
categories: ["tutorials","devops"]
description: "Cómo configurar un servidor VPS con CentOS 7 para ejecutar una aplicación de backend de Node.js utilizando PM2, un gestor de procesos que permite administrar aplicaciones en un servidor de manera eficiente."
canonicalUrl: "https://kadergomez.dev/blog/7-pasos-para-configurar-tu-backend-en-nodejs-en-un-servidor-vps-con-centos-7md/"
---

PM2 es un gestor de procesos de Node.js que te facilita la administración de aplicaciones en un servidor. En este artículo, te describiré cómo configurar un VPS con CentOS 7 para que ejecutes tu backend y te puedas olvidar de los problemas.

## Paso 1: Configurar un VPS

Inicia sesión en tu servidor utilizando SSH con un usuario con permisos sudo y asegúrate de que tu sistema operativo está actualizado con el siguiente comando:

```
sudo yum update
```

## Paso 2: Instalar Node.js

Antes de instalar Node.js, debes agregar el repositorio a tu sistema. Para hacer esto, ejecuta los siguientes comandos: 

```
sudo curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
```

Luego, instala Node.js con el siguiente comando:

```
sudo yum install nodejs
```

## Paso 3: Instalar PM2

Para instalar PM2, ejecute el siguiente comando:

```
sudo npm install -g pm2
```

## Paso 4: Configurar la aplicación

A continuación, debe configurar su aplicación Node.js para que pueda ser administrada por PM2. Primero, navegue hasta el directorio de su aplicación y asegúrese de que su aplicación se pueda ejecutar con el siguiente comando:

```
node app.js #remplaza app.js por el nombre de entrada de tu aplicación
```

Si tu aplicación se ejecuta correctamente, puede detenerla con CTRL+C y continuar con la configuración.

Luego, inicia y guarda este proceso para que se quede registrado con PM2 utilizando los siguientes comandos:

```
pm2 start app.js
pm2 save
```

## Paso 5: Configurar PM2 para ejecutar en el inicio del sistema

Para asegurarse de que PM2 se inicie automáticamente cuando se inicie el servidor, ejecute el siguiente comando:

```
pm2 startup systemd
```

Esto creará un script que debes copiar y pegar en la consola para ejecutar.

## Paso 6: Administrar la aplicación con PM2

Ahora que su aplicación está configurada y ejecutándose con PM2, puede administrarla utilizando los siguientes comandos:

```
m2 list              # lista todas las aplicaciones que se ejecutan en PM2
pm2 logs              # muestra los registros de la aplicación
pm2 stop <app-name>   # detiene la aplicación especificada
pm2 restart <app-name># reinicia la aplicación especificada
pm2 delete <app-name> # elimina la aplicación especificada de PM2
```

## Paso 7: Configurar PM2 para el monitoreo de la aplicación

Para monitorear la aplicación, PM2 puede generar un informe de uso de la CPU, la memoria, el disco de su aplicación y mucho más. Para habilitar esta función debes registraste con una cuenta gratuita en [https://pm2.io](https://pm2.io) lo puedes hacer vinculando tu cuenta de GitHub si así lo deseas. 

Luego te va a pedir que crees un bucket con el nombre que desees y acto seguido de la creación del bucket te dará el código que debes ejecutar en tu consola del servidor ssh para vincularla con tu cuenta de PM2 y listo tendrás todos los logs, bugs, y detalles de rendimiento en un moderno panel de administración web donde además podrás detener, reiniciar o borrar tus procesos.

## Bonus Tip:

Si deseas un servidor VPS bueno, bonito y barato recomiendo 150% el servicio de los chicos de [ethernetservers.com](https://www.ethernetservers.com/clients/aff.php?aff=1999) con servidores privados desde $1.25 USD al mes y por supuesto puedes pagar con crypto.

<img src="https://firebasestorage.googleapis.com/v0/b/a-manyar.appspot.com/o/ethernet.png?alt=media&token=7bd223dd-7889-478a-af83-da5c8635211c" alt="Ofertas especiales de ethernet servers">
