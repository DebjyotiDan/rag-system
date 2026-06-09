import {
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";

import { FcGoogle } from "react-icons/fc";
import Navbar from "../Components/navbar";
import { useState } from "react";
import axios from "axios";
import "../index.css";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        console.log("Login button clicked");

        try {

            const res = await axios.post(
                "http://localhost:8080/api/v1/auth/login",
                formData
            );

            console.log(res.data);

            localStorage.setItem(
                "token",
                res.data.token
            );

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div>

            <Navbar />

            <div className="container">

                <div className="form-card">

                    {
                        location.state?.message && (
                            <p className="success-message">
                                {location.state.message}
                            </p>
                        )
                    }

                    <h2>Welcome Back</h2>

                    <p className="subtitle">
                        Login to continue
                    </p>

                    <button
                        type="button"
                        className="google-btn"
                        onClick={() => {
                            window.location.href =
                                "http://localhost:8080/api/v1/auth/google";
                        }}
                    >
                        <FcGoogle className="google-icon" />
                        Continue with Google
                    </button>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <div className="input-group">

                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="input-group">

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />

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

                    <button
                        type="button"
                        className="submit-btn"
                        onClick={handleSubmit}
                    >
                        Login
                    </button>

                    <p className="footer-text">

                        Don't have an account?{" "}

                        <Link to="/signup">
                            Sign Up
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;