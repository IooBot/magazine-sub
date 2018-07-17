import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import { Link } from "react-router-dom";

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

// import UserInput from './UserInput.jsx';

export default class UserInputPage extends Component{
    // constructor(props){
    //     super(props);
    //
    // }

    componentWillMount(){
        document.title = '地址信息'
    }

    renderTitle = () => {
        return(
            <div className="tabBar-top">
                <span onClick={()=>this.props.history.goBack()}>
                    <Icon type="left" />
                </span>
                <span className="title">地址信息</span>
                <span>
                </span>
            </div>
        )
    };

    render(){
        // let {openid,inputInfo} = this.props;
        // let model1Type = inputInfo ? "re-edit" : "create";

        return(
            <div id="userInputPage">
                {this.renderTitle()}
                {/*<UserInput type={model1Type} openid={openid} />*/}
            </div>

        )
    }
}

// export default createContainer(()=>{
//     // console.log('SubPage openid',openid);
//     let openid =  getCookie("wechat_openid");
//     let inputInfo = Meteor.subscribe('wechatUser.inputInfo',openid);
//
//     if(inputInfo.ready()){
//
//         let wxInput = wechatUser.findOne({openid:openid});
//         let {inputInfo=false} = wxInput;
//
//         // console.log('inputInfo',inputInfo);
//         return {
//             openid,
//             inputInfo
//         };
//     }
//
//     return {
//         loading: false
//     }
//
// },(UserInputPage));
