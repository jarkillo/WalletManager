# app/models/schemas.py
from pydantic import BaseModel, validator

class Transaction(BaseModel):
    signed_transaction: str
    network: str

    @validator('signed_transaction')
    def validate_transaction(cls, value):
        if not value.startswith('0x'):
            raise ValueError('La transacción firmada debe comenzar con 0x')
        return value