import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, logout",
            cancelButtonText: "Cancel",
            background: "rgba(255, 255, 255, 0.9)",
            customClass: { popup: "glass-popup" },
        });

        if (result.isConfirmed) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            Swal.fire(
                "Logged Out",
                "You have been logged out successfully.",
                "success"
            );
            navigate("/login");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg transparent-navbar">
            <div className="container">
                <NavLink to="/" className="navbar-brand">
                    ✒️ Ink
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        {user ? (
                            <>
                                <li className="nav-item me-2">
                                    <span className="nav-link username">
                                        👋 Hi, {user.username || "User"}
                                    </span>
                                </li>

                                <li className="nav-item me-2">
                                    <NavLink
                                        to="/create-blog"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "nav-link current-page"
                                                : "nav-link"
                                        }
                                    >
                                        Create
                                    </NavLink>
                                </li>

                                {user.isAdmin && (
                                    <li className="nav-item me-2">
                                        <NavLink
                                            to="/dashboard"
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "nav-link current-page"
                                                    : "nav-link"
                                            }
                                        >
                                            📊 Dashboard
                                        </NavLink>
                                    </li>
                                )}

                                <li className="nav-item">
                                    <button
                                        className="btn btn-logout"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item me-2">
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "nav-link current-page"
                                                : "nav-link"
                                        }
                                    >
                                        Login
                                    </NavLink>
                                </li>

                                <li className="nav-item">
                                    <NavLink
                                        to="/register"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "nav-link current-page"
                                                : "nav-link"
                                        }
                                    >
                                        Register
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
