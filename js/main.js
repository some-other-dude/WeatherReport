// MAIN.JS
// LocationIQ.org API Key:  949cb7fbc0d8a2
// LocationIQ URL: http://locationiq.org/v1/reverse.php?format=json&key=<API_KEY>&lat=17.421223&lon=78.400674


function geo_success(position) {
    var apiKey = "949cb7fbc0d8a2";
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    $.ajax({
      url: `http://locationiq.org/v1/reverse.php?format=json&key=${apiKey}&lat=${lat}&lon=${long}`,
  }).done(function(rev) {

      var city = "";
      if (_.has(rev,"address.city")) {
          city = rev["address"]["city"];
      } else if (_.has(rev,"address.hamlet")) {
          city = rev["address"]["hamlet"];
      } else if (_.has(rev,"address.village")) {
          city = rev["address"]["village"];
      } else if (_.has(rev,"address.town")) {
          city = rev["address"]["town"];
      } else {
          city = "Sometown"
      }
      $("#wx-city").text(`${city}, ${rev["address"]["state"]}`);
    });

    console.log("success: ");
}

function geo_error(error) {
    console.log(error);
}

function get_location() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geo_success, geo_error);
    } else {
        alert("Location services are not available on this device.");
    }
}

get_location();
