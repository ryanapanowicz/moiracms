import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components";
import {
    Assets,
    Content,
    ForgotPassword,
    Login,
    Profile,
    Register,
    ResetPassword, ServerError, Settings
} from "./pages";
import { Auth, RequireAuth } from "./services";
import "./styles/App.less";

const App: React.FC = () => {
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login />} />
                {/* Uncomment if Registration is required  */}
                <Route path="/register" element={<Register />} /> 
                <Route path="/password/forgot" element={<ForgotPassword />} />
                <Route
                    path="/password/reset/:token"
                    element={<ResetPassword />}
                />
                <Route
                    key="/content"
                    path="/content/*"
                    element={
                        <RequireAuth redirectTo="/login">
                            <Content />
                        </RequireAuth>
                    }
                />
                <Route
                    key="/assets"
                    path="/assets/*"
                    element={
                        <RequireAuth redirectTo="/login">
                            <Assets />
                        </RequireAuth>
                    }
                />
                <Route
                    key="/settings"
                    path="/settings/*"
                    element={
                        <RequireAuth redirectTo="/login">
                            <Settings />
                        </RequireAuth>
                    }
                />
                <Route
                    key="/profile"
                    path="/profile"
                    element={
                        <RequireAuth redirectTo="/login">
                            <Profile />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/"
                    element={<Navigate replace to="/content/projects" />}
                />
                <Route
                    path="*"
                    element={
                        Auth.isAuthenticated() ? (
                            <AdminLayout>
                                <ServerError />
                            </AdminLayout>
                        ) : (
                            <Navigate replace to="/login" />
                        )
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
