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

const client = new ApolloClient({
    // uri: "http://7e8ea2a8f79e48ccb2e14be502d8d37e.apigw.cn-north-1.huaweicloud.com/graphql",    // 华为云
    // uri:`http://1b56aa4e99084a7693733dc0e26ff49c-cn-shanghai.alicloudapi.com/graphql`,                // 阿里云mongodb
    // uri:`http://1b56aa4e99084a7693733dc0e26ff49c-cn-shanghai.alicloudapi.com/ql`,                     // 阿里云内存db
    // uri:`http://service-cfu0rfii-1257076714.ap-guangzhou.apigateway.myqcloud.com/prepub/graphql`      // 腾讯云
    uri: "http://localhost:8888/graphql"
});

class MainApp extends Component{
    // wechatOauthLogin = () => {
    //     let openid =  getCookie("wechat_openid");
    //     // console.log('wechatOauthLogin',openid);
    //     // console.log('wechatOauthLogin',document.cookie);
    //     if (!openid) {
    //         const state = '/';
    //         const redirectPath = '/bindWechat';
    //
    //         Meteor.call('Wechat.getCode', redirectPath, state, function(err, res) {
    //             if (!err) {
    //                 // console.log('res',res);
    //                 window.location.href = res;
    //             } else {
    //                 message.error(err);
    //             }
    //         });
    //     }
    // };

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
                    </Switch>
                </Router>
            </ApolloProvider>
        )
    }
}

render(<MainApp />, document.getElementById('root'));






