exports.writeLog = function(log) {
    const fs = require('fs');

    const read_data = fs.readFileSync('test.txt', 'utf8');
    console.log(read_data);

    fs.writeFileSync('test.txt', read_data + log + '\n', 'utf8');
    console.log('writeFileSync completed');
};
