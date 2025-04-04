// controllers/userControllers.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
  const {
    username,
    email,
    password,
    discord,
    insta,
    telegram,
    role,
  } = req.body;

  try {
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePhoto = req.file?.path;
    if (!profilePhoto) return res.status(400).json({ message: 'Profile photo is required.' });

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      discord,
      insta,
      telegram,
      profilePhoto,
      role: role?.toLowerCase() || 'gamer',
     
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const loginUser = async (req, res) => {
console.log("Body:", req.body)
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
