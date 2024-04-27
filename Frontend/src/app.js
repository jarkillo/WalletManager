import React from 'react';
import WalletInfo from './components/WalletInfo';
import SendTransaction from './components/SendTransaction';

function App() {
    return (
        <div>
            <h1>Wallet Manager</h1>
            <WalletInfo />
            <SendTransaction />
        </div>
    );
}

export default App;
