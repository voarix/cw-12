import mongoose, { HydratedDocument, Model } from "mongoose";
import argon2 from "argon2";
import { UserFields } from "../types";
import jwt from "jsonwebtoken";

interface UserMethods {
  checkPassword: (password: string) => Promise<boolean>;
}

interface UserVirtuals {
  confirmPassword: string;
}

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

export const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret";
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "default_fallback_secret";

export const generateAccessToken = (user: HydratedDocument<UserFields>) => {
  return jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "5m" });
};

export const generateRefreshToken = (user: HydratedDocument<UserFields>) => {
  return jwt.sign({ _id: user._id }, JWT_REFRESH_SECRET, { expiresIn: "2d" });
};

type UserModel = Model<UserFields, {}, UserMethods>;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new mongoose.Schema<
  HydratedDocument<UserFields>,
  UserModel,
  UserMethods,
  {},
  UserVirtuals
>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [
        {
          validator: async function (value: string): Promise<boolean> {
            return emailRegex.test(value);
          },
          message: "This is email is invalid",
        },
        {
          validator: async function (value: string): Promise<boolean> {
            if (!this.isModified("email")) return true;
            const user: HydratedDocument<UserFields> | null =
              await User.findOne({ email: value });
            return !user;
          },
          message: "This is email is already taken",
        },
      ],
    },
    displayName: String,
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["user", "admin"],
    },
    googleID: String,
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    virtuals: {
      confirmPassword: {
        get() {
          return this.__confirmPassword;
        },
        set(confirmPassword: string) {
          this.__confirmPassword = confirmPassword;
        },
      },
    },
  },
);

UserSchema.methods.checkPassword = async function (password: string) {
  return await argon2.verify(this.password, password);
};

UserSchema.path("password").validate(async function (v: string) {
  if (!this.isModified("password")) return;

  if (v !== this.confirmPassword) {
    this.invalidate("confirmPassword", "Passwords do not match");
    this.invalidate("password", "Passwords do not match");
  }
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await argon2.hash(this.password, ARGON2_OPTIONS);
  next();
});

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
