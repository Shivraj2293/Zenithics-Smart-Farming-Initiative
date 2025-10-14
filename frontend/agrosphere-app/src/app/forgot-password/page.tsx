// src/app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      // We show a generic message even on error to prevent email enumeration
      setMessage('If an account with that email exists, a password reset link has been sent.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Forgot Your Password?</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          No problem. Enter your email address below and we'll send you a link to reset it.
        </p>
      </div>

      <div className="mt-8 max-w-md w-full mx-auto bg-white p-8 shadow-md rounded-lg">
        {message ? (
          <div className="text-center">
            <p className="text-green-700">{message}</p>
            <Link href="/login" legacyBehavior>
                <a className="mt-4 inline-block font-medium text-green-600 hover:text-green-500">
                    ← Back to Login
                </a>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-md"/>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                Send Reset Link
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}