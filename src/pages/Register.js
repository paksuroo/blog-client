import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:4000/users/register",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Registered Successfully!",
                    text: data.message,
                });
                navigate("/login");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: data.message || "Something went wrong",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
            });
        }
    };

    return (
        <div className="auth-page">
            <div className="glass-container auth-card text-white">
                <h2 className="text-center mb-4 glass-title">📝 Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label glass-text-secondary">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            className="form-control glass-input"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

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

                    <button type="submit" className="btn btn-register w-100">
                        Register
                    </button>
                </form>
                <p className="mt-3 text-center glass-text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="auth-link">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
