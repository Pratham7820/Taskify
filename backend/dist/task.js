"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const zod_1 = __importDefault(require("zod"));
const middleware_1 = require("./middleware");
const mongoose_1 = __importDefault(require("mongoose"));
const task = express_1.default.Router();
const taskBody = zod_1.default.object({
    title: zod_1.default.string().min(1),
    description: zod_1.default.string().optional(),
    duedate: zod_1.default.string().transform((val) => new Date(val)),
    status: zod_1.default.enum(["pending", "completed"]).default("pending"),
    priority: zod_1.default.enum(["low", "medium", "high"])
});
task.post("/create", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = taskBody.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input" });
    }
    const task = yield db_1.TaskModel.create(Object.assign(Object.assign({}, parsed.data), { assignedTo: new mongoose_1.default.Types.ObjectId(req.userId) }));
    res.json({ message: "Task created", task });
}));
task.get("/", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    const tasks = yield db_1.TaskModel.find({ assignedTo: new mongoose_1.default.Types.ObjectId(req.userId) })
        .skip(skip)
        .limit(limit)
        .sort({ dueDate: 1 });
    res.json(tasks);
}));
task.get("/:id", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield db_1.TaskModel.findOne({
        _id: req.params.id,
        assignedTo: new mongoose_1.default.Types.ObjectId(req.userId)
    });
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
}));
task.put("/:id", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsed = taskBody.partial().safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid update data" });
    }
    const updated = yield db_1.TaskModel.findOneAndUpdate({ _id: req.params.id, assignedTo: new mongoose_1.default.Types.ObjectId(req.userId) }, parsed.data, { new: true });
    if (!updated) {
        return res.status(404).json({ message: "Task not found" });
    }
    res.json(updated);
}));
task.patch("/:id/status", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statusSchema = zod_1.default.object({
        status: zod_1.default.enum(["pending", "completed"])
    });
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid status" });
    }
    const updated = yield db_1.TaskModel.findOneAndUpdate({ _id: req.params.id, assignedTo: new mongoose_1.default.Types.ObjectId(req.userId) }, { status: parsed.data.status }, { new: true });
    res.json(updated);
}));
task.delete("/:id", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield db_1.TaskModel.findOneAndDelete({
        _id: req.params.id,
        assignedTo: new mongoose_1.default.Types.ObjectId(req.userId)
    });
    if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
}));
exports.default = task;
