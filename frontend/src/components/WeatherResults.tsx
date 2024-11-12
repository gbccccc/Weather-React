import Table from 'react-bootstrap/Table';
import {WeatherApiResult} from "src/scripts/types";
import {weatherMapping} from "src/scripts/mappings";
import "src/styles/WeatherResults.css"
import {formatDate} from "src/scripts/tools";
import {Button, Tab, Tabs} from "react-bootstrap";
import Meteogram from "./Meteogram.tsx";
import weatherDetails from "./WeatherDetails.tsx";
import TemperatureMinMaxChart from "./TemperatureMinMaxChart.tsx";
import {useEffect} from "react";

function WeatherResults({weatherApiResult, address, readyCallback, showDetailsCallback}: {
  weatherApiResult: WeatherApiResult,
  address: string,
  readyCallback: () => void
  showDetailsCallback: (index?: number) => void
}) {
  useEffect(() => {
    readyCallback()
  }, [weatherApiResult, address]);

  const tableRows = weatherApiResult.forecast.data.timelines[0].intervals.map(
      (detailStats, index) =>
          <tr key={index}>
            <td>{index + 1}</td>
            <td><Button variant="link" className="date-button"
                        onClick={() => showDetailsCallback(index)}>{formatDate(new Date(detailStats.startTime))}</Button>
            </td>
            <td>
              <img className="table-status-icon"
                   src={`/images/weather-symbols/${weatherMapping[(detailStats.values.weatherCode as keyof typeof weatherMapping)].iconName}`}
                   alt={weatherMapping[detailStats.values.weatherCode as keyof typeof weatherMapping].iconName}/>
              {weatherMapping[detailStats.values.weatherCode as keyof typeof weatherMapping].description}
            </td>
            <td>{detailStats.values.temperatureMax}</td>
            <td>{detailStats.values.temperatureMin}</td>
            <td>{detailStats.values.windSpeed}</td>
          </tr>
  )

  return (
      <div className="weather-results">
        <h3>Forecast at {address}</h3>
        <div className="results-buttons justify-content-end">
          <Button variant="link"
                  onClick={() => showDetailsCallback()}>Details</Button>
        </div>
        <Tabs defaultActiveKey="day-view" className="justify-content-end mb-3">
          <Tab eventKey="day-view" title="Day View">
            <Table bordered={false} hover className="mt-3 weather-results-table">
              <thead>
              <tr>
                <th>#</th>
                <th className="date-col">Date</th>
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
          </Tab>
          <Tab eventKey="temp-chart" title="Daily Temp. Chart">
            <TemperatureMinMaxChart
                weatherDetails={weatherApiResult.forecast.data.timelines[0].intervals}></TemperatureMinMaxChart>
          </Tab>
          <Tab eventKey="meteogram" title="Meteogram">
            <Meteogram hourly={weatherApiResult.hourly.data.timelines[0].intervals}></Meteogram>
          </Tab>
        </Tabs>
      </div>
  )
}

export default WeatherResults;