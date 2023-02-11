const sassResourcesLoader = require("craco-sass-loader");

module.exports = {
    plugins: [
        {
            plugin: sassResourcesLoader,
            options: {
                resources: "./src/styles/App.scss",
            },
        },
    ],
};
