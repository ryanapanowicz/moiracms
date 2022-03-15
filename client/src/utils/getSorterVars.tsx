export const hasDefProp = (prop: string, obj: any): boolean => {
    return prop in obj && obj[prop] !== undefined;
};

const sortOrder: { [key: string]: string } = {
    ascend: "ASC",
    descend: "DESC",
};

const getSorterVars = (sorter: any) => {
    if (hasDefProp("order", sorter) && hasDefProp("field", sorter)) {
        const { order, field } = sorter;
        return { order_by: [{ column: field, order: sortOrder[order] }] };
    }

    return {};
};

export default getSorterVars;
