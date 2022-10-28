import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

export interface SortableItemProps {
    id: string | number;
    children?: React.ReactNode;
    hasHandle?: boolean;
}

export interface SortableHandleProps {
    id: string | number;
    children?: React.ReactNode;
}

export const SortableHandle: React.FC<SortableHandleProps> = ({
    id,
    children,
}) => {
    const { attributes, listeners } = useSortable({ id: id });

    return (
        <div {...attributes} {...listeners}>
            {children}
        </div>
    );
};

const SortableItem: React.FC<SortableItemProps> = ({
    id,
    children,
    hasHandle = false,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const sortableAttributes = hasHandle ? {} : attributes;
    const sortableListeners = hasHandle ? {} : listeners;

    return (
        <div
            ref={setNodeRef}
            className={isDragging ? "draggable is-dragging" : "draggable"}
            style={style}
            {...sortableAttributes}
            {...sortableListeners}
        >
            {children}
        </div>
    );
};

export default SortableItem;
