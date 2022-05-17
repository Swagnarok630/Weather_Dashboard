// Variable and script to save/load current theme so that site doesn't refresh theme each refresh
const currenttheme = localStorage.getItem("theme") ? localStorage.getItem("theme") : null;
if (currenttheme) {
    document.documentElement.setAttribute("data-theme", currenttheme);
}

// API variables
var weatherAPIbaseURL = "https://api.openweathermap.org";
var weatherAPIkey = "94ebea31571843c6c5e0f41fe628959f";
var futuramaAPI = "https://futuramaapi.herokuapp.com/api/quotes?search";
var catimgAPI = "https://api.thecatapi.com/v1/images/search";

// Global variables
var search = document.querySelector("#search");
var userinput = document.querySelector("#city");
var main = document.querySelector(".maincard") ;
var forecast = document.querySelector(".forecast");
var pastcontainer = document.querySelector(".history");
var searchhistory = [];
var unitstoggle = document.querySelector("#unitstoggle")
var clearbutton = document.querySelector("#clearbutton")

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
        localStorage.setItem("theme", "default")
    }
}
function midnighttheme() {
    if (midnightcheck.checked === true) {
        document.documentElement.setAttribute("data-theme", "midnight")
        localStorage.setItem("theme", "midnight")
    }
}
function daylighttheme() {
    if (daylightcheck.checked === true) {
        document.documentElement.setAttribute("data-theme", "daylight")
        localStorage.setItem("theme", "daylight")
    }
}
function twilighttheme() {
    if (twilightcheck.checked === true) {
        document.documentElement.setAttribute("data-theme", "twilight")
        localStorage.setItem("theme", "twilight")
    }
}

// Event listener for clear history button
clearbutton.addEventListener("click", clearhistory)

// Function to remove each item in history and empty out HTML element
function clearhistory() {
    // console.log(searchhistory)
    var h = searchhistory.length
    searchhistory.splice(0,h);
    // console.log(searchhistory)
    pastcontainer.innerHTML = "";
}

// Run to initialize any history buttons for local storage
historyinitial()

// Event listeners for search button and history buttons
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
    historylog(input);
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

    // Loop to create button for every item in the history list
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

// Function to take user's city input and converts to raw data to grab latitude and longitude
function convert(input) {
    var geocode = `${weatherAPIbaseURL}/geo/1.0/direct?q=${input}&limit=5&appid=${weatherAPIkey}`;

    fetch(geocode)
        .then(function (response) {
            return response.json();
        })
        .then(function (geodata) {
            // console.log(geodata);
            // Take latitude and longitude data and fetch weather data
            weather(geodata);
        })
        .catch(function (error) {
            console.error(error);
        });
}

// Function to take latitude and longitude data from geocode and make another request to grab weather data at that location
function weather(geodata) {
    // console.log(unitstoggle.checked)
    var lat = geodata[0].lat;
    var lon = geodata[0].lon;
    var city = geodata[0].name;

    // Conditional to check if fetch should be made in imperial units or metric units
    if (unitstoggle.checked === false) {
    var weather = `${weatherAPIbaseURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherAPIkey}`;
    }
    else {
    var weather = `${weatherAPIbaseURL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly&appid=${weatherAPIkey}`;
    }

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
            // Creating random card to go with weather card
            render();
        })
        .catch(function (error) {
            console.error(error);
        });
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
    var uvtext = document.createElement("p");
    var uvnum = document.createElement("label")

    // Deleting previous cards and attaching current card to main section on html and add class attribute to style
    current.setAttribute("class", "currentweather");
    main.innerHTML = "";
    main.append(current);

    // Conditional to help style the element for UV index 
    if (uv < 3) {
        uvnum.classList.add("gucci");
      } else if (uv < 7) {
        uvnum.classList.add("uh-oh");
      } else {
        uvnum.classList.add("oh-no");
      }

    // Adding data to elements
    citytext.textContent = city;
    datetext.textContent = date;
    conditiontext.textContent = "Conditions: " + condition;
    humidtext.textContent = "Humidity: " + humidity + "%";
    uvtext.textContent = "UV Index:";
    uvnum.textContent = uv
    // Conditional to change text depending on what units of measure was searched with
    if (unitstoggle.checked === false) {
        temptext.textContent = "Temperature: " + temp + " °F";
        windtext.textContent = "Wind Speed: " + wind + " MPH";
    }
    else {
        temptext.textContent = "Temperature: " + temp + " °C";
        windtext.textContent = "Wind Speed: " + wind + " M/S";
    }

    // Adding icon to citytext
    iconimg.setAttribute("src", icon);
    iconimg.setAttribute("alt", icondes);
    citytext.append(iconimg);

    // Adding current elements to card
    current.append(citytext, datetext, conditiontext, temptext, humidtext, windtext, uvtext, uvnum);
}

// Function to create cards for a 5-day forecast for the current city searched
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
        humidtext.textContent = "Humidity: " + humid + "%";
        // Conditional to change text depending on what units of measure was searched with
        if (unitstoggle.checked === false) {
            temptext.textContent = "Temperature: " + temp + " °F";
            windtext.textContent = "Wind Speed: " + wind + " MPH";
        }
        else {
            temptext.textContent = "Temperature: " + temp + " °C";
            windtext.textContent = "Wind Speed: " + wind + " M/S";
        }

        // Adding icon to citytext
        iconimg.setAttribute("src", icon);
        iconimg.setAttribute("alt", icondes);
        datetext.append(iconimg);

        // Adding current elements to card
        future.append(datetext, conditiontext, temptext, humidtext, windtext);
    }
}

// Function to generate random Futurama quote and random cat picture to add alongside weather card
function render() {
    var randomcard = document.createElement("div");
    randomcard.setAttribute("class", "randomstuff");
    main.append(randomcard);
    futurama()
    cat()

    // Fetch from Futurama API to grab a quote and speaker
    function futurama() {
        fetch(futuramaAPI)
            .then(function (response1) {
                return response1.json();
            })
            .then(function (quote) {
                // console.log(quote);
                renderquote(quote);
            })
            .catch(function (error) {
                console.error(error);
            });
        // Function to randomly grab a quote, create elements and append to random card 
        function renderquote(quote) {
            var r = Math.floor(Math.random() * 20)
            var fquote = quote[r].quote
            var fchar = quote[r].character
        
            var fquotetext = document.createElement("p");
            var fchartext = document.createElement("p");
        
            fquotetext.setAttribute("class", "quote")
            fchartext.setAttribute("class", "char")
            fquotetext.textContent = `"${fquote}"`;
            fchartext.textContent = fchar;
        
            randomcard.append(fquotetext, fchartext)
        }
    }
    // Fetch from cat API to grab a random image
    function cat() {
        fetch(catimgAPI)
            .then(function (response2) {
                return response2.json();
            })
            .then(function (image) {
                // console.log(image);
                renderimage(image);
            })
            .catch(function (error) {
                console.error(error);
            });
        // Function to create elements and append random image to the random card
        function renderimage(image) {
            var catimg = image[0].url
            var catdes = "Random cat picture"
        
            var randomcat = document.createElement("img")
            randomcat.setAttribute("src", catimg);
            randomcat.setAttribute("alt", catdes);
            randomcat.setAttribute("width", "60%");
            randomcat.setAttribute("height", "60%")
        
            randomcard.append(randomcat)
        }
    }
}