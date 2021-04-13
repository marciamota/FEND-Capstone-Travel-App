function handleSubmit(event) {
    event.preventDefault();
    clearForm();
    document.getElementById('message').innerHTML = 'Processing...';
    let urlInput = document.getElementById('url').value;

    if (Client.checkURL(urlInput)) {
        postData('http://localhost:8081/sentiment', {url: urlInput}).then(function(res) {
            if (res && res.score_tag && res.agreement && res.subjectivity && res.confidence && res.irony) {
                document.getElementById('message').innerHTML = '';
                document.getElementById("confidence").innerHTML = 'Confidence: ' + res.confidence;
                document.getElementById('sentiment').innerHTML = 'Sentiment: ' + sentiment(res.score_tag);
                document.getElementById("agreement").innerHTML = 'Agreement: ' + res.agreement;
                document.getElementById("irony").innerHTML = 'Irony: ' + res.irony;
                document.getElementById("subjectivity").innerHTML = 'Subjectivity: ' + res.subjectivity;
            } else {
                document.getElementById('message').innerHTML = 'Something went wrong please try again.';
            }
        })
    } else {
        document.getElementById('message').innerHTML = 'Please, enter a valid URL.';
    }
}

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

function sentiment(scoreTag) {
    const scores = {
        'P+': 'strong positive',
        'P': 'positive',
        'NEU': 'neutral',
        'N': 'negative',
        'N+': 'strong negative',
        'NONE': 'without sentiment'
    }
    const scoreTags = Object.keys(scores);
    if (scoreTags.includes(scoreTag)) {
        return scores[scoreTag];
    }
    return 'sentiment unknown';
}

function clearForm() {
    document.getElementById("confidence").innerHTML = '';
    document.getElementById('sentiment').innerHTML = '';
    document.getElementById("agreement").innerHTML = '';
    document.getElementById("irony").innerHTML = '';
    document.getElementById("subjectivity").innerHTML = '';
}

export { handleSubmit }
export { sentiment }
