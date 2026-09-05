import mongoose from "mongoose";

const Taskschema = mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  Done: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Task = mongoose.model("Tasks", Taskschema);
export default Task;
