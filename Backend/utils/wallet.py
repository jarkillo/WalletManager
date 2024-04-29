from web3 import Web3, exceptions
from config.blockchain import get_web3
from hexbytes import HexBytes

# Comento la funcion de crear wallet, ya que ahora es innecesaria puesto que se crea en cliente.

# def create_wallet(network: str):
#     """
#     Crea una nueva wallet Ethereum y devuelve su dirección y clave privada.

#     Parámetros:
#         network (str): Nombre de la red Ethereum a la que se conectará la wallet.   

#     """
#     w3 = get_web3(network)
#     account = w3.eth.account.create()
#     return {
#         "address": account.address,
#         "private_key": account._private_key.hex()
#     }


def send_transaction(signed_transaction: str, network: str):
    """
    Envía una transacción de Ethereum y devuelve el hash de la transacción.
    
    Parámetros:
        from_private_key (str): Clave privada del remitente.
        to_address (str): Dirección del destinatario.
        amount (float): Cantidad de ether a enviar.
        network (str): Nombre de la red Ethereum a la que se conectará la wallet.

    """
    try:
        w3 = get_web3(network)
        tx_hash = w3.eth.send_raw_transaction(HexBytes(signed_transaction))
        return {"transaction_hash": w3.toHex(tx_hash)}
    
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