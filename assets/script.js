// API variables
var weatherAPIbaseURL = "https://api.openweathermap.org";
var weatherAPIkey = "94ebea31571843c6c5e0f41fe628959f";

// Global variables
var search = document.querySelector("#search");
var userinput = document.querySelector("#city");
var main = document.querySelector(".maincard") ;
var forecast = document.querySelector(".forecast");
var pastcontainer = document.querySelector(".history");
var searchhistory = [];

// Theme variables for radio input and for label as buttons
var defaultcheck = document.querySelector("#default")
var midnightcheck = document.querySelector("#P3")
var daylightcheck = document.querySelector("#P4")
var twilightcheck = document.querySelector("#P5")
var defaultinput = document.querySelector(".default")
var midnight = document.querySelector(".midnight");
var daylight = document.querySelector(".daylight");
var twilight = document.querySelector(".twilight");

// Event listeners for label buttons
defaultinput.addEventListener("click", defaulttheme)
midnight.addEventListener("click", midnighttheme)
daylight.addEventListener("click", daylighttheme)
twilight.addEventListener("click", twilighttheme)

// Functions to change themes upon button click
function defaulttheme() {
    if (defaultcheck.checked === true) {
        document.documentElement.setAttribute("data-theme", "default")
    }
}

function midnighttheme() {
    if (midnightcheck.checked === true) {
        document.documentElement.setAttribute("data-theme", "midnight")
    }
}

function daylighttheme() {
    if (daylightcheck.checked === true) {
        document.documentElement.setAttribute("data-theme", "daylight")
    }
}

function twilighttheme() {
    if (twilightcheck.checked === true) {
        document.documentElement.setAttribute("data-theme", "twilight")
    }
}


// Run to initialize any history buttons for local storage
historyinitial()

// Search button and history buttons
search.addEventListener("submit", cityinput);
pastcontainer.addEventListener("click", historyclick);

// Function to grab user's input
function cityinput(event) {
    // Prevents search if form is empty
    if (!userinput.value) {
        return;
    }
    // Eliminates spaces around user input and sets value
    input = userinput.value.trim();

    // Prevent default needed to stop input from actually being submitted by form element and retain input value for variable
    event.preventDefault();
    // Take user input and run into API fetch
    convert(input);
    // Empty out form once search is conducted
    userinput.value = "";
    // console.log(input);
}

// Function to add inputs to history
function historylog(input) {
    // If the search item is already in the history list, we don't add to the list
    if (searchhistory.indexOf(input) !== -1) {
        return;
    }
    // If array has 10 items already, remove oldest entry and replace with new entry
    if (searchhistory.length === 10) {
        searchhistory.splice(0,1);
        searchhistory.push(input);
    }
    else {
    // Adding input to array
    searchhistory.push(input);
    }
    // console.log(searchhistory);
    // Setting to local storage
    localStorage.setItem("searchhistory", JSON.stringify(searchhistory));
    // Take input and create button
    historybuttons()
}

// Function to add search history as buttons to a search history list
function historybuttons() {
    // Clear section and re-initialize with search history
    pastcontainer.innerHTML = "";

    for (var i = searchhistory.length - 1; i >= 0; i--) {
        var button = document.createElement("button");
        button.setAttribute("type", "button");
        button.textContent = searchhistory[i];
        // To allow access to city name for historyclick function
        button.setAttribute("searched", searchhistory[i])
        // To help determine if historyclick will need to perform search or not
        button.classList.add("buttonhistory")
        pastcontainer.append(button);
    }
}

// Function to initialize the history list
function historyinitial() {
    // Grab list from local storage
    var storedhistory = localStorage.getItem("searchhistory");
    if (storedhistory) {
        searchhistory = JSON.parse(storedhistory);
    }
    // Parse list into buttons for the history list
    historybuttons();
}

// Function to allow history list to be clicked and perform searches
function historyclick(event) {
    // If item doesn't have buttonhistory class (any item not a button) it won't attempt a search
    if (!event.target.matches(".buttonhistory")) {
        return;
    }
    // Button clicked will have value of attribute
    var button = event.target;
    var input = button.getAttribute("searched");
    // Uses attribute as input and performs fetch through API
    convert(input);
}


// Function to take user's city input and convert to raw data to grab latitude and longitude
function convert(input) {
    var geocode = `${weatherAPIbaseURL}/geo/1.0/direct?q=${input}&limit=5&appid=${weatherAPIkey}`;

    fetch(geocode)
        .then(function (response) {
            return response.json();
        })
        .then(function (geodata) {
            // console.log(geodata);
            // Push to history list and perform next API search
            historylog(input);
            weather(geodata);
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
            // console.log(weatherdata);
            // console.log(city);
            // Take data from fetch and create weather cards for current day and forecast
            currentcard(city, weatherdata);
            futurecards(city, weatherdata);
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
    // Needs to be outside of loop to clear 5-day forecast or it'd delete itself per day
    forecast.innerHTML = "";
    // Loop to grab weather data for the next 5 days and attach to card
    for (var i = 1; i < 6; i++) {
        var date = moment().add(i, "days").format("L");
        var icon = "http://openweathermap.org/img/wn/" + weatherdata.daily[i].weather[0].icon + ".png";
        var icondes = weatherdata.daily[i].weather[0].description;
        var condition = weatherdata.daily[i].weather[0].main;
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
