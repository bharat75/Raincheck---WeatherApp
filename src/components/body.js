import React, { useEffect, useState } from "react";
import haze from "../assets/haze.png";
import humidity from "../assets/humidity.png";
import temp from "../assets/temperature.png";
import viz from "../assets/visibility.png";
import winds from "../assets/winds-weather-symbol.png";
import cloudy from "../assets/cloudy.png";
import mist from "../assets/mist.png";
import rain from "../assets/rain.png";
import sunny from "../assets/sunny.png";
import Shimmer from "./shimmer";

const Body = () => {
  const [weather, setWeather] = useState(null);
  const [date, setDate] = useState(new Date());
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("Ranchi");
  const [useLocation, setUseLocation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (useLocation) {
      setLoading(true);
      getLocationWeather();
    } else {
      setLoading(true);
      getWeather(searchedCity);
    }
    getCurrentTime();
  }, [searchedCity, useLocation]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function getWeather(cityName) {
    try {
      await delay(2000);
      const data = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=5dce8b852c20f0860429972dc00b16f6`
      );
      const json = await data.json();
      setWeather(json);
      console.log(json);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  async function getLocationWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await delay(2000);
          const data = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=5dce8b852c20f0860429972dc00b16f6`
          );
          const json = await data.json();
          setWeather(json);
          console.log(json);
        } catch (error) {
          console.error("Error fetching weather data:", error);
          setWeather(null);
        } finally {
          setLoading(false);
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }

  function getCurrentTime() {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setUseLocation(false);
    setSearchedCity(city);
  };

  const formatDateTime = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    const formattedTime = date.toLocaleTimeString();
    return `${formattedDate}, ${formattedTime}`;
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "cloudy":
        return cloudy;
      case "haze":
        return haze;
      case "rain":
        return rain;
      case "mist":
        return mist;
      case "clear":
        return sunny;
      default:
        return haze;
    }
  };

  return (
    <>
      <div className="main-body">
        <div className="Search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <button className="location-btn" onClick={() => setUseLocation(true)}>
            Use My Location
          </button>
        </div>

        <div className="date-time">
          {date ? <p>{formatDateTime()}</p> : <p>Date is not available</p>}
        </div>

        <div className="Weather-card">
          {loading ? (
            <Shimmer />
          ) : weather && weather.cod === 200 ? (
            <>
              <div className="city">
                <h1>{weather.name + ", " + weather.sys.country}</h1>
              </div>
              <div className="weather-att">
                <div className="weather-item">
                  <img src={temp} alt="Temperature" />
                  <p>Temperature</p>
                  <p>{weather.main.temp}° C</p>
                </div>
                <div className="weather-item">
                  <img
                    src={getWeatherIcon(weather.weather[0].main)}
                    alt="Weather condition"
                  />
                  <p>Weather type</p>
                  <p>{weather.weather[0].main}</p>
                </div>
                <div className="weather-item">
                  <img src={humidity} alt="Humidity" />
                  <p>Humidity</p>
                  <p>{weather.main.humidity} %</p>
                </div>
                <div className="weather-item">
                  <img src={winds} alt="Wind" />
                  <p>Wind</p>
                  <p>{weather.wind.speed} Km/h</p>
                </div>
                <div className="weather-item">
                  <img src={viz} alt="Visibility" />
                  <p>Visibility</p>
                  <p>{weather.visibility} Km</p>
                </div>
              </div>
            </>
          ) : (
            <p>
              {weather && weather.message
                ? weather.message
                : "Weather data not available"}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Body;
