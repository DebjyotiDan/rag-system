import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../Components/navbar";
import { useState } from "react";
import axios from "axios";
import "../index.css";

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
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

        console.log("Register button clicked");

        try {

            const res = await axios.post(
                "http://localhost:8080/api/v1/auth/register",
                formData
            );

            console.log(res.data);

            navigate("/login", {
                state: {
                    message:
                        "Registration successful! Please login.",
                },
            });

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div className="auth-page-wrapper">

            <Navbar />

            <div className="container">

                <div className="form-card">

                    <h2>Create Account</h2>

                    <p className="subtitle">
                        Sign up to get started
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

                        <label>Name</label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your name"
                            value={formData.username}
                            onChange={handleChange}
                        />

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
                            placeholder="Create password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        type="button"
                        className="submit-btn"
                        onClick={handleSubmit}
                    >
                        Create Account
                    </button>

                    <p className="footer-text">

                        Already have an account?{" "}

                        <Link to="/login">
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
}

export default Signup;