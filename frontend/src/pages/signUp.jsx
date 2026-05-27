import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../Components/navbar";

function Signup() {
    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="form-card">

                    <h2>Create Account</h2>

                    <p className="subtitle">
                        Sign up to get started
                    </p>

                    <button className="google-btn">
                        <FcGoogle className="google-icon" />
                        Continue with Google
                    </button>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <div className="input-group">
                        <label>Name</label>
                        <input type="text" placeholder="Enter your name" />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" placeholder="Create password" />
                    </div>

                    <button className="submit-btn">
                        Create Account
                    </button>

                    <p className="footer-text">
                        Already have an account?{" "}
                        <Link to="/login">Login</Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Signup;