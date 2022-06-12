//global variables
var currentCity = ""
var apiKey = "64300598ff5e5d0e4355814a64430ed9"

// function to retrieve the weather in the selected city
function getWeatherInCity(city) {
    // build the api query string
    var queryString = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    fetch(queryString)
    .then((response) => response.json())
    .then((response) => {
        console.log(response)
    })
}

getWeatherInCity("san diego")