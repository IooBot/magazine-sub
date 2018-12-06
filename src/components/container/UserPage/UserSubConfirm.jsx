import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { Query,Mutation } from "react-apollo";
import $ from 'jquery';
import {request} from 'graphql-request';

import moment from 'moment';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import Picker from 'antd-mobile/lib/picker/index';
import 'antd-mobile/lib/picker/style/css';
import Stepper from 'antd-mobile/lib/stepper/index';
import 'antd-mobile/lib/stepper/style/css';
import message from 'antd/lib/message';
import 'antd/lib/message/style/css';

import './userSubConfirm.css';
import {CREATE_ORDER} from '../../graphql/order.js';
import {GET_CUSTOMER_AND_ORDER} from '../../graphql/customer.js';
import {Loading}  from "../HomePage/HomePage.jsx";
const Item = List.Item;
const Brief = Item.Brief;

function changeSubTimeList(subTime) {
    // eslint-disable-next-line
    let nowTime = parseInt(`${new Date().getFullYear()}` + `${new Date().getMonth()+1}`,10);
    let res = [],res1 = [];
    let timeType1 = {label:"全年",value:"1"};   // value为数组[1,2,3,4,5,6,7,8,9,10,11,12],label匹配时无法显示
    let timeType2 = {label:"上半年",value:"2"};
    let timeType3 = {label:"下半年",value:"3"};

    subTime.forEach(function(item) {
        let time1 = parseInt(`${item}02`,10);        // 201902
        let time2 = parseInt(`${item}08`,10);        // 201908
        // 当前时间小于对应杂志订阅时间1月：可订阅时间的全年杂志
        if(nowTime < time1){
            res = [timeType1,timeType2,timeType3];

            // 当前时间大于对应杂志订阅时间的1月份并且小于7月份：可订阅时间的下半年
        }else if(nowTime > time1 && nowTime < time2){
            res = [timeType3];
        }
        if(res.length){
            res1.push({
                value: item,
                label: item,
                children:res
            });
        }
    });
    // console.log("changeSubTimeList subTimeList",res1);
    return res1;
}

export function sendError(error,type) {
    // console.log(type,'sendError data',error);
    if(error){
        $.ajax({
            url: '/api/error',
            type: 'post',
            data: {
                mutationError:error,
                mutationMethod:type
            },
            dataType: 'json',
            success(res){
                console.log('sendError res',res);
            },
            error(err){
                console.log('sendError err',err);
            }
        });
    }
}

class UserSubConfirm extends Component{
    constructor(props){
        super(props);
        this.state = {
            subCount:1,
            subYear:"",
            subMonth:"",
            subTime:"",
            year_type:[],
            payStatus:false,
        };
    }

    componentWillMount(){
        let magazineEnableSubTime = sessionStorage.getItem("magazineEnableSubTime");
        // console.log('magazineEnableSubTime',magazineEnableSubTime);
        let year_type = changeSubTimeList(JSON.parse(magazineEnableSubTime));
        // console.log('year_type',year_type);

        let defaultSubTime = [year_type[0].value,year_type[0].children[0].value];
        // console.log('defaultSubTime',defaultSubTime);
        let subYear = defaultSubTime[0];
        let subMonthLabel = defaultSubTime[1];

        if(sessionStorage.getItem("subCount")){
            this.setState({subCount:sessionStorage.getItem("subCount")});
        }
        if(sessionStorage.getItem("subYear")){
            subYear = parseInt(sessionStorage.getItem("subYear"),10);
        }
        if(sessionStorage.getItem("subMonth")){
            subMonthLabel = sessionStorage.getItem("subMonth");
        }
        let timeValue = this.getTimeValueArray(subMonthLabel);
        let subTime = [subYear,subMonthLabel];
        // console.log('timeValue',timeValue);
        this.setState({
            year_type:year_type,
            subTime:subTime,
            subYear:subYear,
            subMonth:timeValue
        });
    }

    getTimeValueArray = (value) => {
        let result = {"1":[1,2,3,4,5,6,7,8,9,10,11,12], "2":[1,2,3,4,5,6], "3":[7,8,9,10,11,12]}[value];
        return result;
    };

    // prepay_id微信生成的预支付会话标识，用于后续接口调用中使用，该值有效期为2小时
    jsApiPay = (args,confirmContent,createOrder,refetch) => {
        // console.log('args res',args);
        let $this = this;
        let {openid,id} = confirmContent;
        function onBridgeReady(){
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', args,
                function(res){
                    // console.log('jsApiPay res',res);
                    // console.log('jsApiPay confirmContent',confirmContent);
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
                    if(res.err_msg === "get_brand_wcpay_request:ok" ) {
                        // 成功完成支付
                        setTimeout(() => {
                            refetch({openid,id}).then((res)=>{
                                // console.log('complete pay refetch res',res);
                                let ishave = res.data.ishaveOrder.orderStatus;
                                if(ishave === "finishPay"){
                                    message.success('支付成功，等待发货');
                                }else if(ishave === "waitPay"){
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
                    else{
                        if(res.err_msg === "get_brand_wcpay_request:cancel"){
                            message.warning('您的支付已经取消');
                        }else if(res.err_msg === "get_brand_wcpay_request:fail"){
                            message.error('支付失败，请稍后重试');
                        }else{
                            message.error('支付失败，请稍后重试');
                        }
                        refetch({openid,id}).then((res)=>{
                            // console.log('fail pay refetch res',res);
                            $this.props.history.push("/#index=2&tab=1");
                        });

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

    // ajax请求后端请求获得prepay_id
    getBridgeReady = (createOrder,needPay,telephone,refetch) => {
        if(needPay !== 0){
            let {openid,magazineId} = this.props;
            let createAt = moment().format('YYYY-MM-DD HH:mm:ss');
            let tag = telephone.replace(/[^0-9]/ig,"").slice(-4);
            let id = createAt.replace(/[^0-9]/ig,"").substr(2)+tag;
            const confirmContent = {
                openid,
                magazine_id:magazineId,
                subCount:this.state.subCount,
                subYear:this.state.subYear,
                subMonth:this.state.subMonth,
                subMonthCount:this.state.subMonth.length,
                havePay:needPay,
                createAt,
                id,
                orderStatus:"waitPay"
            };
            // console.log('confirmContent',confirmContent);

            this.setState({payStatus:true});

            let $this = this;
            createOrder({ variables:confirmContent }).then(res => {
                // console.log('createOrder waitPay order res',res);
                let id = confirmContent.id;

                const findOrderId = `{
                 ishave:order_by_id(id:${id}){
                 id
                 orderStatus
                 }
                }`;

                // request("http://ebookqqsh.ioobot.com/release/graphql", findOrderId)      // test
                request("http://ebookqqsh.snbl.com.cn/release/graphql", findOrderId)      // snbl
                    .then(data => {
                        // console.log('request data',data, data.ishave.id === id);
                        // console.log('request data time',new Date());
                        if(data.ishave.id === id){
                            let ajaxTimeOut = $.ajax({
                                url: '/payinfo',
                                type: 'get',
                                timeout: 30000,
                                data: {
                                    needPay:parseInt(needPay * 100,10),
                                    openid: $this.props.openid,
                                    tradeNo:id,
                                    orderData:JSON.stringify(confirmContent)
                                },
                                dataType: 'json',
                                success(res){
                                    // console.log('onBridgeReady res',res);
                                    // console.log('ajax /payinfo data time',new Date());
                                    $this.setState({payStatus:false});
                                    $this.jsApiPay(res,confirmContent,createOrder,refetch);
                                },
                                error(err){
                                    // console.log('onBridgeReady err',err);
                                    $this.props.history.push("/#index=2&tab=1");
                                    message.warning('网络或系统故障，请稍后重试');
                                },
                                complete: function (XMLHttpRequest, status) { //当请求完成时调用函数
                                    // console.log('time out status',status);
                                    if (status === 'timeout') {
                                        //status == 'timeout'意为超时,status的可能取值：success,notmodified,nocontent,error,timeout,abort,parsererror
                                        ajaxTimeOut.abort(); //取消请求
                                        message.warning('网络或系统故障，请稍后重试');
                                    }
                                }
                            });
                        }else {
                            message.warning('网络或系统故障，请稍后重试');
                            sendError(data,`graphql-request query orderId: ${id} data and res ${res}`);
                        }
                    })
                    .catch(err => {
                        // console.log(`graphql-request query orderId: ${id} error`,err); // GraphQL response errors
                        message.warning('网络或系统故障，请稍后重试');
                        sendError(err,`graphql-request query orderId: ${id} error`);
                    });
            }).catch((err)=>{
                message.warning('网络或系统故障，请稍后重试');
                // console.log(`create waitPay order error`,err);
                sendError(err,'create waitPay order error');
            });
        }else {
            message.warning('支付金额不能为0');
        }
    };

    render(){
        let { openid,subMagazine,unitPrice} = this.props;
        let subMonthCount = this.state.subMonth.length;
        let needPay = unitPrice * subMonthCount * this.state.subCount;
        return(
            <Query
                query={GET_CUSTOMER_AND_ORDER}
                variables={{openid,id:openid}}
            >
                {({ loading,error, data,refetch  }) => {
                    if (loading || this.state.payStatus) return <Loading contentHeight={window.innerHeight - 90} tip="加载中..."/>;
                    // if (loading) return <Loading contentHeight={window.innerHeight - 90} tip="加载中..."/>;
                    // if (error) return `Error!: ${error}`;
                    // console.log('UserSubConfirm data',data);

                    let username='',telephone='',area=[],school=[],grade='',gClass='';
                    if(data.customer){
                        username = data.customer.username;
                        telephone = data.customer.telephone;
                        area = data.customer.area;
                        school = data.customer.school;
                        grade = data.customer.grade;
                        gClass = data.customer.class;
                    }

                    return (
                        <div id="userSubConfirm">
                            <List renderHeader={() => '订阅'}>
                                <div className="list">
                                    <span style={{fontSize:'17px'}}>{subMagazine}</span>
                                    <span>¥{unitPrice}/月</span>
                                </div>
                                <div className="list" style={{border:'none'}}>
                                    <span>选择订阅期限</span>
                                </div>
                                <div id="selectSubTime">
                                    <Picker
                                        cols={2}
                                        extra="请选择"
                                        data={this.state.year_type}
                                        title="选择订阅期限"
                                        value={this.state.subTime}
                                        onOk={value => {
                                            // console.log('onOk subTime',value);
                                            this.setState({ subTime: value });
                                            let timeValue = this.getTimeValueArray(value[1]);
                                            // console.log('onOk timeValue',timeValue);
                                            this.setState({
                                                subYear:value[0],
                                                subMonth:timeValue
                                            });
                                            sessionStorage.setItem("subYear",value[0]);
                                            sessionStorage.setItem("subMonth",value[1]);
                                        }}
                                    >
                                        <List.Item arrow="horizontal" thumb={<Icon type="book" style={{color:'#108ee9',fontSize:20}}/>}>订阅期限</List.Item>
                                    </Picker>
                                </div>
                                <div className="list">
                                    <span style={{color:"#888"}}>1-2月,7-8月为合刊</span>
                                    <span>共<span style={{color:"#108ee9"}}>{this.state.subMonth.length}</span>个月</span>
                                </div>
                                <div className="list" >
                                    <span style={{alignItems: 'center', display: 'flex',fontSize:'17px'}}>订购数量</span>
                                    <span><Stepper
                                        style={{ width: '100%', minWidth: '100px' }}
                                        showNumber
                                        min={1}
                                        value={this.state.subCount}
                                        onChange={(value)=> {
                                            this.setState({ subCount:value });
                                            sessionStorage.setItem("subCount",value);
                                        }}
                                    /></span>
                                </div>
                                <Item
                                    thumb={<Icon type="environment-o"  style={{fontSize: 20, color: '#108ee9'}}/>}
                                    multipleLine
                                    extra={<Icon type="edit"  style={{fontSize: 20, color: '#108ee9'}}/>}
                                    onClick={() => { this.props.history.push("/address");}}
                                >
                                    收货人:&nbsp;&nbsp;{username} <br/>
                                    <Brief>{telephone}</Brief>
                                    <Brief>收货地址:&nbsp;&nbsp;{area["province"]} {area["city"]} {area["district"]}<br />
                                        {school["name"]}  {grade}年级  {gClass}班</Brief>
                                </Item>
                                <div className="list" style={{justifyContent: 'flex-end'}}>
                                    <span>合计:&nbsp;&nbsp;</span>
                                    <span style={{color:"#ff5f16"}}>¥{needPay}</span>
                                </div>
                            </List>
                            <Mutation mutation={CREATE_ORDER}
                                      onError={error=>sendError(error,'CREATE_ORDER')}
                            >
                                {(createOrder,{ loading, error }) => (
                                    <div>
                                        <List.Item>
                                            <button className="long-button"
                                                    onClick={()=>this.getBridgeReady(createOrder,needPay,telephone,refetch)}
                                            >确认并支付</button>
                                        </List.Item>
                                        {/*{loading && <p>Loading...</p>}*/}
                                        {/*{error && <p>Error :( Please try again</p>}*/}
                                    </div>
                                )}
                            </Mutation>
                        </div>
                    );
                }}
            </Query>
        )
    }
}

UserSubConfirm.defaultProps = {
    username:'',
    school:[''],
    telephone:''
};

export default withRouter(UserSubConfirm);