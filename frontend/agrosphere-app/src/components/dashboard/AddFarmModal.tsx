// src/components/dashboard/AddFarmModal.tsx
'use client';

import { useState } from 'react';
import apiClient from '@/lib/api';

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFarmAdded: () => void; // Function to refresh the farm list
}

export default function AddFarmModal({ isOpen, onClose, onFarmAdded }: AddFarmModalProps) {
  const [farmName, setFarmName] = useState('');
  const [landArea, setLandArea] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.post('/farms', { name: farmName, landArea: Number(landArea) });
      onFarmAdded(); // Tell the parent page to refresh its data
      onClose(); // Close the modal
    } catch (err) {
      setError('Failed to create farm. Please try again.');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add Your First Farm</h2>
        <p className="text-gray-600 mb-6">Provide some basic details. Our team will contact you shortly to complete the setup and link your hardware.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">Farm Name</label>
            <input type="text" id="farmName" value={farmName} onChange={(e) => setFarmName(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="mb-6">
            <label htmlFor="landArea" className="block text-sm font-medium text-gray-700">Land Area (in acres)</label>
            <input type="number" id="landArea" value={landArea} onChange={(e) => setLandArea(e.target.value)} required className="mt-1 w-full px-3 py-2 border rounded-md" />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Submit for Approval</button>
          </div>
        </form>
      </div>
    </div>
  );
}