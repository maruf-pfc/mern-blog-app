import React, { useState, useCallback } from "react";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import "./App.css";

function App() {
  // This key forces PostList to re-fetch when a new post is created
  const [postListKey, setPostListKey] = useState(0);

  const handlePostCreated = useCallback(() => {
    setPostListKey((prevKey) => prevKey + 1); // Increment key to trigger re-render/re-fetch
  }, []);

  return (
    <>
      <header className="App-header">
        <h1>MERN Blog</h1>
      </header>
      <main>
        <PostForm onPostCreated={handlePostCreated} />
        <PostList key={postListKey} /> {/* Use key to force re-fetch */}
      </main>
    </>
  );
}

export default App;
