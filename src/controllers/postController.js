const Post = require("../models/Post");

// Create post
exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = new Post({
      title,
      content,
      author: req.user.id,
    });
    await post.save();
    res.status(201).json({ data: post, code: 200, message: "post created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", code: 500 });
  }
};


// Get all posts

exports.getAllPosts = async (req, res) => {
  try {
    // Parse limit and offset from query parameters, defaulting to numbers
    const limit = parseInt(req.query.limit) || 10; // Default to 10 if not provided
    const offset = parseInt(req.query.offset) || 0; // Default to 0 if not provided

    // Find posts with population of the author field, applying limit and skip (offset)
    const posts = await Post.find()
      .populate("author", "username") // Populate the author field with username
      .skip(offset) // Skip the number of posts specified by offset
      .limit(limit); // Limit the number of posts returned

    // Get the total count of documents in the collection
    const total = await Post.countDocuments(); // Use 'total' instead of 'count'

    // Respond with posts data, total count, and a success code
    res.json({ data: posts, total, code: 200 });
  } catch (error) {
    // Handle any errors by sending a server error response
    res.status(500).json({ message: "Server error", code: 500 });
  }
};


// Get a post by ID
exports.getPostById = async (req, res) => {
  const { id } = req.params; // Extract post ID from request parameters
  try {
    const post = await Post.findById(id).populate("author", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found", code: 404 });
    }

    res.json({ data: post, code: 200, message: "post fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", code: 500 });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized", code: 200 });

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    await post.save();
    res.json({ data: post, code: 200 });
  } catch (error) {
    res.status(500).json({ message: "Server error", code: 500 });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized", code: 401 });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted", code: 200 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", code: 500 });
  }
};
