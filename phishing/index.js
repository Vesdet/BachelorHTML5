const CORS_URL = 'http://127.0.0.1:1327/cors';
const CSRF_URL = 'http://127.0.0.1:1327/csrf/customRequest';
const CSRF_STEAL_COOKIE_URL = 'http://127.0.0.1:1327/csrf/getCookie';

function sendCORS() {
    const method = document.getElementById('cors-method').value;
    const headTitle = document.getElementById('cors-header-title').value;
    const headValue = document.getElementById('cors-header-value').value;

    let myHeaders = new Headers();
    if (headTitle) myHeaders.append(headTitle, headValue);
    const body = '<?xml version="1.0"?><person><name>Nikita</name></person>';

    fetch(CORS_URL, {
        method: method,
        body: method !== 'GET' ? body : false,
        headers: myHeaders
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("serverData:", data);
            document.getElementsByClassName('corsText')[0].innerHTML = JSON.stringify(data);
        })
        .catch((err) =>
            document.getElementsByClassName('corsText')[0].innerHTML = err);
}

function stealCookie() {
    fetch(CSRF_STEAL_COOKIE_URL, {
        credentials: 'include',
        method: 'get'
    })
        .then((res) => res.text())
        .then((data) => {
            console.log("stealCookie:", data);
            document.getElementsByClassName('stealing-cookies')[0].value = document.cookie;
        })
        .catch((err) => console.error(err));
}

function sendCSRF(form) {
    let myHeaders = new Headers();
    myHeaders.append("X-CSRF-TOKEN", form.csrfToken.value);

    fetch(CSRF_URL, {
        method: 'post',
        body: JSON.stringify({
            name: form.name.value,
            year: form.year.value
        }),
        headers: myHeaders
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("serverData:", data);
            document.getElementById('csrfText').innerHTML = JSON.stringify(data);
        })
        .catch((err) => console.error(err));
}