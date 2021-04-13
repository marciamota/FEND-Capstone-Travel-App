const regexURL = /^((http(s)?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/;

function checkURL(url) {
    const validURL = url.match(regexURL);
    return !!validURL;
}

export { checkURL }