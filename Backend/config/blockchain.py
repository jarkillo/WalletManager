from web3 import Web3
import os

def get_web3(network:str):
    """
    Configura y devuelve una instancia de Web3.
    :param infura_project_id: Project ID de Infura para la conexión
    :return: Instancia de Web3
    """

    # URL de las redes
    project_id = os.getenv("INFURA_PROJECT_ID")
    if not project_id:
        raise EnvironmentError("INFURA_PROJECT_ID no está definido en las variables de entorno.")
    
    network_url = f'https://{network}.infura.io/v3/{os.getenv("INFURA_PROJECT_ID")}'

    # Conexión a la red de prueba de Ethereum, si queremos conectarnos a la red principal, cambiamos por infura_mainet_url
    # Aqui se podria pedir al frontend que indique si quiere usar sepolia o usar la red principal, y en base a eso elegir la red
    w3 = Web3(Web3.HTTPProvider(network_url))

    if not w3.is_connected():
        raise ConnectionError(f"No se pudo conectar con {network} via Infura")

    return w3
