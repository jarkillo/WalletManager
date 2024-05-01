# app/dependencies.py
import logging
from .utils.web3_utils import get_web3

logger = logging.getLogger(__name__)

def verify_infura_connection():
    try:
        w3 = get_web3('mainnet')
        if not w3.is_connected():
            raise ConnectionError("No se pudo conectar con Infura")
        logger.info("Conexión con Infura verificada con éxito.")

    except Exception as e:
        logger.critical(f"Fallo en la conexión inicial a Infura: {e}")
        raise e
