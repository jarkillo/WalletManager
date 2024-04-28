import React, { useState } from 'react';
import axios from 'axios';

function InformacionCartera() {
    const [saldo, setSaldo] = useState('');
    const [direccionCartera, setDireccionCartera] = useState('');

    const manejarCambioClavePrivada = (evento) => {
        setDireccionCartera(evento.target.value);
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
        <div>
            <h2>Saldo de la Cartera</h2>
            <form onSubmit={manejarEnvio}>
                <label>
                    Wallet:
                    <input type="text" value={direccionCartera} onChange={manejarCambioClavePrivada} />
                </label>
                <button type="submit">Enviar</button>
            </form>
            <p>Saldo: {saldo} ETH</p>
        </div>
    );
}

export default InformacionCartera;




