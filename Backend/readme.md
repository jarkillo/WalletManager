# ULTIMA ACTUALIZACION

## Refactorización del Proyecto de Gestión de Blockchain

Este proyecto se ha refactorizado para mejorar la estructura del código, el manejo de errores y el registro de operaciones. Las mejoras están destinadas a facilitar el mantenimiento y la escalabilidad del proyecto.

### Estructura de Archivos

El proyecto está organizado en varias carpetas principales:

- `app/`: Contiene el código fuente principal de la aplicación.
  - `models/`: Define los esquemas de datos usados en la aplicación.
  - `routers/`: Contiene los routers de FastAPI que definen los endpoints de la API.
  - `services/`: Incluye la lógica de negocio, especialmente la interacción con la blockchain.
  - `utils/`: Proporciona funciones de utilidad, como la conexión a la blockchain a través de Web3.
  - `config/`: Archivos de configuración.
- `tests/`: Almacena los tests del proyecto, organizados por módulos.
- `docs/`: Documentación del proyecto.

### Mejoras Realizadas

#### Manejo de Errores

Se ha mejorado el manejo de errores en todas las funciones para capturar y tratar adecuadamente los errores específicos. Esto incluye la validación de direcciones de wallets y tokens, así como el manejo de errores de conexión y consulta a la blockchain.

#### Registro Detallado

El sistema de registro se ha mejorado para incluir información detallada del flujo de operaciones y errores. Esto facilita la depuración y el seguimiento de las operaciones en producción.

#### Validación de Direcciones

Se ha añadido validación de direcciones en las funciones que interactúan con la blockchain para asegurar que las direcciones proporcionadas sean válidas antes de realizar operaciones.

#### Documentación y Comentarios

Los comentarios en el código y la documentación han sido actualizados para reflejar los cambios y mejorar la comprensibilidad del código.


# --------------------------------------------

# Información original

Como mandar las peticiones?

Crear Cartera:
Method: Selecciona POST como el método HTTP desde el menú desplegable.
URL: Escribe la URL del endpoint para crear carteras http://localhost:8000/wallet/create


Realizar transferencias:

Method: Selecciona POST como el método HTTP desde el menú desplegable.
URL: Escribe la URL del endpoint para enviar transacciones.http://localhost:8000/wallet/transfer.

Headers:
Asegúrate de agregar un header para Content-Type con el valor application/json.
Haz clic en Headers.
En la clave escribe Content-Type y en el valor application/json.

Body:
Cambia a la pestaña Body.
Selecciona JSON.
Escribe el cuerpo de la solicitud en formato JSON:

{
  "from_private_key": "tu_clave_privada_aquí",
  "to_address": "dirección_destino_aquí",
  "amount": cantidad_de_ether
}


Ver el saldo:
Method: Selecciona GET como el método HTTP desde el menú desplegable.
URL: Escribe la URL del endpoint para enviar transacciones.http://localhost:8000/wallet/balance/{address}

Donde {address} va la id de la wallet

Probar transferir y recibir Ethereum en redes de prueba sin gastar dinero.
Los "Grifos" (Faucets) te permiten solicitar token grátis
Faucets para la red "Sepolia":
https://faucets.chain.link 
Requiere login con Twitter
https://sepoliafaucet.com
Más con cuenta gratuita de Alchemy
https://www.infura.io/faucet 
