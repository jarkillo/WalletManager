import './App.css';

import React from 'react';
import WalletInfo from './components/WalletInfo';
import SendTransaction from './components/SendTransaction';
import CreateWallet from './components/CreateWallet';

function App() {
    return (
        <div className="container">
            <h1>Wallet Manager</h1>
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