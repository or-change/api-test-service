const http = require('http');
const TestingService = require('./testing-service-dev');
const { server } = require('./.config.json');

http.createServer(TestingService.requestListrner).listen(server.port);

console.log('Server listened on: ', server.port);