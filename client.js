var net = require('net');

// net.Socket 인스턴스 생성
var client = net.createConnection(3100, '192.168.0.5');

let count_str = '';
let count_int = 0;

client.on('connect', function onConnect() {
    console.log('onConnect');

    // 연결 성공 시 서버에 임의 데이터 전송
    // this.write('Client OK')
    timer = setInterval(function() {
        // count_str = count_int.toString();
        // client.write(count_str);
        // count_int += 1;
        client.write('Send message.');
    }, 1000);
});

client.on('close', function onClose(had_error) {
    console.log('onClose');
    console.log('had_error :', had_error);
});

client.on('data', function onData(buff) {
    console.log('onData');
    console.log('서버로부터 받은 메시지 :', buff.toString());
});

client.on('drain', function onDrain() {
    console.log('onDrain');
});

client.on('end', function onEnd() {
    console.log('onEnd');
});

client.on('error', function onError(err) {
    console.log('onError');
    console.log(err);
});

client.on('lookup', function onLookup(err, address, family, host) {
    console.log('onLookup');
    console.log('err', err);
    console.log('address', address);
    console.log('family', family);
    console.log('host', host);
});

client.on('timeout', function onTimeout() {
    console.log('onTimeout');
});