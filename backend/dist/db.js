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
exports.TaskModel = exports.UserModel = void 0;
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = process.env.DATABASE_URL || '';
            yield mongoose_1.default.connect(url);
            console.log('Connected to MongoDB!');
        }
        catch (error) {
            console.error('MongoDB connection error:', error);
        }
    });
}
connectToDB();
const userSchema = new mongoose_2.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 3
    }
});
const taskSchema = new mongoose_2.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    duedate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true
    },
    assignedTo: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });
const UserModel = (0, mongoose_2.model)('User', userSchema);
exports.UserModel = UserModel;
const TaskModel = (0, mongoose_2.model)('Task', taskSchema);
exports.TaskModel = TaskModel;
