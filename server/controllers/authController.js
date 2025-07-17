const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');



exports.register = async (req, res) => {
  const { name, email, password, zipCode } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, zipCode, passwordHash });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      zipCode: user.zipCode,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      zipCode: user.zipCode,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Get current logged-in user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Not authorized' });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const html = `
      <p>Hello,</p>
      <p>You requested a password reset for your <strong>Borrow It</strong> account.</p>
      <p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail(
      email,
      'Password Reset',
      `Click the link to reset: ${resetLink}`, 
      html
    );

    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Error sending reset link' });
  }
};


exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Invalid user' });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};



exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
