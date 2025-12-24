"use client";
import { useState } from 'react';

export default function LoginScreen({ onLogin }) {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin(name.trim());
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            <div className="card animate-fade-in" style={{
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <h1 className="heading" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#1E293B' }}>
                    Welcome to Patient Dashboard
                </h1>
                <p style={{ color: '#64748B', marginBottom: '2rem' }}>
                    Please enter your name to access your records.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Your Name (e.g. John Doe)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginBottom: '1.5rem', textAlign: 'center' }}
                        required
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.8rem' }}
                    >
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
}
