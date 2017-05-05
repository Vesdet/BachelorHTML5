function sendXSS(form) {
    fetch('/xssLogin', {
        method: 'post',
        body: JSON.stringify({
            login: form.login.value,
            password: form.password.value
        })
    })
        .then((res) => res.text())
        .then((data) => {
            console.log("serverData:", data);
            document.getElementsByClassName('user-info')[0].innerHTML = data;
        })
        .catch((err) => console.error(err));
}

function sendBlockedXSS(form) {
    fetch('/xssBlockedLogin', {
        method: 'post',
        body: JSON.stringify({
            login: form.login.value,
            password: form.password.value
        })
    })
        .then((res) => res.text())
        .then((data) => {
            console.log("serverData:", data);
            document.getElementsByClassName('user-info')[0].innerHTML = data;
        })
        .catch((err) => console.error(err));
}