'use client';

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function DashboardHeader({ title }: { title: string }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 pb-4 border-b border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">{title}</h1>
      <div className="flex items-center">
        {/* Changed text-gray-600 to text-gray-700 for better contrast */}
        <span className="text-gray-700 mr-4">
          Welcome, <span className="font-semibold">{user?.email || 'User'}</span>
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
