---
title: "Estás usando mal React"
pubDate: "Sun Jun 15 2025"
image: "https://th.bing.com/th/id/OIP.SSmzcDoacILZm1PrG7_DHwHaD4?rs=1&pid=ImgDetMain&cb=idpwebpc1"
username: "saulin18"
categories: ["tutorials","software","web"]
description: "Este tutorial se enfoca en cómo construir componentes de React robustos, extensibles y reutilizables, todo explicado con ejemplos prácticos. "
canonicalUrl: ""
---

A lo largo de mis años en el desarrollo web con React he visto muchas veces que tienes que volver atrás a modificar componentes (o incluso rehacerlos desde 0) porque desde el inicio no se diseñó bien el componente, esto está **mal**.

Imagina que necesitas un componente button:

    // Button.tsx
    import React from 'react';
  
    interface ButtonProps {
    onClick: () => void;
    text: string;
    }
  
     const Button: React.FC<ButtonProps> = ({ onClick, text }) => {
    return (
      <button onClick={onClick}>
        {text}
      </button>
    );
     };
  
    export default Button;
  
    <Button onClick={() => alert('Botón clickeado')} text="Click aquí" />

Este componente en primera instancia puede parecer que cumple para lo que fue asignado, pero a medida que crece el proyecto hay una gran posibilidad de que tengas que hacerle muchos cambios por no hacerlo más abierto a la modificación.

**Problemas iniciales:**

- onClick limitado: Si quisieras acceder al evento nativo del DOM (como event.preventDefault()), no podrías porque lo tipamos sin el evento.

- prop text: Solo acepta texto plano (string). Si en el futuro quisieras pasarle un ícono, una imagen, o cualquier JSX, tendrías que volver y modificar el componente

**¿Cómo mejorar este componente?** 

Sencillamente tipando correctamente el evento de onClick y usando la prop children en lugar de pasarle el text como un string por props. Así no cierras el contenido que le puedes pasar al button haciéndolo más flexible.

    // Button.tsx
    import React, { MouseEvent, ReactNode } from 'react'; 
  
    interface ButtonProps {
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode; 
     }
  
    const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
    return (
      <button onClick={onClick}>
        {children} 
      </button>
    );
    };
  
     export default Button;
  
     // Usos:
    // <Button onClick={() => alert('¡Hola!')}>Click aquí</Button>
     // <Button onClick={() => alert('Icono!')}><img src="icon.png" alt="icono" /></Button>
     // <Button onClick={() => alert('Div!')}><div>Contenido</div></Button>

## ComponentPropsWithRef, ComponentPropsWithoutRef, ComponentPropsWithChildren, la clave para hacer componentes reutilizables. 

Incluso con los cambios anteriores, ese componente sigue sin ser del todo reutilizable, aún mantiene implementaciones en su estructura. Si quisieras añadir una nueva funcionalidad al botón, como cambiar su type (a submit, reset, etc.) o añadirle un handler para un evento, tendrías que ir al componente Button y añadir esas props una por una. 

 Aquí es donde React nos da una joya: ComponentPropsWithRef (o ComponentProps si no necesitas pasar referencias). Este tipo te permite heredar todas las propiedades nativas de un elemento HTML. Así tu componente de automáticamente aceptará type, onBlur, className, id, style, y todo lo que un componente HTML nativo pueda tener.

 El truco es hacer **spread** de esas props al elemento HTML del que se extiende. Esto debería hacerse en todos tus componentes que envuelvan elementos HTML primitivos.

    // Button.tsx
     import React, { MouseEvent, ReactNode, ComponentPropsWithRef } from 'react';
  
     // Definimos los props de nuestro botón usando ComponentPropsWithRef
     // Esto trae TODAS las props nativas de un  <button> HTML

    interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
    // Props personalizadas aquí
    }
  
    const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    // 'children' lo extraemos si lo vamos a usar directamente,
    // ComponentPropsWithRef ya incluye 'children', así que podríamos dejarlo en 'props' también.
   
  
    return (
      <button {...props}> {/* Spread a las props */}
        {children}
      </button>
    );
    };
  
    export default Button;
  
    // Usos:
    // <Button type="submit" onClick={(e) => e.preventDefault()}>Enviar Formulario</Button>
    // <Button onBlur={() => console.log('Salió del botón')} className="bg-blue-500 text-white p-2">Foco</Button>
     // <Button aria-label="Cerrar ventana">X</Button>
  
  Ahora nuestro componente recibe autocompletado, es cómodo para extender y está abierto a la extensión. Este mismo truco del ComponentPropsWithRef, ComponentPropsWithoutRef, ComponentPropsWithChildren, etc, lo pueden usar en cada elemento que envuelva un elemento HTML primitivo.
  
    // Ejemplo con Input
    import React, { ComponentPropsWithRef } from 'react';
  
     interface InputProps extends React.ComponentPropsWithRef<'input'> {
     //Props adicionales ...
     }
  
    const Input: React.FC<InputProps> = ({ ...props }) => {
    return <input {...props} />;
    };
  
     export default Input;
  
    // Uso:
     // <Input type="text" placeholder="Tu nombre" onChange={(e) => console.log(e.target.value)} />
    // <Input type="email" required />

**Lógica Personalizada y Cómo Evitar Sobreescrituras**

A veces querrás añadir tu propia lógica a las props nativas. Por ejemplo, podrías querer registrar un evento "X" cada vez que se hace clic en un botón además de la función onClick que el usuario pueda pasar.

El orden de esparcir las props importa. Si tienes una prop personalizada y una prop nativa con el mismo nombre, y esparces las props después de definir tu lógica personalizada, tu lógica personalizada será sobrescrita.***

**Esparce las props antes de tus propiedades personalizadas.**

Ejemplo:

    // Button.tsx
    import React, { MouseEvent, ReactNode, ComponentPropsWithRef } from 'react';
  
    interface ButtonProps extends ComponentPropsWithRef<'button'>{
    //Props personalizadas
     }
  
    const Button: React.FC<ButtonProps> = ({ children, onClick, ...props }) => {
    const handleInternalClick = (event: MouseEvent<HTMLButtonElement>) => {
          // 1. Lógica personalizada: Enviamos un informe de análisis
       console.log('Enviando informe de análisis por clic del botón...');
  
      // 2. Llamamos al onClick original que el usuario pudo haber pasado
      if (onClick) {
        onClick(event);
      }
    };
  
    return (
      <button
        {...props} // ¡Primero esparcimos todas las props!
        onClick={handleInternalClick} // Luego definimos nuestro onClick personalizado
      >
        {children}
      </button>
    );
    };
  
    export default Button;
  
    // Uso:
    // <Button onClick={() => alert('El usuario hizo click!')}>Mi Botón</Button>
    // Aquí, la función 'handleInternalClick' se ejecutará primero, luego 'alert'

Ejemplo con el className:

    // Button.tsx
    import React, { ReactNode, ComponentPropsWithRef } from 'react';
  
    interface ButtonProps extends ComponentPropsWithRef<'button'>{
     //Props personalizadas ...
    }
  
  
     const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
    // Clases CSS base para tu botón
    const baseClasses = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
  
    return (
      <button
        {...props} // Spread a las props
        className={`${baseClasses} ${className || ''}`} // Luego combinamos nuestras clases con las del usuario
      >
        {children}
      </button>
    );
     };
  
    export default Button;

    // Uso:
    // <Button className="w-full mt-4">Guardar</Button>
    // El botón tendrá las clases base Y "w-full mt-4"

**Props por defecto y el uso de props opcionales.**

Muchos elementos HTML tienen comportamientos por defecto. Esto puede causar resultados inesperados.
Es una buena práctica definir valores por defecto sensatos para tus props. Esto hace que tu componente sea más predecible y seguro.

Cuando construyas componentes, intenta hacer que la mayoría de tus props sean opcionales. Si añades una nueva prop y la haces obligatoria, romperás todas las instancias de tu componente que ya existan en tu aplicación.
Si una prop es necesaria para una nueva característica, hay dos maneras de manejarlo cuando es opcional:

- Definir un valor por defecto: Si no se pasa la prop, tendrá un valor predeterminado.

- Manejar undefined: Si la prop no se pasa, la lógica de tu componente debe ser capaz de funcionar sin ella.

      import React from 'react';

      interface ButtonProps extends React.ComponentPropsWithRef<'button'> {
      // Props opcionales con valores por defecto
      variant?: 'primary' | 'secondary' | 'danger';
      size?: 'small' | 'medium' | 'large';
    
      // Props opcionales que se manejan con undefined
      icon?: React.ReactNode;
      loadingText?: string;
       }

      const Button: React.FC<ButtonProps> = ({ 
      children,
      variant = 'primary',        
      size = 'medium',            
      icon,                       
      loadingText,                
      disabled,
      ...props 
      }) => {
       const isLoading = disabled;
    
      return (
      <button 
        {...props}
        disabled={disabled}
        className={btn btn-${variant} btn-${size}}
      >
       
        {icon && <span className="icon">{icon}</span>}
    
        {isLoading ? (loadingText || 'Cargando...') : children}
      </button>
      );
      }; 

**Composition** 

Todos los componentes que hemos visto han sido simples, cascarones, base, pero no siempre tenemos componentes así. Muchas veces tenemos componentes que componen por ejemplo un Button, un Input y en el mismo componente manejamos el estado de error (la clave es identificar los elementos relacionados de la UI). Aquí es donde entra la Composition. Podemos hacer un componente que haga spread y extienda de varios componentes HTML para así hacerlo aún más reutilizable.

     // InputField.tsx
    import React, { ComponentPropsWithRef, ReactNode } from 'react';
  
      // Props para el Label
    interface LabelProps extends Omit<ComponentPropsWithRef<'label'>, 'htmlFor'> {
    children: ReactNode;
    }
  
    // Props para el mensaje de Error
    interface ErrorFieldProps extends ComponentPropsWithRef<'p'> {
    // Props adicionales ...
     }
  
    // Props del Input principal
    interface InputFieldProps extends ComponentPropsWithRef<'input'> {
    name: string;
    labelProps?: LabelProps;
    errorProps?: ErrorFieldProps;
    buttonProps?: ComponentPropsWithRef<'button'>;
    }
  
    const InputField: React.FC<InputFieldProps> = ({
    name,
    labelProps,
    errorProps,
    buttonProps,
    ...inputProps
    }) => {
    const inputId = `input-${name}`;
  
    return (
      <div className="flex flex-col gap-1">
        {labelProps && (
          <label htmlFor={inputId} {...labelProps} className={`font-semibold ${labelProps.className || ''}`}>
            {labelProps.children}
          </label>
        )}
  
        <div className="flex items-center border rounded">
          <input
            id={inputId}
            name={name}
            {...inputProps}
            className={`flex-grow p-2 focus:outline-none ${inputProps.className || ''}`}
          />
          {buttonProps && (
            <button
              {...buttonProps}
              className={`p-2 bg-gray-200 hover:bg-gray-300 ${buttonProps.className || ''}`}
            >
              {buttonProps.children || 'Action'}
            </button>
          )}
        </div>
  
        {errorProps && (
          <p {...errorProps} className={`text-red-500 text-sm ${errorProps.className || ''}`}>
            {errorProps.children}
          </p>
        )}
      </div>
    );
     };
  
     export default InputField;

Este enfoque, donde construyes componentes robustos y flexibles que se basan en los elementos HTML nativos y se pueden extender fácilmente, es una forma excelente de trabajar en React. Verás que muchas librerías de componentes modernas, como Shadcn, adoptan principios muy similares. 

PD: El uso de Typescript no se aborda en este artículo por no ser una introducción a React, sino más bien a buenas prácticas. Si no estás usando Typescript **por favor**, empieza a hacerlo.
