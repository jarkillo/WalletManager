import './App.css';
import logo from './assets/logo.png';
import React from 'react';
import WalletInfo from './components/WalletInfo';
import SendTransaction from './components/SendTransaction';
import CreateWallet from './components/CreateWallet';

function App() {
    return (
        <div className="container">
            <img src={logo} alt="Logo de la Empresa" className="App-logo" />
            <div className="column">
                <CreateWallet />
                <WalletInfo />
            </div>
            <div className="column">
                <SendTransaction />
            </div>
        </div>
    );
}

export default App;