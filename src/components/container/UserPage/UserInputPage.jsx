import React, {Component} from 'react';
import { Query } from "react-apollo";

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

import CreateUserInfo from './CreateUserInfo.jsx';
import {GET_CUSTOMER_BY_OPENID} from '../../graphql/customer.js';
import {getCookie} from "../../../api/cookie.js";

export default class UserInputPage extends Component{

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
        let openid =  getCookie("openid");
        // 注意userExists类型为string
        let userExists =  sessionStorage.getItem("userExists");
        // console.log('UserInputPage userExists',userExists,typeof userExists);

        if(userExists === 'false'){
            let model1Type = "create";
            let username = '',telephone = '',area = '',school = '',gradeClass = '';
            return (
                <div id="userInputPage">
                    {this.renderTitle()}
                    <CreateUserInfo type={model1Type} openid={openid} username={username} telephone={telephone} area={area} school={school} gradeClass={gradeClass}/>
                </div>
            );
        }else {
            return(
                <Query
                    query={GET_CUSTOMER_BY_OPENID}
                    variables={{openid}}
                >
                    {({ loading,error, data }) => {
                        if (loading) return null;
                        // if (error) return `Error!: ${error}`;
                        // console.log('UserInputPage data',data);
                        let model1Type = "re-edit";
                        let {username,telephone,area,school,grade} = data.customer;
                        let gradeClass = [grade,data.customer.class];

                        return (
                            <div id="userInputPage">
                                {this.renderTitle()}
                                <CreateUserInfo type={model1Type} openid={openid} username={username} telephone={telephone} area={area} school={school} gradeClass={gradeClass}/>
                            </div>
                        );
                    }}
                </Query>
            );
        }
    }
}