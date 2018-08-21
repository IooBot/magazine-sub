import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Query,Mutation } from "react-apollo";

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import InputItem from 'antd-mobile/lib/input-item/index';
import 'antd-mobile/lib/input-item/style/css';
import Toast from 'antd-mobile/lib/toast/index';
import 'antd-mobile/lib/toast/style/css';

import './userInput.css';
import {GET_CUSTOMER_BY_OPENID,UPDATE_CUSTOMER} from '../../graphql/customer.js';
import SelectDistrict from './SelectDistrict.jsx';

class UserInput extends Component{
    constructor(props){
        super(props);

        this.state = {
            username:'',
            telephone:'',
            hasError: false
        }
    }

    saveUserInput = (e,username) => {
        // 去除空格
        const username1 = username ? username.replace(/\s/g, "") :'';

        // console.log('saveUserInput',username1,telephone1,schoolArea,school1,gradeClass);

        if(username1){
            // Meteor.call('needInput.insert',this.props.openid,username1);

        }
    };

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
            if(herderContent === '收货信息'){
                updateCustomer({ variables: { openid, telephone: value } });
                // Meteor.call('telephone.insert',this.props.openid,value);
            }
        }
        this.setState({
            telephone:value,
        });
    };

    render(){
        let {type,openid} = this.props;

        let herderContent={'create':'新建收货地址','display':'收货信息','re-edit':'编辑收货地址'}[type] ||'收货信息';
        let saveButtonDisplay ={'create':'visible','display':'hidden','re-edit':'visible'}[type] ||'hidden';

        return(
            <Query
                query={GET_CUSTOMER_BY_OPENID}
                variables={{ openid }}
            >
                {({ loading, error, data }) => {
                    if (loading) return null;
                    if (error) return `Error!: ${error}`;
                    console.log('UserInput data',data);
                    let {username,telephone,area,school,grade} = data.customer;
                    let gradeClass = [grade,data.customer.class];

                    let username1 = this.state.username || username;
                    let telephone1 = this.state.telephone || telephone;

                    return (
                        <Mutation mutation={UPDATE_CUSTOMER}>
                            {(updateCustomer, { loading, error }) => (
                                <div>
                                    <div id="userInput">
                                        <List renderHeader={() => herderContent}>
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
                                                        if(herderContent === '收货信息'){
                                                            updateCustomer({ variables: { openid, username: value } });
                                                            // Meteor.call('username.insert',openid,value);
                                                        }
                                                    }
                                                }}
                                            >
                                                <Icon type="smile-o" style={{color:'#ff5f16',fontSize:20}}/>&nbsp;&nbsp;&nbsp;&nbsp;姓名
                                            </InputItem>
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
                                            <SelectDistrict
                                                herderContent={herderContent}
                                                area={area}
                                                school={school}
                                                gradeClass={gradeClass}
                                                openid={openid}
                                                updateCustomer={updateCustomer}
                                            />
                                        </List>
                                        <div style={{visibility:saveButtonDisplay}}>
                                            <List.Item>
                                                <button className="long-button" onClick={(e)=> this.saveUserInput(e,username1)}>保存</button>
                                            </List.Item>
                                        </div>
                                    </div>
                                    {loading && <p>Loading...</p>}
                                    {error && <p>Error :( Please try again</p>}
                                </div>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        )
    }
}

export default withRouter(UserInput);