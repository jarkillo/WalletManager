"""
Este módulo define los esquemas de datos para transacciones y tokens utilizando Pydantic.
"""

from pydantic import BaseModel, validator


class Transaction(BaseModel):
    """
    Esquema de datos para una transacción firmada.
    """
    signed_transaction: str
    network: str

    @validator('signed_transaction')
    def validate_transaction(cls, value):  # pylint: disable=no-self-argument
        """
        Valida que la transacción firmada comience con '0x'.
        """
        if not value.startswith('0x'):
            raise ValueError('La transacción firmada debe comenzar con 0x')
        return value


class Token(BaseModel):
    """
    Esquema de datos para un token.
    """
    token_name: str
    token_address: str
    network: str

    def __eq__(self, other):
        """
        Compara dos objetos Token para verificar si son iguales.
        """
        if not isinstance(other, Token):
            return NotImplemented
        return (self.token_address == other.token_address) and (self.network == other.network)

    class Config:
        """
        Configuración extra para el esquema del token.
        """
        json_schema_extra = {
            "example": {
                "token_name": "Dai Stablecoin",
                "token_address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                "network": "mainnet"
            }
        }
