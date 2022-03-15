import { createBrowserHistory } from "history";

type HistoryStateType = {
    referrer?: string;
    message?: string
};

export default createBrowserHistory<HistoryStateType>();
