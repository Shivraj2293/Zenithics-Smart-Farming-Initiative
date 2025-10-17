// src/components/dashboard/GaugeChart.tsx
'use client';

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export default function GaugeChart({ title, value, unit, color }: { title: string; value: number; unit: string; color: string }) {
  // Ensure value is a number and handle NaN cases
  const displayValue = isNaN(value) ? 0 : value;
  const data = [{ name: title, value: displayValue }];

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20 h-64 flex flex-col">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            innerRadius="70%" 
            outerRadius="85%" 
            data={data} 
            startAngle={180} 
            endAngle={0}
            barSize={20}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar 
              background 
              dataKey="value" 
              angleAxisId={0} 
              fill={color} 
              cornerRadius={10} 
            />
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-gray-800">
              {displayValue.toFixed(1)}
              <tspan className="text-2xl font-medium fill-gray-600">{unit}</tspan>
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}