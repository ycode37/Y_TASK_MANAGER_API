import Task from "../models/task.model.js";

export const CreateTask = async (req, res, next) => {
  try {
    const taskData = req.body;

    taskData.user = req.userId;

    const task = new Task(taskData);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const allowedSortFields = ["createdAt", "taskName", "done"];

    const sortOrderQueue = req.query.sort || "-createdAt";

    const sortDirection = sortOrderQueue.startsWith("-") ? -1 : 1;

    const sortField = sortOrderQueue.startsWith("-")
      ? sortOrderQueue.slice(1)
      : sortOrderQueue;

    if (!allowedSortFields.includes(sortField)) {
      return res.status(400).json({ message: "Invalid Sort Field" });
    }

    const filter = {
      user: req.userId,
    };

    if (req.query.done !== undefined) {
      filter.done = req.query.done === "true";
    }
    if (req.query.search !== undefined && req.query.search.trim() !== "") {
      filter.taskName = {
        $regex: req.query.search.trim(),
        $options: "i",
      };
    }

    const tasks = await Task.find(filter)
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit);
    const countData = await Task.countDocuments(filter);

    const totalPages = Math.ceil(countData / limit);

    // if (!tasks) {
    //   return res.status(400).send({ message: "No Such Task Found" });
    // }

    return res
      .status(200)
      .send({ tasks: tasks, totalTasks: countData, totalPages: totalPages });
  } catch (error) {
    next(error);
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
