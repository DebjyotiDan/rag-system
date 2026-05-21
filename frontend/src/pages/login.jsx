import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../Components/navbar";


function Login() {
    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="form-card">

                    <h2>Welcome Back</h2>
                    <p className="subtitle">
                        Login to continue
                    </p>

                    <button className="google-btn">
                        <FcGoogle className="google-icon" />
                        Continue with Google
                    </button>
                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" />
                    </div>

                    <div className="options">
                        <label>
                            <input type="checkbox" />
                            <span> Remember me</span>
                        </label>

                        <a href="#" className="forgot-pass">
                            Forgot Password?
                        </a>
                    </div>

                    <button className="submit-btn">
                        Login
                    </button>

                    <p className="footer-text">
                        Don't have an account?{" "}
                        <Link to="/signup"><a href="">Sign Up</a></Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Login;