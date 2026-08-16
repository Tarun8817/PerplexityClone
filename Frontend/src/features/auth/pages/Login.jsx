import React, { useState, useEffect } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { handleLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState("");
    const [verifyMessage, setVerifyMessage] = useState("");

    const user = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.auth.loading);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("verified") === "true") {
            toast.success("Email verified successfully! You can now log in.");
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [location]);

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            await handleLogin({ email, password });
            toast.success("Logged in successfully!");
            navigate("/");
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Login failed";
            toast.error(errorMessage);
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
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center px-4 font-sans text-[var(--color-on-background)]">
            <div className="w-full max-w-md">

                {/* Main Login Card */}
                <div className="bg-[var(--color-surface-container-lowest)] rounded-lg shadow-sm p-8 border border-[var(--color-border-subtle)] transition-all duration-300">
                    <div className="text-center mb-14">
                        <h1 className="text-2xl font-semibold mb-2 tracking-tight text-[var(--color-on-background)]">
                            Welcome Back
                        </h1>
                        <p className="text-[var(--color-on-surface-variant)] text-sm">
                            Log in to continue to Perplexity
                        </p>
                    </div>

                    <form onSubmit={submitForm} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="w-full px-3 py-2.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-border-subtle)] rounded-lg text-[var(--color-on-background)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all placeholder-[var(--color-text-muted)]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-3 py-2.5 pr-10 bg-[var(--color-surface-container-lowest)] border border-[var(--color-border-subtle)] rounded-lg text-[var(--color-on-background)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all placeholder-[var(--color-text-muted)]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-on-background)] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 mt-2 rounded-lg text-[var(--color-on-primary)] font-medium bg-[var(--color-primary)] hover:bg-[var(--color-on-surface-variant)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Continue"}
                        </button>
                    </form>



                    <div className="mt-8 text-center">
                        <p className="text-[var(--color-on-surface-variant)] text-sm">
                            Don't have an account?{" "}
                            <button
                                onClick={() => navigate("/register")}
                                className="font-medium text-[var(--color-on-background)] hover:underline transition-colors"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-[var(--color-text-muted)]">
                        By continuing, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;