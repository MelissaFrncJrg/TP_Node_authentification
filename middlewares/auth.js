import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const { HASH_SECRET } = process.env;

export default async function authMiddleware(req, res, next) {
  try {
    // Get the token from the session
    const token = req.session.token;

    // Check if there is a token
    if (!token) {
      return res.redirect("/login");
    }

    // Verify the token with JWT
    const decoded = jwt.verify(token, HASH_SECRET);

    // Add user ID to the request object
    req.auth = {
      userId: typeof decoded === "string" ? decoded : decoded.userId,
    };

    next();
  } catch (error) {
    console.error("Error in authMiddleware");
    console.error(error);
    return res.redirect("/login");
  }
}
