import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostList from "../PostList";
import postService from "../../services/postService";

// Mock the postService
jest.mock("../../services/postService");

describe("PostList Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    postService.getPosts.mockResolvedValueOnce([]); // Mock returns a promise
    render(<PostList />);
    expect(screen.getByText("Loading posts...")).toBeInTheDocument();
  });

  it("renders posts after successful fetch", async () => {
    const mockPosts = [
      {
        _id: "1",
        title: "First Post",
        content: "Content 1",
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        title: "Second Post",
        content: "Content 2",
        createdAt: new Date().toISOString(),
      },
    ];
    postService.getPosts.mockResolvedValueOnce(mockPosts);

    render(<PostList />);

    // Wait for loading to disappear and posts to appear
    await waitFor(() =>
      expect(screen.queryByText("Loading posts...")).not.toBeInTheDocument()
    );

    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
    expect(screen.getByText("Content 2")).toBeInTheDocument();
  });

  it('renders "no posts" message if fetch returns empty array', async () => {
    postService.getPosts.mockResolvedValueOnce([]);
    render(<PostList />);
    await waitFor(() =>
      expect(screen.queryByText("Loading posts...")).not.toBeInTheDocument()
    );
    expect(
      screen.getByText("No posts yet. Be the first to create one!")
    ).toBeInTheDocument();
  });

  it("renders error message on fetch failure", async () => {
    postService.getPosts.mockRejectedValueOnce(new Error("Network Error"));
    render(<PostList />);
    await waitFor(() =>
      expect(screen.queryByText("Loading posts...")).not.toBeInTheDocument()
    );
    expect(
      screen.getByText("Failed to fetch posts. Is the backend running?")
    ).toBeInTheDocument();
  });
});
