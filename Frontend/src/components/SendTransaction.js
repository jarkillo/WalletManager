import React, { useState } from 'react';
import axios from 'axios';
import { ethers, parseEther } from 'ethers';

function SendTransaction() {
    const [network, setNetwork] = useState('sepolia');
    const [privateKey, setPrivateKey] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [transactionMessage, setTransactionMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [estimatedGas, setEstimatedGas] = useState('');

    const handleEstimate = async (event) => {
        event.preventDefault();

        if (!privateKey || !toAddress || !amount) {
            setTransactionMessage('Por favor, rellena todos los campos correctamente.');
            return;
        }

        setIsLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const wallet = new ethers.Wallet(privateKey, provider);

        try {
            const transactionDetails = {
                to: toAddress,
                value: parseEther(amount.toString()),
                from: wallet.address // Necesario para la estimación del gas
            };

            const estimatedGasLimit = await provider.estimateGas(transactionDetails);
            const feeData = await provider.getFeeData();

            setEstimatedGas(`Estimated Gas: ${estimatedGasLimit.toString()}, Max Priority Fee Per Gas: ${feeData.maxPriorityFeePerGas.toString()}, Max Fee Per Gas: ${feeData.maxFeePerGas.toString()}`);
            setTransactionMessage('Presiona enviar para completar la transacción');
        } catch (error) {
            setTransactionMessage('Error al estimar el gas: ' + error.message);
            console.error('Error estimating gas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendTransaction = async () => {
        setIsLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const wallet = new ethers.Wallet(privateKey, provider);

        try {
            const transaction = {
                nonce: await provider.getTransactionCount(wallet.address, 'latest'),
                gasLimit: await provider.estimateGas({
                    to: toAddress,
                    value: parseEther(amount.toString()),
                }),
                to: toAddress,
                value: parseEther(amount.toString()),
                chainId: network === 'sepolia' ? 11155111 : 1 // Sepolia Chain ID or Mainnet
            };

            const feeData = await provider.getFeeData();
            transaction.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
            transaction.maxFeePerGas = feeData.maxFeePerGas;

            const signedTransaction = await wallet.signTransaction(transaction);

            // Enviar la transacción firmada al backend
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/wallet/transfer`, {
                signed_transaction: signedTransaction,
                network
            });
            setTransactionHash(response.data.transaction_hash);
            setTransactionMessage('Transacción completada correctamente.');
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Error desconocido';
            setTransactionMessage('Error al enviar la transacción: ' + errorMessage);
            console.error('Error sending transaction:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleEstimate}>
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
            <button type="submit" disabled={isLoading}>Estimar Gas</button>
            {isLoading && <p>Calculando...</p>}
            {!isLoading && estimatedGas && (
                <div>
                    <p>{estimatedGas}</p>
                    <button type="button" onClick={handleSendTransaction}>Enviar Transacción</button>
                </div>
            )}
            {transactionMessage && (
                <div className="result-container">
                    <p>{transactionMessage}</p>
                    {transactionHash && (
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




