---
title: "Continuar Descargas en Flutter con Dio"
pubDate: "Fri Apr 28 2023"
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xrrKa4oJEBgu338ZxjQHeg.jpeg"
username: "rlazom"
categories: ["tutorials","mobile","software"]
description: "Agregue la capacidad de reanudar las descargas en su aplicación Flutter"
canonicalUrl: "https://medium.com/flutter-espa%C3%B1a/continuar-descargas-en-flutter-con-dio-8d611c115cf2"
---

Agregue la capacidad de reanudar las descargas en su aplicación Flutter

## Resumen

Al final de esta publicación, podrá descargar archivos, manejar descargas incompletas, reanudar descargas, cancelar, obtener el estado actual de la descarga (porcentaje o tamaño restante) y fusionar todos los fragmentos en un solo archivo.

## Situación actual

Me enfrentaba a un problema con mi proyecto actual. Necesito manejar archivos de video grandes, a veces la descarga no se completa y cada vez que el usuario accede a una vista específica, la descarga comienza nuevamente desde el principio.
Al momento de escribir esta publicación, el [plugin dio](https://pub.dev/packages/dio) no tiene la capacidad de agregar datos a un archivo existente durante la descarga.

## Entonces, ¿qué hacemos?

Vamos a implementar un procedimiento personalizado para manejar la lógica de nuestro negocio.

## Dependencias

Vamos a necesitar agregar algunas dependencias para ayudarnos con la implementación de nuestro servicio.

- [dio: 5.1.1](https://pub.dev/packages/dio)
- [path: 1.8.3](https://pub.dev/packages/path)

```
import 'package:dio/dio.dart';
import 'package:path/path.dart' as path;
```

## Parámetros del procedimiento

Recibiremos la url remota del archivo (fileUrl) a descargar y la ruta local del archivo (fileLocalRouteStr) en el almacenamiento local de nuestro usuario.

```
Future<File?> getItemFileWithProgress({
  required String fileUrl, 
  required String fileLocalRouteStr,
}) async {
  ...
}
```

## Variables Locales

Primero creemos una instancia de la clase Dio y las variables necesarias para manejar la ruta del archivo para que podamos “jugar” con el nombre del archivo.

```
Dio dio = new Dio();
File localFile = File(fileLocalRouteStr);
String dir = path.dirname(fileLocalRouteStr);
String basename = path.basenameWithoutExtension(fileLocalRouteStr);
String extension = path.extension(fileLocalRouteStr);

String localRouteToSaveFileStr = fileLocalRouteStr;
```

Ahora vamos a comprobar si existe el archivo local.

```
bool existsSync = localFile.existsSync();
```

Si el archivo local NO EXISTE, entonces estamos en el mejor de los casos donde vamos a comenzar la descarga desde cero. Pero si el archivo EXISTE, entonces debemos hacer algo de magia.

## La Magia ✨

Primero, obtengamos el tamaño del archivo remoto, luego el tamaño del archivo local y lo agregamos a una lista que contendrá todos los tamaños de los fragmentos (partes del archivo).

```
if(existsSync) {
  Response response = await dio.head(fileUrl);
  int totalBytes = int.parse(response.headers.value('content-length')!);
  
  int fileLocalSize = localFile.lengthSync();
  List<int> sizes = [fileLocalSize];
```

Crearemos tantos fragmentos del archivo como sea necesario y, por supuesto, este número será desconocido, por lo que iteraremos hasta que el nombre del fragmento no exista y cada iteración modificará el nombre del fragmento y agregará el tamaño del fragmento a nuestra lista de tamaños (necesitaremos saber la suma de todos los tamaños eventualmente).

```
int i = 1;
localRouteToSaveFileStr = '$dir/$basename''_$i$extension';
File _f = File(localRouteToSaveFileStr);
while (_f.existsSync()) {
  sizes.add(_f.lengthSync());
  i++;
  localRouteToSaveFileStr = '$dir/$basename''_$i$extension';
  _f = File(localRouteToSaveFileStr);
}
```
Cuando el código sale del ciclo while, tenemos el nuevo fragmento listo para almacenar los bytes restantes del archivo. Así que tendremos que sumar los tamaños hasta ahora y crear las Opciones para el encabezado en la descarga.

```
int sumSizes = sizes.fold(0, (p, c) => p + c);
  Options options = Options(
    headers: {'Range': 'bytes=$sumSizes-'},
  );
}
```

Aquí estamos diciendo, en la próxima descarga, busque solo desde este byte (sumSizes) hasta el final del archivo (también podríamos especificar el rango final de bytes, pero no es necesario en este caso)

Fin de La magia ;)

## Descarga del fichero

```
wait dio.download(fileUrl, localRouteToSaveFileStr, options: options);
```

Hemos terminado, ¿verdad?… ¿¿verdad??

## Mezclar los pedazos del fichero

Espera, todavía tenemos que hacer algunas cosas con todos los fragmentos del fichero. Si existe el archivo local, entonces debemos fusionar todas las partes pequeñas del archivo original en un solo fichero y eliminar los fragmentos después.

```
if (existsSync) {
  var raf = await localFile.open(mode: FileMode.writeOnlyAppend);
  
  int i = 1;
  String filePartLocalRouteStr = '$dir/$basename''_$i$extension';
  File _f = File(filePartLocalRouteStr);
  while (_f.existsSync()) {
    raf = await raf.writeFrom(await _f.readAsBytes());
    await _f.delete();
  
    i++;
    filePartLocalRouteStr = '$dir/$basename''_$i$extension';
    _f = File(filePartLocalRouteStr);
  }
  await raf.close();
}

return localFile;
```

Abriremos localFile en modo de escritura, pero solo agregando los nuevos bytes al final (append), por lo que no sobrescribiremos lo que ya está allí. Muy similar a lo que hicimos antes, iteraremos hasta que el nombre del fragmento no exista y luego devolveremos el ARCHIVO COMPLETO. 🥳

## BONO: Progreso de la descarga y Cancelar descarga

Agreguemos 2 variables más al entorno.

```
CancelToken cancelToken = CancelToken();
final percentNotifier = ValueNotifier<double?>(null);
```

El primero será “cancelToken” para darnos la posibilidad de cancelar la descarga actual, y el “percentNotifier” nos ayudará a escuchar solo los cambios porcentuales para que no tengamos que volver a dibujar toda la pantalla, en lugar de solo el widget deseado.
Ahora necesitaremos 2 procedimientos más para manejar esta nueva lógica.

```
_cancel() {
  cancelToken.cancel();
  percentNotifier.value = null;
}

_onReceiveProgress(int received, int total) {
  if (!cancelToken.isCancelled) {
    int sum = sizes.fold(0, (p, c) => p + c);
    received += sum;
    percentNotifier.value = received / total;
  }
}
```
Antes de ejecutar la descarga, debemos verificar si el token de cancelación ya se usó y, de ser así, actualizar la variable con un nuevo valor.

```
if (cancelToken.isCancelled) {
  cancelToken = CancelToken();
}

await dio.download(
  fileUrl,
  localRouteToSaveFileStr,
  options: options,
  cancelToken: cancelToken,
  deleteOnError: false,
...
```

El parámetro “deleteOnError” en falso nos permitirá cancelar la descarga y dejar el archivo incompleto en el almacenamiento del usuario

Ahora escucharemos la devolución de llamada (callback) proporcionada por Dio en “onReceiveProgress” para actualizar nuestro notificador.


```
await dio.download(
  fileUrl,
  localRouteToSaveFileStr,
  options: options,
  cancelToken: cancelToken,
  deleteOnError: false,
  onReceiveProgress: (int received, int total) {
    _onReceiveProgress(received, fileOriginSize);
  },
);
```
Código Completo

```
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:path/path.dart' as path;

...

_cancel() {
  cancelToken.cancel();
  percentNotifier.value = null;
}

_onReceiveProgress(int received, int total) {
  if (!cancelToken.isCancelled) {
    percentNotifier.value = received / total;
  }
}

Future<File?> getItemFileWithProgress({
  required String fileUrl, 
  required String fileLocalRouteStr,
}) async {
  Dio dio = new Dio();
  File localFile = File(fileLocalRouteStr);
  String dir = path.dirname(fileLocalRouteStr);
  String basename = path.basenameWithoutExtension(fileLocalRouteStr);
  String extension = path.extension(fileLocalRouteStr);
  
  String localRouteToSaveFileStr = fileLocalRouteStr;
  List<int> sizes = [];
  int fileOriginSize = 0;
  Options? options;

  bool existsSync = localFile.existsSync();
  if(existsSync) {
    Response response = await dio.head(fileUrl);
    fileOriginSize = int.parse(response.headers.value('content-length'));
    
    int fileLocalSize = localFile.lengthSync();
    sizes.add(fileLocalSize);

    int i = 1;
    localRouteToSaveFileStr = '$dir/$basename''_$i$extension';
    File f = File(localRouteToSaveFileStr);
    while (f.existsSync()) {
      sizes.add(f.lengthSync());
      i++;
      localRouteToSaveFileStr = '$dir/$basename''_$i$extension';
      f = File(localRouteToSaveFileStr);
    }

    int sumSizes = sizes.fold(0, (p, c) => p + c);
    if (sumSizes < fileOriginSize) {
      options = Options(
        headers: {'Range': 'bytes=$sumSizes-'},
      );
    }
  }

  if (cancelToken.isCancelled) {
    cancelToken = CancelToken();
  }
  await dio.download(
    fileUrl,
    localRouteToSaveFileStr,
    options: options,
    cancelToken: cancelToken,
    deleteOnError: false,
    onReceiveProgress: (int received, int total) {
      _onReceiveProgress(received, fileOriginSize);
    },
  );


  if (existsSync) {
    var raf = await localFile.open(mode: FileMode.writeOnlyAppend);
    
    int i = 1;
    String filePartLocalRouteStr = '$dir/$basename''_$i$extension';
    File _f = File(filePartLocalRouteStr);
    while (_f.existsSync()) {
      raf = await raf.writeFrom(await _f.readAsBytes());
      await _f.delete();
    
      i++;
      filePartLocalRouteStr = '$dir/$basename''_$i$extension';
      _f = File(filePartLocalRouteStr);
    }
    await raf.close();
  }
  
  return localFile;
}
```

Repositorio en GitHub

https://github.com/rlazom/resumeDownload

Si encontraste este post útil, dame unos aplausos y sígueme para más contenido. 👏👏👏