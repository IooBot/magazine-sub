import gql from "graphql-tag";

export const GET_CUSTOMER_BY_OPENID = gql`
    query getCustomer($openid: String!) {
        customer:customer_by_openid(openid: $openid) {
            openid,
            username
        }
    }
`;

export const UPDATE_CUSTOMER = gql`
    mutation updateCustomer($openid: String!,$username:String) {
        customer:update_customer(openid: $openid,username:$username) {
            openid,
            username
        }
    }
`;