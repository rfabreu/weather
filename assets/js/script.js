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
let dailyForecastContainerEl = document.querySelector("#forecast-container");

// Create form container and children child elements
let dynFormContainer = document.createElement("form");
dynFormContainer.setAttribute("id", "dynCityForm"); // CHECK THIS LINE LATER ON
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
formButton.classList("btn fas fa-search");
dynFormContainer.appendChild(formButton);

// Find city form
let searchEventHandlerEl = document.querySelector("#dynCityForm");
let searchByCityEl = document.querySelector("#city-name");

// Left column container for cities
let citiesContainerEl = document.createElement("div");
citiesContainerEl.setAttribute("id", "dyn-cities-list");
citiesContainerEl.classList = "list-group";
leftColumnEl.appendChild(citiesContainerEl);

// Find list div container
let citiesListContainerEl = document.querySelector("#dyn-cities-list");


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
        };
        alert("All saved cities have been retrieved and populated!");
    };
};

// Second fecth call will run as non-async
function fetchSecondCall(searchByCity, latNum, lonNum, unixTimeCurrentDay, currentDayIcon, currentTempMetric, currentHumidity, currentMPS, mphWindSpeed) {

    let openWeatherApiFiveDayUrl = "https://api.openweathermap.org/data/2.5/onecall?q=" + latNum + "&lon=" + lonNum + "&appid=" + APIKey;

    fetch(
        openWeatherApiFiveDayUrl
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (secondCallData) {
            let uvIndex = secondCallData.current.uvi;
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