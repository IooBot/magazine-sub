import React, {Component} from 'react';
import { Query  } from "react-apollo";

import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/css';
import TabBar from 'antd-mobile/lib/tab-bar/index';
import 'antd-mobile/lib/tab-bar/style/css';
import Toast from 'antd-mobile/lib/toast/index';
import 'antd-mobile/lib/toast/style/css';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

import SubPage from '../SubPage/SubPage.jsx';
import UserPage from '../UserPage/UserPage.jsx';
import {getCookie} from "../../../api/cookie.js";
import {GET_MAIN_PAGE} from '../../graphql/slideshow.js';

export default class HomePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            title:'订阅',
            getUser:false
        }
    }

    componentWillMount(){
        document.title = '少年博览';
        let index = window.location.hash.replace(/[^0-9]/ig,"").substr(0,1);
        let name={1:'订阅',2:'我的',}[index] ||'订阅';
        this.setState({
            title: name
        });
        if(name === '我的'){
            this.setState({
                getUser: true
            });
        }
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

        return(
            <div className="tabBar-top">
                <span> </span>
                <span className="title">{title}</span>
                <span> </span>
            </div>
        )
    };

    render(){
        let {index,tab}  = this.getHash();
        let openid =  getCookie("openid");
        let contentHeight = window.innerHeight - 95;

        return(
            <div id="homePage">
                {this.renderTitle()}
                <TabBar tintColor="#ff5f16">
                    <TabBar.Item title="订阅" key="subscribe"
                                 onPress={() => {this.changeTab("订阅");window.location.hash = 'index=1'}}
                                 icon={<Icon type="home" />} selectedIcon={<Icon type="home" style={{color: '#ff5f16'}}/>}
                                 selected={index === "1"}>
                        <Query query={GET_MAIN_PAGE} variables={{openid}}>
                            {({ loading, error, data }) => {
                                // console.log('data',data);
                                if (loading) return <Loading contentHeight={contentHeight}/>;
                                if (error) return <RenderToast content="网络缓慢，请稍后再试!!!"/>;
                                return  <SubPage openid={openid} slideshow={data.slideshow} magazineList={data.magazineList} user={data.user}/>
                            }}
                        </Query>
                    </TabBar.Item>
                    <TabBar.Item title="我的" key="person"
                                 onPress={() => {
                                     this.changeTab("我的");
                                     this.setState({getUser:true});
                                     window.location.hash = `index=2&tab=${tab}`}}
                                 icon={<Icon type="user" />} selectedIcon={<Icon type="user" style={{color:'#ff5f16'}}/>}
                                 selected={index === "2"}>
                        {this.state.getUser ? <UserPage openid={openid} changeTab={()=>this.changeTab()}/>:''}
                    </TabBar.Item>
                </TabBar>
            </div>
        )
    }
}

export const RenderToast = ({content}) => (<div>{Toast.offline(content,5)}</div>);
export const Loading = ({contentHeight}) => (
    <div style={{width:'100%',height:contentHeight}}>
        <Spin
            tip="数据加载中..."
            style={{
                position: 'relative',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)'
            }}/>
    </div>
    );