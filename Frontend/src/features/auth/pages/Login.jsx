import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

const Login = () => {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyEmail, setVerifyEmail] = useState("");
    const [verifyMessage, setVerifyMessage] = useState("");

    const user = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.auth.loading);

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            await handleLogin({ email, password });
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const handleForceVerify = async (e) => {
        e.preventDefault();
        setVerifyMessage("Verifying...");
        try {
            const response = await fetch("http://localhost:3000/api/auth/dev-verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: verifyEmail })
            });
            const data = await response.json();
            if (data.success) {
                setVerifyMessage("✅ Verified! You can now log in.");
            } else {
                setVerifyMessage("❌ " + (data.message || "Failed to verify"));
            }
        } catch (err) {
            setVerifyMessage("❌ Server error");
        }
    };

    if (!loading && user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-[var(--color-base)] flex flex-col items-center justify-center px-4 font-sans text-[var(--color-primary)]">
            <div className="w-full max-w-md">
                
                {/* Main Login Card */}
                <div className="bg-[var(--color-base-darker)] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-10 border border-[var(--color-base-lighter)] transition-all duration-300">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-semibold mb-2 tracking-tight text-[var(--color-primary)]">
                            Welcome Back
                        </h1>
                        <p className="text-[var(--color-secondary)] text-sm">
                            Log in to continue to Perplexity
                        </p>
                    </div>

                    <form onSubmit={submitForm} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-[var(--color-secondary)]">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-[var(--color-base)] border border-[var(--color-base-lighter)] rounded-xl text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all placeholder-[var(--color-secondary)] opacity-80 focus:opacity-100"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-[var(--color-secondary)]">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-[var(--color-base)] border border-[var(--color-base-lighter)] rounded-xl text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all placeholder-[var(--color-secondary)] opacity-80 focus:opacity-100"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 rounded-xl text-white font-medium bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? "Logging in..." : "Continue"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[var(--color-secondary)] text-sm">
                            Don't have an account?{" "}
                            <button
                                onClick={() => navigate("/register")}
                                className="font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>

                {/* Dev Tools Card */}
                <div className="mt-6 bg-[var(--color-base-darker)]/50 rounded-xl p-5 border border-dashed border-[var(--color-base-lighter)] backdrop-blur-sm">
                    <p className="text-xs text-[var(--color-secondary)] mb-3 font-semibold uppercase tracking-wider">Dev Tool: Quick Verify</p>
                    <form onSubmit={handleForceVerify} className="flex gap-2">
                        <input
                            type="email"
                            value={verifyEmail}
                            onChange={(e) => setVerifyEmail(e.target.value)}
                            placeholder="Email to verify"
                            required
                            className="flex-1 px-3 py-2 text-sm bg-[var(--color-base)] border border-[var(--color-base-lighter)] rounded-lg text-[var(--color-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                        />
                        <button type="submit" className="px-4 py-2 text-sm bg-[var(--color-base-lighter)] hover:bg-gray-600 rounded-lg text-white transition-colors">
                            Verify
                        </button>
                    </form>
                    {verifyMessage && (
                        <p className="mt-2 text-xs text-[var(--color-secondary)]">{verifyMessage}</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Login;