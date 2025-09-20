import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import "./Home.css";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    axios.get(`/posts/${id}`).then((res) => setPost(res.data));
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/posts/${id}/comments`, { content: comment });
      setPost((prev) => ({
        ...prev,
        comments: [...prev.comments, res.data],
      }));
      setComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/posts/${id}/comments/${commentId}`);
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail-card">
      <div className="post-header">
        <div className="avatar">{post.author[0]}</div>
        <div>
          <span className="author">{post.author}</span>
          <span className="date">{new Date(post.created_at).toLocaleString()}</span>
        </div>
      </div>
      {post.image_url && <img src={post.image_url} alt="post" className="post-image" />}
      <div className="post-caption">{post.caption}</div>
      <div className="comments-section">
        <h3>Comments</h3>
        {post.comments.map((c) => (
          <div className="comment-card" key={c.id}>
            <span className="comment-author">{c.author}</span>
            <span className="comment-content">{c.content}</span>
            {user?.id === c.user_id && (
              <button className="delete-btn" onClick={() => handleDeleteComment(c.id)}>🗑️</button>
            )}
          </div>
        ))}
        <form onSubmit={handleComment} className="comment-form">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}