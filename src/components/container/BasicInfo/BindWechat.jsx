import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";

import ActivityIndicator from 'antd-mobile/lib/activity-indicator/index';
import 'antd-mobile/lib/activity-indicator/style/css';
// import message from 'antd/lib/message';
// import 'antd/lib/message/style/css';


class BindWechat extends Component {
    // constructor(props){
    //     super(props);
    // }

    componentWillMount() {
        // let codeContent =  location.search.split("&")[0];
        // let code = codeContent.substr(codeContent.indexOf("=")+1);
        // let $this = this;
        setCookie("wechat_openid","1234",30);
        // console.log('code',code);
        console.log('BindWechat openid',getCookie("wechat_openid"));

        // 扫码进入注册或登陆
        // if (code) {
        //     Meteor.call('wechatUserInfo.get', code, function(err,result) {
        //         if (err) {
        //             message.error(err);
        //         } else {
        //             // console.log('wechat_openid', result);
        //             if(result){
        //                 setCookie("wechat_openid",result,30);
        //                 $this.props.history.push("/");
        //             }else {
        //                 message.error('授权登陆失败，请重新进入');
        //             }
        //         }
        //     });
        // } else {
        //     message.error('调用微信接口失败');
        // }
    }
    render() {
        return (
            <ActivityIndicator
                toast
                text="微信登陆中···"
            />
        );
    }
}

BindWechat.propTypes = {
    location: PropTypes.object,
};

export default withRouter(BindWechat);

export function setCookie(name,value,exdays) {
    // expires表示过期时间。如果不设置，默认会话结束即关闭浏览器的时候就消失。
    // 第一步，设置过期时间
    let date = new Date();
    date.setDate(date.getDate()+(exdays*24*60*60*1000));
    document.cookie = name + "=" + value + ";expires=" + date;
    // alert(document.cookie);
}

export function getCookie(key) {
    // 第一步：将字符串转化为数组形式,分割字符串时；后需加空格
    let arrStr = document.cookie.split('; ');
    // 第二步：将数组arrStr中的元素再次切割，转换成数组
    let arrStrLength = arrStr.length;

    for (let i=0;i<arrStrLength;i++){
        let arr = arrStr[i].split('=');
        if(arr[0] === key){
            return arr[1];
        }
    }
    return '';
}

export function removeCookie(key) {
    setCookie(key,"任意值",-1);
}
