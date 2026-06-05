import { Link } from "react-router-dom";
import "../styels/dashboard.css";

const stats = [
    { label: "Documents", value: "", icon: "📄" },
    { label: "Queries Today", value: "", icon: "🔍" },
    { label: "Avg. Relevance", value: "", icon: "🎯" },
    { label: "Index Status", value: "", icon: "✅" },
];

const activity = [
    { text: "" },
    { text: "" },
    { text: "" },
];

function Dashboard() {
    return (
        <div className="dash">
            <nav className="nav">
                <span className="nav-brand"> RAG System</span>
                <Link to="/login">
                    <button className="btn-ghost">⏻ Log out</button>
                </Link>
            </nav>

            <main className="main">
                <header className="page-header">
                    <h1>Dashboard</h1>
                    <p>Welcome back — your knowledge base is ready.</p>
                </header>

                <div className="stats-grid">
                    {stats.map((s) => (
                        <div className="stat-card" key={s.label}>
                            <span className="stat-icon">{s.icon}</span>
                            <p className="stat-value">{s.value}</p>
                            <p className="stat-label">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="chat-card">
                    <div>
                        <h2>Ask your knowledge base</h2>
                        <p>Query across all indexed documents with semantic search and cited retrieval.</p>
                    </div>
                    <button className="btn-primary">Start Chat →</button>
                </div>

                <section className="activity-section">
                    <p className="section-title">Recent Activity</p>
                    <ul className="activity-list">
                        {activity.map((a, i) => (
                            <li key={i} className="activity-item">
                                <span className="activity-dot" />
                                <span className="activity-text">{a.text}</span>
                                <span className="activity-time">{a.time}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;