import { useAbility } from "@casl/react";
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Auth, UserContext } from ".";
import { ServerError } from "../pages";
import { AbilityContext } from "./Can";

export interface RequireAuthProps {
    can?: { action: string; subject: string; field?: string | undefined };
    children?: React.ReactNode;
    redirectTo: string;
}

const RequireAuth: React.FC<RequireAuthProps> = ({
    can,
    children,
    redirectTo,
}): React.ReactElement | null => {
    const { user } = useContext(UserContext);
    const ability = useAbility(AbilityContext);
    const location = useLocation();
    
    if (Auth.isAuthenticated()) {
        if (can && ability.cannot(can.action, can.subject, can.field)) {
            return <ServerError />;
        }

        return user ? <>{ children }</> : null;
    }

    return (
        <Navigate
            to={redirectTo}
            state={{
                referrer: location.pathname,
            }}
        />
    );
};

export default RequireAuth;
