import React, { Component } from 'react';
import { render } from 'react-dom';
import  ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import HomePage from './components/container/HomePage/HomePage.jsx';
import BindWechat from './components/container/BasicInfo/BindWechat.jsx';
import UserInputPage from "./components/container/UserPage/UserInputPage.jsx";
import UserPayPage from "./components/container/UserPage/UserPayPage.jsx";
import './main.css';
import UserSubPage from "./components/container/UserPage/UserSubPage.jsx";

import { getCookie } from './components/container/BasicInfo/BindWechat.jsx';
import {appID} from './api/config.js';
// const config = require('./config.js');

// eslint-disable-next-line
const uriArray = [`http://1b56aa4e99084a7693733dc0e26ff49c-cn-shanghai.alicloudapi.com/graphql`,
    `http://20932081b4dd4c40b93693520609c6c1-cn-hangzhou.alicloudapi.com/graphql`,
    `http://76cb2dce45334f819c1889bbdb837f60-cn-shenzhen.alicloudapi.com/graphql`,
    `http://service-ci2tk8iu-1254337200.ap-guangzhou.apigateway.myqcloud.com/prepub/graphql`,
    `http://service-4v33t8cn-1254337200.ap-shanghai.apigateway.myqcloud.com/prepub/graphql`,
    "https://7e8ea2a8f79e48ccb2e14be502d8d37e.apigw.cn-north-1.huaweicloud.com/gql"
];

// eslint-disable-next-line
function getUri(arr) {
    // uriArray随机排序
    // uriArray.sort((a,b)=>{return Math.random()>0.5 ? -1 : 1});       // 此方法并不能完全随机

    let i = arr.length;
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    // console.log('uriArray',arr);
    return arr;
}

// let uri = getUri(uriArray);
// console.log('uri:',uri[0]);
const client = new ApolloClient({
    // uri:uri[0],

    // uri:`http://1b56aa4e99084a7693733dc0e26ff49c-cn-shanghai.alicloudapi.com/graphql`,                // 阿里云mongodb上海
    // uri:`http://20932081b4dd4c40b93693520609c6c1-cn-hangzhou.alicloudapi.com/graphql`,                // 阿里云mongodb杭州
    // uri:`http://76cb2dce45334f819c1889bbdb837f60-cn-shenzhen.alicloudapi.com/graphql`,                // 阿里云mongodb深圳

    uri:`http://service-g5r3bclr-1254337200.ap-beijing.apigateway.myqcloud.com/prepub/graphql`        // 腾讯云北京
    // uri:`http://service-4v33t8cn-1254337200.ap-shanghai.apigateway.myqcloud.com/prepub/graphql`        // 腾讯云上海
    // uri:`http://service-ci2tk8iu-1254337200.ap-guangzhou.apigateway.myqcloud.com/prepub/graphql`       // 腾讯云广州

    // uri: "https://7e8ea2a8f79e48ccb2e14be502d8d37e.apigw.cn-north-1.huaweicloud.com/gql",     // 华为云北京 1 min
    // uri: "https://9a6ce86a69f849ab99fe5e803339d904.apigw.cn-south-1.huaweicloud.com/graphql",    // 华为云广州

    // uri: "http://localhost:8888/graphql"
});

// eslint-disable-next-line
/*function getGraphqlUri() {
    // 固定uri数组，产生随机数获取uri
    let index = Math.floor((Math.random()*6));
    return uriArray[index];
}*/

class MainApp extends Component{

    wechatOauthLogin = () => {
        let openid =  getCookie("wechat_openid");
        // console.log('wechatOauthLogin',openid);
        // console.log('wechatOauthLogin',document.cookie);
        if (!openid) {
            const uri = document.location.href;
            const query = uri.query(true);
            const {code} = query;

            if(code) {

            } else {
                function generateGetCodeUrl(redirectURL) {
                    const state = '/';
                    // const redirectPath = '/bindWechat';
                    // let redirect_uri = encodeURIComponent(`${serverUrl}${redirectPath}`);
                    let redirect_uri = encodeURIComponent(redirectURL);
                    let state1 = encodeURIComponent(state);
                    // 公众号登录授权
                    const routing = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}`
                        + `&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state1}#wechat_redirect`;
                    return routing;
                }

                document.location = generateGetCodeUrl(document.location.href);
            }

            // const state = '/';
            // const redirectPath = '/bindWechat';
            //
            // Meteor.call('Wechat.getCode', redirectPath, state, function(err, res) {
            //     if (!err) {
            //         // console.log('res',res);
            //         window.location.href = res;
            //     } else {
            //         message.error(err);
            //     }
            // });
        }
    };

    render(){
        return(
            <ApolloProvider client={client}>
                <Router>
                    <Switch>
                        <Route exact path="/" render={() => {
                            // this.wechatOauthLogin();
                            return <HomePage />;
                        } } />
                        <Route path = '/bindWechat'  component = { BindWechat }/>
                        <Route path = '/address'  component = { UserInputPage }/>
                        <Route path = '/pay'  component = { UserPayPage }/>
                        <Route path = '/test'  component = { UserSubPage }/>
                    </Switch>
                </Router>
            </ApolloProvider>
        )
    }
}

render(<MainApp />, document.getElementById('root'));






