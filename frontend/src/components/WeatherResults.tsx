import Table from 'react-bootstrap/Table';
import {WeatherApiResult} from "src/scripts/types";
import {weatherMapping} from "src/scripts/mappings";
import "src/styles/WeatherResults.css"
import {formatDate} from "src/scripts/tools";

function WeatherResults({weatherStats, address, showDetailsCallback}: {
  weatherStats: WeatherApiResult,
  address: string,
  showDetailsCallback: (index: number) => void
}) {
  const tableRows = weatherStats.forecast.data.timelines[0].intervals.map(
      (detailStat, index) =>
          <tr key={index}>
            <td>{index + 1}</td>
            <td><a role="button" className="a:link"
                   onClick={() => showDetailsCallback(index)}>{formatDate(new Date(detailStat.startTime))}</a></td>
            <td>
              <img className="table-status-icon"
                   src={`src/assets/images/weather-symbols/${weatherMapping[(detailStat.values.weatherCode as keyof typeof weatherMapping)].iconName}`}
                   alt={weatherMapping[detailStat.values.weatherCode as keyof typeof weatherMapping].iconName}/>
              {weatherMapping[detailStat.values.weatherCode as keyof typeof weatherMapping].description}
            </td>
            <td>{detailStat.values.temperatureMax}</td>
            <td>{detailStat.values.temperatureMin}</td>
            <td>{detailStat.values.windSpeed}</td>
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