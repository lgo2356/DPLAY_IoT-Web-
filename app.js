const net = require('net');
const express = require('express');
const bodyParser = require('body-parser');

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
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: false}));

// TCP Communication
let client_info = 'empty';
let buffer = 'empty';
let count = 0;
let client_num = [];
let client_number = 0;

let timer_1 = null;
let timer_2 = null;// command timer/ sensor control
let timeout_msg; // time out controller

socketServer.listen(3100, function() {
    console.log('3100 OK');

    socketServer.on('close', function() {
        console.log('Server terminated');
    });
    socketServer.on('error', function(err) {
        console.log('Server error: ', JSON.stringify(err));
    });
});

socketServer.on('error', function onError(error) {
    console.log('Error');
    console.log(error);
});

socketServer.on('connection', function onConnection(client) {
    console.log('Someone has connected the server.');
    // let address = client.address().address.split('.');
    // let address_0 = address[0].split(':');
    //
    // address[0] = address_0[3];
    // address = address[0] + '.' + address[1] + '.' + address[2] + '.' + address[3];
    // console.log(address);

    client_num.push(client_number);
    client_number += 1;
    console.log('Client: ' + client_num);

    client_info = client;
    client.write('3100 OK\n');
    client.write('Enjoy DPLAY IoT !\n');
    // client.write('EA02101303130300DE');

    timeout_msg = setInterval(function () {
        try {
            client.write('OK');
        } catch(e) {
            console.log("Error: " + e);
            clearInterval(timeout_msg);
        }
    }, 2000);

    // 클라이언트가 데이터를 전송했을 때 이벤트를 걸어준다.
    client.on('data', function onClientData(buff) {
        let msg_tmp = new Uint8Array(buff);
        const msg = [];
        // console.log(msg);
        // console.log('Buffer: ' + buff);
        //
        // console.log('클라이언트가 보낸 데이터 :', buff);
        // console.log(buff[0].toString());
        for(let i=0; i<buff.byteLength; i++) {
            // msg += String.fromCharCode(buff[i]);
        }

        for(let i=0; i<msg_tmp.length; i++) {
            msg.push(msg_tmp[i]);
        }

        // let msg = ['SENSOR', msg_tmp[0], msg_tmp[1], msg_tmp[2], msg_tmp[3], msg_tmp[4], msg_tmp[5]];

        console.log('Message from Client: ' + msg);
        buffer = msg;
    });

    // client.on('close', function() {
    //     console.log('Client disconnected.');
    //     clearInterval(timeout_msg);
    // });
    //
    // client.on('end', function() {
    //     console.log('END');
    //     clearInterval(timeout_msg);
    // });
});

exports.getClient = function() { return client_info; };
exports.getBuffer = function() { return buffer; };



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

    // const command = 'EA0341000141FF00DE';
    // const command = 'EA0341000341FF00DE';
    // // write command
    // timer = setInterval(function() {
    //     console.log('Running...');
    //     client_info.write(command);
    // }, 1000);
    //
    // console.log('fff');
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







// TEST
app.get('/TEST_Sensor00_ON', function(req, res) {
    console.log('Sensor 00 ON');
    // res.render('LED');
    //
    // clearInterval(timer);
    // client_info.write('EA03410001410000DE');
    timer_1 = setInterval(function() {
        console.log('Running...');
        client_info.write('EA0341000141FF00DE');
    }, 1000);
});

app.get('/TEST_Sensor00_OFF', function(req, res) {
    console.log('Sensor 00 OFF');
    // res.render('LED');

    clearInterval(timer_1);
    // client_info.write('EA03410001410000DE');
    client_info.write('EA03410001410000DE');
});

app.get('/TEST_Sensor0001_ON', function(req, res) {
    console.log('Sensor 00 01 ON');
    res.render('LED');

    // clearInterval(timer);
    // client_info.write('EA03410001410000DE');
    timer_2 = setInterval(function() {
        console.log('Running...');
        client_info.write('EA0341000341FF00DE');
    }, 1000);
});

app.get('/TEST_Sensor0001_OFF', function(req, res) {
    console.log('Sensor 00 01 OFF');
    res.render('LED');

    if(timer_2 != null) {
        clearInterval(timer_2);
    }
    // client_info.write('EA03410001410000DE');
    client_info.write('EA03410003410000DE');
});

app.get('/TEST_LED13', function(req, res) {
    console.log('LED 13 ON');
    res.render('LED');

    // client_info.write('EA03410001410000DE');
    client_info.write('EA02100800080000DE');
});
