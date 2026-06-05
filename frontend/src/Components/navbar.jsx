import { Link } from "react-router-dom";
import "../styels/Landing.css";

function Navbar() {
    return (
        <nav className="lnd-navbar">
            <div className="lnd-navbar-inner">

                <Link to="/" className="lnd-logo">
                    <div className="lnd-logo-mark">R</div>
                    <span className="lnd-logo-text">Rag<span>Matrix</span></span>
                </Link>

                <div className="lnd-nav-cta">
                    <Link to="/" className="lnd-btn lnd-btn-ghost">Home</Link>
                    <Link to="/login" className="lnd-btn lnd-btn-ghost">Login</Link>
                    <Link to="/signup" className="lnd-btn lnd-btn-ghost">
                        Sign Up
                        <svg className="lnd-arrow-icon" width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;