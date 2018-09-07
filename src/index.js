import React, { Component } from 'react';
import { render } from 'react-dom';
import  ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import HomePage from './components/container/HomePage/HomePage.jsx';
import UserInputPage from "./components/container/UserPage/UserInputPage.jsx";
import UserPayPage from "./components/container/UserPage/UserPayPage.jsx";
import './main.css';

import { getCookie } from './api/cookie.js';

// eslint-disable-next-line
const uriArray = [
    "http://ebookqqbj.ioobot.com/prepub/graphql",
    "http://ebookqqsh.ioobot.com/prepub/graphql"
];

// eslint-disable-next-line
function getUri(arr) {
    // uriArray随机排序
    let i = arr.length;
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    // console.log('uriArray',arr);
    return arr;
}

let uri = getUri(uriArray);
// console.log('uri:',uri[0]);
const client = new ApolloClient({
    uri:uri[0],
    // uri:`http://1b56aa4e99084a7693733dc0e26ff49c-cn-shanghai.alicloudapi.com/graphql`,                // 阿里云mongodb上海
    // uri:`http://20932081b4dd4c40b93693520609c6c1-cn-hangzhou.alicloudapi.com/graphql`,                // 阿里云mongodb杭州
    // uri:`http://76cb2dce45334f819c1889bbdb837f60-cn-shenzhen.alicloudapi.com/graphql`,                // 阿里云mongodb深圳

    // uri:`http://service-g5r3bclr-1254337200.ap-beijing.apigateway.myqcloud.com/prepub/graphql`        // 腾讯云北京
    // uri:`http://ebookqqbj.ioobot.com/prepub/graphql`        // 腾讯云北京
    // uri:`http://service-4v33t8cn-1254337200.ap-shanghai.apigateway.myqcloud.com/prepub/graphql`        // 腾讯云上海
    // uri:`http://service-ci2tk8iu-1254337200.ap-guangzhou.apigateway.myqcloud.com/prepub/graphql`       // 腾讯云广州

    // uri: "https://7e8ea2a8f79e48ccb2e14be502d8d37e.apigw.cn-north-1.huaweicloud.com/gql",     // 华为云北京 1 min
    // uri: "https://9a6ce86a69f849ab99fe5e803339d904.apigw.cn-south-1.huaweicloud.com/graphql",    // 华为云广州

    // uri: "http://localhost:8888/graphql"
    // uri: "http://2026f31d.ngrok.io/graphql",
});

class MainApp extends Component{
// eslint-disable-next-line
    wechatOauthLogin = () => {
        let openid =  getCookie("openid");
        if (!openid) {
            // window.location.href = "http://test.ioobot.com/subscribe";
            window.location.href = "http://wechathf.snbl.com.cn/subscribe";
        }
    };

    render(){
        return(
            <ApolloProvider client={client}>
                <Router>
                    <Switch>
                        <Route exact path="/" render={() => {
                            this.wechatOauthLogin();
                            return <HomePage />;
                        } } />
                        <Route path = '/address'  component = { UserInputPage }/>
                        <Route path = '/pay'  component = { UserPayPage }/>
                    </Switch>
                </Router>
            </ApolloProvider>
        )
    }
}

render(<MainApp />, document.getElementById('root'));






