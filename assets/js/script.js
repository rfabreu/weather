var APIKey = "f04790a4f07975aa0a32273581fb57ac";
var city;
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";

// Makes call to the API data => Keep to use later
// fetch(queryURL)

// Get form element value
let leftColumnEl = document.querySelector("#left-column");
// Get all elements from cities list
let citiesListContainerBtnEl = document.querySelector(".list-group-item");
// Forecast container for the day
let dailyWeatherContainerEl = document.querySelector("#forecast-container");

// Create form container and children child elements
let dynFormContainer = document.createElement("form");
dynFormContainer.setAttribute("id", "dymCityForm"); // CHECK THIS LINE LATER ON
dynFormContainer.classList = "search-container";
leftColumnEl.appendChild(dynFormContainer);

// Create an h3 element
let formH3 = document.createElement("h3");
formH3.textContent = "Search for a City";
dynFormContainer.appendChild(formH3);

// Create an input element
let formInput = document.createElement("input");
formInput.setAttribute("id", "city-name");
formInput.setAttribute("type", "text");
formInput.setAttribute("autofocus", "true");
formInput.classList = "form-input";
dynFormContainer.appendChild(formInput);

// Create button element
let formButton = document.createElement("button");
formButton.setAttribute("type", "submit");
formButton.classList = ("btn fas fa-search");
dynFormContainer.appendChild(formButton);

// Find city form
let searchEventHandlerEl = document.querySelector("#dymCityForm");
let searchByCityEl = document.querySelector("#city-name");

// Left column container for cities
let citiesContainerEl = document.createElement("div");
citiesContainerEl.setAttribute("id", "dym-cities-list");
citiesContainerEl.classList = "list-group";
leftColumnEl.appendChild(citiesContainerEl);

// Find list div container
let citiesListContainerEl = document.querySelector("#dym-cities-list");


var populateSavedCities = function () {
    let citiesLocalStorage = JSON.parse(localStorage.getItem("savedCities"));

    let cityExist = 0;

    if (citiesLocalStorage === null) {
        console.log("No cities to add");
    } else {
        $(".list-group-item").remove();

        for (i = 0; i < citiesLocalStorage.length; i++) {
            let cityNameEl = document.createElement("a");
            let splitCityText = "";
            cityNameEl.setAttribute("href", "#");
            cityNameEl.setAttribute("data-city", citiesLocalStorage[i]);
            cityNameEl.setAttribute("id", citiesLocalStorage[i]);
            cityNameEl.setAttribute("role", "button");
            cityNameEl.classList = "list-group-item list-group-item-action list-group-item-primary";
            cityNameEl.textContent = citiesLocalStorage[i];
            citiesContainerEl.appendChild(cityNameEl);
        };
        alert("All saved cities have been retrieved and populated!");
    };
};

// Second fecth call will run as non-async
function fetchSecondCall(searchByCity, latNum, lonNum, unixTimeCurrentDay, currentDayIcon, currentTempMetric, currentHumidity, currentMPS, mphWindSpeed) {

    let openWeatherApiFiveDayUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latNum + "&lon=" + lonNum + "&appid=f04790a4f07975aa0a32273581fb57ac&units=metric"; //+ APIKey;

    fetch(
        openWeatherApiFiveDayUrl
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (secondCallData) {
            let uvIndex = secondCallData.current.uvi; // CHECK THIS LINE = BREAKING
            let unix_timestamp = unixTimeCurrentDay;
            var date = new Date(unix_timestamp * 1000);
            var year = date.getFullYear();
            var monthOfYear = date.getMonth() + 1;
            var dayOfMonth = date.getDate();
            var fullDayDaily = "(" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + ")";

            populateCurrentDayHtml(searchByCity, fullDayDaily, currentDayIcon, currentTempMetric, currentHumidity, currentMPS, mphWindSpeed, uvIndex);

            populate5DayForecast(secondCallData);
        });
};

// Function to populate forecast for the current day
function populateCurrentDayHtml(searchByCity, fullDayDaily, currentDayIcon, currentTempMetric, currentHumidity, currentMPS, mphWindSpeed, uvIndex) {
    // Populate current day html elements
    let dailyForecastContainerEl = document.createElement("div");
    dailyForecastContainerEl.setAttribute("id", "daily-forecast-container");
    dailyForecastContainerEl.classList = "borderDiv";

    let currentDayTitle = document.createElement("h3");
    currentDayTitle.textContent = (searchByCity.charAt(0).toUpperCase() + searchByCity.slice(1) + " " + fullDayDaily);

    let currentIconEl = document.createElement("span");
    let currentIconSymbol = "http://openweathermap.org/img/wn/" + currentDayIcon + "@2x.png";
    currentIconEl.innerHTML = "<img src=" + currentIconSymbol + "></img";
    currentDayTitle.append(currentIconEl);

    // Create <p> elements to hold current day informmation
    let currentTempEl = document.createElement("p");
    let currentHumidityEl = document.createElement("p");
    let currentWindSpeedEl = document.createElement("p");
    let currentUvIEl = document.createElement("p");

    // Rund temp to no decimal places
    // Injects <h> elements text content
    currentTempEl.textContent = "Temperature: " + (currentTempMetric.toFixed(1)) + " ˚C";
    currentHumidityEl.textContent = "Humidity: " + currentHumidity + "%";
    currentWindSpeedEl.textContent = "Wind Speed: " + currentMPS + " MPH";
    currentUvIEl.textContent = "UV Index: " + uvIndex;

    // Use jQuery to clear all list items
    $("#daily-forecast-container").remove();

    // Append daily forecast to forecast-container
    dailyWeatherContainerEl.appendChild(dailyForecastContainerEl);
    dailyForecastContainerEl.appendChild(currentDayTitle);
    dailyForecastContainerEl.appendChild(currentTempEl);
    dailyForecastContainerEl.appendChild(currentHumidityEl);
    dailyForecastContainerEl.appendChild(currentWindSpeedEl);
    dailyForecastContainerEl.appendChild(currentUvIEl);
};

function populate5DayForecast(secondCallData) {
    $("#weekly-forecast-container").remove();

    let weeklyForecastContainerEl = document.createElement("div");
    weeklyForecastContainerEl.setAttribute("id", "weekly-forecast-container");
    weeklyForecastContainerEl.classList = "border-Div-right-column";

    let fiveDayForecast = document.createElement("h3");
    fiveDayForecast.textContent = "5-Day Forecast:";

    // Append element as topmost before loop to generate content for each <div>
    dailyWeatherContainerEl.appendChild(weeklyForecastContainerEl);
    weeklyForecastContainerEl.appendChild(fiveDayForecast);

    // Generate <div> to hold the five days as a flex row
    let weeklyFlexContainerEl = document.createElement("div");
    weeklyFlexContainerEl.classList = "weekly-flex-container";

    // Append element only after the date on the five day forecast
    weeklyForecastContainerEl.appendChild(weeklyFlexContainerEl);

    // Get five days content from the five day forecast
    for (i = 1; i <= 5; i++) {
        let unixTime = secondCallData.daily[i].dt;

        let unix_timestamp = unixTime;
        // Create a new JS date object based on the timestamp
        // multiply it by 1000 so the argument is in milliseconds
        var date = new Date(unix_timestamp * 1000);
        // Hours from timestamp
        var year = date.getFullYear();
        var monthOfYear = date.getMonth() + 1;
        var dayOfMonth = date.getDate();

        // Values that will be displayed
        var fullDay = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        var iconWeather = secondCallData.daily[i].weather[0].icon;
        let celsiusTemp = secondCallData.daily[i].temp.day;
        let humidity = secondCallData.daily[i].humidity;

        // Create five day elements
        // Create <div> element to hold each of the five day weekly forecast
        let eachDayContainer = document.createElement("div");
        eachDayContainer.setAttribute("id", ("day=" + [i]));
        eachDayContainer.classList = "border-div-five-day-forecast";

        let currentDayTitle = document.createElement("p");
        currentDayTitle.textContent = (fullDay);

        // Create <span> to hold the icon
        let iconSpan = document.createElement("p");
        iconSpan.textContent = "";

        let currentIconEl = document.createElement("span");
        let currentIconSymbol = "http://openweathermap.org/img/wn/" + iconWeather + "@2x.png";
        currentIconEl.innerHTML = "<img src=" + currentIconSymbol + "></img>";
        iconSpan.append(currentIconEl);

        // Create <p> elements to hold remaining current day info
        let currentTempEl = document.createElement("p");
        let currentHumidityEl = document.createElement("p");

        currentTempEl.textContent = "Temperature: " + (celsiusTemp.toFixed(2)) + " ˚C";
        currentHumidityEl.textContent = "Humidity: " + humidity + "%";

        // Append daily forecast to forecast container
        eachDayContainer.appendChild(currentDayTitle);
        eachDayContainer.appendChild(currentIconEl);
        eachDayContainer.appendChild(currentTempEl);
        eachDayContainer.appendChild(currentHumidityEl);
        // Append items to the parent element
        weeklyFlexContainerEl.appendChild(eachDayContainer);
    };
};

var getWeatherData = function (event, cityClicked) {
    // Prevent multiple clicks when item entered search bar or cities list
    event.preventDefault();

    if (cityClicked) {
        var searchByCity = cityClicked.trim();
    } else {
        var searchByCity = searchByCityEl.value.trim();
    };

    // If the field is empty don't fetch data
    if (searchByCity == "") {
        alert("Please enter a city name!");
        searchByCityEl.value = "";
        return
    } else {
        searchByCityEl.value = "";
    };

    // Retrieve array from localStorage
    let citiesLocalStorage = JSON.parse(localStorage.getItem("savedCities"));

    let cityExist = 0;

    if (citiesLocalStorage === null) {
        citiesSearched = new Array();
    } else {
        citiesSearched = citiesLocalStorage;
    };

    // First API call to fetch data to second API call
    // let openWeatherApiUrl = queryURL;
    let openWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchByCity + "&appid=f04790a4f07975aa0a32273581fb57ac&units=metric";

    fetch(
        openWeatherApiUrl
    ).then(function (weatherResponse) {
        if (weatherResponse.ok) {
            return weatherResponse.json();
        } else {
            window.alert("Error: " + weatherResponse.statusText + "\nPlease enter a validy city.");
            searchByCityEl.value = "";
            return;
        }
    }).then(function (weatherLatLon) {
        // Data for current day
        let latNum = weatherLatLon.coord.lat;
        let lonNum = weatherLatLon.coord.lon;
        let unixTimeCurrentDay = weatherLatLon.dt;
        let currentDayIcon = weatherLatLon.weather[0].icon;
        let currentTempMetric = weatherLatLon.main.temp;
        let currentHumidity = weatherLatLon.main.humidity;
        let currentMPS = weatherLatLon.wind.speed;
        let mphWindSpeed = Math.round(currentMPS * 2.237);

        // Add successfull API call to localStorage
        // Validate new city
        for (i = 0; i < citiesSearched.length; i++) {
            if (searchByCity.toLowerCase() === citiesSearched[i].toLowerCase()) {
                cityExist = 1;
                break;
            };
        };

        if (cityExist === 0) {
            citiesSearched.push(searchByCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '));
            // Save in localStorage
            localStorage.setItem("savedCities", JSON.stringify(citiesSearched));
        }

        fetchSecondCall(searchByCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '), latNum, lonNum, unixTimeCurrentDay, currentDayIcon, currentTempMetric, currentHumidity, currentMPS, mphWindSpeed);

        populateSavedCities();
    }).catch(function (error) {
        return;
    });
};

// Event handler for searching manually
searchEventHandlerEl.addEventListener("submit", getWeatherData);

// Event handler for cities when clicked from the list
var cityClicked = function (event) {
    let cityClicked = event.target.getAttribute("data-city");
    if (cityClicked) {
        getWeatherData(event, cityClicked);
    } else {
        alert("Internal error found! \nPlease email raabreugomes@gmail.com to report.");
    };
};

citiesContainerEl.addEventListener("click", cityClicked)

populateSavedCities();