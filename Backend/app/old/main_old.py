from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ValidationError, validator
from fastapi.middleware.cors import CORSMiddleware
import logging
from dotenv import load_dotenv
from utils.wallet import send_transaction, get_balance, get_web3, get_transaction_details, get_token_balance

# Cargar variables de entorno desde el archivo .env
load_dotenv('token.env')

# Configuración de la aplicación FastAPI
app = FastAPI()

# Configuración del CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "http://frontend:3000"    # Docker service
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Configuración de Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Verificar la conexión inicial a Infura
def verify_infura_connection():
    try:
        w3 = get_web3('mainnet')  # Usando mainnet para prueba de conexión
        if not w3.is_connected():
            raise ConnectionError("No se pudo conectar con Infura")
        logger.info("Conexión con Infura verificada con éxito.")
    except Exception as e:
        logger.critical(f"Fallo en la conexión inicial a Infura: {e}")
        raise e

verify_infura_connection()

# Modelos Pydantic
class Transaction(BaseModel):
    signed_transaction: str
    network: str

    @validator('signed_transaction')
    def validate_transaction(cls, value):
        if not value.startswith('0x'):
            raise ValueError('La transacción firmada debe comenzar con 0x')
        return value
    


# Endpoints

# Endpoint para enviar una transacción a la red Ethereum
@app.post("/wallet/transfer")
async def api_send_transaction(transaction: Transaction):
    logger.info(f"Publicando una transacción en la red: {transaction.network}")
    try:
        tx_hash = send_transaction(transaction.signed_transaction, transaction.network)
        return {"transaction_hash": tx_hash}
    except Exception as e:
        logger.error(f"Error al enviar la transacción: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    
# Endpoint para consultar el saldo en Ethereums de una wallet
@app.get("/wallet/balance/{address}")
async def api_get_balance(address: str, network: str = 'mainnet'):
    logger.info(f"Consultando el saldo para {address} en la red {network}")
    try:
        balance = get_balance(address, network)
        return {"balance": balance}
    except Exception as e:
        logger.error(f"Error al consultar el saldo: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    
# Endpoint para consultar el saldo de un token ERC20 en una wallet
    
@app.post("/transaction/details")
async def get_transaction_details_endpoint(transaction_hash: str, network: str):

    logger.info(f"Consultando detalles de la transacción {transaction_hash} en la red {network}")
    try:
        # Llamar a la función get_transaction_details con los datos de entrada proporcionados
        details = get_transaction_details(transaction_hash, network)

        logger.info(f"Detalles de la transacción: {details}")
        return details
    except Exception as e:
        # Capturar cualquier excepción y devolver un error HTTP 400
        raise HTTPException(status_code=400, detail=str(e))

# Punto de entrada para verificar la conexión al iniciar el servidor
if __name__ == "__main__":
    verify_infura_connection()

