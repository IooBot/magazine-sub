import React, {Component} from 'react';
import { Query,Mutation } from "react-apollo";
import moment from 'moment';

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/css';
import Picker from 'antd-mobile/lib/picker/index';
import 'antd-mobile/lib/picker/style/css';

import './userSubPage.css';
import {GET_ORDER_BY_PROPS,UPDATE_ORDER_MAGAZINE} from '../../graphql/order.js';

export default class UserSubPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            errors: false,
            canSubmit: true
        };
    }

    getSubTime = (subMonthCount,subMonth) => {
        let subTime;
        if(subMonthCount === 12){
            subTime = "全年";
        }else if(subMonthCount === 6){
            if(subMonth[0] === 1){
                subTime = "上半年";
            }else {
                subTime = "下半年";
            }
        }
        // console.log('subTime',subTime);
        return subTime;
    };

    renderUserOrder = (subRecord) => {
        let sub = JSON.stringify(subRecord);
        let subRecord1 = JSON.parse(sub);
        subRecord1.sort((a,b)=>{return b.id - a.id});
        // console.log('magazineList',this.props.magazineList);
        let magazineList = this.props.magazineList.map(item => {
            let {magazineName,id} = item;
            return {
                label: magazineName,
                value: id,
            }
        });

        return subRecord1.map((oder,idx)=>{
            let {id,openid,createAt,subCount,havePay,subMonthCount,subYear,subMonth} = oder;
            let subTime = this.getSubTime(subMonthCount,subMonth);
            let lastTime = moment().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss");
            // console.log(createAt,lastTime);
            let enableEdit = createAt >= lastTime ? true:false;
            let {magazineName,unitPrice} = oder.magazine;
            // console.log('oder.magazine',oder.magazine);

            return <div key={'order'+idx}>
                <Mutation mutation={UPDATE_ORDER_MAGAZINE}>
                    {(updateOrderMagazine) => (
                        <div className="sub-content">
                            <div className="sub-title">
                                <div>
                                    <span style={{color:'#3e3d3d'}}>订单编号: {id}</span>
                                    <span> </span>
                                </div>
                            </div>
                            <div className="sub-record">
                                <div>
                                    {enableEdit ?
                                        <Picker
                                            cols={1}
                                            data={magazineList}
                                            title="选择杂志"
                                            onOk={value => {
                                                // console.log('onOk magazineName value',value);
                                                updateOrderMagazine({variables: {id,openid,magazine_id:value[0]}});
                                            }}
                                        ><span style={{fontSize:'17px'}}>{magazineName} <Icon type="edit"  style={{fontSize: 18, color: '#ff5f16'}}/></span></Picker>
                                        :
                                        <span style={{fontSize:'17px'}}>{magazineName}</span>
                                    }
                                    <span>¥{unitPrice}/月</span>
                                </div>
                                <div style={{color:'#888'}}>
                                    <span style={{color:'#108ee9'}}>{subYear} {subTime}</span>
                                    <span>x{subCount}</span>
                                </div>
                                <div>
                                    <span> </span>
                                    <span>合计:&nbsp;&nbsp;<span style={{color:"#ff5f16"}}>¥{havePay}</span></span>
                                </div>
                                <div>
                                    <span style={{color:'#888'}}>创建时间: {createAt}</span>
                                    <span> </span>
                                </div>
                            </div>
                        </div>
                    )}
                </Mutation>
            </div>
        });
    };

    render(){
        let contentHeight = window.innerHeight - 138.5;
        let {openid} = this.props;

        return(
            <Query query={GET_ORDER_BY_PROPS} variables={{openid,"orderStatus":"finishPay"}}>
                {({ loading, error, data, refetch }) => {
                    // console.log("subRecord order data",data);
                    if (loading)
                        return <div style={{width:'100%',height:contentHeight}}>
                            <Spin style={{
                                position: 'relative',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%,-50%)'
                            }}/>
                        </div>;
                    // if (error) return `Error! ${error.message}`;
                    let subRecord = data.orderList;
                    // console.log('subRecord',subRecord,new Date().getTime());

                    return (
                        <div id="userSubPage">
                            {!subRecord || !subRecord.length ?
                                <div className="noSub">
                                    <span>您还未订阅过哦！</span>
                                    <div style={{paddingTop:'20px'}}>
                                        <button style={{width:'80px',height:'30px'}}
                                                onClick={()=>{this.props.changeTab("订阅");
                                                window.location.hash = 'index=1'}}>
                                            去订阅
                                        </button>
                                    </div>
                                </div>:
                                this.renderUserOrder(subRecord)
                            }
                        </div>
                    );
                }}
            </Query>
        )
    }
}


