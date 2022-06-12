//global variables
var currentCity = "";
var apiKey = "64300598ff5e5d0e4355814a64430ed9";
var history = {};
var history5Day ={};
var searchButtonEl = document.getElementById("submit-button");
var searchTextEl = document.getElementById("search");
var cityNameEl = document.getElementById("city-name-date");
var cityWeatherEl = document.getElementById("city-weather-now");
var forecastEl = document.getElementById("5-day-forecast");

// function to add api data to local storage - current
function saveHistory(city, data) {
    history[city] = data;
    var historyString = JSON.stringify(history);
    localStorage.setItem("weatherHistory", JSON.stringify(historyString));
}

// function to add api data to local storage - 5 day
function save5DayHistory(city, data) {
    history5Day[city] = data;
    var historyString = JSON.stringify(history5Day);
    localStorage.setItem("history5Day", JSON.stringify(historyString));
}

// function to load the history from local storage - runs on page load
function loadHistory() {
    var history_string = localStorage.getItem("weatherHistory");
    history = JSON.parse(history_string);
}

// function to retrieve the weather in the selected city
function getWeatherInCity(city) {
    // build the api query string
    var queryString = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    fetch(queryString)
    .then((response) => response.json())
    .then((response) => {
        // update the weather history in local storage
        saveHistory(city, response);
        console.log(response);
        setActiveWeather(response);

    })
}

//function to set the active city
function setActiveWeather(response) {
    //build correct date, time, and weather image
    var currentTime = response.dt
    var offset = response.timezone / 60 / 60;
    var momentTime = moment.unix(currentTime).utc().utcOffset(offset);
    let weatherIcon = `https://openweathermap.org/img/w/${response.weather[0].icon}.png`;
    headerInnerHtml = `
    <h3>
        ${response.name}: ${momentTime.format("MM/DD/YYYY")}
        <img src=${weatherIcon}>
    </h3>
    `
    cityNameEl.innerHTML = headerInnerHtml;

    //to pull temp, wind, humidity, & uv index data
    var weatherNowHTML = `
    <ul style="list-style-type:none;">
    <li>Temp: ${response.main.temp}&#176;F</li>
    <li>Wind: ${response.wind.speed} mph</li>
    <li>Humidity: ${response.main.humidity}%</li>
    <li> UV Index: (unable to pull via API provided)</li>
    </ul>
    `
    cityWeatherEl.innerHTML = weatherNowHTML;
}

// function to pull 5-day weather data
function get5DayWeatherData(city) {
    let queryString = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&APPID=${apiKey}`
    fetch(queryString)
    .then((response) => response.json())
    .then((response) => {
        // update the weather history in local storage
        save5DayHistory(city, response);
        console.log(response);
        set5DayWeather(response)
    })
}

//function to set 5 day weather data
function set5DayWeather(response) {
    var htmlString = `
    <div class="text-center"><h3>5-Day Forecast</h3></div>
    <div class="container align-middle px-2 py-2">
            <div class="row">
    `;
    for (i = 6; i < 11; i++) {
        //convert date to different format
        var currentTime = response.list[i].dt
        var momentTime = moment.unix(currentTime).utc();
        let weatherIcon = `https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`;
        var innerHTML = `
                <div class="col-lg-2 col-md-1 col-sm-1 p-3 mb-2 bg-dark text-white mx-auto">
                    <h5>${momentTime.format("MM/DD/YYYY")}</h5>
                    <br><img src=${weatherIcon}>
                    <br>Temp: ${response.list[i].main.temp}&#176;F
                    <br>Wind: ${response.list[i].wind.speed} mph
                    <br>Humidity: ${response.list[i].main.humidity}%
                </div>
        `
        htmlString += innerHTML
    }
    htmlString += `
    </div>
    </div>
    `

    forecastEl.innerHTML = htmlString;
}

searchButtonEl.addEventListener("click", function() {
    var city = searchTextEl.value;
    getWeatherInCity(city);
    get5DayWeatherData(city);
})