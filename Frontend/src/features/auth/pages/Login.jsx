import React, { useState } from "react";

import { useNavigate, Navigate } from "react-router-dom";

import { useAuth } from "../hook/useAuth";

import { useSelector } from "react-redux";

const Login = () => {

    const navigate = useNavigate();

    const { handleLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const user = useSelector(
        (state) => state.auth.user
    );

    const loading = useSelector(
        (state) => state.auth.loading
    );

    const submitForm = async (e) => {

        e.preventDefault();

        try {

            await handleLogin({
                email,
                password,
            });

            navigate("/");

        } catch (error) {
            console.log(error);
        }
    };

    if (!loading && user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">

                    <div className="text-center mb-8">

                        <h1
                            className="text-4xl font-bold mb-2"
                            style={{ color: "#31b8c6" }}
                        >
                            Login
                        </h1>

                        <p className="text-gray-400 text-sm">
                            Welcome back
                        </p>
                    </div>

                    <form
                        onSubmit={submitForm}
                        className="space-y-6"
                    >

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
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
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
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
                                ? "Logging in..."
                                : "Login"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">

                        <p className="text-gray-400 text-sm">

                            Don't have an account?{" "}

                            <button
                                onClick={() =>
                                    navigate("/register")
                                }
                                className="font-semibold"
                                style={{ color: "#31b8c6" }}
                            >
                                Register
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;