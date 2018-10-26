import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { Query,Mutation } from "react-apollo";
import $ from 'jquery';

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
import {CREATE_ORDER,GET_ORDER_BY_PROPS} from '../../graphql/order.js';
import {GET_CUSTOMER_BY_OPENID} from '../../graphql/customer.js';
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
            addContent:{}
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
    jsApiPay = (args,confirmContent,createOrder) => {
        // console.log('args res',args);
        let $this = this;
        function onBridgeReady(){
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', args,
                function(res){
                    // console.log('jsApiPay res',res);
                    // console.log('jsApiPay confirmContent',confirmContent);
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
                    if(res.err_msg === "get_brand_wcpay_request:ok" ) {
                        // 成功完成支付
                        message.success('支付成功，等待发货');
                        confirmContent.orderStatus = "finishPay";
                        createOrder({ variables:confirmContent });
                        $this.props.history.push("/#index=2&tab=0");
                    }
                    else{
                        message.error('支付失败，请稍后重试');
                        confirmContent.orderStatus = "waitPay";
                        createOrder({ variables:confirmContent });
                        $this.props.history.push("/#index=2&tab=1");
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
    getBridgeReady = (createOrder,needPay,telephone) => {
        let { openid,magazineId} = this.props;
        // console.log('needPay',needPay,typeof(needPay),needPay !== 0);

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
            id
        };

        console.log('confirmContent',confirmContent);
        console.log('tradeNo',id);
        if(needPay !== 0){
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
                    $this.jsApiPay(res,confirmContent,createOrder);
                },
                error(err){
                    console.log('onBridgeReady err',err);
                }
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
                query={GET_CUSTOMER_BY_OPENID}
                variables={{openid}}
            >
                {({ loading,error, data }) => {
                    if (loading) return <Loading contentHeight={window.innerHeight - 90} tip="数据加载中..."/>;
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
                                      update={(cache, { data:{createOrder} }) => {
                                          // console.log('createOrder',createOrder);
                                          let {orderStatus} = createOrder;
                                          // console.log('orderStatus',orderStatus);
                                          // Read the data from the cache for this query.
                                          const data = cache.readQuery({ query: GET_ORDER_BY_PROPS,variables: {openid,orderStatus}});
                                          // console.log('data orderList',data);
                                          // Add our channel from the mutation to the end.
                                          data.orderList.push(createOrder);
                                          // Write the data back to the cache.
                                          cache.writeQuery({ query: GET_ORDER_BY_PROPS,variables: {openid,orderStatus}, data });
                                          // console.log('CREATE_ORDER cache',cache);
                                      }}
                                      onError={error=>sendError(error,'CREATE_ORDER')}
                            >
                                {(createOrder,{ loading, error }) => (
                                    <div>
                                        <List.Item>
                                            <button className="long-button"
                                                    onClick={()=>this.getBridgeReady(createOrder,needPay,telephone)}
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
