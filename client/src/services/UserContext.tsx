import { createContext } from "react";
import type { MeType } from "../graphql/queries/useMeQuery";

export interface UserContextType {
    user: MeType | undefined;
    query: () => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType>({
    user: undefined,
    query: () => {},
    logout: () => {},
});

export default UserContext;
