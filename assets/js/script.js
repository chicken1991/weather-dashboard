var apiKey = "bb8601e18b9103dc237a06422d96ca40"
var searchTextEl = $("#searchID");
var searchBtn = $("#searchBtn");
var city = "Seattle"
var featuredEl = $("#featured");
var forcastEl = $("#forcast");
var historyEl = $("#history");
var today = moment().format("MMM Do, YYYY");
var histArray;

function initStorage(){
    var oldStoredArray = JSON.parse(localStorage.getItem("storedArray"));
    if (oldStoredArray){
        histArray = oldStoredArray;
    } else {
        histArray = [];
    }
}

function displayWeather() {

    //display the previous searches as buttons
    displayHistory();
       
    //This url retrieves the lat and lon of a city
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

            //Create a ton of divs, give classes, append and create each card starting with the feature card.

            // This is the featured card which displays TODAY 
            var featured = $("<div>").addClass("card col-12");
            featuredEl.append(featured);
            
            var cardHeader = $("<div>").addClass("card-header");
            cardHeader.text(city);
            featured.append(cardHeader);
            
            var featuredBody = $("<div>").addClass("card-body");
            featured.append(featuredBody);
            
            var featuredDate = $("<h5>").addClass("date");
            featuredDate.text(today);
            featuredBody.append(featuredDate);
            
            var featuredImg = $("<img>");
            featuredImg.attr("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
            featuredBody.append(featuredImg);
            
            var featuredTemp = $("<p>").addClass("card-text");
            featuredTemp.text("Temperature: " + data.current.temp);
            featuredBody.append(featuredTemp);
            
            var featuredWind = $("<p>").addClass("card-text");
            featuredWind.text("Wind: " + data.current.wind_speed);
            featuredBody.append(featuredWind);
            
            var featuredHum = $("<p>").addClass("card-text");
            featuredHum.text = ("Humidity: " + data.current.humidity);
            featuredBody.append(featuredHum);
            
            var featuredUV = $("<p>").addClass("card-text");
            featuredUV.text("UV Index: " + data.current.uvi);
            featuredBody.append(featuredUV);

            //initialize todays date and add to it for each card
            //Loop through and show the next five days 
            for (var i = 1; i < 6; i++) {

                //increase date by one day
                cardDate = moment().add(i, "d").format("MMM Do");

                var day = $("<div>").addClass("card col").attr("id", "day");
                forcastEl.append(day);

                var dayBody = $("<div>").addClass("card-body");
                day.append(dayBody);
                
                var cardTitle = $("<div>").addClass("card-title");
                cardTitle.text(cardDate);
                dayBody.append(cardTitle);
                
                var cardImg = $("<img>").addClass("icon");
                cardImg.attr("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon  + "@2x.png");
                dayBody.append(cardImg);
                
                var cardTemp = $("<p>").addClass("card-text");
                cardTemp.text("Temperature: " + data.current.temp);
                dayBody.append(cardTemp);
                
                var cardWind = $("<p>").addClass("card-text");
                cardWind.text("Wind: " + data.current.wind_speed);
                dayBody.append(cardWind);
                
                var cardHum = $("<p>").addClass("card-text");
                cardHum.text = ("Humidity: " + data.current.humidity);
                dayBody.append(cardHum);
                
                var cardUV = $("<p>").addClass("card-text");
                cardUV.text("UV Index: " + data.current.uvi);
                dayBody.append(cardUV);
            }

            console.log(data);
        })
        .catch(console.error);
}

//Receive user input and throw that at displayWeather, then add it to history array
function search(event) {
    console.log(featuredEl.first());
    event.preventDefault();

    //Remove old elements to make room for new ones
    init(featuredEl);
    init(forcastEl);
    city = $('input[name="search"]').val();
    histArray.unshift(city);
    console.log(histArray);
    displayWeather();
}

// Simple function that empties everything below (inside) an element
function init(parent) {
    parent.empty();
}

function displayHistory(){
    //remove previous buttons if any
    init(historyEl);

    //for each item in the history array, display it as a button
    for(var i = 0; i < histArray.length; i++){
        var btn = $("<button>").addClass("btn btn-primary");
        btn.attr("type", "button");
        btn.text(histArray[i]);
        console.log(histArray[i]);
        historyEl.append(btn);
    }

    localStorage.setItem("storedArray", JSON.stringify(histArray));
}

initStorage();
displayWeather();
searchBtn.on('click', search);
