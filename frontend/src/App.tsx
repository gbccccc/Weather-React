import {useRef, useState} from 'react';
import {Carousel, Nav, Tab} from "react-bootstrap";
import 'src/styles/App.css';
import SearchingBlock from "src/components/SearchingBlock";
import WeatherResults from "src/components/WeatherResults";
import {EmptyDetailStats, EmptyWeatherStats, GeoLocation, WeatherApiResult} from "src/scripts/types";
import {CarouselRef} from "react-bootstrap/Carousel";
import WeatherDetails from "./components/WeatherDetails.tsx";

function App() {
  const ipInfoKey = "63511c0996acf1"
  const googleApiKey = "AIzaSyAG1FPkDpKn_pC2Kr9-hgNzodkHb9hyY8E"

  const carouselRef = useRef<CarouselRef>(null)

  const [address, setAddress] = useState("")
  const [weatherStats, setWeatherStats] = useState<WeatherApiResult>({
    forecast: new EmptyWeatherStats(),
    hourly: new EmptyWeatherStats()
  })
  const [detailIndex, setDetailIndex] = useState(0)
  const [geoLocation, setGeoLocation] = useState<GeoLocation>({
    latitude: 0,
    longitude: 0
  })

  function getDetailStats() {
    if (weatherStats.forecast.data.timelines[0].intervals.length === 0) {
      return new EmptyDetailStats()
    }
    return weatherStats.forecast.data.timelines[0].intervals[detailIndex]
  }

  function onClear() {

  }

  function noResult() {

  }

  function submitAddress(needAutodetect: boolean, address: string) {
    if (needAutodetect) {
      fetch(`https://ipinfo.io/?token=${ipInfoKey}`).then(res => res.json()).then(resJson1 => {
        const locArray = resJson1.loc.split(",")

        setGeoLocation({
          latitude: parseInt(locArray[0]),
          longitude: parseInt(locArray[1])
        })
        fetch(`/api/weather?lat=${geoLocation.latitude}&lng=${geoLocation.longitude}`)
            .then(res2 => res2.text())
            .then(res2 => {
              handleWeatherStats(JSON.parse(res2), `${resJson1.city}, ${resJson1.region}, ${resJson1.country}`)
            })
      })
    } else {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`)
          .then(res => res.json())
          .then(resJson1 => {
            if (resJson1.results.length === 0) {
              onClear()
              noResult()
              return
            }

            const location = resJson1.results[0].geometry.location
            setGeoLocation({
              latitude: location.lat,
              longitude: location.lng
            })
            fetch(`/api/weather?lat=${geoLocation.latitude}&lng=${geoLocation.longitude}`)
                .then(res => res.json())
                .then(resJson2 => {
                  handleWeatherStats(resJson2, resJson1.results[0].formatted_address)
                })
          })
    }
  }

  function handleWeatherStats(response: object, address: string) {
    setWeatherStats(response as typeof weatherStats)
    setAddress(address)
  }

  function showDetails(index?: number) {
    if (typeof index !== 'undefined') {
      setDetailIndex(index)
    }
    carouselRef.current!.next()
  }

  function showResults() {
    carouselRef.current!.prev()
  }

  return (
      <div className="App">
        <SearchingBlock submitCallback={submitAddress} clearCallback={() => {
          return
        }}/>
        <Tab.Container id="left-tabs-example" defaultActiveKey="results">
          <Nav variant="pills" className="justify-content-center mt-3">
            <Nav.Item>
              <Nav.Link eventKey="results">Results</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="favorites">Favorites</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="results">
              <Carousel controls={false} indicators={false} interval={null} ref={carouselRef} touch={false}>
                <Carousel.Item>
                  <WeatherResults weatherApiResult={weatherStats} address={address} showDetailsCallback={showDetails}/>
                </Carousel.Item>
                <Carousel.Item>
                  <WeatherDetails detailStats={getDetailStats()} geoLocation={geoLocation}
                                  showResultsCallback={showResults}></WeatherDetails>
                </Carousel.Item>
              </Carousel>
            </Tab.Pane>
            <Tab.Pane eventKey="favorites">Favorites</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
  );
}

export default App;
