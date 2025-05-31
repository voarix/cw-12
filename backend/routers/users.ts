import express from "express";
import { OAuth2Client } from "google-auth-library";
import config from "../config";
import User, { generateAccessToken, generateRefreshToken, JWT_REFRESH_SECRET, } from "../models/User";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";
import auth, { RequestWithUser } from "../middleware/auth";

const usersRouter = express.Router();
const client = new OAuth2Client(config.google.clientId);

usersRouter.post("/google", async (req, res, next) => {
  try {
    if (!req.body.credential) {
      res.status(400).send({ error: "Google login Error!" });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res.status(400).send({ error: "Google login Error!" });
      return;
    }

    const email = payload["email"];
    const googleID = payload["sub"];
    const displayName = payload["name"];

    if (!email) {
      res.status(400).send({ error: "No enough user data to continue!" });
      return;
    }

    let user = await User.findOne({ googleID: googleID });

    const genPassword = crypto.randomUUID();

    if (!user) {
      user = new User({
        email: email,
        password: genPassword,
        confirmPassword: genPassword,
        displayName,
        googleID,
      });
    }

    const accessTokenJwt = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;

    user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const safeUser = {
      _id: user._id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
    };

    res.send({
      user: safeUser,
      message: "Login with Google successfully.",
      accessToken: accessTokenJwt,
    });
  } catch (e) {
    next(e);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    console.log(req.body.email);

    const user = new User({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
      confirmPassword: req.body.confirmPassword,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const safeUser = {
      _id: user._id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
    };

    res.send({
      accessToken,
      user: safeUser,
      message: "User registered successfully.",
    });
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      res.status(400).send(error);
      return;
    }

    next(error);
  }
});

usersRouter.post("/sessions", async (req, res, _next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send({ error: "Email and password must be in req" });
    return;
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404).send({ error: "Email not found" });
    return;
  }

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    res.status(400).send({ error: "Password is incorrect" });
    return;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;

  user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  const safeUser = {
    _id: user._id,
    email: user.email,
    role: user.role,
    displayName: user.displayName,
  };

  res.send({
    accessToken,
    message: "Email and password is correct",
    user: safeUser,
  });
});

usersRouter.delete("/sessions", auth, async (req, res, next) => {
  const user = (req as RequestWithUser).user;

  if (!user) {
    res.send({ message: "Success logout" });
    return;
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  try {
    user.refreshToken = generateRefreshToken(user);
    await user.save();

    res.send({ message: "Success logout" });
  } catch (e) {
    next(e);
  }
});

usersRouter.post("/secret", async (req, res, _next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(403).send({ error: "No refresh token provided" });
    return;
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      _id: string;
    };

    const user = await User.findById(payload._id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).send({ error: "Invalid refresh token provided" });
      return;
    }

    const accessTokenJwt = generateAccessToken(user);
    const refreshTokenJwt = generateRefreshToken(user);
    user.refreshToken = refreshTokenJwt;
    await user.save();

    res.cookie("refreshToken", refreshTokenJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const safeUser = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    res.send({
      message: "Secret message",
      user: safeUser,
      accessToken: accessTokenJwt,
    });
  } catch (e) {
    res.status(403).send({ error: "Refresh token invalid or expired" });
  }
});

usersRouter.post("/refresh-token", async (req, res, _next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(403).send({ error: "No refresh token provided" });
    return;
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      _id: string;
    };

    const user = await User.findById(payload._id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).send({ error: "Invalid refresh token provided" });
      return;
    }

    const newAccessToken = generateAccessToken(user);
    res.send({ accessToken: newAccessToken });
  } catch (e) {
    res.status(403).send({ error: "Refresh token invalid or expired" });
  }
});

export default usersRouter;
