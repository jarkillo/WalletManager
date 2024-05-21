import React, { useState } from 'react';
import axios from 'axios';
import { ethers, parseEther } from 'ethers';
import Button from './button';
import { faPaperPlane, faGasPump, faEdit } from '@fortawesome/free-solid-svg-icons';

function SendTransaction() {
    const [network, setNetwork] = useState('sepolia');
    const [privateKey, setPrivateKey] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [transactionMessage, setTransactionMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [estimatedGas, setEstimatedGas] = useState('');
    const [gasLimit, setGasLimit] = useState('');
    const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState('');
    const [maxFeePerGas, setMaxFeePerGas] = useState('');
    const [isEditingGas, setIsEditingGas] = useState(false);

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
                from: wallet.address
            };

            const estimatedGasLimit = await provider.estimateGas(transactionDetails);
            const feeData = await provider.getFeeData();

            setEstimatedGas(`Gas Estimado: ${estimatedGasLimit.toString()} unidades,
            Tarifa de Prioridad Máxima por Gas: ${ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei')} Gwei,
            Tarifa Máxima por Gas: ${ethers.formatUnits(feeData.maxFeePerGas, 'gwei')} Gwei`);

            setGasLimit(estimatedGasLimit.toString());
            setMaxPriorityFeePerGas(ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei'));
            setMaxFeePerGas(ethers.formatUnits(feeData.maxFeePerGas, 'gwei'));
            setIsEditingGas(false);

            setTransactionMessage('Presiona enviar para completar la transacción');
        } catch (error) {
            setTransactionMessage('Error al estimar el gas: ' + error.message);
            console.error('Error estimando el gas:', error);
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
                gasLimit: ethers.toBigInt(gasLimit),
                maxPriorityFeePerGas: ethers.toBigInt(ethers.parseUnits(maxPriorityFeePerGas, 'gwei')),
                maxFeePerGas: ethers.toBigInt(ethers.parseUnits(maxFeePerGas, 'gwei')),
                to: toAddress,
                value: ethers.toBigInt(ethers.parseEther(amount.toString()).toString()),
                chainId: network === 'sepolia' ? 11155111 : 1
            };

            const feeData = await provider.getFeeData();
            transaction.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
            transaction.maxFeePerGas = feeData.maxFeePerGas;

            const signedTransaction = await wallet.signTransaction(transaction);

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
        <div className="column">
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
                <Button icon={faGasPump} type="submit" disabled={isLoading}>Estimar Gas</Button>
                {isLoading && <p>Calculando...</p>}
                {!isLoading && estimatedGas && (
                    <div>
                        <p>{estimatedGas}</p>
                        <Button icon={faEdit} type="button" onClick={() => setIsEditingGas(!isEditingGas)}>
                            {isEditingGas ? 'Cerrar Edición' : 'Editar Configuración de Gas'}
                        </Button>
                        {isEditingGas && (
                            <div>
                                <label>
                                    Límite de Gas:
                                    <input type="number" value={gasLimit} onChange={e => setGasLimit(e.target.value)} />
                                </label>
                                <label>
                                    Tarifa de Prioridad Máxima por Gas:
                                    <input type="number" value={maxPriorityFeePerGas} onChange={e => setMaxPriorityFeePerGas(e.target.value)} />
                                </label>
                                <label>
                                    Tarifa Máxima por Gas:
                                    <input type="number" value={maxFeePerGas} onChange={e => setMaxFeePerGas(e.target.value)} />
                                </label>
                            </div>
                        )}
                        <Button icon={faPaperPlane} type="button" onClick={handleSendTransaction}>Enviar Transacción</Button>
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
        </div>
    );
}

export default SendTransaction;
