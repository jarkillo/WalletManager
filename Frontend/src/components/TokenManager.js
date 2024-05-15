import React, { useState } from 'react';
import axios from 'axios';

function TokenManager() {
    const [tokenName, setTokenName] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [network, setNetwork] = useState('mainnet'); // Valor predeterminado
    const [message, setMessage] = useState('');

    const handleAdd = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tokens/`, {
                token_name: tokenName,
                token_address: tokenAddress,
                network: network
            });
            setMessage(response.data.msg);
        } catch (error) {
            setMessage('Error añadiendo el token: ' + (error.response?.data?.detail || 'Error desconocido'));
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tokens/${tokenAddress}`, {
                params: { network: network }
            });
            setMessage(response.data.msg);
        } catch (error) {
            setMessage('Error eliminado el token: ' + (error.response?.data?.detail || 'Error desconocido'));
        }
    };

    return (
        <div>
            <h2>Token Manager</h2>
            <p>
                <select value={network} onChange={(e) => setNetwork(e.target.value)}>
                    <option value="mainnet">Mainnet</option>
                    <option value="sepolia">Sepolia</option>
                </select>
            </p>
            <p>
                <input value={tokenName} onChange={(e) => setTokenName(e.target.value)} placeholder="Nombre del Token" />
                <input value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} placeholder="Dirección del token" />
            </p>
            <button onClick={handleAdd}>Añadir Token</button>
            <button onClick={handleDelete}>Borrar Token</button>
            <p>{message}</p>
        </div>
    );
}

export default TokenManager;


