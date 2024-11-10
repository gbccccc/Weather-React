import React from 'react';
import './styles/App.css';
import SearchingBlock from "./SearchingBlock";

function App() {
  const ipInfoKey = "63511c0996acf1"
  const googleApiKey = "AIzaSyAG1FPkDpKn_pC2Kr9-hgNzodkHb9hyY8E"
  const backendHost = "127.0.0.1:8081"

  function submitAddress(needAutodetect: boolean, address: string) {
    if (needAutodetect) {
      fetch(`https://ipinfo.io/?token=${ipInfoKey}`).then(res => res.json()).then(
          resJson1 => {
            let locArray = resJson1.loc.split(",")

            fetch(`/weather?lat=${parseInt(locArray[0])}&lng=${parseInt(locArray[1])}`).then(res2 => res2.text()).then(
                res2 => {
                  handleWeatherStats(JSON.parse(res2), `${resJson1.city}, ${resJson1.region}, ${resJson1.country}`)
                }
            )
          }
      )
    } else {

    }
  }

  function handleWeatherStats(response: object, address: string) {
    console.log(response)
    console.log(address)
  }

  return (
      <div className="App">
        <SearchingBlock submitCallback={submitAddress} clearCallback={() => {
          return
        }}/>
      </div>
  );
}

export default App;
