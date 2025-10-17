// src/components/layout/Sidebar.tsx
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        zenithics <span className="font-light text-green-400">Admin</span>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <Link href="/admin/dashboard" className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors">
          <span className="mr-3">📊</span> Dashboard
        </Link>
        <Link href="/admin/users" className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors">
          <span className="mr-3">👥</span> Users
        </Link>
        <Link href="/admin/sensors" className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors">
          <span className="mr-3">📡</span> Sensors
        </Link>
        <Link href="/admin/farms" className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors">
          <span className="mr-3">🌾</span> Farms
        </Link>
      </nav>
    </aside>
  );
}