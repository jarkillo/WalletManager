# app/routers/wallet.py
from fastapi import APIRouter, HTTPException
from app.services.blockchain import send_transaction, get_balance, get_transaction_details
from models.schemas import Transaction

router = APIRouter()

@router.post("/wallet/transfer")
async def api_send_transaction(transaction: Transaction):
    try:
        tx_hash = send_transaction(transaction.signed_transaction, transaction.network)
        return {"transaction_hash": tx_hash}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/wallet/balance/{address}")
async def api_get_balance(address: str, network: str = 'mainnet'):
    try:
        balance = get_balance(address, network)
        return {"balance": balance}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.post("/transaction/details")
async def get_transaction_details_endpoint(transaction_hash: str, network: str):
    try:
        details = get_transaction_details(transaction_hash, network)
        return details
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
