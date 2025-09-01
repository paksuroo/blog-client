import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import BlogDetail from "./pages/BlogDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function AppWrapper() {
    const location = useLocation();

    const authPages = ["/login", "/register"];
    const isAuthPage = authPages.includes(location.pathname);
    const isHomePage = location.pathname === "/";
    const isBlogDetailPage = location.pathname.startsWith("/blog/");

    useEffect(() => {
        document.body.classList.remove(
            "auth-background",
            "home-background",
            "blogdetail-background",
            "createblog-background",
            "editblog-background",
            "dashboard-background"
        );

        if (isAuthPage) {
            document.body.classList.add("auth-background");
        } else if (isHomePage) {
            document.body.classList.add("home-background");
        } else if (isBlogDetailPage) {
            document.body.classList.add("blogdetail-background");
        } else if (location.pathname === "/create-blog") {
            document.body.classList.add("createblog-background");
        } else if (location.pathname.startsWith("/edit-blog/")) {
            document.body.classList.add("editblog-background");
        } else if (location.pathname === "/dashboard") {
            document.body.classList.add("dashboard-background");
        }

        const navbar = document.querySelector(".navbar");
        if (navbar) {
            navbar.classList.add("transparent-navbar");
            navbar.classList.remove("solid-navbar");
        }

        return () => {
            document.body.classList.remove(
                "auth-background",
                "home-background",
                "blogdetail-background",
                "createblog-background",
                "editblog-background",
                "dashboard-background"
            );
        };
    }, [isAuthPage, isHomePage, isBlogDetailPage, location.pathname]);

    return (
        <>
            <Navbar />
            {isAuthPage ? (
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            ) : (
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div className="container mt-4">
                                <Home />
                            </div>
                        }
                    />
                    <Route
                        path="/create-blog"
                        element={
                            <div className="container mt-4">
                                <CreateBlog />
                            </div>
                        }
                    />
                    <Route
                        path="/edit-blog/:id"
                        element={
                            <div className="container mt-4">
                                <EditBlog />
                            </div>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <div className="container mt-4">
                                <Dashboard />
                            </div>
                        }
                    />

                    <Route path="/blog/:id" element={<BlogDetail />} />
                </Routes>
            )}
        </>
    );
}

function App() {
    return (
        <Router>
            <AppWrapper />
        </Router>
    );
}

export default App;
