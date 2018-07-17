import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import moment from 'moment';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import Stepper from 'antd-mobile/lib/stepper/index';
import 'antd-mobile/lib/stepper/style/css';
import DatePicker from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style/css';
import message from 'antd/lib/message';
import 'antd/lib/message/style/css';
// import $ from 'jquery';

// 日期选择汉化
import 'moment/locale/zh-cn';
import './userSubConfirm.css';
moment.locale('zh-CN');
// import { XMLSign } from '../../../../api/wx.js';
// let config = require('../../../../api/config.js');
const Item = List.Item;
const Brief = Item.Brief;
const { MonthPicker } = DatePicker;

const CREATE_ORDER = gql`
 mutation createOrder($id:ID!,$magazineId: String!,$openid:String!,$subCount:Int!,$subMonthCount:Int!,
    $havePay:Float!,$startDate:String,$endDate:String,$createAt:String,$orderStatus:String)
    {
    createOrder:create_order(
    id:$id,
    magazineId : $magazineId, openid :$openid,
    subCount : $subCount, subMonthCount : $subMonthCount, havePay: $havePay,
    startDate : $startDate, endDate: $endDate,
    createAt: $createAt, orderStatus: $orderStatus){
    id
    }
}
`;

class UserSubConfirm extends Component{
    constructor(props){
        super(props);
        this.state = {
            subCount:1,
            startDate:'',
            endDate:''
        }
    }

    componentWillMount(){
        // document.title = '个人中心';
        let startDate = moment().add(1,'month').format('YYYY-MM');
        let endDate = moment().add(1,'years').format('YYYY-MM');
        // console.log('startDate',startDate,'endDate',endDate);

        this.setState({
            startDate:startDate,
            endDate:endDate
        });
    }

    onChange = (date, dateString,type) => {
        // console.log(date, dateString);

        if(type === 'start'){
            this.setState({startDate:dateString});
        }else {
            this.setState({endDate:dateString});
        }
    };

    disabledDate = (current,type) => {
        // console.log('current1',current.valueOf());
        // console.log('current1',new Date(current.valueOf()));
        // console.log('today end,moment().endOf('day').format());

        // 不同月份 noMonth:Number
        let noMonth = new Date(current.valueOf()).getMonth()+1;

        if(type === 'start'){
            // Can not select days before today and today  true:隐藏不可选
            // console.log('start', current && moment().endOf('day') >= current  || noMonth == 2 || noMonth == 8);
            // eslint-disable-next-line
            return current && moment().endOf('day') >= current || noMonth === 2 || noMonth === 8;
        }else {
            // eslint-disable-next-line
            return current && moment().endOf('day') >= current || noMonth === 7 || noMonth === 1;
        }
    };

    // prepay_id微信生成的预支付会话标识，用于后续接口调用中使用，该值有效期为2小时
    // jsApiPay = (prepay_id,confirmContent) => {
    //     console.log('prepay_id',prepay_id);
    //     let timeStamp = String(Math.floor(new Date().getTime()/1000));
    //     let nonceStr = String(Math.random().toString(36).substr(2));
    //     let args = {
    //         "appId" : config.appID,     //公众号名称，由商户传入
    //         "timeStamp": timeStamp,         //时间戳，自1970年以来的秒数：当前的时间
    //         "nonceStr" : nonceStr, // 随机字符串，不长于32位。
    //         "package" : "prepay_id="+prepay_id,    // 统一下单接口返回的prepay_id参数值
    //         "signType" : "MD5",         //微信签名方式
    //     };
    //     args.paySign = XMLSign(args);    //微信签名 调用签名算法
    //     let $this = this;
    //
    //     WeixinJSBridge.invoke(
    //         'getBrandWCPayRequest', args,
    //         function(res){
    //             // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回 ok，但并不保证它绝对可靠。
    //             if(res.err_msg == "get_brand_wcpay_request:ok" ) {
    //                 // 成功完成支付
    //                 message.success(`支付成功，等待发货`);
    //                 Meteor.call('order.insert', confirmContent);
    //                 $this.props.history.push("/#index=2&tab=0");
    //             }
    //             else{
    //                 message.error('支付失败，请稍后重试');
    //                 Meteor.call('orderNotPaid.insert', confirmContent);
    //                 $this.props.history.push("/#index=2&tab=1");
    //             }
    //         }
    //     );
    // };

    onBridgeReady = (createOrder,confirmContent,needPay) => {
        // console.log('confirmContent',confirmContent);
        // console.log('needPay',needPay,typeof(needPay),needPay != 0);
        confirmContent.createAt = moment().format('YYYY-MM-DD HH:mm:ss');
        confirmContent.id = Date.now();

        if(needPay !== 0){
            // message.success('支付成功，等待发货');
            // confirmContent.orderStatus = "finishPay";
            // createOrder({ variables: confirmContent });
            // this.props.history.push("/#index=2&tab=0");

            message.error('支付失败，请稍后重试');
            confirmContent.orderStatus = "waitPay";
            createOrder({ variables: confirmContent });
            this.props.history.push("/#index=2&tab=1");

            // let $this = this;
            // $.ajax({
            //     url: '/api/wxPay',
            //     type: 'get',
            //     data: {
            //         needPay,
            //         openid: $this.props.openid
            //     },
            //     dataType: 'json',
            //     success(res){
            //         // console.log('onBridgeReady res',res);
            //         if(res.code == 200){
            //             $this.jsApiPay(res.data,confirmContent);
            //         }
            //     },
            //     error(err){
            //         console.log('onBridgeReady err',err);
            //     }
            // });
        }else {
            message.warning('支付金额不能为0');
        }

    };

    render(){
        // eslint-disable-next-line
        let { openid,magazineId,subMagazine,unitPrice,username,gradeClass,school,schoolArea} = this.props;
        // console.log('userInfo',username,gradeClass,school,schoolArea);
        console.log('userInfo openid',openid,magazineId);
        let startDate = moment().add(1,'month').format('YYYY-MM');
        let endDate = moment().add(1,'years').format('YYYY-MM');
        // console.log('startDate',startDate,'endDate',endDate);
        // console.log('startDate1',this.state.startDate,'endDate1',this.state.endDate);

        let subMonthCount;

        if(this.state.endDate){
            let startYear = this.state.startDate.substr(0,4);
            let endYear = this.state.endDate.substr(0,4);
            // console.log('startYear',startYear,'endYear',endYear);
            if(startYear === endYear){
                let startMonth = this.state.startDate.substr(5,2);
                let endMonth = this.state.endDate.substr(5,2);
                if(endMonth >= startMonth){
                    // eslint-disable-next-line
                    subMonthCount = parseInt(endMonth) - parseInt(startMonth) + 1;
                }else {
                    subMonthCount = 0;
                }
            }else {
                // eslint-disable-next-line
                subMonthCount = (12 - parseInt(this.state.startDate.substr(5,2)) + 1 ) + parseInt(this.state.endDate.substr(5,2));
            }
        }else {
            let startMonth = this.state.startDate.substr(5,2);
            if(startMonth === '01' || startMonth === '02'|| startMonth === '07' || startMonth === '08'){
                subMonthCount = 2;
            }else {
                subMonthCount = 1;
            }
        }

        let needPay = (unitPrice * subMonthCount * this.state.subCount).toFixed(2);
        // console.log('needPay',needPay);
        // console.log('subMonthCount',subMonthCount);
        const confirmContent = {
            openid,
            magazineId,
            subCount:this.state.subCount,
            startDate:this.state.startDate,
            endDate:this.state.endDate,
            havePay:needPay,
            subMonthCount
        };

        return(
            <div id="userSubConfirm">
                <List renderHeader={() => '订阅'}>
                    <div className="list">
                        <span style={{fontSize:'17px'}}>{subMagazine}</span>
                        <span>¥{unitPrice}/月</span>
                    </div>
                    <div className="list" style={{border:'none'}}>
                        <span>选择开始-结束期号</span>
                    </div>
                    <div className="list" style={{border:'none'}}>
                        <span>
                            <MonthPicker
                                size="small"
                                allowClear={false}
                                defaultValue={moment(startDate, 'YYYY-MM')}
                                disabledDate={current =>this.disabledDate(current,'start')}
                                placeholder="开始日期"
                                onChange={(date, dateString)=>this.onChange(date, dateString,'start')}
                            />
                        </span>
                        <span>&nbsp;—&nbsp;</span>
                        <span>
                            <MonthPicker
                                size="small"
                                defaultValue={moment(endDate, 'YYYY-MM')}
                                disabledDate={current=>this.disabledDate(current,'end')}
                                placeholder="结束日期"
                                onChange={(date, dateString)=>this.onChange(date, dateString,'end')}
                            />
                        </span>
                    </div>
                    <div className="list">
                        <span>1-2月,7-8月为合刊</span>
                        <span>共{subMonthCount}个月</span>
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
                        收货人:&nbsp;&nbsp;{username}
                        <Brief>收货地址:&nbsp;&nbsp;{schoolArea[0]}  {schoolArea[1]}  {schoolArea[2]}<br />
                            {school[0]}  {gradeClass[0]}年级  {gradeClass[1]}班</Brief>
                    </Item>
                    <div className="list" style={{justifyContent: 'flex-end'}}>
                        <span>合计:&nbsp;&nbsp;</span>
                        <span style={{color:"#ff5f16"}}>¥{needPay}</span>
                    </div>
                </List>
                <Mutation mutation={CREATE_ORDER}>
                    {(createOrder, { loading, error }) => (
                        <div>
                            <List.Item>
                                <button className="long-button"
                                        onClick={()=>this.onBridgeReady(createOrder,confirmContent,needPay)}
                                >确认并支付</button>
                            </List.Item>
                            {loading && <p>Loading...</p>}
                            {error && <p>Error :( Please try again</p>}
                        </div>
                    )}
                </Mutation>
            </div>
        )
    }
}

UserSubConfirm.defaultProps = {
    username:'',
    gradeClass:['',''],
    school:[''],
    schoolArea:['','',''],
    telephone:''
};

export default withRouter(UserSubConfirm);
