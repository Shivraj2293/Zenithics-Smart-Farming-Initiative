export default function StatCard({ title, value, unit, icon }: { title: string; value: string; unit: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20">
      <div className="flex items-center">
        <div className="bg-green-100 text-green-600 rounded-full p-3 mr-4">
          {icon}
        </div>
        <div>
          {/* Changed text-gray-500 to text-gray-700 */}
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {value} <span className="text-base font-medium text-gray-700">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
