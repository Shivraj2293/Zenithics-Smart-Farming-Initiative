// src/app/(admin)/admin/sensors/page.tsx
'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import DashboardHeader from '@/components/layout/DashboardHeader';
import EditSensorModal from '@/components/admin/EditSensorModal'; // Import the new modal

interface Sensor {
  id: string;
  sensorId: string;
  name: string;
  type: string;
}

export default function AdminSensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for the edit modal
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  const fetchSensors = async () => {
    try { setLoading(true); const response = await apiClient.get('/admin/sensors'); setSensors(response.data); } 
    catch (err) { setError('Failed to fetch sensors.'); console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSensors(); }, []);

  const openEditModal = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setEditModalOpen(true);
  };


  // --- THIS IS THE NEW FUNCTION ---
  const handleDeleteSensor = async (sensorIdToDelete: string) => {
    // Show a confirmation dialog to prevent accidental deletion
    if (window.confirm('Are you sure you want to delete this sensor? This action cannot be undone.')) {
      try {
        // Call the DELETE endpoint on the backend
        await apiClient.delete(`/admin/sensors/${sensorIdToDelete}`);
        // Re-fetch the sensor list to update the UI
        await fetchSensors();
      } catch (err) {
        alert('Failed to delete sensor.');
        console.error(err);
      }
    }
  };

  

  return (
    <div>
      <DashboardHeader title="Sensor Management" />

      {isEditModalOpen && (
        <EditSensorModal
          sensor={selectedSensor}
          onClose={() => setEditModalOpen(false)}
          onSuccess={fetchSensors}
        />
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-bold mb-4">Registered Sensors</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Sensor ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sensors.map(sensor => (
                <tr key={sensor.id}>
                  <td className="px-4 py-3">{sensor.name}</td>
                  <td className="px-4 py-3 font-mono text-sm">{sensor.sensorId}</td>
                  <td className="px-4 py-3">{sensor.type}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => openEditModal(sensor)} className="text-blue-600 hover:text-blue-900 text-sm font-semibold">Edit</button>
                    <button onClick={() => handleDeleteSensor(sensor.id)} className="text-red-600 hover:text-red-900 text-sm font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}