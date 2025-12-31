import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Task = {
    _id: string;
    title: string;
    duedate: string;
    status: "pending" | "completed";
    priority: "low" | "medium" | "high";
};

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    async function fetchTasks(pageNo: number) {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/api/task?page=${pageNo}`, {
            headers: {
                'authorization': `Task ${localStorage.getItem('token')}`
            }
        });
        setTasks(res.data);
        setLoading(false);
    }

    useEffect(() => {
        fetchTasks(page);
    }, [page]);

    async function deleteTask(id: string) {
        if (!window.confirm("Delete this task?")) return;
        await axios.delete(`http://localhost:8080/api/task/${id}`, {
            headers: {
                'authorization': `Task ${localStorage.getItem('token')}`
            }
        });
        fetchTasks(page);
    }

    async function toggleStatus(task: Task) {
        const newStatus = task.status === "pending" ? "completed" : "pending";

        await axios.patch(`http://localhost:8080/api/task/${task._id}/status`, {
            status: newStatus
        }, {
            headers: {
                'authorization': `Task ${localStorage.getItem('token')}`
            }
        });

        setTasks(prev =>
            prev.map(t =>
                t._id === task._id ? { ...t, status: newStatus } : t
            )
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                <Link
                    to="/task/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Create Task
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow">
                {loading ? (
                    <p className="p-4 text-center">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p className="p-4 text-center text-gray-500">No tasks found</p>
                ) : (
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-center">✔</th>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Due Date</th>
                                <th className="p-3 text-left">Priority</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tasks.map(task => (
                                <tr
                                    key={task._id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="p-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={task.status === "completed"}
                                            onChange={() => toggleStatus(task)}
                                            className="w-5 h-5 accent-green-600 cursor-pointer"
                                        />
                                    </td>

                                    <td className="p-3">
                                        <a
                                            href={`/tasks/${task._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`font-medium hover:underline ${task.status === "completed"
                                                ? "line-through text-gray-500"
                                                : "text-blue-600"
                                                }`}
                                        >
                                            {task.title}
                                        </a>
                                    </td>

                                    <td className="p-3">
                                        {task.duedate?.slice(0, 10)}
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-sm font-medium
                        ${task.priority === "high"
                                                    ? "bg-red-100 text-red-700"
                                                    : task.priority === "medium"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {task.priority}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-sm font-medium
                        ${task.status === "completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {task.status}
                                        </span>
                                    </td>

                                    <td className="p-3 text-right space-x-3">
                                        <Link
                                            to={`/task/${task._id}/edit`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>

                                        <Link
                                            to={`/task/${task._id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View
                                        </Link>

                                        <button
                                            onClick={() => deleteTask(task._id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="px-4 py-2 font-medium">Page {page}</span>

                <button
                    disabled={tasks.length < 5}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
