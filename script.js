
var cityInput = document.getElementById('city-input');
var submitBtn = document.getElementById('submitBtn');
var todaysWeather = document.getElementById('todays-weather');
var fiveDayForecast = document.getElementById('five-day-forecast');

searchBtn.addEventListener('click', () => {

    var city = cityInput.ariaValueMax.trim();

    var todayApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=$34d6089ab16bd209aa706e0ee00cbce8`;
    var forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=$34d6089ab16bd209aa706e0ee00cbce8`;


    fetch(todayApiUrl).then((response => {
        if (!response.ok) {
            throw new Error('There was a problem in loading this page');
        }
        return response.json();
    })
    .then((data) => {
        var todaysWeather = 
        <h2>The weather today in ${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp</p>
    })
    )



})


// http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=34d6089ab16bd209aa706e0ee00cbce8


// function start(){
// // create
// var h2El = document.createElement('h2')
// // add
// h2El.textContent = 'Hello World'
// // append
// topRight.append(h2El)
// }

// submitBtn.addEventListener('click', start)



// fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php").then(function (response) {
//     return response.json()
// }).then(function (data) {
//     console.log(data);
// })
