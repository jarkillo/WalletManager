''' Modulo que contiene las rutas de la API relacionadas con la billetera'''

# app/routers/wallet.py
import logging
from fastapi import APIRouter, HTTPException
from app.services.blockchain import (
    send_transaction,
    get_balance,
    get_transaction_details,
    get_all_token_balances,
    get_transaction_summary
)
from models.schemas import Transaction


logger = logging.getLogger(__name__)


router = APIRouter()


@router.post("/wallet/transfer")
async def api_send_transaction(transaction: Transaction):
    '''Envia una transaccion a la red blockchain

    Args:
        transaction (Transaction): objeto de tipo Transaction

    Returns:   
        dict: diccionario con el hash de la transaccion

    '''

    logger.info(
        "Conectado a la red endpoint {network}. para enviar transaccion")
    try:
        logger.info("Conectado a la red endpoint %s", transaction['network'])
        tx_hash = send_transaction(
            transaction.signed_transaction, transaction.network)
        return {"transaction_hash": tx_hash}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


# Antiguo endpoint para mostrar el saldo

# @router.get("/wallet/balance/{address}")
# async def api_get_balance(address: str, network: str = 'mainnet'):
#     try:
#         balance = get_balance(address, network)
#         return {"balance": balance}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=str(e))


@router.post("/transaction/details")
async def get_transaction_details_endpoint(transaction_hash: str, network: str):
    '''Obtiene los detalles de una transaccion

    Args:

        transaction_hash (str): hash de la transaccion
        network (str): red a la que se conecta

    Returns:
        dict: diccionario con los detalles de la transaccion

    '''
    try:
        details = get_transaction_details(transaction_hash, network)
        return details
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.get("/wallet/balance/{wallet_address}")
async def get_complete_balance(wallet_address: str, network: str = 'sepolia'):
    '''Obtiene el saldo de un wallet_address y el saldo de los tokens

    Args:
        wallet_address (str): direccion del wallet
        network (str): red a la que se conecta

    Returns:
        dict: diccionario con el saldo de ETH y los tokens

    '''

    try:
        eth_balance = await get_balance(wallet_address, network)
        token_balances = await get_all_token_balances(wallet_address, network)
        return {"ETH": eth_balance, "tokens": token_balances}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.get("/transaction/summary/{wallet_address}")
async def get_transaction_summary_endpoint(wallet_address: str,
                                           network: str,
                                           transactions_days: int):
    '''Obtiene un resumen de las transacciones de un wallet_address
      en los ultimos transactions_days dias

    Args:
        wallet_address (str): direccion del wallet
        network (str): red a la que se conecta
        transactions_days (int): cantidad de dias a considerar

    Returns:
        dict: diccionario con el resumen de las transacciones
    '''

    logger.info(
        "conectado a la red endpoint %s. para ver la cartera %s",
        network, wallet_address
    )

    try:
        transaction_summary = await get_transaction_summary(wallet_address,
                                                            network,
                                                            transactions_days)
        return transaction_summary

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
