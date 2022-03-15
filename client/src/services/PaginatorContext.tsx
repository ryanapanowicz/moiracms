import { createContext } from "react";

export interface PaginatorContextType {
    getVariables: (query: string) => any;
    setVariables: (query: string, values: any) => void;
}

const PaginatorContext = createContext<PaginatorContextType>({
    getVariables: (query) => ({}),
    setVariables: (query, values) => {},
});

export default PaginatorContext;
