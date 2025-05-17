import React, { useState, useEffect } from "react";
import postService from "../services/postService";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postService.getPosts();
        setPosts(data);
        setError("");
      } catch (err) {
        setError("Failed to fetch posts. Is the backend running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (posts.length === 0)
    return <p>No posts yet. Be the first to create one!</p>;

  return (
    <div>
      <h2>Blog Posts</h2>
      {posts.map((post) => (
        <div
          key={post._id}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>
            Posted on: {new Date(post.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default PostList;
