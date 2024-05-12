import React, { useState } from 'react';
import axios from 'axios';

function InformacionTransaccion() {
    const [details, setDetails] = useState(null);
    const [transactionHash, setTransactionHash] = useState('');
    const [network, setNetwork] = useState('sepolia');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTransactionHashChange = (event) => {
        setTransactionHash(event.target.value);
    };

    const handleNetworkChange = (event) => {
        setNetwork(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        getTransactionDetails();
    };

    const getTransactionDetails = () => {
        setIsLoading(true);
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/transaction/details/?transaction_hash=${transactionHash}&network=${network}`)
            .then(response => {
                setDetails(response.data);
                setError('');
            })
            .catch(error => {
                console.error('Error fetching transaction details:', error);
                setError('Error al obtener detalles de la transacción. Verifica el hash y la red.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="transaction-details-block">
            <h2>Detalles de la Transacción</h2>
            <form onSubmit={handleSubmit} className="form-transaction-details">
                <label>
                    Red:
                    <select value={network} onChange={handleNetworkChange}>
                        <option value="sepolia">Sepolia</option>
                        <option value="mainnet">Mainnet</option>
                    </select>
                </label>
                <label>
                    Hash de la Transacción:
                    <input type="text" value={transactionHash} onChange={handleTransactionHashChange} />
                </label>
                <button type="submit" disabled={isLoading}>Obtener Detalles</button>
            </form>
            {isLoading && <p>Cargando...</p>}
            {error && <p className="error">{error}</p>}
            {!error && details && (
                <>
                    <h3>Detalles</h3>
                    <p>Hash: {details.hash}</p>
                    <p>Bloque: {details.block_number}</p>
                    <p>Remitente: {details.from}</p>
                    <p>Destinatario: {details.to}</p>
                    <p>Valor: {details.value}</p>
                    <p>Gas: {details.gas}</p>
                </>
            )}
        </div>
    );
}

export default InformacionTransaccion;