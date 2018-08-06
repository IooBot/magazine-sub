import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { Query,Mutation } from "react-apollo";
// import $ from 'jquery';

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/css';
// import message from 'antd/lib/message';
// import 'antd/lib/message/style/css';
import Modal from 'antd-mobile/lib/modal/index';
import 'antd-mobile/lib/modal/style/css';

// import { XMLSign } from '../../../../api/wx.js';
// let config = require('../../../../api/config.js');
import './userSubPage.css';
import {GET_ORDER_BY_PROPS,DELETE_ORDER} from '../../graphql/order.js';

const alert = Modal.alert;

class UserNotPaid extends Component{

    // shouldComponentUpdate(nextProps,nextState){
    //     if(nextProps){
    //         console.log('nextProps',nextProps);
    //         return true;
    //     }
    // }

    // prepay_id微信生成的预支付会话标识，用于后续接口调用中使用，该值有效期为2小时
    // jsApiPay = (prepay_id,confirmContent) => {
    //     console.log('prepay_id',prepay_id);
    //     let timeStamp = String(Math.floor(new Date().getTime()/1000));
    //     let nonceStr = String(Math.random().toString(36).substr(2));
    //     let args = {
    //         // "appId" : config.appID,     //公众号名称，由商户传入
    //         "timeStamp": timeStamp,         //时间戳，自1970年以来的秒数：当前的时间
    //         "nonceStr" : nonceStr, // 随机字符串，不长于32位。
    //         "package" : "prepay_id="+prepay_id,    // 统一下单接口返回的prepay_id参数值
    //         "signType" : "MD5",         //微信签名方式
    //     };
    //     // args.paySign = XMLSign(args);    //微信签名 调用签名算法
    //     let $this = this;
    //
    //     // WeixinJSBridge.invoke(
    //     //     'getBrandWCPayRequest', args,
    //     //     function(res){
    //     //         // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
    //     //         if(res.err_msg == "get_brand_wcpay_request:ok" ) {
    //     //             // 成功完成支付
    //     //             message.success(`支付成功，等待发货`);
    //     //             // Meteor.call('orderRePay.insert', confirmContent);
    //     //             // $this.props.history.push("/#index=2&tab=0");
    //     //         }
    //     //         else{
    //     //             message.error('支付失败，请稍后重试');
    //     //         }
    //     //     }
    //     // );
    // };

    // onBridgeReady = (confirmContent,needPay) => {
    //     // console.log('confirmContent',confirmContent);
    //
    //     // message.success('支付成功，等待发货');
    //     // Meteor.call('orderRePay.insert', confirmContent);
    //     // this.props.history.push("/#index=2&tab=0");
    //
    //     // message.error('支付失败，请稍后重试');
    //
    //     let $this = this;
    //     $.ajax({
    //         url: '/api/wxPay',
    //         type: 'get',
    //         data: {
    //             needPay,
    //             openid: $this.props.openid
    //         },
    //         dataType: 'json',
    //         success(res){
    //             // console.log('onBridgeReady res',res);
    //             if(res.code === 200){
    //                 $this.jsApiPay(res.data,confirmContent);
    //             }
    //         },
    //         error(err){
    //             console.log('onBridgeReady err',err);
    //         }
    //     });
    // };

    deleteNotPaidOrder = (e,deleteOrder,refetch,openid,orderId) =>{
        e.stopPropagation();
        alert("删除订单",<div>确定删除此订单吗？</div>,[
            {text: '取消'},
            {text: '确定', onPress: () => {
                deleteOrder({ variables: {id:orderId} });
                refetch();
                // Meteor.call('orderNotPaid.delete',openid,orderId)
                }
            }
        ]);
    };

    renderUserOrder = (notPaid,refetch) => {
        console.log('renderUserOrder notPaid',notPaid);

        let {openid} = this.props;
        return notPaid.map((oder,idx)=>{
            let {createAt,id:orderId,subCount,havePay,subMonthCount,startDate,endDate} = oder;
            let {magazineName,unitPrice} = oder.magazine;
            console.log('idx',idx,"orderId",orderId);

            // const confirmContent = {openid,orderId,subMagazine:magazineName,subCount,startDate,endDate,unitPrice,havePay:needPay,subMonthCount};
            return <div key={'order'+idx}>
                <Mutation mutation={DELETE_ORDER}>
                    {(deleteOrder, { loading, error }) => (
                        <div>
                            <div className="sub-content">
                                <div className="sub-title">
                                    <span>创建时间: {createAt}</span>
                                    <span onClick={(e)=>this.deleteNotPaidOrder(e,deleteOrder,refetch,openid,orderId)}>
                                            <Icon type="delete" />
                                        </span>
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
                                        <span style={{color:"#ff5f16"}}> </span>
                                        <span >
                                                <button className="color-button" style={{width:'90px',height:'30px'}}
                                                    // onClick={()=>this.onBridgeReady(confirmContent,needPay)}
                                                >确认支付</button>
                                            </span>
                                    </div>
                                </div>
                            </div>
                            {loading && <p>Loading...</p>}
                            {error && <p>Error :( Please try again</p>}
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
            <Query query={GET_ORDER_BY_PROPS} variables={{openid,"orderStatus":"waitPay"}}>
                {({ loading, error, data, refetch }) => {
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
                    let notPaid = data.orderList;
                    console.log('notPaid',notPaid,notPaid === [],!notPaid.length);

                    return (
                        <div id="userSubPage">
                            {!notPaid || !notPaid.length ?
                                <div className="noSub">
                                    <span>暂无未支付订单哦！</span>
                                    <div style={{paddingTop:'20px'}}>
                                        <button style={{width:'90px',height:'30px'}}
                                                onClick={()=>{this.props.changeTab("订阅");
                                                window.location.hash = 'index=1'}}>
                                            去逛逛
                                        </button>
                                    </div>
                                </div>:
                                this.renderUserOrder(notPaid,refetch)
                            }
                        </div>
                    );
                }}
            </Query>
        )
    }
}

UserNotPaid.defaultProps = {
    notPaid: []
};

export default withRouter(UserNotPaid);
