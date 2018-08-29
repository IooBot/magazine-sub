import React, {Component} from 'react';

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

import { getCookie } from "../../../api/cookie.js";
import UserSubConfirm from './UserSubConfirm.jsx';

export default class UserPayPage extends Component{

    componentWillMount(){
        document.title = '支付页面'
    }

    renderTitle = () => {
        return(
            <div className="tabBar-top">
                <span onClick={()=>this.props.history.goBack()}>
                    <Icon type="left" />
                </span>
                <span className="title">订阅支付</span>
                <span>
                </span>
            </div>
        )
    };

    render(){
        let openid =  getCookie("wechat_openid");
        // console.log('UserPayPage openid',openid);

        let magazineId = sessionStorage.getItem("magazineId");
        let subMagazine = sessionStorage.getItem("subMagazine");
        let unitPrice = sessionStorage.getItem("unitPrice");
        console.log("magazineId",magazineId,'subMagazine',subMagazine,"unitPrice",unitPrice);

        return(
            <div id="userPayPage">
                {this.renderTitle()}
                <UserSubConfirm openid={openid} magazineId={magazineId} subMagazine={subMagazine} unitPrice={unitPrice}/>
            </div>
        )
    }
}
