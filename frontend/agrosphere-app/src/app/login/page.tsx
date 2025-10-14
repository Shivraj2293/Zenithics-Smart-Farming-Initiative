// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/stores/authStore';
import apiClient from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { access_token } = response.data;
      const userProfile: any = jwtDecode(access_token);
    
    
      console.log("LOGIN PAGE - User profile from token:", userProfile);

      
      // Save the complete user profile to the store
      login(access_token, userProfile); 
      
      // Redirect to the central redirector
      router.push('/dashboard');
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid credentials. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Column: Branding & Image */}
      <div className="hidden md:block relative">
        <Image src="/images/auth-bg.jpg" alt="A vibrant agricultural field" fill style={{ objectFit: 'cover' }} quality={80} />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          <Link href="/" className="text-4xl font-extrabold text-green-400">Agrosphere</Link>
          <div>
            <p className="text-3xl font-bold">"The future of farming is here."</p>
            <p className="mt-2 text-lg text-gray-300">Join a community of farmers making data-driven decisions.</p>
          </div>
          <div></div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="flex flex-col justify-center items-center bg-gray-50 p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mb-8">Please sign in to access your dashboard.</p>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
            </div>
            <div className="flex items-center justify-end mb-6 -mt-4">
              <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
                  Forgot password?
              </Link>
           </div>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-transform transform hover:scale-105">Sign In</button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account? <Link href="/signup" className="text-green-600 font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}