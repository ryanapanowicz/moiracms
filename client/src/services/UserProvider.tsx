import { useApolloClient } from "@apollo/client";
import { useAbility } from "@casl/react";
import React, { useEffect, useState } from "react";
import { Auth, History, UserContext } from ".";
import { useLogoutMutation, useMeLazyQuery } from "../graphql";
import { AbilityContext } from "./Can";
import updateAbility from "./updateAbility";

const UserProvider: React.FC = ({ children }) => {
    const ability = useAbility(AbilityContext);
    const client = useApolloClient();

    // Used to pause render until User info
    // is fetched and permissions are set
    const [ready, setReady] = useState(false);

    const [me, { data }] = useMeLazyQuery({
        onCompleted: ({ me }) => {
            updateAbility(ability, me.roles);
            setReady(true);
        },
    });

    const [logout] = useLogoutMutation({
        onCompleted: async () => {
            Auth.deleteToken();
            await client.clearStore();
            setReady(false);
            History.push("/login");
        },
    });

    useEffect(() => {
        if (Auth.isAuthenticated()) {
            me();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <UserContext.Provider value={{ user: data, query: me, logout: logout }}>
            {(!Auth.isAuthenticated() || ready) && children}
        </UserContext.Provider>
    );
};

export default UserProvider;
