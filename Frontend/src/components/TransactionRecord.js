import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importamos axios para realizar llamadas a la API
import Button from './button';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function HistorialTransacciones() {
    const [walletAddress, setWalletAddress] = useState(''); // Dirección de la cartera
    const [network, setNetwork] = useState('sepolia'); // Red por defecto
    const [transactions, setTransactions] = useState([]); // Lista de transacciones
    const [loading, setLoading] = useState(false); // Estado de carga
    const [error, setError] = useState(null); // Estado de error

    const handleNetworkChange = (event) => {
        setNetwork(event.target.value);
    };

    const handleWalletChange = (event) => {
        setWalletAddress(event.target.value);
    };

    const fetchTransactions = async () => {
        if (!walletAddress) return; // Verifica que la dirección no esté vacía
        setLoading(true);
        try {
            const response = await axios.get(`/transaction/summary/${walletAddress}?network=${network}&transactions_days=30`); // Ajusta la URL según la configuración de tu API
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

export default HistorialTransacciones;
