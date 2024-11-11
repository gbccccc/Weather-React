export interface IntervalStats {
  "startTime": string,
  "values": {
    "humidity": number,
    "precipitationProbability": number,
    "precipitationType": number,
    "sunriseTime": string,
    "sunsetTime": string,
    "temperatureMax": number,
    "temperatureMin": number,
    "visibility": number,
    "weatherCode": number,
    "windSpeed": number
  }
}

export interface WeatherStats {
  "data": {
    "timelines": {
      "timestep": string,
      "endTime": string,
      "startTime": string,
      "intervals": IntervalStats[]
    }[]
  }
}

export interface WeatherApiResult {
  "current": WeatherStats,
  "forecast": WeatherStats,
  "hourly": WeatherStats,
}

export class EmptyWeatherStats implements WeatherStats {
  data = {
    timelines: [{
      timestep: "",
      endTime: "",
      startTime: "",
      intervals: []
    }]
  }
}