// API variables
var weatherAPIbaseURL = "https://api.openweathermap.org";
var weatherAPIkey = "94ebea31571843c6c5e0f41fe628959f";

// Global variables
var search = document.querySelector("#search");
var userinput = document.querySelector("#city");

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

//
function weather(geodata) {
    var lat = geodata[0].lat;
    var lon = geodata[0].lon;
    var city = geodata[0].name;
    var weather = `${weatherAPIbaseURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${weatherAPIkey}`;

    fetch(weather)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherdata) {
            console.log(weatherdata)
        })
}