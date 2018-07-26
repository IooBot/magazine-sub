import gql from "graphql-tag";

export const GET_MAGAZINE = gql`
    {
        magazineList:magazine_by_props {
        id
        magazineName:name,
        picture,
        magazineIntro,
        unitPrice
    }
    }
`;
