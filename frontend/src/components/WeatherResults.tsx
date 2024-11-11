import Table from 'react-bootstrap/Table';
import {WeatherApiResult, WeatherStats} from "scripts/types";
import {weatherMapping} from "scripts/mappings";
import "styles/WeatherResults.css"
import {formatDate} from "scripts/tools";

function WeatherResults({weatherStats, address, showDetailsCallback}: {
  weatherStats: WeatherApiResult,
  address: string,
  showDetailsCallback: (index: number) => void
}) {
  const tableRows = weatherStats.forecast.data.timelines[0].intervals.map(
      (intervalStat, index) =>
          <tr>
            <td>{index + 1}</td>
            <td><a role="button" className="a:link"
                   onClick={() => showDetailsCallback(index)}>{formatDate(new Date(intervalStat.startTime))}</a></td>
            <td>
              <img className="table-status-icon"
                   src={require(`assets/images/weather-symbols/${weatherMapping[intervalStat.values.weatherCode as keyof typeof weatherMapping].iconName}`)}
                   alt={weatherMapping[intervalStat.values.weatherCode as keyof typeof weatherMapping].iconName}/>
              {weatherMapping[intervalStat.values.weatherCode as keyof typeof weatherMapping].description}
            </td>
            <td>{intervalStat.values.temperatureMax}</td>
            <td>{intervalStat.values.temperatureMax}</td>
            <td>{intervalStat.values.windSpeed}</td>
          </tr>
  )

  return (
      <div className="weather-results">
        <h3>Forecast at {address}</h3>
        <Table bordered={false} hover className="mt-3 weather-results-table">
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
      </div>
  );
}

export default WeatherResults;