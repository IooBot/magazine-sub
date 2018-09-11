import React, {Component} from 'react';

import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';
import List from 'antd-mobile/lib/list/index';
import 'antd-mobile/lib/list/style/css';
import Picker from 'antd-mobile/lib/picker/index';
import 'antd-mobile/lib/picker/style/css';

class SelectGradeClass extends Component{
    constructor(props){
        super(props);

        this.state = {
            gradeClass:'',
        }
    }

    componentWillReceiveProps(nextProps){
        // console.log('SelectGradeClass componentWillReceiveProps this.props',this.props,nextProps);
        let {schoolType,getInputContent} = this.props;
        if(schoolType !== nextProps.schoolType){
            let grade = 1;
            if(nextProps.schoolType === "中学"){
                grade = 7;
            }
            this.setState({gradeClass:[grade,1]});
            getInputContent("gradeClass",[grade,1]);
        }
    }

    getGradeClassArr = (startGrade,endGrade,classCount) => {
        let i = startGrade, j = 0, gradeList = [], classList = [], grade_class = [];

        while (i <= endGrade) {
            gradeList.push({
                label: `${i}年级`,
                value: i
            });
            i++;
        }
        while (j < classCount) {
            classList.push({
                label: `${j + 1}班`,
                value: j + 1
            });
            j++;
        }
        grade_class = [gradeList,classList];
        // console.log('grade_class',grade_class);
        return grade_class;
    };

    render(){
        let {schoolType,gradeClass,getInputContent} = this.props;
        let gradeClass1 = this.state.gradeClass || gradeClass;
        // console.log('gradeClass1',gradeClass1);

        let startGrade,endGrade;
        switch(schoolType){
            case '小学':
                startGrade = 1;endGrade = 6;
                break;
            case '中学':
                startGrade = 7;endGrade = 9;
                break;
            default:
                startGrade = 1;endGrade = 9;
        }
        let grade_class = this.getGradeClassArr(startGrade,endGrade,30);

        return(
            <Picker
                cols={2}
                data={grade_class}
                title="所在年级-班级"
                cascade={false}
                extra="请选择年级-班级"
                value={gradeClass1}
                onOk={value => {
                    // console.log('onOk grade',value);
                    this.setState({ gradeClass: value });
                    this.props.changeSchoolTypeByGrade(value[0]);
                    getInputContent("gradeClass",value);
                }}
            >
                <List.Item arrow="horizontal" thumb={<Icon type="book" style={{color:'#ff5f16',fontSize:20}}/>}>年级-班级</List.Item>
            </Picker>
        )
    }
}

export default SelectGradeClass;