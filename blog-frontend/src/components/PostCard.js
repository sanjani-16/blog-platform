import React from "react";
import UserName from "./UserName";

export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <UserName username={post.author} />
      {/* other post content */}
    </div>
  );
}