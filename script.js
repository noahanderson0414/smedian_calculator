const A = 17.625;
const B = 243.04;

var _data;

function fetchLocations() {
    var locationInput = document.getElementById("locationInput").value;
    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(locationInput) + "&count=10&language=en&format=json")
        .then(response => response.json())
        .then(data => {
            _data = data;
            document.getElementById("result").innerHTML = "";
            var locationSelect = document.createElement("select");
            locationSelect.id = "locationSelect";
            for (let i = 0; i < data.results.length; i++) {
                var element = data.results[i];
                var option = document.createElement("option");
                option.value = i;
                option.textContent = element.name + ", " + element.admin1;
                locationSelect.appendChild(option)
            };
            document.getElementById("result").appendChild(locationSelect);
            document.getElementById("result").innerHTML += "<br><button onclick=\"fetchSmedianTemperature()\" id=\"calculateButton\">Calculate Smedian Temperature</button><br><br>";
            var div = document.createElement("div");
            div.id = "output";
            document.getElementById("result").appendChild(div);
        })
        .catch(error => {
            var header = document.createElement(header);
            header.textContent = error;
            document.getElementById("result").appendChild(header);
        })
}

function fetchSmedianTemperature() {
    var selectedData = _data.results[document.getElementById("locationSelect").value];
    var latitude = selectedData.latitude;
    var longitude = selectedData.longitude;
    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + encodeURIComponent(latitude) + "&longitude=" + encodeURIComponent(longitude) + "&current=temperature_2m,relative_humidity_2m&temperature_unit=fahrenheit")
        .then(response => response.json())
        .then(data => {
            document.getElementById("output").innerHTML = "";
            var temperature = Math.round(data.current.temperature_2m);
            var header = document.createElement("header");
            header.innerHTML = temperature + "°F Temperature<br>";
            var humidity = data.current.relative_humidity_2m;
            var temperatureCelsius = (temperature - 32.0) / 1.8;
            var x = Math.log(humidity / 100.0) + A * (temperatureCelsius / (B + temperatureCelsius));
            var dewPointCelsius = B * x / (A - x);
            var dewPoint = Math.round((dewPointCelsius * 1.8) + 32.0);
            header.innerHTML += dewPoint + "°F Dew Point<br><br>";
            var smedes = temperature + dewPoint;
            header.innerHTML += smedes + " (" + (smedes - 140) + ")" + " Smedes";
            document.getElementById("output").appendChild(header);
        })
        .catch(error => {
            var header = document.createElement(header);
            header.textContent = error;
            document.getElementById("output").appendChild(header);
        })
}
