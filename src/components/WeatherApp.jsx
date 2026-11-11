import { useState, useEffect } from 'react'
import './WeatherApp.css'
import { getWeatherInfo } from '../utils/weatherCode'
import { formatDate } from '../utils/formatDate'
import { getCoordinates, getCurrentWeather } from '../services/weatherApi'
import { weatherImages, backgroundImages } from '../constants/weatherTheme'
import loadingGif from '../assets/images/loading.gif'

const WeatherApp = () => {
  const [data, setData] = useState(null)
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const handleInputChanges = (event) => {
    setLocation(event.target.value)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      search(location)
    }
  }

  const search = async (cityName) => {
    const normalizedCity = cityName.trim()

    if (!normalizedCity) {
      return
    }

    setLoading(true)
    setNotFound(false)
    setData(null)

    try {
      const coordinates = await getCoordinates(normalizedCity)
      const currentWeather = await getCurrentWeather(
        coordinates.latitude,
        coordinates.longitude
      )

      setData({
        city: coordinates.name,
        country: coordinates.country,
        temperature: currentWeather.temperature_2m,
        humidity: currentWeather.relative_humidity_2m,
        windSpeed: currentWeather.wind_speed_10m,
        weatherCode: currentWeather.weather_code,
        time: currentWeather.time,
      })
    } catch (error) {
      console.error('Erro ao buscar clima:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    search('London')
  }, [])

  const weatherInfo = data ? getWeatherInfo(data.weatherCode) : null
  const weatherType = weatherInfo?.type || 'sunny'
  const weatherImage = weatherImages[weatherType]
  const backgroundImage = backgroundImages[weatherType]

  return (
    <div className="container" style={{ backgroundImage }}>
      <div
        className="weather-app"
        style={{
          backgroundImage: backgroundImage.replace('to right', 'to top'),
        }}
      >
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">{data ? data.city : 'London'}</div>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={handleInputChanges}
              onKeyDown={handleKeyDown}
            />
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={() => search(location)}
            ></i>
          </div>
        </div>

        {loading && (
          <img src={loadingGif} alt="Loading" className="loader" />
        )}

        {notFound && !loading && (
          <div className="not-found">Cidade não encontrada</div>
        )}

        {data && !loading && (
          <>
            <div className="weather">
              <img
                src={weatherImage}
                alt={weatherInfo?.description || 'Weather'}
              />
              <div className="weather-type">
                {weatherInfo?.description || '--'}
              </div>
              <div className="temp">{Math.round(data.temperature)}°</div>
            </div>

            <div className="weather-date">
              <p>{formatDate(data.time)}</p>
            </div>

            <div className="weather-data">
              <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet"></i>
                <div className="data">{data.humidity}%</div>
              </div>

              <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind"></i>
                <div className="data">{data.windSpeed} km/h</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WeatherApp
