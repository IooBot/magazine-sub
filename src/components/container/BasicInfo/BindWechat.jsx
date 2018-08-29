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
        setCookie("openid","12345",30);
        // console.log('code',code);
        console.log('BindWechat openid',getCookie("openid"));

        // 扫码进入注册或登陆
        // if (code) {
        //     Meteor.call('wechatUserInfo.get', code, function(err,result) {
        //         if (err) {
        //             message.error(err);
        //         } else {
        //             // console.log('openid', result);
        //             if(result){
        //                 setCookie("openid",result,30);
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

