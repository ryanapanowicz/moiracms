import {
    ApolloClient,
    FetchResult,
    gql,
    NormalizedCacheObject,
} from "@apollo/client";

type RefreshTokenType = {
    __typename?: "Mutation";
    refreshToken: {
        __typename?: "RefreshTokenPayload";
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
    };
};

type RefreshTokenInput = {
    refreshToken: string;
};

type RefreshTokenResult = FetchResult<RefreshTokenType, Record<string, any>>;

const RefreshTokenMutation = gql`
    mutation RefreshToken($refreshToken: String!) {
        refreshToken(input: { refresh_token: $refreshToken }) {
            access_token
            refresh_token
            expires_in
            token_type
        }
    }
`;

export default async function refreshToken(
    token: string,
    client: ApolloClient<NormalizedCacheObject>
): Promise<RefreshTokenResult> {
    return client.mutate<RefreshTokenType, RefreshTokenInput>({
        mutation: RefreshTokenMutation,
        variables: { refreshToken: token },
        fetchPolicy: "network-only",
    });
}
