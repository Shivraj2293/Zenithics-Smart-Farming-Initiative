// src/components/admin/EditSensorModal.tsx
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

interface Sensor {
  id: string;
  name: string;
  type: string;
}
interface ModalProps {
  sensor: Sensor | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditSensorModal({ sensor, onClose, onSuccess }: ModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (sensor) {
      setName(sensor.name);
      setType(sensor.type);
    }
  }, [sensor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!sensor) return;

    try {
      await apiClient.patch(`/admin/sensors/${sensor.id}`, { name, type });
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to update sensor.');
    }
  };

  if (!sensor) return null;

  return (
    <div className="relative z-50">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Edit Sensor</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium">Friendly Name</label>
                  <input type="text" id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full p-2 border rounded-md"/>
                </div>
                <div>
                  <label htmlFor="edit-type" className="block text-sm font-medium">Sensor Type</label>
                  <input type="text" id="edit-type" value={type} onChange={(e) => setType(e.target.value)} required className="mt-1 w-full p-2 border rounded-md"/>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}