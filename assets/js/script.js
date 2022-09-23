var APIKey = "f04790a4f07975aa0a32273581fb57ac";
var city;
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

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