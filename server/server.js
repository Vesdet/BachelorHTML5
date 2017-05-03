let http = require('http');
let url = require('url');

let server = new http.Server(accept);

const cookie = 'CSRF-TOKEN=TokenMD5withSalt';
const data = {
    bachelor: true,
    name: 'Nikita',
    year: 2017
};
const allowDomains = ['http://google.com', 'http://127.0.0.1:1337']; // Resolved domains for requests

function accept(req, res) {

    console.info("URL", req.url);
    let urlParced = url.parse(req.url, true);
    console.info("HEADERS", req.headers);
    let originDomain = req.headers.origin;

    switch (urlParced.pathname) {
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
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': 'https://www.google.ru/'
            });
            res.end('Server responce');
    }
}

const fromGetDataToObj = (data) => {
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