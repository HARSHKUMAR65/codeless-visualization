'use client';
import React, { useState } from 'react';
import { useLogin } from '@/app/hooks/useAuth';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { mutate: login, isPending, error } = useLogin();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { email, password } = e.target as typeof e.target & {
            email: { value: string };
            password: { value: string };
        };
        login({ email: email.value, password: password.value });
    };
    return (
        <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md w-full">
                <div className="mb-10">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={200}
                        height={300}
                        className="mx-auto"
                    />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Email Address
                        </label>
                        <Input type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="your@email.com"
                            required />
                    </div>
                    <div className="mb-4 relative">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Password
                        </label>
                        <Input type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                            placeholder="Enter your password"
                            required />
                        <div
                            className="absolute inset-y-0  right-3 flex items-center cursor-pointer text-gray-500 h-[40px] top-7"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-center text-sm">{error.message}</p>}
                    <Button type="submit" disabled={isPending} > {isPending ? 'Logging in...' : 'Login'}</Button>
                </form>
            </div>
        </div>
    );
};
export default Login;
