import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event"; // For more realistic user interactions
import PostForm from "../PostForm";
import postService from "../../services/postService";

jest.mock("../../services/postService");

describe("PostForm Component", () => {
  const mockOnPostCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<PostForm onPostCreated={mockOnPostCreated} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create post/i })
    ).toBeInTheDocument();
  });

  it("allows typing in title and content fields", async () => {
    const user = userEvent.setup();
    render(<PostForm onPostCreated={mockOnPostCreated} />);

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);

    await user.type(titleInput, "New Title");
    await user.type(contentInput, "New Content");

    expect(titleInput).toHaveValue("New Title");
    expect(contentInput).toHaveValue("New Content");
  });

  it("shows error if title or content is empty on submit", async () => {
    const user = userEvent.setup();
    render(<PostForm onPostCreated={mockOnPostCreated} />);
    const submitButton = screen.getByRole("button", { name: /create post/i });

    await user.click(submitButton);

    expect(
      screen.getByText("Title and content are required.")
    ).toBeInTheDocument();
    expect(postService.createPost).not.toHaveBeenCalled();
    expect(mockOnPostCreated).not.toHaveBeenCalled();
  });

  it("calls postService.createPost and onPostCreated on successful submission", async () => {
    const user = userEvent.setup();
    const mockNewPost = {
      _id: "3",
      title: "Test Success",
      content: "Successfully created",
    };
    postService.createPost.mockResolvedValueOnce(mockNewPost);

    render(<PostForm onPostCreated={mockOnPostCreated} />);

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    const submitButton = screen.getByRole("button", { name: /create post/i });

    await user.type(titleInput, "Test Success");
    await user.type(contentInput, "Successfully created");
    await user.click(submitButton);

    expect(postService.createPost).toHaveBeenCalledWith({
      title: "Test Success",
      content: "Successfully created",
    });

    // Wait for async operations to complete
    await waitFor(() => {
      expect(mockOnPostCreated).toHaveBeenCalledWith(mockNewPost);
    });

    // Check if form is cleared
    expect(titleInput).toHaveValue("");
    expect(contentInput).toHaveValue("");
  });

  it("shows error message if post creation fails", async () => {
    const user = userEvent.setup();
    postService.createPost.mockRejectedValueOnce(new Error("API Error"));
    render(<PostForm onPostCreated={mockOnPostCreated} />);

    await user.type(screen.getByLabelText(/title/i), "Fail Title");
    await user.type(screen.getByLabelText(/content/i), "Fail Content");
    await user.click(screen.getByRole("button", { name: /create post/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to create post. Please try again.")
      ).toBeInTheDocument();
    });
    expect(mockOnPostCreated).not.toHaveBeenCalled();
  });
});
