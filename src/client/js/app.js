/* Global Variables */
// const apiKey = 'c73570622e301c7681ef0315d7f76721';
// const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?units=imperial';
const geonamesApiKey = 'marciageonames';
const geonamesApiUrl = 'http://api.geonames.org/searchJSON?formatted=true&q=';

const weatherbitApiKey = '1ae7ff6781ff4187ae6c84cc0fdfd959';
const weatherbitApiUrl1 = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=';
const weatherbitApiUrl2 = '&lon=';
const weatherbitApiUrl3 = '&days='
const weatherbitApiUrl4 = '&units=I&key=1ae7ff6781ff4187ae6c84cc0fdfd959'

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth()+1)+'-'+ d.getDate()+'-'+ d.getFullYear();
let daysUntilTravel = -1;

// document.getElementById('generate').addEventListener('click', generateMessage);

function generateMessage(){
    const zipCode = document.getElementById('zip').value.toUpperCase();
    const travelDate = new Date(document.getElementById('date').value.toUpperCase());
    const today = new Date();
    daysUntilTravel = Math.ceil((travelDate.getTime() - today.getTime())/(1000*60*60*24),0);
    const feelings = document.getElementById('feelings').value;
    getWeatherData(geonamesApiUrl,zipCode,geonamesApiKey).then((data)=>{
        if (isValidWeatherData(data, zipCode)){
            const postRequest = {
                lat: data.geonames[0].lat,
                long: data.geonames[0].lng,
                country: data.geonames[0].countryName
            };
            const lat = data.geonames[0].lat;
            const long = data.geonames[0].lng;
            const country = data.geonames[0].countryName;
            getWeatherbitData(lat, long, daysUntilTravel).then((data) => {
                if (isValidWeatherbitData(data)) {
                    const lastDateForecast = data.data[data.data.length - 1];
                    const high_temp = lastDateForecast.high_temp;
                    const low_temp = lastDateForecast.low_temp;
                    const rainProb = lastDateForecast.pop;
                    const wheatherDescription = lastDateForecast.weather.description;
                    console.log('x');
                } else {
                    //Show error in Ui
                    showError();
                }
            })
            postData('/add', postRequest).then((response)=>{
                if (response != 'error'){
                    // Update Ui
                    updateUI();
                }else{
                    // Show error in Ui
                    showError();
                }
            });
        }else{
            //Show error in Ui
            showError();
        }
    });
}

function isValidWeatherData (data, city){
    if (data && 
        data != 'error' &&
        data.geonames && 
        data.geonames.length > 0 && 
        data.geonames[0].asciiName &&
        data.geonames[0].asciiName.toUpperCase() == city){
            return true;
    } 
    return false;
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

//Function Get Api Weather Data
async function getWeatherData (url, city, apiKey){
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

//Function Get Api Weather Data
async function getWeatherbitData (lat, lon, daysUntilTravel){
    try {
        const request = `${weatherbitApiUrl1}${lat}${weatherbitApiUrl2}${lon}${weatherbitApiUrl3}${daysUntilTravel+2}${weatherbitApiUrl4}`;
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
        document.getElementById('date').innerHTML = `Date: ${allData.date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${allData.temp} &degf`;
        document.getElementById('content').innerHTML = `I feel: ${allData.content}`;
    }catch(error){
        console.log('error', error);
        showError();
    }
}

function showError (){
    document.getElementById('content').innerHTML = "Something went wrong, please try again.";
}

export { generateMessage }