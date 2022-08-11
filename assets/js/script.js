var searchInput = document.querySelector('#searchInput').value;
var searchBtn = document.querySelector('#searchBtn');
var prevSearchesLsit = document.querySelector('#prevSearchesList');
var mainCityName = document.querySelector('#mainCityName');
var contentContainer = document.querySelector('#contentContainer');
var fiveDayCardsContainer = document.querySelector('#fiveDayCardsContainer');
var fiveDayCards = document.querySelectorAll('.fiveDayCards');
var openWeatherKey = "74bb7b421208780329a0fae516ea617c";

function searchResults(event) {
    event.preventDefault();
    fiveDayCardsContainer.setAttribute("visibility", "visible")
    console.log(searchInput)
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
                contentContainer.querySelector("img").setAttribute("src", "https://openweathermap.org/img/wn/" + weatherResults.current.weather[0].icon + ".png")
                contentContainer.querySelectorAll("span")[0].textContent = (weatherResults.current.temp + "° F");
                contentContainer.querySelectorAll("span")[1].textContent = (weatherResults.current.wind_speed + " MPH");
                contentContainer.querySelectorAll("span")[2].textContent = (weatherResults.current.humidity + "%");
                contentContainer.querySelectorAll("span")[3].textContent = (weatherResults.current.uvi);
                fiveDayCardsContainer.setAttribute("visibility", "visible")
                // Five Day Forecast
                for (var i = 0; i < 5; i++) {
                    if(i === 0 + i) {
                        // Need moment.js here
                        fiveDayCards[i].querySelector("img").setAttribute("src", "https://openweathermap.org/img/wn/" + weatherResults.daily[i].weather[0].icon + ".png")
                        fiveDayCards[i].querySelectorAll("span")[0].textContent = (weatherResults.daily[i].temp.day + "° F");
                        fiveDayCards[i].querySelectorAll("span")[1].textContent = (weatherResults.daily[i].wind_speed + " MPH");
                        fiveDayCards[i].querySelectorAll("span")[2].textContent = (weatherResults.daily[i].humidity + "%");
                    }
                }
            })
        } )
        
    }
}

searchBtn.addEventListener("click", searchResults);