import { Link } from "react-router-dom";
import Navbar from "../Components/navbar";

function Landing() {
    return (
        <>
            <Navbar />

            <div className="home-container">

                <h1>RAG System</h1>

                <div className="home-buttons">

                    <Link to="/login">
                        <button>Login</button>
                    </Link>

                    <Link to="/signup">
                        <button>Sign Up</button>
                    </Link>

                </div>

            </div>
        </>
    );
}

export default Landing;