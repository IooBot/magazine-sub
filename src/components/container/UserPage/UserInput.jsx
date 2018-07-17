import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { createForm } from 'rc-form';
import { Query,Mutation } from "react-apollo";
import gql from "graphql-tag";

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import InputItem from 'antd-mobile/lib/input-item/index';
import 'antd-mobile/lib/input-item/style/css';

import './userInput.css';

const GET_CUSTOMER = gql`
 query getCustomer($openid: String!) {
  customer:customer_by_openid(openid: $openid) {
    openid,
    username
  }
}
`;

const UPDATE_CUSTOMER = gql`
mutation updateCustomer($openid: String!,$username:String) {
  customer:update_customerName(openid: $openid,username:$username) {
    openid,
    username
  }
}

`;

class UserInput extends Component{
    constructor(props){
        super(props);

        this.state = {
            username:'',
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

    render(){

        let {type,openid} = this.props;

        let herderContent={'create':'新建收货地址','display':'收货信息','re-edit':'编辑收货地址'}[type] ||'收货信息';
        let saveButtonDiaplay ={'create':'visible','display':'hidden','re-edit':'visible'}[type] ||'hidden';

        return(
            <Query
                query={GET_CUSTOMER}
                variables={{ openid }}
            >
                {({ loading, error, data }) => {
                    if (loading) return null;
                    if (error) return `Error!: ${error}`;

                    let username1 = this.state.username || data.customer.username;
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
                                            ><Icon type="smile-o" style={{color:'#ff5f16',fontSize:20}}/>&nbsp;&nbsp;&nbsp;&nbsp;姓名</InputItem>
                                        </List>
                                        <div style={{visibility:saveButtonDiaplay}}>
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