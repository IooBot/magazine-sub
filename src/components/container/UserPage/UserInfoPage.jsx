import React, {Component} from 'react';

// import Spin from 'antd/lib/spin';
// import 'antd/lib/spin/style/css';
// import Avatar from 'antd/lib/avatar';
// import 'antd/lib/avatar/style/css';

import './userInfoPage.css';
import UserInput from './UserInput.jsx';

export default class UserInfoPage extends Component{

    render(){
        let { openid } = this.props;

        return(
            <div id="userInfoPage">
                {/*<div className="user-info">*/}
                    {/*<Avatar src={wechatInfo.headimgurl} size="large" />*/}
                    {/*<p>{wechatInfo.nickname}</p>*/}
                {/*</div>*/}
                <UserInput type="display" openid={openid} changeTab={this.props.changeTab}/>
            </div>
        )
    }
}
//
// UserInfoPage.defaultProps = {
//     wechatInfo: { nickname:'',headimgurl:''},
// };
