// Importa los módulos necesarios de React, Axios y Ethers
import React, { useState } from 'react';
import axios from 'axios';
import { ethers, parseEther } from 'ethers';


// Definición del componente SendTransaction para realizar transferencias de Ethereum
function SendTransaction() {

    // Estado para manejar diferentes propiedades del formulario y de la transacción
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

    // Función para estimar el gas necesario para la transacción y crearla
    const handleEstimate = async (event) => {

        // Evita que el formulario se envíe y recargue la página
        event.preventDefault();

        // Verifica que los campos necesarios estén llenos o devuelve error
        if (!privateKey || !toAddress || !amount) {
            setTransactionMessage('Por favor, rellena todos los campos correctamente.');
            return;
        }

        // Muestra un mensaje de carga mientras se realizan procesos
        setIsLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const wallet = new ethers.Wallet(privateKey, provider);

        try {

            // Detalles de la transacción necesarios para estimar el gas
            const transactionDetails = {
                to: toAddress,
                value: parseEther(amount.toString()),
                from: wallet.address // Necesario para la estimación del gas
            };

            // Estimación de gas y obtención de los precios actuales del gas
            const estimatedGasLimit = await provider.estimateGas(transactionDetails);
            const feeData = await provider.getFeeData();

            // Formatea y muestra la estimación de gas y precios de forma clara
            setEstimatedGas(`Gas Estimado: ${estimatedGasLimit.toString()} unidades,
            Tarifa de Prioridad Máxima por Gas: ${ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei')} Gwei,
            Tarifa Máxima por Gas: ${ethers.formatUnits(feeData.maxFeePerGas, 'gwei')} Gwei`);

            setGasLimit(estimatedGasLimit.toString());

            setMaxPriorityFeePerGas(ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei'));

            setMaxFeePerGas(ethers.formatUnits(feeData.maxFeePerGas, 'gwei'));

            setIsEditingGas(false); // Asegura que las opciones no se muestren automáticamente

            setTransactionMessage('Presiona enviar para completar la transacción');

        } catch (error) {
            setTransactionMessage('Error al estimar el gas: ' + error.message);
            console.error('Error estimando el gas:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para enviar la transacción firmada al backend y procesarla
    const handleSendTransaction = async () => {
        setIsLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const wallet = new ethers.Wallet(privateKey, provider);

        try {

            // Configuración de la transacción con los valores modificados por el usuario
            const transaction = {
                nonce: await provider.getTransactionCount(wallet.address, 'latest'),
                gasLimit: ethers.toBigInt(gasLimit),
                maxPriorityFeePerGas: ethers.toBigInt(ethers.parseUnits(maxPriorityFeePerGas, 'gwei')),
                maxFeePerGas: ethers.toBigInt(ethers.parseUnits(maxFeePerGas, 'gwei')),
                to: toAddress,
                value: ethers.toBigInt(ethers.parseEther(amount.toString()).toString()),
                chainId: network === 'sepolia' ? 11155111 : 1 // ID de Sepolia y Mainnet
            };


            const feeData = await provider.getFeeData();
            transaction.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
            transaction.maxFeePerGas = feeData.maxFeePerGas;

            const signedTransaction = await wallet.signTransaction(transaction);

            // Envío de la transacción firmada al backend
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

    // Renderiza el formulario y los controles para la transacción
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
                    <button type="button" onClick={() => setIsEditingGas(!isEditingGas)}>
                        {isEditingGas ? 'Cerrar Edición' : 'Editar Configuración de Gas'}
                    </button>
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




