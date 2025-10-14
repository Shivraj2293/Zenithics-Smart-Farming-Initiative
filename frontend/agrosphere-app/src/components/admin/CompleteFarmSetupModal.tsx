// src/components/admin/CompleteFarmSetupModal.tsx
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

interface Sensor {
  id: string; // The UUID we need to send
  name: string;
  sensorId: string; // The human-readable ID
}
interface Farm {
  id: string;
  name: string;
}
interface ModalProps {
  farm: Farm | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CompleteFarmSetupModal({ farm, onClose, onSuccess }: ModalProps) {
  const [availableSensors, setAvailableSensors] = useState<Sensor[]>([]);
  const [selectedSensor, setSelectedSensor] = useState('');
  const [error, setError] = useState('');

  // Fetch the list of available sensors when the modal opens
  useEffect(() => {
    if (!farm) return; // Don't fetch if there's no farm selected

    const fetchSensors = async () => {
      try {
        // In the future, we can filter for unassigned sensors: /admin/sensors?assigned=false
        const response = await apiClient.get('/admin/sensors');
        setAvailableSensors(response.data);
      } catch (err) {
        setError('Could not load available sensors.');
      }
    };
    fetchSensors();
  }, [farm]); // Re-run when the farm prop changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!farm || !selectedSensor) {
      setError('Please select a sensor.');
      return;
    }

    try {
      // Send the selected sensor's DATABASE ID (the UUID) to the backend
      await apiClient.patch(`/admin/farms/${farm.id}/complete-setup`, { sensorId: selectedSensor });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to update farm. Please try again.');
    }
  };

  if (!farm) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Complete Setup for <span className="text-green-600">{farm.name}</span></h2>
        <p className="text-gray-600 mb-6">Assign an available IoT sensor to activate this farm.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="sensorId" className="block text-sm font-medium text-gray-700">Available Sensors</label>
            <select
              id="sensorId"
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-md"
            >
              <option value="" disabled>-- Select a Sensor --</option>
              {availableSensors.map(sensor => (
                <option key={sensor.id} value={sensor.id}>
                  {sensor.name} ({sensor.sensorId})
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Activate Farm</button>
          </div>
        </form>
      </div>
    </div>
  );
}