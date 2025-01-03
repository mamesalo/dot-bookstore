import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/userModel.js";

const router = express.Router();

// Route for User signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username or email is already registered
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token with user ID included
    const token = jwt.sign(
      { userId: user._id, isLogged: true },
      "your_secret_key", // Use this key for development
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token, username: user.username });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
