// API variables
var weatherAPIbaseURL = "https://api.openweathermap.org";
var weatherAPIkey = "94ebea31571843c6c5e0f41fe628959f";

// Global variables
var search = document.querySelector("#search");
var userinput = document.querySelector("#city");
var stuff = document.querySelector("#stuff");
var main = document.querySelector(".maincard") ;
var forecast = document.querySelector(".forecast")

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
    var city = geodata[0].name;
    var weather = `${weatherAPIbaseURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherAPIkey}`;

    fetch(weather)
        .then(function (response) {
            return response.json();
        })
        .then(function (weatherdata) {
            console.log(weatherdata)
            console.log(city)
            currentcard(city, weatherdata)
            futurecards(city, weatherdata)
        })
}

// Function to create present day weather card for current search city
function currentcard(city, weatherdata) {
    // Data to grab from API fetch that will be put into card
    var date = moment().format("L");
    var condition = weatherdata.current.weather[0].main;
    var temp = weatherdata.current.temp;
    var humidity = weatherdata.current.humidity;
    var wind = weatherdata.current.wind_speed;
    var uv = weatherdata.current.uvi;
    var icon = "http://openweathermap.org/img/wn/" + weatherdata.current.weather[0].icon + ".png";
    var icondes = weatherdata.current.weather[0].description;

    // Variables to create elements of card
    var current = document.createElement("div");
    var citytext = document.createElement("h2");
    var iconimg = document.createElement("img");
    var datetext = document.createElement("h3");
    var conditiontext = document.createElement("p");
    var temptext = document.createElement("p");
    var humidtext = document.createElement("p");
    var windtext = document.createElement("p");
    var uvtext = document.createElement("label");

    // Deleting previous cards and attaching current card to main section on html and add class attribute to style
    current.setAttribute("class", "currentweather");
    main.innerHTML = "";
    main.append(current);

    // Adding data to elements
    citytext.textContent = city;
    datetext.textContent = date;
    conditiontext.textContent = "Conditions: " + condition;
    temptext.textContent = "Temperature: " + temp + " °F";
    humidtext.textContent = "Humidity: " + humidity + "%";
    windtext.textContent = "Wind Speed: " + wind + " MPH";
    uvtext.textContent = "UV Index: " + uv;

    // Adding icon to citytext
    iconimg.setAttribute("src", icon);
    iconimg.setAttribute("alt", icondes);
    citytext.append(iconimg);

    // Adding current elements to card
    current.append(citytext, datetext, conditiontext, temptext, humidtext, windtext, uvtext);
}

function futurecards(city, weatherdata) {
    // Needs to be outside of loop to clear 5-day forecast or it'd delete itself
    forecast.innerHTML = "";
    // Loop to grab weather data for the next 5 days and attach to card
    for (var i = 1; i < 6; i++) {
        var date = moment().add(i, "days").format("L");
        var icon = "http://openweathermap.org/img/wn/" + weatherdata.daily[i].weather[0].icon + ".png";
        var icondes = weatherdata.daily[i].weather[0].description
        var condition = weatherdata.daily[i].weather[0].main
        var temp = weatherdata.daily[i].temp.day;
        var humid = weatherdata.daily[i].humidity;
        var wind = weatherdata.daily[i].wind_speed;

        // Variables to create elements of card
        var future = document.createElement("div");
        var iconimg = document.createElement("img");
        var datetext = document.createElement("h3");
        var conditiontext = document.createElement("p");
        var temptext = document.createElement("p");
        var humidtext = document.createElement("p");
        var windtext = document.createElement("p");

        // Attaching current cards to forecast section on html and add class attribute to style
        future.setAttribute("class", "forecard");
        forecast.append(future);

        // Adding data to elements
        datetext.textContent = date;
        conditiontext.textContent = "Conditions: " + condition;
        temptext.textContent = "Temperature: " + temp + " °F";
        humidtext.textContent = "Humidity: " + humid + "%";
        windtext.textContent = "Wind Speed: " + wind + " MPH";

        // Adding icon to citytext
        iconimg.setAttribute("src", icon);
        iconimg.setAttribute("alt", icondes);
        datetext.append(iconimg);

        // Adding current elements to card
        future.append(datetext, conditiontext, temptext, humidtext, windtext);
    }
}
