// controllers/auth.controller.js
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../services/mail.service.js";


/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    const isUserAlreadyExists = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserAlreadyExists) {
      const field = isUserAlreadyExists.email === email ? "email" : "username";
      return res.status(409).json({
        success: false,
        errors: [{ field, message: `This ${field} is already taken` }],
      });
    }

    const user = await userModel.create({ username, email, password });

    const emailVerificationToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await sendEmail({
      to: user.email,
      subject: "Welcome to Perplexity 🎉",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background-color: #0a0a0a; color: #e0e0e0; border-radius: 12px;">
          <h1 style="font-size: 24px; color: #ffffff; margin-bottom: 8px;">Welcome to Perplexity, ${user.username}! 👋</h1>
          <p style="font-size: 15px; color: #9e9e9e; line-height: 1.8; margin-bottom: 24px;">
            We're glad you're here. Start exploring AI-powered search and discover smarter answers instantly.
          </p>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${process.env.BASE_URL}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
          <p style="font-size: 13px; color: #555; margin-top: 32px;">
            If you didn't sign up, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.verified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

/**
 * @desc Get current logged in user's details
 * @route GET  /api/auth/get-me
 * @access Private
*/
export async function getMe(req, res) {
  try {
    const userId = req.user.id;

    const user = await userModel
      .findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        err: "User not found",
      });
    }

    return res.status(200).json({
      message: "User details fetched successfully",
      success: true,
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      err: error.message,
    });
  }
}


/**
 * @desc Verify user's email via token link
 * @route GET /api/auth/verify-email?token=...
 * @access Public
 */
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
        err: "User not found",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    user.verified = true;
    await user.save();

    const html = `
      <h1>Email Verified Successfully</h1>
      <p>Your email has been verified. You can now log in to your account.</p>
      <a href="http://localhost:3000/login">Go to Login</a>
    `;

    return res.send(html);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
}