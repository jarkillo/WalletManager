import './App.css';

import React from 'react';
import WalletInfo from './components/WalletInfo';
import SendTransaction from './components/SendTransaction';
import CreateWallet from './components/CreateWallet';

function App() {
    return (
        <div>
            <h1>Wallet Manager</h1>
            <CreateWallet />
            <WalletInfo />
            <SendTransaction />

        </div>
    );
}

export default App;