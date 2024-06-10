import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { Line } from 'react-chartjs-2';
import Button from './button';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function TransactionRecords() {
    const [walletAddress, setWalletAddress] = useState('');
    const [network, setNetwork] = useState('sepolia');
    const [transactionsDays, setTransactionsDays] = useState(30);
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

    const handleTransactionsDaysChange = (event) => {
        setTransactionsDays(event.target.value);
    };

    const fetchTransactions = async (event) => {
        event.preventDefault();
        if (!walletAddress) return;
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/transaction/summary/${walletAddress}`, {
                params: {
                    network: network,
                    transactions_days: transactionsDays
                }
            });
            setTransactions(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar el historial de transacciones: ' + (err.response?.data?.detail || 'Error desconocido'));
            setTransactions([]);
        }
        setLoading(false);
    };

    const generateChartData = () => {
        const labels = transactions.map((transaction, index) => `Tx ${index + 1}`);
        const values = transactions.map(transaction => parseFloat(ethers.formatEther(transaction.value)));

        return {
            labels,
            datasets: [
                {
                    label: 'Valor de Transacciones (ETH)',
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    tension: 0.1 // Para suavizar las líneas de la gráfica
                }
            ]
        };
    };

    return (
        <div className={`column ${darkMode ? 'generated-text-dark' : 'generated-text-light'}`}>
            <h2>Consultar Historial de Transacciones</h2>
            <form className="form-transaction-records" onSubmit={fetchTransactions}>
                <label>
                    Red:
                    <select value={network} onChange={handleNetworkChange}>
                        <option value="sepolia">Sepolia</option>
                        <option value="mainnet">Mainnet</option>
                    </select>
                </label>
                <label className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>
                    Dirección de la Cartera:
                    <input type="text" value={walletAddress} onChange={handleWalletChange} className="input-field" />
                </label>
                <label className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>
                    Días de Transacciones:
                    <input type="number" value={transactionsDays} onChange={handleTransactionsDaysChange} className="input-field" />
                </label>
                <Button icon={faSearch} type="submit" disabled={loading}>
                    {loading ? 'Cargando...' : 'Consultar Transacciones'}
                </Button>
            </form>
            {error && <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>{error}</p>}
            <div className="transaction-container">
                {transactions.length > 0 ? (
                    <div className="transaction-list-container">
                        <ul className="transaction-list">
                            {transactions.map((transaction, index) => (
                                <li key={index} className="transaction-item">
                                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>Hash: {transaction.hash}</p>
                                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>Desde: {transaction.from}</p>
                                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>Hasta: {transaction.to}</p>
                                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>Valor: {ethers.formatEther(transaction.value)} ETH</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>No se encontraron transacciones.</p>
                )}
            </div>
            {transactions.length > 0 && (
                <div className="chart-container">
                    <Line data={generateChartData()} />
                </div>
            )}
        </div>
    );
}

export default TransactionRecords;
