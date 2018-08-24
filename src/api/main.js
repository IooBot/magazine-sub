import { Meteor } from 'meteor/meteor';

let wxService = require('./wx.js');
let bodyParser = require('body-parser');

Meteor.startup(() => {

    if (Meteor.isServer) {

        // Global API configuration
        const Api = new Restivus({
            prettyJson: true
        });

        // 修改以满足xml请求
        JsonRoutes.Middleware.use(bodyParser.json());
        JsonRoutes.Middleware.use(bodyParser.urlencoded({ extended: false }));

        // Enable incoming XML requests for creditReferral route
        JsonRoutes.Middleware.use(bodyParser.raw({
            type: '*/*',
            verify: function(req, res, body) {
                // console.log('req1',req);
                // console.log('body',body);
                // console.log('body.toString()',body.toString());
                req.rawBody = body.toString();
                // console.log('req.rawBody2',req.rawBody);
            }
        }));

        // 判断token是否有效，无效则更新token
        wxService.getAccessToken();

        // Maps to: /api/wechat
        Api.addRoute('wechat',{
            get: function () {
                // console.log("urlparams: ", this.urlParams);
                console.log("queryParams: ", this.queryParams);
                // console.log("bodyParams: ", this.bodyParams);

                let {signature,echostr,timestamp,nonce} = this.queryParams;
                let result = wxService.checkToken(nonce, timestamp, signature, echostr);

                // console.log('res',this.response);
                // console.log('req', this.request);
                this.response.end(result);
                console.log('check-result', result);

                // Must call this immediately before return!
                this.done();
            },

            post:function() {
                // console.log('this.request.rawBody',this.request.rawBody);
                let result1= xml2js.parseStringSync(this.request.rawBody, { explicitArray : false, ignoreAttrs : true });
                // console.log('result1',result1);

                let message = result1.xml;
                console.log('wechat result',message);
                if (message.Event === 'subscribe'|| message.Event === 'unsubscribe') {
                    wxService.reply(message,this.request,this.response);
                }else {
                    this.response.end('');
                }

                // Must call this immediately before return!
                this.done();
            }
        });

        // Maps to: /api/notify
        Api.addRoute('notify', {
            post:function () {
                console.log('获取支付状态');
                return `<xml>
                  <return_code><![CDATA[SUCCESS]]></return_code>
                  <return_msg><![CDATA[OK]]></return_msg>
                </xml>`;
            }
        });

        // Maps to: /api/wxPay
        Api.addRoute('wxPay', {
            get: function () {
                let {needPay, openid} = this.queryParams;
                console.log('this.queryParams',this.queryParams);
                let getId = wxService.wxPay.bind(null, {openid, needPay, res: this.response});
                let test = Meteor.wrapAsync(getId);
                test();
            }
        });

    }
});
