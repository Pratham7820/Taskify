import 'dotenv/config';
import mongoose, { Types } from "mongoose";
import { Schema, model} from 'mongoose';

async function connectToDB() {
    try {
        const url = process.env.DATABASE_URL || ''
        await mongoose.connect(url)
        console.log('Connected to MongoDB!')
    } catch (error) {
        console.error('MongoDB connection error:', error)
    }
}

connectToDB()

interface IUser {
  username: string,
  email: string,
  password : string
}

const userSchema = new Schema<IUser>({
  username: { 
    type: String, 
    required: true 
    },
  email: { 
    type: String, 
    required: true, 
    unique: true 
    },
  password : {
    type : String,
    required : true,
    min : 3
  }
});

interface ITask {
    title : string,
    description : string,
    duedate : Date,
    status : "pending" | "completed",
    priority : "low" | "medium" | "high",
    assignedTo : Types.ObjectId
}

const taskSchema = new Schema<ITask>({
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
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
    }
}, { timestamps: true });

const UserModel = model<IUser>('User', userSchema)
const TaskModel = model<ITask>('Task', taskSchema)

export {
    UserModel,TaskModel
}