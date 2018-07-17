import React, {Component} from 'react';

import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/css';
import Avatar from 'antd/lib/avatar';
import 'antd/lib/avatar/style/css';

import './userInfoPage.css';
import UserInput from './UserInput.jsx';

export default class UserInfoPage extends Component{

    render(){
        let { loading,wechatInfo,openid } = this.props;
        if(loading){
            let contentHeight = window.innerHeight - 138.5;
            return<div style={{width:'100%',height:contentHeight}}>
                <Spin style={{
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)'
                }}/>
            </div>
        }
        return(
            <div id="userInfoPage">
                <div className="user-info">
                    <Avatar src={wechatInfo.headimgurl} size="large" />
                    <p>{wechatInfo.nickname}</p>
                </div>
                <UserInput type="display" openid={openid}/>
            </div>
        )
    }
}

UserInfoPage.defaultProps = {
    wechatInfo: { nickname:'',headimgurl:''},
    loading:false
};
