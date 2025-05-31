import express from "express";
import jwt from "jsonwebtoken";
import User, { JWT_SECRET } from "../models/User";
import Activity from "../models/Activity";
import auth, { RequestWithUser } from "../middleware/auth";
import { Error } from "mongoose";
import { activityImage } from "../middleware/multer";
import Group from "../models/Group";

const activitiesRouter = express.Router();

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    let user = null;

    if (token && authHeader) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
        user = await User.findById(decoded._id);

        if (user) {
          const isPublishedActivities = await Activity.find({
            isPublished: true,
          }).populate(
            "user",
            "email displayName",
          );

          const activities = await Activity.find({
            user: user._id,
            isPublished: false,
          }).populate(
            "user",
            "email displayName",
          );

          activities.push(...isPublishedActivities);
          res.send(activities);
          return;
        }
      } catch {
        const activities = await Activity.find({ isPublished: true }).populate(
          "user",
          "email displayName",
        );
        res.send(activities);
        return;
      }
    }

    const activities = await Activity.find({ isPublished: true }).populate(
      "user",
      "email",
    );
    res.send(activities);
  } catch (e) {
    next(e);
  }
});

activitiesRouter.get("/my", auth, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;

    const activities = await Activity.find({ user: user._id }).populate(
      "user",
      "email",
    );
    res.send(activities);
  } catch (e) {
    next(e);
  }
});

activitiesRouter.get("/author/:authorId", async (req, res, next) => {
  try {
    const { authorId } = req.params;

    const authorExists = await User.findById(authorId);
    if (!authorExists) {
      res.status(404).send({ message: "Author not found" });
      return;
    }

    const activities = await Activity.find({
      user: authorId,
      isPublished: true,
    }).populate("user", "email displayName");

    res.send(activities);
  } catch (e) {
    if (e instanceof Error.CastError) {
      res.status(400).send({ message: "Invalid author ID" });
      return;
    }
    next(e);
  }
});
activitiesRouter.get("/:id", async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id).populate(
      "user",
      "displayName email",
    );

    if (!activity) {
      res.status(404).send({ message: "Activity not found" });
      return;
    }
    res.send(activity);
  } catch (e) {
    if (e instanceof Error.CastError) {
      res.status(400).send({ message: "Invalid Activity ID" });
      return;
    }
    next(e);
  }
});

activitiesRouter.post(
  "/",
  auth,
  activityImage.single("image"),
  async (req, res, next) => {
    try {
      const reqUser = req as RequestWithUser;
      const activity = new Activity({
        user: reqUser.user._id,
        title: req.body.title,
        description: req.body.description,
        image: req.file ? `/activity/${req.file.filename}` : null,
      });

      await activity.save();
      res.status(201).send(activity);
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        res.status(400).send(e);
      } else {
        next(e);
      }
    }
  },
);

activitiesRouter.delete("/:id", auth, async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      res.status(404).send({ message: "Activity not found" });
      return;
    }

    await Group.deleteMany({ activity: activity._id });
    await Activity.deleteOne({ _id: req.params.id });
    res.send({ message: "Activity with him groups deleted successfully" });
  } catch (e) {
    next(e);
  }
});

export default activitiesRouter;
