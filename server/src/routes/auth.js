
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabaseAdmin = require("../config/supabaseAdmin");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

const COOKIE_NAME = "eventflow_token";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 15 * 60 * 1000,
};

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters",
      });
    }

    if (
      cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address",
      });
    }

    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and at most 72 bytes",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabaseAdmin
      .from("app_users")
      .insert({
        name: cleanName,
        email: cleanEmail,
        password_hash: passwordHash,
      })
      .select("id, name, email, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists",
        });
      }

      console.error("Signup database error:", error.code);

      return res.status(500).json({
        success: false,
        message: "Unable to create account",
      });
    }

    const token = jwt.sign(
      { sub: String(user.id) },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie(COOKIE_NAME, token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during signup",
    });
  }
});


// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find user by email
    const { data: user, error } = await supabaseAdmin
      .from("app_users")
      .select("id, name, email, password_hash, created_at")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (error) {
      console.error("Login database error:", error.code);

      return res.status(500).json({
        success: false,
        message: "Unable to log in",
      });
    }

    // Same error for unknown email and incorrect password
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare entered password with stored hash
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT after successful login
    const token = jwt.sign(
      { sub: String(user.id) },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Store JWT in an HttpOnly cookie
    res.cookie(COOKIE_NAME, token, cookieOptions);

    // Never send password_hash to the frontend
    const { password_hash, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
});



// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from("app_users")
      .select("id, name, email, created_at")
      .eq("id", req.userId)
      .maybeSingle();

    if (error) {
      console.error("Current user database error:", error.code);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch current user",
      });
    }

    if (!user) {
      res.clearCookie(COOKIE_NAME, cookieOptions);

      return res.status(401).json({
        success: false,
        message: "User account not found. Please log in again.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Current user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});


// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});




module.exports = router;
