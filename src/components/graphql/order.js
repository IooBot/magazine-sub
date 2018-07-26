import gql from "graphql-tag";

export const CREATE_ORDER = gql`
    mutation createOrder($id:Int!,$magazine_id: String!,$openid:String!,$subCount:Int!,$subMonthCount:Int,
    $havePay:Float,$startDate:String,$endDate:String,$createAt:String,$orderStatus:String){
        createOrder:create_order (
        id:$id
        magazine_id : $magazine_id
        openid :$openid
        subCount : $subCount
        subMonthCount : $subMonthCount
        havePay: $havePay
        startDate : $startDate
        endDate: $endDate
        createAt: $createAt
        orderStatus: $orderStatus){
        id
        }
    }
`;

export const GET_ORDER_BY_PROPS = gql`
    query getCustomerOrder($openid: String $orderStatus: String!) {
        orderList:order_by_props(openid: $openid,orderStatus:$orderStatus) {
            id
            customer{
                openid
            }
            createAt
            magazine {
                magazineName:name
                unitPrice
            }
            subCount
            subMonthCount
            startDate
            endDate
            havePay
            orderStatus
        }
    }
`;

export const DELETE_ORDER = gql`
    mutation deleteOrder($id: Int!) {
        delete_order(id: $id)
    }
`;