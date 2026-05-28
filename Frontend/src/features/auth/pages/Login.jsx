import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const { handleLogin } = useAuth()

    const navigate = useNavigate()

    const submitForm = async (event) => {
        event.preventDefault()
        try {
            setLoading(true)
            const payload = {
                email,
                password,
            }
            await handleLogin(payload)
            navigate("/")
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1
                            className="text-4xl font-bold mb-2"
                            style={{ color: '#31b8c6' }}
                        >
                            Login
                        </h1>

                        <p className="text-gray-400 text-sm mt-2">
                            Welcome back to Perplexity
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submitForm} className="space-y-6">

                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-300 mb-2"
                            >
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none transition"
                                onFocus={(e) => e.target.style.borderColor = '#31b8c6'}
                                onBlur={(e) => e.target.style.borderColor = ''}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-300 mb-2"
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none transition"
                                onFocus={(e) => e.target.style.borderColor = '#31b8c6'}
                                onBlur={(e) => e.target.style.borderColor = ''}
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <a
                                href="#"
                                className="text-sm transition"
                                style={{ color: '#31b8c6' }}
                            >
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: '#31b8c6' }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}

                            <button
                                onClick={() => navigate('/register')}
                                className="font-semibold transition bg-none border-none cursor-pointer"
                                style={{ color: '#31b8c6' }}
                            >
                                Register
                            </button>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login