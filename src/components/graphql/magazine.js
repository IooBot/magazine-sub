import gql from "graphql-tag";

export const GET_MAGAZINE = gql`
    query getMagazine($openid: String) {
        magazineList:magazine_by_props {
            id
            magazineName:name,
            picture,
            magazineIntro,
            unitPrice
            enableSub
    }
        user:customer_by_openid(openid: $openid) {
            openid
            username
    }
    }
`;
