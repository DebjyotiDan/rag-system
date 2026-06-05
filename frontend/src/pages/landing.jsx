import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styels/Landing.css";

const ArrowIcon = () => (
    <svg className="lnd-arrow-icon" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

const TICKER_ITEMS = [
    "Vector Similarity Search", "Hybrid BM25 + Dense Retrieval",
    "AES-256 Encryption", "Multi-modal Document Ingestion",
    "Sub-150ms Latency", "Hallucination Mitigation",
    "Cited Answer Synthesis", "Semantic Chunking",
    "Private Knowledge Isolation", "99.9% Uptime SLA",
];

const FEATURES = [
    {
        icon: "🔍", title: "Hybrid Retrieval Engine",
        desc: "Combines dense vector cosine similarity with classical BM25 keyword scoring for maximum recall precision across all document types.",
        tag: "Core Engine", featured: true
    },
    {
        icon: "📄", title: "Multi-modal Ingestion",
        desc: "Parses PDFs, scanned images via OCR, Word docs, spreadsheets, and raw text while preserving native formatting and table structures.",
        tag: "Ingestion"
    },
    {
        icon: "🧠", title: "Semantic Chunking",
        desc: "Dynamic overlap chunking strategy preserves contextual continuity across paragraph and section boundaries for coherent retrieval.",
        tag: "Processing"
    },
    {
        icon: "📍", title: "Coordinate Citations",
        desc: "Every answer includes exact page number, paragraph index, and source document name — zero ambiguity, full auditability.",
        tag: "Trust Layer"
    },
    {
        icon: "🔒", title: "Document Isolation",
        desc: "Per-tenant vector namespaces with AES-256 encryption at rest. Your data never bleeds across organizational boundaries.",
        tag: "Security"
    },
    {
        icon: "⚡", title: "Real-time Streaming",
        desc: "Token-by-token streaming responses with live source citation injection — users see answers materialise as they are synthesised.",
        tag: "Performance"
    },
];

const STEPS = [
    {
        num: "01", icon: "🗂️", title: "Semantic Parsing",
        desc: "Structural text extraction from complex PDFs, data tables, and image files without losing native formatting context."
    },
    {
        num: "02", icon: "✂️", title: "Chunking & Embedding",
        desc: "Dynamic overlap pipelines project text through high-dimensional mathematical model spaces for maximum semantic fidelity."
    },
    {
        num: "03", icon: "🔎", title: "Hybrid Retrieval",
        desc: "Fuses keyword matching with semantic vector scoring to surface the most contextually precise nodes instantly."
    },
    {
        num: "04", icon: "💬", title: "Cited Synthesis",
        desc: "Precise contextual fragments passed to the LLM layer, ensuring every answer is strictly tethered to your source data."
    },
];

function Landing() {
    const cursorRef = useRef(null);

    /* cursor glow */
    useEffect(() => {
        const el = cursorRef.current;
        if (!el) return;
        const move = (e) => {
            el.style.left = e.clientX + "px";
            el.style.top = e.clientY + "px";
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    /* scroll reveal */
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) e.target.classList.add("lnd-visible");
            }),
            { threshold: 0.08, rootMargin: "0px 0px -36px 0px" }
        );
        document.querySelectorAll(".lnd-reveal").forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    /* navbar shadow on scroll */
    useEffect(() => {
        const nav = document.querySelector(".lnd-navbar-inner");
        if (!nav) return;
        const onScroll = () => {
            nav.style.borderBottomColor = window.scrollY > 20
                ? "rgba(46,124,246,0.22)"
                : "rgba(46,124,246,0.13)";
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="landing-root">
            {/* ── BG LAYERS ─────────────────────────── */}
            <div className="lnd-cursor-glow" ref={cursorRef} />
            <div className="lnd-bg-grid" />
            <div className="lnd-bg-radial" />
            <div className="lnd-bg-radial-br" />

            {/* ══ NAVBAR ════════════════════════════ */}
            <nav className="lnd-navbar">
                <div className="lnd-navbar-inner">
                    <Link to="/" className="lnd-logo">
                        <div className="lnd-logo-mark">R</div>
                        <span className="lnd-logo-text">Rag<span>Matrix</span></span>
                    </Link>

                    <ul className="lnd-nav-links">
                        <li><a href="#how-it-works">Architecture</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#metrics">Metrics</a></li>
                    </ul>

                    <div className="lnd-nav-cta">
                        <Link to="/login" className="lnd-btn lnd-btn-ghost">Sign in</Link>
                        <Link to="/signup" className="lnd-btn lnd-btn-primary">
                            Get Started <ArrowIcon />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ══ HERO ══════════════════════════════ */}
            <header className="lnd-hero">
                <div className="lnd-badge">
                    <span className="lnd-badge-dot" />
                    Next-Gen Semantic Vector Architecture
                </div>

                <h1 className="lnd-h1">
                    Stop Searching.<br />
                    <span className="lnd-gradient-text">Start Interrogating Your Data.</span>
                </h1>

                <p className="lnd-subhead">
                    Professional-grade RAG infrastructure that transforms enterprise PDFs,
                    images, and raw documentation into a private knowledge matrix —
                    with real-time answers backed by exact coordinate citations.
                </p>

                <div className="lnd-hero-actions">
                    <Link to="/signup" className="lnd-btn lnd-btn-primary lnd-btn-xl">
                        Deploy Your First Vector Index <ArrowIcon />
                    </Link>
                    <Link to="/login" className="lnd-btn lnd-btn-secondary lnd-btn-lg">
                        Explore the Sandbox
                    </Link>
                </div>

                <div className="lnd-trust">
                    <span className="lnd-trust-item">
                        <span className="lnd-trust-icon">✓</span> No credit card required
                    </span>
                    <span className="lnd-trust-sep" />
                    <span className="lnd-trust-item">
                        <span className="lnd-trust-icon">✓</span> SOC 2 Type II Ready
                    </span>
                    <span className="lnd-trust-sep" />
                    <span className="lnd-trust-item">
                        <span className="lnd-trust-icon">✓</span> Enterprise SLA
                    </span>
                </div>
            </header>

            {/* ══ TICKER ════════════════════════════ */}
            <div className="lnd-ticker" aria-hidden="true">
                <div className="lnd-ticker-inner">
                    {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                        <span className="lnd-ticker-item" key={i}>
                            <span className="lnd-ticker-sep" />{item}
                        </span>
                    ))}
                </div>
            </div>

            {/* ══ SIMULATION SHOWCASE ═══════════════ */}
            <section className="lnd-showcase" id="demo">
                <div className="lnd-container">
                    <p className="lnd-showcase-label lnd-reveal">Live System Preview</p>

                    <div className="lnd-showcase-card lnd-reveal lnd-d1">
                        <div className="lnd-win-bar">
                            <div className="lnd-win-dots">
                                <span className="lnd-dot-r" />
                                <span className="lnd-dot-y" />
                                <span className="lnd-dot-g" />
                            </div>
                            <div className="lnd-win-addr">rag_engine_telemetry.log</div>
                            <div className="lnd-win-live">
                                <span className="lnd-live-dot" /> LIVE
                            </div>
                        </div>

                        <div className="lnd-showcase-grid">
                            {/* INPUT */}
                            <div className="lnd-sim-input">
                                <div className="lnd-panel-label">Incoming Document Stream</div>
                                <div className="lnd-doc-box">
                                    <span className="lnd-file-tag lnd-tag-pdf">PDF</span>
                                    <div>
                                        <strong className="lnd-doc-name">Q4_Compliance_Audit.pdf</strong>
                                        <span className="lnd-doc-meta">24.8 MB · Encrypted at Rest</span>
                                    </div>
                                </div>
                                <div className="lnd-progress-track">
                                    <div className="lnd-progress-fill" />
                                </div>
                                <div className="lnd-tele">
                                    <code>[INFO] Extracting text nodes... Completed</code>
                                    <code>[INFO] Executing semantic token splitting...</code>
                                    <code className="lnd-active">[INFO] Vectorized into 1,420 dimensional chunks</code>
                                    <code>[INFO] Index committed to namespace: tenant_7a2f</code>
                                </div>
                            </div>

                            {/* OUTPUT */}
                            <div className="lnd-sim-output">
                                <div className="lnd-panel-label">Isolated Retrieval & Synthesis</div>
                                <div className="lnd-bubble lnd-bubble-user">
                                    Are there any compliance anomalies in Section 4?
                                </div>
                                <div className="lnd-bubble lnd-bubble-sys">
                                    <p>Yes. Section 4.2 details an unmitigated key rotation delay
                                        extending past the 90-day protocol limit, placing the system
                                        outside NIST SP 800-57 compliance bounds.</p>
                                    <div className="lnd-cite-pill">
                                        📍 Verified Source: Page 14, §4.2, Paragraph 3
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ METRICS ═══════════════════════════ */}
            <section id="metrics">
                <div className="lnd-metrics">
                    {[
                        { number: "< 140ms", label: "Vector Query Retrieval Latency" },
                        { number: "99.4%", label: "Hallucination Mitigation Score" },
                        { number: "AES-256", label: "Document Isolation Standard" },
                    ].map((m, i) => (
                        <div className="lnd-metric-item lnd-reveal" key={i}>
                            <div className="lnd-metric-num">{m.number}</div>
                            <div className="lnd-metric-label">{m.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="lnd-divider" />

            {/* ══ HOW IT WORKS ══════════════════════ */}
            <section className="lnd-hiw" id="how-it-works">
                <div className="lnd-container">
                    <div className="lnd-hiw-head">
                        <span className="lnd-eyebrow lnd-reveal">Engine Architecture</span>
                        <h2 className="lnd-section-title lnd-reveal lnd-d1">
                            Four Stages from<br />
                            <span className="lnd-gradient-text">Document to Insight</span>
                        </h2>
                        <p className="lnd-section-sub lnd-reveal lnd-d2">
                            A precision-engineered pipeline that ingests raw data and returns
                            verifiable, source-tethered intelligence.
                        </p>
                    </div>

                    <div className="lnd-steps">
                        {STEPS.map((step, i) => (
                            <div className={`lnd-step-card lnd-reveal lnd-d${i + 1}`} key={i}>
                                <div className="lnd-step-icon">{step.icon}</div>
                                <div className="lnd-step-num">{step.num}</div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ FEATURES ══════════════════════════ */}
            <section className="lnd-features lnd-container" id="features">
                <div className="lnd-features-head">
                    <span className="lnd-eyebrow lnd-reveal">Capabilities</span>
                    <h2 className="lnd-section-title lnd-reveal lnd-d1">
                        Every layer built for<br />
                        <span className="lnd-gradient-text">Enterprise Precision</span>
                    </h2>
                    <p className="lnd-section-sub lnd-reveal lnd-d2">
                        Six core primitives that compose into a complete, production-ready
                        retrieval-augmented generation platform.
                    </p>
                </div>

                <div className="lnd-features-grid">
                    {FEATURES.map((f, i) => (
                        <div
                            className={`lnd-feat-card lnd-reveal lnd-d${(i % 3) + 1}${f.featured ? " lnd-featured" : ""}`}
                            key={i}
                        >
                            <div className="lnd-feat-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                            <span className="lnd-feat-tag">{f.tag}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ QUOTE ═════════════════════════════ */}
            <section className="lnd-quote-section">
                <div className="lnd-container">
                    <div className="lnd-quote-card lnd-reveal">
                        <span className="lnd-quote-mark">"</span>
                        <p className="lnd-quote-text">
                            RagMatrix cut our compliance research time by 70%. The citation
                            coordinates mean our legal team can verify every AI-generated answer
                            in seconds — we trust it the way we trust our own analysts.
                        </p>
                        <div className="lnd-quote-author">
                            <div className="lnd-avatar">SK</div>
                            <div>
                                <strong className="lnd-author-name">Sarah Kim</strong>
                                <span className="lnd-author-role">Head of Legal Ops · Meridian Financial Group</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ CTA ═══════════════════════════════ */}
            <section className="lnd-cta">
                <div className="lnd-container">
                    <div className="lnd-cta-box lnd-reveal">
                        <span className="lnd-eyebrow">Ready to deploy</span>
                        <h2 className="lnd-section-title">
                            Your knowledge base.<br />
                            <span className="lnd-gradient-text">Infinitely queryable.</span>
                        </h2>
                        <p className="lnd-cta-desc">
                            Deploy your first vector index in under five minutes. Bring your
                            documents, we handle the infrastructure.
                        </p>
                        <div className="lnd-cta-actions">
                            <Link to="/signup" className="lnd-btn lnd-btn-primary lnd-btn-xl">
                                Start for Free <ArrowIcon />
                            </Link>
                            <Link to="/dashboard" className="lnd-btn lnd-btn-secondary lnd-btn-lg">
                                Go to Dashboard
                            </Link>
                        </div>
                        <p className="lnd-cta-note">
                            No credit card · Free tier includes 10,000 vectors · Upgrade anytime
                        </p>
                    </div>
                </div>
            </section>

            {/* ══ FOOTER ════════════════════════════ */}
            <footer>
                <div className="lnd-footer">
                    <div className="lnd-footer-inner">
                        <Link to="/" className="lnd-logo" style={{ textDecoration: "none" }}>
                            <div className="lnd-logo-mark">R</div>
                            <span className="lnd-logo-text">Rag<span>Matrix</span></span>
                        </Link>
                        <div className="lnd-footer-links">
                            <a href="#how-it-works">Architecture</a>
                            <a href="#features">Features</a>
                            <Link to="/login">Sign In</Link>
                            <Link to="/signup">Sign Up</Link>
                        </div>
                        <p className="lnd-footer-copy">© 2025 RagMatrix. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;