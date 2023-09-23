
document.addEventListener('DOMContentLoaded', () => {

var cityInput = document.getElementById('city-input');
var submitBtn = document.getElementById('submitBtn');
var todaysWeather = document.getElementById('todays-weather');
var fiveDayForecast = document.getElementById('five-day-forecast');
var cityButtonsContainer = document.getElementById('city-buttons-container')
var recentCities = [];

function userInput(){
    var city = cityInput.value.trim();
    recentCities.push(city);
    localStorage.setItem("City", JSON.stringify(recentCities));
    fetchData(city)
}

function recentsButton() {

}

function fetchData(city){

    var todayApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=34d6089ab16bd209aa706e0ee00cbce8`;
    var forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=34d6089ab16bd209aa706e0ee00cbce8`;
    var kelvinToFahrenheit = (kelvin) => ((kelvin - 273.15) * 9/5 + 32);

    fetch(todayApiUrl).then((response) => {
        if (!response.ok) {
            throw new error('There was a problem in loading this page');
        }
        return response.json();
    })
    // .then((data) => {
    //     // Extract the icon code from the API response

    //     // Now you have the icon URL based on the user's input
    //     // console.log('Icon URL:', iconUrl);
    //     return data;
    //     console.log(data);
    // })
    .then((data) => {
        console.log(data);

        const currentTempFahrenheit = kelvinToFahrenheit(data.main.temp).toFixed(1);
        const maxTempFahrenheit = kelvinToFahrenheit(data.main.temp_max).toFixed(1);
        const minTempFahrenheit = kelvinToFahrenheit(data.main.temp_min).toFixed(1);

        // Display today's weather data
        const todayWeatherInfo = `
            <h2>The Weather Today in ${data.name}, ${data.sys.country}</h2>
            <h3>Current Temperature: ${currentTempFahrenheit}°F</h3>
            <img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png' />
            <h3>Description: ${data.weather[0].description}</h3>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} meters/sec</p>
        `;
        todaysWeather.innerHTML = todayWeatherInfo;
    })
    .catch((error) => {
        console.error('There was a problem in fetching the weather information for today', error);
    });

    // Grabbing the information of the 'forcastApiUrl' and making an arrow function using the response
    //  response from the network request (for the forecastApiUrl)



    fetch(forecastApiUrl).then((response) => {
        if (!response.ok) {
            throw new Error('There was a problem in loading this page');
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);

        const forecastList = [
            data.list[3],
            data.list[11],
            data.list[19],
            data.list[27],
            data.list[35]
        ]
        // Initializing an empty string to store the forecast HTML
        let forecastHTML = '';

        // Looping through the data within the forecast URL
        for (let i = 0; i < forecastList.length; i++) {
            const forecast = forecastList[i];
            const forecastDate = new Date(forecast.dt * 1000); // Converting timestamp to date
            const forecastTempFahrenheit = kelvinToFahrenheit(forecast.main.temp).toFixed(1);
            const forecastDescription = forecast.weather[0].description;

            // Create HTML for each day's forecast
            const dayForecastInfo = `
                <div class="day-forecast">
                    <h3>${forecastDate.toDateString()}</h3>
                    <h4>Temperature: ${forecastTempFahrenheit}°F</h4>
                    <img src='http://openweathermap.org/img/w/${forecast.weather[0].icon}.png' />
                    <h4>Description: ${forecastDescription}</h4>
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
    .catch((error) => {
        console.error('There was a problem in fetching the 5-day forecast', error);
    });
}

submitBtn.addEventListener('click', userInput);

})

