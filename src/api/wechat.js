import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { wechatUser } from './wechatUser.js';
const config = require('./config.js');

export const wechat = new Mongo.Collection('wechat');  // 微信相关集合

Meteor.startup(() => {
    if (Meteor.isServer) {
        Meteor.publish('wechat', function () {
            return wechat.find({});
        });
    }
});

function getCodeAccessToken(code) {
    let appId = config.appID;
    let appSecret = config.appsecret;

    const getAccess_tokenUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token'
        + `?appid=${appId}&secret=${appSecret}&code=${code}&grant_type=authorization_code`;
    try {
        const codeGetResult = HTTP.get(getAccess_tokenUrl);
        // console.log('getCodeAccessToken result',openIdResult);
        const result = JSON.parse(codeGetResult.content);
        let { openid,access_token } = result;

        return {
            openid,
            access_token
        };
    } catch (e) {
        return e;
    }
}

Meteor.methods({
    'Wechat.getCode'(redirectPath, state) {
        let redirect_uri = encodeURIComponent(`${config.serverUrl}${redirectPath}`);
        let state1 = encodeURIComponent(state);
        // 公众号登录授权
        const routing = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appID}`
            + `&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state1}#wechat_redirect`;

        return routing;
    },

    'wechatUserInfo.get'(code) {
        let {openid,access_token} = getCodeAccessToken(code);

        if(openid && access_token){
            const getProfileRequestUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;

            try {
                const profileReqResult = HTTP.get(getProfileRequestUrl);
                const profileContent = JSON.parse(profileReqResult.content);
                console.log('profileContent',profileContent);

                let createAt = new Date();
                let {nickname,sex,language,city,province,country,headimgurl} = profileContent;
                const wechatInfo = {nickname,sex,language,city,province,country,headimgurl};

                // 授权登陆进入网页即添加用户信息，关注公众号后才添加wechatSub:true
                wechatUser.update({openid:openid},{$set:{wechatInfo:wechatInfo,subTime:createAt}},{upsert:true});
                console.log('wechatUserInfo.get result',openid);
                return openid;

            } catch (e) {
                // Got a network error, timeout, or HTTP error in the 400 or 500 range.
                return e;
            }
        }
    }
});