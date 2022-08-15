var searchInput = document.querySelector('#searchInput').value;
var searchBtn = document.querySelector('#searchBtn');
var prevSearchesList = document.querySelector('#prevSearchesList');
var mainCityName = document.querySelector('#mainCityName');
var contentContainer = document.querySelector('#contentContainer');
var fiveDayCardsContainer = document.querySelector('#fiveDayCardsContainer');
var fiveDayCards = document.querySelectorAll('.fiveDayCards');
var openWeatherKey = "74bb7b421208780329a0fae516ea617c";
var prevSearches = [""];

function searchResults() {
    searchInput = document.querySelector('#searchInput').value
    searchInput = capitalizeFirstLetter(searchInput)
    event.preventDefault();
    // Brings up the Five Day Forecast
    fiveDayCardsContainer.setAttribute("style", "visibility: visible")
    console.log(searchInput)
    // Adding list of previous searches
    if (!prevSearches.includes(searchInput)) {
        prevSearches.push(searchInput);
        var newLi = document.createElement("li")
        prevSearchesList.prepend(newLi)
        prevSearchesList.querySelector("li").textContent = searchInput
    }
    // Blank search check
    if(searchInput === "") {
        window.alert("Please enter a city.");
    } else {
        // Retrieves the latitude and longitude for one call api
        fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + searchInput + "&appid=" + openWeatherKey)
        .then((locationResults) => locationResults.json())
        .then((locationResults) => {
            console.log(locationResults);
            fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + locationResults[0].lat + "&lon=" + locationResults[0].lon + "&exclude=hourly,minutely&units=imperial&appid=" + openWeatherKey)
            .then((weatherResults) => weatherResults.json())
            .then((weatherResults) => {
                console.log(weatherResults);
                mainCityName.textContent = searchInput
                // Setting the main content container to the correct data from the api call
                contentContainer.querySelector("img").setAttribute("src", "https://openweathermap.org/img/wn/" + weatherResults.current.weather[0].icon + ".png")
                contentContainer.querySelectorAll("span")[0].textContent = (weatherResults.current.temp + "° F");
                contentContainer.querySelectorAll("span")[1].textContent = (weatherResults.current.wind_speed + " MPH");
                contentContainer.querySelectorAll("span")[2].textContent = (weatherResults.current.humidity + "%");
                contentContainer.querySelectorAll("span")[3].textContent = (weatherResults.current.uvi);
                // Background color changing for different uv index
                var uvIndex = contentContainer.querySelectorAll("span")[3];
                if(uvIndex.textContent <= 2) {
                    uvIndex.setAttribute("style", "background-color: #65cc1e")
                }else if(uvIndex.textContent <= 5) {
                    uvIndex.setAttribute("style", "background-color: #ffde32")
                }else if(uvIndex.textContent <= 7) {
                    uvIndex.setAttribute("style", "background-color: #ffa500")
                }else if(uvIndex.textContent < 11) {
                    uvIndex.setAttribute("style", "background-color: #e60073")
                }else if(uvIndex.textContent >= 11) {
                    uvIndex.setAttribute("style", "background-color: #9572ff")
                    uvIndex.textContent = (weatherResults.current.uvi + "  EXTREMELY HIGH")
                }
                // Five Day Forecast
                for (var i = 0; i < 5; i++) {
                    if(i === 0 + i) {
                        fiveDayCards[i].querySelector('h2').textContent = (moment.unix(weatherResults.daily[i + 1].dt).format('MMMM Do'))
                        fiveDayCards[i].querySelector("img").setAttribute("src", "https://openweathermap.org/img/wn/" + weatherResults.daily[i + 1].weather[0].icon + ".png")
                        fiveDayCards[i].querySelectorAll("span")[0].textContent = (weatherResults.daily[i + 1].temp.day + "° F");
                        fiveDayCards[i].querySelectorAll("span")[1].textContent = (weatherResults.daily[i + 1].wind_speed + " MPH");
                        fiveDayCards[i].querySelectorAll("span")[2].textContent = (weatherResults.daily[i + 1].humidity + "%");
                    }
                }
            })
        } )
        
    }
}



searchBtn.addEventListener("click", searchResults);

// Clicking on previous search results
document.addEventListener("click", function(event) {
    if(event.target.matches('li')) {
        console.log(event.target.textContent)
        document.querySelector('#searchInput').value = event.target.textContent;
        searchResults()
    }else {
        return;
    }
})

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }