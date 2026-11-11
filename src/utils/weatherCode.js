import sunny from '../assets/images/sunny.png'
import cloudy from '../assets/images/cloudy.png'
import rainy from '../assets/images/rainy.png'
import snowy from '../assets/images/snowy.png'

const weatherImages = {
  storm: rainy,
  snow: snowy,
  hail: rainy,
  rain: rainy,
  fog: cloudy,
  clear_day: sunny,
  clear_night: sunny,
  cloud: cloudy,
  cloudly_day: cloudy,
  cloudly_night: cloudy,
  none_day: sunny,
  none_night: sunny,
}

function imageForWmo(code) {
  const snowyCodes = [71, 73, 75, 77, 85, 86]
  const rainyCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]
  const cloudyCodes = [2, 3, 45, 48]

  if (snowyCodes.includes(code)) return snowy
  if (rainyCodes.includes(code)) return rainy
  if (cloudyCodes.includes(code)) return cloudy
  return sunny
}

export function getWeatherImage(condition) {
  if (typeof condition === 'number') {
    return imageForWmo(condition)
  }
  return weatherImages[condition] || cloudy
}

export function describeWeatherCode(code) {
  const map = {
    0: 'Céu limpo',
    1: 'Quase limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Neblina com geada',
    51: 'Chuvisco leve',
    53: 'Chuvisco moderado',
    55: 'Chuvisco intenso',
    56: 'Chuvisco congelante',
    57: 'Chuvisco congelante intenso',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    66: 'Chuva congelante leve',
    67: 'Chuva congelante forte',
    71: 'Neve leve',
    73: 'Neve moderada',
    75: 'Neve forte',
    77: 'Grãos de neve',
    80: 'Pancadas de chuva leves',
    81: 'Pancadas de chuva moderadas',
    82: 'Pancadas de chuva fortes',
    85: 'Pancadas de neve leves',
    86: 'Pancadas de neve fortes',
    95: 'Tempestade',
    96: 'Tempestade com granizo leve',
    99: 'Tempestade com granizo forte',
  }
  return map[code] || 'Clima desconhecido'
}

export { sunny, cloudy, rainy, snowy }
