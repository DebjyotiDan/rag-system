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
        const nav = document.querySelector(".lnd-navbar");
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
                        Start Chatting <ArrowIcon />
                    </Link>
                </div>
            </header>

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