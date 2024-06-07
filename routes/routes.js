import express from "express";

const router = express.Router();

import HomeController from "../controllers/home.js";
import {
  showRegistrationForm,
  registerUser,
} from "../controllers/registerController.js";
import {
  showLoginForm,
  submitLoginForm,
} from "../controllers/loginController.js";
import { logout } from "../controllers/logoutController.js";
import { showDashboard } from "../controllers/dashboardController.js";
import authMiddleware from "../middlewares/auth.js";

router.get("/", HomeController);
router.get("/register", showRegistrationForm);
router.post("/register", registerUser);
router.get("/login", showLoginForm);
router.post("/login", submitLoginForm);
router.get("/dashboard", authMiddleware, showDashboard);
router.get("/logout", logout);

export default router;
