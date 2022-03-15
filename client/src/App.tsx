import React from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { AdminLayout } from "./components";
import {
    Assets,
    Content,
    ForgotPassword,
    Login,
    Profile,
    ResetPassword,
    ServerError,
    Settings,
} from "./pages";
import { Auth, History, ProtectedRoute } from "./services";
import "./styles/App.less";

const App: React.FC = () => {
    return (
        <Router history={History}>
            <div className="App">
                <Switch>
                    <Route
                        exact
                        path="/:url*(/+)"
                        strict
                        render={({ location }) => (
                            <Redirect
                                to={{
                                    ...location,
                                    pathname: location.pathname.replace(
                                        /\/+$/,
                                        ""
                                    ),
                                }}
                            />
                        )}
                    />
                    <Route path="/login" component={Login} />
                    {/* Uncomment if Registration is required 
                    <Route path="/register" component={Register} /> 
                    */}
                    <Route path="/password/forgot" component={ForgotPassword} />
                    <Route
                        path="/password/reset/:token"
                        component={ResetPassword}
                    />
                    <ProtectedRoute
                        key="/content"
                        path="/content"
                        component={Content}
                    />
                    <ProtectedRoute
                        key="/assets"
                        path="/assets/:uid?"
                        component={Assets}
                    />
                    <ProtectedRoute
                        key="/settings"
                        path="/settings"
                        component={Settings}
                    />
                    <ProtectedRoute
                        key="/profile"
                        path="/profile"
                        component={Profile}
                    />
                    <Route
                        exact
                        path="/"
                        strict
                        render={() => <Redirect to="/content/projects" />}
                    />
                    <Route
                        path="*"
                        render={() =>
                            Auth.isAuthenticated() ? (
                                <AdminLayout>
                                    <ServerError />
                                </AdminLayout>
                            ) : (
                                <Redirect to="/login" />
                            )
                        }
                    />
                </Switch>
            </div>
        </Router>
    );
};

export default App;
