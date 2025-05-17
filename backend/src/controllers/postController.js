const Post = require("../models/Post");
const { isValidTitle } = require("../utils/validators");

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!isValidTitle(title) || !content) {
      return res
        .status(400)
        .json({
          message: "Title and content are required. Title max 100 chars.",
        });
    }
    const post = new Post({ title, content });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};
