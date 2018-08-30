import React, {Component} from 'react';

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import Picker from 'antd-mobile/lib/picker/index';
import 'antd-mobile/lib/picker/style/css';

class SelectSubTime extends Component{
    constructor(props){
        super(props);

        this.state = {
            subTime:'',
        }
    }

    changeSubTimeList = (subTime) => {
        // eslint-disable-next-line
        let nowTime = `${new Date().getFullYear()}` + `${new Date().getMonth()+1}`;
        let res = [],res1 = [];
        let timeType1 = {label:"全年",value:[1,2,3,4,5,6,7,8,9,10,11,12]};
        let timeType2 = {label:"上半年",value:[1,2,3,4,5,6]};
        let timeType3 = {label:"下半年",value:[7,8,9,10,11,12]};

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
        console.log("changeSubTimeList subTimeList",res1);
        return res1;
    };

    render(){
        // let {openid} = this.props;
        let subTime = [2017,2018,2019,2020];
        let year_type = this.changeSubTimeList(subTime);
        let defaultSubTime = [year_type[0].value,year_type[0].children[0].value];

        let subTime1 = this.state.subTime || defaultSubTime;
        console.log('subTime1',subTime1);
        return(
            <Picker
                cols={2}
                extra="请选择"
                data={year_type}
                title="选择订阅时间期限"
                value={subTime1}
                onOk={value => {
                    console.log('onOk subTime',value);
                    this.setState({ subTime: value });
                    // this.props.changeSchoolTypeByGrade(value[0]);
                    // updateCustomer({ variables: { openid, grade: value[0], class:value[1] }});
                }}
            >
                <List.Item arrow="horizontal" thumb={<Icon type="book" style={{color:'#ff5f16',fontSize:20}}/>}>订阅期限</List.Item>
            </Picker>
        )
    }
}

export default SelectSubTime;