import { ApolloError } from "@apollo/client";
import React from "react";

const formatError = (error: ApolloError): React.ReactNode => {
    return error?.graphQLErrors.flatMap(({ extensions, message }, index) => {
        switch (extensions?.category) {
            case "validation":
                if (typeof extensions.validation === "object") {
                    return (
                        <>
                            {Object.values(extensions?.validation).flatMap(
                                (message, ind) => (
                                    <div key={ind}>
                                        {String(message).replace(
                                            /input.(\w+)/,
                                            "$1"
                                        )}
                                    </div>
                                )
                            )}
                        </>
                    );
                }

                if (typeof extensions.errors === "object") {
                    return (
                        <>
                            {Object.values(extensions.errors).flatMap(
                                (message: any, ind) => (
                                    <div key={ind}>{message}</div>
                                )
                            )}
                        </>
                    );
                }

                break;
            default:
                if (extensions?.reason) {
                    return <div key={index}>{extensions.reason}</div>;
                }
        }

        return message;
    });
};

export default formatError;
