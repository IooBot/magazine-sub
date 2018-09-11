import gql from "graphql-tag";

export const GET_MAIN_PAGE = gql`
    query getMain($openid: String){
        slideshow:slideshow_by_props{
            picture
        }
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