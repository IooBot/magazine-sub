import React, {Component} from 'react';
import { Query  } from "react-apollo";

import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/css';

import './userSubPage.css';
import {GET_ORDER_BY_PROPS} from '../../graphql/order.js';

export default class UserSubPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            errors: false,
            canSubmit: true,
        };
    }

    // componentWillReceiveProps(nextProps) {
    //     // we don't resubscribe on changed props, because it never happens in our app
    //     console.log('this.props',this.props);
    //     console.log('nextProps',nextProps);
    // }

    getSubTime = (subMonthCount,subMonth) => {
        // console.log('subMonthCount',subMonthCount);
        // console.log('subMonth',subMonth);
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
        // console.log('subRecord',subRecord);

        return subRecord.map((oder,idx)=>{
            let {id,createAt,subCount,havePay,subMonthCount,subYear,subMonth,orderStatus} = oder;
            let subTime = this.getSubTime(subMonthCount,subMonth);

            let {magazineName,unitPrice} = oder.magazine;
            // console.log('oder.magazine',oder.magazine);

            return <div key={'order'+idx}>
                <div className="sub-content">
                    <div className="sub-title">
                        <div>
                            <span style={{color:'#3e3d3d'}}>订单编号: {id}</span>
                            <span> </span>
                        </div>
                    </div>
                    <div className="sub-record">
                        <div>
                            <span style={{fontSize:'17px'}}>{magazineName}</span>
                            <span>¥{unitPrice}/月</span>
                        </div>
                        <div style={{color:'#888'}}>
                            <span style={{color:'#108ee9'}}>{subYear} {subTime}</span>
                            {/*<span>{startDate}至{endDate ? endDate : startDate}</span>*/}
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
                        {/*<div>*/}
                            {/*<span> </span>*/}
                            {/*<span style={{color:"#ff5f16"}}>{orderStatus}</span>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        });
    };

    render(){
        let contentHeight = window.innerHeight - 138.5;
        let {openid} = this.props;

        return(
            <Query query={GET_ORDER_BY_PROPS} variables={{openid,"orderStatus":"finishPay"}}>
                {({ loading, error, data, refetch }) => {
                    console.log("subRecord order data",data);
                    if (loading)
                        return <div style={{width:'100%',height:contentHeight}}>
                            <Spin style={{
                                position: 'relative',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%,-50%)'
                            }}/>
                        </div>;
                    if (error) return `Error! ${error.message}`;
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
                                            去逛逛
                                        </button>
                                    </div>
                                </div>:
                                this.renderUserOrder(subRecord,refetch)
                            }
                        </div>
                    );
                }}
            </Query>
        )
    }
}


