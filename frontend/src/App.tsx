import {useRef, useState} from 'react';
import {Alert, Carousel, Nav, ProgressBar, Tab} from "react-bootstrap";
import 'src/styles/App.css';
import SearchingBlock from "src/components/SearchingBlock";
import WeatherResults from "src/components/WeatherResults";
import {EmptyDetailStats, EmptyWeatherStats, GeoLocation, WeatherApiResult, WeatherStats} from "src/scripts/types";
import {CarouselRef} from "react-bootstrap/Carousel";
import WeatherDetails from "./components/WeatherDetails.tsx";

function App() {
  const ipInfoKey = "63511c0996acf1"
  const googleApiKey = "AIzaSyAG1FPkDpKn_pC2Kr9-hgNzodkHb9hyY8E"

  const carouselRef = useRef<CarouselRef>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const errorAlertRef = useRef<HTMLDivElement>(null)

  const [address, setAddress] = useState("")
  const [weatherStats, setWeatherStats] = useState<WeatherApiResult>({
    forecast: new EmptyWeatherStats(),
    hourly: new EmptyWeatherStats()
  })
  const [weatherStatsReady, setWeatherStatsReady] = useState<boolean>(false)
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

  function clear() {
    progressBarRef.current!.style.display = "none"
    resultsRef.current!.style.display = "none"
    errorAlertRef.current!.style.display = "none"
  }

  function onError() {
    clear()
    errorAlertRef.current!.style.display = "block"
  }

  function onResultsReady() {
    if (weatherStatsReady) {
      progressBarRef.current!.style.display = "none"
      resultsRef.current!.style.display = "block"
    }
  }

  function submitAddress(needAutodetect: boolean, address: string) {
    clear()
    progressBarRef.current!.style.display = "block"
    if (needAutodetect) {
      fetch(`https://ipinfo.io/?token=${ipInfoKey}`).then(res => res.json()).then(resJson1 => {
        const locArray = resJson1.loc.split(",")

        setGeoLocation({
          latitude: parseFloat(locArray[0]),
          longitude: parseFloat(locArray[1])
        })
        fetch(`/api/weather?lat=${locArray[0]}&lng=${locArray[1]}`)
            .then(res2 => res2.text())
            .then(res2 => {
              handleWeatherStats(JSON.parse(res2), `${resJson1.city}, ${resJson1.region}, ${resJson1.country}`)
            })
            .catch(() => {
              console.log("123123123")
              onError()
            })
      })
    } else {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleApiKey}`)
          .then(res => res.json())
          .then(resJson1 => {
            if (resJson1.results.length === 0) {
              clear()
              onError()
              return
            }

            const location = resJson1.results[0].geometry.location
            setGeoLocation({
              latitude: location.lat,
              longitude: location.lng
            })
            fetch(`/api/weather?lat=${location.lat}&lng=${location.lng}`)
                .then(res => res.json())
                .then(resJson2 => {
                  handleWeatherStats(resJson2, resJson1.results[0].formatted_address)
                })
                .catch(() => {
                  console.log("123123123")
                  onError()
                })
          })
    }
  }

  function handleWeatherStats(response: object, address: string) {
    if (!("data" in (response as WeatherApiResult).forecast && "data" in (response as WeatherApiResult).hourly)) {
      onError()
    } else {
      setWeatherStatsReady(true)
      setWeatherStats(response as WeatherApiResult)
      setAddress(address)
    }
  }

  function showDetails(index?: number) {
    if (typeof index !== 'undefined') {
      setDetailIndex(index)
    }
    carouselRef.current!.next()
  }

  function showResultsTable() {
    carouselRef.current!.prev()
  }

  return (
      <div className="App">
        <SearchingBlock submitCallback={submitAddress} clearCallback={clear}/>
        <Tab.Container id="left-tabs-example" defaultActiveKey="results">
          <Nav variant="pills" className="justify-content-center mt-3">
            <Nav.Item>
              <Nav.Link eventKey="results">Results</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="favorites">Favorites</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="mt-3">
            <Tab.Pane eventKey="results">
              <Alert variant="danger" className="error-alert" ref={errorAlertRef}>
                An error occurred! Please try again later.
              </Alert>
              <div ref={progressBarRef} className="progress-bar-div">
                <ProgressBar animated now={50} className="mt-4 custom-progress-bar"/>
              </div>
              <div ref={resultsRef} className="results-div">
                <Carousel controls={false} indicators={false} interval={null} ref={carouselRef} touch={false}>
                  <Carousel.Item>
                    <WeatherResults weatherApiResult={weatherStats} address={address}
                                    readyCallback={onResultsReady} showDetailsCallback={showDetails}/>
                  </Carousel.Item>
                  <Carousel.Item>
                    <WeatherDetails detailStats={getDetailStats()} geoLocation={geoLocation}
                                    showResultsCallback={showResultsTable}></WeatherDetails>
                  </Carousel.Item>
                </Carousel>
              </div>
            </Tab.Pane>
            <Tab.Pane eventKey="favorites">Favorites</Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
  );
}

export default App;
