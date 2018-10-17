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
    "http://ebookqqbj.ioobot.com/release/graphql",
    "http://ebookqqsh.ioobot.com/release/graphql"
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

// let uri = getUri(uriArray);
const client = new ApolloClient({
    // uri:uri[0],
    // uri: "http://aliqlsh.ioobot.com/graphql"
    uri: "http://ebookqqsh.ioobot.com/release/graphql"
    // uri: "http://ebookqqsh.snbl.com.cn/release/graphql"
    // uri: "http://localhost:8888/graphql"
    // uri: "http://2026f31d.ngrok.io/graphql",
});

class MainApp extends Component{
// eslint-disable-next-line
    wechatOauthLogin = () => {
        // setCookie("openid","o2fcFv8x3wy5WtcP116S5GzzkgDQ");
        let openid =  getCookie("openid");
        // console.log('openid',openid);
        if (!openid) {
            window.location.href = "http://test.ioobot.com/subscribe";
            // window.location.href = "http://wechathf.snbl.com.cn/subscribe";
            // window.location.href = "http://snbl.ioobot.com/subscribe";
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
                        }}/>
                        <Route path = '/address'  component = { UserInputPage }/>
                        <Route path = '/pay'  component = { UserPayPage }/>
                    </Switch>
                </Router>
            </ApolloProvider>
        )
    }
}

render(<MainApp />, document.getElementById('root'));






