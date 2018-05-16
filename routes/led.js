const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('led', { title: 'LED Control' });
});

router.get('/:switch', function(req, res, next) {
    let on_off = req.params.switch;

    if(on_off == 'on') {
        setLED(1);
    } else if(on_off == 'off') {
        setLED(0);
    }

    res.render('led', { title: 'LED Control: ' + req.params.switch });
});

module.exports = router;

function setLED(flag) {
    const fs = require('fs');

    fs.open('/dev/cu.SLAB_USBtoUART', 'a', 666, function(e, fd) {
        fs.write(fd, flag ? '1' : '0', null, null, null, function() {
            fs.close(fd, function() { });
        });
    });
}