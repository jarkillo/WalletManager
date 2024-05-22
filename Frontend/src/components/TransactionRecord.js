import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './button';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function TransactionRecords() {
    const [walletAddress, setWalletAddress] = useState('');
    const [network, setNetwork] = useState('sepolia');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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

    const handleNetworkChange = (event) => {
        setNetwork(event.target.value);
    };

    const handleWalletChange = (event) => {
        setWalletAddress(event.target.value);
    };

    const fetchTransactions = async () => {
        if (!walletAddress) return;
        setLoading(true);
        try {
            const response = await axios.get(`/transaction/summary/${walletAddress}?network=${network}&transactions_days=30`);
            setTransactions(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar el historial de transacciones');
            setTransactions([]);
        }
        setLoading(false);
    };

    return (
        <div className={`column ${darkMode ? 'generated-text-dark' : 'generated-text-light'}`}>
            <h2>Consultar Historial de Transacciones</h2>
            <form className="form-transaction-records">
                <label>
                    Red:
                    <select value={network} onChange={handleNetworkChange}>
                        <option value="sepolia">Sepolia</option>
                        <option value="mainnet">Mainnet</option>
                    </select>
                </label>
                <label className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>
                    Dirección de la Cartera:
                    <input type="text" value={walletAddress} onChange={handleWalletChange} className="input-field"/>
                </label>
                <Button icon={faSearch} onClick={fetchTransactions} disabled={loading}>
                    {loading ? 'Cargando...' : 'Consultar Transacciones'}
                </Button>
            </form>
            {error && <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>{error}</p>}
            <div>
                {transactions.length > 0 ? (
                    <ul>
                        {transactions.map((transaction, index) => (
                            <li key={index}>
                                <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>Hash: {transaction.hash}</p>
                                <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>Desde: {transaction.from}</p>
                                <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>Hasta: {transaction.to}</p>
                                <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>Valor: {transaction.value} ETH</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>No se encontraron transacciones.</p>
                )}
            </div>
        </div>
    );
}

export default TransactionRecords;
