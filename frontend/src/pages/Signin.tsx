import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSignin() {
        try {
            if (!email || !password) {
                alert("All the fields are not filled")
                return
            }
            const res = await axios.post("http://localhost:8080/api/user/signin", {
                email,
                password
            }) 
            localStorage.setItem("token", res.data.token)
            navigate("/dashboard")
        } catch (err) {
            alert("Invalid credentials");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Sign in to Taskify
                </h2>

                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        onClick={handleSignin}
                    >
                        Sign In
                    </button>
                </div>

                <p className="text-sm text-center mt-4 text-gray-600">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
