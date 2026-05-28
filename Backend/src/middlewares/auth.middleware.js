import jwt from "jsonwebtoken"

/**
 * @desc Middleware to protect routes — verifies JWT from cookie
 * @usage app.get("/protected", authUser, (req, res) => { ... })
 * @access Private
 */
export default function authUser(req, res, next) {

  // Extract token from the cookie sent by the browser
  // req.cookies is set by cookie-parser middleware
  const token = req.cookies.token;

  // If no token found in cookie, block the request immediately
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "No token provided"
    })
  }

  try {
    // Verify the token using our secret key
    // jwt.verify() checks both the signature and expiry
    // If token is invalid or expired, it throws an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach decoded user data (id, username) to the request object
    // So any route handler after this middleware can access req.user
    req.user = decoded

    // Pass control to the next middleware or route handler
    next()

  } catch (err) {
    // Token was tampered with or has expired
    // Block the request and return 401
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      err: "Invalid token"
    })
  }
}