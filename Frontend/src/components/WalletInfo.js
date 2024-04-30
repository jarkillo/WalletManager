import React, { useState } from 'react';
import axios from 'axios';
import { isAddress } from 'ethers'; // Asegúrate de tener esta importación si estás usando la función isAddress de ethers

function InformacionCartera() {
    const [saldo, setSaldo] = useState(null); // Cambiado a null como valor inicial para claridad
    const [direccionCartera, setDireccionCartera] = useState('');
    const [network, setNetwork] = useState('sepolia');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const manejarCambioClavePrivada = (evento) => {
        setDireccionCartera(evento.target.value);
    };

    const manejarCambioRed = (evento) => {
        setNetwork(evento.target.value);
    };

    const manejarEnvio = (evento) => {
        evento.preventDefault();
        if (isAddress(direccionCartera)) {
            obtenerSaldo();
        } else {
            setError('La dirección ingresada no es una dirección Ethereum válida.');
        }
    };

    const obtenerSaldo = () => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/wallet/balance/${direccionCartera}/${network}`)
            .then(respuesta => {
                setSaldo(respuesta.data.balance); // Asegúrate de usar la clave correcta aquí
                setError('');
            })
            .catch(error => {
                console.error('Error al obtener el saldo:', error);
                setError('Error al obtener el saldo. Verifica la red y la dirección.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="saldo-block">
            <h2>Saldo de la Cartera</h2>
            <form onSubmit={manejarEnvio} className="form-saldo">
                <label>
                    Red:
                    <select value={network} onChange={manejarCambioRed}>
                        <option value="sepolia">Sepolia</option>
                        <option value="mainnet">Mainnet</option>
                    </select>
                </label>
                <label>
                    Wallet:
                    <input type="text" value={direccionCartera} onChange={manejarCambioClavePrivada} />
                </label>
                <button type="submit" disabled={isLoading}>Consultar Saldo</button>
            </form>
            {isLoading && <p>Cargando...</p>}
            {error && <p className="error">{error}</p>}
            {saldo !== null && !error && (
                <p className="saldo-resultado">Saldo: {saldo} ETH</p>
            )}
        </div>
    );
}

export default InformacionCartera;

