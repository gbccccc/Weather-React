import "src/styles/WeatherDetails.css"
import {DetailStats} from "../scripts/types.ts";
import {formatDate} from "../scripts/tools.ts";
import {Button} from "react-bootstrap";

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
        {JSON.stringify(detailStats, null, 2)}
      </div>
  )
}

export default WeatherDetails;