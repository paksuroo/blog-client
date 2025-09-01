import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState({ title: "", content: "" });
    const token = localStorage.getItem("token");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login");
            return;
        }

        document.body.classList.add("editblog-background");
        const navbar = document.querySelector(".navbar");
        if (navbar) navbar.classList.add("transparent-navbar");

        return () => {
            document.body.classList.remove("editblog-background");
            if (navbar) navbar.classList.remove("transparent-navbar");
        };
    }, [navigate]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(
                    `http://localhost:4000/blogs/getBlog/${id}`
                );
                const data = await response.json();

                if (response.ok) {
                    setBlog({ title: data.title, content: data.content });
                } else {
                    Swal.fire(
                        "Error",
                        data.message || "Failed to fetch blog",
                        "error"
                    );
                }
            } catch (error) {
                Swal.fire("Error", error.message, "error");
            }
        };

        fetchBlog();
    }, [id]);

    const handleChange = (e) =>
        setBlog({ ...blog, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `http://localhost:4000/blogs/updateBlog/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(blog),
                }
            );

            const data = await response.json();
            if (response.ok) {
                Swal.fire("Success", "Blog updated successfully!", "success");
                navigate("/");
            } else {
                Swal.fire("Error", data.message || "Update failed", "error");
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    return (
        <div className="container mt-5">
            <div className="glass-container blog-detail-container p-4 rounded-4">
                <h2 className="glass-title mb-4 text-center">Edit Blog</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label glass-text-primary">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            className="form-control glass-input"
                            value={blog.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label glass-text-primary">
                            Content
                        </label>
                        <textarea
                            name="content"
                            className="form-control glass-input"
                            value={blog.content}
                            onChange={handleChange}
                            rows={6}
                            required
                        />
                    </div>
                    <button type="submit" className="glass-btn-primary w-100">
                        Update Blog
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditBlog;
