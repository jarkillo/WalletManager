'''Rutas para la gestión de tokens en la API'''

from fastapi import APIRouter, HTTPException, Query, Path
from models.schemas import Token
from app.services.blockchain import tokens, token_exists


router = APIRouter()


@router.post("/tokens/", status_code=201)
async def add_token(token: Token):
    '''Añadir un token a la lista de tokens
    Args:
        token (Token): Token a añadir
        Returns:
            dict: Mensaje de confirmación
    '''
    # Comprobar si el token existe en la blockchain antes de añadirlo
    if not await token_exists(token.token_address, token.network):
        raise HTTPException(status_code=404,
                            detail="El token no existe en la blockchain especificada")

    if token in tokens:
        raise HTTPException(status_code=400,
                            detail="El token ya se encuentra en la lista")

    tokens.append(token)
    return {"msg": "Token añadido correctamente"}


@router.delete("/tokens/{token_address}", status_code=200)
async def delete_token(
        token_address: str = Path(...,
                                  description="Dirección del token a eliminar"),
        network: str = Query(..., description="La red en la que se encuentra el token")):
    '''Eliminar un token de la lista de tokens
    Args:
        token_address (str): Dirección del token a eliminar
        network (str): Red en la que se encuentra el token
        Returns:
            dict: Mensaje de confirmación
    '''

    # Buscar el token por dirección y red
    token = next((t for t in tokens if t.token_address ==
                 token_address and t.network == network), None)
    if not token:
        raise HTTPException(status_code=404, detail="Token no encontrado")

    if not await token_exists(token.token_address, token.network):
        raise HTTPException(
            status_code=404, detail="El token no existe en la blockchain")

    # Remover el token encontrado
    tokens.remove(token)
    return {"msg": "El token ha sido eliminado correctamente"}
