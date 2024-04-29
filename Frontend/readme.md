Aqui va a ir todo el contenido del frontend

De momento voy a hacer un frontend simple, con GPT y React y una biblioteca de JS

App.js

Importaciones: Se importa React y dos componentes: WalletInfo y SendTransaction
Función App: Este es el componente principal de la aplicación React. Retorna un elemento JSX que incluye un título (h1) y los dos componentes importados.
JSX: Es una sintaxis que parece HTML y permite escribir estructura de elementos dentro del código JavaScript. React transforma este JSX en código que maneja el DOM (Document Object Model) del navegador.

WalletInfo.js

useState: Un Hook de React que permite tener estado en un componente funcional. Aquí, useState('') inicializa balance como un string vacío.
useEffect: Un Hook que maneja efectos secundarios en componentes funcionales. Se ejecuta después de que el componente se monta y cada vez que se actualiza, dependiendo de su lista de dependencias (aquí está vacía, así que solo se ejecuta una vez después del montaje inicial).
axios.get: Hace una solicitud GET HTTP usando axios a la API para obtener el saldo de la wallet. Al completarse exitosamente, actualiza el estado balance con el resultado.
JSX en return: Retorna un elemento con el título y el saldo actual.


SendTransaction.js
useState: Se usa para mantener el estado local para la dirección de destino (toAddress), la cantidad (amount) y el resultado de la transacción (transactionResult).
handleSubmit: Función que se llama cuando el formulario se envía. Previene el comportamiento por defecto del formulario (recargar la página), hace una solicitud POST para enviar la transacción, y maneja la respuesta o errores.
Formulario JSX: Define un formulario que recoge la dirección y la cantidad para la transacción, y muestra el resultado de la transacción después de enviarla.