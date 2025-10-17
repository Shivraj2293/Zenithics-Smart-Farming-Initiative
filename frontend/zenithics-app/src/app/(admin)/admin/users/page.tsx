// src/app/(admin)/admin/users/page.tsx
'use client';

import { useEffect, useState, Fragment } from 'react';
import apiClient from '@/lib/api';
import DashboardHeader from '@/components/layout/DashboardHeader';
import CompleteFarmSetupModal from '@/components/admin/CompleteFarmSetupModal';

// Define types
interface Farm {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'inactive';
}
interface User {
  id: string;
  fullName: string;
  email: string;
  isApproved: boolean;
  role: 'admin' | 'farmer';
  farms: Farm[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const cacheBust = new Date().getTime();
      const response = await apiClient.get(`/admin/users?_=${cacheBust}`);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleApproveUser = async (userId: string) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/approve`);
      await fetchUsers();
    } catch (err) { alert('Failed to approve user.'); }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'farmer') => {
    try {
      await apiClient.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      alert('Failed to update role.');
      console.error(err);
    }
  };

  const handleToggleFarms = (userId: string) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };
  const openSetupModal = (farm: Farm) => {
    setSelectedFarm(farm);
    setModalOpen(true);
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This will also delete all their farms.`)) {
      try {
        await apiClient.delete(`/admin/users/${userId}`);
        await fetchUsers(); // Refresh the list
      } catch (err) {
        alert('Failed to delete user.');
      }
    }
  };

  const renderContent = () => {
    if (loading) return <p className="mt-6 text-center text-gray-500">Loading users...</p>;
    if (error) return <p className="mt-6 text-center text-red-500">{error}</p>;
    if (users.length === 0) return <p className="mt-6 text-center text-gray-500">No users found.</p>;
    
    return (
      <div className="bg-white rounded-lg shadow-md mt-6 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <Fragment key={user.id}>
                {/* Main User Row */}
                <tr onClick={() => handleToggleFarms(user.id)} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'farmer')}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm border-gray-300 rounded-md"
                    >
                      <option value="farmer">Farmer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {user.isApproved ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span> : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    {/* --- ACTION BUTTONS --- */}
                    {!user.isApproved && <button onClick={(e) => { e.stopPropagation(); handleApproveUser(user.id); }} className="text-indigo-600 hover:text-indigo-900 font-semibold">Approve</button>}
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id, user.fullName); }} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
                  </td>
                </tr>
                
                {/* --- COLLAPSIBLE FARM LIST --- */}
                {expandedUserId === user.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="p-4">
                      <div className="p-4 bg-white rounded-md border">
                         <h4 className="font-semibold mb-2">{user.farms.length > 0 ? 'Farms:' : 'No farms associated with this user.'}</h4>
                         <ul className="space-y-2">
                          {user.farms.map(farm => (
                            <li key={farm.id} className="flex justify-between items-center py-1">
                              <div>
                                <span>{farm.name}</span>
                                <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${farm.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {farm.status}
                                </span>
                              </div>
                              {farm.status === 'pending' && <button onClick={() => openSetupModal(farm)} className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full text-xs font-semibold">Complete Setup</button>}
                            </li>
                          ))}
                         </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <DashboardHeader title="User Management" />
      <CompleteFarmSetupModal farm={selectedFarm} onClose={() => setModalOpen(false)} onSuccess={fetchUsers} />
      {renderContent()}
    </div>
  );
}