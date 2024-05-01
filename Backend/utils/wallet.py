from web3 import Web3, exceptions
from config.blockchain import get_web3
from hexbytes import HexBytes
import logging

logger = logging.getLogger(__name__)


def send_transaction(signed_transaction: str, network: str):
    """
    Envía una transacción de Ethereum y devuelve el hash de la transacción.
    """
    try:
        w3 = get_web3(network)
        # Asegúrate de convertir la cadena hexadecimal a bytes
        tx_hash = w3.eth.send_raw_transaction(bytes.fromhex(signed_transaction[2:]))


        # Correctamente convertir tx_hash a hexadecimal
        tx_hash_hex = tx_hash.hex()
        logger.info(f"Transacción enviada: {tx_hash.hex()}")
        return tx_hash_hex
    
    except Exception as e:
        raise Exception(f"Error al enviar la transacción: {str(e)}")




def get_balance(address: str, network: str):
    """
    Consulta el saldo total de una dirección Ethereum y devuelve el saldo en ether.

    Parámetros:

        address (str): Dirección Ethereum cuyo saldo se está consultando.
        network (str): Nombre de la red Ethereum a la que se conectará la wallet.

    """
    try:
        w3 = get_web3(network)
    except  ConnectionError as e:
        raise Exception(f"Error al conectar con la red Ethereum: {str(e)}")
    
    if not w3.is_address(address):
        raise ValueError("Invalid Ethereum address")
    try:
        balance = w3.eth.get_balance(address)
    
    except exceptions.Web3Exception as e:
        raise Exception(f"Error al consultar el saldo: {str(e)}")
    
    return w3.from_wei(balance, 'ether')

# Funcion para obtener el saldo de un token ERC-20 (PENDIENTE DE HACER BIEN Y CONFIGURAR EL ENDPOINT)

def get_token_balance(token_address, wallet_address, network: str):
    """
    Consulta el saldo de un token ERC-20 para una dirección específica.

    Parámetros:
        token_address (str): La dirección del contrato del token ERC-20.
        wallet_address (str): La dirección de la cartera cuyo saldo de token se está consultando.
        w3 (Web3): Instancia de Web3.
    """

    try:
        w3 = get_web3(network)
    except  ConnectionError as e:
        raise Exception(f"Error al conectar con la red Ethereum: {str(e)}")

    # ABI mínimo requerido para consultar el saldo de un token ERC-20
    token_abi = [
        {
            "constant": True,
            "inputs": [{"name": "_owner", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "balance", "type": "uint256"}],
            "payable": False,
            "stateMutability": "view",
            "type": "function",
        }
    ]
    
    if not w3.is_address(wallet_address) or not w3.is_address(token_address):
        raise ValueError("Invalid Ethereum or token address")
    
    # Crea el contrato en web3
    token_contract = w3.eth.contract(address=token_address, abi=token_abi)
    
    # Consulta el saldo
    balance = token_contract.functions.balanceOf(wallet_address).call()
    
    # Convierte el saldo a un formato legible (si el token tiene 18 decimales)
    return balance / 10**18

# Ejemplo de uso
# w3 = Web3(Web3.HTTPProvider('https://mainnet.infura.io/v3/your_infura_project_id'))
# print(get_token_balance('token_contract_address_here', 'your_wallet_address_here', w3))



def get_transaction_details(transaction_hash: str, network: str):
    """
    Consulta los detalles de una transacción a partir de su hash.

    Parámetros:
        transaction_hash (str): El hash de la transacción que se está consultando.
        network (str): Nombre de la red Ethereum a la que se conectará la wallet.

    Retorna:
        dict: Un diccionario con los detalles de la transacción.
    """
    try:
        w3 = get_web3(network)
    except ConnectionError as e:
        raise Exception(f"Error al conectar con la red Ethereum: {str(e)}")

    try:
        transaction = w3.eth.get_transaction(transaction_hash)
        # Si la transacción no existe, se lanzará una excepción y la manejarás más adelante
    except ValueError as e:
        raise Exception(f"No se encontró la transacción con el hash {transaction_hash}: {str(e)}")
    
    # Construye un diccionario con los detalles de la transacción
    transaction_details = {
        "hash": transaction_hash,
        "block_number": transaction.blockNumber,
        "from": transaction["from"],
        "to": transaction["to"],
        "value": transaction["value"],
        "gas": transaction["gas"]
    }

    return transaction_details
