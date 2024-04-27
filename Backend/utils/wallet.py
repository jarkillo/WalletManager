from web3 import Web3, exceptions

def create_wallet(w3):
    """
    Crea una nueva wallet Ethereum y devuelve su dirección y clave privada.
    """
    account = w3.eth.account.create()
    return {
        "address": account.address,
        "private_key": account._private_key.hex()
    }


def send_transaction(from_private_key, to_address, amount, w3):
    """
    Envía una transacción de Ethereum y devuelve el hash de la transacción.
    
    Parámetros:
        from_private_key (str): Clave privada del remitente.
        to_address (str): Dirección del destinatario.
        amount (float): Cantidad de ether a enviar.
        w3 (Web3): Instancia de Web3.
    """
    try:
        # Crear una instancia de la cuenta con la clave privada
        account = w3.eth.account.from_key(from_private_key)
        
        # Obtener el nonce de la cuenta
        nonce = w3.eth.get_transaction_count(account.address)
        tx = {
            'nonce': nonce,
            'to': to_address,
            'value': w3.to_wei(amount, 'ether'),
            'gasPrice': w3.eth.gas_price
        }
        # Estimamos el gas necesario para la transacción
        tx['gas'] = w3.eth.estimate_gas({
            'from': account.address,
            'to': to_address,
            'value': tx['value'],
            'data': b''
        })

        # Firmamos la transacción
        signed_tx = account.sign_transaction(tx)

        # Enviamos la transacción
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

        # Devolvemos el hash de la transacción
        return w3.to_hex(tx_hash)
    except exceptions.Web3Exception as e:
        raise Exception(f"Error al enviar la transacción: {str(e)}")

def get_balance(address,w3):
    """
    Consulta el saldo de una dirección Ethereum y devuelve el saldo en ether.
    """
    if not w3.is_address(address):
        raise ValueError("Invalid Ethereum address")
    balance = w3.eth.get_balance(address)
    return w3.from_wei(balance, 'ether')
