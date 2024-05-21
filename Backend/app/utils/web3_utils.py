''' Configuración de Web3 para conectarse a la red Ethereum. '''

import os
from web3 import Web3
from web3.middleware import geth_poa_middleware


def get_web3(network: str):
    """
    Configura y devuelve una instancia de Web3.
    :param network: Nombre de la red Ethereum a conectar (ej: 'mainnet', 'sepolia').
    :return: Instancia de Web3 conectada.
    """
    project_id = os.getenv("INFURA_PROJECT_ID")
    if not project_id:
        raise EnvironmentError(
            "INFURA_PROJECT_ID no está definido en las variables de entorno.")

    network_url = f'https://{network}.infura.io/v3/{project_id}'

    w3 = Web3(Web3.HTTPProvider(network_url))

    # Añadir middleware para PoA
    if network in ["sepolia"]:
        w3.middleware_onion.inject(geth_poa_middleware, layer=0)

    if not w3.is_connected():
        raise ConnectionError(f"No se pudo conectar con {network} via Infura")

    return w3
