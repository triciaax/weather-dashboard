//global variables
var currentCity = "";
var apiKey = "64300598ff5e5d0e4355814a64430ed9";
var history = {};
var searchButtonEl = document.getElementById("submit-button");
var searchTextEl = document.getElementById("search");
var cityNameEl = document.getElementById("city-name-date");
var cityWeatherEl = document.getElementById("city-weather-now");

// function to add api data to local storage
function saveHistory(city, data) {
    history[city] = data;
    var historyString = JSON.stringify(history);
    localStorage.setItem("weatherHistory", JSON.stringify(historyString));
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
        //get image from site
        console.log(response);
        setActiveWeather(city, response);

    })
}

function setActiveWeather(city, response) {
    var currentTime = response.dt
    var offset = response.timezone / 60 / 60;
    var momentTime = moment.unix(currentTime).utc().utcOffset(offset);
    let weatherIcon = `https://openweathermap.org/img/w/${response.weather[0].icon}.png`;
    headerInnerHtml = `
    <h3>
        ${response.name}: ${momentTime.format("(MM/DD/YYYY)")}
        <img src=${weatherIcon}>
    </h3>
    `
    cityNameEl.innerHTML = headerInnerHtml;

    var weatherNowHTML = `
    <ul style="list-style-type:none;">
    <li>Temperature: ${response.main.temp}</li>
    <li>Wind: ${response.wind.speed}</li>
    <li>Humidity: ${response.main.humidity}</li>
    <li> UV Index: (unable to pull via API provided)</li>
    </ul>
    `
    cityWeatherEl.innerHTML = weatherNowHTML;
}


searchButtonEl.addEventListener("click", function() {
    var city = searchTextEl.value;
    getWeatherInCity(city);
})


