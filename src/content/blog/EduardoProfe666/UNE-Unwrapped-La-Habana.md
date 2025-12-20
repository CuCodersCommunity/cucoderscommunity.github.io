---
title: "UNE Unwrapped - La Habana"
pubDate: "Fri Dec 19 2025"
image: "https://une-unwrapped-habana.vercel.app/banner.webp"
username: "EduardoProfe666"
categories: ["web","news","software"]
description: "Una plataforma interactiva para visualizar y analizar el resumen anual de la situación eléctrica en La Habana, de acuerdo con el canal oficial de Telegram de la UNE."
canonicalUrl: ""
---

Si plataformas como Spotify, GitHub o YouTube tienen su propio resumen anual
para mostrar estadísticas, siempre me pregunté por qué la UNE no podría
tener algo parecido. Con esa idea en mente, decidí crear este proyecto
para visualizar los datos del servicio eléctrico en La Habana de una forma
más clara y accesible.

El proceso empezó scrapeando [el canal de Telegram de la UNE en La Habana](https://t.me/EmpresaElectricaDeLaHabana), 
de donde extraje todo [el histórico de mensajes](telegram_messages.db) con sus respectivos metadatos.
Después, programé un script para procesar esa información y generar los 
[análisis anuales en formato JSON](/app/public/data/analysis_data_2025.json), desglosando los datos en varios puntos clave.

Finalmente, desarrollé una aplicación web con una estética neobrutalista
para presentar estos resultados de una manera mucho más amigable y visual.
Puedes ver el resultado final funcionando en [este enlace](https://une-unwrapped-habana.vercel.app).

> [!WARNING]
> Los resúmenes anuales de los datos extraídos no deben tomarse como 
> oficialmente válidos. El sistema busca patrones en los mensajes y no
> realiza un análisis técnico profundo. Úsalos solo con fines de entretenimiento.
> Si logras analizar los datos de forma más técnica con minería de datos o IA haz PR para mejorar el proyecto.

#### 🔗 Enlaces
- ![Repositorio](https://github.com/EduardoProfe666/une-unwrapped-habana)
- ![Sitio Web](https://une-unwrapped-habana.vercel.app/)
