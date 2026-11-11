import { useState, useEffect } from 'react'
import './WeatherApp.css'
import { getWeatherImage, describeWeatherCode } from '../utils/weatherCode'
import { formatDate } from '../utils/formatDate'
import loadingGif from '../assets/images/loading.gif'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

const WeatherApp = () => {
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const handleInputChanges = (e) => {
    setLocation(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search(e.target.value)
    }
  }

  const search = async (city) => {
    if (!city || !city.trim()) return

    setLoading(true)
    setNotFound(false)
    setWeather(null)

    try {
      let normalized = null

      if (API_KEY && API_KEY !== 'sua_chave_aqui') {
        const url = `https://api.hgbrasil.com/weather?format=json-cors&key=${API_KEY}&city_name=${encodeURIComponent(city.trim())}`
        const response = await fetch(url)
        const data = await response.json()

        if (data && data.results) {
          const r = data.results
          normalized = {
            city_name: r.city_name || r.city,
            temp: r.temp,
            description: r.description,
            condition: r.condition_slug,
            humidity: r.humidity,
            wind_speedy: r.wind_speedy,
            date: r.date,
          }
        }
      } else {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1&language=pt`
        )
        const geoData = await geoRes.json()

        if (geoData && geoData.results && geoData.results.length > 0) {
          const place = geoData.results[0]
          const wRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
          )
          const wData = await wRes.json()

          if (wData && wData.current) {
            const c = wData.current
            normalized = {
              city_name: place.name,
              temp: Math.round(c.temperature_2m),
              description: describeWeatherCode(c.weather_code),
              condition: c.weather_code,
              humidity: c.relative_humidity_2m,
              wind_speedy: `${c.wind_speed_10m} km/h`,
              date: c.time || '',
            }
          }
        }
      }

      if (normalized) {
        setWeather(normalized)
      } else {
        setNotFound(true)
      }
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

  return (
    <div className="container">
      <div className="weather-app">
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">{weather ? weather.city_name : 'London'}</div>
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

        {weather && !loading && (
          <>
            <div className="weather">
              <img src={getWeatherImage(weather.condition)} alt={weather.description} />
              <div className="weather-type">{weather.description}</div>
              <div className="temp">{weather.temp}°</div>
            </div>

            <div className="weather-date">
              <p>{formatDate(weather.date)}</p>
            </div>

            <div className="weather-data">
              <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet"></i>
                <div className="data">{weather.humidity}%</div>
              </div>

              <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind"></i>
                <div className="data">{weather.wind_speedy}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WeatherApp
