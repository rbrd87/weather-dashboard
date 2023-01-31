// Base64 encoded the API key
const encodedApiKey = "NmQ3YzQ1NmNkY2M0ZTU5MWI1YjJiMWRiZWJlODY4MmI=";
const decodedApiKey = atob(encodedApiKey);

// Localstorage json.parse to Get the stored items
let savedSearch = JSON.parse(localStorage.getItem("ForecastHistory")) || [];

// For loop to show the saved searches from the local storage
for (let i = 0; i < savedSearch.length; i++) {
    let cityBtn = $(`<button class="btn btn-light btn-list" data-city="${savedSearch[i]}">${savedSearch[i]}</button>`);
    $("#city-list").append(cityBtn);
}

// Created a function to be called later
function weatherDisplay(city) {
    // Coordinates URL is made from the users input and the apiKey
    const coordURL =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        city +
        "&limit=25&appid=" +
        decodedApiKey;
    $.ajax({
        url: coordURL,
        method: "GET",
    }).then(function (cityCoords) {
        const latitude = cityCoords[0].lat;
        const longitude = cityCoords[0].lon;

        const queryURL =
            "https://api.openweathermap.org/data/2.5/onecall?lat=" +
            latitude +
            "&lon=" +
            longitude +
            "&exclude=minutely,hourly&appid=" +
            decodedApiKey;
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (weatherInfo) {
            // THE CURRENT DAY FORECAST
            // Gets the results-today div and empties it every time a search is done
            const resultsTodayEl = $("#results-today");
            resultsTodayEl.empty();

            // Create another div element to hold the city name and other info append to the results-today div
            const cityEl = $(`<div class="row" id="city-details"></div>`);
            resultsTodayEl.append(cityEl);

            // Create the HTML elements to show the city name, todays date and the weather icon
            const cityName = $(`<h2 id="city-name">${cityCoords[0].name + ", " + cityCoords[0].state}</h2>`);

            const todaysDate = $(`<p id="date">${moment().format("MMM Do, YYYY")}</p>`);

            const todayEl = $(`<p>${"Today will be: "}</p>`);

            const weatherIcon = $(`<img src="https://openweathermap.org/img/wn/${weatherInfo.current.weather[0].icon}@4x.png" class="weather-icon" alt="weather icon">`);

            // Append the HTML elements to the cityEl div
            cityEl.append(cityName, todaysDate, todayEl, weatherIcon);

            // Div for the wind, humidity, temp and UV
            const weatherDetailsEl = $(`<div id="weather-details" class="row"></div>`);
            resultsTodayEl.append(weatherDetailsEl);

            // Wind information
            const windCol = $(`<div class="col"></div>`);
            const todayWindLabelEl = $(`<p style="float: left; font-weight: bold">${"Wind speed: "}</p>`);
            const todayWindEl = $(`<p style="float: right">${weatherInfo.current.wind_speed + " mph"}</p>`);
            windCol.append(todayWindLabelEl, todayWindEl);

            // Humidity information
            const humidityCol = $(`<div class="col"></div>`);
            const todayHumidLabel = $(`<p style="float: left; font-weight: bold">${"Humidity: "}</p>`);
            const todayHumidityEl = $(`<p style="float: right">${weatherInfo.current.humidity + " %"}</p>`);
            humidityCol.append(todayHumidLabel, todayHumidityEl);

            // Temp information
            const tempCol = $(`<div class="col"></div>`);
            const todayTempLabelEl = $(`<p style="float: left; font-weight: bold">${"Temperature: "}</p>`);

            // Had to convert the temp from kelvin to celcius
            const todayTempEl = $(`<p style="float: right">${(weatherInfo.current.temp - 273.15).toFixed(0) + " °C"}</p>`);
            tempCol.append(todayTempLabelEl, todayTempEl);

            const uvCol = $(`<div class="col"></div>`);
            const uvLabelEl = $(`<p style="float: left; font-weight: bold">${"UV index: "}</p>`);
            const uvEl = $(`<p>${weatherInfo.current.uvi}</p>`);
            // Conditional statements to allocate colour according to uv index
            if (weatherInfo.current.uvi < 3) {
                uvEl.attr("style", "float: right; color: white; background: green; border-radius: 3px");
            } else if (weatherInfo.current.uvi < 7) {
                uvEl.attr("style", "float: right; color: white; background: orange; border-radius: 3px");
            } else {
                uvEl.attr("style", "float: right; color: white; background: red; border-radius: 3px");
            }
            uvCol.append(uvLabelEl, uvEl);

            weatherDetailsEl.append(windCol, humidityCol, tempCol, uvCol);

            // THE 5 DAY FORECAST
            const fiveDayEl = $("#five-day-forecast");
            fiveDayEl.empty();

            const resultsArea = $(`<div id="results-area" class="row"></div>`);
            fiveDayEl.append(resultsArea);

            // Starting for loop at 1 as index position 0 is current day already displayed
            for (let i = 1; i <= 5; i++) {
                const resultCard = $(`<div class="card col-lg-2 col-md-4 col-sm-12"></div>`);
                const resultBody = $(`<div id="custom-card-body" class="card-body"></div>`);
                resultCard.append(resultBody);

                const dailyDate = moment.unix(weatherInfo.daily[i].dt);
                const formattedDate = dailyDate.format("dddd, MMMM Do");
                const titleEl = $(`<h4>${formattedDate}</h4>`);
                resultBody.append(titleEl);

                const iconImage = $(`<img src="https://openweathermap.org/img/wn/${weatherInfo.daily[i].weather[0].icon}@2x.png" class="mini-weather-icon">`);
                resultBody.append(iconImage);

                // Div for the wind, humidity, temp and UV
                const dailyWeatherDetailsEl = $(`<div id="daily-weather-details"></div>`);
                resultBody.append(dailyWeatherDetailsEl);

                // Wind information
                const windSpeedLabel = $(`<p style="font-weight: bold">${"Wind speed: "}</p>`);
                const windSpeedEl = $(`<p>${weatherInfo.daily[i].wind_speed + " mph"}</p>`);
                dailyWeatherDetailsEl.append(windSpeedLabel, windSpeedEl);

                // Humidity information
                const humidLabelEl = $(`<p style="font-weight: bold">${"Humidity: "}</p>`);
                const humidityEl = $(`<p>${weatherInfo.daily[i].humidity + " %"}</p>`);
                dailyWeatherDetailsEl.append(humidLabelEl, humidityEl);

                // Temp information
                const tempLabelEl = $(`<p style="font-weight: bold">${"Temperature: "}</p>`);
                const tempEl = $(`<p>${(weatherInfo.daily[i].temp.day - 273.15).toFixed(0) + " °C"}</p>`);
                dailyWeatherDetailsEl.append(tempLabelEl, tempEl);

                resultsArea.append(resultCard);

                $("#divider").removeClass("hide")

                // Removing the user input to avoid duplicate searches of the same term
                $("#search-input").val("")
            };
        });
    });
};

// When search button is clicked, the api will bring the data onto the screen
$("#search-btn").on("click", function () {
    let cityName = $("#search-input").val();

    // If the input city is blank then an error modal will show
    if (!cityName.trim()) {
        $("#errorModal").modal("show")
        // Added focus to the 'Okay' button so the user can close the alert modal with the enter key
        $("#errorModal").on('shown.bs.modal', function(){
            $(this).find('.custom-btn').focus();
        });
        return;
    } else if (savedSearch.length <= 5){

        let cityBtn = $(`<button class="btn btn-light btn-list" data-city="${cityName}">${cityName}</button>`);

        $("#city-list").append(cityBtn);

        savedSearch.push(cityName);

        // Localstorage json.stringify to store the item
        localStorage.setItem("ForecastHistory", JSON.stringify(savedSearch));

        weatherDisplay(cityName)
    } else {
        savedSearch.shift();
        
        let cityBtn = $(`<button class="btn btn-light btn-list" data-city="${cityName}">${cityName}</button>`);

        $("#city-list").append(cityBtn);

        savedSearch.push(cityName);

        // Localstorage json.stringify to store the item
        localStorage.setItem("ForecastHistory", JSON.stringify(savedSearch));

        weatherDisplay(cityName)
    };
});

// Added a keyup event listener so the user can enter a city and press enter on the keyboard instead of clicking the button
$("#search-input").on("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $("#search-btn").click();
    };
});

// Clear button to clear the local storage
$("#clear-btn").on("click", function () {
    localStorage.clear()
    location.reload()
})

// Generates API information that was saved in local storage to be recalled again.
$("#cities-list").on("click", "button", function () {
    let cityName = $(this).data("city");

    weatherDisplay(cityName);
});