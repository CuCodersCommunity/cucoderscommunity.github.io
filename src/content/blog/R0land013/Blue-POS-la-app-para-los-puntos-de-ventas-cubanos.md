---
title: "Blue POS: la app para los puntos de ventas cubanos"
pubDate: "Sat May 06 2023"
image: "https://raw.githubusercontent.com/R0land013/R0land013/main/assets/articles/cucoders/blue_pos_announcement/bluepos_article.png"
username: "R0land013"
categories: ["software"]
description: "Una introducción a Blue POS."
canonicalUrl: ""
---

# Blue POS: la app para los puntos de ventas cubanos

**Blue POS** es una **aplicación de escritorio** creada con el fin de optimizar el trabajo de los puntos de ventas cubanos. Es una herramienta que facilita la **gestión de inventarios**, las **ventas** y los **gastos**. Además permite realizar análisis sobre los datos generados por el negocio a través de **reportes de ventas** y **gráficos** de comportamientos de algunas variables.

**Blue POS** es gratis y **open source**. Por el momento se encuentra disponible sólo para **Windows**. En este artículo daremos un vistazo a las principales funcionalidades que tiene **Blue POS**.

![Vista principal](https://raw.githubusercontent.com/R0land013/R0land013/main/assets/articles/cucoders/blue_pos_announcement/main_view.png)

## Gestión de productos

Como se decía anteriormente esta app permite **gestionar el inventario** de tu punto de venta, dejando **insertar** productos, **actualizarlos** y **eliminarlos**. Los productos deben tener **nombre**, **descripción**, **precio por unidad**, **costo por unidad** y **cantidad disponible** en el inventario.

El **nombre** y la **descripción** del producto te ayudarán a diferenciarlo de los demás productos, y además la app le asignará un **id** único a cada producto, para diferenciarlos de manera inequívoca.

El **precio por unidad** y el **costo por unidad** serán los utilizados a la hora de efectuar la venta de un producto. Con estos también se conocerá la **ganancia por unidad**.

La **cantidad disponible** del producto refleja las unidades que tienes en el inventario o en tu almacén, es decir son la cantidad de objetos de ese tipo que te quedan por vender. Cada vez que realices ventas de un producto, la cantidad disponible de ese producto se rebajará automáticamente.

Si cometes un error siempre puedes **editar** los productos. El único atributo que no puedes cambiar es el **id** que le asigna la app al producto.

![Gestión de productos](https://raw.githubusercontent.com/R0land013/R0land013/main/assets/articles/cucoders/blue_pos_announcement/creating_product.png)

## Gestión de ventas

En la app puedes seleccionar un producto y presionar el botón de ventas para acceder a la vista de **gestión de ventas**, donde se muestran todas las **ventas del producto** que se han realizado. Una vez aquí puedes **vender** algunas unidades del producto, **deshacerlas** o **editarlas**. Las **ventas** poseen el atributo de **pago**, **costo del producto**, **ganancia** y **fecha**. Los valores de estos atributos los obtiene del producto, en el momento en el que se vende. Las ventas también poseen un **id** único que les asigna el sistema, para diferenciarlas unas de otras.

Cada vez que se realice alguna venta, la cantidad disponible del producto vendido **se rebajará automáticamente**. Si se cometió un error o un cliente devolvió un producto, se puede **deshacer una venta**, lo que **repondrá automáticamente** la cantidad disponible del producto. Todos los atributos de las ventas se pueden **editar** excepto el **id**.

![Gestión de ventas](https://raw.githubusercontent.com/R0land013/R0land013/main/assets/articles/cucoders/blue_pos_announcement/sales.png)

## Gestión de gastos

En la vista de **gestión de gastos** se listan todos los gastos que se han realizado en el negocio. Estos gastos son los conocidos como **indirectos**, son los que **no influyen directamente en el precio de los productos**. Los gastos tienen **nombre**, **descripción**, **dinero gastado** y **fecha**. Además el sistema le asigna un **id** único a cada gasto. El **nombre** y la **descripción** del gasto son utilizados para describir la situación en la cuál ocurrió el gasto. Los gastos pueden ser **insertados**, **eliminados** y **editados**. Los gastos pueden ser **filtrados** para realizar búsquedas rápidas y análisis.

![Gestión de gastos](https://raw.githubusercontent.com/R0land013/R0land013/main/assets/articles/cucoders/blue_pos_announcement/expense_list.png)

## Reportes de ventas

Los **reportes de ventas** te permiten hacer un **resumen de la actividad** de tu negocio durante un período de tiempo. Los reportes pueden ser **diarios**, **semanales**, **menusales**, **anuales** y **personalizados**. Todos los reportes muestran la **cantidad de ventas realizadas** en ese período, el **dinero obtenido**, el **costo total** de todos los productos vendidos, las **ganancias totales** por cada unidad vendida, los **gastos totales** y la **ganancia neta** durannte el período de tiempo del reporte. Cada uno de estos reportes se pueden **exportar** como archivo **html** o **pdf**.

![Reportes de ventas](https://raw.githubusercontent.com/R0land013/R0land013/main/assets/articles/cucoders/blue_pos_announcement/report_view.png)

![Reporte mensual](https://raw.githubusercontent.com/R0land013/R0land013/main/assets/articles/cucoders/blue_pos_announcement/month_report.png)

## Estadísticas

**Blue POS** cuenta con una sección de **estadísticas** para ver en un **gráfico** las **ganancias netas**, **la cantidad de ventas**, y **los gastos totales**, de manera **mensual** o **anual**. El usuario puede poner el cursor sobre uno de los puntos del gráfico para mostrar un **resumen de las operaciones realizadas**. Los gráficos permiten ver de manera más clara el **crecimiento** o **decrecimiento** del negocio. Además permite observar el impacto del las decisiones tomadas en el negocio a lo largo del tiempo, y tomar nuevas decisiones según lo que se aprecia en los gráficos.

![Estadísticas](https://raw.githubusercontent.com/R0land013/R0land013/main/assets/articles/cucoders/blue_pos_announcement/statistics_view.png)

![Estadística anual](https://raw.githubusercontent.com/R0land013/R0land013/main/assets/articles/cucoders/blue_pos_announcement/year_statistics.png)

## Obtener Blue POS

Puedes descargar Blue POS desde [aquí](https://github.com/R0land013/blue-pos/releases/download/v1.0.0/Blue.POS.v1.0.0.exe). Si eres desarrollador puedes contribuir [aquí](https://github.com/R0land013/blue-pos).

