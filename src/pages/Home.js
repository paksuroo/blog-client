import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4000/blogs/getBlogs")
            .then((res) => res.json())
            .then((data) => setBlogs(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="home-content">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="glass-container text-center mb-5">
                        <h1 className="glass-title">All Blogs</h1>
                        <p className="glass-subtitle">
                            Discover stories, thinking, and expertise from
                            writers
                        </p>
                    </div>

                    {blogs.length === 0 ? (
                        <div className="glass-card p-4 text-center">
                            <p>
                                No blogs available. Be the first to create one!
                            </p>
                            <Link
                                to="/create-blog"
                                className="btn glass-btn-primary mt-2"
                            >
                                Create Blog
                            </Link>
                        </div>
                    ) : (
                        blogs.map((blog) => (
                            <div key={blog._id} className="glass-card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title glass-text-primary">
                                        {blog.title}
                                    </h5>
                                    <p className="card-subtitle mb-2 glass-text-secondary">
                                        By: {blog.author?.username || "Unknown"}
                                    </p>
                                    <p className="card-text glass-text-content">
                                        {blog.content.substring(0, 150)}...
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link
                                            to={`/blog/${blog._id}`}
                                            className="btn glass-btn-primary"
                                        >
                                            Read More
                                        </Link>
                                        <small className="glass-text-muted">
                                            {new Date(
                                                blog.createdAt
                                            ).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
