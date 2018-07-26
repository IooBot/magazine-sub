import React, {Component} from 'react';

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

import { getCookie } from "../BasicInfo/BindWechat.jsx";
import UserSubConfirm from './UserSubConfirm.jsx';

export default class UserPayPage extends Component{
    // constructor(props){
    //     super(props);
    // }

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
        let openid =  getCookie("wechat_openid") || "12345";
        console.log('openid',openid);
        // let {openid} = this.props;

        let search = this.props.location.search;
        let [a,b,c] = search.split("&");
        let magazineId = a.substr(a.indexOf("=")+1);
        let magazine = b.substr(b.indexOf("=")+1);
        let unitPrice = c.substr(c.indexOf("=")+1);
        let subMagazine = decodeURI(magazine);
        console.log("magazineId",magazineId,'subMagazine',subMagazine,"unitPrice",unitPrice);

        return(
            <div id="userPayPage">
                {this.renderTitle()}
                <UserSubConfirm openid={openid} magazineId={magazineId} subMagazine={subMagazine} unitPrice={unitPrice}/>
            </div>
        )
    }
}
