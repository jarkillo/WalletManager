import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Button from './button';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

function CreateWallet() {
    const [network, setNetwork] = useState('sepolia');
    const [walletData, setWalletData] = useState(null);
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

    const handleChangeNetwork = (event) => {
        setNetwork(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const wallet = ethers.Wallet.createRandom();
        const data = {
            address: wallet.address,
            privateKey: wallet.privateKey
        };
        setWalletData(data);
    };

    const downloadWalletData = () => {
        if (walletData) {
            const blob = new Blob([`Address: ${walletData.address}\nPrivate Key: ${walletData.privateKey}`], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'wallet.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className={`cartera-block ${darkMode ? 'generated-text-dark' : 'generated-text-light'}`}>
            <h2>Crear Nueva Cartera</h2>
            <form onSubmit={handleSubmit} className="form-cartera">
                <label>
                    Red:
                    <select value={network} onChange={handleChangeNetwork}>
                        <option value="sepolia">Sepolia</option>
                        <option value="mainnet">Mainnet</option>
                    </select>
                </label>
                <Button icon={faWallet} type="submit">Crear Cartera</Button>
            </form>
            {walletData && (
                <div>
                    <p className={darkMode ? 'generated-text-dark' : 'generated-text-light'} style={{ wordBreak: 'break-word' }}>
                        Dirección de la Cartera: {walletData.address}
                    </p>
                    <Button onClick={downloadWalletData}>Descargar datos de la Cartera</Button>
                </div>
            )}
            <p style={{ color: 'red' }}>
                Advertencia: Mantenga su clave privada en secreto. No la comparta ni la exponga en línea.
            </p>
        </div>
    );
}

export default CreateWallet;
