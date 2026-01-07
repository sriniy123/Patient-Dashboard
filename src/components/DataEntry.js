"use client";
import { useState } from 'react';

export default function DataEntry({ data, onChange, onSave }) {
    const [medInput, setMedInput] = useState("");

    const handleMedAdd = (e) => {
        e.preventDefault();
        if (!medInput.trim()) return;
        const newMeds = [...data.medicines, medInput.trim()];
        onChange("medicines", newMeds);
        setMedInput("");
    };

    const handleMedRemove = (index) => {
        const newMeds = data.medicines.filter((_, i) => i !== index);
        onChange("medicines", newMeds);
    };

    return (
        <div className="card animate-fade-in">
            <h2 className="heading">Your Health Details</h2>

            <div className="input-group">
                <label className="label" htmlFor="disease">Condition / Disease</label>
                <textarea
                    id="disease"
                    className="textarea"
                    placeholder="e.g. Type 2 Diabetes, Hypertension..."
                    value={data.disease}
                    onChange={(e) => onChange("disease", e.target.value)}
                />
            </div>

            <div className="input-group">
                <label className="label" htmlFor="zipCode">Zip Code</label>
                <input
                    type="text"
                    id="zipCode"
                    className="input"
                    placeholder="e.g. 90210"
                    value={data.zipCode || ""}
                    onChange={(e) => onChange("zipCode", e.target.value)}
                    maxLength={5}
                />
            </div>

            <div className="input-group">
                <label className="label" htmlFor="symptoms">Daily Symptoms</label>
                <div style={{ marginBottom: '0.5rem' }}>
                    <label htmlFor="symptomsDate" style={{ fontSize: '0.9rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>
                        Date of Report
                    </label>
                    <input
                        type="date"
                        id="symptomsDate"
                        className="input"
                        style={{ width: 'auto' }}
                        value={data.symptomDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => onChange("symptomDate", e.target.value)}
                    />
                </div>
                <textarea
                    id="symptoms"
                    className="textarea"
                    placeholder="Describe how you feel today..."
                    value={data.symptoms}
                    onChange={(e) => onChange("symptoms", e.target.value)}
                />
                <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                    <button
                        onClick={onSave}
                        className="btn"
                        style={{
                            backgroundColor: '#E2E8F0',
                            color: '#475569',
                            fontSize: '0.9rem',
                            padding: '0.5rem 1rem'
                        }}
                    >
                        Save Entry
                    </button>
                </div>
            </div>

            <div className="input-group">
                <label className="label">Prescribed Medicines</label>
                <form onSubmit={handleMedAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Add a medicine..."
                        value={medInput}
                        onChange={(e) => setMedInput(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Add</button>
                </form>

                {data.medicines.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {data.medicines.map((med, idx) => (
                            <li key={idx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem',
                                backgroundColor: '#F1F5F9',
                                marginBottom: '0.5rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.95rem'
                            }}>
                                <span>{med}</span>
                                <button
                                    onClick={() => handleMedRemove(idx)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#EF4444',
                                        cursor: 'pointer',
                                        padding: '0 0.5rem',
                                        fontWeight: 'bold'
                                    }}
                                    aria-label="Remove medicine"
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
