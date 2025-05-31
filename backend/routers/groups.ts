import express from "express";
import Group from "../models/Group";
import auth, { RequestWithUser } from "../middleware/auth";
import mongoose, { Error } from "mongoose";

const groupsRouter = express.Router();

groupsRouter.get("/my-participate", auth, async (req, res, next) => {
  try {
    const reqUser = req as RequestWithUser;
    const groups = await Group.find({participants: reqUser.user._id})
      .populate("user", "displayName email")
      .populate("activity", "title image description")
      .populate("participants", "displayName email");
    res.send(groups);
  } catch (e) {
    next(e);
  }
}); // я являюсь ОБЫЧНЫМ участником группы

groupsRouter.get("/my-created", auth, async (req, res, next) => {
  try {
    const reqUser = req as RequestWithUser;
    const groups = await Group.find({user: reqUser.user._id})
      .populate("user", "displayName email")
      .populate("activity", "title image description isPublished")
      .populate("participants", "displayName email");
    res.send(groups);
  } catch (e) {
    next(e);
  }
}); // получение всех групп которые создал - Я (т.е. я ВЛАДЕЛЕЦ)

groupsRouter.get("/by-activity/:activityId", async (req, res, next) => {
  try {
    const group = await Group.findOne({activity: req.params.activityId})
      .populate("user", "displayName email")
      .populate("activity", "title image description isPublished")
      .populate("participants", "displayName email");

    if (!group) {
      res.status(404).send({message: "No group found"});
      return;
    }

    res.send(group);
  } catch (e) {
    next(e);
  }
});


groupsRouter.get("/:id", async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("user", "displayName email")
      .populate("activity", "title description image")
      .populate("participants", "displayName email");

    if (!group) {
      res.status(404).send({message: "Group not found"});
      return;
    }
    res.send(group);
  } catch (e) {
    if (e instanceof Error.CastError) {
      res.status(400).send({message: "Invalid Group ID"});
      return;
    }
    next(e);
  }
});

groupsRouter.delete(
  "/:groupId/remove-participant/:userId",
  auth,
  async (req, res, next) => {
    try {
      const group = await Group.findById(req.params.groupId);
      if (!group) {
        res.status(404).send({message: "Group not found"});
        return;
      }

      const partiToRemoveId = req.params.userId;
      const partiObjectId = new mongoose.Types.ObjectId(partiToRemoveId);

      const partiIndex = group.participants.findIndex((p) =>
        p.equals(partiObjectId),
      );
      if (partiIndex === -1) {
        res.status(400).send({message: "Participant not found"});
        return;
      }

      group.participants.splice(partiIndex, 1);
      await group.save();
      res.send({message: "Participant removed successfully"});
    } catch (e) {
      if (e instanceof Error.CastError) {
        res.status(400).send({message: "Invalid group or participant ID"});
        return;
      }
      next(e);
    }
  },
);

groupsRouter.post("/:groupId/add-participant/:userId", auth, async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) {
      res.status(404).send({message: "Group not found"});
      return
    }

    const userIdToAdd = req.params.userId;
    const userObjectId = new mongoose.Types.ObjectId(userIdToAdd);

    group.participants.push(userObjectId);
    await group.save();

    res.send({message: "User added to group successfully"});
  } catch (e) {
    if (e instanceof Error.CastError) {
      res.status(400).send({message: "Invalid group or user iD"});
      return
    }
    next(e);
  }
});


export default groupsRouter;
