from web3 import exceptions

def create_wallet(w3):
    """
    Crea una nueva wallet Ethereum y devuelve su dirección y clave privada.
    """
    account = w3.eth.account.create()
    return {
        "address": account.address,
        "private_key": account.privateKey.hex()
    }

def send_transaction(from_private_key, to_address, amount,w3):
    """
    Envía una transacción de Ethereum y devuelve el hash de la transacción.
    
    Parámetros:
        from_private_key (str): Clave privada del remitente.
        to_address (str): Dirección del destinatario.
        amount (float): Cantidad de ether a enviar.
    """
    try:
        account = w3.eth.account.privateKeyToAccount(from_private_key)
        nonce = w3.eth.getTransactionCount(account.address)
        tx = {
            'nonce': nonce,
            'to': to_address,
            'value': w3.toWei(amount, 'ether'),
            'gasPrice': w3.eth.gasPrice
        }
        # Estimar el gas necesario para la transacción
        tx['gas'] = w3.eth.estimateGas({
            'from': account.address,
            'to': to_address,
            'value': tx['value'],
            'data': b''
        })
        signed_tx = account.sign_transaction(tx)
        tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
        return w3.toHex(tx_hash)
    except exceptions.Web3Exception as e:
        # Manejo seguro de excepciones para no exponer claves privadas o información crítica
        raise Exception(f"Error sending transaction: {str(e)}")

def get_balance(address,w3):
    """
    Consulta el saldo de una dirección Ethereum y devuelve el saldo en ether.
    """
    if not w3.isAddress(address):
        raise ValueError("Invalid Ethereum address")
    balance = w3.eth.getBalance(address)
    return w3.fromWei(balance, 'ether')
