const CORS_URL = 'http://127.0.0.1:1327/cors';
const CSRF_URL = 'http://127.0.0.1:1327/csrf/customRequest';
const CSRF_STEAL_COOKIE_URL = 'http://127.0.0.1:1327/csrf/getCookie';

function sendCORS() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", 'application/xml');
    const body = '<?xml version="1.0"?><person><name>Nikita</name></person>';
    const method = document.getElementById('cors-method').value;

    fetch(CORS_URL, {
        method: method,
        body: body,
        headers: myHeaders
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("serverData:", data);
            document.getElementById('corsText').innerHTML = JSON.stringify(data);
        })
        .catch((err) => document.getElementById('corsText').innerHTML = JSON.stringify(err));
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