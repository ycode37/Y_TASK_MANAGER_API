import Task from "../models/task.model.js";

export const CreateTask = async (req, res) => {
  try {
    const taskData = req.body;
    if (!taskData) {
      return res
        .status(400)
        .send({ message: "Please Input Every Field Necessary" });
    }
    taskData.user = req.userId;
    if (!taskData) {
      return res.status(400).send({ message: "Please Authenticate First" });
    }
    const task = new Task(taskData);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send({
        message: error.errors,
      });
    }
    return res.status(500).send({ message: "Internal Server Error!!" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      user: req.userId,
    };

    if (req.query.done !== undefined) {
      filter.done = req.query.done === "true";
    }

    const tasks = await Task.find(filter).skip(skip).limit(limit);
    const countData = await Task.countDocuments(filter);

    const totalPages = Math.ceil(countData / limit);

    if (!tasks) {
      return res.status(400).send({ message: "No Such Task Found" });
    }

    return res
      .status(200)
      .send({ tasks: tasks, totalTasks: countData, totalPages: totalPages });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something Went Wrong");
  }
};

export const updateTask = async (req, res) => {
  const updatedTask = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.userId,
    },
    req.body,
    {
      new: true,
    },
  );
  if (!updatedTask) {
    return res.status(404).send({ message: "Task Not Found" });
  }

  res.send(updatedTask);
};

export const deleteTask = async (req, res) => {
  const deletedTask = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  if (!deletedTask) {
    res.send("No Task Such That");
  }
  res.send(deletedTask);
};
