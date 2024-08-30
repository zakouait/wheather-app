import React, { useState, useEffect } from 'react'
import axios from 'axios'
import sunsetImage from './assets/sunset.jpg'
import moonlightImage from './assets/MoonLight.jpg'
import sunupImage from './assets/sunup.jpg'

function App() {
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [backgroundImage, setBackgroundImage] = useState(sunsetImage)

  const API_KEY = '895284fb2d2c50a520ea537456963d9c'

  useEffect(() => {
    getCurrentLocation()
    updateBackgroundImage()
  }, [])

  const updateBackgroundImage = () => {
    const hour = new Date().getHours()
    if (hour < 15) {
      setBackgroundImage(sunupImage)
    } else if (hour < 20) {
      setBackgroundImage(sunsetImage)
    } else {
      setBackgroundImage(moonlightImage)
    }
  }
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchWeatherByCoords(latitude, longitude)
        },
        (err) => {
          setError("Unable to retrieve your location. Please enter a city manually.")
          setLoading(false)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser. Please enter a city manually.")
      setLoading(false)
    }
  }

  const fetchWeatherByCoords = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    axios.get(url)
      .then((response) => {
        setData(response.data)
        setLoading(false)
      })
      .catch((error) => {
        setError('An error occurred. Please try again.')
        setLoading(false)
      })
  }

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      setError('')
      setLoading(true)
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      axios.get(url)
        .then((response) => {
          setData(response.data)
          setLoading(false)
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setError('Location not found. Please try again.')
          } else {
            setError('An error occurred. Please try again.')
          }
          setLoading(false)
        })
      setLocation('')
    }
  }

  return (
    <div className="app" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text" />
        {error && <p className="error">{error}</p>}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="container">
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
            </div>
            <div className="description">
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>

          {data.name && (
            <div className="bottom">
              <div className="feels">
                {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°C</p> : null}
                <p>Feels Like</p>
              </div>
              <div className="humidity">
                {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
                <p>Humidity</p>
              </div>
              <div className="wind">
                {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} m/s</p> : null}
                <p>Wind Speed</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;