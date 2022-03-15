const getInitials = (str: string, count = 2): string | undefined => {
    var initials = str.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);

    return initials?.slice(0, count).join("").toUpperCase();
};

export default getInitials;
