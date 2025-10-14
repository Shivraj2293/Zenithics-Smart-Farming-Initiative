// src/components/admin/AdminFarmCard.tsx
import Link from 'next/link';

interface Farm {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'inactive';
  ownerName: string;
}

export default function AdminFarmCard({ farm }: { farm: Farm }) {
  const statusStyles = {
    pending: { border: 'border-yellow-500', text: 'text-yellow-600', label: 'Pending Setup' },
    active: { border: 'border-green-500', text: 'text-green-600', label: 'Active' },
    inactive: { border: 'border-gray-400', text: 'text-gray-500', label: 'Inactive' },
  };
  const currentStatus = statusStyles[farm.status] || statusStyles.inactive;

  return (
    <Link 
      href={`/admin/farms/${farm.id}`} // Link to a future detailed view
      className="bg-white rounded-lg shadow-md border-l-4 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
      style={{ borderColor: currentStatus.border.replace('border-', '#') }} // Dynamic border color
    >
      <div className="p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{farm.name}</h3>
          <span className={`text-xs font-semibold ${currentStatus.text}`}>
            ● {currentStatus.label}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Owner: <span className="font-medium text-gray-700">{farm.ownerName}</span>
        </p>
      </div>
    </Link>
  );
}