// Base64 encoded the API key
const encodedApiKey = 'NmQ3YzQ1NmNkY2M0ZTU5MWI1YjJiMWRiZWJlODY4MmI=';
const decodedApiKey = atob(encodedApiKey);
console.log(decodedApiKey)

// When search button is clicked, the function is called
$('#search-btn').on('click', function (event) {
    event.preventDefault();
    // Store the users input into a variable
    let citySearch = $('#search-input').val();

    // If the search is invalid an error modal is show, otherwise the function carries on
    if (!citySearch.trim()) {
        $('#errorModal').modal('show')
    } else {
        // First we store the coordinates URL in a variable using the users input within the URL
        const coordURL =
            'https://api.openweathermap.org/geo/1.0/direct?q=' +
            citySearch +
            '&limit=25&appid=' +
            decodedApiKey;

        // Then we call the coordinates URL
        $.ajax({
            url: coordURL,
            method: 'GET',
        }).then(function (cityCoords) {
            console.log(cityCoords)
            // And store the longitude and latitude of the users city
            const latitude = cityCoords[0].lat;
            const longitude = cityCoords[0].lon;

            // We then store the query URL in a variable using the lon/lat values
            const queryURL =
                'https://api.openweathermap.org/data/2.5/onecall?lat=' +
                latitude +
                '&lon=' +
                longitude +
                '&exclude=minutely,hourly&appid=' +
                decodedApiKey;

            // And call the queryURL to get the weather infomation
            $.ajax({
                url: queryURL,
                method: 'GET',
            }).then(function (weatherInfo) {
                console.log(weatherInfo)
                // THE CURRENT DAY FORECAST
                // Gets the results-today div and empties it every time a search is done
                const resultsTodayEl = $('#results-today');
                resultsTodayEl.empty();

                // Create another div element to hold the city name and other info append to the results-today div
                const cityEl = $('<div></div>').attr('id', 'city-details');
                cityEl.addClass('row');
                resultsTodayEl.append(cityEl);

                // Create the HTML elements to show the city name, todays date and the weather icon
                const cityName = $('<h2></h2>').attr('id', 'city-name');
                cityName.text(cityCoords[0].name + ", " + cityCoords[0].state);
                const todaysDate = $('<p></p>').attr('id', 'date');
                todaysDate.text(moment().format('MMM Do, YYYY'));

                const todayEl = $('<p></p>').text('Today will be: ');
                const weatherIcon = $('<img>').attr('src', `https://openweathermap.org/img/wn/${weatherInfo.current.weather[0].icon}@4x.png`);
                weatherIcon.addClass('weather-icon');

                // Append the HTML elements to the cityEl div
                cityEl.append(cityName, todaysDate, todayEl, weatherIcon);

                // Div for the wind, humidity, temp and UV
                const weatherDetailsEl = $('<div></div>').attr('id', 'weather-details');
                weatherDetailsEl.addClass('row');
                resultsTodayEl.append(weatherDetailsEl);

                // Wind information
                const windCol = $('<div></div>').attr('class', 'col');
                const todayWindLabelEl = $('<p></p>').text('Wind speed: ');
                const todayWindEl = $('<p></p>').text(weatherInfo.current.wind_speed + ' mph');
                todayWindLabelEl.attr('style', 'float: left; font-weight: bold');
                todayWindEl.attr('style', 'float: right');
                windCol.append(todayWindLabelEl, todayWindEl);

                // Humidity information
                const humidityCol = $('<div></div>').attr('class', 'col');
                const todayHumidLabel = $('<p></p>').text('Humidity: ');
                const todayHumidityEl = $('<p></p>').text(weatherInfo.current.humidity + ' %');
                todayHumidLabel.attr('style', 'float: left; font-weight: bold');
                todayHumidityEl.attr('style', 'float: right');
                humidityCol.append(todayHumidLabel, todayHumidityEl);

                // Temp information
                const tempCol = $('<div></div>').attr('class', 'col');
                const todayTempLabelEl = $('<p></p>').text('Temperature: ');

                // Had to convert the temp from kelvin to celcius
                const todayTempEl = $('<p></p>').text((weatherInfo.current.temp - 273.15).toFixed(0) + ' °C');
                todayTempLabelEl.attr('style', 'float: left; font-weight: bold');
                todayTempEl.attr('style', 'float: right');
                tempCol.append(todayTempLabelEl, todayTempEl);

                const uvCol = $('<div></div>').attr('class', 'col');
                const uvLabelEl = $('<p></p>').text('UV index: ');
                const uvEl = $('<p></p>').text(weatherInfo.current.uvi);
                uvLabelEl.attr('style', 'float: left; font-weight: bold');
                //conditional statements to allocate colour according to uv index
                if (weatherInfo.current.uvi < 3) {
                    uvEl.attr('style', 'float: right; color: white; background: green; border-radius: 3px');
                } else if (weatherInfo.current.uvi < 7) {
                    uvEl.attr('style', 'float: right; color: white; background: orange; border-radius: 3px');
                } else {
                    uvEl.attr('style', 'float: right; color: white; background: red; border-radius: 3px');
                }
                uvCol.append(uvLabelEl, uvEl);

                weatherDetailsEl.append(windCol, humidityCol, tempCol, uvCol);

                // THE 5 DAY FORECAST
                const fiveDayEl = $('#five-day-forecast');
                fiveDayEl.empty();

                const resultsArea = $('<div></div>').attr('id', 'results-area');
                resultsArea.addClass('row', 'row-cols-5')
                fiveDayEl.append(resultsArea);

                //starting for loop at 1 as index position 0 is current day already displayed
                for (let i = 1; i <= 5; i++) {
                    const resultCard = $('<div></div>').addClass('card col-lg-2 col-md-4 col-sm-12');
                    const resultBody = $('<div></div>').addClass('card-body');
                    resultBody.attr('id', 'custom-card-body');
                    resultCard.append(resultBody);

                    const dailyDate = moment.unix(weatherInfo.daily[i].dt);
                    const formattedDate = dailyDate.format("dddd, MMMM Do");
                    const titleEl = $('<h4></h4>').text(formattedDate);
                    resultBody.append(titleEl);

                    const iconImage = $('<img>').attr('src', `https://openweathermap.org/img/wn/${weatherInfo.daily[i].weather[0].icon}@2x.png`);
                    iconImage.addClass('mini-weather-icon');
                    resultBody.append(iconImage);

                    // Div for the wind, humidity, temp and UV
                    const dailyWeatherDetailsEl = $('<div></div>').attr('id', 'daily-weather-details');
                    //dailyWeatherDetailsEl.addClass('row');
                    resultBody.append(dailyWeatherDetailsEl);

                    // Wind information
                    const windSpeedLabel = $('<p></p>').text('Wind speed: ');
                    const windSpeedEl = $('<p></p>').text(weatherInfo.daily[i].wind_speed + ' mph');
                    windSpeedLabel.attr('style', 'font-weight: bold');
                    dailyWeatherDetailsEl.append(windSpeedLabel, windSpeedEl);

                    // Humidity information
                    const humidLabelEl = $('<p></p>').text('Humidity: ');
                    const humidityEl = $('<p></p>').text(weatherInfo.daily[i].humidity + ' %');
                    humidLabelEl.attr('style', 'font-weight: bold');
                    dailyWeatherDetailsEl.append(humidLabelEl, humidityEl);

                    // Temp information
                    const tempLabelEl = $('<p></p>').text('Temperature: ');
                    const tempEl = $('<p></p>').text((weatherInfo.daily[i].temp.day - 273.15).toFixed(0) + ' °C');
                    tempLabelEl.attr('style', 'font-weight: bold');
                    dailyWeatherDetailsEl.append(tempLabelEl, tempEl);

                    resultsArea.append(resultCard);

                    $('#divider').removeClass('hide')
                }
            });
        })

    }
});
