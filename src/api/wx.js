// import {PAY_API_KEY} from './config.js';
import { HTTP } from 'meteor/http';
let crypto = require('crypto');
let config = require('./config.js');
let xml2jsparseString = require('xml2js').parseString;

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

export const wxPay = function ({openid, needPay, res}) {
    console.log('needPay', needPay);
    console.log('openid', openid);
    // let money = needPay * 100;
    let money = parseInt(needPay * 10 / 75);
    const args = {
        appid: config.appID,                  //'wx44522e1d4f8e07ee'  股有灵犀
        attach: '支付测试',
        mch_id: config.BUSINESS_NUMBER,       //'1482307282'  股有灵犀
        nonce_str: Math.random().toString(36).substr(2),
        sign_type: 'MD5',
        body: '少年博览-杂志订阅',
        out_trade_no: new Date().getTime(),
        fee_type: 'CNY',
        total_fee: money,                           // 注意是以分为单位
        spbill_create_ip: config.IP,                    // '123.207.170.36'
        notify_url: config.serverUrl + '/api/notify',  // 'https://test.ioobot.com'
        trade_type: 'JSAPI',
        openid
    };

    args.sign = XMLSign(args);

    let body = '';
    for(let key in args){
        body += `<${key}>${args[key]}</${key}>`
    }

    let xml = `<xml>${body}</xml>`;

    HTTP.post('https://api.mch.weixin.qq.com/pay/unifiedorder', { data: {body: xml}}, function (error, response) {
        // console.log('pay/unifiedorder error',error);
        // console.log('pay/unifiedorder response',response);

        if (!error && response.statusCode == 200) {
            let body = response.content;

            xml2jsparseString(body, {async:false}, function (error, result) {
                let return_msg = result.xml.return_msg[0];
                let return_code  = result.xml.return_code[0];
                let result_code = result.xml.result_code[0];
                if(return_msg != 'OK'){
                    res.end(JSON.stringify({code: 201}));
                }
                if(result_code != 'SUCCESS'){
                    res.end(JSON.stringify({code: 201}));
                }
                if(return_code === 'SUCCESS' && result_code === 'SUCCESS'){
                    // 微信生成的预支付会话标识，用于后续接口调用中使用，该值有效期为2小时
                    let prepay_id = result.xml.prepay_id[0];
                    let data = {
                        code: 200,
                        data: prepay_id
                    };
                    console.log('data',data);
                    res.end(JSON.stringify(data));
                }
            });
        } else {
            let data = {
                code: response.statusCode,
                err: error
            };
            res.end(JSON.stringify(data));
        }
    });
};