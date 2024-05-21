"""Modulo principal de la aplicación fastAPI."""
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .routers import wallet, token
from .dependencies import verify_infura_connection

load_dotenv('token.env')  # Cargar variables de entorno desde el archivo .env

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(wallet.router)
app.include_router(token.router)

if __name__ == "__main__":
    verify_infura_connection()  # Verificar la conexión al iniciar
