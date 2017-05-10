let http = require('http');
let url = require('url');
let fs = require('fs');
let xssFilters = require('xss-filters');

let server = new http.Server(accept);

const cookie = 'CSRF-TOKEN=TokenMD5withSalt';
const data = {
    bachelor: true,
    name: 'Nikita',
    year: 2017
};
const allowDomains = ['http://google.com', 'http://127.0.0.1:1337']; // Resolved domains for requests

let userData = null;
function accept(req, res) {

    console.info("URL", req.url);
    let urlParced = url.parse(req.url, true);
    console.info("HEADERS", req.headers);
    let originDomain = req.headers.origin;

    switch (urlParced.pathname) {
        case '/xssLogin':
            userData = "";
            req.on('data', chunk => userData += chunk); // Read req data
            req.on('end', () => {
                userData = JSON.parse(userData);
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                res.end(`Hello, ${userData.login}<br/>Your password: <input value="${userData.password}"/>`)
            });
            break;
        case '/xssBlockedLogin':
            userData = "";
            req.on('data', chunk => userData += chunk); // Read req data
            req.on('end', () => {
                userData = JSON.parse(userData);
                userData = customCleanFromXSS(userData);
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                res.end(`Hello, ${userData.login}<br/>Your password: <input value="${userData.password}"/>`)
            });
            break;
            
        case '/cors':
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',

                // Without 'Access-Control-Allow-Origin' - CORS not works
                // 'Access-Control-Allow-Origin': '*',   // BAD
                'Access-Control-Allow-Origin': allowDomains.includes(originDomain) ? originDomain : null,  // RIGHT

                'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type', // Resolved headers
                'Access-Control-Allow-Methods': 'GET, POST' // Permission only GET and POST methods
            });
            res.end(JSON.stringify(data));
            break;

        case '/csrf/getCookie':
            console.info("request for cookie");
            res.writeHead(200, {
                'Access-Control-Allow-Origin': allowDomains.includes(originDomain) ? originDomain : null,
                'Access-Control-Allow-Credentials': true,
                'Set-Cookie': cookie + '; path=/;'
            });
            res.end('You are get Cookie');
            break;

        case '/csrf/customRequest':
            let headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'X-CSRF-TOKEN'
            };
            if (req.method === 'OPTIONS') {
                res.writeHead(200, headers);
                res.end();
                break;
            }
            if (!req.headers["x-csrf-token"] || req.headers["x-csrf-token"] !== 'TokenMD5withSalt') {
                console.info("request with incorrect token - " + req.headers["x-csrf-token"]);
                res.writeHead(403, headers);
                res.end(JSON.stringify({error: "Incorrect token"}));
                break;
            }
            let reqBody = "";
            req.on('data', chunk => reqBody += chunk); // Do smth with request data
            req.on('end', () => {
                res.writeHead(200, headers);
                res.end(JSON.stringify(data));
            });
            break;

        default:
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'X-Frame-Options': 'DENY', // Protection from Clickjacking
                // 'X-Frame-Options': 'SAMEORIGIN',
                // 'X-Frame-Options': 'ALLOW-FROM http://127.0.0.1:1337/'
            });
            res.end(getStatic(req.url));
    }
}

let siteHtml = fs.readFileSync('./website/site.html');
let siteJS = fs.readFileSync('./website/site.js');
let siteCss = fs.readFileSync('./website/site.css');
let siteIco = fs.readFileSync('./favicon.ico');
const getStatic = (url) => {
    return {
        '/': siteHtml,
        '/site.js': siteJS,
        '/site.css': siteCss,
        '/favicon.ico': siteIco
    }[url] || null;
};

function cleanFromXSS(data) {
    Object.keys(data).forEach(field => {
        data[field] = xssFilters.inHTMLData(data[field]);
        data[field] = xssFilters.inDoubleQuotedAttr(data[field]);
    });
    return data;
}

function customCleanFromXSS(data) {
    const escapeSpecial = (text) =>
        text.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\//g, '&#x2F;');
    const events = ["onclick", "onload", "onunload", "onabort", "onerror", "onblur", "onchange", "onfocus", "onreset", "onsubmit", "ondblclick", "onkeydown", "onkeypress", "onkeyup", "onmousedown", "onmouseup", "onmouseover", "onmouseout", "onselect", "javascript"];
    const escapeEvents = (text) => events.reduce((res, cur) => res.replace(new RegExp(cur + '=', 'gi'), ''), text);
    Object.keys(data).forEach(field => {
        data[field] = escapeSpecial(data[field]);
        data[field] = escapeEvents(data[field]);
    });
    return data;
}

const fromGETdataToObj = (data) => {
    let fields = data.split('&');
    let field = null;
    return fields.reduce((res, item) => {
        field = item.split('=');
        res[field[0]] = field[1];
        return res;
    }, {})
};

server.listen(1327, '127.0.0.1');
console.log('Server running on port 1327');