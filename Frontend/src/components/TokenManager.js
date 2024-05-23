import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './button';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

function TokenManager() {
    const [tokenName, setTokenName] = useState('');
    const [tokenAddress, setTokenAddress] = useState('');
    const [network, setNetwork] = useState('mainnet');
    const [message, setMessage] = useState('');
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
        <div className={`column ${darkMode ? 'generated-text-dark' : 'generated-text-light'}`}>
            <h2>Token Manager</h2>
            <form className="form-token-manager">
                <label>
                    Red:
                    <select value={network} onChange={(e) => setNetwork(e.target.value)}>
                        <option value="mainnet">Mainnet</option>
                        <option value="sepolia">Sepolia</option>
                    </select>
                </label>
                <input value={tokenName} onChange={(e) => setTokenName(e.target.value)} placeholder="Nombre del Token" className="input-field" />
                <input value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} placeholder="Dirección del token" className="input-field" />
                <Button icon={faPlus} onClick={handleAdd}>Añadir Token</Button>
                <Button icon={faTrash} onClick={handleDelete}>Borrar Token</Button>
            </form>
            {message && <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>{message}</p>}
        </div>
    );
}

export default TokenManager;
