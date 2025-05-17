import React, { useState } from "react";
import postService from "../services/postService";

const PostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const newPost = await postService.createPost({ title, content });
      setTitle("");
      setContent("");
      if (onPostCreated) {
        onPostCreated(newPost); // Callback to update parent list
      }
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>Create New Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={submitting}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
          required
        />
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Create Post"}
      </button>
    </form>
  );
};

export default PostForm;
