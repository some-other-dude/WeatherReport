// MAIN.JS
// LocationIQ.org API Key:  949cb7fbc0d8a2
// LocationIQ URL: http://locationiq.org/v1/reverse.php?format=json&key=<API_KEY>&lat=17.421223&lon=78.400674


{
    function update_city(rev) {
        // tease the city out of the JSON
        let city = ""
        if (_.has(rev, "address.city")) {
            city = rev["address"]["city"]
        } else if (_.has(rev, "address.hamlet")) {
            city = rev["address"]["hamlet"]
        } else if (_.has(rev, "address.village")) {
            city = rev["address"]["village"]
        } else if (_.has(rev, "address.town")) {
            city = rev["address"]["town"]
        } else {
            city = "Sometown"
        }
        document.querySelector("#wx-location").innerHTML = `<h1>${city}, ${rev.address.state}</h1>`
    }

    //helper for current conditions
    function toggleTempScales() {
        console.log("toggiing");
        $("#temp-c").toggle()
        $("#temp-f").toggle()
    }

    // do all the display logic and update HTML
    function update_weather(wx) {
        let skycons = new Skycons({
            "color": "white"
        })
        let tempC = wx.main.temp
        let tempF = Math.round(tempC * 9 / 5 + 32)
        let dayOrNight = ""
        let longDesc = wx.weather[0].description.split(" ").map(function(w) {
            return w.substring(0, 1).toUpperCase() + w.slice(1)
        }).join(" ")
        let sunrise = wx.sys.sunrise
        let sunset = wx.sys.sunset

        // day/night calcs for icons
        wx.dt > sunrise && wx.dt < sunset ? dayOrNight = "DAY" : dayOrNight = "NIGHT"

        // insert the text for current conditions
        document.querySelector("#wx-current-conditions").innerHTML = `<span id="wx-current-temp">
                <span id="temp-c">${tempC} <a href="javascript:void(0)" onclick="toggleTempScales()">c</a></span>
                <span id="temp-f">${tempF} <a href="javascript:void(0)" onclick="toggleTempScales()">f</a></span>
            </span></br>
            <span class="wx-short-description">${longDesc}</span>`


        // determine the icon to use and display it
        if (wx.weather[0].main == "Clear" && dayOrNight == "DAY") {
            skycons.add("icon1", Skycons.CLEAR_DAY)
        } else if (wx.weather[0].main == "Clear" && dayOrNight == "NIGHT") {
            skycons.add("icon1", Skycons.CLEAR_NIGHT)
        } else if (wx.weather[0].main == "Partly Cloudy" && dayOrNight == "DAY") {
            skycons.add("icon1", Skycons.PARTLY_CLOUDY_DAY)
        } else if (wx.weather[0].main == "Partly Cloudy" && dayOrNight == "NIGHT") {
            skycons.add("icon1", Skycons.PARTLY_CLOUDY_NIGHT)
        } else if (wx.weather[0].main == "Clouds") {
            skycons.add("icon1", Skycons.CLOUDY)
        } else if (wx.weather[0].main == "Rain") {
            skycons.add("icon1", Skycons.RAIN)
        } else if (wx.weather[0].main == "Sleet") {
            skycons.add("icon1", Skycons.SLEET)
        } else if (wx.weather[0].main == "Snow") {
            skycons.add("icon1", Skycons.SNOW)
        } else if (wx.weather[0].main == "Wind") {
            skycons.add("icon1", Skycons.WIND)
        }

        // display only one temp scale
        $("#temp-f").hide()
        //animate
        skycons.play();
    }

    // API call for weather
    function get_weather(pos) {
        let wxUrl = `https://fcc-weather-api.glitch.me/api/current?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
        $.ajax({
            url: wxUrl
        }).done(function(data) {
            update_weather(data)
        })
    }


    function geo_success(position) {
        var apiKey = "949cb7fbc0d8a2"
        var lat = position.coords.latitude
        var long = position.coords.longitude
        console.log(`Geo Success: Lat: ${position.coords.latitude} Lon: ${position.coords.longitude}`);

        $.ajax({
            url: `http://locationiq.org/v1/reverse.php?format=json&key=${apiKey}&lat=${lat}&lon=${long}`,
        }).done(function(data) {
            update_city(data)
            get_weather(position)
        })
    }

    function geo_error(error) {
        console.log(error)
    }

    function get_location() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geo_success, geo_error)
        } else {
            alert("Location services are not available on this device.")
        }
    }

    function init() {
        get_location()
    }

    init()
}
