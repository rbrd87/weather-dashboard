// Base64 encoded the API key
const encodedApiKey = "NmQ3YzQ1NmNkY2M0ZTU5MWI1YjJiMWRiZWJlODY4MmI=";
const decodedApiKey = atob(encodedApiKey);
console.log(decodedApiKey)

// When search button is clicked, the function is called
$('#search-btn').on('click', function (event) {
    event.preventDefault();
    // Store the users input into a variable
    let citySearch = $('#search-input').val()

    // If the search is invalid an error modal is show, otherwise the function carries on
    if (!citySearch.trim()) {
        $('#errorModal').modal('show')
    } else {
        // First we store the coordinates URL in a variable using the users input within the URL
        const coordURL =
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
        citySearch +
        "&limit=1&appid=" +
        decodedApiKey;
        
        console.log(citySearch)
        
        // Then we call the coordinates URL
        $.ajax({
            url: coordURL,
            method: "GET",
        }).then(function (cityCoords) {
            console.log(cityCoords)
            // And store the longitude and latitude of the users city
            const latitude = cityCoords[0].lat;
            const longitude = cityCoords[0].lon;

            console.log(latitude + " " + longitude)

            // We then store the query URL in a variable using the lon/lat values
            const queryURL =
                "https://api.openweathermap.org/data/2.5/onecall?lat=" +
                latitude +
                "&lon=" +
                longitude +
                "&exclude=minutely,hourly&appid=" +
                decodedApiKey;

            console.log(queryURL)

            // And call the queryURL to get the weather infomation
            $.ajax({
                url: queryURL,
                method: "GET",
            }).then(function (weatherInfo) {
                // Todo: store the relevant weather info needed for the front end
                console.log(weatherInfo)
            })

        })
    }
});
