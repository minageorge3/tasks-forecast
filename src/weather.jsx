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
import { useEffect, useState } from "react";
import axios from "axios";
import WindPowerIcon from "@mui/icons-material/WindPower";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import VisibilityIcon from "@mui/icons-material/Visibility";

// NOTE: Please replace this placeholder with your actual OpenWeatherMap API Key
// NOTE: For security in a real application, this should be stored in an environment variable.
const API_KEY = "bb1177aa2f6274431cfbf6c4ef2013dd";
const DEFAULT_CITY = "London"; // Starting city for the initial load

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(""); // State for the text field input
  const [currentCity, setCurrentCity] = useState(DEFAULT_CITY); // State for the city currently displayed
  const [error, setError] = useState(null); // State for handling API errors

  // Function to fetch weather data
  const fetchWeather = (searchCity, cancelToken) => {
    // OpenWeatherMap API call by city name (q)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${API_KEY}&units=metric`;

    setWeather(null); // Clear previous data while loading
    setError(null);

    axios
      .get(url, { cancelToken: cancelToken })
      .then(function (response) {
        setWeather(response.data);
        setCurrentCity(response.data.name); // Use the city name returned by the API
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled by cleanup or component unmount.");
          return;
        }
        // Handle API errors (e.g., City not found)
        console.error("Failed to fetch weather data:", error);
        setError(
          `Could not find weather for "${searchCity}". Please try again.`
        );
        setWeather(null); // Clear displayed weather on error
        setCurrentCity("City Not Found");
      });
  };

  // useEffect for initial load (default city) or when currentCity changes
  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchWeather(DEFAULT_CITY, source.token);

    // Cleanup: Cancel the request if the component unmounts
    return () => {
      source.cancel("Component unmounted, request cancelled.");
    };
  }, []); // Empty dependency array means this runs once on mount

  // Handler for the Search button click
  const handleSearch = () => {
    if (city.trim()) {
      const source = axios.CancelToken.source();
      fetchWeather(city.trim(), source.token);
      // Note: We are not implementing the cleanup in this handler
      // because we only fetch once per click. The component-wide
      // cleanup is still in the main useEffect.
      // For simplicity, we skip complex request management on button clicks here.
      setCity("");
    }
  };

  // Handle 'Enter' key press in the TextField
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
        // minHeight: "100vh",
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
            {/* search bar ********************* */}
            <Grid
              sx={{
                backgroundColor: "#e4e4e490",
                width: "100%",
                mb: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end", // Align text field and button nicely
              }}
            >
              <TextField
                sx={{
                  ml: ".5rem",
                  outline: "none",
                  border: "none",
                  width: "100%",
                }}
                id="standard-basic"
                label="City Name"
                variant="standard"
                value={city}
                onChange={(e) => setCity(e.target.value)} // Capture input
                onKeyDown={handleKeyPress} // Enable search on Enter key
              />
              <Button
                sx={{ outline: "none", border: "none", height: "36px" }}
                variant="outlined"
                onClick={handleSearch} // Trigger search on click
                disabled={!city.trim()} // Disable button if input is empty
              >
                Search
              </Button>
            </Grid>
            {/* search bar ********************* */}

            {/* Error Message Display */}
            {error && (
              <Typography color="error" variant="body1" sx={{ mb: 1 }}>
                ⚠️ {error}
              </Typography>
            )}

            <Grid
              container
              spacing={4}
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h6"
                  color="primary"                
                >
                  {/* Display the name of the city that was successfully searched */}
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
            {/* Display "Loading..." or weather data */}
            {!weather && !error ? (
              <Typography variant="h5" sx={{ my: 3, textAlign: "center" }}>
                Loading...
              </Typography>
            ) : (
              <>
                <Grid
                  container
                  spacing={2}
                  xs={12}
                  sm={6}
                  sx={{
                    mt: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                  }}
                >
                  <Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h4" color="primary"  >
                        {weather ? Math.round(weather.main.temp) : 0} °C
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" >
                        {weather ? weather.weather[0].description : ""}
                      </Typography>
                    </Grid>
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        flexDirection: { xs: "column", md: "row" },
                        mt: "1.5rem",
                        gap: ".5rem",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: ".2rem",
                        }}
                      >
                        <ThermostatIcon sx={{ color: "#de4c2bff" }} />
                        <Typography
                          variant="body1"
                          component="p"
                          color="primary"
                          fontSize={"1.2rem"}
                        >
                          feels like:{" "}
                          {weather ? Math.round(weather.main.feels_like) : 0} °C
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: ".2rem",
                        }}
                      >
                        <WindPowerIcon color="secondary" />
                        <Typography>Wind: </Typography>
                        {weather
                          ? Math.round(weather.wind.speed * 3.6)
                          : 0}{" "}
                        km/h
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      sx={{
                        margin: "-20px 0",
                      }}
                    >
                      <img
                        src={`https://openweathermap.org/img/wn/${
                          weather ? weather.weather[0].icon : "01d"
                        }@2x.png`}
                        alt="weather icon"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid sx={{ display: "flex", justifyContent: "space-around" }}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      mt: "2rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <WaterDropIcon color="secondary" />
                    <Typography>Humidity: </Typography>
                    {weather ? weather.main.humidity : 0} %
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sx={{
                      mt: "2rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <VisibilityIcon color="secondary" />
                    <Typography variant="body1" component="p">
                      Visibility: {weather ? weather.visibility / 1000 : 0} km
                    </Typography>
                  </Grid>
                </Grid>

                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: "1rem",
                    backgroundColor: "#e4e4e490",
                    borderRadius: ".5rem",
                  }}
                >
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      component="p"
                      color="textSecondary"
                      sx={{
                        fontSize: { xs: ".9rem", sm: "1rem" },
                      }}
                    >
                      Max {weather ? Math.round(weather.main.temp_max) : 0} °C
                    </Typography>
                  </Grid>
                  <div style={{ margin: "0 .5rem", color: "green" }}> | </div>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="body1"
                      component="p"
                      color="textSecondary"
                      sx={{
                        textAlign: { xs: "left", sm: "right" },
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      }}
                    >
                      Min {weather ? Math.round(weather.main.temp_min) : 0} °C
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
      <Button
        color="secondary"
        variant="text"
        style={{ display: "flex", justifyContent: "start", width: "100%" }}
      >
        Arabic
      </Button>
    </Container>
  );
}
