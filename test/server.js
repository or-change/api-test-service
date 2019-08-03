const http = require('http');
const { callback } = require('./testing-service-dev');
const { server } = require('./.config.json');

http.createServer(callback).listen(server.port);

console.log('Server listened on: ', server.port);