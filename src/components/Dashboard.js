"use client";
import { useState, useEffect } from 'react';
import DataEntry from './DataEntry';
import InsightsViewer from './InsightsViewer';
import SymptomHistory from './SymptomHistory';

import LoginScreen from './LoginScreen';

import { usePatientContext } from '@/context/PatientContext';

export default function Dashboard() {
    const [currentUser, setCurrentUser] = useState(null);
    const { updatePatientData } = usePatientContext();

    const [data, setData] = useState({
        disease: "",
        zipCode: "",
        symptoms: "",
        symptomDate: new Date().toISOString().split('T')[0],
        medicines: []
    });

    const [history, setHistory] = useState([]);

    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Persistence: Load data on user change
    useEffect(() => {
        if (!currentUser) return;

        const savedData = localStorage.getItem(`patientData_${currentUser}`);
        const savedHistory = localStorage.getItem(`symptomHistory_${currentUser}`);

        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setData(parsedData);
            // Sync with global context immediately on load
            updatePatientData({ disease: parsedData.disease, zipCode: parsedData.zipCode });
        } else {
            // Reset for new user if no data found
            const initialData = {
                disease: "",
                zipCode: "",
                symptoms: "",
                symptomDate: new Date().toISOString().split('T')[0],
                medicines: []
            };
            setData(initialData);
            updatePatientData({ disease: "", zipCode: "" });
        }

        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        } else {
            setHistory([]);
        }

        // Clear previous insights when switching user
        setInsights(null);
    }, [currentUser]);

    // Persistence: Save data on change (only if logged in)
    useEffect(() => {
        if (!currentUser) return;
        localStorage.setItem(`patientData_${currentUser}`, JSON.stringify(data));

        // Sync vital info with global context for Ads
        updatePatientData({ disease: data.disease, zipCode: data.zipCode });
    }, [data, currentUser]);

    useEffect(() => {
        if (!currentUser) return;
        localStorage.setItem(`symptomHistory_${currentUser}`, JSON.stringify(history));
    }, [history, currentUser]);

    const handleLogin = (name) => {
        setCurrentUser(name);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleDataChange = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    if (!currentUser) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    const handleSave = () => {
        if (!data.symptoms) return;
        const newEntry = {
            date: data.symptomDate,
            symptoms: data.symptoms
        };
        setHistory(prev => [...prev, newEntry]);
        setData(prev => ({ ...prev, symptoms: "" })); // Clear input
    };

    const handleAnalyze = async () => {
        if (!data.disease && !data.symptoms && data.medicines.length === 0) {
            setError("Please enter some details before analyzing.");
            return;
        }

        setLoading(true);
        setError(null);
        setInsights(null);

        // Grounding: Get last 5 entries from history + current input if any
        // Sort history by date descending to get most recent
        const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
        const recentHistory = sortedHistory.slice(0, 5);

        const payload = {
            ...data,
            recentHistory
        };

        try {
            const response = await fetch('/api/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to fetch insights.");
            }

            const result = await response.json();
            setInsights(result);
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="heading" style={{ margin: 0, fontSize: '1.5rem', color: '#334155' }}>
                    Hello, <span style={{ color: '#0EA5E9' }}>{currentUser}</span>
                </h2>
                <button
                    onClick={handleLogout}
                    className="btn"
                    style={{ backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '0.9rem' }}
                >
                    Switch User
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Top Section: Input & History */}
                <div className="dashboard-top" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <DataEntry data={data} onChange={handleDataChange} onSave={handleSave} />

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                        >
                            {loading ? "Analyzing..." : "Analyze with AI"}
                        </button>
                    </div>

                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        <SymptomHistory history={history} />
                    </div>
                </div>

                {/* Bottom Section: AI Output */}
                <div className="dashboard-bottom">
                    <InsightsViewer insights={insights} isLoading={loading} error={error} />
                </div>

                <style jsx>{`
        @media (max-width: 768px) {
          .dashboard-top {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
            </div>
        </div>
    );
}
