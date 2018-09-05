let crypto = require('crypto');
let config = require('./config.js');

// 签名算法
export const XMLSign = function (args) {
    let sign = '';
    let keys = Object.keys(args).sort(), signArgs = {};
    keys.forEach(item => {signArgs[item] = args[item]});
    for(let key in signArgs){
        sign += `&${key}=${signArgs[key]}`
    }
    sign = sign.substr(1) + '&key='+ config.PAY_API_KEY;
    sign = crypto.createHash('md5').update(sign, 'utf8').digest('hex').toUpperCase();

    return sign;
};

