// src/app/reset-password/[token]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/lib/api';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setMessage('');

    try {
      await apiClient.post(`/auth/reset-password/${token}`, { password });
      setMessage('Your password has been successfully reset! You can now log in.');
    } catch (err) {
      setError('This reset link is invalid or has expired. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full mx-auto">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Set a New Password</h2>
      </div>

      <div className="mt-8 max-w-md w-full mx-auto bg-white p-8 shadow-md rounded-lg">
        {message ? (
          <div className="text-center">
            <p className="text-green-700">{message}</p>
             <Link href="/login" legacyBehavior>
                <a className="mt-4 inline-block font-medium text-green-600 hover:text-green-500">
                    Proceed to Login →
                </a>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password">New Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mt-1 px-3 py-2 border rounded-md"/>
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full mt-1 px-3 py-2 border rounded-md"/>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white rounded-md">
                Reset Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}