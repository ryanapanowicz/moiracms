import { useAbility } from "@casl/react";
import React, { useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { Auth, History, UserContext } from ".";
import { ServerError } from "../pages";
import { AbilityContext } from "./Can";

export interface ProtectedRouteProps extends Omit<RouteProps, "component"> {
    can?: { action: string; subject: string; field?: string | undefined };
    component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    can,
    component: Component,
    ...rest
}) => {
    const { user } = useContext(UserContext);
    const ability = useAbility(AbilityContext);

    const handleRender = (props: any) => {
        if (Auth.isAuthenticated()) {
            if (
                typeof can !== "undefined" &&
                ability.cannot(can.action, can.subject, can.field)
            ) {
                return <ServerError />;
            }

            return user && <Component {...props} />;
        }

        return (
            <Redirect
                to={{
                    pathname: "/login",
                    state: {
                        referrer: History.location.pathname,
                    },
                }}
            />
        );
    };

    return <Route {...rest} render={handleRender} />;
};

export default ProtectedRoute;
