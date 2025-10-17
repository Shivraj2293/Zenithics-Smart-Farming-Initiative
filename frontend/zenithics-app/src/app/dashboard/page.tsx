// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/stores/authStore'; // Import the auth store
import DashboardHeader from '@/components/layout/DashboardHeader';
import AddFarmModal from '@/components/dashboard/AddFarmModal';
import FarmCard from '@/components/dashboard/FarmCard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, _hasHydrated } = useAuthStore(); // Get user, token, and hydration status

  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // --- THIS IS THE FIX ---
    // Don't do anything until the session has loaded from storage and a token exists.
    if (!_hasHydrated || !token) {
      // If there's no token after hydration, it means the user is not logged in.
      if (_hasHydrated) router.push('/login');
      return;
    }

    // First, check if the user is an admin. If so, redirect immediately.
    if (user?.role === 'admin') {
      router.push('/admin/dashboard');
      return; // Stop execution for admins
    }

    // If we reach here, the user is a logged-in farmer. Proceed with fetching their data.
    const fetchFarms = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/farms');
        setFarms(response.data);
        if (response.data.length === 0) {
          setModalOpen(true);
        }
      } catch (error) {
        console.error("Failed to fetch farms", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFarms();

  }, [_hasHydrated, user, token, router]); // Effect now depends on the auth state

  // Render a loading screen while we check roles and fetch data
  if (!_hasHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }
  
  // Render the Farmer Dashboard UI
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <DashboardHeader title="My Farms" />
      
      <AddFarmModal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onFarmAdded={() => window.location.reload()}
      />

      {farms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map(farm => <FarmCard key={farm.id} farm={farm} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-700">Welcome to zenithics!</h2>
          <p className="text-gray-500 mt-2">You don't have any farms set up yet.</p>
          <button onClick={() => setModalOpen(true)} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Add Your First Farm
          </button>
        </div>
      )}
    </div>
  );
}