# app/models/schemas.py
from pydantic import BaseModel, validator
from typing import Dict

class Transaction(BaseModel):
    signed_transaction: str
    network: str

    @validator('signed_transaction')
    def validate_transaction(cls, value):
        if not value.startswith('0x'):
            raise ValueError('La transacción firmada debe comenzar con 0x')
        return value
    
class Token(BaseModel):
    token_name: str
    token_address: str
    network: str

    def __eq__(self, other):
        if not isinstance(other, Token):
            return NotImplemented
        return (self.token_address == other.token_address) and (self.network == other.network)

    class Config:
        json_schema_extra = {
            "example": {
                "token_name": "Dai Stablecoin",
                "token_address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
                "network": "mainnet"
            }
        }
