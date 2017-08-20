function success(data) {
    console.log(data)
}

function failure(err) {
    console.log(err);
}

$.get('https://fcc-weather-api.glitch.me/api/current?lat=35&lon=139', success, failure)
