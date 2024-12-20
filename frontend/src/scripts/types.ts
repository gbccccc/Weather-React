export interface DetailStats {
  startTime: string,
  values: {
    humidity: number,
    precipitationProbability: number,
    precipitationType: number,
    sunriseTime: string,
    sunsetTime: string,
    temperature: number,
    temperatureMax: number,
    temperatureMin: number,
    temperatureApparent: number,
    visibility: number,
    weatherCode: number,
    windSpeed: number
    cloudCover: number
  }
}

export interface HourlyDetailStats {
  startTime: string,
  values: {
    humidity: number,
    pressureSeaLevel: number,
    temperature: number,
    weatherCode: number,
    windDirection: number,
    windSpeed: number
  }
}

export interface WeatherStats {
  data: {
    timelines: {
      timestep: string,
      endTime: string,
      startTime: string,
      intervals: DetailStats[]
    }[]
  }
}

export interface HourlyStats {
  data: {
    timelines: {
      timestep: string,
      endTime: string,
      startTime: string,
      intervals: HourlyDetailStats[]
    }[]
  }
}

export interface WeatherApiResult {
  forecast: WeatherStats,
  hourly: HourlyStats,
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

export interface GeoLocation {
  latitude: number,
  longitude: number
}

export interface Address {
  city: string,
  state: string
}

export class EmptyDetailStats implements DetailStats {
  startTime = new Date().toTimeString();
  values = {
    humidity: 0,
    precipitationProbability: 0,
    precipitationType: 0,
    sunriseTime: "",
    sunsetTime: "",
    temperature: 0,
    temperatureMax: 0,
    temperatureMin: 0,
    temperatureApparent: 0,
    visibility: 0,
    weatherCode: 1000,
    windSpeed: 0,
    cloudCover: 0
  };
}

export interface AutocompletePrediction {
  "description": string,
  "matched_substrings": [
    {
      "length": number,
      "offset": number
    }
  ],
  "place_id": string,
  "reference": string,
  "structured_formatting": {
    "main_text": string,
    "main_text_matched_substrings": {
      "length": number,
      "offset": number
    }[],
    "secondary_text": string
  },
  "terms": {
    "offset": number,
    "value": string
  }[],
  "types": string[]
}

export interface AutocompleteOption {
  label: string,
  city: string,
  state: string
}