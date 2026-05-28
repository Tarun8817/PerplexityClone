import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hook/useAuth";

const Register = () => {

    const navigate = useNavigate();

    const { handleRegister } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await handleRegister(formData);

            navigate("/login");

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">

                    <div className="text-center mb-8">

                        <h1
                            className="text-4xl font-bold mb-2"
                            style={{ color: "#31b8c6" }}
                        >
                            Register
                        </h1>

                        <p className="text-gray-400 text-sm">
                            Create your account
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="johndoe"
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 rounded-lg text-white font-semibold disabled:opacity-50"
                            style={{ backgroundColor: "#31b8c6" }}
                        >
                            {loading
                                ? "Creating account..."
                                : "Register"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">

                            Already have an account?{" "}

                            <button
                                onClick={() => navigate("/login")}
                                className="font-semibold"
                                style={{ color: "#31b8c6" }}
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;