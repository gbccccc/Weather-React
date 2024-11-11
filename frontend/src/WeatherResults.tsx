import Table from 'react-bootstrap/Table';
import {WeatherApiResult, WeatherStats} from "./styles/interfaces";
import {weatherMapping} from "./mappings";

function WeatherResults({weatherStats, address}: {
  weatherStats: WeatherApiResult,
  address: string
}) {
  const tableRows = weatherStats.forecast.data.timelines[0].intervals.map(
      (intervalStat, index) =>
          <tr>
            <td>{index}</td>
            <td>{intervalStat.startTime}</td>
            <td>
              {weatherMapping[intervalStat.values.weatherCode as keyof typeof weatherMapping].description}
              <img className="table-status-icon"
                   src={`src/assets/images/weather-symbols/${weatherMapping[intervalStat.values.weatherCode as keyof typeof weatherMapping].iconName}`}
                   alt={weatherMapping[intervalStat.values.weatherCode as keyof typeof weatherMapping].iconName}/>
            </td>
            <td>{intervalStat.values.temperatureMax}</td>
            <td>{intervalStat.values.temperatureMax}</td>
            <td>{intervalStat.values.windSpeed}</td>
          </tr>
  )

  return (
      <Table striped bordered hover className="mt-3">
        <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Status</th>
          <th>Temp. High(&deg;F)</th>
          <th>Temp. Low(&deg;F)</th>
          <th>Wind Speed(mph)</th>
        </tr>
        </thead>
        <tbody>
        {tableRows}
        </tbody>
      </Table>
  );
}

export default WeatherResults;