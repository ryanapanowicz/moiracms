import { InMemoryCache, InMemoryCacheConfig } from "@apollo/client";

const CacheConfig: InMemoryCacheConfig = {
    typePolicies: {
        User: {
            fields: {
                roles: {
                    merge(existing = [], incoming: any[]) {
                        return incoming;
                    },
                },
            },
        },
        Role: {
            fields: {
                name: {
                    read(name) {
                        // capitalize role name
                        return name.charAt(0).toUpperCase() + name.slice(1);
                    },
                },
                permissions: {
                    merge(existing = [], incoming: any[]) {
                        return incoming;
                    },
                },
            },
        },
    },
};

const Cache = new InMemoryCache(CacheConfig);

export default Cache;
