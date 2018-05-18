const net = require('net');
const express = require('express');
const bodyParser = require('body-parser');
const main = require('./app.js');
const logWriter = require('./logWriter');

const app = express();
const router = express.Router();

let receive_flag = false;
let connect_flag = true;

exports.getClient = function() { return client_info; };
exports.getBuffer = function() { return buffer; };
exports.getTimeoutMsg = function() { return timeout_msg; };
exports.setTimeout =  function(client) {
    clearInterval(timeout_msg);
    timeout_msg = setInterval(function () {
        client.write('SERVER OK');
        console.log('SERVER OK');
    }, 2000);
};
exports.setReceiveState = function(flag) {
    receive_flag = flag;
};
exports.getReceiveState = function() {
    return receive_flag;
};

exports.setConnectState = function(flag) {
    connect_flag = flag;
};
exports.getConnectState = function() {
    return connect_flag;
};


const socketServer = net.createServer(function(client) {
    client.on('end', function() {
        console.log('Client disconnected');
        socketServer.getConnections(function(err, count){
            console.log('Remaining Connections: ' + count);
        });
    });
    client.on('error', function(err) {
        // console.log('Socket Error: ', JSON.stringify(err));
    });
});

app.use(bodyParser.urlencoded({extended: false}));

// TCP Communication
let client_info = 'empty';
let buffer = 'empty';
let count = 0;
let client_num = [];
let client_number = 1;
let timeout_msg; // time out controller

socketServer.listen(3100, function() {
    console.log('3100 OK');

    socketServer.on('close', function() {
        console.log('Server terminated');
    });
    socketServer.on('error', function(err) {
        console.log('Server error: ', err.message);
    });
});

socketServer.on('error', function onError(error) {
    console.log('Error');
    console.log(error);
});

let connect_count = 0;

socketServer.on('connection', function onConnection(client) {
    console.log('Someone has connected the server.');

    connect_flag = true;
    connect_count += 1;
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const connect_time = month + '월 ' + day + '일 ' +hour + '시 ' + minute + '분 ' + second + '초';
    console.log(connect_time);
    logWriter.writeLog(connect_count + ': ' + connect_time);

    client_num.push(client_number);
    client_number += 1;
    console.log('Client: ' + client_num);

    client_info = client;
    client.write('3100 OK\n');
    client.write('Enjoy DPLAY IoT !\n');

    main.setTimeout(client);

    // 클라이언트가 데이터를 전송했을 때 이벤트를 걸어준다.
    client.on('data', function onClientData(buff) {
        receive_flag = true;
        let msg_tmp = new Uint8Array(buff);
        const msg = [];

        for(let i=0; i<msg_tmp.length; i++) {
            msg.push(msg_tmp[i]);
        }

        console.log('Flag: ' + receive_flag);
        console.log('Message from Client: ' + msg);
        buffer = msg;
    });
});




// HTTP Communication
app.listen(3000, function() {
    console.log('3000 OK');
});

app.set('view engine', 'pug');
app.set('views', './views');

const command = require('./routes/command');
app.use('/command', command);

app.get('/', function(req, res) {
    console.log('HOME Page');
    res.render('MainPage');
});

app.get('/LED', function(req, res) {
    console.log('LED Page');
    res.render('LED');
});

app.get('/Settings', function(req, res) {
    console.log('Settings Page');
    res.render('Settings');
});

app.get('/Sensor', function(req, res) {
    console.log('Sensor Page');
    res.render('Sensor');
});

app.get('/Servo', function(req, res) {
    console.log('Servo Page');
    res.render('Servo');
});

app.get('/Motor', function(req, res) {
    console.log('Motor Page');
    res.render('Motor');
});

app.get('/Button', function(req, res) {
    console.log('Button Page');
    res.render('Button');
});

app.get('/Tilt', function(req, res) {
    console.log('Tilt Page');
    res.render('Tilt');
});

app.get('/Buzzer', function(req, res) {
    console.log('Buzzer Page');
    res.render('Buzzer');
});
