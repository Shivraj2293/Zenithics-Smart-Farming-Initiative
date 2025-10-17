// src/app/(admin)/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import DashboardHeader from '@/components/layout/DashboardHeader';
import AdminFarmCard from '@/components/admin/AdminFarmCard'; // Import the new component

// Define types for our data
interface Stats {
  totalFarmers: number;
  totalFarms: number;
  activeDevices: number;
}
interface Farm {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'inactive';
  ownerName: string;
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-500 font-medium">{title}</h3>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalFarmers: 0, totalFarms: 0, activeDevices: 0 });
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Fetch both stats and farms at the same time for efficiency
        const [statsResponse, farmsResponse] = await Promise.all([
          apiClient.get('/admin/stats'),
          apiClient.get('/admin/farms'),
        ]);
        setStats(statsResponse.data);
        setFarms(farmsResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div>
      <DashboardHeader title="Platform Overview" />

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Farmers" value={stats.totalFarmers} />
            <StatCard title="Total Farms" value={stats.totalFarms} />
            <StatCard title="Active Sensors (24h)" value={stats.activeDevices} />
          </div>

          {/* All Farms Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Farms</h2>
            {farms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {farms.map((farm) => (
                  <AdminFarmCard key={farm.id} farm={farm} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No farms have been created yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}