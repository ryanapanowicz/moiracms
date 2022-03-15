import {
    ApolloClient,
    ApolloProvider,
    from,
    fromPromise,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ErrorResponse, onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";
import React from "react";
import { Auth, Cache, History, refreshToken } from ".";

const httpLink = createUploadLink({
    uri: process.env.GRAPHQL_URI || "http://localhost:8000/graphql",
});

const authLink = setContext((_, { Headers }) => {
    const token = Auth.getToken()?.accessToken;
    return {
        headers: {
            ...Headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

const errorLink = onError(
    ({
        graphQLErrors,
        networkError,
        operation,
        forward,
    }: ErrorResponse): any => {
        if (graphQLErrors) {
            for (let { message } of graphQLErrors) {
                switch (message) {
                    case "Unauthenticated.":
                        const oldHeaders = operation.getContext().headers;
                        const token = Auth.getToken();

                        // If not logged in, first check if the Token is expired.
                        // If expired refresh the token or redirect to login.
                        return fromPromise(
                            refreshToken(token?.refreshToken, client).then(
                                ({ data, errors }) => {
                                    if (errors) {
                                        Auth.deleteToken();
                                        History.push("/login", {
                                            referrer:
                                                History.location.state
                                                    ?.referrer,
                                        });
                                    } else {
                                        Auth.setToken({
                                            accessToken:
                                                data?.refreshToken.access_token,
                                            refreshToken:
                                                data?.refreshToken
                                                    .refresh_token,
                                            expiresIn:
                                                data?.refreshToken.expires_in,
                                        });

                                        operation.setContext({
                                            headers: {
                                                ...oldHeaders,
                                                authorization: `Bearer ${data?.refreshToken.access_token}`,
                                            },
                                        });
                                    }
                                }
                            )
                        ).flatMap(() => {
                            return forward(operation);
                        });
                }
            }
        }

        if (networkError) console.log(`[Network error]: ${networkError}`);
    }
);

const client = new ApolloClient({
    link: from([authLink, errorLink, httpLink]),
    cache: Cache,
    defaultOptions: {
        mutate: { errorPolicy: "all" },
        watchQuery: { fetchPolicy: "network-only" },
        query: { fetchPolicy: "network-only" },
    },
});

const GraphQLProvider: React.FC = ({ children }) => {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GraphQLProvider;
