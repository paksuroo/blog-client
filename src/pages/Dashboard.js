import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Dashboard() {
    const [blogs, setBlogs] = useState([]);
    const [stats, setStats] = useState({
        totalBlogs: 0,
        myBlogs: 0,
        totalComments: 0,
    });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        document.body.classList.add("dashboard-background");

        return () => {
            document.body.classList.remove("dashboard-background");
        };
    }, [user, navigate]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch("http://localhost:4000/blogs/getBlogs");
                const data = await res.json();
                setBlogs(data);

                const myBlogsCount = data.filter(
                    (blog) => blog.author?._id === user.id
                ).length;
                setStats({
                    totalBlogs: data.length,
                    myBlogs: myBlogsCount,
                    totalComments: data.reduce(
                        (acc, blog) => acc + (blog.commentsCount || 0),
                        0
                    ),
                });
            } catch (err) {
                console.error(err);
            }
        };

        if (user) {
            fetchBlogs();
        }
    }, [user]);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will delete the blog permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            background: "rgba(255, 255, 255, 0.9)",
            customClass: { popup: "glass-popup" },
        });

        if (confirm.isConfirmed) {
            try {
                const res = await fetch(
                    `http://localhost:4000/blogs/deleteBlog/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();

                if (res.ok) {
                    Swal.fire("Deleted!", data.message, "success");
                    setBlogs(blogs.filter((blog) => blog._id !== id));
                    // Update stats
                    setStats((prev) => ({
                        ...prev,
                        totalBlogs: prev.totalBlogs - 1,
                        myBlogs:
                            user.id ===
                            blogs.find((b) => b._id === id)?.author?._id
                                ? prev.myBlogs - 1
                                : prev.myBlogs,
                    }));
                } else {
                    Swal.fire(
                        "Error",
                        data.message || "Delete failed",
                        "error"
                    );
                }
            } catch (error) {
                Swal.fire("Error", error.message, "error");
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div className="glass-container text-center mb-5 dashboard-header">
                <h1 className="glass-title">Admin Dashboard</h1>
                <p className="glass-subtitle">
                    Manage your blog content and track performance
                </p>
            </div>

            <div className="row mb-5">
                <div className="col-md-4 mb-3">
                    <div className="glass-card stats-card text-center">
                        <h3 className="stats-number">{stats.totalBlogs}</h3>
                        <p className="stats-label">Total Blogs</p>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="glass-card stats-card text-center">
                        <h3 className="stats-number">{stats.myBlogs}</h3>
                        <p className="stats-label">My Blogs</p>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="glass-card stats-card text-center">
                        <h3 className="stats-number">{stats.totalComments}</h3>
                        <p className="stats-label">Total Comments</p>
                    </div>
                </div>
            </div>

            <div className="glass-container p-4">
                <h2 className="glass-title mb-4">All Blogs</h2>
                {blogs.length === 0 ? (
                    <p className="glass-text-content text-center py-4">
                        No blogs available.
                    </p>
                ) : (
                    blogs.map((blog) => {
                        const isAuthor = user?.id === blog.author?._id;
                        const isAdmin = user?.isAdmin;

                        return (
                            <div
                                key={blog._id}
                                className="glass-card blog-card mb-4"
                            >
                                <div className="card-body">
                                    <h5 className="card-title dashboard-blog-title">
                                        {blog.title}
                                    </h5>
                                    <p className="card-subtitle mb-2 text-muted">
                                        By: {blog.author?.username || "Unknown"}{" "}
                                        •{" "}
                                        {new Date(
                                            blog.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                    <p className="card-text dashboard-blog-content">
                                        {blog.content.substring(0, 150)}...
                                    </p>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <button
                                            className="glass-btn-primary btn-sm"
                                            onClick={() =>
                                                navigate(`/blog/${blog._id}`)
                                            }
                                        >
                                            View
                                        </button>

                                        <div>
                                            {isAuthor && (
                                                <button
                                                    className="glass-btn-primary btn-sm me-2"
                                                    onClick={() =>
                                                        navigate(
                                                            `/edit-blog/${blog._id}`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                            )}

                                            {(isAuthor || isAdmin) && (
                                                <button
                                                    className="glass-btn-primary btn-sm"
                                                    onClick={() =>
                                                        handleDelete(blog._id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
