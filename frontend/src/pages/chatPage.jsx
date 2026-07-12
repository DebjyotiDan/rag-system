import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../styels/chatPage.css";

const API_BASE = "http://localhost:8000/api";

function ChatPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Resolve documentId & fileName from: location.state → URL params → sessionStorage
    const resolveParam = (key) => {
        return (
            location.state?.[key] ||
            searchParams.get(key) ||
            sessionStorage.getItem(`chat_${key}`) ||
            null
        );
    };

    const documentId = resolveParam("documentId");
    const fileName = resolveParam("fileName") || "Document";

    const [userId, setUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Persist to sessionStorage and URL params so they survive refresh / back-nav
        if (documentId) {
            sessionStorage.setItem("chat_documentId", documentId);
            sessionStorage.setItem("chat_fileName", fileName);
            // Sync to URL so refresh works
            if (!searchParams.get("documentId")) {
                setSearchParams({ documentId, fileName }, { replace: true });
            }
        }

        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        const parsed = JSON.parse(storedUser);
        setUserId(parsed.id);

        if (!documentId) {
            navigate("/upload");
            return;
        }

        // Load existing chat history for this document
        loadChatHistory(parsed.id, documentId);
    }, [documentId, navigate]);

    const loadChatHistory = async (uid, docId) => {
        try {
            const res = await axios.get(
                `${API_BASE}/chats/${uid}?document_id=${docId}`
            );
            const chats = res.data.chats || [];

            if (chats.length > 0) {
                const existingMessages = [];
                chats.forEach((chat) => {
                    existingMessages.push({
                        role: "user",
                        content: chat.question,
                    });
                    existingMessages.push({
                        role: "assistant",
                        content: chat.answer,
                    });
                });
                setMessages([
                    {
                        role: "assistant",
                        content: `I've ingested **${fileName}**. Here's your previous conversation. Feel free to continue asking questions.`,
                    },
                    ...existingMessages,
                ]);
            } else {
                setMessages([
                    {
                        role: "assistant",
                        content: `I've ingested **${fileName}**. Ask me anything about your document — I'll retrieve the most relevant sections and provide cited answers.`,
                    },
                ]);
            }
        } catch {
            setMessages([
                {
                    role: "assistant",
                    content: `I've ingested **${fileName}**. Ask me anything about your document — I'll retrieve the most relevant sections and provide cited answers.`,
                },
            ]);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [loading]);

    const sendMessage = async () => {
        const query = input.trim();
        if (!query || loading || !userId) return;

        const userMsg = { role: "user", content: query };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post(`${API_BASE}/chat`, {
                question: query,
                document_id: documentId,
                user_id: userId,
            });

            const answer = res.data.answer || "I could not find this in the document.";
            const assistantMsg = { role: "assistant", content: answer };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch (err) {
            console.error(err);
            const errContent =
                err.response?.status === 403
                    ? "⚠ You don't have access to this document."
                    : "⚠ Something went wrong. Please try again.";
            const errMsg = {
                role: "assistant",
                content: errContent,
            };
            setMessages((prev) => [...prev, errMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const startNewChat = () => {
        navigate("/upload");
    };

    return (
        <div className="cht-root">
            {/* BG */}
            <div className="cht-bg-grid" />
            <div className="cht-bg-glow" />

            {/* Sidebar */}
            <aside className="cht-sidebar">
                <Link to="/dashboard" className="cht-sidebar-brand">
                    <span className="cht-brand-mark">R</span>
                    <span className="cht-brand-text">Rag<span>Matrix</span></span>
                </Link>

                <button className="cht-new-chat" onClick={startNewChat}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New Chat
                </button>

                <div className="cht-sidebar-doc">
                    <div className="cht-doc-badge">📄</div>
                    <div className="cht-doc-info">
                        <p className="cht-doc-name" title={fileName}>{fileName}</p>
                        <p className="cht-doc-id">ID: {documentId?.slice(0, 16)}…</p>
                    </div>
                </div>

                <div className="cht-sidebar-footer">
                    <Link to="/dashboard" className="cht-sidebar-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Dashboard
                    </Link>
                </div>
            </aside>

            {/* Main Chat */}
            <main className="cht-main">
                {/* Header */}
                <header className="cht-header">
                    <div className="cht-header-left">
                        <div className="cht-header-dot" />
                        <span className="cht-header-title">Chat with {fileName}</span>
                    </div>
                    <div className="cht-header-right">
                        <span className="cht-header-badge">RAG Enabled</span>
                        <span className="cht-header-badge cht-header-badge-green">Vector Search</span>
                    </div>
                </header>

                {/* Messages */}
                <div className="cht-messages">
                    {messages.map((msg, i) => (
                        <div
                            className={`cht-msg ${msg.role === "user" ? "cht-msg-user" : "cht-msg-assistant"}`}
                            key={i}
                        >
                            <div className="cht-msg-avatar">
                                {msg.role === "user" ? "You" : "AI"}
                            </div>
                            <div className="cht-msg-body">
                                <p className="cht-msg-role">
                                    {msg.role === "user" ? "You" : "RagMatrix AI"}
                                </p>
                                <div className="cht-msg-content">{msg.content}</div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="cht-msg cht-msg-assistant">
                            <div className="cht-msg-avatar">AI</div>
                            <div className="cht-msg-body">
                                <p className="cht-msg-role">RagMatrix AI</p>
                                <div className="cht-typing">
                                    <span /><span /><span />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="cht-input-area">
                    <div className="cht-input-wrapper">
                        <textarea
                            ref={inputRef}
                            className="cht-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask a question about your document..."
                            rows={1}
                            disabled={loading}
                        />
                        <button
                            className="cht-send-btn"
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            title="Send message"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                                strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                    <p className="cht-disclaimer">
                        Answers are generated from your document using RAG. Always verify important information.
                    </p>
                </div>
            </main>
        </div>
    );
}

export default ChatPage;
