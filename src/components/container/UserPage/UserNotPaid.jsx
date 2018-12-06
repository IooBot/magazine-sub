import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { Query,Mutation } from "react-apollo";
import $ from 'jquery';

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import message from 'antd/lib/message';
import 'antd/lib/message/style/css';
import Modal from 'antd-mobile/lib/modal/index';
import 'antd-mobile/lib/modal/style/css';

import './userSubPage.css';
import {GET_ORDER_BY_PROPS,DELETE_ORDER,UPDATE_ORDER ,GET_WAIT_PAY_ORDER} from '../../graphql/order.js';
import {Loading}  from "../HomePage/HomePage.jsx";
import {sendError} from "./UserSubConfirm.jsx";

const alert = Modal.alert;

class UserNotPaid extends Component{

    // prepay_id微信生成的预支付会话标识，用于后续接口调用中使用，该值有效期为2小时
    jsApiPay = (args,confirmContent,updateOrder,refetch) => {
        // console.log('args res', args);
        let $this = this;
        function onBridgeReady() {
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', args,
                function (res) {
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
                    if (res.err_msg === "get_brand_wcpay_request:ok") {
                        // 成功完成支付
                        let {openid,id} = confirmContent;
                        setTimeout(() => {
                            refetch({variables:openid,id}).then((res)=>{
                                // console.log('complete pay update res',res);
                                let ishave = res.data.ishaveOrder.orderStatus;
                                if(ishave === "finishPay"){
                                    message.success('支付成功，等待发货');
                                }else if(ishave === "waitPay"){
                                    confirmContent.orderStatus = "finishPay";
                                    updateOrder({variables: confirmContent});
                                    message.success('支付成功，等待确认');
                                    sendError('complete pay but status is also waitPay','get_brand_wcpay_request:ok but error')
                                }
                                $this.props.history.push("/#index=2&tab=0");
                            }).catch((err)=>{
                                // console.log('complete pay update refetch err',err);
                                sendError(err,'get_brand_wcpay_request:ok but refetch error');
                            });
                        }, 1000);
                    }
                    else {
                        if(res.err_msg === "get_brand_wcpay_request:cancel"){
                            message.warning('您的支付已经取消');
                        }else if(res.err_msg === "get_brand_wcpay_request:fail"){
                            message.error('支付失败，请稍后重试');
                        }else{
                            message.error('支付失败，请稍后重试');
                        }
                    }
                }
            );
        }
        if (typeof window.WeixinJSBridge === "undefined"){
            if( document.addEventListener ){
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            }else if (document.attachEvent){
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        }else{
            onBridgeReady();
        }
    };

    getBridgeReady = (updateOrder,id,needPay,refetch) => {
        let {openid} = this.props;
        const confirmContent = {
            openid,
            id
        };

        let $this = this;
        $.ajax({
            url: '/payinfo',
            type: 'get',
            data: {
                needPay:parseInt(needPay * 100,10),
                openid: $this.props.openid,
                tradeNo:id
            },
            dataType: 'json',
            success(res){
                // console.log('onBridgeReady res',res);
                $this.jsApiPay(res,confirmContent,updateOrder,refetch);
            },
            error(err){
                $this.props.history.push("/#index=2&tab=1");
                message.warning('网络或系统故障，请稍后重试');
                // console.log('onBridgeReady err',err);
            }
        });
    };

    deleteNotPaidOrder = (e,deleteOrder,openid,orderId) =>{
        e.stopPropagation();
        alert("删除订单",<div>确定删除此订单吗？</div>,[
            {text: '取消'},
            {text: '确定', onPress: () => {
                deleteOrder({ variables:{id:orderId}});
                }
            }
        ]);
    };

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

    renderUserOrder = (notPaid,refetch) => {
        // console.log('notPaid',notPaid,JSON.stringify(notPaid));
        let sub = JSON.stringify(notPaid);
        let notPaid1 = JSON.parse(sub);
        notPaid1.sort((a,b)=>{return b.id - a.id});
        // console.log('renderUserOrder notPaid1',notPaid1);

        let {openid} = this.props;
        return notPaid1.map((oder,idx)=>{
            let {createAt,id,subCount,havePay,subMonthCount,subYear,subMonth} = oder;
            let subTime = this.getSubTime(subMonthCount,subMonth);

            let {magazineName,unitPrice} = oder.magazine;

            return <div key={'order'+idx}>
                <Mutation mutation={DELETE_ORDER}
                          onCompleted={()=>{refetch();}}
                          onError={error=>sendError(error,'DELETE_ORDER')}
                >
                    {(deleteOrder,{ loading, error }) => (
                        <div>
                            <div className="sub-content">
                                <div className="sub-title">
                                    <span style={{color:'#3e3d3d'}}>订单编号: {id}</span>
                                    <span onClick={(e)=>this.deleteNotPaidOrder(e,deleteOrder,openid,id)}>
                                            <Icon type="delete" />
                                        </span>
                                </div>
                                <div className="sub-record">
                                    <div>
                                        <span style={{fontSize:'17px'}}>{magazineName}</span>
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
                                    <Mutation mutation={UPDATE_ORDER}
                                              refetchQueries={[{query:GET_ORDER_BY_PROPS,variables: {openid,orderStatus:'finishPay'}},
                                                  {query:GET_ORDER_BY_PROPS,variables: {openid,orderStatus:'waitPay'}}
                                              ]}
                                              onError={error=>sendError(error,'UPDATE_ORDER')}
                                    >
                                        {(updateOrder,{ loading, error }) => (
                                            <div>
                                                <span style={{color:'#888'}}>创建时间: {createAt}</span>
                                                <span >
                                                    <button className="color-button" style={{width:'90px',height:'30px',lineHeight:'20px'}}
                                                        onClick={()=>this.getBridgeReady(updateOrder,id,havePay,refetch)}>确认支付</button>
                                                </span>
                                            </div>
                                        )}
                                    </Mutation>
                                </div>
                            </div>
                            {/*{loading && <p>Loading...</p>}*/}
                            {/*{error && <p>Error :( Please try again</p>}*/}
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
            <Query query={GET_WAIT_PAY_ORDER} variables={{openid,id:openid}}>
                {({ loading, error, data, refetch }) => {
                    console.log("notPaid order data",data);
                    if (loading)
                        return <Loading contentHeight={contentHeight} tip=""/>;
                    // if (error) return `Error! ${error.message}`;
                    let notPaid = data.waitPayOrder;
                    // console.log('notPaid',notPaid,notPaid === [],!notPaid.length);

                    return (
                        <div id="userSubPage">
                            {!notPaid || !notPaid.length ?
                                <div className="noSub">
                                    <span>暂无未支付订单哦！</span>
                                    <div style={{paddingTop:'20px'}}>
                                        <button style={{width:'90px',height:'30px'}}
                                                onClick={()=>{this.props.changeTab("订阅");
                                                window.location.hash = 'index=1'}}>
                                            去订阅
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

export default withRouter(UserNotPaid);
