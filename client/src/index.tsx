import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AssetModalProvider } from "./components";
import reportWebVitals from "./reportWebVitals";
import { AntdProvider, PaginatorProvider, UserProvider } from "./services";
import ability from "./services/Ability";
import { AbilityContext } from "./services/Can";
import GraphQLProvider from "./services/GraphQLProvider";

const container = document.getElementById("root");

if (container === null) throw new Error("Root container missing in index.html");

const root = createRoot(container);

root.render(
    <BrowserRouter>
        <GraphQLProvider>
            <AbilityContext.Provider value={ability}>
                <AntdProvider>
                    <UserProvider>
                        <PaginatorProvider>
                            <AssetModalProvider>
                                <App />
                            </AssetModalProvider>
                        </PaginatorProvider>
                    </UserProvider>
                </AntdProvider>
            </AbilityContext.Provider>
        </GraphQLProvider>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
