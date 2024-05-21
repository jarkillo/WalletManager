"""Este módulo define el ABI mínimo necesario para interactuar con un contrato ERC20.
El ABI incluye las funciones esenciales para obtener la simbología
y la precisión decimal de tokens ERC20.
"""

minimal_erc20_abi = [
    {
        "constant": True,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": True,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function"
    }
]
