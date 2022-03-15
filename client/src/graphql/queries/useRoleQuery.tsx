import { gql, QueryHookOptions, useLazyQuery, useQuery } from "@apollo/client";
import type { Role } from "../types";

export type RoleType = {
    role: Role;
};

export type RoleInput = {
    id: string;
};

export const RoleQuery = gql`
    query role($id: ID) {
        role(id: $id) {
            id
            name
            permissions {
                id
                name
            }
        }
    }
`;

const useRoleQuery = (options?: QueryHookOptions<RoleType, RoleInput>) => {
    return useQuery<RoleType, RoleInput>(RoleQuery, options);
};

export const useRoleLazyQuery = (
    options?: QueryHookOptions<RoleType, RoleInput>
) => {
    return useLazyQuery<RoleType, RoleInput>(RoleQuery, options);
};

export default useRoleQuery;
