// src/app/signup/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import apiClient from '@/lib/api';

export default function SignupPage() {
  // Use a single state object to hold all form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    pincode: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // A single handler function to update the formData state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      // Send all form data to the backend
      await apiClient.post('/users', formData);
      // Show a success message and do not log in automatically
      setSuccessMessage('Account created! An admin will review and approve your request shortly.');
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        const messages = err.response.data.message;
        setError(Array.isArray(messages) ? messages.join(', ') : messages);
      } else {
        setError('Signup failed. The email might already be in use.');
      }
      console.error(err);
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Column: Branding & Image */}
      <div className="hidden md:block relative">
        <Image
          src="/images/auth-bg.jpg"
          alt="A vibrant agricultural field"
          fill
          style={{ objectFit: 'cover' }}
          quality={80}
        />
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

      {/* Right Column: Signup Form */}
      <div className="flex flex-col justify-center items-center bg-gray-50 p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Create an Account</h2>
          <p className="text-gray-600 mb-8">Start your journey with smart agriculture.</p>
          
          {/* Conditional rendering: show success message or the form */}
          {successMessage ? (
            <div className="text-center p-6 bg-green-100 text-green-800 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg">Thank You for Registering!</h3>
              <p className="mt-2">{successMessage}</p>
              <Link href="/login" className="mt-6 inline-block text-green-600 font-semibold hover:underline">
                → Back to Login Page
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
                </div>
                 <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
               <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password (min. 8 characters)</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
              
              {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
              
              <button type="submit" className="w-full bg-green-600 text-white py-3 mt-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-transform transform hover:scale-105">
                Request Approval
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <Link href="/login" className="text-green-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}