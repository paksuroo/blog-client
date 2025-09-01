import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    useEffect(() => {
        document.body.classList.add("blogdetail-background");
        fetchBlog();
        fetchComments();
        return () => document.body.classList.remove("blogdetail-background");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchBlog = async () => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/blogs/getBlog/${id}`
            );
            if (!res.ok) throw new Error("Failed to fetch blog");
            const data = await res.json();
            setBlog(data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Could not load the blog post.", "error");
        }
    };

    const fetchComments = async () => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/comments/getComments/${id}`
            );
            if (!res.ok) throw new Error("Failed to fetch comments");
            const data = await res.json();
            setComments(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        const trimmed = newComment.trim();
        if (!trimmed) return;

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/comments/addComment`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ blogId: id, comment: trimmed }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Failed to add comment");
            }

            if (data && (data._id || data.comment)) {
                setComments((prev) => [...prev, data]);
            } else {
                await fetchComments();
            }
            setNewComment("");
        } catch (err) {
            console.error(err);
            Swal.fire(
                "Error",
                err.message || "Could not add comment.",
                "error"
            );
        }
    };

    const handleDeleteBlog = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            background: "rgba(255, 255, 255, 0.9)",
            customClass: { popup: "glass-popup" },
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/blogs/deleteBlog/${blog._id}`,
                    {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const data = await res.json();
                if (res.ok) {
                    Swal.fire("Deleted!", data.message, "success");
                    navigate("/");
                } else {
                    Swal.fire(
                        "Error",
                        data.message || "Delete failed",
                        "error"
                    );
                }
            } catch (err) {
                Swal.fire("Error", err.message, "error");
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        const result = await Swal.fire({
            title: "Delete comment?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            background: "rgba(255, 255, 255, 0.9)",
            customClass: { popup: "glass-popup" },
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(
                    `${process.env.REACT_APP_API_URL}/comments/deleteComment/${commentId}`,
                    {
                        method: "DELETE",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const data = await res.json();
                if (res.ok) {
                    Swal.fire("Deleted!", data.message, "success");
                    setComments((prev) =>
                        prev.filter((c) => c._id !== commentId)
                    );
                } else {
                    Swal.fire(
                        "Error",
                        data.message || "Delete failed",
                        "error"
                    );
                }
            } catch (err) {
                Swal.fire("Error", err.message, "error");
            }
        }
    };

    if (!blog) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-70">
                <div className="glass-container text-center p-5">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 glass-text-content">
                        Loading blog post...
                    </p>
                </div>
            </div>
        );
    }

    const isAuthor = user && blog.author?._id === user.id;
    const isAdmin = user && user.isAdmin;

    return (
        <div className="container mt-4 blog-detail-page">
            {/* Blog Content */}
            <div className="glass-container blog-detail-container p-4 rounded-4">
                <h1 className="glass-title">{blog.title}</h1>
                <p className="glass-subtitle mb-3">
                    By{" "}
                    <span className="glass-text-primary">
                        {blog.author?.username || "Unknown"}
                    </span>{" "}
                    • {new Date(blog.createdAt).toLocaleDateString()}
                </p>

                <div className="glass-text-content blog-content">
                    {blog.content.split("\n").map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                {(isAuthor || isAdmin) && (
                    <div className="mt-4 d-flex gap-2">
                        {isAuthor && (
                            <button
                                className="glass-btn-primary"
                                onClick={() =>
                                    navigate(`/edit-blog/${blog._id}`)
                                }
                            >
                                Edit
                            </button>
                        )}
                        <button
                            className="glass-btn-primary"
                            onClick={handleDeleteBlog}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Comments Section */}
            <div className="glass-container blog-detail-container mt-4 p-4 rounded-4">
                <h3 className="glass-title mb-4">
                    Comments ({comments.length})
                </h3>

                {comments.length === 0 ? (
                    <p className="glass-text-content text-center py-3">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    comments.map((c) => (
                        <div
                            key={c._id}
                            className="glass-card comment-card mb-3 p-3 rounded-3"
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                    <p className="mb-1">
                                        <strong className="glass-text-primary">
                                            {c.user?.username || "Anonymous"}
                                        </strong>
                                        <small className="glass-text-muted ms-2">
                                            {new Date(
                                                c.createdAt
                                            ).toLocaleDateString()}
                                        </small>
                                    </p>
                                    <p className="glass-text-content mb-0">
                                        {c.comment}
                                    </p>
                                </div>
                                {isAdmin && (
                                    <button
                                        className="glass-btn-primary btn-sm ms-2"
                                        onClick={() =>
                                            handleDeleteComment(c._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {user ? (
                    <form onSubmit={handleAddComment} className="mt-4">
                        <div className="mb-3">
                            <textarea
                                className="form-control glass-input"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write your comment here..."
                                rows={4}
                                required
                            />
                        </div>
                        <button type="submit" className="glass-btn-primary">
                            Add Comment
                        </button>
                    </form>
                ) : (
                    <div className="text-center mt-4">
                        <p className="glass-text-content">
                            Please{" "}
                            <span
                                className="text-warning cursor-pointer mx-1"
                                style={{ textDecoration: "underline" }}
                                onClick={() => navigate("/login")}
                            >
                                login
                            </span>{" "}
                            to add a comment.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
