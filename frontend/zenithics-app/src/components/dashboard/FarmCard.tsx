// src/components/dashboard/FarmCard.tsx
import Link from 'next/link';

interface Farm {
  id: string;
  name: string;
  landArea: number;
  status: 'pending' | 'active' | 'inactive';
}

export default function FarmCard({ farm }: { farm: Farm }) {
  const statusStyles = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Setup' },
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
  };

  const currentStatus = statusStyles[farm.status] || statusStyles.inactive;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{farm.name}</h3>
          <p className="text-gray-500">{farm.landArea} acres</p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${currentStatus.bg} ${currentStatus.text}`}>
          {currentStatus.label}
        </span>
      </div>
      <div className="mt-6">
        {farm.status === 'active' ? (
          <Link href={`/farms/${farm.id}`} className="w-full text-center block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            View Dashboard
          </Link>
        ) : (
          <button disabled className="w-full text-center block px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
            View Dashboard
          </button>
        )}
      </div>
    </div>
  );
}