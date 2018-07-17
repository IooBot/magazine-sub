import React, {Component} from 'react';
import { Query  } from "react-apollo";
import gql from "graphql-tag";

import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/css';

import './userSubPage.css';

const GET_CUSTOMER_ORDER = gql`
 query getCustomerOrder($openid: String!) {
  subRecord:list_orders_by_customer(openid: $openid) {
    createAt
    magazines {
      magazineName:name 
      unitPrice
    }
    subCount
    subMonthCount
    startDate
    endDate
    havePay
    orderStatus
  }
}
`;

export default class UserSubPage extends Component{

    renderUserOrder = (subRecord) => {
        // console.log('subRecord',subRecord);

        return subRecord.map((oder,idx)=>{
            let {createAt,subCount,havePay,subMonthCount,startDate,endDate,orderStatus} = oder;
            let {magazineName,unitPrice} = oder.magazines;

            return <div key={'order'+idx}>
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
            <Query query={GET_CUSTOMER_ORDER} variables={{openid}}>
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
                    let subRecord = data.subRecord;
                    console.log('subRecord',subRecord);

                    return (
                        <div id="userSubPage">
                            {!subRecord ?
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


