---
layout: "../../../../layouts/postLayout.astro"
title: "57 consejos para mejorar tu proyecto en GitHub"
pubDate: "Apr 15 2022"
description: ""
image: "https://img4.teletype.in/files/33/65/3365957f-caf4-4487-9ed0-2c4450556bc8.jpeg"
categories: ["devops","tutorials"]
---

En los últimos años, GitHub se ha convertido en el sitio donde se encuentran los proyectos OpenSource más populares (y siendo de Microsoft, quien lo hubiera dicho).

Ya porque creaste una herramienta genial y quieres que sea libre y mantenida con ayuda de los miembros de la comunidad o quieres usarla como portafolio para encontrar trabajo, debes trabajar en mejorarla y hacerla más digerible a los nuevos usuarios y/o contribuidores.

Recordemos que los controles de versiones surgieron para ayudar a varios a contribuir en un mismo proyecto. Si no sigues un estándar y no ayudas a comprender de que va ese repositorio, pueden que los devs se sientan un poco perdidos por lo que decidan irse. Aquí te dejo 5 recomendaciones para mejorar la visiblidad de tu proyecto e incrementar las posibilidades de que te contraten o te hagan un Pull Request 😉.

## Pero, ¿y esto qué es? ¡READ ME!

![](https://c.tenor.com/myrwX0NY9C0AAAAd/mauricio-colmenero-aida.gif)

Personaje Mauricio de la serie humorística AIda. Tomado de tenor.

Es, literalmente, la primera pregunta que se hace la persona que abre tu repositorio por primera vez. ¿De qué va este proyecto? ¿Qué tecnologías usa? ¿Cómo puedo ejecutarlo en mi máquina si lo clono?

Es para eso que existen los READMEs. Si en tu repositorio local creas un fichero llamado `README.md`, GitHub se encargará de mostrar el contenido que pongas ahí es por eso que este debe ser una de los primeros ficheros que debes crear. Es lo primero que se lee.

![](https://img4.teletype.in/files/3c/47/3c475f94-2bbc-4b92-ab90-58e84ea036bd.png)

Proyecto de código abierto Threadly https://github.com/ragnarok22/threadly

Este fichero es el encargado de contener la información básica y necesaria de tu proyecto. Entre la información que contiene debería estar lo siguiente:

1.  **Nombre del proyecto**: Es el identificativo de tu proyecto. Todo proyecto debe tener un nombre.
2.  **Descripción corta**: Es una descripción corta de que es lo que hace tu software.
3.  **Badges o insignias**: Son etiquetas cortas y visuales que muestran información relevante de tu proyecto como son: licencia, coverage, versión del lenguaje de programación que usa, entre otros. Con [esta herramienta](https://shields.io/) es muy fácil de hacerlas.
4.  **Instalación**: Después que la persona clone el proyecto debe instalar dependencias y levantar el proyecto localmente. ¿Cómo lo hace? Aunque estés usando un estándar del lenguaje de programación que uses (yarn, npm para Node por ejemplo) debes de ponerlo. Quizás la persona que lo está levantando nunca ha hecho esto o no conoce el proceso. Debes guiarlo paso a paso para que pueda instalarlo y ejecutarlo localmente.
5.  **Despliegue**: Si es de [licencia abierta](https://choosealicense.com/) y la persona puede desplegarlo cómo desee y dónde desee, debes explicarle como compilarlo o desplegarlo 🚀.
6.  **Cómo contribuir**: Cada proyecto tiene estándares, metodologías y ciclos de vida. La persona que quiera contribuir debe seguir estas normas para que, no importa la cantidad de colaboradores que tenga, el código se mantenga limpio y uniforme.

Además del README, GitHub recomienda agregar un código de conducta, una licencia (Aunque sea Software Libre y Open Source debe tener una licencia) y una plantilla para los issues, así tendrán una guía de cómo deben reportar los bugs o hacer sugerencias. Aquí te dejo un [editor de README](https://readme.so/es) realmente genial que te puede hacer este proceso un poco más sencillo.

## Probando, probando... 1, 2, 3

![](https://c.tenor.com/vMmrEcFQv_IAAAAM/bart-simpson.gif)

Bart Simpson. Tomado de tenor.

No me pongas carita. Hay que hacerlas. Las pruebas son una parte importante del software. No importa que ejecutes tu programa, des click y funcione, las pruebas te ayudan a documentar el comportamiento que deseas y el que no. Leyendo los tests ya tenemos una idea de que es lo que se espera de una parte del código y validamos que este funcione bien. Claro, tener tests no asegura tener el 100% de los casos cubiertos pero si nos cubre de todos los **_h_**errores que podamos imaginar.

Cada framework, librería o lenguaje de programación tiene su propia forma de escribir tests e incluso algunas librerías que te ayudan a realizarlo. Te toca leerlas y aprender.

Hay 2 tipos de tests que debes realizar: tests unitarios y tests de integración.

Los **tests unitarios** son aquellos que pruebas una fracción de tu código. Un ejemplo de esto es una función, dónde le das ciertos parámetros y esperas determinada salida. Si no es así, pues es tiempo de arreglar esa función.

Los **tests de integración** son aquellos que prueban como funcionan determinada acción en su conjunto. Una vez que realizas los tests unitarios y pruebas que cada pieza funciona bien por separado, es momento de probar que funcionan bien en conjunto. Muy importante si piensas agregar integración continua (_Continous integration_, CI).

Estos 2 tipos de tests son lo más usados y, en mi opinión, los más importantes a la hora de trabajar en equipos.

## Documenta tu código

![](https://c.tenor.com/x6PNEwr3eTMAAAAC/que-estas-haciendo-jake.gif)

tomado de tenor

Ya tengo el README, ¿para qué necesito agregar más documentación? La persona que llega a tu repositorio sabe de que va tu software, ve que funciona bien y quiere agregar una funcionalidad. Clona el repo y va directo al código. Y ¿ahora qué? Hay métodos que implementaste y de seguro ese desarrollador necesita reutilizar o quizás mejorar.

Un código bien documentado es un buen código. No estoy diciendo que debas agregar comentarios a todas tus funciones, variables e ifs pero es bueno hacerlo en la mayoría de ellas. Agregar una descripción corta de que hace, los parametros que espera y que es la salida que da.

Muchos IDEs (Entorno de Desarrollo Integrado) usan estos comentarios para completar la ayuda y mostrarsela al desarrollador cuando llame a ese método o clase.

![](https://img1.teletype.in/files/c2/05/c2056735-7a26-488e-ae6a-15095134a8f4.png)

Documentación de un método mostrada en PyCharm

## Documenta tu software

![](https://c.tenor.com/-BYe4oFSjSAAAAAC/stephen-colbert-cant-find-it.gif)

Stephen Colbert. Tomado de tenor.

¿Más documentación? ¿En serio? Recuerda que este código también le pertenece a los demás, entre más expliques su funcionamiento mejor. ¿Te imaginas tener que escribirle personalmente y explicarle todo a cada persona que se interese por tu repo? 🤯

Ya tienes un README con un resumen breve de qué es tu proyecto, con tu código bien documentado para que el desarrollador sepa cómo usarlo o mejorarlo, ¿Para qué agregar más documentación? Ya tu sabes cómo funciona tu software y la persona que contribuye tiene una idea, pero ¿y tus usuarios? 😳

Es algo que siempre se nos olvida, el usuario. Picamos código como el mejor carnicero y se nos olvida cocinarlo a nuestro clientes. Seguro que cuando compras algún electrodoméstico este trae un manual de instrucciones con elementos técnicos que, por lo general no entiendes y otra parte con pasos sencillos de cómo usarlo. Así también funciona la documentación.

Esta documentación es más descriptiva. La documentación para tus usuarios finales es bastante variable ya que depende de qué es tu software. Si es una aplicación desktop debe explicar cómo descargarlo, instalarlo y configurarlo. Las principales funcionalidades y cómo usarlas. Si es una aplicación web debes explicar cómo desplegarla para que pueda tener su propia instancia. Estos son algunos ejemplos que se me ocurren. Lo que si debe contener son las funcionalidades que tiene, cómo usarlas y aprovecharlas.

La parte técnica es una explicación profunda para tus contribuidores. Explica paso a paso cómo instalar las herramientas que necesitas y el software en cuestión para su desarrollo. Los principales errores que pueden surguir en estos pasos y cómo resolverlos.

Por lo general, un software bien estructurado tiene una capa te abstracción que te ayuda a eliminar tareas tediosas y repetitivas cómo por ejemplo leer un fichero de configuración sin tener que comprobar si existe o crearlo. Esta parte es importante documentarla para que la persona que quiera contribuir a tu proyecto no reimplemente algo que ya está hecho.

Hay varias herramientas que te ayudan en la creación de estas documentaciones e incluso te la despliegan para que esté online para todo aquel que desee leerla. En mi caso pythonero uso [Sphinx](https://www.sphinx-doc.org/es/master/) y [Read the Docs](https://readthedocs.io/).

## Prueba y despliega automáticamente

El _continous integration_ y _continous deployment_ (CI/CD) quizás no es tan necesario para los contribuyentes pero sin dudas te ayuda a mantener en forma tu repositorio en forma y que no se produzcan errores inesperados y tu ni te enteres.

Con los [GitHub actions](https://blog.ragnarok22.dev/github-actions) puedes ejecutar las pruebas unitarias y de integración en cada Pull Request o commit en una rama determinada y saber si esos nuevos cambios pasan todas las pruebas. ¿Te imaginas que tu repositorio se vuelva popular y tengas decenas o cientos de Pull Request diarios? ¿Cómo vas a probar que todo este código se mantenga, al menos, funcional? Al tener muchas personas que contribuyan a tu código, tarde o temprano se va a producir un error. Es de esperar. Estos tests automatizados te ayudarán a mantener tu código libre de bugs y errores a la hora de integrar el código de otra persona (dependiendo de la calidad de los tests que hayas escrito antes 😉)

Al tener tantos cambios hay que lanzar nuevas versiones, ¿no es así? Con el continous deployment puedes automatizar el despliegue o compilación de tu software con cada release que hagas.

Los [procesos automáticos en GitHub](https://blog.ragnarok22.dev/github-actions) te brinda la posibilidad de hacer todas estas pruebas y despliegues automáticos.

## Bonus: Habla sobre tu proyecto

![](https://c.tenor.com/x4eaV9i8JW4AAAAC/communication.gif)

Tomado de tenor.

La comunicación es la clave. ¿Cómo van a saber tus posibles contribuidores que existe tu proyecto si no lo dices?

GitHub tiene una forma de organizar tus proyectos con etiquetas y agrega información relevante para que las personas dentro del sitio puedan encontrar más fácilmente tu repositorio pero esto no es lo único.

![](https://img4.teletype.in/files/f2/e5/f2e54dae-408a-4b35-ae8a-35df756b92d3.png)

Sección About. Se encuentra a la derecha de tu repositorio

Para que las personas se enteren de lo que hiciste debes decirlo. Lógica básica. Redacta un pequeño post y una imagen de lo que has hecho. Compártelo en tus redes sociales pero no te quedes ahí. Entra en las comunidades que tengan que ver con las tecnologías que usaste y también publica ahí. Si tienes algún medio de comunicación como un canal de Telegram, podcast, blog también habla sobre tu proyecto.

Las habilidades blandas que posee un desarrollador es lo que lo hace destacar. Un desarrollador que sepa comunicar, que sepa trabajar en equipo o domine habilidades de marketing, copy writing, es un gran activo para cualquier compañía. Ahí lo dejo :).

## Conclusiones

Quizás te parezca esto un poco abrumador si no tienes nada de esto hecho o nunca lo has hecho. Con agregar un README explicativo tienes y vas agregando el resto de las cosas con calma. Recuerda que lo más importante es poder usar el software, por eso hice mucho énfasis en la documentación. Es la forma decirle al que quiera contribuir: _esto está así y esta es su estructura, básate en esto y mejóralo!_

Hace poco [liberé el código fuente de Threadly](https://newsletter.ragnarok22.dev/issues/el-blog-de-ragnarok-es-el-fin-de-threadly-917623), por lo que si deseas contribuir [aquí te dejo el repositorio del frontend](https://github.com/ragnarok22/threadly). Cuándo agregue algunos pasos que mencioné aquí liberaré el código fuente del API 😅 (lo sé, shame of me).

Si te interesa más publicaciones como esta puedes unirte a [mi canal de Telegram](https://t.me/RagnarokReinier) o escribirme por [Twitter](https://twitter.com/RagnarokReinier).

Si crees que este contenido te aportó valor, considera retornar ese valor dejándome un aporte en [paynest](https://paynest.app/ragnarokreinier).

