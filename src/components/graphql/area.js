import gql from "graphql-tag";

export const GET_AREA = gql`
    {
        area:area_by_props {
        city
        district
        name
        province
    }
    }
`;