# En este codigo se incluiran las funciones necesarias para la creacion de wallets y la gestion de las mismas

from web3 import Web3
from web3.auto import w3

# Funcion esqueleto para crear la cartera

def create_wallet():
    account = w3.eth.account.create()
    return {
        "address": account.address,
        "private_key": account.privateKey.hex()
    }


# Funcion esqueleto para realizar transferencias

def send_transaction(from_private_key, to_address, amount):
    account = w3.eth.account.privateKeyToAccount(from_private_key)
    nonce = w3.eth.getTransactionCount(account.address)
    tx = {
        'nonce': nonce,
        'to': to_address,
        'value': w3.toWei(amount, 'ether'),
        'gas': 2000000,
        'gasPrice': w3.toWei('50', 'gwei')
    }
    signed_tx = account.sign_transaction(tx)
    tx_hash = w3.eth.sendRawTransaction(signed_tx.rawTransaction)
    return w3.toHex(tx_hash)

# Funcion esqueleto para consultar el saldo

def get_balance(address):
    balance = w3.eth.getBalance(address)
    return w3.fromWei(balance, 'ether')



