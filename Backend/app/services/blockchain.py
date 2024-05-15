# app/services/blockchain.py
from web3 import exceptions
from web3 import Web3
from app.utils.web3_utils import get_web3
import logging
from typing import List
from models.schemas import Token
import asyncio
import requests
import os
from app.config.abi import minimal_erc20_abi


logger = logging.getLogger(__name__)

# Lista inicial de tokens predefinidos
predefined_tokens: List[Token] = [
    Token(token_name="Chainlink", token_address="0x779877A7B0D9E8603169DdbD7836e478b4624789", network="sepolia"),
    # Añadir más tokens según sea necesario
]

# Lista dinámica que incluye los tokens añadidos por el usuario
tokens: List[Token] = predefined_tokens.copy()


def send_transaction(signed_transaction: str, network: str):
    """
    Envía una transacción firmada a la red Ethereum especificada y devuelve el hash de la transacción.

    Args:
        signed_transaction (str): Transacción firmada en formato hexadecimal.
        network (str): Red Ethereum a la que se enviará la transacción (ej. 'mainnet', 'rinkeby').

    Returns:
        str: Hash de la transacción enviada.

    Raises:
        Exception: Si hay un error al enviar la transacción.
    """

    # Realizamos la conexión a la red, creamos la transaccion y la enviamos
    try:

        logger.info(f"Conectando a la red {network}")
        w3 = get_web3(network)
        logger.info("Conexión exitosa a la red Ethereum")

        logger.info("Enviando la transacción firmada a la red Ethereum")
        tx_hash = w3.eth.send_raw_transaction(bytes.fromhex(signed_transaction[2:]))
        logger.info(f"Transacción enviada")

        logger.info("Conviertiendo la transacción firmada a hexadecimal")
        tx_hash_hex = tx_hash.hex()
        logger.info(f"Devolviendo el hash de la transacción: {tx_hash.hex()}")

        return tx_hash_hex
    
    except exceptions.Web3Exception as e:
        logger.error(f"Error al enviar la transacción: {str(e)}")
        raise Exception(f"Error al enviar la transacción: {str(e)}")
    
    except ValueError as e:
        logger.error(f"Error en el formato de la transacción: {str(e)}")
        raise ValueError("El formato de la transacción firmada es incorrecto.") from e 

# Funcion para obtener el balance en ethereum de una cuenta

async def get_balance(address: str, network: str):

    """

    Consulta el saldo de ethereums de una wallet y devuelve el saldo en ether.

    Args:
        address (str): Dirección de la wallet de Ethereum cuyo saldo se está consultando.
        network (str): Nombre de la red a la que se conectará la wallet.

    Returns:
        float: Saldo de la cuenta en ether.

    Raises:
        Exception: Si no se puede consultar el saldo.

    """

    # Flujo de la funcion: Conexion a la red, verificacion de la cartera, consulta del saldo y conversion a ether
    try:

        logger.info(f"Conectando a la red {network}...")
        w3 = get_web3(network)
        logger.info("Conexión exitosa a la red Ethereum")

    except ConnectionError as e:
        logger.error(f"Error al conectar con la red Ethereum: {str(e)}")
        raise Exception("Error al conectar con la red Ethereum") from e
    
    try:
        logger.info(f"Comprobando la validez de la dirección de la cartera...")
        if not w3.is_address(address):
            logger.error(f"Dirección no válida: {address}")
            raise ValueError("La dirección de la cartera no es válida")
        
        logger.info(f"Consultando el saldo de la cartera {address}...")
        balance = w3.eth.get_balance(address)
        logger.info(f"Saldo consultado: {balance}")

        logger.info(f"Convirtiendo el saldo a ether...")
        saldo_ether = w3.from_wei(balance, 'ether')
        logger.info(f"Saldo convertido a ether: {saldo_ether}")

        return saldo_ether
    
    # Manejo de excepciones

    except exceptions.InvalidAddress as e:
        logger.error(f"Dirección no válida: {str(e)}")
        raise ValueError("La dirección proporcionada no es válida.") from e
    
    except exceptions.ConnectionError as e:
        logger.error(f"Error de conexión con la red: {str(e)}")
        raise ConnectionError("No se puede conectar a la red Ethereum.") from e
    
    except exceptions.Web3Exception as e:
        logger.error(f"Error al consultar el saldo: {str(e)}")
        raise Exception("Error en la consulta del saldo.") from e

# Funcion para obtener el saldo de un token ERC-20

async def get_token_balance(token_address, wallet_address, network: str):
    """
    Consulta el saldo de un token ERC-20 para una dirección específica y lo devuelve ajustado por decimales del token.

    Args:
        token_address (str): La dirección del contrato del token ERC-20.
        wallet_address (str): Dirección de la cartera cuyo saldo de token se está consultando.
        network (str): Nombre de la red a la que se conectará.

    Returns:
        float: Saldo del token ajustado por los decimales.

    Raises:
        ValueError: Si la dirección de la wallet o del token no es válida.
        Exception: Si hay un error al consultar el saldo del token.
    """
    try:
        logger.info(f"Conectando a la red {network}")
        w3 = get_web3(network)
        
        logger.info(f"Verificando si las wallet_address y token_address son correctos: {wallet_address}, {token_address}")

    except ConnectionError as e:
        logger.error(f"Error al conectar con la red Ethereum: {str(e)}")
        raise Exception(f"Error al conectar con la red Ethereum: {str(e)}")


    try:
        if not w3.is_address(wallet_address):
            logger.error(f"Dirección de wallet no válida: {wallet_address}")
            raise ValueError("Dirección de la wallet o del token no válida")
        
        if not w3.is_address(token_address):
            logger.error(f"Dirección del token no válido: {token_address}")
            raise ValueError("Dirección de la wallet o del token no válida")
    
        logger.info(f"Creando contrato para el token {token_address} usando ABI mínimo.")

        token_abi = [
            {"constant": True, "inputs": [{"name": "_owner", "type": "address"}],
             "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"}],
             "payable": False, "stateMutability": "view", "type": "function"},
            {"constant": True, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint8"}],
             "payable": False, "stateMutability": "view", "type": "function"}
        ]

        # Crear el contrato del token
        token_contract = w3.eth.contract(address=token_address, abi=token_abi)

        # Consultar el saldo del token
        logger.info(f"Consultando saldo del token para la wallet {wallet_address}.")
        balance = token_contract.functions.balanceOf(wallet_address).call()
        decimals = token_contract.functions.decimals().call()

        adjusted_balance = balance / (10 ** decimals)

        logger.info(f"Saldo del token ajustado por decimales: {adjusted_balance}")

        return adjusted_balance
    
    except exceptions.Web3Exception as e:

        logger.error(f"Error al consultar el saldo del token: {str(e)}")
        raise Exception(f"Error al consultar el saldo del token: {str(e)}")

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

# Funcion bucle para obtener el saldo de cada token de la lista

async def get_all_token_balances(wallet_address: str, network: str):
    balances = {}
    filtered_tokens = [token for token in tokens if token.network == network]
    balance_tasks = [get_token_balance(token.token_address, wallet_address, network) for token in filtered_tokens]
    results = await asyncio.gather(*balance_tasks)
    for token, balance in zip(filtered_tokens, results):
        balances[token.token_name] = balance
    return balances

# Funcion para obtener resumen de las últimas operaciones de una cartera
async def get_transaction_summary(wallet_address, network: str,transactions_days: int):
        
    
    try:
        # Conecta a la red Ethereum
        w3 = get_web3(network)
    # Elegir el subdominio  asado en la red
        if network == "mainnet":
            domain = "api.etherscan.io"
        elif network == "sepolia":
            domain = "api-sepolia.etherscan.io"
        else:
            raise ValueError("Red no soportada")

        url = f"https://{domain}/api"
        # Obtén el número del último bloque
        latest_block = w3.eth.block_number
        block_limit = (24*60*60/15)*transactions_days
        start_block = latest_block - block_limit
        params = {
            "module": "account",
            "action": "txlist",
            "address": wallet_address,
            "startblock": start_block,
            "endblock": latest_block,
            "sort": "desc",
            "apikey": os.getenv("ETHERSCAN_PROJECT_ID")
        }
        response = requests.get(url, params=params)
        data = response.json()
    except ValueError as e:
        raise Exception(f"Error: {str(e)}")
    return data['result']

async def token_exists(token_address: str, network: str) -> bool:
    w3 = get_web3(network)
    try:
        # Limpiar la dirección para asegurarse de que no contenga parámetros o rutas extrañas
        if '?' in token_address:
            token_address = token_address.split('?')[0]  # Toma solo la parte antes de '?'
    except Exception as e:
        logger.error(f"Error al limpiar la dirección del token: {str(e)}")
        return False
    try:
        
        # Asegurarse de que la dirección sea una dirección hexadecimal válida
        token_address = Web3.to_checksum_address(token_address)
    
    except ValueError as ve:
        logger.error(f"Dirección de token inválida: {ve}")
        return False
    try:

        # Crea un objeto contrato usando la dirección y el ABI mínimo
        token_contract = w3.eth.contract(address=token_address, abi=minimal_erc20_abi)
    
    except ValueError as ve:
        logger.error(f"Dirección de token inválida: {ve}")
        return False
    
    try:
        # Intenta obtener el símbolo del token para confirmar que el contrato es válido
        symbol = token_contract.functions.symbol().call()
        logger.info(f"Símbolo del token: {symbol}")
        return True
    except exceptions.BadFunctionCallOutput:
        # Si la llamada falla, el contrato no existe o la dirección no es un contrato ERC-20   
        return False
        
    except ValueError as ve:
        logger.error(f"Dirección de token inválida: {ve}")
        return False

    except Exception as e:
        # Captura cualquier otra excepción que pueda surgir
        logger.error(f"Error al verificar el token: {str(e)}")
        return False


