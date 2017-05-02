let http = require('http');
let url = require('url');

let server = new http.Server(accept);

const data = {
    bachelor: true,
    name: 'Nikita',
    year: 2017
};
const allowDomains = ['http://google.com', 'http://localhost:1337'];

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
                // 'Access-Control-Allow-Origin': '*'   // BAD
                'Access-Control-Allow-Origin': allowDomains.includes(originDomain) ? originDomain : null,  // RIGHT

                'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Credentials': true
            });
            res.end(JSON.stringify(data));
            break;

        default:
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': 'https://www.google.ru/ http://localhost:63342'
            });
            res.end('Server responce');
    }
}

server.listen(1327, '127.0.0.1');
console.log('Server running on port 1327');