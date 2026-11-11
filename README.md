# Weather App

Aplicação de previsão do tempo construída com React e Vite, usando os dados
atuais da [Open-Meteo](https://open-meteo.com/).

## Funcionalidades

- Busca por cidade com **Enter** ou clique na lupa.
- Geocoding para localizar a cidade e forecast para buscar o clima atual.
- Exibe temperatura, descrição, umidade, vento, data e imagem.
- Tema visual (imagem e gradiente) por condição: `sunny`, `cloudy`, `rainy`
  e `snowy`.
- Estados de loading, cidade não encontrada e recuperação após erro.
- Layout centralizado, com tipografia Poppins e Font Awesome.

## Stack

- React 19
- Vite 8
- Oxlint
- Open-Meteo (Geocoding + Forecast)
- Google Fonts (Poppins) e Font Awesome

## Como rodar

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Estrutura

```text
src/
├── components/
│   ├── WeatherApp.jsx      # estado, eventos e composição
│   ├── WeatherApp.css
│   ├── SearchBar.jsx
│   ├── WeatherCard.jsx
│   ├── WeatherDetails.jsx
│   └── NotFound.jsx
├── constants/
│   └── weatherTheme.js     # imagens e gradientes por tema
├── services/
│   └── weatherApi.js       # Geocoding + Forecast
├── utils/
│   ├── formatDate.js
│   └── weatherCode.js      # descrição e tema do weather_code
├── App.jsx
└── main.jsx
```

## Arquitetura

O componente principal cuida do estado e da composição da tela. Chamadas HTTP
ficam em `services`, funções puras em `utils` e a configuração visual em
`constants`. O mapa completo está em [docs/architecture.md](docs/architecture.md).

## API

Nenhuma chave é necessária. O app consulta:

- `https://geocoding-api.open-meteo.com/v1/search`
- `https://api.open-meteo.com/v1/forecast`

## Fase 02 — Refactor

O refactor modular foi desenvolvido na branch
`refactor/weather-app-modular`, com commits pequenos para cada extração:
utilitário de data, service da API, tema visual, componentes de pesquisa,
card, detalhes e erro, e por fim a simplificação do `WeatherApp`.
