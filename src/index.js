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
import {setCookie} from "./api/cookie"

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

const graphqlEndpoint = 'http://test.ioobot.com/graphql';
const graphqlUrl = window.location.hostname !== 'localhost' ? window.location.origin+'/graphql' : graphqlEndpoint;

// let uri = getUri(uriArray);
const client = new ApolloClient({
    // uri:uri[0],
    // uri: "http://ebookqqsh.ioobot.com/release/graphql",  // test
    uri: graphqlUrl,  // test
    // uri: "http://chuzhouapi.snbl.com.cn/release/graphql"
    // uri: "http://ebookqqsh.snbl.com.cn/release/graphql"  // snbl
});

export const getIsWechatBrowser = function(){
  let ua = navigator.userAgent.toLowerCase();
  let isWechat = /micromessenger/i.test(ua) || typeof navigator.wxuserAgent !== 'undefined';
  // console.log('isWechat result',isWechat);
  let isWechatBrowser =  isWechat ? true:false;
  // console.log('isWechatBrowser',isWechatBrowser);
  return isWechatBrowser;
};

class MainApp extends Component{
// eslint-disable-next-line
    wechatOauthLogin = () => {
        // setCookie("openid","o2fcFv8x3wy5WtcP116S5GzzkgDQ");
        const openid =  getCookie("openid");
        const isWechatBrowser = getIsWechatBrowser();
        // console.log('openid',openid);
        if (!openid && isWechatBrowser) {
            window.location.href = "/subscribe";
        }else {
          setCookie("openid", "ioobot")
          console.log("ioobot体验号登陆web版本")
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






