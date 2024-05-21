import './App.css';
import logo from './assets/logo.png';
import React from 'react';
import WalletInfo from './components/WalletInfo';
import SendTransaction from './components/SendTransaction';
import CreateWallet from './components/CreateWallet';
import TokenManager from './components/TokenManager';
import TransactionDetails from './components/TransactionDetails';
import TransactionRecords from './components/TransactionRecord';

function App() {
    return (
        <div className="app-container">
            <nav className="navbar">
                <div className="logo-container">
                    <img src={logo} alt="Logo de la Empresa" className="app-logo" />
                    <span className="app-title">Wallet Manager</span>
                </div>
            </nav>
            <div className="background-decor">
                <div className="main-container">
                    <div className="column">
                        <CreateWallet />
                        <TransactionDetails />
                    </div>
                    <div className="column">
                        <WalletInfo />
                        <TransactionRecords />
                    </div>
                    <div className="column">
                        <SendTransaction />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
