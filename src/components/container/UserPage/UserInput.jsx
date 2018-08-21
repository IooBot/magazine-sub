import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { createForm } from 'rc-form';
import { Query,Mutation } from "react-apollo";

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import InputItem from 'antd-mobile/lib/input-item/index';
import 'antd-mobile/lib/input-item/style/css';
import Toast from 'antd-mobile/lib/toast/index';
import 'antd-mobile/lib/toast/style/css';
import Picker from 'antd-mobile/lib/picker/index';
import 'antd-mobile/lib/picker/style/css';
// eslint-disable-next-line
import {setCookie,getCookie} from "../BasicInfo/BindWechat.jsx";

import './userInput.css';
import {GET_CUSTOMER_BY_OPENID,UPDATE_CUSTOMER} from '../../graphql/customer.js';
import SelectSchool from './SelectSchool.jsx';

class UserInput extends Component{
    constructor(props){
        super(props);

        this.state = {
            username:'',
            telephone:'',
            schoolArea:'',
            schoolDistrict:'',
            school:'',
            gradeClass:'',
            hasError: false
        }
    }

    getArea = (area) => {
        let hash = {},obj = {},i = 0,res = [],res1 = [];
        area.forEach(function(item) {
            let {city,name,district,province} = item;
            obj = {label:district,name:name};
            hash[city] ? res[hash[city] - 1].district.push(obj) : hash[city] = ++i && res.push({
                district: [obj],
                city,
                province
            });
        });
        console.log(res);
        res.forEach(function(item) {
            let {city,district,province} = item;
            let district1 = district.map(item => {
                let {label,name} = item;
                return {
                    label: label,
                    value: name,
                }
            });
            res1.push({
                value: province,
                label: province,
                children:[{value:city,
                    label:city,
                    children: district1
                }]
            });
        });
        console.log(res1);
        // console.log(JSON.stringify(res1));
        return res1;

        // [{"district":[{"label":"蜀山区","name":"hefei-shushan"},{"label":"高新区","name":"hefei-gaoxin"},{"label":"瑶海区","name":"hefei-yaohai"},
        // {"label":"包河区","name":"hefei-baohe"}],"city":"合肥市","province":"安徽省"}]

        // console.log(JSON.stringify(res1));
        // [{"value":"安徽省","label":"安徽省","children":[{"value":"合肥市","label":"合肥市",
        // "children":[[{"label":"蜀山区","value":"hefei-shushan"},{"label":"高新区","value":"hefei-gaoxin"},{"label":"瑶海区","value":"hefei-yaohai"},{"label":"包河区","value":"hefei-baohe"}]]}]}]
    };

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
        const { getFieldProps } = this.props.form;

        let {type,openid} = this.props;
        // eslint-disable-next-line
        const grade_class = [
            [
                {label: '1年级', value: 1},
                {label: '2年级', value: 2},
                {label: '3年级', value: 3},
                {label: '4年级', value: 4},
                {label: '5年级', value: 5},
                {label: '6年级', value: 6},
                {label: '7年级', value: 7},
                {label: '8年级', value: 8},
                {label: '9年级', value: 9},
            ],
            [
                {label: '1班', value: 1},
                {label: '2班', value: 2},
                {label: '3班', value: 3},
                {label: '4班', value: 4},
                {label: '5班', value: 5},
                {label: '6班', value: 6},
                {label: '7班', value: 7},
                {label: '8班', value: 8},
                {label: '9班', value: 9},
                {label: '10班', value: 10},
            ],
        ];

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
                    console.log('data',data);
                    let {username,telephone,area,school,grade} = data.customer;
                    console.log('school',school);
                    let username1 = this.state.username || username;
                    let telephone1 = this.state.telephone || telephone;
                    let schoolArea = [area["province"],area["city"],area["name"]];
                    let schoolArea1 = this.state.schoolArea || schoolArea;
                    let schoolDistrict = this.state.schoolDistrict || area["name"];
                    let school1 = [school.type,school.name];
                    console.log('school1',school1);
                    let gradeClass1 = this.state.gradeClass || [grade,data.customer.class];
                    console.log('gradeClass1',gradeClass1);
                    let districtData = this.getArea(data.area);
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
                                            <Picker
                                                extra="请选择学校所在地区"
                                                data={districtData}
                                                title="学校所在地区"
                                                {...getFieldProps('district', {
                                                    initialValue: schoolArea1,
                                                })}
                                                onOk={(value) => {
                                                    this.setState({ schoolArea: value,schoolDistrict:value[2]  });
                                                    console.log('schoolArea onOk', value);
                                                    // console.log('changeArea', value[2]);
                                                    setCookie('changeArea',value[2]);
                                                    if(herderContent === '收货信息'){
                                                        updateCustomer({ variables: { openid, area_name: value[2] } });
                                                        // Meteor.call('schoolArea.insert',openid,value);
                                                    }
                                                }}
                                            >
                                                <List.Item
                                                    arrow="horizontal"
                                                    thumb={<Icon type="environment-o" style={{color:'#ff5f16',fontSize:20}}/>}
                                                    style={{borderBottom:'none!important'}}
                                                >学校地区</List.Item>
                                            </Picker>
                                            <SelectSchool
                                                herderContent={herderContent}
                                                school={school1}
                                                openid={openid}
                                                area_name={schoolDistrict}
                                                updateCustomer={updateCustomer}
                                                gradeClass={gradeClass1}
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

export default withRouter(createForm()(UserInput));