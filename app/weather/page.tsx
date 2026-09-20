import {
  geocode,
  getWeather,
  detectLocationFromIP,
  describeWeatherCode,
  type WeatherResponse,
} from "@/lib/weather";

export default async function WeatherPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const params = await searchParams;
  const location = params.location || (await detectLocationFromIP()) || "Tamale";

  const place = await geocode(location);

  let weather: WeatherResponse | null = null;
  if (place) {
    weather = await getWeather(place.latitude, place.longitude);
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1">Weather</h1>
        <p className="text-gray-500 text-sm mb-6">
          Plan better. Farm smarter.
        </p>

        <form action="/weather" className="flex gap-2 mb-6">
          <input
            type="text"
            name="location"
            defaultValue={location}
            placeholder="Search a region or town..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="bg-green-700 text-white rounded px-5 py-2 font-medium"
          >
            Search
          </button>
        </form>

        {!place || !weather ? (
          <p className="text-gray-500">
            Couldn&apos;t find weather for &quot;{location}&quot;. Try another town or
            region name.
          </p>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm text-gray-500">
                  {place.name}
                  {place.admin1 ? `, ${place.admin1}` : ""}
                </p>
                <div className="text-right text-sm text-gray-500">
                  <p className="font-medium text-gray-700">Weather</p>
                  <p>
                    {new Date(weather.current.time).toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                    ,{" "}
                    {new Date(weather.current.time).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>{describeWeatherCode(weather.current.weather_code)}</p>
                </div>
              </div>
              <p className="text-4xl font-semibold mb-2">
                {Math.round(weather.current.temperature_2m)}°C
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <p className="text-gray-400">Humidity</p>
                  <p>{weather.current.relative_humidity_2m}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Wind</p>
                  <p>{Math.round(weather.current.wind_speed_10m)} km/h</p>
                </div>
                <div>
                  <p className="text-gray-400">Rain</p>
                  <p>{weather.current.precipitation} mm</p>
                </div>
              </div>
            </div>

            <h2 className="text-sm font-medium mb-3">Temperature Trend</h2>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              {(() => {
                const highs = weather.daily.temperature_2m_max;
                const lows = weather.daily.temperature_2m_min;
                const allTemps = [...highs, ...lows];
                const max = Math.max(...allTemps);
                const min = Math.min(...allTemps);
                const range = max - min || 1;

                const width = 700;
                const height = 120;
                const padding = 20;
                const stepX = (width - padding * 2) / (highs.length - 1);

                function yFor(temp: number) {
                  return (
                    height -
                    padding -
                    ((temp - min) / range) * (height - padding * 2)
                  );
                }

                const highPoints = highs
                  .map((t, i) => `${padding + i * stepX},${yFor(t)}`)
                  .join(" ");

                return (
                  <svg
                    viewBox={`0 0 ${width} ${height + 30}`}
                    className="w-full h-32"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      points={highPoints}
                      fill="none"
                      stroke="#15803d"
                      strokeWidth="2"
                    />
                    {highs.map((t, i) => (
                      <g key={i}>
                        <circle
                          cx={padding + i * stepX}
                          cy={yFor(t)}
                          r="3"
                          fill="#15803d"
                        />
                        <text
                          x={padding + i * stepX}
                          y={yFor(t) - 10}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#15803d"
                          fontWeight="600"
                        >
                          {Math.round(t)}°
                        </text>
                        <text
                          x={padding + i * stepX}
                          y={height + 20}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#9ca3af"
                        >
                          {new Date(weather.daily.time[i]).toLocaleDateString(
                            "en-US",
                            { weekday: "short" }
                          )}
                        </text>
                        <text
                          x={padding + i * stepX}
                          y={height + 30}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#d1d5db"
                        >
                          {new Date(weather.daily.time[i]).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </text>
                      </g>
                    ))}
                  </svg>
                );
              })()}
            </div>

            <h2 className="text-sm font-medium mb-3">7-Day Forecast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {weather.daily.time.map((date, i) => (
                <div
                  key={date}
                  className="bg-white rounded-lg shadow p-3 text-center text-sm"
                >
                  <p className="text-gray-500 text-xs mb-1">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <p className="font-medium">
                    {Math.round(weather.daily.temperature_2m_max[i])}°
                  </p>
                  <p className="text-gray-400 text-xs">
                    {Math.round(weather.daily.temperature_2m_min[i])}°
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {describeWeatherCode(weather.daily.weather_code[i])}
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    💧 {weather.daily.precipitation_probability_max[i]}%
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}