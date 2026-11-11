import { useState, useEffect } from 'react'
import './WeatherApp.css'
import SearchBar from './SearchBar'
import WeatherCard from './WeatherCard'
import WeatherDetails from './WeatherDetails'
import { getWeatherInfo } from '../utils/weatherCode'
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
        <SearchBar
          location={location}
          handleInputChanges={handleInputChanges}
          handleKeyDown={handleKeyDown}
          search={search}
          city={data?.city}
        />

        {loading && (
          <img src={loadingGif} alt="Loading" className="loader" />
        )}

        {notFound && !loading && (
          <div className="not-found">Cidade não encontrada</div>
        )}

        {data && !loading && (
          <>
            <WeatherCard
              data={data}
              weatherInfo={weatherInfo}
              weatherImage={weatherImage}
            />

            <WeatherDetails data={data} />
          </>
        )}
      </div>
    </div>
  )
}

export default WeatherApp
