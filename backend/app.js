const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8081

app.use(cors())
app.use(express.static('dist'))

app.get('/api/hello', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/weather', (req, res) => {
  console.log(req.query)
  let response = {}
  let testing = false
  if (testing) {
    response.forecast = require("./test-json/forecast.json")
    response.hourly = require("./test-json/hourly.json")
    res.send(response)
  } else {
    let url1 = `https://api.tomorrow.io/v4/timelines?location=${req.query.lat},${req.query.lng}&fields=temperatureMin&fields=temperatureMax&fields=temperatureApparent&fields=windSpeed&fields=humidity&fields=weatherCode&fields=precipitationProbability&fields=precipitationType&fields=sunriseTime&fields=sunsetTime&fields=visibility&fields=cloudCover&units=imperial&timesteps=1d&startTime=now&endTime=nowPlus5d&timezone=America%2FLos_Angeles&apikey=0H4oNBZe7IJKfOGHp3AcaYRirN7aYsxS`
    let url2 = `https://api.tomorrow.io/v4/timelines?location=${req.query.lat},${req.query.lng}&fields=temperature&fields=windDirection&fields=windSpeed&fields=humidity&fields=weatherCode&fields=pressureSeaLevel&units=imperial&timesteps=1h&startTime=now&endTime=nowPlus5d&timezone=America%2FLos_Angeles&apikey=0H4oNBZe7IJKfOGHp3AcaYRirN7aYsxS`
    fetch(url1).then(res => res.json()).then(resJson1 => {
      response.forecast = resJson1
      fetch(url2).then(res => res.json()).then(resJson2 => {
        response.hourly = resJson2
        res.send(response)
      })
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})