import defaulImage from '../images/world_map.png';

/* Global Variables */
const geonamesApiKey = 'marciageonames';
const geonamesApiUrl = 'http://api.geonames.org/searchJSON?formatted=true&q=';

const weatherbitApiKey = '1ae7ff6781ff4187ae6c84cc0fdfd959';
const weatherbitApiUrl1 = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=';
const weatherbitApiUrl2 = '&lon=';
const weatherbitApiUrl3 = '&days='
const weatherbitApiUrl4 = '&units=I&key=1ae7ff6781ff4187ae6c84cc0fdfd959'

const pixabayApiKey = '21291434-7da1d52b49f837621cd05e0f9';
const pixabayApiUrl1 = 'https://pixabay.com/api/?key='
const pixabayApiUrl2 = '&image_type=photo&pretty=true&q=';

let daysUntilTravel = -1;
let tripDuration = 0;

function generateMessage(){
    resetResult()
    const city = document.getElementById('city').value.toUpperCase();
    const travelDate = new Date(document.getElementById('date').value.toUpperCase());
    const endDate = new Date(document.getElementById('endDate').value.toUpperCase());
    if (city === "" || travelDate === undefined || endDate === undefined) {
        entryError.hidden = false;
    } else {
        const result = document.getElementById('result');
        document.getElementById('resultTitle').innerHTML = "Processing...";
        result.hidden = false;
        const today = new Date();
        daysUntilTravel = Math.ceil((travelDate.getTime() - today.getTime())/(1000*60*60*24),0);
        tripDuration = 1 + Math.ceil((endDate.getTime() - travelDate.getTime())/(1000*60*60*24),0);
        getGeonamesData(geonamesApiUrl,city,geonamesApiKey).then((data)=>{
            if (checkGeonamesData(data, city) === 'OK'){
                const lat = data.geonames[0].lat;
                const long = data.geonames[0].lng;
                const country = data.geonames[0].countryName;
                const postRequest = {
                    city: city,
                    country: country,
                    lat: lat,
                    long: long,
                    daysUntilTravel: daysUntilTravel,
                    tripDuration: tripDuration
                };
                getWeatherbitData(lat, long, daysUntilTravel).then((weatherbitData) => {
                    if (isValidWeatherbitData(weatherbitData)) {
                        const lastDateForecast = weatherbitData.data[weatherbitData.data.length - 1];
                        postRequest.highTemp = lastDateForecast.high_temp;
                        postRequest.lowTemp = lastDateForecast.low_temp;
                        postRequest.rainProb = lastDateForecast.pop;
                        postRequest.wheaterDescription = lastDateForecast.weather.description;
                    } else {
                        postRequest.wheaterDescription = 'WEATHERBIT_API_ERROR';
                    }
                    getPixabayData(city, country).then((pixabayData) => {
                        if (isValidPixabayData(pixabayData)) {
                            postRequest.pictureURL = pixabayData.hits[0].previewURL;
                        } else {
                            postRequest.pictureURL = defaulImage; // worldMap;
                        }
                        postData('/add', postRequest).then((response)=>{
                            if (response != 'error'){
                                // Update Ui
                                updateUI();
                            }else{
                                // Show error in Ui
                                showError('BACKEND_ERROR');
                            }
                        });
                    })
                })
            } else {
                //Show error in Ui
                showError(checkGeonamesData(data, city));
            }
        });
    }
    
}

function checkGeonamesData (data, city){
    if (!data || data === 'error' || !data.geonames) {
        return 'API_ERROR'
    } else if (data.geonames.length == 0 || 
        !data.geonames[0].asciiName ||
        data.geonames[0].asciiName.toUpperCase() != city){
            return 'CITY_NOT_FOUND'
    } 
    return 'OK';
}

function isValidWeatherbitData (data){
    if (data && 
        data != 'error' &&
        data.data && 
        data.data.length > 0){
            return true;
    } 
    return false;
}

function isValidPixabayData (data){
    if (data && 
        data != 'error' &&
        data.hits && 
        data.hits.length > 0){
            return true;
    } 
    return false;
}

async function getGeonamesData (url, city, apiKey){
    try {
        const request = `${url}${city}&username=${apiKey}&style=full`;
        const response = await fetch(request);
        const data = await response.json();
        console.log(data)
        return data;
    } catch(error) {
        console.log("error", error);
        return 'error';
    }
}

async function getWeatherbitData (lat, lon, daysUntilTravel){
    try {
        const request = encodeURI(`${weatherbitApiUrl1}${lat}${weatherbitApiUrl2}${lon}${weatherbitApiUrl3}${daysUntilTravel+2}${weatherbitApiUrl4}`);
        const response = await fetch(request);
        const data = await response.json();
        console.log(data)
        return data;
    } catch(error) {
        console.log("error", error);
        return 'error';
    }
}

async function getPixabayData (city, country){
    const formattedCity = city.replace(' ','+');
    const formattedCountry = country.replace(' ','+');
    try {
        const request = encodeURI(`${pixabayApiUrl1}${pixabayApiKey}${pixabayApiUrl2}${formattedCity}+${formattedCountry}`);
        const response = await fetch(request);
        const data = await response.json();
        console.log(data)
        return data;
    } catch(error) {
        console.log("error", error);
        return 'error';
    }
}

//POST request
const postData = async (url = '', data = {}) => {
    console.log(data)
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        const allData = await response.json()
        console.log(allData)
        return allData
    } catch(error) {
        console.log("error", error)
        return 'error';
    }
}

async function updateUI (){
    try{
        const request = await fetch('/all');
        const allData = await request.json();
        document.getElementById('resultTitle').innerHTML = "Have a nice trip.";
        document.getElementById('cityCountry').innerHTML = `Destination: ${Client.titleCase(allData.city)}, ${Client.titleCase(allData.country)}.`;
        document.getElementById('daysUntilTravel').innerHTML = `There are ${allData.daysUntilTravel} days remaining before your trip.`;
        document.getElementById('tripDuration').innerHTML = `Enjoy your ${tripDuration} day(s) trip.`;
        document.getElementById('destinationImage').src = allData.pictureURL;
        if (allData.wheaterDescription == 'WEATHERBIT_API_ERROR') {
            showError(allData.wheaterDescription);
        } else {
            document.getElementById('wheaterDescription').innerHTML = `The wheater will be: ${allData.wheaterDescription}.`
            document.getElementById('lowHighTemp').innerHTML = `Low temp: ${allData.lowTemp} &degf, High temp: ${allData.highTemp} &degf.`
            document.getElementById('rainProb').innerHTML = `Rain probability: ${allData.rainProb}%.`
        }
        document.getElementById('tripDetails').hidden = false;
    }catch(error){
        console.log('error', error);
        showError('BACKEND_ERROR');
    }
}

function showError(errorType){
    switch(errorType) {
        case 'API_ERROR':
            document.getElementById('resultTitle').innerHTML = "Something went wrong, please try again.";
            break;
        case 'CITY_NOT_FOUND':
            document.getElementById('resultTitle').innerHTML = "City not found, please try another city.";
            break;
        case 'WEATHERBIT_API_ERROR':
            document.getElementById('resultTitle').innerHTML = "Could not get the wheater forecast, please try again.";
            break;
        case 'BACKEND_ERROR':
            document.getElementById('resultTitle').innerHTML = "Something went wrong, please try again.";
            break;
        default:
            document.getElementById('wheaterDescription').innerHTML = "Something went wrong, please try again.";
    }  
}

function resetResult() {
    const entryError = document.getElementById('entryError');
    entryError.hidden = true;
    document.getElementById('tripDetails').hidden = true;
    document.getElementById('cityCountry').innerHTML = '';
    document.getElementById('date').innerHTML = '';
    document.getElementById('destinationImage').src = '';
    document.getElementById('wheaterDescription').innerHTML = '';
    document.getElementById('lowHighTemp').innerHTML = '';
    document.getElementById('rainProb').innerHTML = '';
}

export { generateMessage }