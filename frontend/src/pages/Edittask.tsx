import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

type Task = {
    title: string;
    description: string;
    duedate: string;
    priority: "low" | "medium" | "high";
};

export default function EditTask() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchTask() {
            try {
                const res = await axios.get(
                    `http://localhost:8080/api/task/${id}`,
                    {
                        headers: {
                            'authorization' : `Task ${token}`,
                        },
                    }
                );

                setTask({
                    title: res.data.title,
                    description: res.data.description || "",
                    duedate: res.data.duedate.slice(0, 10), 
                    priority: res.data.priority,
                });
            } catch (err) {
                alert("Failed to load task");
                navigate("/dashboard");
            }
        }

        fetchTask();
    }, [id]);

    async function handleUpdate() {

        if (!task) return;

        try {
            setLoading(true);

            await axios.put(
                `http://localhost:8080/api/task/${id}`,
                task,
                {
                    headers: {
                        'authorization' : `Task ${token}`,
                    },
                }
            );

            navigate("/dashboard");
        } catch (err) {
            alert("Failed to update task");
        } finally {
            setLoading(false);
        }
    }

    if (!task) {
        return <p className="text-center mt-10">Loading task...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Edit Task</h1>
                    <Link
                        to="/dashboard"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </Link>
                </div>

                <div className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={task.title}
                            onChange={(e) =>
                                setTask({ ...task, title: e.target.value })
                            }
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            value={task.description}
                            onChange={(e) =>
                                setTask({ ...task, description: e.target.value })
                            }
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            value={task.duedate}
                            onChange={(e) =>
                                setTask({ ...task, duedate: e.target.value })
                            }
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Priority
                        </label>
                        <select
                            value={task.priority}
                            onChange={(e) =>
                                setTask({
                                    ...task,
                                    priority: e.target.value as Task["priority"],
                                })
                            }
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        onClick={handleUpdate}
                    >
                        {loading ? "Updating..." : "Update Task"}
                    </button>
                </div>
            </div>
        </div>
    );
}
