import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
// import PropTypes from 'prop-types';
import { Query  } from "react-apollo";

import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/css';
import Carousel from 'antd-mobile/lib/carousel/index';
import 'antd-mobile/lib/carousel/style/css';
import Card from 'antd-mobile/lib/card/index';
import 'antd-mobile/lib/card/style/css';

import './subPage.css';
import {GET_MAGAZINE} from '../../graphql/magazine.js';

class SubPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: this.props.slideshow,
            imgHeight: 176,
            subMagazine:'',
            unitPrice:''
        }
    }

    componentDidMount() {
        // simulate img loading
        // console.log('slideshow',this.props.slideshow);
        setTimeout(() => {
            this.setState({
                data: this.props.slideshow,
            });
        }, 1000);
    }

    renderMagazine = () => {
        let {openid} = this.props;
        console.log('renderMagazine openid',openid);
        let contentHeight = window.innerHeight - 295;

        return <Query query={GET_MAGAZINE}
                       variables={{openid}}
        >
            {({ loading, error, data }) => {
                console.log('data',data);
                if (loading)
                    return <div style={{width:'100%',height:contentHeight}}>
                        <Spin style={{
                            position: 'relative',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%,-50%)'
                        }}/>
                    </div>;
                if (error) return <p>Error :(</p>;

                let userExists = data.user ? true : false;

                return data.magazineList.map((magazine, idx) => {
                    let {id,magazineName,picture,magazineIntro,unitPrice,enableSub} = magazine;
                    return <Card full key={idx}>
                        <Card.Header
                            thumb={picture}
                            extra={
                                <div className="magazine-title">
                                    <p>少年博览</p>
                                    <p>{magazineName}</p>
                                    <br/>
                                    <p>¥{unitPrice}/月</p>
                                </div>
                            }
                        />
                        <Card.Body>
                            <div className="magazine-footer">
                                <span>{magazineIntro}</span>
                                <div className="sub-button">
                                    <button style={{width:'60px',height:'30px'}}
                                            onClick={()=>{
                                                sessionStorage.setItem("magazineId",id);
                                                sessionStorage.setItem("subMagazine",magazineName);
                                                sessionStorage.setItem("unitPrice",unitPrice);
                                                sessionStorage.setItem("userExists",userExists);
                                                sessionStorage.setItem("magazineEnableSubTime",JSON.stringify(enableSub));
                                                if(userExists){
                                                    this.props.history.push(`/pay`);
                                                }else {
                                                    this.props.history.push(`/address`);
                                                }
                                            }}>订阅
                                    </button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                })
            }}
        </Query>
    };

    render(){
        let contentHeight = window.innerHeight - 95;

        return(
            <div className="scroll-content" style={{height: contentHeight}}>
                <div id="subPage">
                    <Carousel
                        autoplay={true}
                        infinite
                        beforeChange={(from, to) => {}}
                        afterChange={index => {}}
                    >
                        {this.state.data.map(val => (
                            <a
                                key={"slideshow"+val.id}
                                // href="#"
                                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                            >
                                <img
                                    src={val.picture}
                                    alt=""
                                    style={{ width: '100%', verticalAlign: 'top',maxHeight: '300px' }}
                                    onLoad={() => {
                                        // fire window resize event to change height
                                        window.dispatchEvent(new Event('resize'));
                                        this.setState({ imgHeight: 'auto' });
                                    }}
                                />
                            </a>
                        ))}
                    </Carousel>
                    {this.renderMagazine()}
                </div>
            </div>
        )
    }
}

SubPage.defaultProps = {
    magazineList: [],
};

export default withRouter(SubPage);
