const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //Check for feilds
    if (!name || !email || !password) {
      return res.status(400).send("All fields are required");
    }
    //check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    //Create New User
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(500).send(`An error occurred: ${err.message}`);
  }
});

// Login Route 
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }

    const loginUser = await User.findOne({ email });
    //Check password here
    if (!loginUser || loginUser.password !== password) {
      return res.status(400).send("Invalid Credentials");
    }
    //Send Response
    res.send(`Hello, ${loginUser.name}`);
  } catch (err) {
    res.status(500).send("Unknown error occurred");
  }
});

module.exports = router;
