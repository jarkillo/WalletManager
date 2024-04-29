# Importamos librerías necesarias para el funcionamiento de la API
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import logging
from utils.wallet import create_wallet, send_transaction, get_balance, get_token_balance
from config.blockchain import get_web3
from fastapi.middleware.cors import CORSMiddleware

# Inicialización de la aplicación FastAPI
app = FastAPI()

# Configura el middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Acceso desde el navegador en el host
        "http://frontend:3000"    # Acceso desde el servicio en Docker (si fuera necesario)
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos
    allow_headers=["*"],  # Permite todos los encabezados
)

# Inicializamos el logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Crear un handler de consola y establecer el nivel
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# Crear y establecer el formato del log
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)

# Añadir el handler al logger
logger.addHandler(console_handler)



# Cargamos el archivo token.env que contiene las variables de entorno para mas seguridad
logger.info("Cargando variables de entorno...")
load_dotenv('token.env')


# Leer la API Key de Infura desde las variables de entorno
logger.info("Leyendo el project ID...")
infura_project_id = os.getenv('INFURA_PROJECT_ID')

# Modelo de Pydantic para validar la estructura de la entrada de datos de la transacción
class Transaction(BaseModel):
    from_private_key: str
    to_address: str
    amount: float
    network: str  # Agregamos el campo de la red para poder seleccionarlo en la API

# Endpoint para crear una nueva wallet
@app.post("/wallet/create")

async def api_create_wallet(network: str = 'testnet'):
    '''Crea una nueva wallet en la red especificada y devuelve su dirección y clave privada.
    
    Parámetros:
        network (str): Nombre de la red Ethereum a la que se conectará la wallet.
        '''

    logger.info("Creando una nueva wallet en la red: " + network)
    # llamamos a la función create_wallet del módulo wallet.py
    wallet = create_wallet(network)

    return wallet

# Endpoint para enviar una transacción
@app.post("/wallet/transfer")
async def api_send_transaction(transaction: Transaction):
    '''Envía una transacción de Ethereum y devuelve el hash de la transacción.

    Parámetros:
        from_private_key (str): Clave privada del remitente.
        to_address (str): Dirección del destinatario.
        amount (float): Cantidad de ether a enviar.
        network (str): Nombre de la red Ethereum a la que se conectará la wallet.
    '''
    logger.info("Enviando una transacción en la red: " + transaction.network)
    try:
        # Intenta realizar la transacción y devuelve el hash de la transacción
        tx_hash = send_transaction(
            transaction.from_private_key,
            transaction.to_address,
            transaction.amount,
            transaction.network
        )
        return {"transaction_hash": tx_hash}
    
    except Exception as e:
        # Si ocurre un error, devuelve un mensaje de error con estado HTTP 400
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint para consultar el saldo de una wallet
@app.get("/wallet/balance/{address}")
async def api_get_balance(address: str, network: str = 'sepolia'):
    logger.info("Consultando el saldo de una wallet en la red: " + network)
    balance = get_balance(address, network)
    return {"balance": balance}

# Para ejecutar la API, usar en consola:
# uvicorn main.py:app --reload
