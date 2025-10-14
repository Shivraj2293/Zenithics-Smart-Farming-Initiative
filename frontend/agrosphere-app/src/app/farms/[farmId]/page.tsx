'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

// Import all the dashboard components
import DashboardHeader from '@/components/layout/DashboardHeader';
import StatCard from '@/components/dashboard/StatCard';
import GaugeChart from '@/components/dashboard/GaugeChart';
import WeatherForecast from '@/components/dashboard/WeatherForecast';
import WeatherThemedBackground from '@/components/dashboard/WeatherThemedBackground';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Helper to determine the overall weather condition from the API description
const getWeatherCondition = (description: string): string => {
  if (!description) return 'Clear';
  const desc = description.toLowerCase();
  if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('storm')) return 'Rain';
  if (desc.includes('cloud')) return 'Clouds';
  return 'Clear'; // Default for 'clear', 'sunny', 'mist', etc.
};

export default function FarmDashboardPage() {
  const params = useParams();
  const farmId = params.farmId as string;
  const { token } = useAuthStore();

  const [farmDetails, setFarmDetails] = useState<any>(null);
  const [latestData, setLatestData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const weatherCondition = forecast.length > 0 ? getWeatherCondition(forecast[0].description) : 'Clear';

  useEffect(() => {
    if (!token || !farmId) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [detailsRes, latestRes, historicalRes] = await Promise.all([
          apiClient.get(`/farms/${farmId}`),
          apiClient.get(`/farms/${farmId}/sensordata/latest`),
          apiClient.get(`/farms/${farmId}/sensordata`),
        ]);
        
        setFarmDetails(detailsRes.data);
        setLatestData(latestRes.data);

        const formattedHistorical = historicalRes.data.map((item: any) => ({
          hour: new Date(item.hour).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avg_air_temp: item.avg_air_temp ? parseFloat(item.avg_air_temp).toFixed(1) : null,
          avg_soil_temp: item.avg_soil_temp ? parseFloat(item.avg_soil_temp).toFixed(1) : null,
          avg_air_humidity: item.avg_air_humidity ? parseFloat(item.avg_air_humidity).toFixed(1) : null,
          avg_soil_moisture: item.avg_soil_moisture ? parseFloat(item.avg_soil_moisture).toFixed(1) : null,
        }));
        setHistoricalData(formattedHistorical);

        const location = latestRes.data;
        if (location && location.latitude && location.longitude) {
          try {
            const forecastRes = await apiClient.get(`/weather/forecast?lat=${location.latitude}&lon=${location.longitude}`);
            setForecast(forecastRes.data);
          } catch (forecastError) {
            console.error("Failed to fetch weather forecast:", forecastError);
          }
        }
      } catch (error) { 
        console.error("Failed to fetch primary dashboard data:", error); 
      } finally { 
        setLoading(false); 
      }
    };

    fetchAllData();
  }, [farmId, token]);

  if (loading || !farmDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }
  
  const latest = (value: any) => value ? parseFloat(value).toFixed(1) : 'N/A';

  return (
    <WeatherThemedBackground condition={weatherCondition}>
      <DashboardHeader title={farmDetails.name} />
      {farmDetails.sensor && (
        <p className="text-white/90 -mt-4 mb-8 text-shadow">
          Monitoring via: <span className="font-semibold text-white">{farmDetails.sensor.name}</span>
        </p>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <GaugeChart title="Soil Moisture" value={Number(latest(latestData?.soil_moisture))} unit="%" color="#8884d8" />
          <GaugeChart title="Air Humidity" value={Number(latest(latestData?.air_humidity))} unit="%" color="#82ca9d" />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Air Temperature" value={latest(latestData?.air_temperature)} unit="°C" icon={<span>🌡️</span>} />
          <StatCard title="Soil Temperature" value={latest(latestData?.soil_temperature)} unit="°C" icon={<span>🌱</span>} />
          <StatCard title="Wind Speed" value={latest(latestData?.wind_speed)} unit="km/h" icon={<span>💨</span>} />
          <StatCard title="Rainfall (last hour)" value={latest(latestData?.rain)} unit="mm" icon={<span>💧</span>} />
        </div>
      </div>

      <WeatherForecast forecast={forecast} />

      <div className="mt-8 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20" style={{ height: '400px' }}>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Historical Trends (Last 24 Hours)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tick={{ fill: '#4B5563' }} />
            <YAxis tick={{ fill: '#4B5563' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avg_air_temp" name="Air Temp" stroke="#ef4444" connectNulls />
            <Line type="monotone" dataKey="avg_soil_temp" name="Soil Temp" stroke="#f97316" connectNulls />
            <Line type="monotone" dataKey="avg_air_humidity" name="Air Humidity" stroke="#3b82f6" connectNulls />
            <Line type="monotone" dataKey="avg_soil_moisture" name="Soil Moisture" stroke="#22c55e" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </WeatherThemedBackground>
  );
}

