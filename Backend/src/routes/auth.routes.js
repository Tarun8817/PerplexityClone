/**
 * @file auth.routes.js
 * @description Authentication routes for register, login, logout
 */

import { Router } from "express";
import { register, verifyEmail,login, getMe } from "../controllers/auth.controller.js";
import { registerValidation,loginValidator } from "../validators/auth.validator.js";
import authUser from "../middlewares/auth.middleware.js";
import userModel from "../models/user.model.js";
const authRouter = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
authRouter.post("/register", registerValidation, register);


/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body {email,password}
*/
authRouter.post("/login",loginValidator,login)

/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user's details
 * @access Private
 * 
*/
authRouter.get('/get-me',authUser,getMe)


/**
 * @route POST /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query {token}
*/
authRouter.get('/verify-email',verifyEmail)

export default authRouter;