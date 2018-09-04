import React, {Component} from 'react';
// import PropTypes from 'prop-types';
// import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { Query,Mutation } from "react-apollo";

import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import 'antd-mobile/lib/input-item/style/css';

import './userInput.css';
import {GET_CUSTOMER_BY_OPENID,UPDATE_CUSTOMER} from '../../graphql/customer.js';
import SelectDistrict from './SelectDistrict.jsx';
import InputUserName from './InputUserName.jsx';
import InputTelephone from './InputTelephone.jsx';

class UserInput extends Component{

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
        let saveButtonDisplay ={'create':'visible','display':'hidden','re-edit':'visible'}[type] ||'hidden';

        return(
            <Query
                query={GET_CUSTOMER_BY_OPENID}
                variables={{ openid}}
            >
                {({ loading,error, data }) => {
                    if (loading) return null;
                    if (error) return `Error!: ${error}`;
                    console.log('UserInput data',data);
                    if(!data.customer){
                        return '';
                    }

                    let {username,telephone,area,school,grade} = data.customer;
                    let gradeClass = [grade,data.customer.class];

                    return (
                        <Mutation mutation={UPDATE_CUSTOMER}
                                  refetchQueries={[{query:GET_CUSTOMER_BY_OPENID,variables: {openid}}]}
                        >
                            {(updateCustomer, { loading, error }) => (
                                <div>
                                    <div id="userInput">
                                        <List renderHeader={() => herderContent}>
                                            <InputUserName herderContent={herderContent} openid={openid} username={username} updateCustomer={updateCustomer}/>
                                            <InputTelephone herderContent={herderContent} openid={openid} telephone={telephone} updateCustomer={updateCustomer}/>
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
                                                <button className="long-button" onClick={(e)=> this.saveUserInput(e)}>保存</button>
                                            </List.Item>
                                        </div>
                                    </div>
                                    {/*{loading && <p>Loading...</p>}*/}
                                    {/*{error && <p>Error :( Please try again</p>}*/}
                                </div>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

export default withRouter(UserInput);