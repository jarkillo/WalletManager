import './App.css';
import logo from './assets/logo.png';
import logoDark from './assets/logo-dark.png';
import React, { useState } from 'react';
import WalletInfo from './components/WalletInfo';
import SendTransaction from './components/SendTransaction';
import CreateWallet from './components/CreateWallet';
import TokenManager from './components/TokenManager';
import TransactionDetails from './components/TransactionDetails';
import TransactionRecords from './components/TransactionRecord';

function App() {
    const [activeSection, setActiveSection] = useState('general');
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const renderSection = () => {
        switch (activeSection) {
            case 'general':
                return (
                    <div className="main-container">
                        <div className="column">
                            <CreateWallet />
                        </div>
                        <div className="column">
                            <TransactionDetails />
                        </div>
                    </div>
                );
            case 'balance':
                return (
                    <div className="main-container">
                        <div className="column">
                            <TokenManager />
                        </div>
                        <div className="column">
                            <WalletInfo />
                        </div>
                        <div className="column">
                            <TransactionRecords />
                        </div>
                    </div>
                );
            case 'transfers':
                return (
                    <div className="main-container">
                        <div className="column">
                            <SendTransaction />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="navbar">
                <div className="logo-container">
                    <img src={darkMode ? logoDark : logo} alt="Logo de la Empresa" className="app-logo" />
                    <span className="app-title">Wallet Manager</span>
                </div>
                <div className="nav-links">
                    <button onClick={() => setActiveSection('general')}>General</button>
                    <button onClick={() => setActiveSection('balance')}>Balance</button>
                    <button onClick={() => setActiveSection('transfers')}>Transferencias</button>
                </div>
                <button className="toggle-dark-mode" onClick={toggleDarkMode}>
                    {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                </button>
            </div>
            <div className="background-decor">
                {renderSection()}
            </div>
        </div>
    );
}

export default App;
