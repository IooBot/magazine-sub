import React, {Component} from 'react';
import { Query } from "react-apollo";

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

import CreateUserInfo from './CreateUserInfo.jsx';
import {GET_CUSTOMER_BY_OPENID} from '../../graphql/customer.js';
// import {getCookie} from "../BasicInfo/BindWechat.jsx";

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
        // let openid =  getCookie("wechat_openid");
        let openid =  '12346';

        return(
            <Query
                query={GET_CUSTOMER_BY_OPENID}
                variables={{ openid}}
            >
                {({ loading,error, data }) => {
                    if (loading) return null;
                    if (error) return `Error!: ${error}`;
                    console.log('UserInputPage data',data);
                    let model1Type = "re-edit";

                    let username = '',telephone = '',area = '',school = '',gradeClass = '';
                    if(!data.customer){
                        model1Type = "create";
                    }else {
                        username = data.customer.username;
                        telephone = data.customer.telephone;
                        area = data.customer.area;
                        school = data.customer.school;
                        let grade = data.customer.grade;
                        gradeClass = [grade,data.customer.class];
                    }

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