import { Link } from "react-router-dom";
import Navbar from "../Components/navbar";

function Landing() {
    return (
        <>
            <Navbar />

            <div className="landing-wrapper">
                { }
                <div className="light-glow glow-top"></div>
                <div className="light-glow glow-bottom"></div>

                { }
                <div className="landing-hero">
                    <div className="landing-badge">
                        <span className="badge-dot"></span>
                        AI-Powered Document Assistant
                    </div>

                    <h1 className="landing-title">
                        Unlock the Knowledge <br />
                        <span className="blue-gradient-text">Hidden in Your Files</span>
                    </h1>

                    <p className="landing-subtitle">
                        Upload your documents and chat with them in real-time.
                        Get instant, accurate answers backed by direct citations from your text.
                    </p>

                    <div className="landing-buttons">
                        <Link to="/signup" className="btn-primary-blue">
                            Get Started Free
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <Link to="/login" className="btn-secondary-blue">
                            Sign In
                        </Link>
                    </div>
                </div>

                { }
                <div className="landing-cards">
                    <div className="landing-card">
                        <div className="card-icon bg-light-blue">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>
                        <h3>1. Upload</h3>
                        <p>Drag and drop PDFs or documents. Our system extracts and structures your text instantly.</p>
                    </div>

                    <div className="landing-card">
                        <div className="card-icon bg-light-indigo">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                <polyline points="2 17 12 22 22 17"></polyline>
                                <polyline points="2 12 12 17 22 12"></polyline>
                            </svg>
                        </div>
                        <h3>2. Index</h3>
                        <p>Advanced embedding models index your files semantically for fast, high-accuracy lookup.</p>
                    </div>

                    <div className="landing-card">
                        <div className="card-icon bg-light-cyan">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <h3>3. Chat</h3>
                        <p>Ask natural language questions and receive precise responses complete with source footnotes.</p>
                    </div>
                </div>

                { }
                <div className="landing-mockup-wrapper">
                    <div className="landing-mockup-frame">
                        <div className="mockup-header">
                            <span className="dot red"></span>
                            <span className="dot yellow"></span>
                            <span className="dot green"></span>
                            <span className="mockup-title">RAG Assistant Dashboard</span>
                        </div>
                        <div className="mockup-body">
                            <div className="mockup-sidebar">
                                <div className="sidebar-item active">
                                    <span className="doc-icon">📁</span>
                                    Financial_Report.pdf
                                </div>
                                <div className="sidebar-item">
                                    <span className="doc-icon">📁</span>
                                    Product_Specs.txt
                                </div>
                            </div>
                            <div className="mockup-content">
                                <div className="chat-bubble user">
                                    What was last quarter's revenue growth?
                                </div>
                                <div className="chat-bubble assistant">
                                    Last quarter's revenue grew by <strong>24% year-over-year</strong> to $4.2B, driven by high product margins.
                                    <span className="citation">Source: Financial_Report.pdf (Page 4)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Landing;
