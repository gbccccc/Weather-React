import "src/styles/WeatherDetails.css"
import {DetailStats} from "../scripts/types.ts";
import {formatDate, formatTime} from "../scripts/tools.ts";
import {Button, Table} from "react-bootstrap";
import {weatherMapping} from "../scripts/mappings.ts";

function WeatherDetails({detailStats, showResultsCallback}: {
  detailStats: DetailStats,
  showResultsCallback: () => void
}) {
  return (
      <div className="weather-details">
        <h3>{formatDate(new Date(detailStats.startTime))}</h3>
        <div className="results-buttons justify-content-between">
          <Button variant="outline-secondary" onClick={showResultsCallback}>List</Button>
          <Button variant="outline-secondary">X</Button>
        </div>
        <Table bordered={false} striped hover className="mt-3">
          <tbody>
          <tr>
            <td>Status</td>
            <td>{weatherMapping[detailStats.values.weatherCode as keyof typeof weatherMapping].description}</td>
          </tr>
          <tr>
            <td>Max Temperature</td>
            <td>{detailStats.values.temperatureMax}&deg;F</td>
          </tr>
          <tr>
            <td>Min Temperature</td>
            <td>{detailStats.values.temperatureMin}&deg;F</td>
          </tr>
          <tr>
            <td>Apparent Temperature</td>
            <td>{detailStats.values.temperatureApparent}&deg;F</td>
          </tr>
          <tr>
            <td>Sunrise Time</td>
            <td>{formatTime(new Date(detailStats.values.sunriseTime))}</td>
          </tr>
          <tr>
            <td>Sunset Time</td>
            <td>{formatTime(new Date(detailStats.values.sunsetTime))}</td>
          </tr>
          <tr>
            <td>Humidity</td>
            <td>{detailStats.values.humidity}%</td>
          </tr>
          <tr>
            <td>Wind Speed</td>
            <td>{detailStats.values.windSpeed}mph</td>
          </tr>
          <tr>
            <td>Visibility</td>
            <td>{detailStats.values.visibility}mi</td>
          </tr>
          <tr>
            <td>Cloud Cover</td>
            <td>{detailStats.values.cloudCover}%</td>
          </tr>
          </tbody>
        </Table>
      </div>
  )
}

export default WeatherDetails;