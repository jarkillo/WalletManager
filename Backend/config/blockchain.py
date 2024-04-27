from web3 import Web3

def get_web3(infura_project_id):
    """
    Configura y devuelve una instancia de Web3.
    :param infura_project_id: Project ID de Infura para la conexión
    :return: Instancia de Web3
    """
    if not infura_project_id:
        raise ValueError("INFURA_PROJECT_ID no proporcionado")

    infura_url = f'https://mainnet.infura.io/v3/{infura_project_id}'
    w3 = Web3(Web3.HTTPProvider(infura_url))


    if not w3.is_connected():
        raise ConnectionError("No se pudo conectar con Ethereum a través de Infura")

    return w3
