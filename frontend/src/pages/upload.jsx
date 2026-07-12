import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styels/upload.css";

const API_BASE = "http://localhost:8000/api";

function Upload() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState("");
    const [error, setError] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        const parsed = JSON.parse(storedUser);
        setUserId(parsed.id);
    }, [navigate]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const validateFile = (f) => {
        if (!f) return "No file selected.";
        if (f.type !== "application/pdf") return "Only PDF files are accepted.";
        if (f.size > 50 * 1024 * 1024) return "File must be under 50 MB.";
        return null;
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const droppedFile = e.dataTransfer.files[0];
        const err = validateFile(droppedFile);
        if (err) { setError(err); return; }
        setFile(droppedFile);
        setError("");
    }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        const err = validateFile(selected);
        if (err) { setError(err); return; }
        setFile(selected);
        setError("");
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    const handleUpload = async () => {
        if (!file || !userId) return;

        setUploading(true);
        setProgress(0);
        setStage("Uploading PDF...");
        setError("");

        const documentId = file.name.replace(/\.pdf$/i, "") + "_" + Date.now().toString(36);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("document_id", documentId);
        formData.append("user_id", userId);

        try {
            setStage("Uploading & processing...");
            await axios.post(`${API_BASE}/ingest`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (e) => {
                    const pct = Math.round((e.loaded * 100) / e.total);
                    setProgress(Math.min(pct, 95));
                    if (pct < 30) setStage("Uploading PDF...");
                    else if (pct < 60) setStage("Extracting text & chunking...");
                    else if (pct < 90) setStage("Generating embeddings...");
                    else setStage("Storing in vector database...");
                },
            });

            setProgress(100);
            setStage("Done! Redirecting to chat...");

            setTimeout(() => {
                navigate(
                    `/chat?documentId=${encodeURIComponent(documentId)}&fileName=${encodeURIComponent(file.name)}`,
                    {
                        state: {
                            documentId,
                            fileName: file.name,
                        },
                    }
                );
            }, 800);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.detail || "Upload failed. Please try again."
            );
            setUploading(false);
            setProgress(0);
            setStage("");
        }
    };

    const removeFile = () => {
        setFile(null);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="upl-root">
            {/* BG effects */}
            <div className="upl-bg-grid" />
            <div className="upl-bg-glow-top" />
            <div className="upl-bg-glow-bottom" />

            {/* Nav */}
            <nav className="upl-nav">
                <Link to="/dashboard" className="upl-nav-back">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Dashboard
                </Link>
                <span className="upl-nav-brand">
                    <span className="upl-brand-mark">R</span>
                    Rag<span className="upl-brand-accent">Matrix</span>
                </span>
            </nav>

            {/* Main */}
            <main className="upl-main">
                <div className="upl-header">
                    <div className="upl-badge">
                        <span className="upl-badge-dot" />
                        Document Ingestion Pipeline
                    </div>
                    <h1 className="upl-title">
                        Upload Your <span className="upl-gradient-text">PDF Document</span>
                    </h1>
                    <p className="upl-subtitle">
                        Your document will be parsed, chunked, and embedded into a private
                        vector index — ready for semantic retrieval in seconds.
                    </p>
                </div>

                {/* Upload Card */}
                <div className="upl-card">
                    {!file && !uploading && (
                        <div
                            className={`upl-dropzone ${dragActive ? "upl-dropzone-active" : ""}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="upl-file-input"
                            />
                            <div className="upl-drop-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </div>
                            <p className="upl-drop-title">
                                Drop your PDF here or <span className="upl-drop-link">browse</span>
                            </p>
                            <p className="upl-drop-hint">PDF files up to 50 MB</p>
                        </div>
                    )}

                    {file && !uploading && (
                        <div className="upl-file-preview">
                            <div className="upl-file-icon">📄</div>
                            <div className="upl-file-info">
                                <p className="upl-file-name">{file.name}</p>
                                <p className="upl-file-size">{formatSize(file.size)}</p>
                            </div>
                            <button className="upl-file-remove" onClick={removeFile}
                                title="Remove file">
                                ✕
                            </button>
                        </div>
                    )}

                    {uploading && (
                        <div className="upl-progress-container">
                            <div className="upl-progress-icon">
                                {progress < 100 ? (
                                    <div className="upl-spinner" />
                                ) : (
                                    <div className="upl-check">✓</div>
                                )}
                            </div>
                            <p className="upl-progress-stage">{stage}</p>
                            <div className="upl-progress-bar">
                                <div
                                    className="upl-progress-fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="upl-progress-pct">{progress}%</p>
                        </div>
                    )}

                    {error && (
                        <div className="upl-error">
                            <span className="upl-error-icon">⚠</span> {error}
                        </div>
                    )}

                    {file && !uploading && (
                        <button className="upl-submit" onClick={handleUpload}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                            Process &amp; Start Chat
                        </button>
                    )}
                </div>

                {/* Pipeline steps */}
                <div className="upl-pipeline">
                    {[
                        { icon: "📄", label: "Parse PDF", desc: "Text extraction" },
                        { icon: "✂️", label: "Chunk", desc: "Semantic splitting" },
                        { icon: "🧠", label: "Embed", desc: "Vector encoding" },
                        { icon: "💾", label: "Store", desc: "Supabase pgvector" },
                    ].map((step, i) => (
                        <div className="upl-pipe-step" key={i}>
                            <div className="upl-pipe-icon">{step.icon}</div>
                            <p className="upl-pipe-label">{step.label}</p>
                            <p className="upl-pipe-desc">{step.desc}</p>
                            {i < 3 && <div className="upl-pipe-arrow">→</div>}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Upload;
