/* Global Variables */
const apiKey = 'c73570622e301c7681ef0315d7f76721';
const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?units=imperial';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth()+1)+'-'+ d.getDate()+'-'+ d.getFullYear();

// document.getElementById('generate').addEventListener('click', generateMessage);

function generateMessage(){
    const zipCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;
    getWeatherData(apiUrl,zipCode,apiKey).then((data)=>{
        if (isValidWeatherData(data)){
            const postRequest = {
                date: newDate,
                temp: data.main.temp,
                content: feelings            
            }
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

function isValidWeatherData (data){
    if (data && 
        data != 'error' && 
        data.main && 
        data.main.temp){
            return true;
    } 
    return false;
}

//Function Get Api Weather Data
async function getWeatherData (url, zipCode, apiKey){
    try {
        const response = await fetch(`${url}&zip=${zipCode}&appid=${apiKey}`);
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