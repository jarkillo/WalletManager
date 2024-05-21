import React, { useState } from 'react';
import axios from 'axios';
import Button from './button';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

function TokenManager() {
    const [tokenName, setTokenName] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [network, setNetwork] = useState('mainnet');
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
        <div className="column">
            <h2>Token Manager</h2>
            <form className="form-token-manager">
                <label>
                    Red:
                    <select value={network} onChange={(e) => setNetwork(e.target.value)}>
                        <option value="mainnet">Mainnet</option>
                        <option value="sepolia">Sepolia</option>
                    </select>
                </label>
                <input value={tokenName} onChange={(e) => setTokenName(e.target.value)} placeholder="Nombre del Token" />
                <input value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} placeholder="Dirección del token" />
                <Button icon={faPlus} onClick={handleAdd}>Añadir Token</Button>
                <Button icon={faTrash} onClick={handleDelete}>Borrar Token</Button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default TokenManager;
