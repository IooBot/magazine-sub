import React, {Component} from 'react';

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import Toast from 'antd-mobile/lib/toast/index';
import 'antd-mobile/lib/toast/style/css';
import InputItem from 'antd-mobile/lib/input-item/index';
import 'antd-mobile/lib/input-item/style/css';

class InputTelephone extends Component{
    constructor(props){
        super(props);

        this.state = {
            telephone:'',
            hasError: false
        }
    }

    onErrorClick = () => {
        if (this.state.hasError) {
            Toast.info('请输入11位有效手机号码！');
        }
    };

    onChange = (value,updateCustomer,openid,herderContent) => {
        // console.log('herderContent',herderContent);
        if (value.replace(/\s/g, '').length < 11) {
            this.setState({
                hasError: true,
            });
        } else {
            this.setState({
                hasError: false,
            });
            // console.log('value1',this.state.telephone);
            if(herderContent === '收货地址'){
                updateCustomer({ variables: { openid, telephone: value }});
            }else {
                this.props.getInputContent("telephone",value);
            }
        }
        this.setState({
            telephone:value,
        });
    };

    render(){
        // eslint-disable-next-line
        let {herderContent,updateCustomer,openid,telephone} = this.props;
        let telephone1 = this.state.telephone || telephone;
        return(
            <InputItem
                    type="phone"
                    placeholder="请输入您的手机号码"
                    error={this.state.hasError}
                    onErrorClick={this.onErrorClick}
                    onChange={(value)=>this.onChange(value,updateCustomer,openid,herderContent)}
                    value={telephone1}
                >
                    <Icon type="phone" style={{color:'#ff5f16',fontSize:20}}/>&nbsp;&nbsp;&nbsp;&nbsp;手机号码
                </InputItem>
        );
    }
}

export default InputTelephone;