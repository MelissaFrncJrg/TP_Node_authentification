export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      // If destry fails, show an error message and redirect to the home page
      console.error("Error destroying session:", err);
      req.flash("errors", "An error occurred. Please try again.");
      return res.redirect("/");
    }
    // If the session is successfully destroyed, redirect to the login page
    res.redirect("/login");
  });
};
