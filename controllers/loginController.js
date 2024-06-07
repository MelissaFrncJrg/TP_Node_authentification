import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";

dotenv.config();

export const showLoginForm = (req, res) => {
  const flashMessages = req.flash("errors");
  res.render("login", { flashMessages, token: req.session.token });
};

export const submitLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    // find the user by email
    const user = await User.findOne({ email });

    if (user) {
      // Verify the password
      const isPasswordValid = await user.verifyPassword(password);

      if (isPasswordValid) {
        // Generate a token for the user
        const token = jwt.sign({ userId: user._id }, process.env.HASH_SECRET, {
          expiresIn: "24h",
        });
        // Add the token in the session
        req.session.token = token;
        // Store the user in the session
        req.session.user = user;
        // If everything's okay, redirect him to the dashboard
        res.redirect("/dashboard");
      } else {
        // If the password is invalid, flash an error message and redirect to login page
        req.flash("errors", "Wrong password");
        res.status(401).render("login", {
          token: req.session.token,
          errors: req.flash("errors"),
        });
      }
    } else {
      // If the user doesn't exist, flash an error message and redirect to login page
      req.flash("errors", "User does not exist");
      res.status(404).render("login", {
        user,
        errors: req.flash("errors"),
      });
    }
  } catch (error) {
    // If an error occurs, log it, flash an error message, and redirect to login page
    console.error(error);
    req.flash("errors", "An error occurred. Please try again.");
    res.status(500).render("login", {
      user,
      errors: req.flash("errors"),
    });
  }
};
