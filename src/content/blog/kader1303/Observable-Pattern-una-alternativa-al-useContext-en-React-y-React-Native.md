---
title: "Observable Pattern una alternativa al useContext en React y React Native."
username: "kader1303"
pubDate: "Mar 11 2023"
description: "Comparación entre dos métodos para mantener la sincronización de datos en React: el Observable Pattern y el useContext. Ejemplos de cómo implementarlos, ventajas, desventajas y principales diferencias entre ambos."
image: "https://firebasestorage.googleapis.com/v0/b/a-manyar.appspot.com/o/Banner.png?alt=media&token=1b640fc3-8a89-4e34-aa6a-e6cc48a6c4eb"
categories: ["tutorials"]
---

## Introducción

React es el framework de JavaScript más popular y ampliamente utilizado actualmente para construir todo tipo de aplicaciones. Tanto en React como en React Native, hay varias formas de mantener actualizado el estado de la aplicación y comunicar cambios a los componentes hijos. En este artículo, compararé dos enfoques diferentes: Observable Pattern y useContext, al lío.

## Observable Pattern:

El patrón Observable es una forma de notificar a los componentes cuando ocurre un cambio en el estado de la aplicación. En React, podemos implementar este patrón utilizando la clase Observable y el método **`subscribe()`**. Podemos usar esto para mantener actualizados los datos en nuestra aplicación sin tener que pasarlos de un componente a otro.

Aquí te pongo un ejemplo de cómo implementar Observable Pattern utilizando typescript:

```
class Observable {
    private observers: any[] = []
    subscribe(fn: any) {
        this.observers.push(fn);
    }

    unsubscribe(fn: any) {
        this.observers = this.observers.filter((subscriber) => subscriber !== fn);
    }

    notify() {
        this.observers.forEach((observer) => observer());
    }
}

const observable = new Observable();

// Luego, en un componente que necesite mantenerse actualizado con el observable, podemos suscribirnos a los cambios de esta forma:
observable.subscribe(() => {
    // hacer algo cuando ocurre un cambio
});

// En el componente que realizamos la accion notificamos al componente que debe mantenerse actualizado mediante:
oservable.notify();

```

## useContext:

El hook **`useContext`** es una forma de compartir datos en una jerarquía de componentes sin tener que pasar explícitamente las props hacia abajo. Esto nos permite evitar la necesidad de pasar manualmente los datos a través de múltiples niveles.

A continuación, un ejemplo de cómo utilizar **`useContext`**:

```
import { createContext, useContext } from 'react';

interface DataContextInterface {
    data: any;
    setData: (data: any) => void;
}

const DataContext = createContext<DataContextInterface>({
    data: null,
    setData: () => {},
});

const DataProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<any>(null);

    return (
        <DataContext.Provider value={{ data, setData }}>
            {children}
        </DataContext.Provider>
    );
};

// En el archivo raíz de tu aplicación
const ContextState = ({children}: any) => {
  return (
    <DataContext>
      {children}
    </DataContext>
  )
}

const App = () => {

  return (

    <NavigationContainer>
      <ContextState>
	       // Tu aplicacion aqui...
      </ContextState>
    </NavigationContainer>
    
  );
}

export default App

// En un componente que necesite acceder al contexto:
const MyComponent = () => {
    const { data, setData } = useContext(DataContext);

    return (
        // hacer algo con los datos proporcionados por el contexto
    );
};

```

## Comparación entre ambos métodos:

Ambos enfoques tienen sus pros y sus contras. Observable Pattern es una forma poderosa de mantener actualizados los componentes cuando ocurren cambios en el estado de la aplicación. No tenemos que pasar los datos de un componente a otro y no tenemos que preocuparnos por la prop drilling. Por otro lado, el patrón Observable puede requerir un poco más de configuración y puede ser menos intuitivo para los desarrolladores que no están familiarizados con él.

En cambio, **`useContext`** es una forma más sencilla de compartir datos entre componentes en una jerarquía de componentes. Es fácil de usar y es probable que la mayoría de los desarrolladores ya estén familiarizados con él. Sin embargo, el uso excesivo de **`useContext`** puede llevar a la creación de un gran contexto que sea difícil de mantener y entender.

Una ventaja del patrón Observable es que es muy escalable y puede manejar una gran cantidad de observadores y objetos observables. Además, los objetos observables pueden ser muy complejos y contener múltiples propiedades que pueden cambiar. 

El hook useContext tiene la ventaja de ser muy fácil de usar y puede simplificar significativamente la forma en que se comparte el estado entre componentes.

En cuanto a las desventajas, el patrón Observable puede ser más difícil de entender y de implementar correctamente que el hook useContext. Además, puede haber un mayor costo de rendimiento al crear y notificar objetos observables y observadores. Mientras el useContext puede ser limitado en términos de la complejidad de los datos que se pueden almacenar y compartir. Además, puede ser difícil de rastrear y depurar cuando se utilizan muchos contextos diferentes.

## En resumen:

Ambos enfoques tienen sus pros y sus contras, y la elección depende del caso de uso específico. Si se necesita una solución escalable y compleja para compartir datos entre muchos componentes, el patrón Observable puede ser una buena opción. Si se necesita una solución simple y fácil de usar para compartir datos globales, el hook useContext es una buena opción. 

En última instancia, la elección depende de los requisitos específicos de la aplicación y del estilo de codificación preferido del desarrollador.
