import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isAddress } from 'ethers';
import Button from './button';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function WalletInfo() {
    const [saldo, setSaldo] = useState(null);
    const [direccionCartera, setDireccionCartera] = useState('');
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

    const handleChangePrivateKey = (event) => {
        setDireccionCartera(event.target.value);
    };

    const handleChangeNetwork = (event) => {
        setNetwork(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isAddress(direccionCartera)) {
            getBalance();
        } else {
            setError('La dirección ingresada no es una dirección Ethereum válida.');
        }
    };

    const getBalance = () => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/wallet/balance/${direccionCartera}?network=${network}`)
            .then(response => {
                setSaldo(response.data);
                setError('');
            })
            .catch(error => {
                console.error('Error al obtener el saldo:', error);
                setError('Error al obtener el saldo. Verifica la red y la dirección.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className={`column ${darkMode ? 'generated-text-dark' : 'generated-text-light'}`}>
            <h2>Saldo de la Cartera</h2>
            <form onSubmit={handleSubmit} className="form-saldo">
                <label>
                    Red:
                    <select value={network} onChange={handleChangeNetwork}>
                        <option value="sepolia">Sepolia</option>
                        <option value="mainnet">Mainnet</option>
                    </select>
                </label>
                <label className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>
                    Wallet:
                    <input type="text" value={direccionCartera} onChange={handleChangePrivateKey} className="input-field"/>
                </label>
                <Button icon={faSearch} type="submit" disabled={isLoading}>Consultar Saldo</Button>
            </form>
            {isLoading && <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>Cargando...</p>}
            {error && <p className="error">{error}</p>}
            {!error && saldo && (
                <>
                    <h3>Balance</h3>
                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>ETH: {saldo.ETH}</p>
                    {saldo.tokens && Object.entries(saldo.tokens).map(([key, value]) => (
                        <p key={key} className={darkMode ? 'generated-text-dark' : 'generated-text-light'}>{key}: {value}</p>
                    ))}
                </>
            )}
        </div>
    );
}

export default WalletInfo;
