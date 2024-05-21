"""Dependencias necesarias para la conexión y manejo de la conexión con Infura."""
# app/dependencies.py
import logging
from .utils.web3_utils import get_web3

logger = logging.getLogger(__name__)


def verify_infura_connection():
    """
    Verifica la conexión con el nodo de Infura.

    Se intenta establecer conexión con el nodo principal de Infura y se lanza una excepción
    si no se puede establecer la conexión. También se registra el éxito o el fallo de la conexión.

    Raises:
        ConnectionError: Si no se puede conectar con el nodo de Infura.
    """
    try:
        w3 = get_web3('mainnet')
        if not w3.is_connected():
            raise ConnectionError("No se pudo conectar con Infura")
        logger.info("Conexión con Infura verificada con éxito.")

    except Exception as e:
        logger.critical("Fallo en la conexión inicial a Infura: %s", e)

        raise e
