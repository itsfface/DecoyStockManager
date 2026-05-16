"use client";

import { useState } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore.js';

export default function DecoyLogin() {
    const router = useRouter();

    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Cleaned up unused destructured variables from the store
    const { login, isLoggingIn } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!employeeId || !password) return;

        try {
            const formData = { employeeId, password };
            const loggedInUser = await login(formData);

            if (!loggedInUser) return; // Errors are handled by the store's toast

            // Route based on role
            if (loggedInUser.role === "ADMIN") {
                router.push("/dashboard");
            } else if (loggedInUser.role === "STORE MANAGER") {
                router.push("/employee-dashboard");
            } else {
                // Fallback route
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Login route failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50/50 flex flex-col justify-center items-center p-4 sm:p-6 font-sans text-neutral-900 selection:bg-neutral-200">
            
            {/* Main Login Card - Added smooth fade-in animation */}
            <div className="w-full max-w-md bg-white rounded-[24px] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-neutral-200/60 p-8 sm:p-12 animate-in fade-in zoom-in-[0.98] duration-500">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-full flex justify-center mb-2">
                        <Image
                            src="/logo.png"
                            width={160} // Adjusted for crispness, Next.js handles scaling
                            height={60}
                            alt="Decoy Logo"
                            className="object-contain"
                            priority // Ensures logo loads instantly
                        />
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    
                    {/* Employee ID Input */}
                    <div>
                        <label
                            htmlFor="employeeId"
                            className="block text-sm font-semibold text-neutral-700 mb-1.5"
                        >
                            Employee ID
                        </label>
                        <input
                            id="employeeId"
                            type="text"
                            autoComplete="username" // Helps password managers
                            required
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="000000"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-neutral-100 focus:border-neutral-400 focus:bg-white transition-all text-sm font-medium placeholder:text-neutral-400"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-neutral-700 mb-1.5"
                        >
                            Password
                        </label>
                        <div className="relative flex items-center group">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password" // Helps password managers
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-4 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-neutral-100 focus:border-neutral-400 focus:bg-white transition-all text-sm font-medium placeholder:text-neutral-400"
                            />
                            
                            {/* Password Visibility Toggle */}
                            <button
                                type="button"
                                tabIndex="-1" // Prevents tab-targeting when navigating form
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-neutral-900"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full flex justify-center items-center gap-2 bg-neutral-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-200 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 mt-4 shadow-sm"
                    >
                        {isLoggingIn ? (
                            <>
                                <svg className="w-4 h-4 animate-spin text-white/70" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Authenticating...
                            </>
                        ) : (
                            "Log In"
                        )}
                    </button>
                </form>

                {/* Footer info */}
                <div className="mt-8 text-center text-xs font-medium text-neutral-400">
                    <p>Secure Portal v2.4.1</p>
                    <p className="mt-1">Authorized personnel only.</p>
                </div>
            </div>

        </div>
    );
}