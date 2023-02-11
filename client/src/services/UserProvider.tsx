import { useApolloClient } from "@apollo/client";
import { useAbility } from "@casl/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth, UserContext } from ".";
import { AuthLayout } from "../components";
import { useLogoutMutation, useMeLazyQuery } from "../graphql";
import { ServerError } from "../pages";
import { AbilityContext } from "./Can";
import updateAbility from "./updateAbility";

interface UserProviderProps {
    children?: React.ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const ability = useAbility(AbilityContext);
    const client = useApolloClient();
    const navigate = useNavigate();

    // Used to pause render until User info
    // is fetched and permissions are set
    const [ready, setReady] = useState(false);

    const [me, { data, error }] = useMeLazyQuery({
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
            navigate("/login");
        },
    });

    useEffect(() => {
        if (Auth.isAuthenticated()) {
            me();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) {
        return (
            <>
                {error && (
                    <AuthLayout>
                        <ServerError />
                    </AuthLayout>
                )}
            </>
        );
    }

    return (
        <UserContext.Provider value={{ user: data, query: me, logout: logout }}>
            {(!Auth.isAuthenticated() || ready) && children}
        </UserContext.Provider>
    );
};

export default UserProvider;
