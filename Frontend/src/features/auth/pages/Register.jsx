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
        <div className="min-h-screen bg-[var(--color-base)] flex flex-col items-center justify-center px-4 font-sans text-[var(--color-primary)]">
            <div className="w-full max-w-md">
                
                {/* Main Register Card */}
                <div className="bg-[var(--color-base-darker)] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-10 border border-[var(--color-base-lighter)] transition-all duration-300">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-semibold mb-2 tracking-tight text-[var(--color-primary)]">
                            Create an Account
                        </h1>
                        <p className="text-[var(--color-secondary)] text-sm">
                            Join Perplexity to start searching
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-[var(--color-secondary)]">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="johndoe"
                                className="w-full px-4 py-3 bg-[var(--color-base)] border border-[var(--color-base-lighter)] rounded-xl text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all placeholder-[var(--color-secondary)] opacity-80 focus:opacity-100"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-[var(--color-secondary)]">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-[var(--color-base)] border border-[var(--color-base-lighter)] rounded-xl text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all placeholder-[var(--color-secondary)] opacity-80 focus:opacity-100"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-[var(--color-secondary)]">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-[var(--color-base)] border border-[var(--color-base-lighter)] rounded-xl text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all placeholder-[var(--color-secondary)] opacity-80 focus:opacity-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-6 rounded-xl text-white font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[var(--color-secondary)] text-sm">
                            Already have an account?{" "}
                            <button
                                onClick={() => navigate("/login")}
                                className="font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                            >
                                Log in
                            </button>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;