import { gql, QueryHookOptions, useLazyQuery, useQuery } from "@apollo/client";
import type { Permission } from "../types";

export type PermissionType = {
    permission: Permission;
};

export type PermissionInput = {
    id: string;
};

export const PermissionQuery = gql`
    query permission($id: ID) {
        permission(id: $id) {
            id
            name
            roles {
                id
                name
            }
        }
    }
`;

const usePermissionQuery = (options?: QueryHookOptions<PermissionType, PermissionInput>) => {
    return useQuery<PermissionType, PermissionInput>(PermissionQuery, options);
};

export const usePermissionLazyQuery = (
    options?: QueryHookOptions<PermissionType, PermissionInput>
) => {
    return useLazyQuery<PermissionType, PermissionInput>(PermissionQuery, options);
};

export default usePermissionQuery;
