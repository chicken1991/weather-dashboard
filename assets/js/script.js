var apiKey = "bb8601e18b9103dc237a06422d96ca40"
var searchTextEl = $("#searchID");
var buttonEl = $("<button>");
var city = $('input[name="search"]').val();
var featuredEl = $("#featured");
var forcastEl = $("#forcast");
var today = moment().format("MMM Do, YYYY");
console.log(today);


// var geocode = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=" + 1 + "&appid=" + apiKey;

function displayWeather() {
    // event.preventDefault();
    // city = city.val();
    city = "seattle";
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
            //add city and date to featured card
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
            console.log(data);

            // This is the featured card which displays TODAY ===============================================
            var featured = $("<div>").addClass("card col-9");
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
            //Loop through and show the next five days ===============================
            for (var i = 1; i < 6; i++) {
                //increase date by one day
                cardDate = moment().add(i, "d").format("MMM Do");


                var day = $("<div>").addClass("card col-9");
                forcastEl.append(day);

                var dayBody = $("<div>").addClass("card-body");
                day.append(dayBody);
                var cardTitle = $("<div>").addClass("card-title");
                cardTitle.text(cardDate);
                dayBody.append(cardTitle);
                var cardImg = $("<img>").addClass("icon");
                cardImg.attr("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
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

function searchAgain(event) {
    event.preventDefault();
    // city = $('input[name="search"]').val();
    // console.log(city);
    // displayWeather();
    console.log("YOU CLICKED IT");
    var whatever = $("#left");
    whatever.text("WAOEFPSFJOPSEFSEOPJF");
}

// buttonEl.on('click', searchAgain);
displayWeather();
