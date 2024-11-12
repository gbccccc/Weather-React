export interface DetailStats {
  "startTime": string,
  "values": {
    "humidity": number,
    "precipitationProbability": number,
    "precipitationType": number,
    "sunriseTime": string,
    "sunsetTime": string,
    "temperatureMax": number,
    "temperatureMin": number,
    "temperatureApparent": number,
    "visibility": number,
    "weatherCode": number,
    "windSpeed": number
    "cloudCover": number
  }
}

export interface WeatherStats {
  "data": {
    "timelines": {
      "timestep": string,
      "endTime": string,
      "startTime": string,
      "intervals": DetailStats[]
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

export class EmptyDetailStats implements DetailStats {
  startTime = new Date().toTimeString();
  values = {
    humidity: 0,
    precipitationProbability: 0,
    precipitationType: 0,
    sunriseTime: "",
    sunsetTime: "",
    temperatureMax: 0,
    temperatureMin: 0,
    temperatureApparent: 0,
    visibility: 0,
    weatherCode: 1000,
    windSpeed: 0,
    cloudCover: 0
  };
}