import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './button';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function TransactionDetails() {
    const [details, setDetails] = useState(null);
    const [transactionHash, setTransactionHash] = useState('');
    const [network, setNetwork] = useState('sepolia');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);

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
        <div className={`transaction-details-block ${darkMode ? 'generated-text-dark' : 'generated-text-light'}`}>
            <h2>Detalles de la Transacción</h2>
            <form onSubmit={handleSubmit} className="form-transaction-details">
                <label>
                    Red:
                    <select value={network} onChange={handleNetworkChange} className="input-field">
                        <option value="sepolia">Sepolia</option>
                        <option value="mainnet">Mainnet</option>
                    </select>
                </label>
                <label>
                    Hash de la Transacción:
                    <input type="text" value={transactionHash} onChange={handleTransactionHashChange} className="input-field"/>
                </label>
                <Button icon={faSearch} type="submit" disabled={isLoading}>Obtener Detalles</Button>
            </form>
            {isLoading && <p>Cargando...</p>}
            {error && <p className="error">{error}</p>}
            {!error && details && (
                <>
                    <h3>Detalles</h3>
                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'} style={{ wordBreak: 'break-word' }}>Hash: {details.hash}</p>
                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'} style={{ wordBreak: 'break-word' }}>Bloque: {details.block_number}</p>
                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'} style={{ wordBreak: 'break-word' }}>Remitente: {details.from}</p>
                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'} style={{ wordBreak: 'break-word' }}>Destinatario: {details.to}</p>
                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'} style={{ wordBreak: 'break-word' }}>Valor (ETH): {details.value}</p>
                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'} style={{ wordBreak: 'break-word' }}>Gas (Gwei): {details.gas}</p>
                </>
            )}
        </div>
    );
}

export default TransactionDetails;
