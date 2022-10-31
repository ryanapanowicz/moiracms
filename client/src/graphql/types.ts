export enum SortOrder {
    ASC = "ASC",
    DESC = "DESC",
}

export type OrderByClause = {
    column: string;
    order: SortOrder;
};

export type Pagintator = {
    __typename?: "PaginatorInfo";
    count: number;
    currentPage: number;
    firstItem: number;
    hasMorePages: boolean;
    lastItem?: number;
    lastPage: number;
    perPage: number;
    total: number;
};

export type PagintatorInput = {
    order_by?: [OrderByClause];
    first?: number;
    page?: number;
};

export type User = {
    __typename?: "User";
    id: string;
    name: string;
    email: string;
    avatar: string;
    roles?: [Role];
};

export type Project = {
    __typename?: "Project";
    id: string;
    title: string;
    subtitle: string;
    slug: string;
    content: string;
    link: string;
    work_done: string;
    built_with: [string];
    keywords: [string];
    description: string;
    start: string;
    end: string;
    assets: [Media];
    user: User;
    created_at: string;
    updated_at: string;
};

export type Role = {
    __typename?: "Role";
    id: string;
    name: string;
    permissions: [Permission];
    users: [Omit<User, "roles">];
};

export type Permission = {
    __typename?: "Permission";
    id: string;
    name: string;
    roles: [Omit<Role, "permissions" | "users">];
};

export type MediaMorph = User | Project;

export type Media = {
    __typename?: "Media";
    id: string;
    name: string;
    file_name: string;
    url: string;
    preview: string;
    responsive_images: [ResposiveImage];
    type: string;
    extension: string;
    mime_type: string;
    size: number;
    alternative_text: string;
    caption: string;
    created_at: string;
    updated_at: string;
    related: MediaMorph;
};

export type AssetInfoInput = {
    name?: string;
    alternative_text?: string;
    caption?: string;
};

export type ResposiveImage = {
    urls: [string];
    base64svg: string;
};
