import { Ability } from "@casl/ability";
import { createContextualCan } from "@casl/react";
import { createContext } from "react";

export const AbilityContext = createContext<Ability>(undefined!);

export default createContextualCan(AbilityContext.Consumer);
