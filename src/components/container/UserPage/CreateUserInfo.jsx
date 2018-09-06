import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";

import message from 'antd/lib/message';
import 'antd/lib/message/style/css';
import Toast from 'antd-mobile/lib/toast/index';
import 'antd-mobile/lib/toast/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import 'antd-mobile/lib/input-item/style/css';

import './userInput.css';
import {CREATE_CUSTOMER,UPDATE_CUSTOMER,GET_CUSTOMER_BY_OPENID} from '../../graphql/customer.js';
import SelectDistrict from './SelectDistrict.jsx';
import InputUserName from './InputUserName.jsx';
import InputTelephone from './InputTelephone.jsx';

class CreateUserInfo extends Component{
    constructor(props){
        super(props);

        this.state = {
            area_name: "",
            gradeClass: "",
            school_name:"",
            telephone: "",
            username: ""
        }
    }

    saveUserInput = (e,openid,updateCustomer) => {
        let {username,telephone,area,school,gradeClass} = this.props;

        let area_name = this.state.area_name || area["name"];
        let telephone1 = this.state.telephone || telephone;
        let school_name = this.state.school_name || school["name"];
        let username1 = this.state.username || username;
        let gradeClass1 = this.state.gradeClass || gradeClass;
        // 去除空格
        const username2 = username1 ? username1.replace(/\s/g, "") :'';
        const telephone2 = telephone1 ? telephone1.replace(/\s/g, "") :'';

        // console.log('saveUserInput',username2,telephone2,area_name,school_name,gradeClass1);

        if(username2 && telephone2.length === 11 && school_name && area_name && gradeClass1){
            // console.log("grade",gradeClass1[0],"class",gradeClass1[1]);
            updateCustomer({ variables:{area_name,class:gradeClass1[1],grade:gradeClass1[0],openid,school_name,telephone:telephone2,username:username2 }});

            sessionStorage.setItem("userExists",true);
            this.props.history.push("/pay");

        }else if(!username1){
            Toast.info('请输入姓名！');
        }else if(telephone1.length < 11){
            Toast.info('请输入11位有效手机号码！');
        }else if(!area_name){
            Toast.info('请选择所在学校所在地区！');
        }else if(!school_name){
            Toast.info('请选择所在学校！');
        }else if(!gradeClass){
            Toast.info('请选择班级-年级！');
        }else {
            message.warning('收货地址还未完善');
        }
    };

    getInputContent = (item,value) => {
        this.setState({
            [item]:value
        });
    };

    render(){
        let {type,openid,username,telephone,area,school,gradeClass} = this.props;

        let herderContent={'create':'新建收货地址','display':'收货地址','re-edit':'编辑收货地址'}[type] ||'收货地址';
        let saveButtonDisplay ={'create':'visible','display':'hidden','re-edit':'visible'}[type] ||'hidden';

        return(
            <Mutation mutation={type === 'create' ? CREATE_CUSTOMER:UPDATE_CUSTOMER}
                      refetchQueries={[{query:GET_CUSTOMER_BY_OPENID, variables:{openid}}]}
            >
                {(updateCustomer, { loading, error }) => (
                    <div>
                        <div id="userInput">
                            <List renderHeader={() => herderContent}>
                                <InputUserName
                                    herderContent={herderContent}
                                    openid={openid}
                                    username={username}
                                    updateCustomer={updateCustomer}
                                    getInputContent={this.getInputContent}
                                />
                                <InputTelephone
                                    herderContent={herderContent}
                                    openid={openid}
                                    telephone={telephone}
                                    updateCustomer={updateCustomer}
                                    getInputContent={this.getInputContent}
                                />
                                <SelectDistrict
                                    herderContent={herderContent}
                                    area={area}
                                    school={school}
                                    gradeClass={gradeClass}
                                    openid={openid}
                                    updateCustomer={updateCustomer}
                                    getInputContent={this.getInputContent}
                                />
                            </List>
                            <div style={{visibility:saveButtonDisplay}}>
                                <List.Item>
                                    <button className="long-button" onClick={(e)=> this.saveUserInput(e,openid,updateCustomer)}>保存</button>
                                </List.Item>
                            </div>
                        </div>
                        {/*{loading && <p>Loading...</p>}*/}
                        {/*{error && <p>Error :( Please try again</p>}*/}
                    </div>
                )}
            </Mutation>
        );
    }
}

export default withRouter(CreateUserInfo);