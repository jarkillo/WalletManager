Aqui va todo el contenido del backend


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