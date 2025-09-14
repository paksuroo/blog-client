import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !event.target.classList.contains("navbar-toggler") &&
                !event.target.closest(".navbar-toggler")
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav
            className="navbar navbar-expand-lg transparent-navbar"
            ref={menuRef}
        >
            <div className="container">
                <NavLink to="/" className="navbar-brand">
                    ✒️ Pluma
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className={`collapse navbar-collapse ${
                        isMenuOpen ? "show" : ""
                    }`}
                    id="navbarNav"
                >
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
                                        onClick={() => setIsMenuOpen(false)}
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
                                            onClick={() => setIsMenuOpen(false)}
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
                                        onClick={() => setIsMenuOpen(false)}
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
                                        onClick={() => setIsMenuOpen(false)}
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
