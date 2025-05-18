import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models";
import validator from "validator";

const router = express.Router();

// JWT token creation
const createToken = (id: string): string => {
  return jwt.sign({ id }, process.env.SECRET as string, { expiresIn: "1d" });
};

// Login route
router.post(
  "/login",
  async (req, res) => {
    const { email, password } = req.body;
    const userEmail: string = email.toLowerCase();

    try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(401).json({message: "Invalid credentials"});
      }

      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
        return res.status(401).json({message: "Invalid credentials"});
      }

      const token = await createToken(user._id.toString()); 
   
      const data = {
        name: user.name, 
        email: user.email, 
        role: user.role,
        token
      };
    
      res.cookie("user", JSON.stringify(data), {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({message: "Server Error"});
    }
 }
);

// Signup route
router.post(
  "/register",
  async (req, res) => {
    const { name, email, password } = req.body;

    try {
      if (!validator.isStrongPassword(password)) {
        return res.status(400).json({message: "Password is not strong enough"});
      }

      const userEmail: string = email.toLowerCase();
      const exist = await User.findOne({ email: userEmail });
      if (exist) {
        return res.status(400).json({message: "Email already exist, login"});
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: userEmail,
        password: hashedPassword,
      }); 

      const token = await createToken(user._id.toString());

      const data = {name, email, role: "buyer", token}; 

      res.cookie("user", JSON.stringify(data), {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({message: "Server Error"});
    }
  }
);

// Get user route
router.get("/me", async (req, res) => {
  const user = req.cookies.user;

  try {
    if (!user) {
      return res.status(401).json({message: "Please login"});
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({message: "Server Error"});
  }
});

// Logout route
router.get(
  "/logout",
  async (req, res) => {
    try {
      res.cookie("user", "", { maxAge: 1 });
      res.status(200).send("Logged out");
    } catch (error) {
      res.status(400).json({message: "Server Error"});
    }
  },
);

// Get all users
router.get("/", async (req, res) => {
  const users = await User.find().select("-password"); // Exclude password
  res.json(users);
});

// Get single user by ID
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

// Update user details
router.put("/:id", async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedUser);
});

// Delete user
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
});

export default router;

