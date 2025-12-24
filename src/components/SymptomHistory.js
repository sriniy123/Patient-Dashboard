"use strict";

export default function SymptomHistory({ history }) {
    if (!history || history.length === 0) {
        return null;
    }

    // Ensure chronological order (oldest first? or newest first? User said "chronological order at the bottom")
    // Usually chronological means oldest -> newest. But log usually shows newest at top or bottom.
    // "list the symptoms in chronological order at the bottom" implies a growing list.
    // I will sort by date.

    // Sort by date descending (newest first) to easily take the top 5
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    const visibleHistory = sortedHistory.slice(0, 5);

    return (
        <div className="card animate-fade-in" style={{ marginTop: '2rem' }}>
            <h3 className="heading" style={{ fontSize: '1.25rem' }}>Symptom History</h3>
            <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #E2E8F0',
                borderRadius: '0.5rem',
                backgroundColor: '#F8FAFC'
            }}>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                    {visibleHistory.map((entry, idx) => (
                        <li key={idx} style={{
                            padding: '1rem',
                            borderBottom: idx < sortedHistory.length - 1 ? '1px solid #E2E8F0' : 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem'
                        }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>
                                {entry.date}
                            </span>
                            <span style={{ color: '#334155' }}>
                                {entry.symptoms}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
