import React, {useRef, useState} from 'react';
import './styles/App.css';
import SearchingBlock from "components/SearchingBlock";
import {Carousel, Nav, Tab} from "react-bootstrap";
import WeatherResults from "components/WeatherResults";
import {EmptyWeatherStats, WeatherApiResult, WeatherStats} from "scripts/interfaces";
import {CarouselRef} from "react-bootstrap/Carousel";

function App() {
  const ipInfoKey = "63511c0996acf1"
  const googleApiKey = "AIzaSyAG1FPkDpKn_pC2Kr9-hgNzodkHb9hyY8E"

  const carouselRef = useRef<CarouselRef>(null)

  const [address, setAddress] = useState("")
  const [weatherStats, setWeatherStats] = useState<WeatherApiResult>({
    "current": new EmptyWeatherStats(),
    "forecast": new EmptyWeatherStats(),
    "hourly": new EmptyWeatherStats()
  })

  function onClear() {

  }

  function noResult() {

  }

  function submitAddress(needAutodetect: boolean, address: string) {
    if (needAutodetect) {
      fetch(`https://ipinfo.io/?token=${ipInfoKey}`).then(res => res.json()).then(resJson1 => {
        let locArray = resJson1.loc.split(",")

        fetch(`/weather?lat=${parseInt(locArray[0])}&lng=${parseInt(locArray[1])}`)
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

            let location = resJson1.results[0].geometry.location
            fetch(`/weather?lat=${location.lat}&lng=${location.lng}`)
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

  function showDetails(index: number) {
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
              <Carousel controls={false} interval={null} ref={carouselRef}>
                <Carousel.Item>
                  <WeatherResults weatherStats={weatherStats} address={address} showDetailsCallback={showDetails}/>
                </Carousel.Item>
                <Carousel.Item>
                  details
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
