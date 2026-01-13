import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, UserPlus } from 'lucide-react';
import api from '../api/axios';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpStage, setIsOtpStage] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [signupError, setSignupError] = useState('');
    const [verifyError, setVerifyError] = useState('');
    const navigate = useNavigate();

    const isStrongPassword = (pw) => {
        // At least 8 chars, uppercase, lowercase, number, special char
        const hasUpper = /[A-Z]/.test(pw);
        const hasLower = /[a-z]/.test(pw);
        const hasNumber = /[0-9]/.test(pw);
        const hasSpecial = /[^A-Za-z0-9]/.test(pw);
        const longEnough = pw.length >= 8;
        return hasUpper && hasLower && hasNumber && hasSpecial && longEnough;
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // Validate password strength before submitting
        if (!isStrongPassword(password)) {
            setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
            return;
        }

        setPasswordError('');
        setSignupError('');
        setIsLoading(true);

        try {
            const resp = await api.post('/auth/signup', { email, password });
            const msg = resp?.data?.message || resp?.data?.body?.message;
            // Move to OTP verification stage
            setIsOtpStage(true);
            // Optionally show inline info message in OTP view. Here we just switch views.
        } catch (error) {
            console.error('Signup error:', error);
            if (error.response) {
                const status = error.response.status;
                const msg = error.response.data?.message || error.response.data?.body?.message || 'Signup failed';
                if (status === 409) {
                    setSignupError('User already exists. Please log in instead.');
                } else {
                    setSignupError(msg);
                }
            } else {
                setSignupError('Network error. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!otp || otp.trim().length === 0) {
            alert('Please enter the OTP.');
            return;
        }

        setVerifyError('');
        setIsLoading(true);
        try {
            const resp = await api.post('/auth/verify-email', { email, otp });
            const msg = resp?.data?.message || resp?.data?.body?.message;
            // Redirect to profile creation page (not implemented yet)
            navigate('/create-profile');
        } catch (error) {
            console.error('Verify error:', error);
            const status = error.response?.status;
            const msg = error.response?.data?.message || error.response?.data?.body?.message || 'Verification failed. Please check the OTP and try again.';
            if (status === 400) {
                setVerifyError('Wrong OTP, retry again.');
            } else {
                setVerifyError(msg);
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-purple-600 p-3 rounded-full mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                        <p className="text-gray-300 text-sm">Join the MCP Multi-Agent System</p>
                    </div>

                    {!isOtpStage ? (
                        <form onSubmit={handleSignup} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter a strong password"
                                        required
                                    />
                                </div>
                                {passwordError && (
                                    <p className="text-red-400 text-xs mt-2">{passwordError}</p>
                                )}
                                {!passwordError && password.length > 0 && (
                                    <p className={`text-xs mt-2 ${isStrongPassword(password) ? 'text-green-400' : 'text-yellow-300'}`}>
                                        Must include uppercase, lowercase, number, special character, and be at least 8 characters.
                                    </p>
                                )}
                            </div>

                            {/* Inline signup error */}
                            {signupError && (
                                <div className="text-red-400 text-sm">
                                    {signupError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
                            >
                                {isLoading ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6">
                            {/* Info */}
                            <p className="text-gray-300 text-sm">An OTP has been sent to {email}. Please enter it below.</p>
                            {/* OTP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">
                                    Enter OTP
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]{4,6}"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter the OTP sent to your email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Inline verify error */}
                            {verifyError && (
                                <div className="text-red-400 text-sm">
                                    {verifyError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Verify'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-300">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-purple-400 hover:text-purple-300 font-medium"
                            >
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
