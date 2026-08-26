import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();
    const { handleRegister } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
            toast.success("Registration successful! Please log in.");
            navigate("/login");
        } catch (error) {
            const errorMessage = 
                error.response?.data?.errors?.[0]?.message || 
                error.response?.data?.message || 
                "Registration failed";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center px-4 font-sans text-[var(--color-on-background)]">
            <div className="w-full max-w-md">
                
                {/* Main Register Card */}
                <div className="bg-[var(--color-surface-container-lowest)] rounded-lg shadow-sm p-8 border border-[var(--color-border-subtle)] transition-all duration-300">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold mb-2 tracking-tight text-[var(--color-on-background)]">
                            Create an Account
                        </h1>
                        <p className="text-[var(--color-on-surface-variant)] text-sm">
                            Join Perplexity to start searching
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="johndoe"
                                className="w-full px-3 py-2.5 bg-[var(--color-surface-container-lowest)] border border-[var(--color-border-subtle)] rounded-lg text-[var(--color-on-background)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all placeholder-[var(--color-text-muted)]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-[var(--color-on-surface-variant)]">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
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
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
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
                            {/* Password Validation Hints */}
                            {formData.password.length > 0 && (
                                <ul className="text-xs space-y-1 mt-2">
                                    <li className={formData.password.length >= 6 ? "text-green-500" : "text-red-500"}>
                                        {formData.password.length >= 6 ? "✓" : "✗"} At least 6 characters
                                    </li>
                                    <li className={/[A-Z]/.test(formData.password) ? "text-green-500" : "text-red-500"}>
                                        {/[A-Z]/.test(formData.password) ? "✓" : "✗"} At least one uppercase letter
                                    </li>
                                    <li className={/[0-9]/.test(formData.password) ? "text-green-500" : "text-red-500"}>
                                        {/[0-9]/.test(formData.password) ? "✓" : "✗"} At least one number
                                    </li>
                                </ul>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || formData.password.length < 6 || !/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)}
                            className="w-full py-2.5 mt-2 rounded-lg text-[var(--color-on-primary)] font-medium bg-[var(--color-primary)] hover:bg-[var(--color-on-surface-variant)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[var(--color-on-surface-variant)] text-sm">
                            Already have an account?{" "}
                            <button
                                onClick={() => navigate("/login")}
                                className="font-medium text-[var(--color-on-background)] hover:underline transition-colors"
                            >
                                Log in
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

export default Register;