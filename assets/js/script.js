var apiKey = "bb8601e18b9103dc237a06422d96ca40"
var searchTextEl = $("#search");
var searchBtn = $("#searchBtn");
var city = "Seattle"
var featuredEl = $("#featured");
var forcastEl = $("#forcast");
var historyEl = $("#history");
var today = moment().format("MMM Do, YYYY");
var clearHist = $("#clearHist");
var cityLong;
// var errorMessage = $("#errorMessage");
var histArray;

function initStorage() {
    if (localStorage.getItem("storedArray")) {
        histArray = JSON.parse(localStorage.getItem("storedArray"));
    } else {
        histArray = [];
    }
}

function displayWeather() {

    //display the previous searches as buttons
    displayHistory();

    //This url retrieves the lat and lon of a city
    var geocode = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=" + 1 + "&appid=" + apiKey;

    //Use the lat/lon api to get appropriate results for the city
    fetch(geocode)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length == 0) {
                // alert("type a real city okay??");
                //display modal somehow?
                $("#errorMessage").modal("show");
                console.log("did my modal trigger?");
            }

            // console.log(data);

            //Display full city, state, country. If no state, just display city and country
            if(data[0].state){
                cityLong = data[0].name + ", " + data[0].state + ", " + data[0].country;
            } else {
                cityLong = data[0].name + ", " + data[0].country;
            }

            //find coords in api
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
    //use imperial units in the api call
    var oneCall = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    fetch(oneCall)
        .then(function (response) {
            if (!response) {
                console.log(response.statusText);
            } else {
                return response.json();
            }
        })
        .then(function (data) {
            // console.log(data);

            //Create a ton of divs, give classes, append and create each card starting with the feature card.

            // This is the featured card which displays TODAY 
            var featured = $("<div>").addClass("card col-12 bg-dark text-white border-white");
            featuredEl.append(featured);

            var cardHeader = $("<div>").addClass("card-header bg-dark text-white");
            cardHeader.text(cityLong);
            // cardHeader.text(data);
            featured.append(cardHeader);

            var featuredBody = $("<div>").addClass("card-body bg-dark text-white");
            featured.append(featuredBody);

            var featuredDate = $("<h4>").addClass("date");
            featuredDate.text(today);
            featuredBody.append(featuredDate);

            var featuredImg = $("<img>");
            featuredImg.attr("src", "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
            featuredBody.append(featuredImg);

            var featuredTemp = $("<p>").addClass("card-text");
            featuredTemp.text("Temperature: " + data.current.temp);
            featuredBody.append(featuredTemp);

            var featuredWind = $("<p>").addClass("card-text");
            featuredWind.text("Wind: " + data.current.wind_speed);
            featuredBody.append(featuredWind);

            var featuredHum = $("<p>").addClass("card-text");
            featuredHum.text("Humidity: " + data.current.humidity + "%");
            featuredBody.append(featuredHum);

            // UV stufffff
            // If index < 3, green
            // if index between 3 and 7, orange
            // if index > 7, RED!!!!! 
            var uvIndex = data.current.uvi;
            var uvColor;
            if (uvIndex < 3) {
                uvColor = "green";
            } else if (uvIndex > 2 && uvIndex < 8) {
                uvColor = "orange";
            } else {
                uvColor = "red";
            }

            var featuredUV = $("<p>").addClass("card-text");
            featuredUV.text("UV Index: " + data.current.uvi);
            featuredUV.css("color", uvColor);
            featuredUV.css("font-weight", "bolder");
            featuredBody.append(featuredUV);

            //initialize todays date and add to it for each card
            //Loop through and show the next five days 
            for (var i = 1; i < 6; i++) {

                //increase date by one day
                cardDate = moment().add(i, "d").format("MMM Do");

                var day = $("<div>").addClass("card col bg-dark text-white border-white").attr("id", "day");
                forcastEl.append(day);

                var dayBody = $("<div>").addClass("card-body bg-dark text-white");
                day.append(dayBody);

                var cardTitle = $("<div>").addClass("card-title");
                cardTitle.text(cardDate);
                dayBody.append(cardTitle);

                var cardImg = $("<img>").addClass("icon");
                cardImg.attr("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
                dayBody.append(cardImg);

                var cardTemp = $("<p>").addClass("card-text");
                cardTemp.text("Temperature: " + data.daily[i].temp.day);
                dayBody.append(cardTemp);

                var cardWind = $("<p>").addClass("card-text");
                cardWind.text("Wind: " + data.daily[i].wind_speed);
                dayBody.append(cardWind);

                var cardHum = $("<p>").addClass("card-text");
                cardHum.text("Humidity: " + data.daily[i].humidity + "%");
                dayBody.append(cardHum);
            }

            console.log(data);
        })
        .catch(console.error);
}

//Receive user input and throw that at displayWeather, then add it to history array
function search(event) {
    //Remove old elements to make room for new ones
    init(featuredEl);
    init(forcastEl);
    city = $('input[name="search"]').val().toLowerCase();
    //Convert user input to upper case on first letter
    if(city){
    histArray.unshift(city.substring(0,1).toUpperCase() + city.substring(1));
    }
    displayWeather();
}

// Simple function that empties everything below (inside) an element
function init(parent) {
    parent.empty();
}

function displayHistory() {
    //remove previous buttons if any
    init(historyEl);

    //for each item in the history array, display it as a button
    for (var i = 0; i < histArray.length; i++) {
        var btn = $("<button>").addClass("btn btn-primary bg-dark text-white");
        btn.attr("type", "button");
        btn.attr("id", "button" + i);
        btn.text(histArray[i]);
        console.log(histArray[i]);
        historyEl.append(btn);
        btn.on('click', function (event) {
            console.log(event.target.textContent);
            city = event.target.textContent;
            init(featuredEl);
            init(forcastEl);
            displayWeather();
        });
    }
    localStorage.setItem("storedArray", JSON.stringify(histArray));
}

//history button clicker function
function historyGo(event) {
    var btn = event.target.id;
    city = btn.text;
    console.log(city);
}

function clearHistory(){
    init(historyEl);
    localStorage.removeItem("storedArray");
    histArray = [];
}

initStorage();
displayWeather();
searchBtn.on('click', search);
clearHist.on('click', clearHistory);
