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

// 日期选择汉化
import 'moment/locale/zh-cn';
import './userSubConfirm.css';
// eslint-disable-next-line
import {CREATE_ORDER,GET_ORDER_BY_PROPS} from '../../graphql/order.js';
import {GET_CUSTOMER_BY_OPENID} from '../../graphql/customer.js';
import { XMLSign } from '../../../api/wx.js';

moment.locale('zh-CN');
let config = require('../../../api/config.js');
const Item = List.Item;
const Brief = Item.Brief;

function changeSubTimeList(subTime) {
    // eslint-disable-next-line
    let nowTime = `${new Date().getFullYear()}` + `${new Date().getMonth()+1}`;
    let res = [],res1 = [];
    let timeType1 = {label:"全年",value:"1"};   // value为数组[1,2,3,4,5,6,7,8,9,10,11,12],label匹配时无法显示
    let timeType2 = {label:"上半年",value:"2"};
    let timeType3 = {label:"下半年",value:"3"};

    subTime.forEach(function(item) {
        let time1 = `${item}1`;        // 20191
        let time2 = `${item}7`;        // 20197
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
        // document.title = '个人中心';
        let subTime = sessionStorage.getItem("magazineEnableSubTime");
        // console.log('magazineEnableSubTime',subTime);
        let year_type = changeSubTimeList(JSON.parse(subTime));
        // console.log('year_type',year_type);

        let defaultSubTime = [year_type[0].value,year_type[0].children[0].value];
        // console.log('defaultSubTime',defaultSubTime);
        let timeValue = this.getTimeValueArray(defaultSubTime[1]);
        // console.log('timeValue',timeValue);
        this.setState({
            year_type:year_type,
            subTime:defaultSubTime,
            subYear:defaultSubTime[0],
            subMonth:timeValue
        });
    }

    getTimeValueArray = (value) => {
        let result = {"1":[1,2,3,4,5,6,7,8,9,10,11,12], "2":[1,2,3,4,5,6], "3":[7,8,9,10,11,12]}[value];
        return result;
    };

    getRandomNum = ()=> {
        // 生成3位随机数
        let char = '0123456789', num = '';
        for(let i = 0; i < 3; i++){
            num += char[Math.floor(char.length*Math.random())]
        }
        return num;
    };

    // prepay_id微信生成的预支付会话标识，用于后续接口调用中使用，该值有效期为2小时
    jsApiPay = (prepay_id,confirmContent,createOrder) => {
        console.log('prepay_id',prepay_id);
        console.log('confirmContent',confirmContent);
        let timeStamp = String(Math.floor(new Date().getTime()/1000));
        let nonceStr = String(Math.random().toString(36).substr(2));
        let args = {
            "appId" : config.appID,                  //公众号名称，由商户传入
            "timeStamp": timeStamp,                 //时间戳，自1970年以来的秒数：当前的时间
            "nonceStr" : nonceStr,                  // 随机字符串，不长于32位。
            "package" : "prepay_id="+prepay_id,    // 统一下单接口返回的prepay_id参数值
            "signType" : "MD5",                     //微信签名方式
        };
        args.paySign = XMLSign(args);    //微信签名 调用签名算法
        let $this = this;

        function onBridgeReady(){
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', args,
                function(res){
                    console.log('jsApiPay res',res);
                    console.log('jsApiPay confirmContent',confirmContent);
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

        console.log('needPay',needPay,typeof(needPay),needPay !== 0);

        let createAt = moment().format('YYYY-MM-DD HH:mm:ss');
        let tag = telephone.replace(/[^0-9]/ig,"").slice(-4);
        let id = createAt.replace(/[^0-9]/ig,"").substr(2)+tag;
        console.log('id',id);
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
        // Math.floor(new Date().getTime()/1000)
        // console.log('onBridgeReady confirmContent',confirmContent);

        if(needPay !== 0){
            // message.success('支付成功，等待发货');
            // confirmContent.orderStatus = "finishPay";
            // createOrder({ variables:confirmContent });
            // this.props.history.push("/#index=2&tab=0");
            // console.log('onBridgeReady confirmContent',confirmContent);

            // message.error('支付失败，请稍后重试');
            // confirmContent.orderStatus = "waitPay";
            // createOrder({ variables:confirmContent });
            // this.props.history.push("/#index=2&tab=1");

            let $this = this;
            $.ajax({
                url: '/payid',
                type: 'get',
                data: {
                    needPay:parseInt(needPay * 10 / 75,10),
                    openid: $this.props.openid
                },
                dataType: 'json',
                success(res){
                    console.log('onBridgeReady res',res);
                    // if(res.code === 200){
                        $this.jsApiPay(res,confirmContent,createOrder);
                    // }
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
        // console.log('year_type',this.state.year_type);
        // console.log('subYear',this.state.subYear,'subMonth',this.state.subMonth);
        // console.log('subTime',this.state.subTime);
        let { openid,subMagazine,unitPrice} = this.props;
        // console.log('userInfo',openid,subMagazine,unitPrice);

        let subMonthCount = this.state.subMonth.length;
        let needPay = unitPrice * subMonthCount * this.state.subCount;
        return(
            <Query
                query={GET_CUSTOMER_BY_OPENID}
                variables={{openid}}
            >
                {({ loading,error, data }) => {
                    if (loading) return null;
                    if (error) return `Error!: ${error}`;
                    console.log('UserSubConfirm data',data);

                    let username='',telephone='',area=[],school=[],grade='',gClass='';
                    if(data.customer){
                        username = data.customer.username;
                        telephone = data.customer.telephone;
                        area = data.customer.area;
                        school = data.customer.school;
                        grade = data.customer.grade;
                        gClass = data.customer.class;
                    }
                    // let {username,telephone,area,school,grade} = data.customer;
                    // console.log('username',username);
                    // let gClass = data.customer.class;

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
                                            console.log('onOk subTime',value);
                                            this.setState({ subTime: value });
                                            let timeValue = this.getTimeValueArray(value[1]);
                                            console.log('onOk timeValue',timeValue);
                                            this.setState({
                                                subYear:value[0],
                                                subMonth:timeValue
                                            });
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
                                        onChange={(value)=>this.setState({ subCount:value })}
                                    /></span>
                                </div>
                                <Item
                                    thumb={<Icon type="environment-o"  style={{fontSize: 20, color: '#108ee9'}}/>}
                                    multipleLine
                                    extra={<Icon type="edit"  style={{fontSize: 20, color: '#108ee9'}}/>}
                                    onClick={(e) => { this.props.history.push("/address");}}
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
                                          console.log('createOrder',createOrder);
                                          let {orderStatus} = createOrder;
                                          console.log('orderStatus',orderStatus);
                                          // Read the data from the cache for this query.
                                          const getQuery = { query: GET_ORDER_BY_PROPS,variables: {openid,orderStatus}};
                                          const data = cache.readQuery(getQuery);
                                          console.log('data',data);
                                          // Add our channel from the mutation to the end.
                                          data.orderList.push(createOrder);
                                          // Write the data back to the cache.
                                          cache.writeQuery({ ...getQuery, data });
                                          console.log('CREATE_ORDER cache',cache);
                                      }}
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
