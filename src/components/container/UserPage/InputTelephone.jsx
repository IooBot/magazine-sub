import React, {Component} from 'react';

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import InputItem from 'antd-mobile/lib/input-item/index';
import 'antd-mobile/lib/input-item/style/css';

class InputTelephone extends Component{
    constructor(props){
        super(props);

        this.state = {
            telephone:this.props.telephone
        }
    }

    render(){
        let {telephone} = this.props;

        return(
            <InputItem
                clear
                type="phone"
                placeholder="请输入您的手机号码"
                defaultValue={telephone}
                value={this.state.telephone}
                onChange={value => {
                    this.setState({telephone:value});
                    if(!value){
                        this.props.getInputContent("telephone"," ");
                    }else {
                        this.props.getInputContent("telephone",value);
                    }
                }}
            >
                <Icon type="phone" style={{color:'#ff5f16',fontSize:20}}/>&nbsp;&nbsp;&nbsp;&nbsp;手机号码
            </InputItem>
        );
    }
}

export default InputTelephone;