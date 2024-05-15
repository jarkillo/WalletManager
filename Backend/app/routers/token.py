from fastapi import APIRouter, HTTPException, Body, Query, Path
from models.schemas import Token
from app.services.blockchain import tokens, token_exists


router = APIRouter()


@router.post("/tokens/", status_code=201)
async def add_token(token: Token):
    # Comprobar si el token existe en la blockchain antes de añadirlo
    if not await token_exists(token.token_address, token.network):
        raise HTTPException(status_code=404, detail="El token no existe en la blockchain especificada")

    if token in tokens:
        raise HTTPException(status_code=400, detail="El token ya se encuentra en la lista")
    
    tokens.append(token)
    return {"msg": "Token añadido correctamente"}

@router.delete("/tokens/{token_address}", status_code=200)
async def delete_token(token_address: str = Path(..., description="The address of the token"), network: str = Query(..., description="The network of the token")):
    # Buscar el token por dirección y red
    token = next((t for t in tokens if t.token_address == token_address and t.network == network), None)
    if not token:
        raise HTTPException(status_code=404, detail="Token no encontrado")

    if not await token_exists(token.token_address, token.network):
        raise HTTPException(status_code=404, detail="El token no existe en la blockchain")

    # Remover el token encontrado
    tokens.remove(token)
    return {"msg": "El token ha sido eliminado correctamente"}
