import User from "../Models/User.js";

export const showRegistrationForm = (req, res) => {
  res.render("home", { errors: req.flash("errors") });
};

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, password_confirm } = req.body;

  // Check if any fields are empty
  if (!firstName || !lastName || !email || !password || !password_confirm) {
    req.flash("errors", "Please fill in all fields.");
    return res.status(400).render("home", { errors: req.flash("errors") });
  }

  // Check if password and password confirmation match
  if (password !== password_confirm) {
    req.flash("errors", "Passwords do not match.");
    return res.status(400).render("home", { errors: req.flash("errors") });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("errors", "User already exists.");
      return res.status(409).render("login", { errors: req.flash("errors") });
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });
    await newUser.save();

    console.log("New user added:", newUser);
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    console.log("Failed to add new user.");
    req.flash("errors", "An error occurred. Please try again.");
    res.status(500).render("register", { errors: req.flash("errors") });
  }
};
