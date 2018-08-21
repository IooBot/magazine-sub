import React, {Component} from 'react';
import { createForm } from 'rc-form';
import { Query } from "react-apollo";

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import Picker from 'antd-mobile/lib/picker/index';
import 'antd-mobile/lib/picker/style/css';
// eslint-disable-next-line
import './userInput.css';
import {GET_AREA} from '../../graphql/area.js';
import SelectSchool from './SelectSchool.jsx';

class SelectDistrict extends Component{
    constructor(props){
        super(props);

        this.state = {
            schoolArea:'',
            schoolDistrict:'',
            school:'',
            gradeClass:''
        }
    }

    getArea = (area) => {
        let hash = {},obj = {},i = 0,res = [],res1 = [];
        area.forEach(function(item) {
            let {city,name,district,province} = item;
            obj = {label:district,name:name};
            hash[city] ? res[hash[city] - 1].district.push(obj) : hash[city] = ++i && res.push({
                district: [obj],
                city,
                province
            });
        });
        console.log(res);
        res.forEach(function(item) {
            let {city,district,province} = item;
            let district1 = district.map(item => {
                let {label,name} = item;
                return {
                    label: label,
                    value: name,
                }
            });
            res1.push({
                value: province,
                label: province,
                children:[{value:city,
                    label:city,
                    children: district1
                }]
            });
        });
        console.log(res1);
        // console.log(JSON.stringify(res1));
        return res1;

        // [{"district":[{"label":"蜀山区","name":"hefei-shushan"},{"label":"高新区","name":"hefei-gaoxin"},{"label":"瑶海区","name":"hefei-yaohai"},
        // {"label":"包河区","name":"hefei-baohe"}],"city":"合肥市","province":"安徽省"}]

        // console.log(JSON.stringify(res1));
        // [{"value":"安徽省","label":"安徽省","children":[{"value":"合肥市","label":"合肥市",
        // "children":[[{"label":"蜀山区","value":"hefei-shushan"},{"label":"高新区","value":"hefei-gaoxin"},{"label":"瑶海区","value":"hefei-yaohai"},{"label":"包河区","value":"hefei-baohe"}]]}]}]
    };

    render(){
        const { getFieldProps } = this.props.form;
        // eslint-disable-next-line
        let {herderContent,area,school,gradeClass,updateCustomer,openid} = this.props;

        return(
            <Query query={GET_AREA}>
                {({ loading, error, data }) => {
                    if (loading) return null;
                    if (error) return `Error!: ${error}`;
                    console.log('SelectDistrict data',data);
                    let schoolArea = [area["province"],area["city"],area["name"]];
                    let schoolArea1 = this.state.schoolArea || schoolArea;
                    let schoolDistrict = this.state.schoolDistrict || area["name"];
                    console.log('schoolDistrict',schoolDistrict);
                    let school1 = [school.type,school.name];
                    console.log('school1',school1);
                    let gradeClass1 = this.state.gradeClass || gradeClass;
                    console.log('gradeClass1',gradeClass1);
                    let districtData = this.getArea(data.area);
                    return (
                        <div>
                            <Picker
                                extra="请选择学校所在地区"
                                data={districtData}
                                title="学校所在地区"
                                {...getFieldProps('district', {
                                    initialValue: schoolArea1,
                                })}
                                onOk={(value) => {
                                    this.setState({ schoolArea: value,schoolDistrict:value[2]  });
                                    console.log('schoolArea onOk', value);
                                    // console.log('changeArea', value[2]);

                                    if(herderContent === '收货信息'){
                                        updateCustomer({ variables: { openid, area_name: value[2] } });
                                    }
                                }}
                            >
                                <List.Item
                                    arrow="horizontal"
                                    thumb={<Icon type="environment-o" style={{color:'#ff5f16',fontSize:20}}/>}
                                    style={{borderBottom:'none!important'}}
                                >学校地区</List.Item>
                            </Picker>
                            <SelectSchool
                                herderContent={herderContent}
                                school={school1}
                                openid={openid}
                                area_name={schoolDistrict}
                                updateCustomer={updateCustomer}
                                gradeClass={gradeClass1}
                            />
                        </div>
                    );
                }}
            </Query>
        )
    }
}

export default (createForm()(SelectDistrict));