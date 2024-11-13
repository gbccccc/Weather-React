const express = require('express')
const cors = require('cors')
const { json } = require("body-parser");
const app = express()
const port = process.env.PORT || 8081

app.use(cors())
app.use(json())
app.use(express.static('dist'))

app.get('/api/hello', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/weather', (req, res) => {
  console.log(req.query)
  let response = {}
  let testing = true
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

var favorites = [
  {
    city: "Los Angeles",
    state: "California"
  }, {
    city: "New York",
    state: "New York"
  }
]

function isSameFavorite(f1, f2) {
  return f1.city === f2.city && f2.state === f2.state
}

app.get('/api/favorites', (req, res) => {
  res.send(favorites)
})

app.post('/api/favorites', (req, res) => {
  if (!req.body) {
    res.send({ message: "bad request" })
    return
  }

  console.log(favorites.findIndex((element) => {
    return element === req.body
  }))
  if (favorites.findIndex((element) => {
    return isSameFavorite(element, req.body)
  }) === -1) {
    favorites.push(req.body)
    res.send({ message: "added" })
  } else {
    res.send({ message: "duplicated" })
  }
})

app.delete('/api/favorites', (req, res) => {
  let index = favorites.findIndex((element) => {
    return isSameFavorite(element, req.body)
  })
  if (index !== -1) {
    favorites.splice(index, 1)
    res.send({ message: "deleted" })
  } else {
    res.send({ message: "not found" })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})