// The following events will only occur once the HTML document has completely loaded
document.addEventListener('DOMContentLoaded', () => {

// Variables connected to DOM elements 
var cityInput = document.getElementById('city-input');
var submitBtn = document.getElementById('submitBtn');
var todaysWeather = document.getElementById('todays-weather');
var fiveDayForecast = document.getElementById('five-day-forecast');
// Initializing an array for 'recentCities' to be held/input
var recentCities = [];

/* Function to be called when user clicks the 'submit' button -> They're input is pushed to a string in
the local storage, prompted API information is fetched and displayed, and the search result is added to 
a button below the input container, allowing for easy re-searching of the city by clicking the button */
function userInput(){
    var city = cityInput.value.trim();
    recentCities.push(city);
    localStorage.setItem("recentCities", JSON.stringify(recentCities));
    fetchData(city)
    recentsButtons();
}

/* Function that is grabbing the input breing pushes to local storage, parsing the data, and
creating a button for that search that can re-fetch coresponding data when clicked on. BootStrap
styling is also being added to the buttons created. These buttons are being appended to the 
'city-buttons-container' created in the DOM */
function recentsButtons() {
    // Pulling and parsing data from Local Storage
    var storedRecentCities = JSON.parse(localStorage.getItem("recentCities"));
    // creating element for the city-buttons-container in the DOM
    var cityButtonsContainer = document.getElementById("city-buttons-container");

    // Clear the existing buttons before creating new ones
    cityButtonsContainer.innerHTML = "";
    // If there is anything saved to local storage,
    if (Array.isArray(storedRecentCities)) {
        storedRecentCities.forEach((city) => {
            // Create a button element for each city
            var cityButton = document.createElement("button");
            // Paste user's input city to this button as the text
            cityButton.textContent = city;
            // Adding bootStrap styling to each button
            cityButton.classList.add("btn", "btn-info", "btn-sm", "mr-2");
            
            // Click event listener to the button
            cityButton.addEventListener("click", function () {
                // fetching data for the selected city
                fetchData(city);
            });

            // Append the button to the container
            cityButtonsContainer.appendChild(cityButton);
        });
    }
}

// Function to fetch specified information from API's and display to page
function fetchData(city){
    // Creating variables for each of the API UTLs
    var todayApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=34d6089ab16bd209aa706e0ee00cbce8`;
    var forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=34d6089ab16bd209aa706e0ee00cbce8`;
    // Variable equation used to convert kelvin into fahrenheit
    var kelvinToFahrenheit = (kelvin) => ((kelvin - 273.15) * 9/5 + 32);

    // Check network response when fetching the 'todayApiUrl'
    fetch(todayApiUrl).then((response) => {
        // If network response is not ok, throw an error
        if (!response.ok) {
            // Throw error if network response is not 200-299
            throw new error('There was a problem in loading this page');
        }
        /* If the response.ok property is true, meaning the HTTP request was successful, this line of
        code parses the JSON content of the HTTP response body and returns it as a JavaScript object. */
        return response.json();
    })
    // Grab data within URL
    .then((data) => {
        console.log(data);
        /* Creating variables that are the fahrenheit versions of all temperatures we will be 
        requesting, using previously made variable equation */
        const currentTempFahrenheit = kelvinToFahrenheit(data.main.temp).toFixed(1);
        const maxTempFahrenheit = kelvinToFahrenheit(data.main.temp_max).toFixed(1);
        const minTempFahrenheit = kelvinToFahrenheit(data.main.temp_min).toFixed(1);

        // Display today's weather data
        const todayWeatherInfo = `
            <h2>The Weather Today in ${data.name}, ${data.sys.country}</h2>
            <h3>Current Temperature: ${currentTempFahrenheit}°F</h3>
            <img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png' />
            <h4>Description: ${data.weather[0].description}</h4>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} meters/sec</p>
        `;
        // Display content on the 'todaysWeather' of DOM
        todaysWeather.innerHTML = todayWeatherInfo;
    })
    .catch((error) => {
        console.error('There was a problem in fetching the weather information for today', error);
    });

    // Check network response when fetching the 'forecastApiUrl'
    fetch(forecastApiUrl).then((response) => {
        if (!response.ok) {
            // Throw error if network response is not 200-299
            throw new Error('There was a problem in loading this page');
        }
        /* If the response.ok property is true, meaning the HTTP request was successful, this line of
        code parses the JSON content of the HTTP response body and returns it as a JavaScript object. */
        return response.json();
    })
    // Grab data within URL
    .then((data) => {
        console.log(data);
        // Creating array of the specific hour interval during each of the 5 days
        const forecastList = [
            data.list[3],
            data.list[11],
            data.list[19],
            data.list[27],
            data.list[35]
        ]
        // Initializing an empty string to store the forecast HTML
        let forecastHTML = '';

        // Looping through the data within the forecast URL, displaying the requested informaiton
        for (let i = 0; i < forecastList.length; i++) {
            const forecast = forecastList[i];
            const forecastDate = new Date(forecast.dt * 1000); // Converting timestamp to date
            const forecastTempFahrenheit = kelvinToFahrenheit(forecast.main.temp).toFixed(1);
            const forecastDescription = forecast.weather[0].description;

            // Create HTML for each day's forecast
            const dayForecastInfo = `
                <div class="forecast-day">
                    <h3>${forecastDate.toDateString()}</h3>
                    <h5>Temperature: ${forecastTempFahrenheit}°F</h5>
                    <img src='http://openweathermap.org/img/w/${forecast.weather[0].icon}.png' />
                    <h6>Description: ${forecastDescription}</h7>

                    <p>Humidity: ${forecast.main.humidity}%</p>
                    <p>Wind Speed: ${forecast.wind.speed} meters/sec</p>
                </div>
            `;

            // Append the forecast info to the forecastHTML
            forecastHTML += dayForecastInfo;
        }

        // Display the 5-day forecast on the webpage
        fiveDayForecast.innerHTML = forecastHTML;
    })
    // If an error is caught, send an error message to the console
    .catch((error) => {
        console.error('There was a problem in fetching the 5-day forecast', error);
    });
}
// Calling the recentButtons() function upon page load, Immediatly after DOM content loaded
recentsButtons();
// Calling the userInput function when the submit button is clicked on
submitBtn.addEventListener('click', userInput);

})

