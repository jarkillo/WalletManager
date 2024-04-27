from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from utils.wallet import create_wallet, send_transaction, get_balance
import dotenv

app = FastAPI()

# Modelo para la entrada de datos de transferencia
class Transaction(BaseModel):
    from_private_key: str
    to_address: str
    amount: float

@app.post("/wallet/create")
async def api_create_wallet():
    wallet = create_wallet()
    return wallet

@app.post("/wallet/transfer")
async def api_send_transaction(transaction: Transaction):
    try:
        tx_hash = send_transaction(transaction.from_private_key, transaction.to_address, transaction.amount)
        return {"transaction_hash": tx_hash}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/wallet/balance/{address}")
async def api_get_balance(address: str):
    balance = get_balance(address)
    return {"balance": balance}


# Para ejecutar la API

# poner en consola: uvicorn main.py:app --reload