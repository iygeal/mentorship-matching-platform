import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Define allowed roles
export type UserRole = "admin" | "mentor" | "mentee";

// Define the shape of a User document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
  goals?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create the schema
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "mentor", "mentee"],
      default: "mentee",
    },
    bio: { type: String },
    skills: [{ type: String }],
    goals: { type: String },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
