const http = require('http');
const ExaminerDemo = require('./demo');
const { server } = require('./.config.json');

http.createServer(ExaminerDemo.requestListener).listen(server.port);

console.log('Server listened on: ', server.port);