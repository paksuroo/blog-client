import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/users/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                Swal.fire({
                    icon: "success",
                    title: "Login Successful!",
                    text: `Welcome, ${data.user.username}`,
                });
                navigate("/");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: data.message,
                });
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: error.message });
        }
    };

    return (
        <div className="auth-page">
            <div className="glass-container auth-card text-white">
                <h2 className="text-center mb-4 glass-title">🔑 Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label glass-text-secondary">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-control glass-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label glass-text-secondary">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="form-control glass-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-login w-100">
                        Login
                    </button>
                </form>
                <p className="mt-3 text-center glass-text-muted">
                    Don’t have an account?{" "}
                    <Link to="/register" className="auth-link">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
