// adding current year to the footer
const footerYear = document.getElementById('year');
footerYear.innerHTML = new Date().getFullYear();

// grabbing sections
const loadingDiv = document.getElementById('loading');
const errorMsgDiv = document.getElementById('errorMsg');
const inputField = document.getElementById('url');

// sending request to backend
const form = document.querySelector('form');
form.addEventListener('submit', e => {
    e.preventDefault();
    showLoading();
    hideErrorMsg();

    const url = inputField.value;

    // checking for url here
    const regex = new RegExp("^(http|https)://(www.instagram|instagram)\.(com)*");
    if(!regex.test(url)){
        showErrorMsg('The URL you entered is invalid or the user account is private. Please enter a valid url');
        hideLoading();
        return;
    }

    // initialising xhr request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/download', true);
    xhr.onload = function() {
        if (this.status === 200){
            window.open(this.response,'_blank');
        } else {
            showErrorMsg('The URL you entered is invalid or the user account is private. Please enter a valid url');
        }
        hideLoading();
    }

    const data = {
        url: url
    }
    // setting headers to send data in JSON format
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));   
})

const showErrorMsg = message => {
    errorMsgDiv.style.display = 'block';
    errorMsgDiv.innerHTML = message;
}
const hideErrorMsg = () => errorMsgDiv.style.display = 'none';

const showLoading = () => loadingDiv.style.display = 'block';
const hideLoading = () => loadingDiv.style.display = 'none';