const titleCase = (str: string) => {
    return str.replace(
        /\w\S*/g,
        (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1)
    );
};

export default titleCase;
