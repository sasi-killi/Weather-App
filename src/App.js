import React, { Component } from "react";
import search from "./images/search.png";

class App extends Component {
  state = {
    inputValue: "",
    weatherData: {
      temp: 28,
      city: "London",
      icon: "03d",
      weatherDescription: "cloudy",
      timeStamp: "06:09-Sunday,6 oct'2019",
      cloudy: "0%",
      humidity: "0%",
      wind: "0m/sec",
    },
    recentSearch: ["Birmingham", "Manchester", "New York", "California"],
  };

  formateDate = (date) => {
    let hr = date.getHours() + 1;
    let min =
      date.getMinutes().toString().length === 1
        ? +`0${date.getMinutes()}`
        : date.getMinutes();
    let day = date.getDay();
    let num = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let timeStamp = ``;
    const day_arr = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const month_arr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    timeStamp = `${hr}:${min}-${day_arr[day]}, ${num} ${month_arr[month]}' ${year}`;
    return timeStamp;
  };

  handleFetch = async (e) => {
    e.preventDefault();
    const timeStamp = this.formateDate(new Date());
    const city = this.state.inputValue;
    const API_KEY = "4d28f02b3d251cabd33de10f4c06c895";
    console.log(city);

    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},356&appid=${API_KEY}`
    );
    const weatherdata = await response.json();
    console.log(weatherdata);
    if (weatherdata.cod === 200) {
      this.setState({
        weatherData: {
          temp: Math.trunc(weatherdata.main.temp - 273.15),
          city: weatherdata.name,
          icon: weatherdata.weather[0].icon,
          weatherDescription: weatherdata.weather[0].description,
          timeStamp: timeStamp,
          cloudy: weatherdata.clouds.all + "%",
          humidity: weatherdata.main.humidity + "%",
          wind: weatherdata.wind.speed + "m/sec",
        },
        recentSearch: [...this.state.recentSearch, city],
      });
    } else {
      alert(weatherdata.message);
    }
  };

  handleChange = (e) => {
    this.setState({ inputValue: e.target.value.trim() });
  };

  updateInput = (e) => {
    this.setState({ inputValue: e.target.textContent });
  };

  determineClass = () => {
    const str = this.state.weatherData.weatherDescription.toLowerCase();
    console.log(str);
    if (str.indexOf("rain") !== -1) {
      return "App rainy";
    } else if (str.indexOf("cloud") !== -1) {
      return "App cloudy";
    } else if (str.indexOf("sun") !== -1) {
      return "App sunny";
    } else if (str.indexOf("haze") !== -1) {
      return "App haze";
    } else if (str.indexOf("sky") !== -1) {
      return "App clearsky";
    } else if (str.indexOf("storm") !== -1) {
      return "App thunder";
    } else {
      return "App generic";
    }
  };

  render() {
    const icon = `http://openweathermap.org/img/w/${this.state.weatherData.icon}.png`;
    let recentSearch = this.state.recentSearch;
    if (recentSearch.length > 4) {
      let temp = recentSearch.shift();
      if (recentSearch[3].toLowerCase() === recentSearch[2].toLowerCase()) {
        recentSearch.unshift(temp);
        recentSearch.pop();
      }
      this.setState({ recentSearch: recentSearch });
    }
    return (
      <div className={this.determineClass()}>
        <div className="display">
          <div className="temp-box">
            <div className="temperature">
              <p>
                <span>{this.state.weatherData.temp}</span>
                <sup>&deg;</sup>
              </p>
            </div>
            <div className="key-data">
              <div className="city">
                <p>{this.state.weatherData.city}</p>
                <p>
                  <span>{this.state.weatherData.timeStamp}</span>
                </p>
              </div>
              <div className="weather-description">
                <div className="icon">
                  <img src={icon} alt="weather-icon"></img>
                </div>
                <p>{this.state.weatherData.weatherDescription}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="blur">
          <div className="search-container">
            <form
              className="search-bar-container"
              onSubmit={(e) => this.handleFetch(e)}
            >
              <input
                type="search"
                value={this.state.inputValue}
                onChange={(e) => this.handleChange(e)}
                className="search-bar font-color"
                placeholder="Another Location"
              ></input>
            </form>
            <div className="search-icon-container">
              <img
                src={search}
                alt="search-icon"
                className="search-icon"
                onClick={(e) => this.handleFetch(e)}
              ></img>
            </div>
          </div>
          <div
            className="search-history font-color"
            onClick={(e) => this.updateInput(e)}
          >
            <p className="row">{recentSearch[recentSearch.length - 1]}</p>
            <p className="row">{recentSearch[recentSearch.length - 2]}</p>
            <p className="row">{recentSearch[recentSearch.length - 3]}</p>
            <p className="row">{recentSearch[recentSearch.length - 4]}</p>
          </div>
          <div className="weather-data font-color">
            <h3>Weather Details</h3>
            <p className="row">
              <span>cloudy</span> <span>{this.state.weatherData.cloudy}</span>
            </p>
            <p className="row">
              <span>humidity</span>{" "}
              <span>{this.state.weatherData.humidity}</span>
            </p>
            <p className="row">
              <span>wind </span>
              <span>{this.state.weatherData.wind}</span>
            </p>
          </div>
          <div className="empty">
            <p className="font-color">Weather App</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
