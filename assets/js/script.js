var apiKey = "bb8601e18b9103dc237a06422d96ca40"
var searchTextEl = $("#searchID");
var buttonEl = $("<button>");
// var city = $('input[name="search"]').val();


// var geocode = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=" + 1 + "&appid=" + apiKey;

function displayWeather() {
    // event.preventDefault();
    // city = city.val();
    var city = "seattle";
    console.log(city);

    var geocode = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=" + 1 + "&appid=" + apiKey;

    //Use the lat/lon api to get appropriate results for the city
    fetch(geocode)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lonRes = data[0].lon;
            var latRes = data[0].lat;
            //call function that fetches the actual weather stuff
            fetchWeather(latRes, lonRes);
        })
        .catch(function (error) {
            console.error(error);
        });
}

function fetchWeather(lat, lon) {
    var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    fetch(oneCall)
        .then(function (response) {
            if (!response) {
                console.log(response.statusText);
            } else {
                return response.json();
            }
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(console.error);
}

function searchAgain(event) {
    event.preventDefault();
    // city = $('input[name="search"]').val();
    // console.log(city);
    // displayWeather();
    console.log("YOU CLICKED IT");
    var whatever = $("#left");
    whatever.text("WAOEFPSFJOPSEFSEOPJF");
}

buttonEl.on('submit', searchAgain);
displayWeather;
