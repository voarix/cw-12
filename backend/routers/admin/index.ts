import express from "express";
import auth from "../../middleware/auth";
import permit from "../../middleware/permit";
import activitiesAdminRouter from "./activitiesAdminRouter";

const adminRouter = express.Router();

adminRouter.use(auth, permit("admin"));
adminRouter.use("/activities", activitiesAdminRouter);

export default adminRouter;
