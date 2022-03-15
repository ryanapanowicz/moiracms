import { gql, QueryHookOptions, useQuery, useLazyQuery } from "@apollo/client";
import { Role } from "../types";

export type MeType = {
    me: {
        __typename?: "AuthUser";
        id: string;
        name: string;
        email: string;
        avatar: string;
        roles?: [Role];
    };
};

export const MeQuery = gql`
    query me {
        me {
            id
            name
            email
            avatar
            roles {
                id
                name
                permissions {
                    id
                    name
                }
            }
        }
    }
`;

const useMeQuery = (options?: QueryHookOptions<MeType>) => {
    return useQuery<MeType>(MeQuery, options);
};

export const useMeLazyQuery = (options?: QueryHookOptions<MeType>) => {
    return useLazyQuery<MeType>(MeQuery, options);
};

export default useMeQuery;
