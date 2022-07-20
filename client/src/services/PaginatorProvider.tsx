import React, { useMemo, useState } from "react";
import { PaginatorContext } from ".";
import { PagintatorInput } from "../graphql/types";

export interface PaginatorVariables {
    [key: string]: PagintatorInput;
}

interface PaginatorProviderProps {
    children?: React.ReactNode;
}

const PaginatorProvider: React.FC<PaginatorProviderProps> = ({ children }) => {
    const [state, setState] = useState<PaginatorVariables>({});

    const getVariables = (query: string) => {
        return query in state ? state[query] : {};
    };

    const setVariables = (query: string, values: any) => {
        return setState({ ...state, [query]: values });
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = useMemo(() => ({ getVariables, setVariables }), [state]);
    return (
        <PaginatorContext.Provider value={value}>
            {children}
        </PaginatorContext.Provider>
    );
};

export default PaginatorProvider;
