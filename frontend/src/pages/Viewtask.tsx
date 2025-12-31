import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Task = {
  title: string;
  description: string;
  duedate: string;
  priority: string;
  status: string;
};

export default function ViewTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/task/${id}`,
          {
            headers: {
              'authorization' : `Task ${localStorage.getItem("token")}`,
            },
          }
        );
        setTask(res.data);
      } catch {
        alert("Failed to load task");
        navigate("/dashboard");
      }
    }

    fetchTask();
  }, [id]);

  if (!task) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-2xl font-bold mb-6">View Task</h1>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Title</p>
            <p className="font-semibold">{task.title}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p>{task.description || "No description"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Due Date</p>
              <p>{task.duedate.slice(0, 10)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p>{task.status}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Priority</p>
            <p>{task.priority}</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
        >
          Back
        </button>
      </div>
    </div>
  );
}
