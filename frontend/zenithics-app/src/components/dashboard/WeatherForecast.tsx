// A helper component to render weather detail icons
const DetailIcon = ({ type }: { type: 'rain' | 'wind' | 'humidity' }) => {
  if (type === 'rain') return <span title="Chance of Rain">💧</span>;
  if (type === 'wind') return <span title="Wind Speed">💨</span>;
  if (type === 'humidity') return <span title="Humidity">💧</span>;
  return null;
};

export default function WeatherForecast({ forecast }: { forecast: any[] }) {
  if (!forecast || forecast.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20 mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">7-Day Forecast</h2>
        <p className="text-gray-600">Weather forecast data is currently unavailable for this location.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20 mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900">7-Day Forecast</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
        {forecast.map((day: any, index: number) => (
          <div key={day.date} className="bg-gray-50/50 p-3 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-800">{index === 0 ? 'Today' : new Date(day.date).toLocaleDateString([], { weekday: 'short' })}</p>
            <img 
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} 
              alt={day.description} 
              className="w-16 h-16 mx-auto" 
            />
            <p className="text-sm capitalize text-gray-700">{day.description}</p>
            <p className="mt-2 font-bold text-lg text-gray-900">{Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°</p>
            <div className="flex justify-around text-xs mt-2 text-gray-700 font-medium">
                <span className="flex items-center"><DetailIcon type="rain" /> {Math.round(day.pop)}%</span>
                <span className="flex items-center"><DetailIcon type="humidity" /> {day.humidity}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

