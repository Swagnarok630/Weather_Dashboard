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
    console.log(input)
}
