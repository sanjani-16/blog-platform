import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/authcontext";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/posts/${postId}`);
      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`/posts/${postId}/likes`);
      fetchPosts();
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };
  const handleExpandComments = async (postId) => {
    setLoadingComments((prev) => ({ ...prev, [postId]: true }));
    try {
      const res = await axios.get(`/posts/${postId}`);
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, comments: res.data.comments } : p));
      setExpandedPost(expandedPost === postId ? null : postId);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
    setLoadingComments((prev) => ({ ...prev, [postId]: false }));
  };

  const handleCommentInput = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content) return;
    try {
      await axios.post(`/posts/${postId}/comments`, { content });
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      handleExpandComments(postId);
      fetchPosts();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`/posts/${postId}/comments/${commentId}`);
      handleExpandComments(postId);
      fetchPosts();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="feed-container">
      {/* Animated gradient overlay */}
      <div className="animated-gradient"></div>
      {/* Animated background shapes for uniqueness */}
      <div className="bg-shape bg-shape1"></div>
      <div className="bg-shape bg-shape2"></div>
      <div className="bg-shape bg-shape3"></div>
      <div className="bg-shape bg-shape4"></div>
      <h1>InstaLike</h1>
      <div className="feed-grid">
        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="post-header">
              <div className="avatar">{post.author[0]}</div>
              <div>
                <span className="author">{post.author}</span>
                <span className="date">{new Date(post.created_at).toLocaleString()}</span>
              </div>
              {user?.id === post.author_id && (
                <button className="delete-btn" onClick={() => handleDelete(post.id)}>
                  🗑️
                </button>
              )}
            </div>
            {post.image_url && (
              <img src={post.image_url} alt="post" className="post-image" />
            )}
            <div className="post-caption">{post.caption}</div>
            <div className="post-actions">
              <button className="like-btn" onClick={() => handleLike(post.id)}>
                ❤️ {post.likes_count}
              </button>
              <button className="comment-btn" onClick={() => handleExpandComments(post.id)}>
                💬 {post.comments_count}
              </button>
            </div>
            {/* Comments Section */}
            {expandedPost === post.id && (
              <div className="comments-section">
                {loadingComments[post.id] ? (
                  <div className="comments-loading">Loading comments...</div>
                ) : (
                  <>
                    <div className="comments-list">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div className="comment-card" key={comment.id}>
                            <span className="comment-author">{comment.author}</span>
                            <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
                            <span className="comment-content">{comment.content}</span>
                            {user?.id === comment.user_id && (
                              <button className="comment-delete-btn" onClick={() => handleDeleteComment(post.id, comment.id)}>
                                🗑️
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="no-comments">No comments yet.</div>
                      )}
                    </div>
                    <form className="comment-form" onSubmit={e => { e.preventDefault(); handleAddComment(post.id); }}>
                      <input
                        type="text"
                        className="comment-input"
                        placeholder="Add a comment..."
                        value={commentInputs[post.id] || ""}
                        onChange={e => handleCommentInput(post.id, e.target.value)}
                      />
                      <button type="submit" className="comment-submit-btn">Post</button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}