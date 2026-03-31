import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import { useEffect, useState, useRef } from "react"; // أضفنا useRef للتحكم في الـ controller
import WindPowerIcon from "@mui/icons-material/WindPower";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import VisibilityIcon from "@mui/icons-material/Visibility";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const DEFAULT_CITY = "Kafr ad Dawwār";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null); // مرجع لإلغاء الطلبات السابقة

  // دالة جلب البيانات باستخدام fetch
  const fetchWeather = async (searchCity) => {
    // إذا كان هناك طلب قيد التنفيذ، قم بإلغائه
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // إنشاء controller جديد للطلب الحالي
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`;

    setWeather(null);
    setError(null);

    try {
      const response = await fetch(url, { signal: controller.signal });
      
      // في Fetch، يجب التأكد من حالة الاستجابة يدوياً
      if (!response.ok) {
        throw new Error(`City "${searchCity}" not found`);
      }

      const data = await response.json();
      setWeather(data);
      setCurrentCity(data.name);
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Fetch aborted");
        return;
      }
      console.error("Failed to fetch weather data:", err);
      setError(`Could not find weather for "${searchCity}". Please try again.`);
      setWeather(null);
      setCurrentCity("City Not Found");
    }
  };

  // الطلب الأول عند تحميل الصفحة
  useEffect(() => {
    fetchWeather(DEFAULT_CITY);

    // تنظيف الطلبات عند إغلاق المكون
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeather(city.trim());
      setCity("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: ".1rem",
        flexDirection: "column",
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          borderRadius: "1rem",
          backgroundColor: "#d8d8d8ff",
        }}
      >
        <CardContent>
          <Box sx={{ flexGrow: 1 }}>
            {/* Search Bar */}
            <Grid
              sx={{
                backgroundColor: "#e4e4e490",
                width: "100%",
                mb: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <TextField
                sx={{
                  margin: "0 .5rem 0.2rem .2rem",
                  width: "100%",
                }}
                id="standard-basic"
                label="City Name"
                variant="standard"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <Button
                sx={{
                  height: "36px",
                  margin: "0 .2rem .2rem 0",
                }}
                variant="outlined"
                onClick={handleSearch}
                disabled={!city.trim()}
              >
                Search
              </Button>
            </Grid>

            {error && (
              <Typography color="error" variant="body1" sx={{ mb: 1 }}>
                ⚠️ {error}
              </Typography>
            )}

            <Grid container spacing={4} sx={{ display: "flex", justifyContent: "space-between" }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" color="primary">
                  {weather ? weather.name : currentCity}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  {new Date().toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ backgroundColor: "green", height: ".7px" }} />

            {!weather && !error ? (
              <Typography variant="h5" sx={{ my: 3, textAlign: "center" }}>
                Loading...
              </Typography>
            ) : (
              <>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    mt: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                  }}
                >
                  <Grid item>
                    <Typography variant="h4" color="primary">
                      {weather ? Math.round(weather.main.temp) : 0} °C
                    </Typography>
                    <Typography variant="h6">
                      {weather ? weather.weather[0].description : ""}
                    </Typography>
                    <Box sx={{ display: "flex", gap: "1rem", mt: "1rem", flexDirection: { xs: "column", md: "row" } }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: ".2rem" }}>
                        <ThermostatIcon sx={{ color: "#de4c2bff" }} />
                        <Typography variant="body1">
                          Feels: {weather ? Math.round(weather.main.feels_like) : 0} °C
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: ".2rem" }}>
                        <WindPowerIcon color="secondary" />
                        <Typography>
                          Wind: {weather ? Math.round(weather.wind.speed * 3.6) : 0} km/h
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item>
                    <img
                      src={`https://openweathermap.org/img/wn/${
                        weather ? weather.weather[0].icon : "01d"
                      }@2x.png`}
                      alt="weather icon"
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ display: "flex", justifyContent: "space-around", mt: "2rem" }}>
                  <Grid item sx={{ display: "flex", alignItems: "center" }}>
                    <WaterDropIcon color="secondary" />
                    <Typography> Humidity: {weather ? weather.main.humidity : 0}%</Typography>
                  </Grid>
                  <Grid item sx={{ display: "flex", alignItems: "center" }}>
                    <VisibilityIcon color="secondary" />
                    <Typography> Visibility: {weather ? weather.visibility / 1000 : 0} km</Typography>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: "1rem",
                    p: 1,
                    backgroundColor: "#e4e4e490",
                    borderRadius: ".5rem",
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    Max: {weather ? Math.round(weather.main.temp_max) : 0} °C | Min: {weather ? Math.round(weather.main.temp_min) : 0} °C
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}