import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;

const URL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&`;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs", { data: null });
});

app.post("/weather", async (req, res) => {
  try {
    const loc = req.body.location;

    const response = await axios.get(URL + `q=${loc}&aqi=yes`);
    const weatherData = response.data;

    const formattedData = {
  city: weatherData.location.name,
  region: weatherData.location.region,
  country: weatherData.location.country,
  lat: weatherData.location.lat,
  lon: weatherData.location.lon,
  timezone: weatherData.location.tz_id,
  time: weatherData.location.localtime,

  temperature: weatherData.current.temp_c,
  temperatureF: weatherData.current.temp_f,
  feelsLike: weatherData.current.feelslike_c,
  heatIndex: weatherData.current.heatindex_c,
  windChill: weatherData.current.windchill_c,
  dewPoint: weatherData.current.dewpoint_c,

  condition: weatherData.current.condition.text,
  icon: weatherData.current.condition.icon,
  cloud: weatherData.current.cloud,

  wind: weatherData.current.wind_kph,
  windMph: weatherData.current.wind_mph,
  windDir: weatherData.current.wind_dir,
  windDegree: weatherData.current.wind_degree,
  gust: weatherData.current.gust_kph,

  humidity: weatherData.current.humidity,
  pressure: weatherData.current.pressure_mb,
  visibility: weatherData.current.vis_km,
  uv: weatherData.current.uv,
  precip: weatherData.current.precip_mm,

  isDay: weatherData.current.is_day === 1 ? "Day" : "Night",

  airCO: weatherData.current.air_quality.co,
  airNO2: weatherData.current.air_quality.no2,
  airPM25: weatherData.current.air_quality.pm2_5,
  airPM10: weatherData.current.air_quality.pm10,
  airEPA: weatherData.current.air_quality["us-epa-index"],
  airDefra: weatherData.current.air_quality["gb-defra-index"]
};

    res.render("index.ejs", { data: formattedData });

  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { data: { error: "City does not exist." } });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
