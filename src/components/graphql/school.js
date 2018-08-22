import gql from "graphql-tag";

export const GET_SCHOOL_BY_PROPS = gql`
    query getSchool($area_name: String) {
        school:school_by_props(area_name:$area_name){
            name
            type
        }
    }
`;

