import React, { useState } from 'react';
import axios from 'axios';

function InformacionCartera() {
    const [saldo, setSaldo] = useState('');
    const [direccionCartera, setDireccionCartera] = useState('');
    const [network, setNetwork] = useState('sepolia');

    const manejarCambioClavePrivada = (evento) => {
        setDireccionCartera(evento.target.value);
    };

    const manejarCambioRed = (evento) => {
        setNetwork(evento.target.value);
    };

    const manejarEnvio = (evento) => {
        evento.preventDefault();
        obtenerSaldo();
    };

    const obtenerSaldo = () => {
        if (direccionCartera) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/wallet/balance/${direccionCartera}`)
                .then(respuesta => {
                    console.log("Datos de la respuesta:", respuesta.data);
                    setSaldo(respuesta.data.balance);  // Asegúrate de usar la clave correcta aquí
                })
                .catch(error => {
                    console.error('Error al obtener el saldo:', error);
                    if (error.response) {
                        // Maneja respuestas fuera del rango de 2xx
                        console.log("Datos:", error.response.data);
                        console.log("Estado:", error.response.status);
                        console.log("Cabeceras:", error.response.headers);
                    } else if (error.request) {
                        // La solicitud fue hecha pero no se recibió respuesta
                        console.log("Request:", error.request);
                    } else {
                        // Algo más causó el error
                        console.log('Error', error.message);
                    }
                });
        }
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
                <button type="submit">Consultar Saldo</button>
            </form>
            {saldo && (
                <p className="saldo-resultado">Saldo: {saldo} ETH</p>
            )}
        </div>
    );
}

export default InformacionCartera;




