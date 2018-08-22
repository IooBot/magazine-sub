import React, {Component} from 'react';
import { Query } from "react-apollo";

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import Picker from 'antd-mobile/lib/picker/index';
import 'antd-mobile/lib/picker/style/css';
// eslint-disable-next-line
import './userInput.css';
import {GET_SCHOOL_BY_PROPS} from '../../graphql/school.js';
import SelectGradeClass from './SelectGradeClass.jsx';

class SelectSchool extends Component{
    constructor(props){
        super(props);

        this.state = {
            school:'',
            grade:''
        }
    }

    shouldComponentUpdate(nextProps,nextState){
        console.log('SelectSchool shouldComponentUpdate this.props',this.props,nextProps);
        console.log('SelectSchool shouldComponentUpdate this.state',this.state,nextState);
        if(nextProps.school !== nextState.school[0]){
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps){
        console.log('SelectSchool componentWillReceiveProps props',this.props,nextProps);
        console.log('SelectSchool componentWillReceiveProps this.state',this.state);

        let {area_name,gradeClass} = this.props;
        console.log('area_name',area_name,"nextProps.area_name",nextProps.area_name);
        if(area_name !== nextProps.area_name){
            let type = this.state.grade || gradeClass[0] > 6 ? "中学" : "小学";
            this.setState({school:[type,""]});
        }
    }

    changeSchoolTypeByGrade = (grade) => {
        console.log('changeSchoolTypeByGrade grade',grade);
        this.setState({grade:grade});
    };

    changeSchoolList = (school) => {
        let hash = {},i = 0,res = [],res1 = [];

        school.forEach(function(item) {
            let {name,type} = item;
            hash[type] ? res[hash[type] - 1].name.push(name) : hash[type] = ++i && res.push({
                type,
                name: [name],
            });
        });
        // console.log("Schools are classified by type",res);
        res.forEach(function(item) {
            let {type,name} = item;
            let schoolName = name.map(item => {
                return {
                    label: item,
                    value: item,
                }
            });
            res1.push({
                value: type,
                label: type,
                children:schoolName
            });
        });
        // console.log("Change the school structure",res1);
        // console.log(JSON.stringify(res1));
        return res1;
    };

    render(){
        // eslint-disable-next-line
        let {herderContent,school,area_name,updateCustomer,openid,gradeClass,getInputContent} = this.props;
        console.log('SelectSchool area_name',area_name);

        return(
            <Query
                query={GET_SCHOOL_BY_PROPS}
                variables={{area_name}}
            >
                {({ loading, error, data }) => {
                    if (loading) return null;
                    if (error) return `Error!: ${error}`;
                    console.log('SelectSchool data: get schoolList',data);
                    let schoolList = this.changeSchoolList(data.school);
                    console.log('schoolList',schoolList);

                    console.log('this.state.school',this.state.school);

                    let school1 = this.state.school || school;
                    console.log('SelectSchool school1',school1,school1[0]);
                    return (
                        <div>
                            <Picker
                                cols={2}
                                extra="请选择学校"
                                data={schoolList}
                                title="所在学校"
                                value={school1}
                                onOk={value => {
                                    // console.log('onOk school', value);
                                    this.setState({ school: value });

                                    if(herderContent === '收货信息'){
                                        updateCustomer({ variables: { openid, school_name: value[1]} });
                                    }else {
                                        getInputContent("school_name",value[1]);
                                    }
                                }}
                            >
                                <List.Item arrow="horizontal" thumb={<Icon type="team" style={{color:'#ff5f16',fontSize:20}}/>}
                                           style={{borderBottom:'none!important'}}
                                >学校</List.Item>
                            </Picker>
                            <SelectGradeClass
                                openid={openid}
                                herderContent={herderContent}
                                schoolType={school1[0]}
                                gradeClass={gradeClass}
                                updateCustomer={updateCustomer}
                                changeSchoolTypeByGrade={this.changeSchoolTypeByGrade}
                                getInputContent={getInputContent}
                            />
                        </div>
                    );
                }}
            </Query>
        )
    }
}

export default SelectSchool;