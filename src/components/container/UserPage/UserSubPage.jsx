import React, {Component} from 'react';
import { Query  } from "react-apollo";

import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/css';

import './userSubPage.css';
import {GET_ORDER_BY_PROPS} from '../../graphql/order.js';

export default class UserSubPage extends Component{

    renderUserOrder = (subRecord) => {
        // console.log('subRecord',subRecord);

        return subRecord.map((oder,idx)=>{
            let {createAt,subCount,havePay,subMonthCount,startDate,endDate,orderStatus} = oder;
            let {magazineName,unitPrice} = oder.magazine;
            // let {id} = oder;

            return <div key={'order'+idx}>
                {/*{id}*/}
                <div className="sub-content">
                    <div className="sub-title">
                        <span>创建时间: {createAt}</span>
                        <span> </span>
                    </div>
                    <div className="sub-record">
                        <div>
                            <span style={{fontSize:'17px'}}>{magazineName}</span>
                            <span>¥{unitPrice}/月</span>
                        </div>
                        <div style={{color:'#888'}}>
                            <span>{startDate}至{endDate ? endDate : startDate}</span>
                            <span>x{subCount}</span>
                        </div>
                        <div>
                            <span style={{color:'#888'}}>共{subMonthCount}个月</span>
                            <span>合计:&nbsp;&nbsp;<span style={{color:"#108ee9"}}>¥{havePay}</span></span>
                        </div>
                        <div>
                            <span> </span>
                            <span style={{color:"#ff5f16"}}>{orderStatus}</span>
                        </div>
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
                {({ loading, error, data }) => {
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
                    console.log('subRecord',subRecord);

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
                                this.renderUserOrder(subRecord)
                            }
                        </div>
                    );
                }}
            </Query>
        )
    }
}

UserSubPage.defaultProps = {
    subRecord: []
};


