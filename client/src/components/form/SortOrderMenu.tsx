import { Dropdown, MenuProps } from "antd";
import React from "react";
import { OrderByClause, SortOrder } from "../../graphql/types";

export type sortOrderType = {
    key: string;
    label: string;
    order: OrderByClause;
};

export const sortOrderData: sortOrderType[] = [
    {
        key: "newest_uploads",
        label: "Most recent uploads",
        order: { column: "created_at", order: SortOrder.DESC },
    },
    {
        key: "oldest_uploads",
        label: "Oldest uploads",
        order: { column: "created_at", order: SortOrder.ASC },
    },
    {
        key: "alphabetical",
        label: "Alphabetical order (A to Z)",
        order: { column: "name", order: SortOrder.ASC },
    },
    {
        key: "reverse_alphabetical",
        label: "Reverse alphabetical order (Z to A)",
        order: { column: "name", order: SortOrder.DESC },
    },
    {
        key: "newest_updates",
        label: "Most recent updates",
        order: { column: "updated_at", order: SortOrder.DESC },
    },
    {
        key: "oldest_updates",
        label: "Oldest updates",
        order: { column: "updated_at", order: SortOrder.ASC },
    },
];

export type SortOrderMenuProps = Pick<
    MenuProps,
    "onSelect" | "defaultSelectedKeys" | "children"
>;

const SortOrderMenu: React.FC<SortOrderMenuProps> = ({
    children,
    onSelect,
    defaultSelectedKeys,
}) => {
    const items = sortOrderData.map(({ key, label }) => ({ key, label }));

    return (
        <Dropdown
            menu={{
                items: items,
                selectable: true,
                onSelect: onSelect,
                defaultSelectedKeys: defaultSelectedKeys,
            }}
            trigger={["click"]}
        >
            {children}
        </Dropdown>
    );
};

export default SortOrderMenu;
