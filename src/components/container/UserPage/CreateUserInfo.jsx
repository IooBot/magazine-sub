import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import moment from 'moment';

import message from 'antd/lib/message';
import 'antd/lib/message/style/css';
import Toast from 'antd-mobile/lib/toast/index';
import 'antd-mobile/lib/toast/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import 'antd-mobile/lib/input-item/style/css';

import './userInput.css';
import {CREATE_CUSTOMER,UPDATE_CUSTOMER,GET_CUSTOMER_BY_OPENID} from '../../graphql/customer.js';
import {RenderToast,Loading}  from "../HomePage/HomePage";
import {sendError} from "./UserSubConfirm.jsx";
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
            username: "",
            areaArr: "",
            schoolArr: ""
        }
    }

    saveUserInput = (e,openid,mutate) => {
        let {username,telephone,area,school,gradeClass,type} = this.props;

        let area_name = this.state.area_name || area["name"];
        let telephone1 = this.state.telephone || telephone;
        let school_name = this.state.school_name || school["name"];
        let username1 = this.state.username || username;
        let gradeClass1 = this.state.gradeClass || gradeClass;

        const school_name1 = school_name ? school_name.replace(/\s/g, "") :'';
        const username2 = username1 ? username1.replace(/\s/g, "") :'';
        const telephone2 = telephone1 ? telephone1.replace(/\s/g, "") :'';
        const testPhoneNum = /^1[0-9]{10}$/;
        let isPoneAvailable = testPhoneNum.test(telephone2);

        if(username2 && isPoneAvailable && school_name1 && area_name && gradeClass1){
            let nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
            sessionStorage.setItem("userExists",true);
            let {areaArr,schoolArr} = this.state;
            let updateContent = {
                __typename: "Customer",
                area:{
                    city:areaArr[1] || area["city"],
                    district:areaArr[2] || area["district"],
                    province:areaArr[0] || area["province"],
                    name:area_name,
                    __typename:"Area"
                },
                class:gradeClass1[1],
                grade:gradeClass1[0],
                openid:openid,
                school:{
                    name:school_name,
                    type:schoolArr[0] || school["type"],
                    __typename:"School"
                },
                telephone:telephone2,
                username:username2,
            };
            if(type === 'create'){
                mutate({
                    variables: { area_name,class:gradeClass1[1],grade:gradeClass1[0],openid,
                        school_name,telephone:telephone2,username:username2,createAt:nowTime,updateAt:"" },
                    optimisticResponse: {
                        __typename: "Mutation",
                        createCustomer: updateContent
                    },
                    update: (proxy, { data: { createCustomer } }) => {
                        // console.log('createCustomer',createCustomer);
                        const data = proxy.readQuery({ query: GET_CUSTOMER_BY_OPENID, variables:{openid}});
                        data.customer = createCustomer;
                        proxy.writeQuery({  query: GET_CUSTOMER_BY_OPENID, variables:{openid},data });
                        // console.log('createCustomer proxy',proxy);
                    }
                });
                this.props.history.push("/pay");
            }else if(type === 'display'){
                mutate({
                    variables: {area_name:area_name,class:gradeClass1[1],grade:gradeClass1[0],openid:openid,
                        school_name,telephone:telephone2,username:username2,updateAt:nowTime},
                    optimisticResponse: {
                        __typename: "Mutation",
                        updateCustomer: updateContent
                    }
                });
                this.props.history.push("/#index=2&tab=2");
            }else {
                mutate({
                    variables: {area_name:area_name,class:gradeClass1[1],grade:gradeClass1[0],openid:openid,
                        school_name:school_name,telephone:telephone2,username:username2,updateAt:nowTime},
                    optimisticResponse: {
                        __typename: "Mutation",
                        updateCustomer: updateContent
                    }
                });
                this.props.history.goBack();
            }
        }else if(!username2){
            Toast.info('请输入姓名！',1);
        }else if(!isPoneAvailable){
            Toast.info('请输入11位有效手机号码！',1);
        }else if(!area_name){
            Toast.info('请选择所在学校的所处地区！',1);
        }else if(!school_name1){
            Toast.info('请选择所在学校！',1);
        }else if(!gradeClass1){
            Toast.info('请选择所在班级-年级！',1);
        }else {
            message.warning('收货地址暂未完善',2);
        }
    };

    getInputContent = (item,value) => {
        // console.log('item',item,'value',value);
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
                      onError={error=>sendError(error,type === 'create' ? 'CREATE_CUSTOMER':'UPDATE_CUSTOMER')}
            >
                {(mutate, { loading, error }) => (
                    <div>
                        <div id="userInput">
                            <List renderHeader={() => herderContent}>
                                <InputUserName
                                    username={username}
                                    getInputContent={this.getInputContent}
                                />
                                <InputTelephone
                                    telephone={telephone}
                                    getInputContent={this.getInputContent}
                                />
                                <SelectDistrict
                                    area={area}
                                    school={school}
                                    gradeClass={gradeClass}
                                    getInputContent={this.getInputContent}
                                />
                            </List>
                            <div style={{visibility:saveButtonDisplay}}>
                                <List.Item>
                                    <button className="long-button" onClick={(e)=> this.saveUserInput(e,openid,mutate)}>保存</button>
                                </List.Item>
                            </div>
                        </div>
                        {loading && <Loading contentHeight={window.innerHeight - 95} tip=""/>}
                        {error && <RenderToast content="加载中，请稍等"/>}
                    </div>
            )}
            </Mutation>
        );
    }
}

export default withRouter(CreateUserInfo);