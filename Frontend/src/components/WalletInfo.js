import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WalletInfo() {
    const [balance, setBalance] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/wallet/balance/{your_wallet_address}')
            .then(response => {
                setBalance(response.data.balance);
            })
            .catch(error => console.error('Error fetching balance:', error));
    }, []);

    return (
        <div>
            <h2>Wallet Balance</h2>
            <p>Balance: {balance} ETH</p>
        </div>
    );
}

export default WalletInfo;
