import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import usersRouter from "./routers/users";
import activitiesRouter from "./routers/activities";
import groupsRouter from "./routers/groups";
import adminRouter from "./routers/admin";

const app = express();
const port = 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());

app.use("/users", usersRouter);
app.use("/activities", activitiesRouter);
app.use("/groups", groupsRouter);
app.use("/admin", adminRouter);

const run = async () => {
  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });

  process.on("exit", () => {
    mongoose.disconnect();
  });
};

run().catch(console.error);
