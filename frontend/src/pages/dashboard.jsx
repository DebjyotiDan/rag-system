import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styels/dashboard.css";

const API_BASE = "http://localhost:8000/api";
const AUTH_BASE = "http://localhost:8080/api/v1/auth";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [recentChats, setRecentChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Handle Google OAuth redirect (token comes via URL params)
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token");
        const urlUser = params.get("user");

        if (urlToken) {
            localStorage.setItem("token", urlToken);
            if (urlUser) {
                localStorage.setItem("user", urlUser);
            }
            // Clean up the URL
            window.history.replaceState({}, "", "/dashboard");
        }

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Try to get user from localStorage first
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            fetchUserData(parsed.id);
        } else {
            // Fetch from /me endpoint (fallback)
            fetchMe(token);
        }
    }, [navigate]);

    const fetchMe = async (token) => {
        try {
            const res = await axios.get(`${AUTH_BASE}/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const u = res.data.user;
            setUser(u);
            localStorage.setItem("user", JSON.stringify(u));
            fetchUserData(u.id);
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    const fetchUserData = async (userId) => {
        try {
            const [docsRes, chatsRes] = await Promise.allSettled([
                axios.get(`${API_BASE}/documents/${userId}`),
                axios.get(`${API_BASE}/chats/${userId}`),
            ]);
            if (docsRes.status === "fulfilled") {
                setDocuments(docsRes.value.data.documents || []);
            }
            if (chatsRes.status === "fulfilled") {
                setRecentChats(chatsRes.value.data.chats?.slice(0, 5) || []);
            }
        } catch (err) {
            console.error("Failed to fetch user data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const formatDate = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const truncate = (str, len = 60) =>
        str && str.length > len ? str.slice(0, len) + "…" : str;

    return (
        <div className="dash">
            <nav className="nav">
                <span className="nav-brand">
                    <span className="nav-brand-mark">R</span>
                    Rag<span className="nav-brand-accent">Matrix</span>
                </span>
                <div className="nav-right">
                    {user && (
                        <span className="nav-user">
                            {user.username || user.email}
                        </span>
                    )}
                    <button className="btn-logout" onClick={handleLogout}>
                        Log out
                    </button>
                </div>
            </nav>

            <main className="main">
                <header className="page-header">
                    <h1>Dashboard</h1>
                    <p>
                        {user
                            ? `Welcome back, ${user.username || "User"}`
                            : "Welcome back"}
                    </p>
                </header>

                {/* Quick Action */}
                <div className="chat-card">
                    <div>
                        <h2>Upload & Chat</h2>
                        <p>
                            Upload a PDF to start asking questions with AI-powered retrieval.
                        </p>
                    </div>
                    <Link
                        to="/upload"
                        className="btn-primary"
                        style={{ textDecoration: "none" }}
                    >
                        Upload PDF →
                    </Link>
                </div>

                {/* Documents */}
                <section className="section">
                    <p className="section-title">
                        Your Documents ({documents.length})
                    </p>
                    {loading ? (
                        <div className="empty-state">Loading…</div>
                    ) : documents.length === 0 ? (
                        <div className="empty-state">
                            No documents yet. Upload a PDF to get started.
                        </div>
                    ) : (
                        <div className="doc-list">
                            {documents.map((doc) => (
                                <div
                                    className="doc-item"
                                    key={doc.document_id}
                                    onClick={() =>
                                        navigate(
                                            `/chat?documentId=${encodeURIComponent(doc.document_id)}&fileName=${encodeURIComponent(doc.file_name)}`,
                                            {
                                                state: {
                                                    documentId: doc.document_id,
                                                    fileName: doc.file_name,
                                                },
                                            }
                                        )
                                    }
                                >
                                    <span className="doc-icon">📄</span>
                                    <div className="doc-info">
                                        <p className="doc-name">
                                            {doc.file_name}
                                        </p>
                                        <p className="doc-date">
                                            {formatDate(doc.created_at)}
                                        </p>
                                    </div>
                                    <span className="doc-arrow">→</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent Chats */}
                {recentChats.length > 0 && (
                    <section className="section">
                        <p className="section-title">Recent Queries</p>
                        <div className="chat-list">
                            {recentChats.map((chat, i) => (
                                <div className="chat-item" key={i}>
                                    <span className="chat-q-icon">Q</span>
                                    <div className="chat-item-body">
                                        <p className="chat-question">
                                            {truncate(chat.question)}
                                        </p>
                                        <p className="chat-answer">
                                            {truncate(chat.answer, 80)}
                                        </p>
                                    </div>
                                    <span className="chat-time">
                                        {formatDate(chat.created_at)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default Dashboard;