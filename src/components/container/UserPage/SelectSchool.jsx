import React, {Component} from 'react';
import { Query } from "react-apollo";

import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/css';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import Picker from 'antd-mobile/lib/picker/index';
import 'antd-mobile/lib/picker/style/css';

import {GET_SCHOOL_BY_PROPS} from '../../graphql/school.js';
import SelectGradeClass from './SelectGradeClass.jsx';
import {Loading}  from "../HomePage/HomePage.jsx";

class SelectSchool extends Component{
    constructor(props){
        super(props);

        this.state = {
            school:'',
            grade:''
        }
    }

    shouldComponentUpdate(nextProps,nextState){
        if(nextProps.school !== nextState.school[0]){
            return true;
        }
        return false;
    }

    componentWillReceiveProps(nextProps){
        let {area_name,gradeClass} = this.props;
        // console.log('area_name',area_name,"nextProps.area_name",nextProps.area_name);
        if(area_name !== nextProps.area_name){
            let type = this.state.grade || gradeClass[0] > 6 ? "中学" : "小学";
            this.setState({school:[type,""]});
        }
    }

    changeSchoolTypeByGrade = (grade) => {
        // console.log('changeSchoolTypeByGrade grade',grade);
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
        let {school,area_name,gradeClass,getInputContent} = this.props;

        return(
            <Query query={GET_SCHOOL_BY_PROPS} variables={{area_name}}>
                {({ loading, error, data }) => {
                    if (loading) return <Loading contentHeight={40} tip=""/>;
                    // if (error) return `Error!: ${error}`;
                    // console.log('SelectSchool data: get schoolList',data);
                    let schoolList = this.changeSchoolList(data.school);
                    let school1 = this.state.school || school;

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
                                    getInputContent("school_name",value[1]);
                                    getInputContent("schoolArr",value);
                                }}
                            >
                                <List.Item arrow="horizontal" thumb={<Icon type="team" style={{color:'#ff5f16',fontSize:20}}/>}
                                           style={{borderBottom:'none!important'}}
                                >学校</List.Item>
                            </Picker>
                            <SelectGradeClass
                                schoolType={school1[0]}
                                gradeClass={gradeClass}
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