# Weather App — Fase 02 | Refactor App

Documento de apoio da Fase 02: mapeia as responsabilidades do componente
original e registra a arquitetura modular aplicada no refactor.

## 1. Baseline (antes do refactor)

Comportamento registrado na branch `dev` antes de mover qualquer arquivo:

- [x] A aplicação abre carregando London.
- [x] Pesquisa por Enter funciona.
- [x] Pesquisa pelo clique na lupa funciona.
- [x] Cidade atual aparece no topo da pesquisa.
- [x] Imagem, descrição, temperatura e data são exibidas.
- [x] Umidade e vento são exibidos.
- [x] Cidade inexistente mostra mensagem de erro.
- [x] Uma nova pesquisa após o erro volta a carregar o clima.
- [x] Console do DevTools sem erros inesperados.
- [x] `npm run build` finaliza sem erros.

## 2. Responsabilidades do componente original

`WeatherApp.jsx` concentrava:

```text
WeatherApp
│
├── controla estados (data, location, loading, notFound)
├── controla input
├── captura teclado e clique
├── consulta Geocoding API
├── consulta Forecast API
├── interpreta weather_code
├── formata data
├── seleciona imagem e background
├── renderiza pesquisa
├── renderiza clima
├── renderiza umidade e vento
└── renderiza erro
```

Esse acoplamento torna o componente difícil de ler, testar e evoluir: UI, API,
configuração e utilitários mudam por motivos diferentes dentro do mesmo arquivo.

## 3. Arquitetura alvo

```text
src/
├── assets/
│   └── images/
├── components/
│   ├── WeatherApp.jsx
│   ├── WeatherApp.css
│   ├── SearchBar.jsx
│   ├── WeatherCard.jsx
│   ├── WeatherDetails.jsx
│   └── NotFound.jsx
├── constants/
│   └── weatherTheme.js
├── services/
│   └── weatherApi.js
├── utils/
│   ├── formatDate.js
│   └── weatherCode.js
├── App.jsx
└── main.jsx
```

> O board usa `WheatherApp.jsx`; o repositório já havia sido criado com o nome
> correto `WeatherApp.jsx`. O nome do arquivo foi preservado para não quebrar
> imports existentes.

## 4. Regra de responsabilidade

```text
components → interface
services   → comunicação externa
utils      → funções auxiliares
constants  → configuração estática
assets     → recursos visuais
```

## 5. Fluxo de dados

```text
SearchBar (input, Enter, clique)
        │  callbacks
        ▼
WeatherApp (estado, eventos, composição)
        │
        ├── getCoordinates(city)        → Geocoding API
        ├── getCurrentWeather(lat, lon) → Forecast API
        ├── getWeatherInfo(code)        → descrição + tema
        ├── formatDate(time)            → data exibida
        ├── weatherImages / backgroundImages
        │
        ├── WeatherCard     (imagem, descrição, temperatura, data)
        ├── WeatherDetails  (umidade e vento)
        └── NotFound        (mensagem de erro)
```

## 6. Decisões

- **Open-Meteo em duas etapas**: geocoding resolve a cidade; forecast busca o
  clima atual. As URLs e o `fetch` ficam em `services/weatherApi.js`.
- **`getWeatherInfo`**: converte o `weather_code` da Open-Meteo em uma
  descrição legível e em um dos quatro temas (`sunny`, `cloudy`, `rainy`,
  `snowy`).
- **Tema centralizado**: imagens e gradientes ficam em
  `constants/weatherTheme.js`; nenhum componente importa PNG diretamente.
- **Data em `utils`**: `formatDate` recebe a string ISO retornada pela API e
  devolve o texto formatado, sem depender de React.
- **Estado no pai**: `WeatherApp` continua dono do estado; os componentes
  filhos apenas apresentam dados e disparam callbacks.
