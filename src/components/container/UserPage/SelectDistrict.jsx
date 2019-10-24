import React, {Component} from 'react';
import { createForm } from 'rc-form';
import { Query } from "react-apollo";

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import Picker from 'antd-mobile/lib/picker/index';
import 'antd-mobile/lib/picker/style/css';

import {GET_AREA} from '../../graphql/area.js';
import SelectSchool from './SelectSchool.jsx';
import {Loading}  from "../HomePage/HomePage.jsx";

class SelectDistrict extends Component{
    constructor(props){
        super(props);

        this.state = {
            userSchoolArea:'',
            userSchoolDistrict:'',
        }
    }

    changeAreaList = (area) => {
        // console.log('area',area);
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
        // console.log("area are classified by city",JSON.stringify(res));
        res.forEach(function(item) {
            let {city,district,province} = item;
            let district1 = district.map(item => {
                let {label,name} = item;
                return {
                    label: label,
                    value: `${name}+${label}`,
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
        // console.log("Change the area structure",res1);
        // console.log(JSON.stringify(res1));
        return res1;
    };

    render(){
        const { getFieldProps } = this.props.form;
        let {area = [],school = [],gradeClass = "",getInputContent} = this.props;

        return(
            <Query query={GET_AREA}>
                {({ loading, error, data }) => {
                    if (loading) return <Loading contentHeight={40} tip=""/>;
                    // if (error) return `Error!: ${error}`;
                    let districtData = this.changeAreaList(data.area);
                    let userSchoolArea = [area["province"] || "",area["city"] || "",`${area["name"]}+${area["district"]}` || ""];
                    let userSchoolArea1 = this.state.userSchoolArea || userSchoolArea;
                    let userSchoolDistrict = this.state.userSchoolDistrict || area["name"] ;
                    let school1 = [school.type ,school.name];

                    return (
                        <div>
                            <Picker
                                extra="请选择学校所在地区"
                                data={districtData}
                                title="学校所在地区"
                                {...getFieldProps('district', {
                                    initialValue: userSchoolArea1,
                                })}
                                onOk={(value) => {
                                    // console.log('district value',value);
                                    let area_name = value[2].split("+")[0];
                                    let district = value[2].split("+")[1];
                                    this.setState({ userSchoolArea: value, userSchoolDistrict:area_name});
                                    getInputContent("area_name",area_name);
                                    getInputContent("school_name"," ");
                                    getInputContent("areaArr",[value[0],value[1],district]);
                                }}
                            >
                                <List.Item
                                    arrow="horizontal"
                                    thumb={<Icon type="environment-o" style={{color:'#ff5f16',fontSize:20}}/>}
                                    style={{borderBottom:'none!important'}}
                                >学校地区</List.Item>
                            </Picker>
                            <SelectSchool
                                school={school1}
                                area_name={userSchoolDistrict}
                                gradeClass={gradeClass}
                                getInputContent={getInputContent}
                            />
                        </div>
                    );
                }}
            </Query>
        )
    }
}

export default (createForm()(SelectDistrict));
