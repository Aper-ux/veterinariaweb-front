import React, { useState } from 'react';

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', 
        email, 'Password:', password);
    }

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">Contraseña:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
}