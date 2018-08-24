import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import TabBar from 'antd-mobile/lib/tab-bar/index';
import 'antd-mobile/lib/tab-bar/style/css';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

import SubPage from '../SubPage/SubPage.jsx';
import UserPage from '../UserPage/UserPage.jsx';
import {setCookie} from "../BasicInfo/BindWechat.jsx";

export default class HomePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            title:'订阅'
        }
    }

    componentWillMount(){
        document.title = '少年博览';
        // console.log('location.hash', location.hash.replace(/[^0-9]/ig,""));
        let index = window.location.hash.replace(/[^0-9]/ig,"").substr(0,1);
        let name={1:'订阅',2:'我的',}[index] ||'订阅';
        this.setState({
            title: name
        });
    }

    changeTab =(name)=>{
        this.setState({
            title: name
        });
    };

    getHash = () => {
        let hash = window.location.hash || '#index=1&tab=0';
        let index = '1',tab = '0';
        if(window.location.hash && hash.indexOf("&")>0){
            let indexHash = hash.split("&")[0], tabHash = hash.split("&")[1];
            index = indexHash.substr(indexHash.indexOf("=")+1);
            tab = tabHash.substr(tabHash.indexOf("=")+1);
        }
        return {
            index,
            tab
        }
    };

    renderTitle = () => {
        let {index} = this.getHash();
        let title = index === '1' ? '订阅':'我的';
        let isAdmin = this.props.isAdminInfo.isAdmin;

        return(
            <div className="tabBar-top">
                <span>
                </span>
                <span className="title">{title}</span>
                <span>
                    {index === '1' && isAdmin ?
                        <Link to={{pathname: '/admin' ,state: { isAdmin: isAdmin }}}>
                            订单统计
                            <Icon type="right" /></Link>:''
                    }
                </span>
            </div>
        )
    };

    render(){
        let {index,tab}  = this.getHash();
        // let openid =  getCookie("wechat_openid");
        // let openid =  '12345';
        let openid =  'o2fcFv8x3wy5WtcP116S5GzzkgDQ';
        setCookie("wechat_openid",openid);

        return(
            <div id="homePage">
                {this.renderTitle()}
                <TabBar tintColor="#ff5f16">
                    <TabBar.Item title="订阅" key="subscribe"
                                 onPress={() => {this.changeTab("订阅");window.location.hash = 'index=1'}}
                                 icon={<Icon type="home" />} selectedIcon={<Icon type="home" style={{color: '#ff5f16'}}/>}
                                 selected={index === "1"}>
                        <SubPage openid={openid} />
                    </TabBar.Item>
                    <TabBar.Item title="我的" key="person"
                                 onPress={() => {this.changeTab("我的");window.location.hash = `index=2&tab=${tab}`}}
                                 icon={<Icon type="user" />} selectedIcon={<Icon type="user" style={{color: '#ff5f16'}}/>}
                                 selected={index === "2"}>
                        <UserPage openid={openid} changeTab={()=>this.changeTab()}/>
                    </TabBar.Item>
                </TabBar>
            </div>
        )
    }
}

HomePage.defaultProps = {
    isAdminInfo:{isAdmin:false}
};

