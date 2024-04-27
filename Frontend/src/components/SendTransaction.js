import React, { useState } from 'react';
import axios from 'axios';

function SendTransaction() {
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionResult, setTransactionResult] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8000/wallet/transfer', {
            from_private_key: '{your_private_key}', // Not safe, just for example
            to_address: toAddress,
            amount: amount
        })
            .then(response => {
                setTransactionResult(`Transaction successful: ${response.data.transaction_hash}`);
            })
            .catch(error => {
                setTransactionResult('Transaction failed');
                console.error('Error sending transaction:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Send Transaction</h2>
            <label>
                To Address:
                <input type="text" value={toAddress} onChange={e => setToAddress(e.target.value)} />
            </label>
            <label>
                Amount (ETH):
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            </label>
            <button type="submit">Send</button>
            <div>{transactionResult}</div>
        </form>
    );
}

export default SendTransaction;
