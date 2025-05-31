import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  image: String,
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
});

const Activity = mongoose.model("Activity", ActivitySchema);
export default Activity;
