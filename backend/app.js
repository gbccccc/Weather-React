const express = require('express')
const cors = require('cors')
const { json } = require("body-parser");
const app = express()
const port = process.env.PORT || 8999
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors())
app.use(json())
app.use(express.static('dist'))

const placeApiKey = "AIzaSyByDQRQ_wWMJV-Jpptl_zPP5y4trzRNzQo"
const tomorrowApiKey = "0H4oNBZe7IJKfOGHp3AcaYRirN7aYsxS"

const mongoDBUri = "mongodb+srv://gbccccc:0M2GuzV2CYpVY26p@favorites.kpcvz.mongodb.net/?retryWrites=true&w=majority&appName=favorites"
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoDBUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

function favoritesCollection() {
  return client.db("weather-favorites").collection("weather-favorites")
}

function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect().then(() => {
      // Send a ping to confirm a successful connection
      client.db("admin").command({ ping: 1 }).then(() => {
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    client.close().then();
  }
}

run();

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
    let url1 = `https://api.tomorrow.io/v4/timelines?location=${req.query.lat},${req.query.lng}\
&fields=temperature&fields=temperatureMin&fields=temperatureMax&fields=temperatureApparent&fields=windSpeed\
&fields=humidity&fields=weatherCode&fields=precipitationProbability&fields=precipitationType&\
fields=sunriseTime&fields=sunsetTime&fields=visibility&fields=cloudCover&units=imperial&timesteps=1d&\
startTime=now&endTime=nowPlus5d&timezone=America%2FLos_Angeles&apikey=${tomorrowApiKey}`
    let url2 = `https://api.tomorrow.io/v4/timelines?location=${req.query.lat},${req.query.lng}\
&fields=temperature&fields=windDirection&fields=windSpeed&fields=humidity&fields=weatherCode\
&fields=pressureSeaLevel&units=imperial&timesteps=1h&startTime=now&endTime=nowPlus5d&\
timezone=America%2FLos_Angeles&apikey=${tomorrowApiKey}`
    fetch(url1).then(res => res.json()).then(resJson1 => {
      response.forecast = resJson1
      fetch(url2).then(res => res.json()).then(resJson2 => {
        response.hourly = resJson2
        res.send(response)
      })
    })
  }
})

app.get('/api/android-weather', (req, res) => {
  console.log(req.query)
  let response = {}
  let testing = false
  if (testing) {
    response.forecast = require("./test-json/forecast-android.json")
    response.current = require("./test-json/current-android.json")
    res.send(response)
  } else {
    let url1 = `https://api.tomorrow.io/v4/timelines?location=${req.query.lat},${req.query.lng}\
&fields=temperature&fields=temperatureMin&fields=temperatureMax&fields=temperatureApparent&fields=windSpeed\
&fields=humidity&fields=weatherCode&fields=precipitationProbability&fields=precipitationType&\
fields=visibility&fields=pressureSeaLevel&fields=cloudCover&units=imperial&timesteps=1d&\
startTime=now&endTime=nowPlus5d&timezone=America%2FLos_Angeles&apikey=${tomorrowApiKey}`
    let url2 = `https://api.tomorrow.io/v4/timelines?location=${req.query.lat},${req.query.lng}\
&fields=temperature&fields=temperatureMin&fields=temperatureMax&fields=temperatureApparent&fields=windSpeed\
&fields=humidity&fields=weatherCode&fields=precipitationProbability&fields=precipitationType&\
fields=visibility&fields=uvIndex&fields=pressureSeaLevel&fields=cloudCover&units=imperial&timesteps=current&\
timezone=America%2FLos_Angeles&apikey=${tomorrowApiKey}`
    fetch(url1).then(res => res.json()).then(resJson1 => {
      response.forecast = resJson1
      fetch(url2).then(res => res.json()).then(resJson2 => {
        response.current = resJson2
        res.send(response)
      })
    })
  }
})

function isSameFavorite(f1, f2) {
  return f1.city === f2.city && f2.state === f2.state
}

app.get('/api/favorites', (req, res) => {
  let options = { projection: { _id: 0, city: 1, state: 1 } }
  favoritesCollection().find({}, options).toArray().then((favorites) => {
    res.send(favorites)
  })
})

app.post('/api/favorites', (req, res) => {
  console.log(req.body)
  if (!req.body) {
    res.send({ message: "bad request" })
    return
  }

  let options = { projection: { _id: 0, city: 1, state: 1 } }
  favoritesCollection().find({}, options).toArray().then((favorites) => {
    if (favorites.findIndex((element) => {
      return isSameFavorite(element, req.body)
    }) === -1) {
      favoritesCollection().insertOne(req.body).then(_ => {
        res.send({ message: "added" })
      })
    } else {
      res.send({ message: "duplicated" })
    }
  })
})

app.delete('/api/favorites', (req, res) => {
  console.log(req.query)

  favoritesCollection().deleteOne(
    {
      "city": req.query.city,
      "state": req.query.state
    }
  ).then(result => {
    if (result.deletedCount > 0) {
      res.send({ message: "removed" })
    } else {
      res.send({ message: "not found" })
    }
  })
})

app.get('/api/autocompletion', (req, res) => {
    fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.query.input}&types=%28cities%29&key=${placeApiKey}`)
      .then(response => response.json())
      .then(resJson => {
        res.send(
          resJson.predictions.map((prediction) => {
            return {
              label: `${prediction.terms[0].value}, ${prediction.terms[1].value}`,
              city: prediction.terms[0].value,
              state: prediction.terms[1].value
            }
          })
        )
      })
  }
)

app.get('/api/android-autocompletion', (req, res) => {
    fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.query.input}&types=%28cities%29&key=${placeApiKey}`)
      .then(response => response.json())
      .then(resJson => {
        res.send(
          resJson.predictions.map((prediction) => {
            return {
              city: prediction.terms[0].value,
              state: prediction.terms[1].value
            }
          })
        )
      })
  }
)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})