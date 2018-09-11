import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";

import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import 'antd-mobile/lib/input-item/style/css';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

import './userInput.css';
import {GET_CUSTOMER_BY_OPENID} from '../../graphql/customer.js';
import {RenderToast,Loading}  from "../HomePage/HomePage";
const Item = List.Item;
const Brief = Item.Brief;

class UserInput extends Component{

    render(){
        let {openid} = this.props;
        let herderContent='收货地址';

        return(
            <Query query={GET_CUSTOMER_BY_OPENID} variables={{openid}}>
                {({ loading,error, data }) => {
                    if (loading) return <Loading contentHeight={window.innerHeight - 139} tip=""/>;
                    if (error) return <RenderToast content="加载中，请稍等"/>;
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

                    return (
                        <div id="userInfo">
                            <List renderHeader={() => herderContent}>
                                <Item
                                    multipleLine
                                    extra={<Icon type="edit"  style={{fontSize: 20, color: '#108ee9'}}/>}
                                    onClick={(e) => { this.props.history.push("/address");}}
                                >
                                    收货人:&nbsp;&nbsp;{username} <br/>
                                    <Brief>{telephone}</Brief>
                                    <Brief>收货地址:&nbsp;&nbsp;{area["province"]} {area["city"]} {area["district"]}<br />
                                        {school["name"]}  {grade}年级  {data.customer.class}班</Brief>
                                </Item>
                            </List>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default withRouter(UserInput);