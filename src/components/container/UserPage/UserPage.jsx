import React, {Component} from 'react';

import UserSubPage from './UserSubPage.jsx';
import UserNotPaid from './UserNotPaid.jsx';
import UserInfoPage from './UserInfoPage.jsx';

import './userPage.css';

export default class UserPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            tab:'0'
        }
    }

    componentWillMount(){
        let hash = window.location.hash || '#index=2&tab=0';
        let tab = '0';
        if(window.location.hash && hash.indexOf("&")>0){
            let tabHash = hash.split("&")[1];
            tab = tabHash.substr(tabHash.indexOf("=")+1);
        }
        this.setState({
            tab:tab
        });
    }

    componentWillReceiveProps(){
        let hash = window.location.hash || '#index=2&tab=0';
        let tab = '0';
        if(window.location.hash && hash.indexOf("&")>0){
            let tabHash = hash.split("&")[1];
            tab = tabHash.substr(tabHash.indexOf("=")+1);
        }
        this.setState({
            tab:tab
        });
    }

    render(){
        let contentHeight = window.innerHeight - 138.5;
        let {openid,magazineList,changeTab} = this.props;
        let tab = this.state.tab;

        let content;
        // eslint-disable-next-line
        switch(tab){
            case '0':
                content =  <UserSubPage openid={openid} changeTab={changeTab} magazineList={magazineList}/>;
                break;
            case '1':
                content =  <UserNotPaid openid={openid} changeTab={changeTab}/>;
                break;
            case '2':
                content =  <UserInfoPage openid={openid} changeTab={changeTab}/>;
                break;
        }
        return(
            <div id="userPage">
                <div className="tab-top">
                    <span className={tab === "0"?"active":""} onClick={() => {this.setState({tab: "0"}); window.location.hash = "index=2&tab=0"}}>
                        已订阅
                    </span>
                    <span className={tab === "1"?"active":""} onClick={() => {this.setState({tab: "1"}); window.location.hash = "index=2&tab=1"}}>
                        未支付
                    </span>
                    <span className={tab === "2"?"active":""} onClick={() => {this.setState({tab: "2"}); window.location.hash = "index=2&tab=2"}}>
                        个人中心
                    </span>
                </div>
                <div className="scroll-content" style={{height: contentHeight}}>
                    {content}
                </div>
            </div>
        )
    }
}