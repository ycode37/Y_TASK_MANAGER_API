import Task from "../models/task.model.js";

export const CreateTask = async (req, res) => {
  try {
    const taskData = req.body;
    const task = new Task(taskData);
    await task.save();
    res.send(task);
  } catch (error) {
    console.error(error);
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something Went Wrong");
  }
};

export const updateTask = async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updatedTask) {
    return res.status(404).send({ message: "Task Not Found" });
  }

  res.send(updatedTask);
};

export const deleteTask = async (req, res) => {
  const deletedTask = await Task.findByIdAndDelete(req.params.id);
  res.send(deletedTask);
};
