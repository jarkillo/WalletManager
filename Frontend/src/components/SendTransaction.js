/* global BigInt */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import Button from './button';
import { faPaperPlane, faGasPump, faEdit } from '@fortawesome/free-solid-svg-icons';

console.log('Infura Project ID:', process.env.REACT_APP_INFURA_KEY); // Verifica que esta línea imprima el ID correctamente

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
    const [darkMode, setDarkMode] = useState(false);

    const infuraKey = process.env.REACT_APP_INFURA_KEY;

    const getProvider = () => {
        const networkUrl = network === 'sepolia'
            ? `https://sepolia.infura.io/v3/${infuraKey}`
            : `https://mainnet.infura.io/v3/${infuraKey}`;
        return new ethers.JsonRpcProvider(networkUrl);
    };

    useEffect(() => {
        const darkModePreference = localStorage.getItem('darkMode') === 'true';
        setDarkMode(darkModePreference);
    }, []);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setDarkMode(document.body.classList.contains('dark-mode'));
        });

        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleEstimate = async (event) => {
        event.preventDefault();
        if (!privateKey || !toAddress || !amount) {
            setTransactionMessage('Por favor, rellena todos los campos correctamente.');
            return;
        }

        setIsLoading(true);
        const provider = getProvider();
        const wallet = new ethers.Wallet(privateKey, provider);

        try {
            const transactionDetails = {
                to: toAddress,
                value: ethers.parseEther(amount.toString()),
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
        const provider = getProvider();
        const wallet = new ethers.Wallet(privateKey, provider);

        try {
            const transaction = {
                nonce: await provider.getTransactionCount(wallet.address, 'latest'),
                gasLimit: BigInt(gasLimit),
                maxPriorityFeePerGas: BigInt(ethers.parseUnits(maxPriorityFeePerGas, 'gwei')),
                maxFeePerGas: BigInt(ethers.parseUnits(maxFeePerGas, 'gwei')),
                to: toAddress,
                value: BigInt(ethers.parseEther(amount.toString()).toString()),
                chainId: network === 'sepolia' ? 11155111 : 1
            };

            // Sign the transaction
            const signedTransaction = await wallet.signTransaction(transaction);

            // Ensure the signed transaction starts with '0x'
            if (!signedTransaction.startsWith('0x')) {
                throw new Error('La transacción firmada debe comenzar con 0x');
            }

            // Send the signed transaction via POST request
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/wallet/transfer`, {
                signed_transaction: signedTransaction,
                network
            });

            // Handle the response
            setTransactionHash(response.data.transaction_hash);
            setTransactionMessage('Transacción completada correctamente.');
        } catch (error) {
            let errorMessage;
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                errorMessage = `Error del servidor: ${error.response.data.detail || 'Error desconocido'}`;
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'No se recibió respuesta del servidor';
            } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage = `Error en la configuración de la solicitud: ${error.message}`;
            }
            setTransactionMessage('Error al enviar la transacción: ' + errorMessage);
            console.error('Error sending transaction:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`column ${darkMode ? 'generated-text-dark' : 'generated-text-light'}`}>
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
                    <input type="password" value={privateKey} onChange={e => setPrivateKey(e.target.value)} className="input-field" />
                </label>
                <label>
                    Cartera de destino:
                    <input type="text" value={toAddress} onChange={e => setToAddress(e.target.value)} className="input-field" />
                </label>
                <label>
                    Cantidad (ETH):
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field" />
                </label>
                <Button icon={faGasPump} type="submit" disabled={isLoading}>Estimar Gas</Button>
                {isLoading && <p>Calculando...</p>}
                {!isLoading && estimatedGas && (
                    <div>
                        <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>{estimatedGas}</p>
                        <Button icon={faEdit} type="button" onClick={() => setIsEditingGas(!isEditingGas)}>
                            {isEditingGas ? 'Cerrar Edición' : 'Editar Configuración de Gas'}
                        </Button>
                        {isEditingGas && (
                            <div>
                                <label>
                                    Límite de Gas:
                                    <input type="number" value={gasLimit} onChange={e => setGasLimit(e.target.value)} className="input-field" />
                                </label>
                                <label>
                                    Tarifa de Prioridad Máxima por Gas:
                                    <input type="number" value={maxPriorityFeePerGas} onChange={e => setMaxPriorityFeePerGas(e.target.value)} className="input-field" />
                                </label>
                                <label>
                                    Tarifa Máxima por Gas:
                                    <input type="number" value={maxFeePerGas} onChange={e => setMaxFeePerGas(e.target.value)} className="input-field" />
                                </label>
                            </div>
                        )}
                        <Button icon={faPaperPlane} type="button" onClick={handleSendTransaction}>Enviar Transacción</Button>
                    </div>
                )}

                {transactionMessage && (
                    <div className="result-container">
                        <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>{transactionMessage}</p>
                        {transactionHash && (
                            <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}><a href={`https://${network}.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
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
