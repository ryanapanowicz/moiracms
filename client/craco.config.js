const CracoLessPlugin = require("craco-less");

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            "@primary-color": "#373999",
                            "@layout-body-background": "transparent",
                            "@layout-header-background": "#ffffff",
                            "@layout-header-padding": "0 30px",
                            "@border-color-base": "#f0f0f0",
                            "@menu-item-active-bg": "transparent",
                            "@menu-item-vertical-margin": "0",
                            "@menu-item-boundary-margin": "0",
                            "@primary-1": "#e7e8f3",
                            "@avatar-size-lg": "36px",
                            "@font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
