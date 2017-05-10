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

// If a window in a frame than change location
if (top !== window)
    top.location = window.location; // Not work, when frame with sandbox

window.onload = () => {
    if (top.document.domain === document.domain)
        document.getElementById('iframe-click-protector').remove();
};

function clickJack() {
    alert('You click "LIKE" in frame');
}
function protectorClick() {
    window.open('/');
}