import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CreateBlog() {
    const [blog, setBlog] = useState({ title: "", content: "" });
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) navigate("/login");

        document.body.classList.add("createblog-background");
        const navbar = document.querySelector(".navbar");
        if (navbar) navbar.classList.add("transparent-navbar");

        return () => {
            document.body.classList.remove("createblog-background");
            if (navbar) navbar.classList.remove("transparent-navbar");
        };
    }, [user, navigate]);

    const handleChange = (e) =>
        setBlog({ ...blog, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:4000/blogs/createBlog",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(blog),
                }
            );

            const data = await response.json();
            if (response.ok) {
                Swal.fire("Success", "Blog created successfully!", "success");
                navigate(`/blog/${data._id}`);
            } else {
                Swal.fire("Error", data.message || "Creation failed", "error");
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    return (
        <div className="container mt-5">
            <div className="glass-container blog-detail-container p-4 rounded-4">
                <h2 className="glass-title mb-4 text-center">Create Blog</h2>
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
                        Create Blog
                    </button>
                </form>
            </div>
        </div>
    );
}
