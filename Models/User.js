import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 255,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the user
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const secret = process.env.HASH_SECRET;
  const hash = crypto
    .createHmac("sha256", secret)
    .update(this.password)
    .digest("hex");
  this.password = hash;
  next();
});

// Method to verify password
userSchema.methods.verifyPassword = function (password) {
  const secret = process.env.HASH_SECRET;
  const hash = crypto
    .createHmac("sha256", secret)
    .update(password)
    .digest("hex");
  return this.password === hash;
};

const User = mongoose.model("User", userSchema);

export default User;
