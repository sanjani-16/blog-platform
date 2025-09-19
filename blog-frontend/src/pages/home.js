// src/pages/home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "./Home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/api/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading feed...</p>;

  return (
    <div className="home-page">
      <div className="home-feed">
        {posts.length === 0 ? (
          <p className="home-empty">No posts yet. Create one!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="home-card">
              {/* Header: user + time */}
              <div className="home-cardHeader">
                <div className="home-avatar">
                  {post.user_name ? post.user_name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <strong>{post.user_name || "Anonymous"}</strong>
                  <p className="home-date">
                    {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Image */}
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="post"
                  className="home-image"
                  onError={(e) =>
                    (e.target.style.display = "none") // hide if broken
                  }
                />
              )}

              {/* Caption */}
              {post.content && (
                <p className="home-caption">{post.content}</p>
              )}

              {/* Details link */}
              <Link to={`/posts/${post.id}`} className="home-link">
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
