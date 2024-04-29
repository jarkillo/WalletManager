import React, { useState } from 'react';
import axios from 'axios';

function SendTransaction() {
    const [network, setNetwork] = useState('sepolia');
    const [privateKey, setPrivateKey] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionResult, setTransactionResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!privateKey || !toAddress || !amount) {
            setTransactionResult('Please fill all fields correctly.');
            return;
        }

        setIsLoading(true);
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/wallet/transfer`, {
            network: network,
            from_private_key: privateKey,
            to_address: toAddress,
            amount: parseFloat(amount)
        })
            .then(response => {
                setTransactionResult(`Transacción completada correctamente, el hash de la transferencia es: ${response.data.transaction_hash}`);
            })
            .catch(error => {
                const errorMessage = error.response?.data?.detail || 'Unknown error';
                setTransactionResult('Transaction failed: ' + errorMessage);
                console.error('Error sending transaction:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Send Transaction</h2>
            <label>
                Red:
                <select value={network} onChange={e => setNetwork(e.target.value)}>
                    <option value="mainnet">Mainnet</option>
                    <option value="sepolia">Sepolia</option>
                </select>
            </label>
            <label>
                Clave privada de tu cartera:
                <input type="password" value={privateKey} onChange={e => setPrivateKey(e.target.value)} />
            </label>
            <label>
                Cartera de destino:
                <input type="text" value={toAddress} onChange={e => setToAddress(e.target.value)} />
            </label>
            <label>
                Cantidad (ETH):
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            </label>
            <button type="submit" disabled={isLoading}>Enviar</button>
            {isLoading && <p>Enviando la transacción...</p>}
            <div className="result-container">
                <p>La transacción se ha completado correctamente. El hash de la transacción es: {transactionResult}</p>
                <a href={`https://explorer.network.io/tx/${transactionResult}`} target="_blank" rel="noopener noreferrer">
                    Ver transacción
                </a>
            </div>
        </form>
    );
}

export default SendTransaction;

