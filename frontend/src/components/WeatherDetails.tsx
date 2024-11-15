import "src/styles/WeatherDetails.css"
import {Address, DetailStats, GeoLocation} from "../scripts/types.ts";
import {formatDate, formatTime} from "../scripts/tools.ts";
import {Button, Table} from "react-bootstrap";
import {weatherMapping} from "../scripts/mappings.ts";
import {useEffect, useRef} from "react";
import {Loader} from "@googlemaps/js-api-loader";

function WeatherDetails({detailStats, address, geoLocation, showResultsCallback}: {
  detailStats: DetailStats,
  address: Address,
  geoLocation: GeoLocation,
  showResultsCallback: () => void
}) {
  const mapKey = "AIzaSyByDQRQ_wWMJV-Jpptl_zPP5y4trzRNzQo"
  const mapDivRef = useRef<HTMLDivElement>(null);

  const xQuery = `The temperature in ${address.city}, ${address.state} on ${formatDate(new Date(detailStats.startTime))} \
is ${detailStats.values.temperature}°F and the conditions are \
${weatherMapping[detailStats.values.weatherCode as keyof typeof weatherMapping].description}`

  function initMap() {
    const loader = new Loader({
      apiKey: mapKey,
      version: "weekly",
      libraries: ["marker"]
    });

    loader.load().then(async () => {
      const {Map} = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const {AdvancedMarkerElement} = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
      let map = new Map(mapDivRef.current!, {
        center: {lat: geoLocation.latitude, lng: geoLocation.longitude},
        zoom: 15,
        mapId: "d39bdfb61a2e9f85"
      });
      new AdvancedMarkerElement({
        map, position: {lat: geoLocation.latitude, lng: geoLocation.longitude},
      });
    });
  }

  useEffect(() => {
    initMap()
  }, [geoLocation]);

  return (
      <div className="weather-details">
        <h3>{formatDate(new Date(detailStats.startTime))}</h3>
        <div className="results-buttons justify-content-between">
          <Button variant="outline-secondary" onClick={showResultsCallback}>List</Button>
          <a className="btn btn-outline-secondary twitter-share-button"
             href={`https://twitter.com/intent/tweet?text=${xQuery}&hashtags=CSCI571WeatherForecast`}/>
        </div>
        <Table bordered={false} striped hover className="mt-3 weather-details-table">
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
        <div ref={mapDivRef} className="map-div"></div>
      </div>
  )
}

export default WeatherDetails;