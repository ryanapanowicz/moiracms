import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AssetModalProvider } from "./components";
import reportWebVitals from "./reportWebVitals";
import { PaginatorProvider, UserProvider } from "./services";
import ability from "./services/Ability";
import { AbilityContext } from "./services/Can";
import GraphQLProvider from "./services/GraphQLProvider";

ReactDOM.render(
    <GraphQLProvider>
        <AbilityContext.Provider value={ability}>
            <UserProvider>
                <PaginatorProvider>
                    <AssetModalProvider>
                        <App />
                    </AssetModalProvider>
                </PaginatorProvider>
            </UserProvider>
        </AbilityContext.Provider>
    </GraphQLProvider>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
