const express = require('express')
const cors = require('cors')
const app = express()
const port = 8081

app.use(cors())

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

app.get('/weather', (req, res) => {
  console.log(req.query)
  let url1 = `https://api.tomorrow.io/v4/timelines?location=${req.query.lat},${req.query.lng}&fields=temperature&fields=windSpeed&fields=humidity&fields=pressureSeaLevel&fields=uvIndex&fields=weatherCode&fields=visibility&fields=cloudCover&fields=&units=imperial&timesteps=current&timezone=America%2FLos_Angeles&apikey=0H4oNBZe7IJKfOGHp3AcaYRirN7aYsxS`
  let url2 = `https://api.tomorrow.io/v4/timelines?location=${req.query.lat},${req.query.lng}&fields=temperatureMin&fields=temperatureMax&fields=windSpeed&fields=humidity&fields=weatherCode&fields=precipitationProbability&fields=precipitationType&fields=sunriseTime&fields=sunsetTime&fields=visibility&units=imperial&timesteps=1d&startTime=now&endTime=nowPlus5d&timezone=America%2FLos_Angeles&apikey=0H4oNBZe7IJKfOGHp3AcaYRirN7aYsxS`
  let url3 = `https://api.tomorrow.io/v4/timelines?location=${req.query.lat},${req.query.lng}&fields=temperature&fields=windDirection&fields=windSpeed&fields=humidity&fields=weatherCode&fields=pressureSeaLevel&units=imperial&timesteps=1h&startTime=now&endTime=nowPlus5d&timezone=America%2FLos_Angeles&apikey=0H4oNBZe7IJKfOGHp3AcaYRirN7aYsxS`
  let response = {}
  fetch(url1).then(res => res.json()).then(resJson1 => {
    response.current = resJson1
    fetch(url2).then(res => res.json()).then(resJson2 => {
      response.forecast = resJson2
      fetch(url3).then(res => res.json()).then(resJson3 => {
        response.hourly = resJson3
        res.send(response)
      })
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})