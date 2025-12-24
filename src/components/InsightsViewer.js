"use strict";
import { useState } from 'react';

export default function InsightsViewer({ insights, isLoading, error }) {
    if (isLoading) {
        return (
            <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                <p className="text-muted">Analyzing data with AI...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card animate-fade-in" style={{ borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }}>
                <h3 className="heading" style={{ color: '#DC2626' }}>Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!insights) {
        return (
            <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '3rem', opacity: 0.7 }}>
                <p className="text-muted">Enter your details and click "Analyze" to see insights.</p>
            </div>
        );
    }

    const [activeTab, setActiveTab] = useState('forums');

    const Citation = ({ sources }) => {
        if (!sources || sources.length === 0) return null;
        return (
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#64748B' }}>
                <strong>Sources:</strong> {sources.join(', ')}
            </div>
        );
    };

    const tabs = [
        { id: 'forums', label: 'Forums Analysis', color: '#0EA5E9' },
        { id: 'sideEffects', label: 'Side Effects', color: '#F59E0B' },
        { id: 'advancements', label: 'Advancements', color: '#10B981' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'forums':
                return (
                    <div className="card animate-fade-in" style={{ borderTop: `4px solid #0EA5E9` }}>
                        <h3 className="heading">Patient Forum Analysis</h3>
                        <p style={{ whiteSpace: 'pre-line' }}>{insights.forums.text || insights.forums}</p>
                        <Citation sources={insights.forums.sources} />
                    </div>
                );
            case 'sideEffects':
                return (
                    <div className="card animate-fade-in" style={{ borderTop: `4px solid #F59E0B` }}>
                        <h3 className="heading">Manufacturer Side Effects</h3>
                        <p style={{ whiteSpace: 'pre-line' }}>{insights.sideEffects.text || insights.sideEffects}</p>
                        <Citation sources={insights.sideEffects.sources} />
                    </div>
                );
            case 'advancements':
                const advancements = insights.advancements;
                // Handle legacy text format or new array format
                if (typeof advancements === 'string' || !Array.isArray(advancements)) {
                    return (
                        <div className="card animate-fade-in" style={{ borderTop: `4px solid #10B981` }}>
                            <h3 className="heading">Latest Advancements</h3>
                            <p style={{ whiteSpace: 'pre-line' }}>{advancements.text || advancements}</p>
                            <Citation sources={advancements.sources} />
                        </div>
                    );
                }

                // Render structured list
                return (
                    <div className="animate-fade-in">
                        {advancements.map((item, idx) => (
                            <div key={idx} className="card" style={{ marginBottom: '1rem', borderTop: `4px solid #10B981` }}>
                                <h3 className="heading" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.drugName}</h3>
                                <div style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1rem' }}>
                                    <strong>Manufacturer:</strong> {item.manufacturer}
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#334155' }}>Phase 3 Clinical Trial Results:</div>
                                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>{item.phase3Results}</p>
                                </div>
                                <Citation sources={item.sources} />
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            backgroundColor: activeTab === tab.id ? tab.color : '#E2E8F0',
                            color: activeTab === tab.id ? 'white' : '#475569',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            {renderContent()}
        </div>
    );
}
