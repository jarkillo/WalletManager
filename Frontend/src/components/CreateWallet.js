import React, { useState } from 'react';
import { ethers } from 'ethers'; // Importamos ethers para manejar la creación de la cuenta de manera segura
import Button from './button';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

function CrearCartera() {
    const [network, setNetwork] = useState('sepolia'); // Estado inicial de la red
    const [walletData, setWalletData] = useState(null); // Datos de la cartera

    const manejarCambioRed = (evento) => {
        setNetwork(evento.target.value);
    };

    const manejarEnvio = (evento) => {
        evento.preventDefault();
        const wallet = ethers.Wallet.createRandom();
        const data = {
            address: wallet.address,
            privateKey: wallet.privateKey // La clave privada no debe exponerse innecesariamente
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
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
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
                <Button icon={faWallet} type="submit">Crear Cartera</Button>
            </form>
            {walletData && (
                <div>
                    <p>Dirección de la Cartera: {walletData.address}</p>
                    <Button onClick={descargarClavePrivada}>Descargar datos de la Cartera</Button>
                </div>
            )}
            <p style={{ color: 'red' }}>
                Advertencia: Mantenga su clave privada en secreto. No la comparta ni la exponga en línea.
            </p>
        </div>
    );
}

export default CrearCartera;
