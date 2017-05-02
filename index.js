const CORS_URL = 'http://127.0.0.1:1327/cors';

function sendCORS() {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", 'application/xml');
    const body = '<?xml version="1.0"?><person><name>Nikita</name></person>';

    fetch(CORS_URL, {
        method: 'post',
        body: body,
        headers: myHeaders
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("serverData:", data);
            document.getElementById('corsText').innerHTML = JSON.stringify(data);
        })
        .catch((err) => console.error(err));
}