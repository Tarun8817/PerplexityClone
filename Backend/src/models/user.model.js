// models/user.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";   

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // auto adds createdAt and updatedAt
);

// Pre-save hook: hashes password only when it's new or modified
userSchema.pre("save", async function () { 
  // Skip hashing if password hasn't changed (e.g. updating email)
  if (!this.isModified("password")) return;

  // Hash password with salt rounds of 10
  this.password = await bcrypt.hash(this.password, 10);
});

// Instance method: compares plain password with hashed password in DB
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("User", userSchema); 

export default userModel;