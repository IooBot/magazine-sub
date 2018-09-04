import React, {Component} from 'react';

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import InputItem from 'antd-mobile/lib/input-item/index';
import 'antd-mobile/lib/input-item/style/css';

class InputUserName extends Component{
    constructor(props){
        super(props);

        this.state = {
            username:'',
        }
    }

    render(){
        // eslint-disable-next-line
        let {herderContent,updateCustomer,openid,username} = this.props;
        let username1 = this.state.username || username;
        return(
            <InputItem
                    placeholder="请输入您的姓名"
                    value={username1}
                    onChange={value => {
                        if(value){
                            this.setState({username:value});
                        }
                    }}
                    onBlur={value => {
                        if(value){
                            this.setState({username:value});
                            if(herderContent === '收货地址'){
                                updateCustomer({ variables: { openid, username: value } });
                            }else {
                                this.props.getInputContent("username",username1)
                            }
                        }
                    }}
                >
                    <Icon type="smile-o" style={{color:'#ff5f16',fontSize:20}}/>&nbsp;&nbsp;&nbsp;&nbsp;姓名
                </InputItem>
        )
    }
}

export default InputUserName;