import React, { Component } from 'react';
import { render } from 'react-dom';
import  ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import HomePage from './components/container/HomePage/HomePage.jsx';
import './main.css';

const client = new ApolloClient({
    // uri: `http://1b56aa4e99084a7693733dc0e26ff49c-cn-shanghai.alicloudapi.com/ql`
    uri: `http://192.168.31.56:8888/graphql`
    // uri: `https://nx9zvp49q7.lp.gql.zone/graphql`
});

class MainApp extends Component{

    render(){
        return(
            <ApolloProvider client={client}>
                <Router>
                    <Switch>
                        <Route path="/" exact component={HomePage} />
                    </Switch>
                </Router>
            </ApolloProvider>
        )
    }
}

render(<MainApp />, document.getElementById('root'));






