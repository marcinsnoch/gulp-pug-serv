const Plugins = [
    // Bootstrap
    {
        from: "node_modules/bootstrap/dist",
        to: "dist/plugins/bootstrap"
    },
    // jQuery
    {
        from: "node_modules/jquery/dist",
        to: "dist/plugins/jquery"
    },
    // Popper
    {
        from: "node_modules/popper.js/dist",
        to: "dist/plugins/popper.js"
    },
    // Fontawesome
    {
        from: "node_modules/font-awesome/css",
        to: "dist/plugins/font-awesome/css"
    },
    {
        from: "node_modules/font-awesome/fonts",
        to: "dist/plugins/font-awesome/fonts"
    }
];
module.exports = Plugins;