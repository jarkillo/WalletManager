import React, { useState } from 'react';
import { ethers } from 'ethers'; // Importamos ethers para crear la cuenta directamente en el cliente y evitar enviar la clave privada

function CrearCartera() {
    const [network, setNetwork] = useState('sepolia');
    const [walletData, setWalletData] = useState(null);

    const manejarCambioRed = (evento) => {
        setNetwork(evento.target.value);
    };

    const manejarEnvio = (evento) => {
        evento.preventDefault();
        const wallet = ethers.Wallet.createRandom();
        const data = {
            address: wallet.address,
            privateKey: wallet.privateKey // Corregimos aquí: privateKey en lugar de private_key
        };
        setWalletData(data);
    };

    const descargarClavePrivada = () => {
        if (walletData) {
            const blob = new Blob([`Address: ${walletData.address}\nPrivate Key: ${walletData.privateKey}`], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'cartera.txt';
            document.body.appendChild(link); // Añade el enlace al documento
            link.click(); // Simula un clic para iniciar la descarga
            document.body.removeChild(link); // Elimina el enlace del documento
            URL.revokeObjectURL(url); // Libera el objeto URL
        }
    };

    return (
        <div className="cartera-block">
            <h2>Crear Nueva Cartera</h2>
            <form onSubmit={manejarEnvio} className="form-cartera">
                <label>
                    Red:
                    <select value={network} onChange={manejarCambioRed}>
                        <option value="sepolia">Sepolia</option>
                        <option value="mainnet">Mainnet</option>
                    </select>
                </label>
                <button type="submit">Crear Cartera</button>
            </form>
            {walletData && (
                <div>
                    <p>Dirección de la Cartera: {walletData.address}</p>
                    <button onClick={descargarClavePrivada}>Descargar datos de la Cartera</button>
                </div>
            )}
        </div>
    );
}

export default CrearCartera;
