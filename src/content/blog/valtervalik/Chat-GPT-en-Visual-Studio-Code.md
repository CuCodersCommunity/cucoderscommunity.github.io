---
title: "Chat GPT en Visual Studio Code"
pubDate: "Sat Feb 25 2023"
image: "https://images.ecency.com/p/3W72119s5BjW4PvRk9nXBzqrPWMsMTjNrXDPFFf11hQswnf3cmufcbzskECGNYAJvfuMkK9zosurtxkohNDc73yR4CMWnmbRp3VyMapXEv3n7yRdYx5xFG.webp?format=webp&mode=fit"
username: "valtervalik"
categories: ["software","tutorials","ia"]
description: "Como utilizar la IA en la escritura, documentación y análisis de código en la realización de proyectos dentro del excelente editor de código Visual Studio Code, muy utilizado por la comunidad de programadores en todo el mundo."
canonicalUrl: "https://ecency.com/hive-110011/@valtervalik/esp-eng-chat-gpt-en-acf83412c5a9a"
---

## Introducción
Hola a todos los miembros de esta hermosa comunidad!!!
Seguramente habrán oído acerca de como la Inteligencia Artificial(IA) ha impactado en la vida de las personas, proporcionando herramientas increíblemente útiles para aquellos que las necesiten. Ya sea en el ámbito de la educación, la salud, el marketing o la música, el uso de la IA es hoy una tendencia a nivel mundial.

Hoy escribo con la intención de hacerle llegar a quiénes se desenvuelven en el ámbito de la programación, interesante información acerca de como utilizar la IA en la escritura, documentación y análisis de código en la realización de proyectos dentro del excelente editor de código Visual Studio Code, muy utilizado por la comunidad de programadores en todo el mundo.

Como una de las herramientas de Inteligencia Artificial más poderosa y disponible para su utilización públicamente, se encuentra Chat GPT, siendo además tendencia actualmente debido al poder de respuesta que posee. Aunque es de pago, al registrarte en su plataforma se te consederán 18 dólares en créditos para utilizar sus servicios. Ya que la utilización de la misma es bastante asequible económicamente, este bono inicial te permitirá hacer muchas preguntas a esta asombrosa IA antes de que se acabe tu crédito.

### ¿Cómo empezar?
#### 1- Registrarse en la plataforma openai.com

En la página principal dirijase hacia la barra de navegación y presione "API".

Presione el botón "Sign UP" y rellene los formularios que a continuación le sean solicitados. Es importante aclarar que si eres de Cuba u otro país que pueda estar bloqueado por este tipo de plataformas, es necesario un número de teléfono para realizar exitosamente el registro en la aplicación, por lo que deberá conseguir uno de otro país.

Una vez registrado correctamente puede continuar con los siguientes pasos.

#### 2- Instalar la extensión para Visual Studio Code que permite utilizar la IA de Chat GPT para escribir y analizar código.

Abrir Visual Studio Code y hacer click sobre el icono de "Extensiones" (señalado con una flecha en la imagen de arriba). Luego escribir entre comillas "Code GPT" en el cuadro de búsqueda de extensiones y por último instalar la extensión con ese nombre. Créditos a Daniel San por crear tan buena extensión.

#### 3- Vincular tu cuenta en openai.com a la extension Code GPT y configurar la IA para su uso dentro de Visual Studio Code.

En la página de inicio de openai.com, una vez iniciada la sesión dentro de la misma, dirijase hacia la esquina superior derecha de la página y presione sobre su usuario. Se desplegará un menú de opciones, de las cuales seleccionará "View API keys".

Luego de hacer click en "View API keys", se visualizará una página que le dará la posibilidad de crear nuevas claves secretas para utilizar la API de Chat GPT en cualquier plataforma o aplicación que se lo permita. Presione el botón "+ Create new secret key" y copie la clave generada en su portapapeles.

Abra Visual Studio Code y presione el icono con forma de engranaje. En el menú de opciones desplegado a continuación seleccione "Settings" o utilice la combinación de teclas "Ctrl + ,".

Dentro de las opciones de configuración de Visual Studio Code haga click en "Extensions" o "Extensiones" si lo tiene en español. Luego haga click en la extensión llamada "CodeGPT" y pegue su clave secreta en el campo señalado con el color verde en la imagen de arriba.

- Seguido a esto se encuentra una opción para configurar la cantidad máxima de caracteres con los que prefiere que la IA devuelva una respuesta.

- Luego se encuentra la configuración del modelo de procesado que utilizará la IA a la hora de responder. Recomiendo utilizar el que se encuentra en la imagen "text-davinci-003" ya que es el último lanzado y el que mejores resultados me ha dado personalmente.

- Y por último, señalado en amarillo se encuentra la configuración de la temperatura, es decir, la creatividad con la que desea que la IA responda. Este valor puede variar de 0 a 1, siendo 0 el nivel de respuesta más estricto.

### ¿Cómo usar esta extensión?
#### 1- Comentarios

Abra un archivo con el formato de cualquier lenguaje de programación en el que desee obtener una respuesta de la IA y escriba y un comentario con lo que le quiere preguntar. Luego de establecer la pregunta en formato de comentario, presionar la combinación de teclas "Ctrl + Shift + i".

Automáticamente le saldrá una nueva ventana a su derecha con la respuesta generada por la IA. En mi caso el lenguaje de programación es javascript y la pregunta es "Haz una función que tome dos matrices como entrada y devuelva su suma y su multiplicación como dos matrices separadas". La respuesta por parte de la IA fue bastante correcta.

#### 2- Panel de comandos

Otra forma de preguntar algo a la IA es a través del panel de comandos presionando la combinación de teclas "Ctrl + Shift + P". Esriba en el cuadro de texto del panel de comandos lo siguiente: "Ask CodeGPT" y presione la tecla enter. Luego en el cuadro de texto escriba la pregunta que le desea realizar y presione la tecla enter nuevamente. Esta vez deberá especificar el lenguaje de programación a utilizar. La respuesta se muestra de la misma manera que en el primer ejemplo de esta sección.

#### 3- Refactorización, Explicación y Corrección

Si seleccionamos cualquier código ya escrito por nosotros y presionamos click derecho sobre el mismo, podremos apreciar un menú de opciones referentes a los servicios ofrecidos por la extensión. Podemos pedirle a la IA que nos explique el código, que lo refactorice, que haga una documentación para el mismo o que encuentre algún error en su estructura. Los invito a probar estas opciones por su cuenta, no se decepcionarán.
