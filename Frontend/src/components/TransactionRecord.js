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
        <div className="transaction-history">
            <h2>Consultar Historial de Transacciones</h2>
            <div>
                <label>
                    Red:
                    <select value={network} onChange={handleNetworkChange}>
                        <option value="sepolia">Sepolia</option>
                        <option value="mainnet">Mainnet</option>
                    </select>
                </label>
                <label>
                    Dirección de la Cartera:
                    <input type="text" value={walletAddress} onChange={handleWalletChange} />
                </label>
                <Button icon={faSearch} onClick={fetchTransactions} disabled={loading}>
                    {loading ? 'Cargando...' : 'Consultar Transacciones'}
                </Button>
            </div>
            {error && <p>{error}</p>}
            <div>
                {transactions.length > 0 ? (
                    <ul>
                        {transactions.map((transaction, index) => (
                            <li key={index}>
                                <p>Hash: {transaction.hash}</p>
                                <p>Desde: {transaction.from}</p>
                                <p>Hasta: {transaction.to}</p>
                                <p>Valor: {transaction.value} ETH</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No se encontraron transacciones.</p>
                )}
            </div>
        </div>
    );
}

export default TransactionRecords;
