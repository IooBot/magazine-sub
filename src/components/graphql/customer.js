import gql from "graphql-tag";

export const GET_CUSTOMER_BY_OPENID = gql`
    query getCustomer($openid: String!) {
        customer:customer_by_openid(openid: $openid) {
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
    }
`;

export const GET_USERNAME_BY_OPENID = gql`
    query getUsername($openid: String!) {
        username:customer_by_openid(openid: $openid) {
            username
        }
    }
`;

export const UPDATE_CUSTOMER = gql`
    mutation updateCustomer($openid: String!,$username:String,$telephone:String,$grade:Int,$class:Int,$area_name:String,$school_name:String) {
        customer:update_customer(openid: $openid,username:$username,telephone:$telephone,grade:$grade,class:$class,area_name:$area_name,school_name:$school_name) {
            openid
            username
            telephone
            grade
            class
            area {
                city
                district
                province
            }
            school{
                name
                type
            }
        }
    }
`;