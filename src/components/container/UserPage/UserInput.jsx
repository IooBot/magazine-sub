import React, {Component} from 'react';
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

    render(){
        let {openid} = this.props;
        let herderContent='收货地址';

        return(
            <Query
                query={GET_CUSTOMER_BY_OPENID}
                variables={{openid}}
            >
                {({ loading,error, data }) => {
                    if (loading) return null;
                    // if (error) return `Error!: ${error}`;
                    // console.log('UserInput data',data);
                    if(!data.customer){
                        return <div className="noSub">
                            <span> </span>
                            <div style={{paddingTop:'20px'}}>
                                <button style={{width:'90px',height:'30px'}}
                                        onClick={()=>{this.props.changeTab("订阅");
                                            window.location.hash = 'index=1'}}>
                                    去订阅
                                </button>
                            </div>
                        </div>;
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