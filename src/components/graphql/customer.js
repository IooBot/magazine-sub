import gql from "graphql-tag";
import {customer_order} from './order';

const customer_Content = gql`
    fragment customerContent on Customer {
        openid,
        username
        telephone
        grade
        class
        area {
            city
            district
            province
            name
        }
        school{
            name
            type
        }
    }
`;

export const GET_CUSTOMER_BY_OPENID = gql`
    query getCustomer($openid: String) {
        customer:customer_by_openid(openid: $openid) {
            ...customerContent
        }
    }
    ${customer_Content}
`;

export const GET_CUSTOMER_AND_ORDER = gql`
    query getCustomerAndOrder($openid: String,$id:String) {
        customer:customer_by_openid(openid: $openid) {
            ...customerContent
        }
        finishPayOrder:order_by_props(openid: $openid,orderStatus:"finishPay"){
            ...customerOrder
        }
        waitPayOrder:order_by_props(openid: $openid,orderStatus:"waitPay"){
            ...customerOrder
        }
        ishaveOrder:order_by_id(id:$id){
            orderStatus
        }
    }
    ${customer_Content}
    ${customer_order}
`;

export const CREATE_CUSTOMER = gql`
    mutation createCustomer($area_name: String!,$class: Int!,$grade: Int!,$openid: String!,$school_name: String!,
    $telephone: String,$username: String,$createAt:String,$updateAt:String) {
        createCustomer:create_customer(area_name:$area_name,class:$class,grade:$grade,openid: $openid,school_name: $school_name,
            telephone: $telephone,username:$username,createAt:$createAt,updateAt:$updateAt) {
            ...customerContent
        }
    }
    ${customer_Content}
`;

export const UPDATE_CUSTOMER = gql`
    mutation updateCustomer($openid: String!,$username:String,$telephone:String,$grade:Int,$class:Int,$area_name:String,$school_name:String,
    $createAt:String,$updateAt:String) {
        updateCustomer:update_customer(openid: $openid,username:$username,telephone:$telephone,grade:$grade,class:$class,
            area_name:$area_name,school_name:$school_name,updateAt:$updateAt) {
            ...customerContent
        }
    }
    ${customer_Content}
`;