import gql from "graphql-tag";

export const GET_CUSTOMER_BY_OPENID = gql`
    query getCustomer($openid: String) {
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

export const CREATE_CUSTOMER = gql`
    mutation createCustomer($area_name: String!,$class: Int!,$grade: Int!,$isAdmin: Boolean,$openid: String!,$school_name: String!,
    $telephone: String,$username: String) {
        customer:create_customer(area_name:$area_name,class:$class,grade:$grade,isAdmin: $isAdmin,openid: $openid,school_name: $school_name,
            telephone: $telephone,username:$username) {
            openid,
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