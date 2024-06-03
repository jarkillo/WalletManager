''' 
Contiene las funciones para interactuar con la red Ethereum y 
consultar información de la blockchain. 
'''
# app/services/blockchain.py

# Imports de la biblioteca estándar.
import os
import logging
import asyncio
from typing import List

# Imports de terceros.
import requests
from web3 import Web3, exceptions

# Imports locales
from app.utils.web3_utils import get_web3
from app.config.abi import minimal_erc20_abi
from models.schemas import Token

logger = logging.getLogger(__name__)

# Lista inicial de tokens predefinidos
predefined_tokens: List[Token] = [
    Token(token_name="Chainlink",
          token_address="0x779877A7B0D9E8603169DdbD7836e478b4624789", network="sepolia"),
    # Añadir más tokens según sea necesario
]

# Lista dinámica que incluye los tokens añadidos por el usuario
tokens: List[Token] = predefined_tokens.copy()


def send_transaction(signed_transaction: str, network: str) -> str:
    """
    Envía una transacción firmada a la red Ethereum especificada y
    devuelve el hash de la transacción.

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

        logger.info("Conectando a la red %s...", network)
        w3 = get_web3(network)
        logger.info("Conexión exitosa a la red Ethereum")

        logger.info("Enviando la transacción firmada a la red Ethereum")
        tx_hash = w3.eth.send_raw_transaction(
            bytes.fromhex(signed_transaction[2:]))
        logger.info("Transacción enviada")

        logger.info("Conviertiendo la transacción firmada a hexadecimal")
        tx_hash_hex = tx_hash.hex()
        logger.info("Devolviendo el hash de la transacción: %s", tx_hash.hex())

        return tx_hash_hex

    except exceptions.TransactionNotFound as e:
        logger.error("Transacción no encontrada: %s", str(e))
        raise exceptions.TransactionNotFound(
            f"Transacción no encontrada: {str(e)}") from e

    except exceptions.ValidationError as e:
        logger.error("Error de validación: %s", str(e))
        raise exceptions.ValidationError(
            f"Error de validación: {str(e)}") from e

    except exceptions.Web3Exception as e:
        logger.error("Error al enviar la transacción: %s", str(e))
        raise exceptions.Web3Exception(
            f"Error al enviar la transacción: {str(e)}") from e

    except ValueError as e:
        logger.error("Error en el formato de la transacción: %s", str(e))
        raise ValueError(
            "El formato de la transacción firmada es incorrecto.") from e

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

    # Flujo de la funcion:
    # Conexion a la red,
    # verificacion de la cartera,
    # consulta del saldo y
    # conversion a ether

    try:

        logger.info("Conectando a la red %s...", network)
        w3 = get_web3(network)
        logger.info("Conexión exitosa a la red Ethereum")

    except requests.exceptions.ConnectionError as e:
        logger.error("Error al conectar con la red Ethereum: %s", str(e))
        raise requests.exceptions.ConnectionError(
            "Error al conectar con la red Ethereum") from e

    try:
        logger.info("Comprobando la validez de la dirección de la cartera...")
        if not w3.is_address(address):
            logger.error("Dirección no válida: %s", address)
            raise ValueError("La dirección de la cartera no es válida")

        logger.info("Consultando el saldo de la cartera %s...", address)
        balance = w3.eth.get_balance(address)
        logger.info("Saldo consultado: %s", balance)

        logger.info("Convirtiendo el saldo a ether...")
        saldo_ether = w3.from_wei(balance, 'ether')
        logger.info("Saldo convertido a ether: %s", saldo_ether)

        return saldo_ether

    # Manejo de excepciones

    except exceptions.InvalidAddress as e:
        logger.error("Dirección no válida: %s", {str(e)})
        raise ValueError("La dirección proporcionada no es válida.") from e

    except requests.exceptions.ConnectionError as e:
        logger.error("Error de conexión con la red: %s", {str(e)})
        raise ConnectionError("No se puede conectar a la red Ethereum.") from e

    except exceptions.Web3Exception as e:
        logger.error("Error al consultar el saldo: %s", str(e))
        raise exceptions.Web3Exception(
            "Error en la consulta del saldo.") from e

# Funcion para obtener el saldo de un token ERC-20


async def get_token_balance(token_address, wallet_address, network: str):
    """
    Consulta el saldo de un token ERC-20 para una dirección específica y
    lo devuelve ajustado por decimales del token.

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
        logger.info("Conectando a la red %s", network)
        w3 = get_web3(network)

        logger.info(
            "Verificando si las wallet_address y token_address son correctos: %s, %s",
            wallet_address, token_address
        )

    except requests.exceptions.ConnectionError as e:
        logger.error("Error al conectar con la red Ethereum: %s", str(e))
        raise requests.exceptions.ConnectionError(
            f"Error al conectar con la red Ethereum: {str(e)}") from e

    try:
        if not w3.is_address(wallet_address):
            logger.error("Dirección de wallet no válida: %s", {wallet_address})
            raise ValueError("Dirección de la wallet o del token no válida")

        if not w3.is_address(token_address):
            logger.error("Dirección del token no válido: %s", token_address)
            raise ValueError("Dirección de la wallet o del token no válida")

        logger.info(
            "Creando contrato para el token %s usando ABI mínimo.", token_address)

        token_abi = [
            {"constant": True,
             "inputs": [{"name": "_owner", "type": "address"}],
             "name": "balanceOf",
             "outputs": [{"name": "balance", "type": "uint256"}],
             "payable": False,
             "stateMutability": "view", "type": "function"},

            {"constant": True,
             "inputs": [],
             "name": "decimals",
             "outputs": [{"name": "", "type": "uint8"}],
             "payable": False,
             "stateMutability": "view",
             "type": "function"}
        ]

        # Crear el contrato del token
        token_contract = w3.eth.contract(address=token_address, abi=token_abi)

        # Consultar el saldo del token
        logger.info(
            "Consultando saldo del token para la wallet %s.", wallet_address)
        balance = token_contract.functions.balanceOf(wallet_address).call()
        decimals = token_contract.functions.decimals().call()

        adjusted_balance = balance / (10 ** decimals)

        logger.info(
            "Saldo del token ajustado por decimales: %s", adjusted_balance)

        return adjusted_balance

    except exceptions.Web3Exception as e:

        logger.error("Error al consultar el saldo del token: %s", str(e))
        raise exceptions.Web3Exception(
            f"Error al consultar el saldo del token: {str(e)}") from e


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
        raise exceptions.Web3Exception(
            f"Error al conectar con la red Ethereum: {str(e)}") from e

    try:
        transaction = w3.eth.get_transaction(transaction_hash)

    # Si la transacción no existe, se lanzará una excepción y la manejarás más adelante
    except ValueError as e:
        raise exceptions.Web3Exception(
            f"No se encontró la transacción con el hash {transaction_hash}: {str(e)}") from e

    # Construye un diccionario con los detalles de la transacción
    transaction_details = {
        "hash": transaction_hash,
        "block_number": transaction.blockNumber,
        "from": transaction["from"],
        "to": transaction["to"],
        "value": transaction["value"]/(1000000000000000000),
        "gas": transaction["gas"]
    }

    return transaction_details

# Funcion bucle para obtener el saldo de cada token de la lista


async def get_all_token_balances(wallet_address: str, network: str):
    '''
    Obtiene el saldo de todos los tokens en la lista para una dirección de cartera y
    red específicas.

    Args:
        wallet_address (str): Dirección de la cartera cuyo saldo de token se está consultando.
        network (str): Nombre de la red a la que se conectará.

    Returns:
        dict: Un diccionario con los saldos de los tokens en la lista.
    '''

    balances = {}
    filtered_tokens = [token for token in tokens if token.network == network]
    balance_tasks = [get_token_balance(
        token.token_address, wallet_address, network) for token in filtered_tokens]
    results = await asyncio.gather(*balance_tasks)
    for token, balance in zip(filtered_tokens, results):
        balances[token.token_name] = balance
    return balances

# Funcion para obtener resumen de las últimas operaciones de una cartera


async def get_transaction_summary(wallet_address, network: str, transactions_days: int):
    """
    Obtiene un resumen de las últimas transacciones de una wallet en la red Ethereum especificada.

    Args:
        wallet_address (str): Dirección de la wallet de Ethereum
                              cuyas transacciones se están consultando.
        network (str): Nombre de la red Ethereum a la que se conectará.
        transactions_days (int): Número de días de transacciones a consultar.

    Returns:

        list: Una lista de diccionarios con los detalles de las transacciones.

    """

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
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
    except ValueError as e:
        raise ValueError(f"Error: {str(e)}") from e
    return data['result']


async def token_exists(token_address: str, network: str) -> bool:
    """
    Verifica si un token ERC-20 existe en la red Ethereum especificada.

    Args:
        token_address (str): Dirección del contrato del token ERC-20.
        network (str): Nombre de la red Ethereum a la que se conectará.

    Returns:
        bool: True si el token existe, False si no.

    """
    w3 = get_web3(network)
    try:
        # Limpiar la dirección para asegurarse de que no contenga parámetros o rutas extrañas
        if '?' in token_address:
            # Toma solo la parte antes de '?'
            token_address = token_address.split('?')[0]
    except (AttributeError, TypeError) as e:
        logger.error("Error al limpiar la dirección del token: %s", str(e))
        return False
    try:

        # Asegurarse de que la dirección sea una dirección hexadecimal válida
        token_address = Web3.to_checksum_address(token_address)

    except ValueError as ve:
        logger.error("Dirección de token inválida: %s", ve)
        return False
    try:

        # Crea un objeto contrato usando la dirección y el ABI mínimo
        token_contract = w3.eth.contract(
            address=token_address, abi=minimal_erc20_abi)

    except ValueError as ve:
        logger.error("Dirección de token inválida: %s", ve)
        return False

    try:
        # Intenta obtener el símbolo del token para confirmar que el contrato es válido
        symbol = token_contract.functions.symbol().call()
        logger.info("Símbolo del token: %s", symbol)
        return True
    except exceptions.BadFunctionCallOutput as e:
        # Si la llamada falla, el contrato no existe o la dirección no es un contrato ERC-20
        logger.error("La llamada a la función del contrato falló: %s", str(e))
        return False

    except ValueError as ve:
        logger.error("Dirección de token inválida: %s", ve)
        return False

    except (TypeError, AttributeError) as e:
        # Captura errores específicos de tipos y atributos que puedan surgir
        logger.error(
            "Error de tipo o atributo al verificar el token: %s", str(e))
        return False
