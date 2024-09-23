var glsl = require('esbuild-plugin-glsl').glsl;
var environmentPlugin = require('esbuild-plugin-environment').environmentPlugin;

module.exports = {
    entryPoints: ['./main.js'],
    outfile: 'index.js',
    format: 'cjs',
    bundle: true,
    minify: false,
    sourcemap: false,
    plugins: [
        glsl({
            minify: true,
        }),
        environmentPlugin({
            NODE_DEBUG: false,
        }),
    ],
    alias: {
        stream: 'stream-browserify',
    },
    define: {
        global: 'window',
    },
    target: 'es2016',
    logLevel: 'info',
};
