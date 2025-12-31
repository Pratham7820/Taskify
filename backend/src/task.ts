import express from "express";
import { TaskModel } from "./db";
import z from "zod";
import { middleware, AuthRequest } from "./middleware";
import mongoose from "mongoose";

const task = express.Router();

const taskBody = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  duedate: z.string().transform((val) => new Date(val)),
  status: z.enum(["pending", "completed"]).default("pending"),
  priority: z.enum(["low", "medium", "high"])
});

task.post("/create", middleware, async (req: AuthRequest, res) => {
  const parsed = taskBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const task = await TaskModel.create({
    ...parsed.data,
    assignedTo: new mongoose.Types.ObjectId(req.userId)
  });

  res.json({ message: "Task created", task });
});

task.get("/", middleware, async (req: AuthRequest, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 8;
  const skip = (page - 1) * limit;

  const tasks = await TaskModel.find({ assignedTo: new mongoose.Types.ObjectId(req.userId) })
    .skip(skip)
    .limit(limit)
    .sort({ dueDate: 1 });

  res.json(tasks);
});

task.get("/:id", middleware, async (req: AuthRequest, res) => {
  const task = await TaskModel.findOne({
    _id: req.params.id,
    assignedTo: new mongoose.Types.ObjectId(req.userId)
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});

task.put("/:id", middleware, async (req: AuthRequest, res) => {
  const parsed = taskBody.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid update data" });
  }

  const updated = await TaskModel.findOneAndUpdate(
    { _id: req.params.id, assignedTo: new mongoose.Types.ObjectId(req.userId) },
    parsed.data,
    { new: true }
  );


  if (!updated) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(updated);
});

task.patch("/:id/status", middleware, async (req: AuthRequest, res) => {
  const statusSchema = z.object({
    status: z.enum(["pending", "completed"])
  });

  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const updated = await TaskModel.findOneAndUpdate(
    { _id: req.params.id, assignedTo: new mongoose.Types.ObjectId(req.userId) },
    { status: parsed.data.status },
    { new: true }
  );

  res.json(updated);
});

task.delete("/:id", middleware, async (req: AuthRequest, res) => {
  const deleted = await TaskModel.findOneAndDelete({
    _id: req.params.id,
    assignedTo: new mongoose.Types.ObjectId(req.userId)
  });

  if (!deleted) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted" });
});

export default task;
