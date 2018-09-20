import React, {Component} from 'react';

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import InputItem from 'antd-mobile/lib/input-item/index';
import 'antd-mobile/lib/input-item/style/css';

class InputUserName extends Component{
    constructor(props){
        super(props);

        this.state = {
            username:this.props.username,
        }
    }

    render(){
        let {username} = this.props;

        return(
            <InputItem
                clear
                maxLength="10"
                placeholder="请输入您的姓名"
                defaultValue={username}
                value={this.state.username}
                onChange={value => {
                    this.setState({username:value});
                    if(!value){
                        this.props.getInputContent("username"," ");
                    }else {
                        this.props.getInputContent("username",value);
                    }
                }}
            >
                <Icon type="smile-o" style={{color:'#ff5f16',fontSize:20}}/>&nbsp;&nbsp;&nbsp;&nbsp;姓名
            </InputItem>
        )
    }
}

export default InputUserName;