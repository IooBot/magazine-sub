import gql from "graphql-tag";

export const GET_SLIDER_SHOW = gql`
    {
        slideshow:slideshow_by_props{
            briefIntro
            id
            picture
        }
    }
`;