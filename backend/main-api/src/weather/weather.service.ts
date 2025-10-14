import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getForecast(lat: number, lon: number) {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    
    // --- THIS IS THE FIX ---
    // Switched to the "5 day / 3 hour" forecast endpoint, which is included in the free tier.
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    return this.httpService.get(url).pipe(
      map(response => this.formatForecast(response.data))
    );
  }

  private formatForecast(data: any) {
    if (!data.list) return [];

    // The free API returns a list of 40 timestamps (every 3 hours for 5 days).
    // We need to process this list to find the min/max temp for each day.
    const dailyForecasts: { [key: string]: any } = {};

    for (const item of data.list) {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!dailyForecasts[date]) {
        // If this is the first entry for this day, initialize it.
        dailyForecasts[date] = {
          date: date,
          temps: [],
          descriptions: {},
          icons: {},
          pops: [], // probability of precipitation
          humidities: [],
        };
      }
      
      // Collect all data points for the day
      dailyForecasts[date].temps.push(item.main.temp);
      dailyForecasts[date].humidities.push(item.main.humidity);
      dailyForecasts[date].pops.push(item.pop);
      const weatherDesc = item.weather[0].description;
      const weatherIcon = item.weather[0].icon;
      dailyForecasts[date].descriptions[weatherDesc] = (dailyForecasts[date].descriptions[weatherDesc] || 0) + 1;
      dailyForecasts[date].icons[weatherIcon] = (dailyForecasts[date].icons[weatherIcon] || 0) + 1;
    }

    // Now, process the collected data to get a daily summary
    return Object.values(dailyForecasts).map((day: any) => {
      // Find the most common weather description and icon for the day
      const mostCommonDescription = Object.keys(day.descriptions).reduce((a, b) => day.descriptions[a] > day.descriptions[b] ? a : b);
      const mostCommonIcon = Object.keys(day.icons).reduce((a, b) => day.icons[a] > day.icons[b] ? a : b);

      return {
        date: day.date,
        temp_min: Math.min(...day.temps),
        temp_max: Math.max(...day.temps),
        description: mostCommonDescription,
        icon: mostCommonIcon,
        humidity: Math.round(day.humidities.reduce((a: number, b: number) => a + b, 0) / day.humidities.length),
        pop: Math.round(Math.max(...day.pops) * 100),
      };
    }).slice(0, 5); // Ensure we only return 5 days
  }
}

