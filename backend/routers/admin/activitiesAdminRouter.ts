import { Error } from "mongoose";
import express from "express";
import Activity from "../../models/Activity";
import Group from "../../models/Group";

const activitiesAdminRouter = express.Router();

activitiesAdminRouter.get("/", async (_req, res, next) => {
  try {
    const activities = await Activity.find().populate(
      "user",
      "email displayName",
    );
    res.send(activities);
  } catch (error) {
    if (error instanceof Error.CastError) {
      res.status(400).send(error);
      return;
    }

    next(error);
  }
});

activitiesAdminRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) {
      res.status(404).send({ error: "Activity not found" });
      return;
    }

    await Group.deleteMany({ activity: activity._id });
    res.send({ message: "Activity deleted successfully" });
  } catch (error) {
    if (error instanceof Error.CastError) {
      res.status(400).send({ error: "Invalid id " });
      return;
    }

    next(error);
  }
});

activitiesAdminRouter.patch("/:id/togglePublished", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).send({ error: "Activity id must be in req params" });
      return;
    }

    const activity = await Activity.findById(id);
    if (!activity) {
      res.status(404).send({ error: "Activity not found" });
      return;
    }

    const newActivity = !activity.isPublished;
    const updateActivity = await Activity.findByIdAndUpdate(
      id,
      { isPublished: newActivity },
      {
        new: true,
        runValidators: true,
      },
    );
    res.send(updateActivity);
  } catch (error) {
    if (error instanceof Error.CastError) {
      res.status(400).send({ error: "Invalid id " });
      return;
    }
    next(error);
  }
});

export default activitiesAdminRouter;
