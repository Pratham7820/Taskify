import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold">Taskify</h1>
                <div className="flex items-center gap-4">
                    <Link
                        to="/signin"
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/signup"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            <section className="text-center mt-24 px-4">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                    Manage Tasks.<br />Stay Productive.
                </h2>
                <p className="max-w-xl mx-auto text-gray-600 mb-8">
                    Taskify helps you organize tasks, manage priorities,
                    and track progress securely — all in one place.
                </p>

                <div className="flex justify-center gap-4">
                    <Link
                        to="/signup"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Create Free Account
                    </Link>
                    <Link
                        to="/signin"
                        className="px-6 py-3 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                        Sign In
                    </Link>
                </div>
            </section>

            <section className="mt-28 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <Feature
                    title="Task Management"
                    desc="Create, edit, and delete tasks effortlessly."
                />

                <Feature
                    title="Due Dates"
                    desc="Never miss deadlines with due-date tracking."
                />

                <Feature
                    title="Priority Lists"
                    desc="Organize tasks by priority for better focus."
                />

                <Feature
                    title="Secure Access"
                    desc="JWT-based authentication keeps your data safe."
                />
            </section>
        </div>
    );
}

function Feature({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{desc}</p>
        </div>
    );
}
