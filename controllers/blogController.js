import Blog from '../models/Blog.js';
import User from '../models/User.js';

export const createBlog = async (req, res) => {
  try {
    const { title, description, category, tags, coverPhoto } = req.body;

    const user = await User.findById(req.user);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const blog = new Blog({
      author: user._id,
      authorDescription: user.description,
      authorAvatar: user.avatar,
      title,
      description,
      category,
      tags,
      coverPhoto,
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error });
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'name avatar');
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name avatar');

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user)
      return res.status(403).json({ message: 'Not authorized to update this blog' });

    const { title, description, category, tags, coverPhoto } = req.body;

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.category = category || blog.category;
    blog.tags = tags || blog.tags;
    blog.coverPhoto = coverPhoto || blog.coverPhoto;

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user)
      return res.status(403).json({ message: 'Not authorized to delete this blog' });

    await blog.deleteOne();
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error });
  }
};

// @desc    Like a blog
// @route   POST /api/blogs/:id/like
// @access  Private
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const liked = blog.likes.includes(req.user);

    if (liked) {
      blog.likes = blog.likes.filter(userId => userId.toString() !== req.user);
    } else {
      blog.likes.push(req.user);
    }

    const updatedBlog = await blog.save();
    res.status(200).json({ likes: updatedBlog.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error liking blog', error });
  }
};

// @desc    Comment on a blog
// @route   POST /api/blogs/:id/comment
// @access  Private
export const commentOnBlog = async (req, res) => {
  try {
    const { comment } = req.body;

    const user = await User.findById(req.user);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.comments.push({
      user: user._id,
      comment,
      name: user.name,
      avatar: user.avatar,
      date: new Date(),
    });

    const updatedBlog = await blog.save();
    res.status(201).json(updatedBlog.comments);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error });
  }
};
