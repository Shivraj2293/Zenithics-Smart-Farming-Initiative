'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import DashboardHeader from '@/components/layout/DashboardHeader';
import CompleteFarmSetupModal from '@/components/admin/CompleteFarmSetupModal';

interface Farm {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'inactive';
  cropType: string;
  createdAt: string;
  ownerName: string;
}

export default function AdminFarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('DESC');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/admin/farms?sortBy=${sortBy}&order=${order}`);
      setFarms(response.data);
    } catch (error) {
      console.error("Failed to fetch farms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, [sortBy, order]);

  const openSetupModal = (farm: Farm) => {
    setSelectedFarm(farm);
    setModalOpen(true);
  };

  // --- THIS IS THE NEW DELETE FUNCTION ---
  const handleDeleteFarm = async (farmId: string, farmName: string) => {
    if (window.confirm(`Are you sure you want to delete the farm "${farmName}"? This action cannot be undone.`)) {
      try {
        await apiClient.delete(`/admin/farms/${farmId}`);
        await fetchFarms(); // Re-fetch the list to update the UI
      } catch (err) {
        alert('Failed to delete farm.');
        console.error(err);
      }
    }
  };

  const statusStyles: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
  };

  return (
    <div>
      <DashboardHeader title="Farm Management" />
      
      {isModalOpen && (
        <CompleteFarmSetupModal 
          farm={selectedFarm} 
          onClose={() => setModalOpen(false)} 
          onSuccess={fetchFarms}
        />
      )}

      {loading ? (
        <p>Loading farms...</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farm Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {farms.map((farm) => (
                <tr key={farm.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{farm.name}</td>
                  <td className="px-6 py-4 text-gray-500">{farm.ownerName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[farm.status]}`}>
                      {farm.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(farm.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-medium space-x-4">
                    {farm.status === 'pending' && (
                      <button 
                        onClick={() => openSetupModal(farm)}
                        className="text-blue-600 hover:text-blue-900 font-semibold"
                      >
                        Complete Setup
                      </button>
                    )}
                    {/* --- THIS IS THE NEW DELETE BUTTON --- */}
                    <button 
                      onClick={() => handleDeleteFarm(farm.id, farm.name)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}