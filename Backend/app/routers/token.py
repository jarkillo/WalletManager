from fastapi import APIRouter, HTTPException, Body
from models.schemas import Token
from app.services.blockchain import tokens

router = APIRouter()


@router.post("/tokens/", status_code=201)
async def add_token(token: Token):
    if token not in tokens:
        tokens.append(token)
        return {"msg": "Token añadido correctamente"}
    else:
        raise HTTPException(status_code=400, detail="El token ya se encuentra en la lista")

@router.delete("/tokens/", status_code=204)
async def delete_token(token_address: str):
    global tokens
    original_count = len(tokens)
    tokens = [token for token in tokens if token.token_address != token_address]
    if len(tokens) < original_count:
        return {"msg": "El token ha sido eliminado correctamente"}
    else:
        raise HTTPException(status_code=404, detail="Token no encontrado")

