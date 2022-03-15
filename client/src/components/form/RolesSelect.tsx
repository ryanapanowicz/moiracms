import { Select, SelectProps } from "antd";
import React, { useState } from "react";
import { useRolesQuery } from "../../graphql";

const RolesSelect: React.FC<SelectProps<any>> = (props) => {
    const [options, setOptions] = useState([{ value: "" }]);

    // Get data for Role select field
    const { loading } = useRolesQuery({
        onCompleted: ({ roles }) => {
            const list = roles.data.map(({ name }) => ({ value: name }));
            setOptions(list);
        },
    });

    return (
        <Select
            {...props}
            mode="multiple"
            placeholder="Select Role"
            options={options}
            loading={loading}
            showArrow
        />
    );
};

export default RolesSelect;
