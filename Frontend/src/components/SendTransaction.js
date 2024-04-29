import React, { useState } from 'react';
import axios from 'axios';
import { ethers, parseEther } from 'ethers'; // Asegúrate de importar parseEther directamente si está disponible en el export

function SendTransaction() {
    const [network, setNetwork] = useState('sepolia');
    const [privateKey, setPrivateKey] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [transactionMessage, setTransactionMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isValidHash = (hash) => /^0x([A-Fa-f0-9]{64})$/.test(hash);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!privateKey || !toAddress || !amount) {
            setTransactionMessage('Por favor, rellena todos los campos correctamente.');
            return;
        }

        setIsLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const wallet = new ethers.Wallet(privateKey, provider);

        const transaction = {
            nonce: await provider.getTransactionCount(wallet.address, 'latest'),
            to: toAddress,
            value: parseEther(amount.toString()), // Usar parseEther importado
            gasPrice: await provider.getGasPrice(),
        };

        transaction.gasLimit = await provider.estimateGas(transaction);

        try {
            const signedTransaction = await wallet.signTransaction(transaction);
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/wallet/transfer`, {
                network: network,
                signed_transaction: signedTransaction
            });
            setTransactionHash(response.data.transaction_hash);
            setTransactionMessage('Transacción completada correctamente.');
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Error desconocido';
            setTransactionMessage('Error en la transacción: ' + errorMessage);
            console.error('Error sending transaction:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Realizar Transferencia</h2>
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
            {transactionMessage && (
                <div className="result-container">
                    <p>{transactionMessage}</p>
                    {isValidHash(transactionHash) && (
                        <p><a href={`https://${network}.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                            Ver transacción
                        </a></p>
                    )}
                </div>
            )}
        </form>
    );
}

export default SendTransaction;


