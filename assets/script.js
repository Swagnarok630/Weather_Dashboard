// API variables
var weatherAPIbaseURL = "https://api.openweathermap.org";
var weatherAPIkey = "94ebea31571843c6c5e0f41fe628959f";

// Global variables
var search = document.querySelector("#search");
var userinput = document.querySelector("#city");
var stuff = document.querySelector("#stuff");

// Search button
search.addEventListener('submit', cityinput);

// Function to grab user's input
function cityinput(event) {
    input = userinput.value.trim();

    // Prevent default needed to stop input from actually being submitted by form element and retain input value for variable
    event.preventDefault();
    convert(input)
    console.log(input)
}

// Function to take user's city input and convert to raw data to grab latitude and longitude
function convert() {
    var geocode = `${weatherAPIbaseURL}/geo/1.0/direct?q=${input}&limit=5&appid=${weatherAPIkey}`;

    fetch(geocode)
        .then(function (response) {
            return response.json();
        })
        .then(function (geodata) {
            console.log(geodata)
            weather(geodata)
        })
}

// Function to take latitude and longitude data from geocode and make another request to grab weather data at that location
function weather(geodata) {
    var lat = geodata[0].lat;
    var lon = geodata[0].lon;
    var weather = `${weatherAPIbaseURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${weatherAPIkey}`;

    fetch(weather)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherdata) {
            console.log(weatherdata)
            appenddata(weatherdata)
        })
}

function appenddata(weatherdata) {
    var humidity = weatherdata.current.humidity
    var temp = weatherdata.current.temp

    console.log(humidity)
    console.log(temp)

    stuff.innerHTML = humidity
    stuff.innerHTML = temp
}