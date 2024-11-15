import Table from 'react-bootstrap/Table';
import {Address, WeatherApiResult} from "src/scripts/types";
import {weatherMapping} from "src/scripts/mappings";
import "src/styles/WeatherResults.css"
import {formatDate} from "src/scripts/tools";
import {Button, Tab, Tabs} from "react-bootstrap";
import Meteogram from "src/components/Meteogram.tsx";
import TemperatureMinMaxChart from "src/components/TemperatureMinMaxChart.tsx";
import {useEffect} from "react";
import {addFavorite, deleteFavorite} from "src/scripts/favorites-requests.ts";

function WeatherResults({
                          weatherApiResult,
                          address,
                          isFavorite,
                          readyCallback,
                          showDetailsCallback,
                          updateFavoritesCallback
                        }: {
  weatherApiResult: WeatherApiResult,
  address: Address,
  isFavorite: boolean,
  readyCallback: () => void,
  showDetailsCallback: (index?: number) => void,
  updateFavoritesCallback: () => void
}) {
  useEffect(() => {
    readyCallback()
  }, [weatherApiResult, address]);

  function onClickFavoriteButton() {
    if (isFavorite) {
      deleteFavorite(address).then(updateFavoritesCallback)
    } else {
      addFavorite(address).then(updateFavoritesCallback)
    }
  }

  const favoritesButton = (() => {
    const favoriteButtonClass = isFavorite ? "is-favorite-button" : "not-favorite-button";
    return <Button variant="outline-secondary" className={favoriteButtonClass} onClick={onClickFavoriteButton}></Button>
  })()

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
        <h3>Forecast at {address.city}, {address.state}</h3>
        <div className="results-buttons justify-content-end">
          {favoritesButton}
          <Button variant="link"
                  onClick={() => showDetailsCallback()}>
            Details<i className="bi bi-chevron-right"></i>
          </Button>
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