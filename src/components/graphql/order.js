import gql from "graphql-tag";


export const GET_ORDER_BY_PROPS = gql`
    query getCustomerOrder($openid: String $orderStatus: String) {
        orderList:order_by_props(openid: $openid,orderStatus:$orderStatus) {
            id
            createAt
            magazine {
                magazineName:name
                unitPrice
            }
            subCount
            subMonthCount
            subYear
            subMonth
            havePay
            orderStatus
        }
    }
`;

export const CREATE_ORDER = gql`
    mutation createOrder($id:String!,$magazine_id:String,$openid:String,$subCount:Int,$subMonthCount:Int,
    $havePay:Float,$subYear:String,$subMonth:[Int],$createAt:String,$orderStatus:String){
        createOrder:create_order (
            id:$id
            magazine_id : $magazine_id
            openid :$openid
            subCount : $subCount
            subMonthCount : $subMonthCount
            havePay: $havePay
            subYear : $subYear
            subMonth: $subMonth
            createAt: $createAt
            orderStatus: $orderStatus){
            id
            createAt
            magazine {
                magazineName:name
                unitPrice
            }
            subCount
            subMonthCount
            subYear
            subMonth
            havePay
            orderStatus
        }
    }
`;

export const UPDATE_ORDER = gql`
    mutation updateOrder($id:String!,$openid:String,$orderStatus:String){
        updateOrder:update_order (
            id:$id
            openid :$openid
            orderStatus: $orderStatus){
            id
            createAt
            magazine {
                magazineName:name
                unitPrice
            }
            subCount
            subMonthCount
            subYear
            subMonth
            havePay
            orderStatus
        }
    }
`;

export const DELETE_ORDER = gql`
    mutation deleteOrder($id: String) {
        delete_order(id: $id)
    }
`;

