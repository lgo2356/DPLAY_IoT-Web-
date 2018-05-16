const express = require('express');
const main = require('../app');
const router = express.Router();

let sensor_timer;
let timeout_msg;
let buff = null;
let client = main.getClient();

let flag = [false, false, false, false, false, false, false, false, false, false, false, false];
const pin = [1, 2, 4, 8, 16, 32, 64, 128, 1, 2, 4, 8];

// Servo control
function Servo_control(pin_, degree) {
    console.log('Servo Control');

    let pin_tmp = pin_;

    switch(pin_) {
        case 'PIN02':
            console.log('PIN02');
            pin_tmp = 0;
            break;
        case 'PIN03':
            console.log('PIN03');
            pin_tmp = 1;
            break;
        case 'PIN04':
            console.log('PIN04');
            pin_tmp = 2;
            break;
        case 'PIN05':
            console.log('PIN05');
            pin_tmp = 3;
            break;
        case 'PIN06':
            console.log('PIN06');
            pin_tmp = 4;
            break;
        case 'PIN07':
            console.log('PIN07');
            pin_tmp = 5;
            break;
        case 'PIN08':
            console.log('PIN08');
            pin_tmp = 6;
            break;
        case 'PIN09':
            console.log('PIN09');
            pin_tmp = 7;
            break;
        case 'PIN10':
            console.log('PIN10');
            pin_tmp = 8;
            break;
        case 'PIN11':
            console.log('PIN11');
            pin_tmp = 9;
            break;
        case 'PIN12':
            console.log('PIN12');
            pin_tmp = 10;
            break;
        case 'PIN13':
            console.log('PIN13');
            pin_tmp = 11;
            break;
    }

    flag[pin_tmp] = true;
    let cmd_upper_pin = 0;
    let cmd_lower_pin = 0;
    degree = parseInt(degree);

    for(let i=0; i<flag.length; i++) {
        if(i<8) {
            if(flag[i]) {
                cmd_lower_pin = cmd_lower_pin + pin[i];
            }
        } else {
            if(flag[i]) {
                cmd_upper_pin = cmd_upper_pin + pin[i];
            }
        }
    }

    if(cmd_lower_pin < 16) {
        cmd_lower_pin = '0' + cmd_lower_pin.toString(16);
    }

    if(cmd_upper_pin < 16) {
        cmd_upper_pin = '0' + cmd_upper_pin.toString(16);
    }

    if(degree < 16) {
        degree = degree.toString(16);
    }

    cmd_lower_pin = cmd_lower_pin.toString(16);
    cmd_upper_pin = cmd_upper_pin.toString(16);
    degree = degree.toString(16);

    const command = 'EA0231' + cmd_upper_pin + cmd_lower_pin + '00' + degree + '00DE';
    console.log("Command: " + command);
    client.write(command);
}

// Buzzer control
function Buzzer_on(melody) {
    console.log('Buzzer on');
    console.log(melody);

    switch(melody) {
        case 'C':
            console.log('C');
            melody = '01';
            break;
        case 'D':
            console.log('D');
            melody = '02';
            break;
        case 'E':
            console.log('E');
            melody = '04';
            break;
        case 'F':
            console.log('F');
            melody = '08';
            break;
        case 'G':
            console.log('G');
            melody = '10';
            break;
        case 'A':
            console.log('A');
            melody = '20';
            break;
        case 'B':
            console.log('B');
            melody = '40';
            break;
    }
    const command = 'EA0250040000' + melody + '00DE';
    console.log('Command: ' + command);
    client.write(command);
}

// Motor control
function Motor_on(left_right, direction, speed) {
    console.log('Motor on');

    console.log(left_right);
    console.log(direction);
    console.log(speed);

    speed = parseInt(speed);
    speed = speed.toString(16);
    console.log(speed);

    if(left_right === 'DCLEFT') {
        if(direction === 'DCADV') {
            const command = 'EA0230021001' + speed + '00DE';
            console.log('Command: ' + command);
            client.write(command);
        } else if(direction === 'DCREV') {
            const command = 'EA0230021002' + speed + '00DE';
            console.log('Command: ' + command);
            client.write(command);
        } else if(direction === 'DCSTOP') {
            const command = 'EA0230021000' + speed + '00DE';
            console.log('Command: ' + command);
            client.write(command);
        }
    }

    if(left_right === 'DCRIGHT') {
        if(direction === 'DCADV') {
            const command = 'EA0230000A01' + speed + '00DE';
            console.log('Command: ' + command);
            client.write(command);
        } else if(direction === 'DCREV') {
            const command = 'EA0230000A02' + speed + '00DE';
            console.log('Command: ' + command);
            client.write(command);
        } else if(direction === 'DCSTOP') {
            const command = 'EA0230000A00' + speed + '00DE';
            console.log('Command: ' + command);
            client.write(command);
        }
    }

    if(left_right === 'DCALL') {
        if(direction === 'DCADV') {
            const command = 'EA0230021A01' + speed + '00DE';
            console.log('Command: ' + command);
            client.write(command);
        } else if(direction === 'DCREV') {
            const command = 'EA0230021A02' + speed + '00DE';
            console.log('Command: ' + command);
            client.write(command);
        } else if(direction === 'DCSTOP') {
            const command = 'EA0230021A00' + speed + '00DE';
            console.log('Command: ' + command);
            client.write(command);
        }
    }
}

// Sensor on Function
let sensor_timer_state = 'OFF';
let pin_number_tmp = '';
function Sensor_control_on(pin_number, sensor) {
    console.log('Sensor on Function');
    client = main.getClient();

    let humidity = false;
    let cmd_upper_pin = 0;
    let cmd_lower_pin = 0;
    let cmd_sensor;

    switch(sensor) {
        case 'CDS':
            cmd_sensor = '40';
            break;
        case 'ROTATION':
            cmd_sensor = '41';
            break;
        case 'IR':
            cmd_sensor = '42';
            break;
        case 'TEMPERATURE':
            cmd_sensor = '4E';
            break;
        case 'HUMIDITY':
            humidity = true;
            cmd_sensor = '4F';
            break;
    }

    if(humidity) { cmd_upper_pin = 2; }
    else { cmd_upper_pin = 0; }

    for(let i=0; i<flag.length; i++) {
        if(i<6) {
            if(flag[i]) {
                cmd_lower_pin = cmd_lower_pin + pin[i];
            }
        } else {
            if(flag[i]) {
                cmd_upper_pin = cmd_upper_pin + pin[i];
            }
        }
    }

    if(cmd_lower_pin < 16) { cmd_lower_pin = '0' + cmd_lower_pin.toString(16); }

    if(cmd_upper_pin < 16) { cmd_upper_pin = '0' + cmd_upper_pin.toString(16); }

    cmd_lower_pin = cmd_lower_pin.toString(16);
    cmd_upper_pin = cmd_upper_pin.toString(16);

    if(cmd_lower_pin === '00') {
        clearInterval(sensor_timer);
    }

    const command = 'EA03' + cmd_sensor + cmd_upper_pin + cmd_lower_pin + cmd_sensor + 'FF00DE';
    console.log('Command: ' + command);
    client.write(command);

    // if(pin_number_tmp !== pin_number) {
    //     sensor_timer_state = 'OFF';
    // }
}

// Sensor off Function
function Sensor_control_off(pin_number, sensor) {
    console.log('Sensor off Function');
    client = main.getClient();

    flag[pin_number] = false;
    let humidity = false;
    let cmd_upper_pin = 0;
    let cmd_lower_pin = pin[pin_number];
    let cmd_sensor;

    switch(sensor) {
        case 'CDS':
            cmd_sensor = '40';
            break;
        case 'ROTATION':
            cmd_sensor = '41';
            break;
        case 'IR':
            cmd_sensor = '42';
            break;
        case 'TEMPERATURE':
            cmd_sensor = '4E';
            break;
        case 'HUMIDITY':
            humidity = true;
            cmd_sensor = '4F';
            break;
    }

    if(humidity) {
        cmd_upper_pin = 2;
    } else {
        cmd_upper_pin = 0;
    }

    if(cmd_lower_pin < 16) {
        cmd_lower_pin = '0' + cmd_lower_pin.toString(16);
    }

    if(cmd_upper_pin < 16) {
        cmd_upper_pin = '0' + cmd_upper_pin.toString(16);
    }

    cmd_lower_pin = cmd_lower_pin.toString(16);
    cmd_upper_pin = cmd_upper_pin.toString(16);

    const command = 'EA03' + cmd_sensor + cmd_upper_pin + cmd_lower_pin + cmd_sensor + '0000DE';
    console.log('Command: ' + command);

    // clearInterval(sensor_timer);
    sensor_timer_state = 'OFF';
    client.write(command);
}

// LED on Function
function LED_on(pin_number) {
    client = main.getClient();
    pin_number -= 2;
    flag[pin_number] = true;
    let cmd_upper_pin = 0;
    let cmd_lower_pin = 0;

    for(let i=0; i<flag.length; i++) {
        if(i<8) {
            if(flag[i]) {
                cmd_lower_pin = cmd_lower_pin + pin[i];
            }
        } else {
            if(flag[i]) {
                cmd_upper_pin = cmd_upper_pin + pin[i];
            }
        }
    }

    if(cmd_lower_pin < 16) {
        cmd_lower_pin = '0' + cmd_lower_pin.toString(16);
    }

    if(cmd_upper_pin < 16) {
        cmd_upper_pin = '0' + cmd_upper_pin.toString(16);
    }

    cmd_lower_pin = cmd_lower_pin.toString(16);
    cmd_upper_pin = cmd_upper_pin.toString(16);

    const command = 'EA0210' + cmd_upper_pin + cmd_lower_pin + cmd_upper_pin + cmd_lower_pin + '00DE';
    console.log("Command: " + command);
    client.write(command);
}

// LED off Function
function LED_off(pin_number) {
    client = main.getClient();

    pin_number -= 2;
    flag[pin_number] = false;
    let cmd_upper_pin = 0;
    let cmd_lower_pin = 0;

    for(let i=0; i<flag.length; i++) {
        if(i<8) {
            if(flag[i]) {
                cmd_lower_pin = cmd_lower_pin + pin[i];
                //cmd_lower_pin = cmd_lower_pin.toString();
            }
        } else {
            if(flag[i]) {
                cmd_upper_pin = cmd_upper_pin + pin[i];
                //cmd_upper_pin = cmd_upper_pin.toString();
            }
        }
    }

    if(cmd_lower_pin < 16) {
        cmd_lower_pin = '0' + cmd_lower_pin.toString(16);
    }

    if(cmd_upper_pin < 16) {
        cmd_upper_pin = '0' + cmd_upper_pin.toString(16);
    }

    cmd_lower_pin = cmd_lower_pin.toString(16);
    cmd_upper_pin = cmd_upper_pin.toString(16);

    const command = 'EA0210' + cmd_upper_pin + cmd_lower_pin + cmd_upper_pin + cmd_lower_pin + '00DE';
    console.log('Command: ' + command);
    client.write(command);
}

// Button on Function
function Button_on(pin_number) {
    console.log('Button Function');

    let pin_tmp;

    switch(pin_number) {
        case 'PIN02':
            pin_tmp = 0;
            break;
        case 'PIN03':
            pin_tmp = 1;
            break;
        case 'PIN04':
            pin_tmp = 2;
            break;
        case 'PIN05':
            pin_tmp = 3;
            break;
        case 'PIN06':
            pin_tmp = 4;
            break;
        case 'PIN07':
            pin_tmp = 5;
            break;
        case 'PIN08':
            pin_tmp = 6;
            break;
        case 'PIN09':
            pin_tmp = 7;
            break;
        case 'PIN10':
            pin_tmp = 8;
            break;
        case 'PIN11':
            pin_tmp = 9;
            break;
        case 'PIN12':
            pin_tmp = 10;
            break;
        case 'PIN13':
            pin_tmp = 11;
            break;
    }

    flag[pin_tmp] = true;
    let cmd_upper_pin = 0;
    let cmd_lower_pin = 0;

    for(let i=0; i<flag.length; i++) {
        if(i<8) {
            if(flag[i]) {
                cmd_lower_pin = cmd_lower_pin + pin[i];
            }
        } else {
            if(flag[i]) {
                cmd_upper_pin = cmd_upper_pin + pin[i];
            }
        }
    }

    if(cmd_lower_pin < 16) {
        cmd_lower_pin = '0' + cmd_lower_pin.toString(16);
    }

    if(cmd_upper_pin < 16) {
        cmd_upper_pin = '0' + cmd_upper_pin.toString(16);
    }

    cmd_lower_pin = cmd_lower_pin.toString(16);
    cmd_upper_pin = cmd_upper_pin.toString(16);

    const command = 'EA0320' + cmd_upper_pin + cmd_lower_pin + '20FF00DE';
    console.log('Command: ' + command);
    client.write(command);
}

// Button off Function
function Button_off(pin_number) {
    console.log('Button Function');

    let pin_tmp;

    switch(pin_number) {
        case 'PIN02_':
            pin_tmp = 0;
            break;
        case 'PIN03_':
            pin_tmp = 1;
            break;
        case 'PIN04_':
            pin_tmp = 2;
            break;
        case 'PIN05_':
            pin_tmp = 3;
            break;
        case 'PIN06_':
            pin_tmp = 4;
            break;
        case 'PIN07_':
            pin_tmp = 5;
            break;
        case 'PIN08_':
            pin_tmp = 6;
            break;
        case 'PIN09_':
            pin_tmp = 7;
            break;
        case 'PIN10_':
            pin_tmp = 8;
            break;
        case 'PIN11_':
            pin_tmp = 9;
            break;
        case 'PIN12_':
            pin_tmp = 10;
            break;
        case 'PIN13_':
            pin_tmp = 11;
            break;
    }

    flag[pin_tmp] = false;
    let cmd_upper_pin = 0;
    let cmd_lower_pin = 0;

    for(let i=0; i<flag.length; i++) {
        if(i<8) {
            if(flag[i]) {
                cmd_lower_pin = cmd_lower_pin + pin[i];
            }
        } else {
            if(flag[i]) {
                cmd_upper_pin = cmd_upper_pin + pin[i];
            }
        }
    }

    if(cmd_lower_pin < 16) {
        cmd_lower_pin = '0' + cmd_lower_pin.toString(16);
    }

    if(cmd_upper_pin < 16) {
        cmd_upper_pin = '0' + cmd_upper_pin.toString(16);
    }

    cmd_lower_pin = cmd_lower_pin.toString(16);
    cmd_upper_pin = cmd_upper_pin.toString(16);

    const command = 'EA0320' + cmd_upper_pin + cmd_lower_pin + '200000DE';
    console.log('Command: ' + command);
    client.write(command);
}

// Tilt on Function
function Tilt_on(pin_number) {
    console.log('Tilt Function');

    let pin_tmp;

    switch(pin_number) {
        case 'PIN02':
            pin_tmp = 0;
            break;
        case 'PIN03':
            pin_tmp = 1;
            break;
        case 'PIN04':
            pin_tmp = 2;
            break;
        case 'PIN05':
            pin_tmp = 3;
            break;
        case 'PIN06':
            pin_tmp = 4;
            break;
        case 'PIN07':
            pin_tmp = 5;
            break;
        case 'PIN08':
            pin_tmp = 6;
            break;
        case 'PIN09':
            pin_tmp = 7;
            break;
        case 'PIN10':
            pin_tmp = 8;
            break;
        case 'PIN11':
            pin_tmp = 9;
            break;
        case 'PIN12':
            pin_tmp = 10;
            break;
        case 'PIN13':
            pin_tmp = 11;
            break;
    }

    flag[pin_tmp] = true;
    let cmd_upper_pin = 0;
    let cmd_lower_pin = 0;

    for(let i=0; i<flag.length; i++) {
        if(i<8) {
            if(flag[i]) {
                cmd_lower_pin = cmd_lower_pin + pin[i];
            }
        } else {
            if(flag[i]) {
                cmd_upper_pin = cmd_upper_pin + pin[i];
            }
        }
    }

    if(cmd_lower_pin < 16) {
        cmd_lower_pin = '0' + cmd_lower_pin.toString(16);
    }

    if(cmd_upper_pin < 16) {
        cmd_upper_pin = '0' + cmd_upper_pin.toString(16);
    }

    cmd_lower_pin = cmd_lower_pin.toString(16);
    cmd_upper_pin = cmd_upper_pin.toString(16);

    const command = 'EA0321' + cmd_upper_pin + cmd_lower_pin + '21FF00DE';
    console.log('Command: ' + command);
    client.write(command);
}

// Tilt off Function
function Tilt_off(pin_number) {
    console.log('Tilt off Function');

    let pin_tmp;

    switch(pin_number) {
        case 'PIN02':
            pin_tmp = 0;
            break;
        case 'PIN03':
            pin_tmp = 1;
            break;
        case 'PIN04':
            pin_tmp = 2;
            break;
        case 'PIN05':
            pin_tmp = 3;
            break;
        case 'PIN06':
            pin_tmp = 4;
            break;
        case 'PIN07':
            pin_tmp = 5;
            break;
        case 'PIN08':
            pin_tmp = 6;
            break;
        case 'PIN09':
            pin_tmp = 7;
            break;
        case 'PIN10':
            pin_tmp = 8;
            break;
        case 'PIN11':
            pin_tmp = 9;
            break;
        case 'PIN12':
            pin_tmp = 10;
            break;
        case 'PIN13':
            pin_tmp = 11;
            break;
    }

    flag[pin_tmp] = true;
    let cmd_upper_pin = 0;
    let cmd_lower_pin = 0;

    for(let i=0; i<flag.length; i++) {
        if(i<8) {
            if(flag[i]) {
                cmd_lower_pin = cmd_lower_pin + pin[i];
            }
        } else {
            if(flag[i]) {
                cmd_upper_pin = cmd_upper_pin + pin[i];
            }
        }
    }

    if(cmd_lower_pin < 16) {
        cmd_lower_pin = '0' + cmd_lower_pin.toString(16);
    }

    if(cmd_upper_pin < 16) {
        cmd_upper_pin = '0' + cmd_upper_pin.toString(16);
    }

    cmd_lower_pin = cmd_lower_pin.toString(16);
    cmd_upper_pin = cmd_upper_pin.toString(16);

    const command = 'EA0321' + cmd_upper_pin + cmd_lower_pin + '210000DE';
    console.log('Command: ' + command);
    client.write(command);
}

// Tilt
router.post('/Tilt', function(req, res) {
    console.log('Tilt POST');

    client = main.getClient();

    let pin = req.body.pin;
    let msg = '';

    if(client !== 'empty') {
        // ON
        if(pin.match(/_/)) {
            Tilt_off(pin);
        } else {
            Tilt_on(pin);
        }
    } else {
        console.log('No connection');
    }

    res.send({
        result: true,
        msg: pin
    });
});

// Button
router.post('/Button', function(req, res) {
    console.log('Button POST');

    client = main.getClient();

    let pin = req.body.pin;
    let msg = '';

    if(client !== 'empty') {
        // ON
        if(pin.match(/_/)) {
            Button_off(pin);
        } else {
            Button_on(pin);
        }
    } else {
        console.log('No connection');
    }

    res.send({
        result: true,
        msg: pin
    });
});

// Servo
router.post('/Servo', function(req, res) {
    console.log('Servo POST');

    client = main.getClient();

    let pin = req.body.pin;
    let degree = req.body.degree;

    if(client !== 'empty') {
        Servo_control(pin, degree);
    } else {
        console.log('No connection');
    }

    res.send({
        result: true,
        msg: degree
    });
});

// Buzzer
router.post('/Buzzer', function(req, res) {
    console.log('Buzzer POST');

    client = main.getClient();

    let melody = req.body.melody;

    if(client !== 'empty') {
        Buzzer_on(melody);
    } else {
        console.log('No connection');
    }

    res.send({
        result: true,
        msg: melody
    });
});

// Motor
router.post('/Motor', function(req, res) {
    console.log('Motor POST');

    client = main.getClient();

    let left_right = req.body.left_right;
    let direction = req.body.direction;
    let speed = req.body.speed;

    if(client !== 'empty') {
        Motor_on(left_right, direction, speed);
    } else {
        console.log('No connection');
    }
});

// Sensor
let status = 'COMMAND_MODE';
let pin_tmp = '';
router.post('/Sensor', function(req, res) {
    console.log('Sensor POST');
    console.log('pin_tmp: ' + pin_tmp);

    client = main.getClient();
    const sensor = req.body.sensor;
    const pin = req.body.pin;
    let buff = new Array(main.getBuffer());
    let value = buff.toString();
    value = value.split(',');
    const off = req.body.cmd_off;

    if(pin !== pin_tmp) {
        status = 'COMMAND_MODE';
    }

    // Send command
    if (client !== 'empty') {
        // 같은 ON 버튼을 클릭했을 때 명령어 함수를 또 실행시키지 않기 위해 플래그를 설정한다.
        if(status === 'COMMAND_MODE') {
            // ON
            // 항상 새로운 명령을 입력하기 위해 타이머를 설정한다.
            const second = 1000;
            if (pin === 'PIN00ON') {
                console.log('PIN 00 ON');
                const pin_number = 0;
                flag[pin_number] = true;
                clearInterval(sensor_timer);
                sensor_timer = setInterval(function() {
                    Sensor_control_on(pin_number, sensor);
                }, second);
            }
            if (pin === 'PIN01ON') {
                console.log('PIN 01 ON');
                const pin_number = 1;
                flag[pin_number] = true;
                clearInterval(sensor_timer);
                sensor_timer = setInterval(function() {
                    Sensor_control_on(pin_number, sensor);
                }, second);
            }
            if (pin === 'PIN02ON') {
                console.log('PIN 02 ON');
                const pin_number = 2;
                flag[pin_number] = true;
                clearInterval(sensor_timer);
                sensor_timer = setInterval(function() {
                    Sensor_control_on(pin_number, sensor);
                }, second);
            }
            if (pin === 'PIN03ON') {
                console.log('PIN 03 ON');
                const pin_number = 3;
                flag[pin_number] = true;
                clearInterval(sensor_timer);
                sensor_timer = setInterval(function() {
                    Sensor_control_on(pin_number, sensor);
                }, second);
            }
            if (pin === 'PIN04ON') {
                console.log('PIN 04 ON');
                const pin_number = 4;
                flag[pin_number] = true;
                clearInterval(sensor_timer);
                sensor_timer = setInterval(function() {
                    Sensor_control_on(pin_number, sensor);
                }, second);
            }
            if (pin === 'PIN05ON') {
                console.log('PIN 05 ON');
                const pin_number = 5;
                flag[pin_number] = true;
                clearInterval(sensor_timer);
                sensor_timer = setInterval(function() {
                    Sensor_control_on(pin_number, sensor);
                }, second);
            }
            pin_tmp = pin;
            status = 'SEND_MODE';
        }

        // OFF
        if (pin === 'PIN00OFF') {
            console.log('PIN 00 OFF');
            const pin_number = 0;
            Sensor_control_off(pin_number, sensor);
        }
        if (pin === 'PIN01OFF') {
            console.log('PIN 01 OFF');
            const pin_number = 1;
            Sensor_control_off(pin_number, sensor);
        }
        if (pin === 'PIN02OFF') {
            console.log('PIN 02 OFF');
            const pin_number = 2;
            Sensor_control_off(pin_number, sensor);
        }
        if (pin === 'PIN03OFF') {
            console.log('PIN 03 OFF');
            const pin_number = 3;
            Sensor_control_off(pin_number, sensor);
        }
        if (pin === 'PIN04OFF') {
            console.log('PIN 04 OFF');
            const pin_number = 4;
            Sensor_control_off(pin_number, sensor);
        }
        if (pin === 'PIN05OFF') {
            console.log('PIN 05 OFF');
            const pin_number = 5;
            value[5] = '0';
            Sensor_control_off(pin_number, sensor);
        }
    } else {
        console.log('No connection');
        // value = 'No connection';
    }

    if(off === 'OFF') {
        buff = 'OFF';
    }

    console.log('PIN: ' + pin);
    console.log('Value: ' + value);

    res.send({
        result: true,
        pin: pin,
        pin00: value[0],
        pin01: value[1],
        pin02: value[2],
        pin03: value[3],
        pin04: value[4],
        pin05: value[5]
    });
});

// LED
router.post('/LED', function(req, res) {
    console.log('LED POST');

    client = main.getClient();
    let msg = req.body.msg;

    switch(msg) {
        // LED ON
        case 'LED2':
            if(client !== 'empty') {
                console.log('LED 02 ON');
                LED_on(2);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED3':
            if(client !== 'empty') {
                console.log('LED 03 ON');
                LED_on(3);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED4':
            if(client !== 'empty') {
                console.log('LED 04 ON');
                LED_on(4);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED5':
            if(client !== 'empty') {
                console.log('LED 05 ON');
                LED_on(5);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED6':
            if(client !== 'empty') {
                console.log('LED 06 ON');
                LED_on(6);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED7':
            if(client !== 'empty') {
                console.log('LED 07 ON');
                LED_on(7);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED8':
            if(client !== 'empty') {
                console.log('LED 08 ON');
                LED_on(8);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED9':
            if(client !== 'empty') {
                console.log('LED 09 ON');
                LED_on(9);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED10':
            if(client !== 'empty') {
                console.log('LED 10 ON');
                LED_on(10);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED11':
            if(client !== 'empty') {
                console.log('LED 11 ON');
                LED_on(11);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED12':
            if(client !== 'empty') {
                console.log('LED 12 ON');
                LED_on(12);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED13':
            if(client !== 'empty') {
                console.log('LED 13 ON');
                LED_on(13);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;

        // LED OFF
        case 'LED2_':
            if(client !== 'empty') {
                console.log('LED 02 OFF');
                LED_off(2);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED3_':
            if(client !== 'empty') {
                console.log('LED 03 OFF');
                LED_off(3);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED4_':
            if(client !== 'empty') {
                console.log('LED 04 OFF');
                LED_off(4);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED5_':
            if(client !== 'empty') {
                console.log('LED 05 OFF');
                LED_off(5);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED6_':
            if(client !== 'empty') {
                console.log('LED 06 OFF');
                LED_off(6);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED7_':
            if(client !== 'empty') {
                console.log('LED 07 OFF');
                LED_off(7);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED8_':
            if(client !== 'empty') {
                console.log('LED 08 OFF');
                LED_off(8);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED9_':
            if(client !== 'empty') {
                console.log('LED 09 OFF');
                LED_off(9);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED10_':
            if(client !== 'empty') {
                console.log('LED 10 OFF');
                LED_off(10);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED11_':
            if(client !== 'empty') {
                console.log('LED 11 OFF');
                LED_off(11);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED12_':
            if(client !== 'empty') {
                console.log('LED 12 OFF');
                LED_off(12);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;
        case 'LED13_':
            if(client !== 'empty') {
                console.log('LED 13 OFF');
                LED_off(13);
            }
            if(client === 'empty') {
                console.log('No connected.');
            }
            break;

    }

    res.send({
        result: true,
        msg: buff
    });
});

module.exports = router;
